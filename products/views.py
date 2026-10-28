from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q

from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)

from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
)

from .pagination import ProductPagination

from .models import (
    Product,
    Category,
    Brand,
    RecommendationFeedback,
)

from .recommendation_engine import (
    ExplainableRecommendationEngine,
)

from .llm_recommendation_engine import (
    LLMRecommendationEngine,
)

from accounts.models import (
    PetProfile,
    Customer,
)

from .serializers import (
    ProductSerializer,
    CategorySerializer,
    BrandSerializer,
    ProductImageSerializer,
)

from .permissions import IsAdminOrStaff


# =========================================================
# PUBLIC PRODUCT LIST + FILTER
# =========================================================

class ProductListAPIView(APIView):

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    # =====================================================
    # PERMISSIONS
    # =====================================================

    def get_permissions(self):

        # Anyone can view products or send OPTIONS
        if self.request.method in ["GET", "OPTIONS"]:
            return [AllowAny()]

        # Only admin/staff can create products
        return [IsAdminOrStaff()]

    # =====================================================
    # GET PRODUCTS
    # =====================================================

    def get(self, request):

        # =================================================
        # QUERY PARAMETERS
        # =================================================

        product_types = request.query_params.getlist(
            "product_type"
        )

        brand = request.query_params.get(
            "brand"
        )

        search = request.query_params.get(
            "search"
        )

        min_price = request.query_params.get(
            "min_price"
        )

        max_price = request.query_params.get(
            "max_price"
        )

        sort = request.query_params.get(
            "sort"
        )

        # =================================================
        # ALL PRODUCTS
        # =================================================

        products = Product.objects.all()

        # =================================================
        # SEARCH
        # =================================================

        if search:

            products = products.filter(
                product_name__icontains=search
            )

        # =================================================
        # PRODUCT TYPE FILTER
        # =================================================

        if product_types:

            products = products.filter(
                product_type__in=product_types
            )

        # =================================================
        # BRAND FILTER
        # =================================================

        if brand:

            products = products.filter(
                brand_id=brand
            )

        # =================================================
        # PET TYPE FILTER
        # =================================================

        pet_type = request.query_params.get("pet_type") or request.query_params.get("pet")

        if pet_type:
            cleaned_pet = str(pet_type).strip().lower()

            if cleaned_pet in ["other-pets", "other_pets", "other", "others", "non-dog-cat"]:
                # Show products for pets other than dogs and cats, plus universal products
                products = products.filter(
                    ~Q(pet_type__iexact="Dog") & ~Q(pet_type__iexact="Cat")
                )
            elif cleaned_pet in ["dog", "dogs"]:
                products = products.filter(
                    Q(pet_type__iexact="Dog") | Q(pet_type__iexact="Universal")
                )
            elif cleaned_pet in ["cat", "cats"]:
                products = products.filter(
                    Q(pet_type__iexact="Cat") | Q(pet_type__iexact="Universal")
                )
            elif "," in pet_type:
                pet_list = [p.strip() for p in pet_type.split(",") if p.strip()]
                products = products.filter(
                    Q(pet_type__in=pet_list) | Q(pet_type__iexact="Universal")
                )
            else:
                products = products.filter(
                    Q(pet_type__iexact=pet_type) | Q(pet_type__iexact="Universal")
                )

        # =================================================
        # MIN PRICE
        # =================================================

        if min_price:

            products = products.filter(
                price__gte=min_price
            )

        # =================================================
        # MAX PRICE
        # =================================================

        if max_price:

            products = products.filter(
                price__lte=max_price
            )

        # =================================================
        # SORTING
        # =================================================

        if sort == "price_low":

            products = products.order_by(
                "price"
            )

        elif sort == "price_high":

            products = products.order_by(
                "-price"
            )

        elif sort == "latest":

            products = products.order_by(
                "-id"
            )

        elif sort == "popular":

            products = products.order_by(
                "-stock"
            )

        else:

            products = products.order_by(
                "-id"
            )

        # =================================================
        # PAGINATION
        # =================================================

        paginator = ProductPagination()

        page = paginator.paginate_queryset(
            products,
            request
        )

        # =================================================
        # SERIALIZER
        # =================================================

        serializer = ProductSerializer(
            page,
            many=True,
            context={
                "request": request
            }
        )

        # =================================================
        # RESPONSE
        # =================================================

        return paginator.get_paginated_response(
            serializer.data
        )

    # =====================================================
    # CREATE PRODUCT
    # =====================================================

    def post(self, request):

        print("DATA:", request.data)
        print("FILES:", request.FILES)

        serializer = ProductSerializer(
            data=request.data,
            context={
                "request": request
            }
        )

        if serializer.is_valid():

            product = serializer.save()

            return Response(
                ProductSerializer(
                    product,
                    context={
                        "request": request
                    }
                ).data,
                status=status.HTTP_201_CREATED
            )

        print(
            "SERIALIZER ERRORS:",
            serializer.errors
        )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# =========================================================
# ADMIN PRODUCT LIST + CREATE
# =========================================================

class AdminProductAPIView(APIView):

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    # =====================================================
    # ADMIN PERMISSIONS
    # =====================================================

    def get_permissions(self):

        # Admin/staff only
        return [IsAdminOrStaff()]

    # =====================================================
    # GET ALL PRODUCTS
    # =====================================================

    def get(self, request):

        # IMPORTANT:
        # No pagination here.
        # Admin receives ALL products.

        products = Product.objects.all().order_by(
            "-id"
        )

        serializer = ProductSerializer(
            products,
            many=True,
            context={
                "request": request
            }
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # =====================================================
    # CREATE PRODUCT
    # =====================================================

    def post(self, request):

        print("ADMIN PRODUCT DATA:", request.data)
        print("ADMIN PRODUCT FILES:", request.FILES)

        serializer = ProductSerializer(
            data=request.data,
            context={
                "request": request
            }
        )

        if serializer.is_valid():

            product = serializer.save()

            return Response(
                ProductSerializer(
                    product,
                    context={
                        "request": request
                    }
                ).data,
                status=status.HTTP_201_CREATED
            )

        print(
            "ADMIN PRODUCT ERRORS:",
            serializer.errors
        )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# =========================================================
# PRODUCT DETAILS
# =========================================================

class ProductDetailAPIView(APIView):

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    # =====================================================
    # PERMISSIONS
    # =====================================================

    def get_permissions(self):

        # Anyone can view product or send OPTIONS
        if self.request.method in ["GET", "OPTIONS"]:
            return [AllowAny()]

        # Only admin/staff can update/delete
        return [IsAdminOrStaff()]

    # =====================================================
    # GET PRODUCT OBJECT
    # =====================================================

    def get_object(self, pk):

        try:

            return Product.objects.get(
                pk=pk
            )

        except Product.DoesNotExist:

            return None

    # =====================================================
    # GET PRODUCT
    # =====================================================

    def get(self, request, pk):

        product = self.get_object(pk)

        if not product:

            return Response(
                {
                    "message": "Product Not Found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ProductSerializer(
            product,
            context={
                "request": request
            }
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # =====================================================
    # UPDATE PRODUCT
    # =====================================================

    def put(self, request, pk):

        product = self.get_object(pk)

        if not product:

            return Response(
                {
                    "message": "Product Not Found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ProductSerializer(
            product,
            data=request.data,
            partial=True,
            context={
                "request": request
            }
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # =====================================================
    # DELETE PRODUCT
    # =====================================================

    def delete(self, request, pk):

        product = self.get_object(pk)

        if not product:

            return Response(
                {
                    "message": "Product Not Found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        product.delete()

        return Response(
            {
                "message": "Product Deleted Successfully"
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# PRODUCT IMAGE UPLOAD
# =========================================================

class ProductImageUploadAPIView(APIView):

    permission_classes = [
        IsAdminOrStaff
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def post(self, request):

        serializer = ProductImageSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# =========================================================
# CATEGORY LIST
# =========================================================

class CategoryListAPIView(APIView):

    permission_classes = [
        AllowAny
    ]

    def get(self, request):

        categories = Category.objects.all()

        serializer = CategorySerializer(
            categories,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# =========================================================
# BRAND LIST
# =========================================================

class BrandListAPIView(APIView):

    permission_classes = [
        AllowAny
    ]

    def get(self, request):

        brands = Brand.objects.all()

        serializer = BrandSerializer(
            brands,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# =========================================================
# RELATED PRODUCTS
# =========================================================

# =========================================================
# EXPLAINABLE RELATED PRODUCTS API
# =========================================================

class RelatedProductsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            product = Product.objects.select_related("category", "brand").get(pk=pk)
        except Product.DoesNotExist:
            return Response(
                {"message": "Product Not Found"},
                status=status.HTTP_404_NOT_FOUND
            )

        customer = None
        if request.user.is_authenticated:
            try:
                customer = request.user.customer
            except Customer.DoesNotExist:
                pass

        related_results = ExplainableRecommendationEngine.get_explainable_related_products(
            product=product,
            customer=customer,
            limit=8
        )

        response_data = []
        for item in related_results:
            p_data = ProductSerializer(
                item["product"],
                context={"request": request}
            ).data

            p_data["related_explanation"] = {
                "relationship_type": item["relationship_type"],
                "relationship_label": item["relationship_label"],
                "relationship_badge": item["relationship_badge"],
                "match_score": item["match_score"],
                "explanation": item["explanation"],
                "reason_detail": item["reason_detail"],
            }
            # Also attach standard recommendation structure for unified UI rendering
            p_data["recommendation"] = {
                "match_score": item["match_score"],
                "match_level": item["relationship_label"],
                "match_color": "#3b82f6",
                "primary_reason": item["explanation"],
                "badges": [{"icon": "🔗", "label": item["relationship_badge"], "type": "related"}],
                "why_choose": item["reason_detail"],
                "factor_breakdown": [
                    {
                        "factor_id": "relation",
                        "title": item["relationship_label"],
                        "weight_percentage": 60,
                        "score": item["match_score"],
                        "reason": item["explanation"]
                    },
                    {
                        "factor_id": "compatibility",
                        "title": "Category Compatibility",
                        "weight_percentage": 40,
                        "score": 90,
                        "reason": f"Seamless pairing with {product.product_name}"
                    }
                ]
            }
            response_data.append(p_data)

        return Response(response_data, status=status.HTTP_200_OK)


# =========================================================
# PET EXPLAINABLE RECOMMENDED PRODUCTS API
# =========================================================

class PetRecommendedProductsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pet_id):
        # 1. Get logged-in customer
        try:
            customer = request.user.customer
        except Customer.DoesNotExist:
            return Response(
                {"detail": "Customer profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # 2. Get pet profile
        try:
            pet = PetProfile.objects.get(
                id=pet_id,
                customer=customer
            )
        except PetProfile.DoesNotExist:
            return Response(
                {"detail": "Pet not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # 3. Compute recommendations — LLM-powered by default, rule-based fallback
        use_llm = request.query_params.get("use_llm", "true").lower() != "false"
        if use_llm:
            scored_items = LLMRecommendationEngine.get_pet_recommendations(
                pet=pet,
                customer=customer,
                limit=24,
            )
        else:
            scored_items = ExplainableRecommendationEngine.get_pet_recommendations(
                pet=pet,
                customer=customer,
                limit=24,
            )

        # 4. Group by product_type while attaching full explainability schema
        grouped_products = {}
        flat_top_recommendations = []

        for item in scored_items:
            prod = item["product"]
            rec = item["recommendation"]

            serializer = ProductSerializer(
                prod,
                context={"request": request}
            )
            prod_data = serializer.data
            prod_data["recommendation"] = rec

            flat_top_recommendations.append(prod_data)

            prod_type = prod.product_type or "Other"
            if prod_type not in grouped_products:
                grouped_products[prod_type] = []
            grouped_products[prod_type].append(prod_data)

        # 5. Format category list
        categories_data = []
        for product_type, product_list in grouped_products.items():
            categories_data.append({
                "product_type": product_type,
                "products": product_list
            })

        # Summary telemetry
        avg_score = 0
        if scored_items:
            avg_score = int(sum(item["recommendation"]["match_score"] for item in scored_items) / len(scored_items))

        return Response(
            {
                "pet": {
                    "id": pet.id,
                    "pet_name": pet.pet_name,
                    "pet_type": pet.pet_type,
                    "breed": pet.breed,
                    "age": pet.age,
                    "weight": pet.weight,
                    "health_notes": pet.health_notes,
                },
                "summary": {
                    "total_recommended": len(scored_items),
                    "average_compatibility": avg_score,
                    "has_health_concerns": bool(pet.health_notes and pet.health_notes.lower() not in ["nothing", "none", "nil", "healthy"]),
                    "engine_version": "Zenve-LLM-v3.0" if use_llm else "Zenve-XAI-v2.0",
                    "llm_powered": use_llm,
                },
                "categories": categories_data,
                "top_recommendations": flat_top_recommendations[:8]
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# CUSTOMER MULTI-PET EXPLAINABLE FEED
# =========================================================

class CustomerRecommendedProductsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            customer = request.user.customer
        except Customer.DoesNotExist:
            customer, _ = Customer.objects.get_or_create(
                user=request.user,
                defaults={"phone_number": f"{request.user.id}".zfill(10)}
            )

        # Use LLM engine for per-pet sections inside the customer feed
        pet_type = request.query_params.get("pet_type") or request.query_params.get("pet")
        pets = PetProfile.objects.filter(customer=customer)
        feed_sections = []

        for pet in pets:
            pet_recs = LLMRecommendationEngine.get_pet_recommendations(pet, customer=customer, limit=6)
            if pet_recs:
                feed_sections.append({
                    "section_id": f"pet_{pet.id}",
                    "title": f"Personalized Care for {pet.pet_name}",
                    "subtitle": f"{pet.pet_type} \u2022 {pet.breed or 'Companion'} \u2022 {pet.age or 'Adult'}",
                    "pet_id": pet.id,
                    "pet_name": pet.pet_name,
                    "pet_type": pet.pet_type,
                    "type": "pet_personalized",
                    "items": pet_recs,
                })

        # Append repurchase section from rule-based feed
        from orders.models import OrderItem
        recent_order_items = (
            OrderItem.objects.filter(order__customer=customer)
            .select_related("product")
            .order_by("-order__order_date")
        )
        if pet_type:
            pt_clean = str(pet_type).strip().lower()
            if pt_clean in ["others", "other", "setting", "settings", "non_dog_cat"]:
                recent_order_items = recent_order_items.exclude(product__pet_type__iexact="Dog").exclude(product__pet_type__iexact="Cat")
            elif pt_clean in ["dog", "cat"]:
                recent_order_items = recent_order_items.filter(
                    Q(product__pet_type__iexact=pt_clean.capitalize()) | Q(product__pet_type__iexact="Universal")
                )
            else:
                recent_order_items = recent_order_items.filter(
                    Q(product__pet_type__iexact=pet_type) | Q(product__pet_type__iexact="Universal")
                )
        recent_order_items = recent_order_items[:4]
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
                        "badges": [{"icon": "reorder", "label": "Repeat Favorite", "type": "repurchase"}],
                        "why_choose": "Quick 1-click reorder of your trusted pet essential.",
                        "factor_breakdown": [
                            {"title": "Prior Purchase History", "weight_percentage": 50, "score": 98, "reason": "Verified past purchase"},
                            {"title": "Routine Usage Cycle", "weight_percentage": 50, "score": 94, "reason": "Standard consumption cycle ready for restock"},
                        ],
                        "llm_powered": False,
                    },
                })
            if rep_items:
                feed_sections.append({
                    "section_id": "repurchase",
                    "title": "Reorder Your Favorites",
                    "subtitle": "Quickly restock essentials you have ordered previously",
                    "type": "repurchase",
                    "items": rep_items,
                })

        serialized_sections = []
        for sec in feed_sections:
            sec_items = []
            for item in sec["items"]:
                p_data = ProductSerializer(
                    item["product"],
                    context={"request": request}
                ).data
                p_data["recommendation"] = item["recommendation"]
                sec_items.append(p_data)

            serialized_sections.append({
                "section_id": sec["section_id"],
                "title": sec["title"],
                "subtitle": sec.get("subtitle", ""),
                "pet_id": sec.get("pet_id"),
                "pet_name": sec.get("pet_name"),
                "pet_type": sec.get("pet_type"),
                "type": sec["type"],
                "products": sec_items
            })

        return Response(
            {
                "customer_name": request.user.username,
                "sections": serialized_sections
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# DEEP-DIVE RECOMMENDATION EXPLANATION API
# =========================================================

class ExplainProductRecommendationAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, product_id, pet_id):
        try:
            product = Product.objects.select_related("category", "brand").get(id=product_id)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            pet = PetProfile.objects.get(id=pet_id)
        except PetProfile.DoesNotExist:
            return Response({"detail": "Pet not found."}, status=status.HTTP_404_NOT_FOUND)

        from .recommendation_engine import (
            parse_pet_age,
            parse_pet_weight,
            HEALTH_TOPIC_RULES
        )

        age_years, life_stage = parse_pet_age(pet.age)
        weight_kg, size_class = parse_pet_weight(pet.weight)
        breed_clean = (pet.breed or "").strip().lower()
        health_clean = (pet.health_notes or "").strip().lower()

        detected_topics = []
        if health_clean and health_clean not in ["nothing", "none", "nil", "good", "healthy"]:
            for topic_key, topic_data in HEALTH_TOPIC_RULES.items():
                if any(kw in health_clean for kw in topic_data["keywords"]):
                    detected_topics.append((topic_key, topic_data))

        explanation = ExplainableRecommendationEngine._evaluate_product_for_pet(
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

        prod_data = ProductSerializer(product, context={"request": request}).data

        return Response(
            {
                "product": prod_data,
                "pet": {
                    "id": pet.id,
                    "pet_name": pet.pet_name,
                    "pet_type": pet.pet_type,
                    "breed": pet.breed,
                    "age": pet.age,
                    "weight": pet.weight,
                    "health_notes": pet.health_notes,
                },
                "explanation": explanation
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# RECOMMENDATION USER FEEDBACK API
# =========================================================

class RecommendationFeedbackAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            customer = request.user.customer
        except Customer.DoesNotExist:
            customer, _ = Customer.objects.get_or_create(
                user=request.user,
                defaults={"phone_number": f"{request.user.id}".zfill(10)}
            )

        product_id = request.data.get("product_id")
        pet_id = request.data.get("pet_id")
        is_helpful = request.data.get("is_helpful", True)
        feedback_reason = request.data.get("feedback_reason", "")

        if not product_id:
            return Response(
                {"detail": "product_id is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"detail": "Product not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        pet = None
        if pet_id:
            pet = PetProfile.objects.filter(id=pet_id, customer=customer).first()

        feedback, _ = RecommendationFeedback.objects.update_or_create(
            customer=customer,
            product=product,
            pet=pet,
            defaults={
                "is_helpful": is_helpful,
                "feedback_reason": feedback_reason
            }
        )

        return Response(
            {
                "success": True,
                "message": "Thank you for your feedback! Zenve recommendations updated.",
                "feedback_id": feedback.id,
                "is_helpful": feedback.is_helpful
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# AI CHATBOT ASSISTANT (TRAINED Q&A + DATABASE GROUNDED)
# =========================================================

_TRAINED_QA_CACHE = None
_TRAINED_QA_MTIME = 0
_TRAINED_QA_IDF = {}
_TRAINED_QA_AVG_LEN = 1.0

_STOPWORDS = {
    "a", "an", "the", "in", "on", "at", "to", "for", "of", "and", "or", "from", "with",
    "is", "are", "am", "was", "were", "be", "been", "being",
    "do", "does", "did", "done",
    "have", "has", "had", "having",
    "can", "could", "would", "should", "will", "shall", "may", "might",
    "you", "i", "my", "your", "we", "our", "us", "me", "they", "them",
    "how", "what", "which", "where", "who", "whom", "why", "when",
    "there", "here", "please", "tell", "show", "give", "know", "want", "need", "like", "any", "some"
}

_PET_TAGS = {
    "dog": "dog", "dogs": "dog", "puppy": "dog", "puppies": "dog", "canine": "dog",
    "cat": "cat", "cats": "cat", "kitten": "cat", "kittens": "cat", "feline": "cat",
    "bird": "bird", "birds": "bird", "parrot": "bird",
    "rabbit": "rabbit", "rabbits": "rabbit", "bunny": "rabbit", "bunnies": "rabbit",
    "fish": "fish", "fishes": "fish", "aquarium": "fish",
    "hamster": "hamster", "hamsters": "hamster"
}

_SYNONYMS = {
    "buy": ["purchase", "order", "shop", "get"],
    "purchase": ["buy", "order"],
    "product": ["item", "goods"],
    "item": ["product", "goods"],
    "track": ["status", "tracking", "locate", "shipped", "where", "progress", "check"],
    "tracking": ["track", "status", "locate", "where"],
    "where": ["track", "status", "locate", "check"],
    "status": ["track", "where", "check"],
    "pay": ["payment", "method", "methods", "accept", "upi", "card", "cod"],
    "payment": ["pay", "method", "methods", "options"],
    "refund": ["return", "money", "cancel", "reimbursement"],
    "return": ["refund", "exchange", "cancel", "returning"],
    "cancel": ["cancellation", "cancelation", "stop"],
    "support": ["contact", "help", "care", "helpline", "reach", "phone", "number"],
    "contact": ["support", "help", "reach", "talk", "call", "email"],
    "cost": ["price", "fee", "charge", "much", "shipping", "delivery"],
    "shipping": ["delivery", "cost", "fee", "courier", "charge", "deliver"],
    "ship": ["shipping", "delivery", "deliver", "dispatch"],
    "deliver": ["delivery", "shipping", "pincode", "pin code"],
    "delivery": ["deliver", "shipping", "cost", "fee"],
    "delayed": ["delay", "late", "slow"],
    "delay": ["delayed", "late", "slow"],
    "reorder": ["repeat", "buy again", "order again"],
    "sick": ["unwell", "ill", "emergency", "medicine"],
    "unwell": ["sick", "ill", "emergency"],
}


def _stem(word):
    w = word.lower()
    if len(w) <= 3:
        return w
    if w.endswith("ies") and len(w) > 4:
        return w[:-3] + "y"
    if w.endswith("es") and len(w) > 3 and not w.endswith(("ses", "zes", "ches", "shes")):
        return w[:-1]
    if w.endswith("s") and len(w) > 3 and not w.endswith("ss"):
        return w[:-1]
    if w.endswith("ing") and len(w) > 4:
        return w[:-3]
    if w.endswith("ed") and len(w) > 4:
        return w[:-2]
    return w


_SYNONYM_STEMS = {}
for _k, _vals in _SYNONYMS.items():
    _targets = {_stem(_v) for _v in _vals}
    _targets.add(_stem(_k))
    _SYNONYM_STEMS[_k] = _targets
    _SYNONYM_STEMS[_stem(_k)] = _targets


def _normalize_text(text):
    import re
    # Convert "pincode" to "pin code" to align with CSV
    t = re.sub(r"\bpincode\b", "pin code", text.lower())
    return re.sub(r"[^a-z0-9\s]", " ", t).strip()


def _tokenize_text(text):
    clean = _normalize_text(text)
    raw_tokens = [w for w in clean.split() if w]
    stems = [_stem(t) for t in raw_tokens if t not in _STOPWORDS and len(t) > 1]
    return raw_tokens, stems


def _load_trained_qa():
    global _TRAINED_QA_CACHE, _TRAINED_QA_MTIME, _TRAINED_QA_IDF, _TRAINED_QA_AVG_LEN
    import csv
    import os
    import math
    from collections import Counter

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    candidate_paths = [
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "chatbot_qa.csv"),
        os.path.join(base_dir, "products", "data", "chatbot_qa.csv"),
        os.path.join(base_dir, "chatbot_qa.csv"),
    ]

    csv_path = None
    for p in candidate_paths:
        if os.path.exists(p):
            csv_path = p
            break

    if not csv_path:
        return []

    try:
        current_mtime = os.path.getmtime(csv_path)
    except Exception:
        current_mtime = 0

    if _TRAINED_QA_CACHE is not None and _TRAINED_QA_MTIME == current_mtime and current_mtime > 0:
        return _TRAINED_QA_CACHE

    records = []
    try:
        with open(csv_path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                q_raw = (row.get("question") or "").strip()
                ans_raw = (row.get("answer") or "").strip()
                if not q_raw or not ans_raw:
                    continue
                raw_t, stems = _tokenize_text(q_raw)
                pet = set(_PET_TAGS[w] for w in raw_t if w in _PET_TAGS)
                records.append({
                    "id": row.get("id"),
                    "question": q_raw,
                    "answer": ans_raw,
                    "norm_q": " ".join(raw_t),
                    "raw_tokens": set(raw_t),
                    "stems": stems,
                    "stem_set": set(stems),
                    "pets": pet,
                })
    except Exception:
        pass

    doc_count = len(records)
    df = Counter()
    for item in records:
        for t in item["stem_set"]:
            df[t] += 1

    idf_map = {}
    for term, freq in df.items():
        idf_map[term] = math.log((doc_count - freq + 0.5) / (freq + 0.5) + 1.0)

    _TRAINED_QA_CACHE = records
    _TRAINED_QA_MTIME = current_mtime
    _TRAINED_QA_IDF = idf_map
    _TRAINED_QA_AVG_LEN = sum(len(d["stems"]) for d in records) / max(1, doc_count)
    return _TRAINED_QA_CACHE


def match_trained_qa(message, threshold=0.35):
    import difflib
    from collections import Counter

    dataset = _load_trained_qa()
    if not dataset or not message:
        return None, 0.0

    q_norm = _normalize_text(message)
    q_raw, q_stems = _tokenize_text(message)
    if not q_stems and not q_norm:
        return None, 0.0

    q_stem_set = set(q_stems)
    q_pets = set(_PET_TAGS[w] for w in q_raw if w in _PET_TAGS)

    # 1. Exact normalized match check
    for item in dataset:
        if q_norm == item["norm_q"]:
            return item, 1.0

    # Expand query stems with synonyms
    expanded_stems = set(q_stems)
    for token in set(q_raw).union(q_stems):
        if token in _SYNONYM_STEMS:
            expanded_stems.update(_SYNONYM_STEMS[token])

    best_match = None
    best_score = 0.0

    k1 = 1.5
    b = 0.75
    avg_len = _TRAINED_QA_AVG_LEN or 1.0
    idf_map = _TRAINED_QA_IDF

    for item in dataset:
        # Pet conflict check
        if q_pets and item["pets"] and not (q_pets & item["pets"]):
            continue

        target_stems = item["stems"]
        target_stem_set = item["stem_set"]
        if not target_stems:
            continue

        doc_len = len(target_stems)
        term_freqs = Counter(target_stems)

        # BM25 component with synonym expansion
        bm25_score = 0.0
        for t in expanded_stems:
            if t in term_freqs:
                tf = term_freqs[t]
                term_idf = idf_map.get(t, 1.0)
                weight = 1.3 if t in q_stem_set else 0.8
                term_score = term_idf * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (doc_len / avg_len)))
                bm25_score += weight * term_score

        max_possible_bm25 = sum(idf_map.get(t, 1.0) * (k1 + 1) for t in q_stem_set) or 1.0
        norm_bm25 = min(1.0, bm25_score / (max_possible_bm25 * 1.2))

        # Precision & Recall & Jaccard (using expanded stems for flexible recall)
        if q_stem_set:
            overlap = q_stem_set.intersection(target_stem_set)
            expanded_overlap = expanded_stems.intersection(target_stem_set)
            recall = len(expanded_overlap) / len(q_stem_set)
            precision = len(overlap) / len(target_stem_set)
            jaccard = len(overlap) / len(q_stem_set.union(target_stem_set))
        else:
            recall = precision = jaccard = 0.0

        # SequenceMatcher ratio
        seq_ratio = difflib.SequenceMatcher(None, q_norm, item["norm_q"]).ratio()

        # Length ratio factor (favors concise direct matches over long questions)
        len_ratio = len(q_stems) / max(1, len(target_stems))
        len_factor = min(1.0, len_ratio)

        # Substring & Prefix bonus
        sub_bonus = 0.0
        if q_norm and item["norm_q"]:
            if item["norm_q"].startswith(q_norm):
                sub_bonus = 0.35 * (len(q_norm) / len(item["norm_q"]))
            elif q_norm in item["norm_q"]:
                sub_bonus = 0.20 * (len(q_norm) / len(item["norm_q"]))
            elif item["norm_q"] in q_norm:
                sub_bonus = 0.20 * (len(item["norm_q"]) / len(q_norm))

        composite_score = (
            (0.35 * norm_bm25) +
            (0.25 * recall) +
            (0.15 * precision) +
            (0.10 * jaccard) +
            (0.05 * seq_ratio) +
            (0.10 * len_factor) +
            sub_bonus
        )

        if recall >= 1.0 and len(q_stem_set) >= 2:
            composite_score = max(composite_score, 0.85 * len_factor)

        if composite_score > best_score:
            best_score = composite_score
            best_match = item

    if best_match and best_score >= threshold:
        return best_match, best_score
    return None, best_score


_BACKEND_SESSION_QUESTION_COUNTS = {}


class AIChatbotAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        import os
        import re
        from orders.models import Order

        message = (request.data.get("message") or "").strip()
        history = request.data.get("conversation_history") or []

        if not message:
            return Response(
                {"error": "Message is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ---------------------------------------------------------
        # NON-CSV QUESTION ESCALATION MESSAGE
        # ---------------------------------------------------------
        SUPPORT_LIMIT_MESSAGE = (
            "Contact Zenve Customer Support & Human Escalation:\n"
            "Our human support team is ready to assist you:\n"
            "• Email: [support@zenve.com](mailto:support@zenve.com)\n"
            "• Toll-Free Helpline: 1800-ZENVE-PET (1800-936-8373)\n"
            "• WhatsApp Support: +91 98765 43210\n"
            "• Operating Hours: Monday to Sunday, 9:00 AM – 9:00 PM IST.\n"
            "Feel free to drop a message anytime and an executive will get in touch!"
        )

        session_id = (
            request.data.get("session_id")
            or request.headers.get("X-Chatbot-Session-Id")
            or ""
        ).strip()
        new_session = bool(request.data.get("new_session")) or message == "new_session"

        if session_id and new_session:
            _BACKEND_SESSION_QUESTION_COUNTS[session_id] = 0
            if hasattr(request, "session") and request.session:
                request.session[f"zenve_q_{session_id}"] = 0
            return Response({"success": True, "reset": True}, status=status.HTTP_200_OK)

        user = request.user if request.user and request.user.is_authenticated else None
        customer = None
        if user:
            customer = getattr(user, "customer", None)
            if not customer:
                customer = Customer.objects.filter(user=user).first()

        msg_lower = message.lower()
        matched_products = []
        user_orders = []
        medical_disclaimer = None

        # 1. Order Status Tracking Intent
        is_order_query = any(k in msg_lower for k in ["order", "track", "delivery", "shipping", "shipped", "package", "status"])
        order_num_match = re.search(r"#?(\d{1,8})", message)

        if is_order_query:
            if customer:
                orders_qs = Order.objects.filter(customer=customer).order_by("-order_date")[:3]
                for o in orders_qs:
                    user_orders.append({
                        "id": o.id,
                        "status": o.status,
                        "total_amount": float(o.total_amount),
                        "order_date": o.order_date.strftime("%Y-%m-%d %H:%M"),
                        "payment_status": o.payment_status,
                    })
            elif order_num_match:
                searched_id = int(order_num_match.group(1))
                o = Order.objects.filter(id=searched_id).first()
                if o:
                    user_orders.append({
                        "id": o.id,
                        "status": o.status,
                        "total_amount": float(o.total_amount),
                        "order_date": o.order_date.strftime("%Y-%m-%d %H:%M"),
                        "payment_status": o.payment_status,
                    })

        # 2. Medical / Health Disclaimer
        health_keywords = ["vomit", "diarrhea", "blood", "poison", "wound", "fever", "limping", "sick", "infection", "emergency", "dose", "dosage", "prescription"]
        if any(hk in msg_lower for hk in health_keywords):
            medical_disclaimer = "⚠️ Veterinary Notice: This information is for general pet care guidance. In emergencies or severe health conditions, please contact or visit a certified veterinarian immediately."

        # 3. Product Catalog Database Grounding (Search real DB products)
        product_query = Q(is_available=True)
        pet_filter = None
        if any(w in msg_lower for w in ["dog", "puppy", "canine"]):
            pet_filter = "Dog"
        elif any(w in msg_lower for w in ["cat", "kitten", "feline"]):
            pet_filter = "Cat"
        elif any(w in msg_lower for w in ["bird", "parrot", "poultry"]):
            pet_filter = "Bird"
        elif any(w in msg_lower for w in ["cattle", "cow", "calf", "farm", "livestock"]):
            pet_filter = "Cattle"
        elif any(w in msg_lower for w in ["rabbit", "bunny"]):
            pet_filter = "Rabbit"
        elif any(w in msg_lower for w in ["fish", "aquarium"]):
            pet_filter = "Fish"

        if pet_filter:
            product_query &= (Q(pet_type__iexact=pet_filter) | Q(pet_type__iexact="Universal"))

        # Category / keyword matching in DB
        tokens = [t for t in re.findall(r"\b[a-zA-Z]{3,}\b", msg_lower) if t not in ["the", "for", "and", "can", "you", "what", "with", "best", "some", "need", "want", "help", "please", "pet", "pets"]]
        if tokens:
            token_q = Q()
            for t in tokens[:4]:
                token_q |= (
                    Q(product_name__icontains=t) |
                    Q(description__icontains=t) |
                    Q(product_type__icontains=t) |
                    Q(category__category_name__icontains=t) |
                    Q(brand__brand_name__icontains=t)
                )
            catalog_matches = Product.objects.filter(product_query & token_q).distinct()[:4]
        else:
            catalog_matches = Product.objects.filter(product_query).distinct()[:4]

        # If no specific matches, but pet_filter is set, grab popular items for that pet
        if not catalog_matches and pet_filter:
            catalog_matches = Product.objects.filter(product_query)[:4]

        for p in catalog_matches:
            img_url = p.image.url if p.image else None
            matched_products.append({
                "id": p.id,
                "name": p.product_name,
                "price": float(p.price),
                "pet_type": p.pet_type,
                "product_type": p.product_type,
                "in_stock": p.stock > 0,
                "url": f"/product/{p.id}",
                "image": img_url,
            })

        # 4. PRIMARY ENGINE: Match against uploaded questions in chatbot_qa.csv
        # The user can ask multiple questions from the CSV file without limit.
        # If the user asks a question other than the CSV questions, return the support limit message.
        matched_qa, match_score = match_trained_qa(message)
        reply = None
        provider = None
        limit_reached = False

        if matched_qa:
            reply = matched_qa["answer"]
            provider = "trained_qa"
            limit_reached = False
        else:
            # Question is outside the trained CSV questions
            reply = SUPPORT_LIMIT_MESSAGE
            provider = "support_limit"
            limit_reached = True
            matched_products = []
            user_orders = []

        return Response({
            "success": True,
            "reply": reply,
            "products": matched_products,
            "orders": user_orders,
            "disclaimer": medical_disclaimer,
            "provider": provider,
            "limit_reached": limit_reached,
            "matched_question": matched_qa["question"] if matched_qa else None,
            "match_score": round(match_score, 3) if matched_qa else None,
        }, status=status.HTTP_200_OK)
