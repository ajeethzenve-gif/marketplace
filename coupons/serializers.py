# coupons/serializers.py

from rest_framework import serializers
from .models import Coupon

class CouponSerializer(serializers.ModelSerializer):

    class Meta:

        model = Coupon

        fields = "__all__"

    def validate_code(self, value):

        value = value.upper()

        if Coupon.objects.filter(code=value).exists():

            raise serializers.ValidationError(
                "Coupon code already exists."
            )

        return value

    def validate(self, attrs):

        if (
            attrs["discount_type"] == "Percentage"
            and attrs["discount_value"] > 100
        ):

            raise serializers.ValidationError({

                "discount_value":
                "Percentage discount cannot exceed 100."

            })

        return attrs

class ApplyCouponSerializer(serializers.Serializer):

    code = serializers.CharField(max_length=30)

    cart_total = serializers.DecimalField(
        max_digits=10,
        decimal_places=2
    )