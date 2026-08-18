
from cart.models import Cart
from accounts.permissions import IsAdminOrStaff
from decimal import Decimal
from django.utils import timezone

from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from accounts.models import Customer,CustomerAddress
from products.models import Product
from coupons.models import Coupon

from .models import Order, OrderItem
from .serializers import OrderSerializer
from .utils import send_order_status_email


class PlaceOrderAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        customer = get_object_or_404(
            Customer,
            user=request.user
        )

        product = get_object_or_404(
            Product,
            id=request.data.get("product_id")
        )

        quantity = int(request.data.get("quantity", 1))

        if quantity > product.stock:

            return Response(
                {
                    "message": f"Only {product.stock} item(s) available."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        shipping_address = get_object_or_404(
            CustomerAddress,
            id=request.data.get("shipping_address"),
            customer=customer
        )

        payment_method = request.data.get(
            "payment_method",
            "Cash on Delivery"
        )

        subtotal = Decimal(str(product.price * quantity))

        shipping_charge = Decimal(
            str(request.data.get("shipping_charge", 0))
        )

        coupon_code = request.data.get("coupon_code")

        coupon = None

        discount_amount = Decimal("0.00")

        if coupon_code:

            try:

                coupon = Coupon.objects.get(
                    code=coupon_code.upper(),
                    is_active=True
                )

                if coupon.expiry_date < timezone.now():

                    return Response(
                        {
                            "message": "Coupon has expired."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

                if subtotal < coupon.minimum_order_value:

                    return Response(
                        {
                            "message": f"Minimum order value should be ₹{coupon.minimum_order_value}"
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

                if coupon.discount_type == "Percentage":

                    discount_amount = (
                        subtotal * coupon.discount_value
                    ) / Decimal("100")

                else:

                    discount_amount = coupon.discount_value

            except Coupon.DoesNotExist:

                return Response(
                    {
                        "message": "Invalid coupon code."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        total_amount = (
            subtotal +
            shipping_charge -
            discount_amount
        )

        if total_amount < 0:

            total_amount = Decimal("0.00")

        order = Order.objects.create(

            customer=customer,

            shipping_address=shipping_address,

            payment_method=payment_method,

            payment_status="Pending",

            status="Pending",

            subtotal=subtotal,

            shipping_charge=shipping_charge,

            coupon=coupon,

            coupon_code=coupon.code if coupon else None,

            discount_amount=discount_amount,

            total_amount=total_amount

        )

        OrderItem.objects.create(

            order=order,

            product=product,

            quantity=quantity,

            price=product.price,

            subtotal=subtotal

        )

        product.stock -= quantity

        product.save()

        serializer = OrderSerializer(order)

        return Response(

            {

                "message": "Order placed successfully.",

                "order": serializer.data

            },

            status=status.HTTP_201_CREATED

        )
class OrderHistoryAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        customer = get_object_or_404(

        Customer,

            user=request.user

        )

        orders = Order.objects.filter(

            customer=customer

        ).order_by("-order_date")

        serializer = OrderSerializer(

            orders,

            many=True

        )

        return Response(serializer.data)

class OrderDetailsAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        customer = get_object_or_404(

            Customer,

            user=request.user

        )

        order = get_object_or_404(

            Order,

            id=pk,

            customer=customer

        )

        serializer = OrderSerializer(order)

        return Response(serializer.data)

class UpdateOrderStatusAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        order = get_object_or_404(
            Order,
            id=pk
        )

        new_status = request.data.get("status")

        valid_status = [

            "Pending",
            "Confirmed",
            "Packed",
            "Shipped",
            "Delivered",
            "Cancelled"

        ]

        if new_status not in valid_status:

            return Response(
                {
                    "message": "Invalid status."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if order.status == new_status:

            return Response(
                {
                    "message": "Order already has this status."
                }
            )

        order.status = new_status
        order.save()

        # Send Email
        send_order_status_email(order)

        serializer = OrderSerializer(order)

        return Response(
            {
                "message": "Status updated successfully.",
                "order": serializer.data
            }
        )
class TotalOrdersAPIView(APIView):

    permission_classes = [IsAdminOrStaff]

    def get(self, request):

        return Response({
            "total_orders": Order.objects.count()
        })

class AdminOrderListAPIView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdminOrStaff
    ]

    def get(self, request):

        orders = Order.objects.all().order_by("-id")

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(serializer.data)
class PlaceCartOrderAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        customer = get_object_or_404(
            Customer,
            user=request.user
        )

        address = get_object_or_404(
            CustomerAddress,
            id=request.data.get("shipping_address"),
            customer=customer
        )

        payment_method = request.data.get(
            "payment_method",
            "Cash on Delivery"
        )

        coupon_code = request.data.get("coupon_code")

        cart = get_object_or_404(
            Cart,
            customer=customer
        )

        cart_items = cart.items.select_related("product")

        if not cart_items.exists():

            return Response(
                {
                    "message": "Cart is empty."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ==========================
        # Stock Validation
        # ==========================

        for item in cart_items:

            if item.quantity > item.product.stock:

                return Response(
                    {
                        "message": f"{item.product.product_name} has only {item.product.stock} item(s) available."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        # ==========================
        # Calculate Subtotal
        # ==========================

        subtotal = Decimal("0.00")

        for item in cart_items:

            subtotal += item.product.price * item.quantity

        # ==========================
        # Shipping Charge
        # ==========================

        shipping_charge = Decimal("50.00")

        # Free shipping example
        if subtotal >= Decimal("500"):

            shipping_charge = Decimal("0.00")

        # ==========================
        # Coupon Validation
        # ==========================

        coupon = None
        discount_amount = Decimal("0.00")

        if coupon_code:

            try:

                coupon = Coupon.objects.get(
                    code=coupon_code.upper(),
                    is_active=True
                )

            except Coupon.DoesNotExist:

                return Response(
                    {
                        "message": "Invalid coupon code."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if coupon.expiry_date < timezone.now():

                return Response(
                    {
                        "message": "Coupon has expired."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if subtotal < coupon.minimum_order_value:

                return Response(
                    {
                        "message": f"Minimum order value should be ₹{coupon.minimum_order_value}."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if coupon.discount_type == "Percentage":

                discount_amount = (
                    subtotal * coupon.discount_value
                ) / Decimal("100")

            elif coupon.discount_type == "Flat":

                discount_amount = coupon.discount_value

        # ==========================
        # Final Total
        # ==========================

        total_amount = (
            subtotal +
            shipping_charge -
            discount_amount
        )

        if total_amount < Decimal("0.00"):

            total_amount = Decimal("0.00")

        # ==========================
        # Create Order
        # ==========================

        order = Order.objects.create(

            customer=customer,

            shipping_address=address,

            payment_method=payment_method,

            payment_status="Pending",

            status="Pending",

            subtotal=subtotal,

            shipping_charge=shipping_charge,

            coupon=coupon,

            coupon_code=coupon.code if coupon else "",

            discount_amount=discount_amount,

            total_amount=total_amount

        )

        # ==========================
        # Create Order Items
        # ==========================

        for item in cart_items:

            OrderItem.objects.create(

                order=order,

                product=item.product,

                quantity=item.quantity,

                price=item.product.price,

                subtotal=item.product.price * item.quantity

            )

            item.product.stock -= item.quantity
            item.product.save()

        # ==========================
        # Clear Cart
        # ==========================

        cart_items.delete()

        # ==========================
        # Response
        # ==========================

        serializer = OrderSerializer(order)

        return Response(
            {
                "message": "Order placed successfully.",
                "order": serializer.data
            },
            status=status.HTTP_201_CREATED
        )

class CancelOrderAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        customer = get_object_or_404(
            Customer,
            user=request.user
        )

        order = get_object_or_404(
            Order,
            id=pk,
            customer=customer
        )

        if order.status not in ["Placed", "Confirmed", "Pending"]:

            return Response(
                {"message": "Order cannot be cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = "Cancelled"
        order.save()

        return Response(
            {"message": "Order cancelled successfully."},
            status=status.HTTP_200_OK
        )

