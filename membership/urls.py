from django.urls import path

from .views import (
    MembershipPlanListAPIView,
    MyMembershipAPIView,
    PurchaseMembershipAPIView,
    CreateMembershipPaymentAPIView,
    VerifyMembershipPaymentAPIView,
)


urlpatterns = [

    path(
        "plans/",
        MembershipPlanListAPIView.as_view(),
        name="membership-plans"
    ),

    path(
        "my-membership/",
        MyMembershipAPIView.as_view(),
        name="my-membership"
    ),

    # Razorpay
    path(
        "create-payment/",
        CreateMembershipPaymentAPIView.as_view(),
        name="create-membership-payment"
    ),

    path(
        "verify-payment/",
        VerifyMembershipPaymentAPIView.as_view(),
        name="verify-membership-payment"
    ),

    # Old API - keep if required
    path(
        "purchase/",
        PurchaseMembershipAPIView.as_view(),
        name="purchase-membership"
    ),

]