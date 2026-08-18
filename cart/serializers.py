from rest_framework import serializers

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):

    product_id = serializers.IntegerField(
        source="product.id",
        read_only=True
    )

    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )

    price = serializers.DecimalField(
        source="product.price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    image = serializers.ImageField(
        source="product.image",
        read_only=True
    )

    subtotal = serializers.SerializerMethodField()

    class Meta:

        model = CartItem

        fields = [

            "id",

            "product_id",

            "product_name",

            "image",

            "price",

            "quantity",

            "subtotal",

        ]

    def get_subtotal(self, obj):

        return obj.product.price * obj.quantity


class CartSerializer(serializers.ModelSerializer):

    items = CartItemSerializer(
        many=True,
        read_only=True
    )

    total_items = serializers.SerializerMethodField()

    subtotal = serializers.SerializerMethodField()

    shipping_charge = serializers.SerializerMethodField()

    total_price = serializers.SerializerMethodField()

    class Meta:

        model = Cart

        fields = [

            "id",

            "customer",

            "items",

            "total_items",

            "subtotal",

            "shipping_charge",

            "total_price",

        ]

    def get_total_items(self, obj):

        return sum(

            item.quantity

            for item in obj.items.all()

        )

    def get_subtotal(self, obj):

        return sum(

            item.product.price * item.quantity

            for item in obj.items.all()

        )

    def get_shipping_charge(self, obj):

        subtotal = self.get_subtotal(obj)

        if subtotal == 0:

            return 0

        if subtotal >= 500:

            return 0

        return 50

    def get_total_price(self, obj):

        subtotal = self.get_subtotal(obj)

        shipping = self.get_shipping_charge(obj)

        return subtotal + shipping