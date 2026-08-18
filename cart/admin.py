from django.contrib import admin

from .models import Cart, CartItem


class CartItemAdmin(admin.TabularInline):

    model = CartItem

    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "customer",
        "created_at",
    )

    inlines = [
        CartItemAdmin,
    ]


@admin.register(CartItem)
class CartItemAdminView(admin.ModelAdmin):

    list_display = (
        "id",
        "cart",
        "product",
        "quantity",
        "subtotal",
    )