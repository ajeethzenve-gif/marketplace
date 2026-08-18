from rest_framework import serializers

from .models import Product, Category, Brand,ProductImage
from reviews.models import Review
from wishlist.models import Wishlist


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"



class ProductSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source="category.category_name",
        read_only=True
    )

    brand_name = serializers.CharField(
        source="brand.brand_name",
        read_only=True
    )


    product_image = serializers.SerializerMethodField()

    average_rating = serializers.SerializerMethodField()

    in_wishlist = serializers.SerializerMethodField()



    class Meta:

        model = Product

        fields = [

            "id",

            "category",
            "category_name",

            "brand",
            "brand_name",

            "product_name",
            "description",

            "sku",

            "pet_type",

            "price",

            "stock",

            "weight",

            "is_available",

            "product_type",

            "image",

            "product_image",

            "average_rating",

            "in_wishlist",

            "created_at",
            "updated_at",

        ]



    # ==========================
    # Product Image URL
    # ==========================

    def get_product_image(self, obj):

        request = self.context.get("request")


        if obj.image:

            if request:

                return request.build_absolute_uri(
                    obj.image.url
                )

            return obj.image.url


        return None



    # ==========================
    # Average Review Rating
    # ==========================

    def get_average_rating(self, obj):

        reviews = Review.objects.filter(
            product=obj
        )


        if reviews.exists():

            total = sum(
                review.rating
                for review in reviews
            )

            return round(
                total / reviews.count(),
                1
            )


        return 0



    # ==========================
    # Wishlist Status
    # ==========================

    def get_in_wishlist(self, obj):

        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return False

        try:

            customer = request.user.customer

            return Wishlist.objects.filter(

                customer=customer,

                product=obj

            ).exists()


        except Exception:

            return False

class BrandSerializer(serializers.ModelSerializer):

    class Meta:
        model = Brand
        fields = "__all__"


class ProductImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductImage
        fields = "__all__"