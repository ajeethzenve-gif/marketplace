# coupons/urls.py

from django.urls import path

from .views import ApplyCouponAPIView, CouponListCreateAPIView

urlpatterns = [

    path(
            "",
            CouponListCreateAPIView.as_view(),
            name="coupon-list-create"
        ),

    path(
        "apply/",
        ApplyCouponAPIView.as_view(),
        name="apply_coupon"
    ),

]