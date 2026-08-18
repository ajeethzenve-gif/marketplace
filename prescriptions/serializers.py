from rest_framework import serializers

from .models import (
    Prescription,
    PrescriptionMedicine
)


class PrescriptionMedicineSerializer(
    serializers.ModelSerializer
):

    product_name = serializers.CharField(
        source="matched_product.product_name",
        read_only=True
    )

    product_price = serializers.DecimalField(
        source="matched_product.price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    product_image = serializers.SerializerMethodField()

    class Meta:

        model = PrescriptionMedicine

        fields = [
            "id",
            "medicine_name",
            "active_ingredient",
            "strength",
            "dosage",
            "frequency",
            "duration",
            "pet_type",

            "matched_product",
            "product_name",
            "product_price",
            "product_image",

            "match_score",
            "is_matched",
            "created_at",
        ]

    def get_product_image(self, obj):

        request = self.context.get("request")

        if (
            obj.matched_product
            and obj.matched_product.image
        ):

            if request:

                return request.build_absolute_uri(
                    obj.matched_product.image.url
                )

            return obj.matched_product.image.url

        return None


class PrescriptionSerializer(
    serializers.ModelSerializer
):

    medicines = PrescriptionMedicineSerializer(
        many=True,
        read_only=True
    )

    class Meta:

        model = Prescription

        fields = [
            "id",
            "prescription_file",
            "extracted_text",
            "ai_result",
            "status",
            "uploaded_at",
            "analyzed_at",
            "medicines",
        ]