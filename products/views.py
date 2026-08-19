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

class RelatedProductsAPIView(APIView):

    permission_classes = [
        AllowAny
    ]

    def get(self, request, pk):

        try:

            product = Product.objects.get(
                pk=pk
            )

        except Product.DoesNotExist:

            return Response(
                {
                    "message": "Product Not Found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        related_products = Product.objects.filter(
            category=product.category
        ).exclude(
            id=product.id
        )

        serializer = ProductSerializer(
            related_products,
            many=True,
            context={
                "request": request
            }
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# =========================================================
# PET RECOMMENDED PRODUCTS
# =========================================================

class PetRecommendedProductsAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request, pet_id):

        # =================================================
        # GET LOGGED-IN CUSTOMER
        # =================================================

        try:

            customer = request.user.customer

        except Customer.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Customer profile not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # =================================================
        # GET PET
        # =================================================

        try:

            pet = PetProfile.objects.get(
                id=pet_id,
                customer=customer
            )

        except PetProfile.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Pet not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # =================================================
        # GET PRODUCTS FOR PET TYPE
        # =================================================

        products = Product.objects.filter(
            pet_type=pet.pet_type,
            is_available=True,
            stock__gt=0
        ).order_by(
            "-id"
        )

        # =================================================
        # GROUP PRODUCTS BY PRODUCT TYPE
        # =================================================

        grouped_products = {}

        for product in products:

            product_type = product.product_type

            if not product_type:

                product_type = "Other"

            if product_type not in grouped_products:

                grouped_products[
                    product_type
                ] = []

            grouped_products[
                product_type
            ].append(product)

        # =================================================
        # SERIALIZE GROUPED PRODUCTS
        # =================================================

        response_data = []

        for product_type, product_list in grouped_products.items():

            serializer = ProductSerializer(
                product_list,
                many=True,
                context={
                    "request": request
                }
            )

            response_data.append(
                {
                    "product_type": product_type,
                    "products": serializer.data
                }
            )

        # =================================================
        # RESPONSE
        # =================================================

        return Response(
            {
                "pet": {
                    "id": pet.id,
                    "pet_name": pet.pet_name,
                    "pet_type": pet.pet_type,
                    "breed": pet.breed,
                    "age": pet.age,
                    "weight": pet.weight
                },

                "categories": response_data
            },
            status=status.HTTP_200_OK
        )