# coupons/views.py
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Coupon
from cart.models import Cart
from .serializers import CouponSerializer,ApplyCouponSerializer

from products.permissions import IsAdminOrStaff
class CouponListCreateAPIView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdminOrStaff
    ]

    def get(self, request):

        coupons = Coupon.objects.all().order_by("-created_at")

        serializer = CouponSerializer(
            coupons,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):

        serializer = CouponSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(

                {
                    "message": "Coupon created successfully.",
                    "data": serializer.data
                },

                status=status.HTTP_201_CREATED

            )

        return Response(

            serializer.errors,

            status=status.HTTP_400_BAD_REQUEST

        )


class ApplyCouponAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = ApplyCouponSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        code = serializer.validated_data["code"].upper()
        cart_total = serializer.validated_data["cart_total"]

        try:
            coupon = Coupon.objects.get(
                code=code,
                is_active=True
            )
        except Coupon.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Invalid coupon code."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if coupon.expiry_date < timezone.now():
            return Response(
                {
                    "success": False,
                    "message": "Coupon has expired."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if cart_total < coupon.minimum_order_value:
            return Response(
                {
                    "success": False,
                    "message": f"Minimum order value is ₹{coupon.minimum_order_value}."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if coupon.discount_type == "Percentage":
            discount = (cart_total * coupon.discount_value) / 100
        else:
            discount = coupon.discount_value

        final_total = cart_total - discount

        return Response(
            {
                "success": True,
                "coupon": coupon.code,
                "discount": float(discount),
                "cart_total": float(cart_total),
                "final_total": float(final_total),
                "message": "Coupon applied successfully."
            },
            status=status.HTTP_200_OK
        )