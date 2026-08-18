from django.urls import path

from .views import (
    CartAPIView,
    AddToCartAPIView,
    UpdateCartAPIView,
    RemoveCartItemAPIView,
)

urlpatterns = [
    path("",CartAPIView.as_view(),name="cart"),
    path("add/",AddToCartAPIView.as_view(),name="add-cart"),
    path("update/",UpdateCartAPIView.as_view(),name="update-cart"),
    path("remove/<int:product_id>/",RemoveCartItemAPIView.as_view(),name="remove-cart"),
]