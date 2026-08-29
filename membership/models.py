from django.db import models
from django.utils import timezone
from datetime import timedelta

from accounts.models import Customer


class MembershipPlan(models.Model):

    DURATION_CHOICES = (
        (1, "1 Month"),
        (3, "3 Months"),
        (6, "6 Months"),
        (12, "1 Year"),
    )

    name = models.CharField(
        max_length=100,
        unique=True
    )

    description = models.TextField(
        blank=True
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    duration_months = models.PositiveIntegerField(
        choices=DURATION_CHOICES,
        default=1
    )

    discount_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    free_delivery = models.BooleanField(
        default=False
    )

    priority_support = models.BooleanField(
        default=False
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:

        ordering = ["price"]

    def __str__(self):

        return self.name


class CustomerMembership(models.Model):

    STATUS_CHOICES = (
        ("Active", "Active"),
        ("Expired", "Expired"),
        ("Cancelled", "Cancelled"),
        ("Pending", "Pending"),
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="memberships"
    )

    plan = models.ForeignKey(
        MembershipPlan,
        on_delete=models.PROTECT,
        related_name="members"
    )

    start_date = models.DateTimeField(
        default=timezone.now
    )

    end_date = models.DateTimeField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    payment_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    amount_paid = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:

        ordering = ["-created_at"]

    def save(self, *args, **kwargs):

        if not self.end_date:

            self.end_date = (
                self.start_date +
                timedelta(
                    days=self.plan.duration_months * 30
                )
            )

        super().save(*args, **kwargs)

    def __str__(self):

        return f"{self.customer.user.username} - {self.plan.name}"