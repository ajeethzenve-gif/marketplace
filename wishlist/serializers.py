from rest_framework import serializers

from .models import Wishlist


class WishlistSerializer(serializers.ModelSerializer):


    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )


    category_name = serializers.CharField(
        source="product.category.category_name",
        read_only=True
    )


    brand_name = serializers.CharField(
        source="product.brand.brand_name",
        read_only=True
    )


    price = serializers.DecimalField(

        source="product.price",

        max_digits=10,

        decimal_places=2,

        read_only=True

    )


    product_image = serializers.SerializerMethodField()



    class Meta:

        model = Wishlist

        fields = [

            "id",

            "product",

            "product_name",

            "category_name",

            "brand_name",

            "price",

            "product_image",

            "created_at",

        ]



    def get_product_image(self, obj):


        request = self.context.get("request")


        if obj.product.image:


            image_url = obj.product.image.url


            if request:

                return request.build_absolute_uri(image_url)


            return image_url



        return None