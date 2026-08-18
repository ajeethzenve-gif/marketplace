from django.db import models

from accounts.models import Customer, CustomerAddress
from products.models import Product
from coupons.models import Coupon


class Order(models.Model):

    STATUS_CHOICES = (

        ("Pending", "Pending"),
        ("Confirmed", "Confirmed"),
        ("Packed", "Packed"),
        ("Shipped", "Shipped"),
        ("Delivered", "Delivered"),
        ("Cancelled", "Cancelled"),

    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="orders"
    )

    order_date = models.DateTimeField(
        auto_now_add=True
    )

    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    shipping_charge = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    coupon = models.ForeignKey(
        Coupon,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders"
    )

    coupon_code = models.CharField(
        max_length=30,
        blank=True,
        null=True
    )

    discount_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    shipping_address = models.ForeignKey(
        CustomerAddress,
        on_delete=models.PROTECT
    )

    payment_method = models.CharField(
        max_length=50,
        default="Cash on Delivery"
    )

    payment_status = models.CharField(
        max_length=20,
        default="Pending"
    )

    def __str__(self):

        return f"Order #{self.id} - {self.customer.user.username}"

class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    quantity = models.PositiveIntegerField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    def save(self, *args, **kwargs):

        self.subtotal = self.price * self.quantity

        super().save(*args, **kwargs)

    def __str__(self):

        return f"{self.product.product_name} ({self.quantity})"