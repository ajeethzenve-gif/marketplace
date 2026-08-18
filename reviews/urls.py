from django.urls import path

from .views import (
    ProductReviewListAPIView,
    AddReviewAPIView,
    UpdateReviewAPIView,
    DeleteReviewAPIView,
)

urlpatterns = [

    path(
        "<int:product_id>/",
        ProductReviewListAPIView.as_view(),
        name="product-reviews"
    ),

    path(
        "add/",
        AddReviewAPIView.as_view(),
        name="add-review"
    ),

    path(
        "update/<int:review_id>/",
        UpdateReviewAPIView.as_view(),
        name="update-review"
    ),

    path(
        "delete/<int:review_id>/",
        DeleteReviewAPIView.as_view(),
        name="delete-review"
    ),

]