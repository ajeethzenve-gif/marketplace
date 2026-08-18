from django.db import models

from accounts.models import Customer

from products.models import Product


class Wishlist(models.Model):

    customer = models.ForeignKey(Customer,on_delete=models.CASCADE)
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:

        unique_together = (

            "customer",

            "product"

        )