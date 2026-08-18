from django.urls import path

from .views import (
    WishlistAPIView,
    ToggleWishlistAPIView,
    RemoveWishlistAPIView,
)


urlpatterns = [

    path(
        "",
        WishlistAPIView.as_view(),
        name="wishlist"
    ),


    path(
        "toggle/",
        ToggleWishlistAPIView.as_view(),
        name="toggle-wishlist"
    ),


    path(
        "remove/<int:product_id>/",
        RemoveWishlistAPIView.as_view(),
        name="remove-wishlist"
    ),

]