from rest_framework import serializers


class CreatePaymentSerializer(serializers.Serializer):

    amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        min_value=1
    )

    currency = serializers.CharField(
        required=False,
        default="INR"
    )