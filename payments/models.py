from django.conf import settings
from django.db import models


class Payment(models.Model):
    GATEWAY_CHOICES = (
        ("razorpay", "Razorpay"),
        ("stripe", "Stripe"),
        ("cod", "Cash on Delivery"),
    )

    STATUS_CHOICES = (
        ("created", "Created"),
        ("authorized", "Authorized"),
        ("captured", "Captured"),
        ("failed", "Failed"),
    )

    order = models.ForeignKey(
        "orders.Order",
        on_delete=models.PROTECT,
        related_name="payments",
        null=True,
        blank=True,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payments",
    )

    # Keep this existing field so Django does not mistake it
    # for gateway_order_id during migration.
    razorpay_payment_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        db_index=True,
    )

    # New field: created before the customer pays.
    gateway_order_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        db_index=True,
    )

    gateway = models.CharField(
        max_length=20,
        choices=GATEWAY_CHOICES,
        default="razorpay",
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    currency = models.CharField(
        max_length=10,
        default="INR",
    )

    signature = models.CharField(
        max_length=500,
        blank=True,
        null=True,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="created",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        order_number = (
            self.order.order_number
            if self.order_id
            else "No order"
        )
        return f"{order_number} - {self.gateway} - {self.amount}"