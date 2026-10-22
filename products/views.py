from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

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

        # Anyone can view products
        if self.request.method == "GET":
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

            products = products.filter(
                pet_type__iexact=pet_type
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

        # Anyone can view product
        if self.request.method == "GET":
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