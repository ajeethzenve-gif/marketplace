from django.urls import path
from .views import (ProductListAPIView,
                    ProductDetailAPIView,
                    CategoryListAPIView,
                    BrandListAPIView,
                    ProductImageUploadAPIView,
                    RelatedProductsAPIView,
                    PetRecommendedProductsAPIView,
                    )

urlpatterns = [
    path("products/", ProductListAPIView.as_view(), name="product-list"),
    path("products/<int:pk>/", ProductDetailAPIView.as_view(), name="product-detail"),
    path("categories/", CategoryListAPIView.as_view(), name="category-list"),
    path("brands/", BrandListAPIView.as_view(), name="brand-list"),
    path("product-images/",ProductImageUploadAPIView.as_view(),name="product-image-upload" ),
    path("products/<int:pk>/related/", RelatedProductsAPIView.as_view(),name="related-products"),
    path("pet/<int:pet_id>/recommended/",PetRecommendedProductsAPIView.as_view(),name="pet-recommended-products"),
]