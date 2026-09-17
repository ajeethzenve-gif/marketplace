from rest_framework import serializers
from .models import Order, OrderItem


class OrderShippingAddressSerializer(serializers.Serializer):
    id = serializers.CharField(required=False, allow_blank=True)
    fullName = serializers.CharField(max_length=100)
    mobile = serializers.CharField(max_length=20)
    email = serializers.EmailField(required=False, allow_blank=True)
    addressLine1 = serializers.CharField(max_length=255)
    addressLine2 = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True
    )
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    pincode = serializers.CharField(max_length=20)
    country = serializers.CharField(
        max_length=100,
        default="India"
    )


class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "quantity",
            "price",
            "subtotal",
        ]


class OrderSerializer(serializers.ModelSerializer):

    id = serializers.SerializerMethodField()
    orderNumber = serializers.SerializerMethodField()
    userId = serializers.SerializerMethodField()
    items = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()
    discount = serializers.SerializerMethodField()
    shipping = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    paymentStatus = serializers.SerializerMethodField()
    orderStatus = serializers.SerializerMethodField()
    paymentMethod = serializers.SerializerMethodField()
    shippingAddress = serializers.SerializerMethodField()
    estimatedDelivery = serializers.SerializerMethodField()
    createdAt = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "orderNumber",
            "userId",
            "items",
            "subtotal",
            "discount",
            "shipping",
            "total",
            "paymentStatus",
            "orderStatus",
            "paymentMethod",
            "shippingAddress",
            "estimatedDelivery",
            "createdAt",
        ]

    def get_id(self, obj):
        return f"ord-{obj.id}"

    def get_orderNumber(self, obj):
        return f"ZNV-{obj.id:06d}"

    def get_userId(self, obj):
        return str(obj.customer.user_id)

    def get_items(self, obj):
        items = OrderItem.objects.filter(order=obj)

        return [
            {
                "id": item.id,
                "product": item.product.id,
                "quantity": item.quantity,
                "price": float(item.price),
                "subtotal": float(item.subtotal),
            }
            for item in items
        ]

    def get_subtotal(self, obj):
        return float(obj.subtotal)

    def get_discount(self, obj):
        return float(obj.discount_amount)

    def get_shipping(self, obj):
        return float(obj.shipping_charge)

    def get_total(self, obj):
        return float(obj.total_amount)

    def get_paymentStatus(self, obj):
        return (obj.payment_status or "Pending").lower()

    def get_orderStatus(self, obj):
        return (obj.status or "Pending").lower()

    def get_paymentMethod(self, obj):
        return (obj.payment_method or "Cash on Delivery").lower()

    def get_shippingAddress(self, obj):
        address = obj.shipping_address

        if not address:
            return None

        return {
            "id": str(address.id),
            "fullName": address.full_name,
            "mobile": address.phone_number,
            "email": getattr(address, "email", ""),
            "addressLine1": address.address_line1,
            "addressLine2": address.address_line2 or "",
            "city": address.city,
            "state": address.state,
            "pincode": address.postal_code,
            "country": address.country,
        }

    def get_estimatedDelivery(self, obj):
        return "3-5 Business Days"

    def get_createdAt(self, obj):
        return obj.order_date