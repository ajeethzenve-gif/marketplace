from django.urls import path

from .views import (
    PlaceOrderAPIView,
    OrderHistoryAPIView,
    OrderDetailsAPIView,
    UpdateOrderStatusAPIView,
    TotalOrdersAPIView,
    AdminOrderListAPIView,
    PlaceCartOrderAPIView,
    CancelOrderAPIView
)

urlpatterns = [
    path("place/",PlaceOrderAPIView.as_view(),name="place-order"),
    # Customer Orders
    path("",OrderHistoryAPIView.as_view(),name="order-history"),
    # Admin & Staff
    path("admin/",AdminOrderListAPIView.as_view(),name="admin-orders"),
    path("<int:pk>/",OrderDetailsAPIView.as_view(),name="order-details"),
    path("status/<int:pk>/",UpdateOrderStatusAPIView.as_view(),name="update-status"),
    path("total-orders/",TotalOrdersAPIView.as_view(),name="total-orders"),
    path("place-cart/", PlaceCartOrderAPIView.as_view(),name="place-cart-order"),
    path(
        "<int:pk>/cancel/",
        CancelOrderAPIView.as_view(),
        name="cancel-order"
    ),
]