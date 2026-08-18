from django.db import models
from django.contrib.auth.models import User

from accounts.models import Customer
from products.models import Product


class Review(models.Model):

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    rating = models.IntegerField()

    review = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:

        unique_together = ("customer", "product")

    def __str__(self):

        return f"{self.customer} - {self.product}"