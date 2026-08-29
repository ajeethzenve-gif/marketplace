from django.urls import path

from .views import (
    WalletAPIView,
    CreateWalletPaymentAPIView,
    VerifyWalletPaymentAPIView,
)


urlpatterns = [

    # Existing wallet
    path(
        "",
        WalletAPIView.as_view(),
        name="wallet"
    ),

    # Razorpay create order
    path(
        "create-payment/",
        CreateWalletPaymentAPIView.as_view(),
        name="create-wallet-payment"
    ),

    # Razorpay verify payment
    path(
        "verify-payment/",
        VerifyWalletPaymentAPIView.as_view(),
        name="verify-wallet-payment"
    ),

]