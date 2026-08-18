# coupons/services.py

from decimal import Decimal
from django.utils import timezone
from .models import Coupon


def validate_coupon(coupon_code, cart_total):
    """
    Validate a coupon and calculate the discount.
    """

    coupon_code = coupon_code.strip().upper()

    try:
        coupon = Coupon.objects.get(
            code=coupon_code,
            is_active=True
        )

    except Coupon.DoesNotExist:
        return {
            "success": False,
            "message": "Invalid coupon code."
        }

    # Expired Coupon
    if coupon.expiry_date <= timezone.now():
        return {
            "success": False,
            "message": "This coupon has expired."
        }

    # Minimum Order Validation
    if cart_total < coupon.minimum_order_value:
        return {
            "success": False,
            "message": (
                f"Minimum order value should be "
                f"₹{coupon.minimum_order_value}."
            )
        }

    # Calculate Discount
    if coupon.discount_type == "Flat":
        discount = coupon.discount_value

    else:
        discount = (
            cart_total * coupon.discount_value
        ) / Decimal("100")

        if coupon.maximum_discount:
            discount = min(
                discount,
                coupon.maximum_discount
            )

    # Discount cannot exceed cart total
    discount = min(discount, cart_total)

    final_total = cart_total - discount

    return {
        "success": True,
        "coupon": coupon.code,
        "discount": discount,
        "cart_total": cart_total,
        "final_total": final_total
    }