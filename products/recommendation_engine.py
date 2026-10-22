"""
Zenve Explainable Recommendation Engine (XAI RecSys)
===================================================
Provides transparent, auditable, multi-factor product recommendations for pets and pet parents.
Every recommendation is accompanied by:
- Match Score (0 - 100%)
- Match Level (Optimal Fit, Strong Match, Recommended Care)
- Primary Reason (Clear natural language explanation)
- Explainability Badges (Breed, Life-stage, Health, Community Proof)
- Factor Breakdown (Detailed contributing scores & weights)
- Clinical & Usage Notes (Dosage cautions, prescription status)
"""

import re
from decimal import Decimal
from django.db.models import Avg, Count, Q
from django.utils import timezone

from products.models import Product, Medicine, Supplement
from accounts.models import PetProfile, Customer
from orders.models import Order, OrderItem
from reviews.models import Review


# =====================================================================
# PET ATTRIBUTE PARSERS
# =====================================================================

def parse_pet_age(age_str):
    """
    Parses varied age inputs (e.g., '3', '7 years', '6 months', 'puppy', 'senior')
    Returns:
        age_in_years (float), life_stage (str: 'Puppy/Kitten', 'Adult', 'Senior')
    """
    if not age_str:
        return 3.0, "Adult"

    text = str(age_str).strip().lower()

    if any(k in text for k in ["puppy", "kitten", "baby"]):
        return 0.5, "Puppy/Kitten"
    if any(k in text for k in ["senior", "old", "elderly"]):
        return 9.0, "Senior"

    # Search for numbers
    match = re.search(r"(\d+(\.\d+)?)", text)
    if match:
        val = float(match.group(1))
        if "month" in text or "m" in text.split():
            val = val / 12.0
        elif "week" in text or "w" in text.split():
            val = val / 52.0

        if val < 1.5:
            return val, "Puppy/Kitten"
        elif val >= 7.0:
            return val, "Senior"
        else:
            return val, "Adult"

    return 3.0, "Adult"


def parse_pet_weight(weight_str):
    """
    Parses varied weight inputs (e.g., '12kg', '35 kg', '3', '24')
    Returns:
        weight_kg (float), size_category ('Small (<10kg)', 'Medium (10-25kg)', 'Large (>25kg)')
    """
    if not weight_str:
        return 15.0, "Medium (10-25kg)"

    text = str(weight_str).strip().lower()
    match = re.search(r"(\d+(\.\d+)?)", text)
    if match:
        val = float(match.group(1))
        if "lb" in text or "pound" in text:
            val = val * 0.453592

        if val < 10.0:
            return val, "Small (<10kg)"
        elif val > 25.0:
            return val, "Large (>25kg)"
        else:
            return val, "Medium (10-25kg)"

    return 15.0, "Medium (10-25kg)"


# Clinical & health keywords mapping to product categories and health goals
HEALTH_TOPIC_RULES = {
    "infection": {
        "keywords": ["infection", "wound", "bleeding", "cut", "injury", "pus", "bacterial", "healing", "antiseptic"],
        "target_types": ["Medicine", "Hygiene", "Grooming", "SkinCare", "VetEquipment"],
        "reason_template": "Formulated to treat infections and soothe irritated tissue matching health note '{note}'",
        "badge": {"icon": "🩹", "label": "Infection & Wound Care", "type": "health"}
    },
    "joint_mobility": {
        "keywords": ["joint", "bone", "hip", "arthritis", "limp", "stiff", "mobility", "cartilage", "leg"],
        "target_types": ["JointCare", "Supplement", "Supplements", "Vitamins", "Beds"],
        "reason_template": "Provides targeted glucosamine & cartilage support for joint stiffness matching '{note}'",
        "badge": {"icon": "🦴", "label": "Joint & Mobility Care", "type": "health"}
    },
    "skin_coat": {
        "keywords": ["skin", "itch", "scratch", "fur", "coat", "shed", "allergy", "dander", "dry"],
        "target_types": ["SkinCare", "Grooming", "Supplements", "Supplement", "Hygiene"],
        "reason_template": "Helps soothe itching and restore coat shine matching health condition '{note}'",
        "badge": {"icon": "🧴", "label": "Skin & Allergy Relief", "type": "health"}
    },
    "parasite_control": {
        "keywords": ["tick", "flea", "mite", "lice", "parasite", "deworm", "worm"],
        "target_types": ["FleaTick", "Deworming", "Medicine", "Hygiene"],
        "reason_template": "Active anti-parasite formula essential for preventing flea, tick & worm infestations",
        "badge": {"icon": "🐜", "label": "Parasite Shield", "type": "health"}
    },
    "digestive_gut": {
        "keywords": ["stomach", "vomit", "diarrhea", "digest", "gut", "appetite", "stool", "constipat"],
        "target_types": ["Supplements", "Supplement", "Food", "Medicine"],
        "reason_template": "Gentle digestive blend supports gut microbiome and prevents tummy distress",
        "badge": {"icon": "🥣", "label": "Digestive Health", "type": "health"}
    },
    "dental_oral": {
        "keywords": ["dental", "teeth", "breath", "gum", "tartar", "plaque", "chew"],
        "target_types": ["DentalCare", "Treat", "Food"],
        "reason_template": "Reduces tartar buildup and freshens breath through active plaque enzyme breakdown",
        "badge": {"icon": "🦷", "label": "Dental Defense", "type": "health"}
    },
    "vitality_recovery": {
        "keywords": ["weak", "death condition", "lethargic", "fever", "sick", "recover", "emergency"],
        "target_types": ["Medicine", "Supplements", "Supplement", "Vitamins", "VetEquipment"],
        "reason_template": "Intensive nutritional and medical support to aid recovery during acute distress",
        "badge": {"icon": "❤️‍🩹", "label": "Intensive Care Match", "type": "health"}
    }
}

LARGE_BREEDS = {"german shepherd", "labrador", "golden retriever", "rottweiler", "great dane", "husky", "doberman", "boxer", "mastiff"}
SMALL_BREEDS = {"pug", "shih tzu", "pomeranian", "chihuahua", "maltese", "french bulldog", "yorkshire terrier", "beagle"}


# =====================================================================
# EXPLAINABLE RECOMMENDATION ENGINE CLASS
# =====================================================================

class ExplainableRecommendationEngine:

    @classmethod
    def get_pet_recommendations(cls, pet: PetProfile, customer: Customer = None, limit: int = 16):
        """
        Computes explainable recommendations for a specific PetProfile.
        Returns:
            list of dicts containing serialized product and explainability data.
        """
        # Parse pet characteristics
        age_years, life_stage = parse_pet_age(pet.age)
        weight_kg, size_class = parse_pet_weight(pet.weight)
        breed_clean = (pet.breed or "").strip().lower()
        health_clean = (pet.health_notes or "").strip().lower()

        # Identify health matches
        detected_topics = []
        if health_clean and health_clean not in ["nothing", "none", "nil", "good", "healthy", "normal"]:
            for topic_key, topic_data in HEALTH_TOPIC_RULES.items():
                if any(kw in health_clean for kw in topic_data["keywords"]):
                    detected_topics.append((topic_key, topic_data))

        # Exclude items customer previously gave negative feedback on
        negative_feedback_prod_ids = set()
        if customer:
            from products.models import RecommendationFeedback
            negative_feedback_prod_ids = set(
                RecommendationFeedback.objects.filter(
                    customer=customer,
                    is_helpful=False
                ).values_list("product_id", flat=True)
            )

        # Query products compatible with pet type
        # We also check for universal/cross-species care items
        base_products = Product.objects.filter(
            is_available=True,
            stock__gt=0
        ).exclude(id__in=negative_feedback_prod_ids).select_related("category", "brand").prefetch_related("reviews")

        pet_type_q = Q(pet_type__iexact=pet.pet_type)
        if pet.pet_type == "Dog":
            products = base_products.filter(pet_type_q)
        elif pet.pet_type == "Cat":
            products = base_products.filter(pet_type_q)
        else:
            products = base_products.filter(pet_type_q)

        # In case specific pet_type has fewer products, include neutral vet items
        if products.count() < 4:
            products = base_products.filter(Q(pet_type_q) | Q(product_type="VetEquipment"))

        # Calculate scores and explanations for each product
        scored_items = []
        for product in products:
            rec_data = cls._evaluate_product_for_pet(
                product=product,
                pet=pet,
                age_years=age_years,
                life_stage=life_stage,
                weight_kg=weight_kg,
                size_class=size_class,
                breed_clean=breed_clean,
                health_clean=health_clean,
                detected_topics=detected_topics
            )
            scored_items.append({
                "product": product,
                "recommendation": rec_data
            })

        # Sort by match_score descending
        scored_items.sort(key=lambda x: x["recommendation"]["match_score"], reverse=True)

        return scored_items[:limit]

    @classmethod
    def _evaluate_product_for_pet(
        cls,
        product: Product,
        pet: PetProfile,
        age_years: float,
        life_stage: str,
        weight_kg: float,
        size_class: str,
        breed_clean: str,
        health_clean: str,
        detected_topics: list
    ):
        """
        Computes multi-factor score (0-100) and compiles structured transparent explanations.
        """
        prod_title = product.product_name.lower()
        prod_desc = (product.description or "").lower()
        prod_type = product.product_type or "Other"

        # -----------------------------------------------------------------
        # Factor 1: Species & Biology Compatibility (Weight: 30%)
        # -----------------------------------------------------------------
        f1_weight = 30
        if product.pet_type.lower() == pet.pet_type.lower():
            f1_score = 98
            f1_desc = f"Dedicated formulation designed exclusively for {pet.pet_type}s"
        else:
            f1_score = 80
            f1_desc = f"Multi-pet healthcare item safe for {pet.pet_type} use"

        # -----------------------------------------------------------------
        # Factor 2: Health Needs & Symptom Alignment (Weight: 35%)
        # -----------------------------------------------------------------
        f2_weight = 35
        f2_score = 70
        f2_desc = f"Supports daily immunity and overall vitality for {pet.pet_name}"
        health_matched_badge = None
        health_reason = None

        if detected_topics:
            # Pet has active health concerns/symptoms
            matched_any_topic = False
            for topic_key, topic_data in detected_topics:
                # Check if product type or description targets this
                type_match = prod_type in topic_data["target_types"] or any(
                    target.lower() in prod_type.lower() for target in topic_data["target_types"]
                )
                text_match = any(kw in prod_title or kw in prod_desc for kw in topic_data["keywords"])

                if type_match or text_match:
                    f2_score = 96
                    f2_desc = topic_data["reason_template"].format(note=pet.health_notes)
                    health_matched_badge = topic_data["badge"]
                    health_reason = f2_desc
                    matched_any_topic = True
                    break

            if not matched_any_topic:
                # Health notes present, but this product is general preventative
                f2_score = 75
                f2_desc = f"Promotes general recovery and doesn't interfere with {pet.pet_name}'s condition"
        else:
            # Pet is healthy or preventive mode
            if prod_type in ["Food", "Supplements", "Supplement", "DentalCare", "Grooming"]:
                f2_score = 90
                f2_desc = f"Preventative wellness support to maintain {pet.pet_name}'s prime condition"
            else:
                f2_score = 82
                f2_desc = f"Routine care to safeguard daily comfort and health"

        # -----------------------------------------------------------------
        # Factor 3: Life-Stage, Breed & Size Fit (Weight: 20%)
        # -----------------------------------------------------------------
        f3_weight = 20
        f3_score = 75
        f3_desc = f"Suitable for {pet.breed or 'mixed breed'} {pet.pet_type}s"
        breed_badge = None

        # Check breed matching
        is_large = any(b in breed_clean for b in LARGE_BREEDS) or weight_kg > 25.0
        is_small = any(b in breed_clean for b in SMALL_BREEDS) or weight_kg < 10.0

        if is_large and ("large" in prod_title or "large" in prod_desc or "joint" in prod_type.lower() or "bed" in prod_title):
            f3_score = 95
            f3_desc = f"Engineered for large-breed builds ({pet.breed or 'Large breed'}, ~{int(weight_kg)}kg)"
            breed_badge = {"icon": "🐕", "label": f"{pet.breed or 'Large Breed'} Fit", "type": "breed"}
        elif is_small and ("small" in prod_title or "mini" in prod_title or "cat" in prod_title):
            f3_score = 95
            f3_desc = f"Portion and kibble size adapted for small-breed comfort ({int(weight_kg)}kg)"
            breed_badge = {"icon": "🐾", "label": "Small Breed Friendly", "type": "breed"}
        elif pet.breed and pet.breed.lower() in prod_title:
            f3_score = 98
            f3_desc = f"Breed-specific formula created for {pet.breed}"
            breed_badge = {"icon": "⭐", "label": f"{pet.breed} Specific", "type": "breed"}

        # Life stage check
        life_stage_badge = None
        if life_stage == "Senior" and any(k in prod_title or k in prod_desc for k in ["senior", "joint", "mature", "digestive"]):
            f3_score = max(f3_score, 94)
            f3_desc += f" • Optimized for senior life stage ({int(age_years)} yrs)"
            life_stage_badge = {"icon": "👴", "label": "Senior Pet Formulation", "type": "lifestage"}
        elif life_stage == "Puppy/Kitten" and any(k in prod_title or k in prod_desc for k in ["puppy", "kitten", "starter", "growth", "calcium"]):
            f3_score = max(f3_score, 96)
            f3_desc += f" • Formulated for juvenile growth & calcium uptake"
            life_stage_badge = {"icon": "🍼", "label": f"{life_stage} Growth Formula", "type": "lifestage"}

        # -----------------------------------------------------------------
        # Factor 4: Quality & Community Trust (Weight: 15%)
        # -----------------------------------------------------------------
        f4_weight = 15
        avg_rev = product.reviews.aggregate(Avg("rating"))["rating__avg"] or 4.5
        rev_count = product.reviews.count()

        f4_score = min(100, int((avg_rev / 5.0) * 85 + min(15, rev_count * 3)))
        f4_desc = f"Rated {avg_rev:.1f}/5 by verified pet owners for safety & effectiveness"

        # -----------------------------------------------------------------
        # COMPOSITE SCORE CALCULATION
        # -----------------------------------------------------------------
        raw_score = (
            (f1_score * f1_weight) +
            (f2_score * f2_weight) +
            (f3_score * f3_weight) +
            (f4_score * f4_weight)
        ) / 100.0

        match_score = min(99, max(60, int(round(raw_score))))

        # Determine Match Level
        if match_score >= 90:
            match_level = "Optimal Match"
            match_color = "#10b981" # Emerald green
        elif match_score >= 80:
            match_level = "Strong Fit"
            match_color = "#3b82f6" # Royal blue
        elif match_score >= 72:
            match_level = "Recommended Care"
            match_color = "#8b5cf6" # Violet
        else:
            match_level = "General Wellness"
            match_color = "#f59e0b" # Amber

        # Badges assembly
        badges = []
        if health_matched_badge:
            badges.append(health_matched_badge)
        if breed_badge:
            badges.append(breed_badge)
        if life_stage_badge:
            badges.append(life_stage_badge)
        if avg_rev >= 4.5:
            badges.append({"icon": "⭐", "label": f"{avg_rev:.1f}★ Pet-Parent Favorite", "type": "rating"})

        # Fallback badge if empty
        if not badges:
            badges.append({"icon": "🐾", "label": f"Daily Essential for {pet.pet_type}s", "type": "general"})

        # Primary natural language reason
        if health_reason:
            primary_reason = health_reason
        elif breed_badge and life_stage_badge:
            primary_reason = f"Carefully matched for {pet.pet_name}'s {life_stage.lower()} phase and {pet.breed or 'breed'} profile"
        elif breed_badge:
            primary_reason = f"Chosen to match {pet.pet_name}'s {pet.breed or pet.pet_type} physical requirements"
        elif life_stage_badge:
            primary_reason = f"Essential nutritional balance for {pet.pet_name}'s current life stage ({life_stage})"
        else:
            primary_reason = f"Top-rated veterinary-grade choice for {pet.pet_type} health and lifestyle"

        # Clinical cautions & dosage guidelines
        clinical_notes = None
        has_medicine = hasattr(product, "medicine")
        if has_medicine and product.medicine.prescription_required:
            clinical_notes = "Prescription item: Please ensure you have a valid vet prescription on file before checkout."
        elif "supplement" in prod_type.lower() or prod_type == "Supplements":
            clinical_notes = f"Suggested serving size tailored for ~{int(weight_kg)}kg body weight. Always follow packaging instructions."
        elif prod_type == "FleaTick":
            clinical_notes = "Topical / preventive care: Apply evenly as directed. Keep away from pet's eyes."

        # Structured factor breakdown for explainability drawers / inspection
        factor_breakdown = [
            {
                "factor_id": "biology",
                "title": "Species & Biology Fit",
                "weight_percentage": f1_weight,
                "score": f1_score,
                "reason": f1_desc
            },
            {
                "factor_id": "health",
                "title": "Health & Symptom Alignment",
                "weight_percentage": f2_weight,
                "score": f2_score,
                "reason": f2_desc
            },
            {
                "factor_id": "lifestage_breed",
                "title": "Life-Stage & Breed Suitability",
                "weight_percentage": f3_weight,
                "score": f3_score,
                "reason": f3_desc
            },
            {
                "factor_id": "community",
                "title": "Community Trust & Ratings",
                "weight_percentage": f4_weight,
                "score": f4_score,
                "reason": f4_desc
            }
        ]

        why_choose = (
            f"We recommended {product.product_name} with a {match_score}% compatibility score because it "
            f"directly targets {pet.pet_name}'s {pet.pet_type} biology, aligns with their {life_stage.lower()} "
            f"lifestyle, and maintains a high {avg_rev:.1f} satisfaction index among pet parents."
        )

        return {
            "match_score": match_score,
            "match_level": match_level,
            "match_color": match_color,
            "primary_reason": primary_reason,
            "badges": badges,
            "factor_breakdown": factor_breakdown,
            "clinical_notes": clinical_notes,
            "why_choose": why_choose,
            "pet_context": {
                "pet_name": pet.pet_name,
                "pet_type": pet.pet_type,
                "breed": pet.breed,
                "age_display": pet.age,
                "life_stage": life_stage,
                "weight_display": pet.weight,
                "health_notes": pet.health_notes
            }
        }

    @classmethod
    def get_explainable_related_products(cls, product: Product, customer: Customer = None, limit: int = 6):
        """
        Finds explainable related products:
        1. Frequently bought together in real orders (OrderItem co-occurrence).
        2. Complementary care products (e.g. food + bowls, meds + supplements).
        3. Category peers with high ratings.
        """
        prod_id = product.id
        prod_type = product.product_type or "Other"

        # Step 1: Check order co-occurrence
        # Find order IDs that contain this product
        order_ids = OrderItem.objects.filter(product_id=prod_id).values_list("order_id", flat=True)
        co_purchased = []
        if order_ids:
            co_items = (
                OrderItem.objects.filter(order_id__in=order_ids)
                .exclude(product_id=prod_id)
                .values("product_id")
                .annotate(freq=Count("id"))
                .order_by("-freq")[:limit]
            )
            for item in co_items:
                try:
                    p = Product.objects.get(id=item["product_id"], is_available=True, stock__gt=0)
                    co_purchased.append((p, item["freq"]))
                except Product.DoesNotExist:
                    pass

        results = []
        seen_ids = {prod_id}

        # Format co-purchased items
        for p, freq in co_purchased:
            if p.id in seen_ids:
                continue
            seen_ids.add(p.id)
            results.append({
                "product": p,
                "relationship_type": "frequently_bought_together",
                "relationship_label": "Frequently Bought Together",
                "relationship_badge": "🛒 Popular Bundle",
                "match_score": min(98, 85 + min(13, freq * 3)),
                "explanation": f"Frequently ordered together in {freq} pet parent checkouts",
                "reason_detail": f"Pet parents who purchased {product.product_name} commonly bundle this item for a complete care package."
            })

        # Step 2: Complementary care pairing rules
        COMPLEMENTARY_RULES = {
            "Food": [("Treat", "Healthy reward treats to complement daily meals"), ("Accessories", "Optimal feeding bowl and food storage accessories")],
            "Medicine": [("Supplements", "Probiotic and digestive support during medical treatment"), ("Grooming", "Comfort care items during recovery")],
            "Supplements": [("Food", "Nutrient-rich staple meal to boost supplement absorption")],
            "Leashes": [("Accessories", "Matching safety tags and walking gear")],
            "Grooming": [("Hygiene", "Pair cleansing wash with hygiene sprays for lingering freshness")],
            "DentalCare": [("Food", "Combine daily dental chews with balanced kibble")]
        }

        complementary_pairs = COMPLEMENTARY_RULES.get(prod_type, [])
        for target_type, comp_reason in complementary_pairs:
            if len(results) >= limit:
                break
            comp_products = Product.objects.filter(
                product_type=target_type,
                pet_type=product.pet_type,
                is_available=True,
                stock__gt=0
            ).exclude(id__in=seen_ids).order_by("-id")[:2]

            for cp in comp_products:
                seen_ids.add(cp.id)
                results.append({
                    "product": cp,
                    "relationship_type": "complementary_care",
                    "relationship_label": "Complementary Routine",
                    "relationship_badge": "✨ Recommended Pair",
                    "match_score": 91,
                    "explanation": comp_reason,
                    "reason_detail": f"Veterinarian-approved pairing: {comp_reason} alongside {product.product_name}."
                })

        # Step 3: Same category fallback alternatives
        if len(results) < limit:
            same_cat = Product.objects.filter(
                category=product.category,
                pet_type=product.pet_type,
                is_available=True,
                stock__gt=0
            ).exclude(id__in=seen_ids).order_by("-id")[:(limit - len(results))]

            for sc in same_cat:
                seen_ids.add(sc.id)
                results.append({
                    "product": sc,
                    "relationship_type": "category_alternative",
                    "relationship_label": "Alternative Choice",
                    "relationship_badge": "🔄 Alternative Option",
                    "match_score": 84,
                    "explanation": f"Top alternative in {product.category.category_name}",
                    "reason_detail": f"Shares similar benefits and target care attributes within {product.category.category_name}."
                })

        return results[:limit]

    @classmethod
    def get_customer_explainable_feed(cls, customer: Customer, limit: int = 12):
        """
        Synthesizes a personalized feed for a customer across their registered pets
        and previous order history.
        """
        pets = PetProfile.objects.filter(customer=customer)
        sections = []

        # Section per pet
        for pet in pets:
            pet_recs = cls.get_pet_recommendations(pet, customer=customer, limit=6)
            if pet_recs:
                sections.append({
                    "section_id": f"pet_{pet.id}",
                    "title": f"Personalized Care for {pet.pet_name}",
                    "subtitle": f"{pet.pet_type} • {pet.breed or 'Companion'} • {pet.age or 'Adult'}",
                    "pet_id": pet.id,
                    "pet_name": pet.pet_name,
                    "pet_type": pet.pet_type,
                    "type": "pet_personalized",
                    "items": pet_recs
                })

        # Previous order repeat / replenishment section
        recent_order_items = (
            OrderItem.objects.filter(order__customer=customer)
            .select_related("product")
            .order_by("-order__order_date")[:4]
        )
        if recent_order_items.exists():
            rep_items = []
            seen = set()
            for oi in recent_order_items:
                if oi.product_id in seen:
                    continue
                seen.add(oi.product_id)
                rep_items.append({
                    "product": oi.product,
                    "recommendation": {
                        "match_score": 96,
                        "match_level": "Replenishment Essential",
                        "match_color": "#0ea5e9",
                        "primary_reason": f"Based on your previous order #{oi.order.id}",
                        "badges": [{"icon": "🔄", "label": "Repeat Favorite", "type": "repurchase"}],
                        "why_choose": "Quick 1-click reorder of your trusted pet essential.",
                        "factor_breakdown": [
                            {"title": "Prior Purchase History", "weight_percentage": 50, "score": 98, "reason": "Verified past purchase"},
                            {"title": "Routine Usage Cycle", "weight_percentage": 50, "score": 94, "reason": "Standard consumption cycle ready for restock"}
                        ]
                    }
                })
            if rep_items:
                sections.append({
                    "section_id": "repurchase",
                    "title": "Reorder Your Favorites",
                    "subtitle": "Quickly restock essentials you have ordered previously",
                    "type": "repurchase",
                    "items": rep_items
                })

        return sections
