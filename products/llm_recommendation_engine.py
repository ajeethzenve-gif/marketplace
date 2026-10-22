"""
Zenve LLM-Powered Recommendation Engine
========================================
Uses OpenAI GPT (gpt-4o-mini) to generate precise, context-aware
product recommendations based on the full richness of a pet profile.

Architecture:
- Builds a compact product catalog from the DB (name, type, description)
- Sends pet profile + catalog to GPT with a structured JSON output prompt
- GPT ranks products and generates natural-language explanations per pet's
  specific breed, age, weight, health notes, and species
- Results are enriched with full product ORM objects and merged back
- Falls back gracefully to ExplainableRecommendationEngine on any LLM error

Usage:
    from products.llm_recommendation_engine import LLMRecommendationEngine
    scored_items = LLMRecommendationEngine.get_pet_recommendations(pet, customer, limit=16)
    # Returns same schema as ExplainableRecommendationEngine.get_pet_recommendations()
"""

import json
import logging
import os
from django.db.models import Avg, Q

from products.models import Product
from accounts.models import PetProfile, Customer

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# OpenAI client factory (lazy, singleton per process)
# ---------------------------------------------------------------------------

_openai_client = None


def _get_openai_client():
    global _openai_client
    if _openai_client is not None:
        return _openai_client
    try:
        from openai import OpenAI
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            logger.warning("OPENAI_API_KEY not set in environment")
            return None
        _openai_client = OpenAI(api_key=api_key)
        return _openai_client
    except Exception as exc:
        logger.warning("OpenAI client init failed: %s", exc)
        return None


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

_MATCH_COLOR_MAP = {
    "Optimal Match": "#10b981",
    "Strong Fit": "#3b82f6",
    "Recommended Care": "#8b5cf6",
    "General Wellness": "#f59e0b",
}


def _build_product_catalog(products) -> list:
    """Serialise a queryset into a compact catalog for the LLM prompt."""
    catalog = []
    for p in products:
        desc_snip = (p.description or "")[:180].replace("\n", " ")
        entry = {
            "id": p.id,
            "name": p.product_name,
            "type": p.product_type,
            "pet_type": p.pet_type,
            "price": float(p.price),
            "description": desc_snip,
        }
        try:
            med = p.medicine
            entry["active_ingredient"] = med.active_ingredient[:80]
            entry["prescription_required"] = med.prescription_required
        except Exception:
            pass
        try:
            sup = p.supplement
            entry["ingredients"] = sup.ingredients[:100]
            entry["age_group"] = sup.age_group
            entry["weight_range"] = sup.weight_range
        except Exception:
            pass
        catalog.append(entry)
    return catalog


def _build_pet_context(pet) -> dict:
    return {
        "pet_name": pet.pet_name,
        "pet_type": pet.pet_type,
        "breed": pet.breed or "Unknown",
        "age": pet.age or "Unknown",
        "gender": getattr(pet, "gender", None) or "Unknown",
        "weight": pet.weight or "Unknown",
        "health_notes": pet.health_notes or "None",
    }


SYSTEM_PROMPT = (
    "You are Zenve's veterinary AI assistant specialising in personalised pet product recommendations. "
    "You have deep knowledge of pet nutrition, veterinary medicine, breed-specific health needs, "
    "and life-stage care requirements. Your job is to precisely match products to a pet's unique profile."
)


def _build_user_prompt(pet_ctx: dict, catalog: list) -> str:
    return (
        "## Pet Profile\n"
        + json.dumps(pet_ctx, ensure_ascii=False, indent=2)
        + "\n\n## Available Products Catalog\n"
        + json.dumps(catalog, ensure_ascii=False, indent=2)
        + "\n\n## Instructions\n"
        "Analyse the pet profile carefully - species, breed, age, weight, health conditions, gender. "
        "Select the BEST matching products from the catalog above.\n\n"
        "IMPORTANT: Return ONLY a valid JSON array. No markdown, no explanation outside the JSON.\n\n"
        "Each array element must have EXACTLY these fields:\n"
        '- "product_id": integer (the id from the catalog)\n'
        '- "match_score": integer 60-99 (precision match score)\n'
        '- "match_level": one of ["Optimal Match", "Strong Fit", "Recommended Care", "General Wellness"]\n'
        '- "primary_reason": string (one concise sentence explaining why this suits THIS specific pet)\n'
        '- "badges": array of {{"icon": emoji, "label": string, "type": string}}\n'
        '- "clinical_notes": string or null (dosage/safety note if applicable)\n'
        '- "why_choose": string (1-2 sentences of deeper vet-informed justification)\n\n'
        "Ranking rules (in order of priority):\n"
        "1. health_notes alignment - if pet has a condition, prioritise products that treat it\n"
        "2. Species compatibility - only recommend products for this pet_type\n"
        "3. Breed-specific needs (large breeds: joint/hip care; small breeds: dental/portioned food)\n"
        "4. Life-stage (puppy/kitten <1.5yr: growth/calcium; senior >=7yr: joint/digestive; adult: maintenance)\n"
        "5. Weight-appropriate dosing\n\n"
        "Return 8 to 16 products, sorted by match_score descending. "
        f"Only include products for species: {pet_ctx['pet_type']} "
        "(exception: VetEquipment type which is species-neutral). "
        "Be precise, vet-informed, and specific to this pet - NOT generic."
    )


def _parse_llm_response(content: str) -> list:
    """Extract and validate the JSON array from LLM response."""
    text = content.strip()
    # Strip markdown code fences
    if "```" in text:
        parts = text.split("```")
        for part in parts:
            part = part.lstrip("json").strip()
            if part.startswith("["):
                text = part
                break
    # Find JSON array boundaries
    start = text.find("[")
    end = text.rfind("]") + 1
    if start == -1 or end == 0:
        raise ValueError(f"No JSON array found in LLM response: {text[:200]}")
    text = text[start:end]
    data = json.loads(text)
    if not isinstance(data, list):
        raise ValueError("LLM did not return a JSON array")
    return data


def _build_recommendation_dict(llm_item: dict, avg_rev: float, rev_count: int) -> dict:
    """Convert an LLM result dict into the standard recommendation schema."""
    match_level = llm_item.get("match_level", "General Wellness")
    match_score = max(60, min(99, int(llm_item.get("match_score", 75))))
    badges = llm_item.get("badges") or []
    if not badges:
        badges = [{"icon": "AI", "label": "AI Recommended", "type": "llm"}]
    if avg_rev >= 4.5:
        badges.append({
            "icon": "star",
            "label": f"{avg_rev:.1f}* Pet-Parent Favorite",
            "type": "rating"
        })

    community_score = min(100, int((avg_rev / 5.0) * 85 + min(15, rev_count * 3)))

    return {
        "match_score": match_score,
        "match_level": match_level,
        "match_color": _MATCH_COLOR_MAP.get(match_level, "#f59e0b"),
        "primary_reason": llm_item.get("primary_reason", "Recommended for your pet"),
        "badges": badges,
        "factor_breakdown": [
            {
                "factor_id": "llm_holistic",
                "title": "AI Veterinary Analysis",
                "weight_percentage": 70,
                "score": match_score,
                "reason": llm_item.get("primary_reason", ""),
            },
            {
                "factor_id": "community",
                "title": "Community Trust & Ratings",
                "weight_percentage": 30,
                "score": community_score,
                "reason": f"Rated {avg_rev:.1f}/5 by verified pet owners",
            },
        ],
        "clinical_notes": llm_item.get("clinical_notes"),
        "why_choose": llm_item.get("why_choose", ""),
        "pet_context": {},
        "llm_powered": True,
        "engine": "openai-gpt4o-mini",
    }


# ---------------------------------------------------------------------------
# Main Engine
# ---------------------------------------------------------------------------

class LLMRecommendationEngine:

    @classmethod
    def get_pet_recommendations(cls, pet, customer=None, limit=16):
        """
        Returns list of {"product": <Product>, "recommendation": <dict>}
        identical schema to ExplainableRecommendationEngine.get_pet_recommendations().
        Falls back to rule-based engine on any error.
        """
        client = _get_openai_client()
        if client is None:
            logger.warning("LLM client unavailable - falling back to rule-based engine")
            return cls._fallback(pet, customer, limit)
        try:
            return cls._llm_recommend(client, pet, customer, limit)
        except Exception as exc:
            logger.error(
                "LLM recommendation failed for pet '%s' (%s): %s - falling back",
                pet.pet_name, pet.pet_type, exc, exc_info=True
            )
            return cls._fallback(pet, customer, limit)

    @classmethod
    def _llm_recommend(cls, client, pet, customer, limit):
        # 1. Exclude negatively-reviewed products
        negative_ids = set()
        if customer:
            from products.models import RecommendationFeedback
            negative_ids = set(
                RecommendationFeedback.objects.filter(
                    customer=customer, is_helpful=False
                ).values_list("product_id", flat=True)
            )

        # 2. Fetch candidate products for this pet species
        products = (
            Product.objects.filter(
                is_available=True,
                stock__gt=0,
                pet_type__iexact=pet.pet_type,
            )
            .exclude(id__in=negative_ids)
            .select_related("category", "brand")
            .prefetch_related("reviews")
        )

        # Widen to VetEquipment if thin catalog
        if products.count() < 4:
            products = (
                Product.objects.filter(is_available=True, stock__gt=0)
                .filter(
                    Q(pet_type__iexact=pet.pet_type) | Q(product_type="VetEquipment")
                )
                .exclude(id__in=negative_ids)
                .select_related("category", "brand")
                .prefetch_related("reviews")
            )

        products = list(products[:80])  # cap at 80 to control prompt size
        if not products:
            return []

        # 3. Build prompt artifacts
        catalog = _build_product_catalog(products)
        pet_ctx = _build_pet_context(pet)
        user_prompt = _build_user_prompt(pet_ctx, catalog)

        logger.info(
            "Calling OpenAI LLM for pet '%s' (%s) - catalog size %d",
            pet.pet_name, pet.pet_type, len(catalog),
        )

        # 4. Call OpenAI
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,   # Low temp for consistent, factual recommendations
            max_tokens=4096,
            response_format={"type": "json_object"},  # Force JSON mode
        )

        content = response.choices[0].message.content or ""

        # 5. Parse - handle both {"recommendations": [...]} and [...] shapes
        try:
            parsed = json.loads(content)
            if isinstance(parsed, dict):
                # GPT may wrap in a key; find the first list value
                llm_items = next(
                    (v for v in parsed.values() if isinstance(v, list)), []
                )
            else:
                llm_items = parsed
        except json.JSONDecodeError:
            llm_items = _parse_llm_response(content)

        if not isinstance(llm_items, list):
            raise ValueError(f"Unexpected LLM response structure: {content[:300]}")

        # 6. Build lookup: product_id -> Product ORM object
        product_map = {p.id: p for p in products}

        # 7. Assemble results
        from products.recommendation_engine import parse_pet_age
        _, life_stage = parse_pet_age(pet.age)

        pet_ctx_for_rec = {
            "pet_name": pet.pet_name,
            "pet_type": pet.pet_type,
            "breed": pet.breed,
            "age_display": pet.age,
            "life_stage": life_stage,
            "weight_display": pet.weight,
            "health_notes": pet.health_notes,
        }

        results = []
        seen_ids = set()
        for llm_item in llm_items:
            pid = llm_item.get("product_id")
            if pid in seen_ids or pid not in product_map:
                continue
            seen_ids.add(pid)

            product = product_map[pid]
            avg_rev = product.reviews.aggregate(Avg("rating"))["rating__avg"] or 4.5
            rev_count = product.reviews.count()

            rec = _build_recommendation_dict(llm_item, avg_rev, rev_count)
            rec["pet_context"] = pet_ctx_for_rec
            results.append({"product": product, "recommendation": rec})

        results.sort(key=lambda x: x["recommendation"]["match_score"], reverse=True)
        return results[:limit]

    @staticmethod
    def _fallback(pet, customer, limit):
        """Delegates to the original rule-based engine as a safety net."""
        from products.recommendation_engine import ExplainableRecommendationEngine
        return ExplainableRecommendationEngine.get_pet_recommendations(
            pet=pet, customer=customer, limit=limit
        )
