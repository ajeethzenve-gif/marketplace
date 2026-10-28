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
    CustomerRecommendedProductsAPIView,
    ExplainProductRecommendationAPIView,
    RecommendationFeedbackAPIView,
    AIChatbotAPIView,
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
    # RELATED PRODUCTS (EXPLAINABLE)
    # =====================================================

    path(
        "products/<int:pk>/related/",
        RelatedProductsAPIView.as_view(),
        name="related-products",
    ),

    # =====================================================
    # PET RECOMMENDED PRODUCTS (EXPLAINABLE)
    # =====================================================

    path(
        "pet/<int:pet_id>/recommended/",
        PetRecommendedProductsAPIView.as_view(),
        name="pet-recommended-products",
    ),

    # =====================================================
    # CUSTOMER MULTI-PET EXPLAINABLE FEED
    # =====================================================

    path(
        "recommendations/customer/",
        CustomerRecommendedProductsAPIView.as_view(),
        name="customer-recommended-products",
    ),

    # =====================================================
    # DEEP-DIVE EXPLANATION INSPECTOR
    # =====================================================

    path(
        "recommendations/explain/<int:product_id>/pet/<int:pet_id>/",
        ExplainProductRecommendationAPIView.as_view(),
        name="explain-product-recommendation",
    ),

    # =====================================================
    # RECOMMENDATION FEEDBACK
    # =====================================================

    path(
        "recommendations/feedback/",
        RecommendationFeedbackAPIView.as_view(),
        name="recommendation-feedback",
    ),

    # =====================================================
    # AI CHATBOT (PET ASSISTANT)
    # =====================================================

    path(
        "chatbot/",
        AIChatbotAPIView.as_view(),
        name="ai-chatbot",
    ),
]