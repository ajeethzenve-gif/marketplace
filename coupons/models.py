from django.db import models


class Coupon(models.Model):
    DISCOUNT_TYPE_CHOICES = (
        ("Flat", "Flat"),
        ("Percentage", "Percentage"),
    )

    code = models.CharField(
        max_length=30,
        unique=True
    )

    discount_type = models.CharField(
        max_length=20,
        choices=DISCOUNT_TYPE_CHOICES
    )

    # Flat Amount (₹100) or Percentage (10%)
    discount_value = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    minimum_order_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    expiry_date = models.DateTimeField()

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.code