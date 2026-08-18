from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(
        source="customer.user.username",
        read_only=True
    )

    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )

    product_image = serializers.SerializerMethodField()

    class Meta:

        model = Review

        fields = [

            "id",

            "customer",

            "customer_name",

            "product",

            "product_name",

            "product_image",

            "rating",

            "review",

            "created_at",

        ]

        read_only_fields = [

            "customer",

            "customer_name",

            "product_name",

            "product_image",

            "created_at",

            "updated_at",

        ]

    def get_product_image(self, obj):

        image = obj.product.images.filter(
            is_primary=True
        ).first()

        if image:

            return image.image.url

        image = obj.product.images.first()

        if image:

            return image.image.url

        return None

    def validate_rating(self, value):

        if value < 1 or value > 5:

            raise serializers.ValidationError(
                "Rating must be between 1 and 5."
            )

        return value