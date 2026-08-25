import razorpay

from decimal import Decimal

from django.conf import settings
from django.db import transaction

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Payment
from .serializers import CreatePaymentSerializer


# ==========================================
# RAZORPAY CLIENT
# ==========================================

razorpay_client = razorpay.Client(
    auth=(
        settings.RAZORPAY_KEY_ID,
        settings.RAZORPAY_KEY_SECRET,
    )
)


# ==========================================
# CREATE RAZORPAY ORDER
# ==========================================

class CreateRazorpayOrderAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = CreatePaymentSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        amount = serializer.validated_data["amount"]

        currency = serializer.validated_data.get(
            "currency",
            "INR"
        )

        try:

            # Razorpay requires amount in paise
            amount_in_paise = int(
                Decimal(amount) * 100
            )

            razorpay_order = razorpay_client.order.create(
                {
                    "amount": amount_in_paise,
                    "currency": currency,
                    "payment_capture": 1,
                }
            )

            # Save payment record
            Payment.objects.create(
                user=request.user,
                razorpay_order_id=razorpay_order["id"],
                amount=amount,
                currency=currency,
                status="created",
            )

            return Response(
                {
                    "success": True,
                    "razorpay_order_id": razorpay_order["id"],
                    "amount": razorpay_order["amount"],
                    "currency": razorpay_order["currency"],
                    "key": settings.RAZORPAY_KEY_ID,
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as error:

            print(
                "RAZORPAY CREATE ERROR:",
                str(error)
            )

            return Response(
                {
                    "success": False,
                    "message": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ==========================================
# VERIFY RAZORPAY PAYMENT
# ==========================================

class VerifyRazorpayPaymentAPIView(APIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        razorpay_payment_id = request.data.get(
            "razorpay_payment_id"
        )

        razorpay_order_id = request.data.get(
            "razorpay_order_id"
        )

        razorpay_signature = request.data.get(
            "razorpay_signature"
        )

        # ------------------------------------------
        # VALIDATE REQUIRED DATA
        # ------------------------------------------

        if not razorpay_payment_id:
            return Response(
                {
                    "success": False,
                    "message": "razorpay_payment_id is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not razorpay_order_id:
            return Response(
                {
                    "success": False,
                    "message": "razorpay_order_id is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not razorpay_signature:
            return Response(
                {
                    "success": False,
                    "message": "razorpay_signature is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            # ------------------------------------------
            # FIND PAYMENT
            # ------------------------------------------

            payment = Payment.objects.select_for_update().get(
                razorpay_order_id=razorpay_order_id,
                user=request.user
            )

            # Prevent duplicate verification
            if payment.status == "success":

                return Response(
                    {
                        "success": True,
                        "message": "Payment already verified.",
                        "payment_id": payment.razorpay_payment_id,
                    }
                )

            # ------------------------------------------
            # VERIFY RAZORPAY SIGNATURE
            # ------------------------------------------

            razorpay_client.utility.verify_payment_signature(
                {
                    "razorpay_order_id": razorpay_order_id,
                    "razorpay_payment_id": razorpay_payment_id,
                    "razorpay_signature": razorpay_signature,
                }
            )

            # ------------------------------------------
            # PAYMENT SUCCESS
            # ------------------------------------------

            payment.razorpay_payment_id = (
                razorpay_payment_id
            )

            payment.razorpay_signature = (
                razorpay_signature
            )

            payment.status = "success"

            payment.save()

            return Response(
                {
                    "success": True,
                    "message": "Payment verified successfully.",
                    "payment_id": razorpay_payment_id,
                    "razorpay_order_id": razorpay_order_id,
                },
                status=status.HTTP_200_OK
            )

        except Payment.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Payment record not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        except razorpay.errors.SignatureVerificationError:

            return Response(
                {
                    "success": False,
                    "message": "Payment signature verification failed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as error:

            print(
                "RAZORPAY VERIFY ERROR:",
                str(error)
            )

            return Response(
                {
                    "success": False,
                    "message": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )