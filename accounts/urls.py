from django.urls import path
from .views import (RegisterAPIView,
                    LoginAPIView,
                    GoogleLoginAPIView,
                    ProfileAPIView,
                    UpdateProfileAPIView,
                    CustomerListAPIView,
                    CustomerAddressListCreateAPIView,
                    CustomerAddressDetailAPIView,
                    PetProfileListCreateAPIView,
                    PetProfileDetailAPIView,
                    ForgotPasswordAPIView,
                    VerifyPasswordOTPAPIView,
                    ResetPasswordAPIView,
                    )

urlpatterns = [

    path("register/",RegisterAPIView.as_view(),name="register"),
    path("login/",LoginAPIView.as_view(),name="login"),
    path("google-login/",GoogleLoginAPIView.as_view()),
    path("profile/",ProfileAPIView.as_view(),name="profile"),
    path("profile/update/",UpdateProfileAPIView.as_view(),name="profile-update"),

    path(
        "customers/",
        CustomerListAPIView.as_view(),
        name="customer-list"
    ),
    path(
        "addresses/",
        CustomerAddressListCreateAPIView.as_view()
    ),

    path(
        "addresses/<int:pk>/",
        CustomerAddressDetailAPIView.as_view()
    ),
    path(
        "pets/",
        PetProfileListCreateAPIView.as_view(),
        name="pet-list-create"
    ),

    path(
        "pets/<int:pk>/",
        PetProfileDetailAPIView.as_view(),
        name="pet-detail"
    ),
    path(
        "forgot-password/",
        ForgotPasswordAPIView.as_view(),
        name="forgot-password"
    ),

    path(
        "verify-otp/",
        VerifyPasswordOTPAPIView.as_view(),
        name="verify-otp"
    ),

    path(
        "reset-password/",
        ResetPasswordAPIView.as_view(),
        name="reset-password"
    ),

]