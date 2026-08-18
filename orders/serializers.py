from rest_framework import serializers

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )

    product_image = serializers.ImageField(
        source="product.image",
        read_only=True
    )

    class Meta:

        model = OrderItem

        fields = [

            "id",

            "product",

            "product_name",

            "product_image",

            "quantity",

            "price",

            "subtotal",

        ]

class OrderSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(
        source="customer.user.username",
        read_only=True
    )

    items = OrderItemSerializer(
        many=True,
        read_only=True
    )

    total_items = serializers.SerializerMethodField()
    shipping_address = serializers.SerializerMethodField()

    def get_shipping_address(self, obj):

        address = obj.shipping_address

        if not address:
            return None

        return {

            "id": address.id,
            "full_name": address.full_name,
            "phone_number": address.phone_number,
            "address_line1": address.address_line1,
            "address_line2": address.address_line2,
            "city": address.city,
            "state": address.state,
            "country": address.country,
            "postal_code": address.postal_code,

        }

    # ADD THIS METHOD
    def get_total_items(self, obj):

        return sum(item.quantity for item in obj.items.all())

    class Meta:

        model = Order

        fields = [

            "id",
            "customer",
            "customer_name",
            "order_date",
            "status",
            "shipping_address",
            "payment_method",
            "payment_status",
            "total_amount",
            "total_items",
            "items",

        ]

        read_only_fields = [

            "customer",
            "order_date",
            "total_amount",

        ]