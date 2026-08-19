from django.urls import path

from .views import (
    ProductListAPIView,
    AdminProductAPIView,
    ProductDetailAPIView,
    CategoryListAPIView,
    BrandListAPIView,
    ProductImageUploadAPIView,
    RelatedProductsAPIView,
    PetRecommendedProductsAPIView,
)


urlpatterns = [

    # =====================================================
    # PUBLIC PRODUCTS
    # =====================================================

    path(
        "products/",
        ProductListAPIView.as_view(),
        name="product-list",
    ),

    # =====================================================
    # ADMIN PRODUCTS
    # =====================================================

    path(
        "products/admin/",
        AdminProductAPIView.as_view(),
        name="admin-product-list",
    ),

    # =====================================================
    # PRODUCT DETAIL
    # =====================================================

    path(
        "products/<int:pk>/",
        ProductDetailAPIView.as_view(),
        name="product-detail",
    ),

    # =====================================================
    # CATEGORIES
    # =====================================================

    path(
        "categories/",
        CategoryListAPIView.as_view(),
        name="category-list",
    ),

    # =====================================================
    # BRANDS
    # =====================================================

    path(
        "brands/",
        BrandListAPIView.as_view(),
        name="brand-list",
    ),

    # =====================================================
    # PRODUCT IMAGES
    # =====================================================

    path(
        "product-images/",
        ProductImageUploadAPIView.as_view(),
        name="product-image-upload",
    ),

    # =====================================================
    # RELATED PRODUCTS
    # =====================================================

    path(
        "products/<int:pk>/related/",
        RelatedProductsAPIView.as_view(),
        name="related-products",
    ),

    # =====================================================
    # PET RECOMMENDED PRODUCTS
    # =====================================================

    path(
        "pet/<int:pet_id>/recommended/",
        PetRecommendedProductsAPIView.as_view(),
        name="pet-recommended-products",
    ),
]