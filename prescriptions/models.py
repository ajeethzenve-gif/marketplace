from django.db import models
from django.conf import settings


class Prescription(models.Model):

    STATUS_CHOICES = [
        ("Uploaded", "Uploaded"),
        ("Processing", "Processing"),
        ("Analyzed", "Analyzed"),
        ("NeedsReview", "Needs Review"),
        ("Verified", "Verified"),
        ("Rejected", "Rejected"),
        ("Failed", "Failed"),
    ]

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="prescriptions"
    )

    prescription_file = models.FileField(
        upload_to="prescriptions/"
    )

    extracted_text = models.TextField(
        blank=True,
        null=True
    )

    ai_result = models.JSONField(
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="Uploaded"
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    analyzed_at = models.DateTimeField(
        blank=True,
        null=True
    )

    def __str__(self):
        return f"Prescription #{self.id}"

class PrescriptionMedicine(models.Model):

    prescription = models.ForeignKey(
        Prescription,
        on_delete=models.CASCADE,
        related_name="medicines"
    )

    medicine_name = models.CharField(
        max_length=255
    )

    active_ingredient = models.CharField(
        max_length=255,
        blank=True
    )

    strength = models.CharField(
        max_length=100,
        blank=True
    )

    dosage = models.CharField(
        max_length=255,
        blank=True
    )

    frequency = models.CharField(
        max_length=255,
        blank=True
    )

    duration = models.CharField(
        max_length=255,
        blank=True
    )

    pet_type = models.CharField(
        max_length=50,
        blank=True
    )

    matched_product = models.ForeignKey(
        "products.Product",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="prescription_matches"
    )

    match_score = models.FloatField(
        default=0
    )

    is_matched = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.medicine_name