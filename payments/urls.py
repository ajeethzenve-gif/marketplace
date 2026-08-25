from django.urls import path

from .views import (
    CreateRazorpayOrderAPIView,
    VerifyRazorpayPaymentAPIView,
)


urlpatterns = [

    path(
        "create-order/",
        CreateRazorpayOrderAPIView.as_view(),
        name="create-razorpay-order"
    ),

    path(
        "verify/",
        VerifyRazorpayPaymentAPIView.as_view(),
        name="verify-razorpay-payment"
    ),

]