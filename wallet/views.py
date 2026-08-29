import razorpay

from decimal import Decimal, InvalidOperation

from django.conf import settings
from django.db import transaction

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Wallet
from .serializers import (
    WalletSerializer,
    WalletTransactionSerializer,
)


# =========================================================
# RAZORPAY CLIENT
# =========================================================

def get_razorpay_client():

    if not settings.RAZORPAY_KEY_ID:
        raise ValueError(
            "RAZORPAY_KEY_ID is not configured."
        )

    if not settings.RAZORPAY_KEY_SECRET:
        raise ValueError(
            "RAZORPAY_KEY_SECRET is not configured."
        )

    return razorpay.Client(
        auth=(
            settings.RAZORPAY_KEY_ID,
            settings.RAZORPAY_KEY_SECRET,
        )
    )


# =========================================================
# EXISTING WALLET API
# =========================================================

class WalletAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        wallet, created = Wallet.objects.get_or_create(
            user=request.user
        )

        transactions = wallet.transactions.all().order_by(
            "-created_at"
        )

        return Response({
            "wallet": WalletSerializer(wallet).data,

            "transactions": WalletTransactionSerializer(
                transactions,
                many=True
            ).data
        })


# =========================================================
# CREATE RAZORPAY PAYMENT
# =========================================================

class CreateWalletPaymentAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        try:

            # ---------------------------------------------
            # GET AMOUNT
            # ---------------------------------------------

            amount = request.data.get("amount")

            if amount is None:

                return Response(
                    {
                        "message": "Amount is required."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # ---------------------------------------------
            # CONVERT AMOUNT
            # ---------------------------------------------

            try:

                amount = Decimal(str(amount))

            except (
                InvalidOperation,
                ValueError,
                TypeError
            ):

                return Response(
                    {
                        "message": "Invalid amount."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # ---------------------------------------------
            # VALIDATE AMOUNT
            # ---------------------------------------------

            if amount < Decimal("10"):

                return Response(
                    {
                        "message":
                            "Minimum amount is ₹10."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # ---------------------------------------------
            # RAZORPAY USES PAISE
            # ₹500 = 50000 PAISE
            # ---------------------------------------------

            amount_paise = int(amount * 100)


            # ---------------------------------------------
            # RAZORPAY CLIENT
            # ---------------------------------------------

            client = get_razorpay_client()


            # ---------------------------------------------
            # CREATE ORDER
            # ---------------------------------------------

            order_data = {

                "amount": amount_paise,

                "currency": "INR",

                "receipt":
                    f"wallet_{request.user.id}_{amount_paise}",

                "notes": {

                    "user_id":
                        str(request.user.id),

                    "purpose":
                        "Wallet Recharge",

                },
            }


            print(
                "Creating Razorpay order:",
                order_data
            )


            razorpay_order = client.order.create(
                data=order_data
            )


            print(
                "Razorpay order created:",
                razorpay_order
            )


            # ---------------------------------------------
            # RETURN DATA TO REACT
            # ---------------------------------------------

            return Response(
                {

                    "success": True,

                    "key":
                        settings.RAZORPAY_KEY_ID,

                    "razorpay_order_id":
                        razorpay_order["id"],

                    "amount":
                        razorpay_order["amount"],

                    "currency":
                        razorpay_order["currency"],

                },
                status=status.HTTP_200_OK
            )


        except Exception as e:

            print(
                "===================================="
            )

            print(
                "RAZORPAY CREATE ORDER ERROR:"
            )

            print(str(e))

            print(
                "===================================="
            )


            return Response(
                {

                    "success": False,

                    "message":
                        "Unable to create Razorpay payment.",

                    "error":
                        str(e),

                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# =========================================================
# VERIFY RAZORPAY PAYMENT
# =========================================================

class VerifyWalletPaymentAPIView(APIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        try:

            # ---------------------------------------------
            # GET PAYMENT DATA
            # ---------------------------------------------

            razorpay_order_id = request.data.get(
                "razorpay_order_id"
            )

            razorpay_payment_id = request.data.get(
                "razorpay_payment_id"
            )

            razorpay_signature = request.data.get(
                "razorpay_signature"
            )

            amount = request.data.get(
                "amount"
            )


            # ---------------------------------------------
            # VALIDATION
            # ---------------------------------------------

            if not razorpay_order_id:

                return Response(
                    {
                        "message":
                            "Razorpay order ID is required."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            if not razorpay_payment_id:

                return Response(
                    {
                        "message":
                            "Razorpay payment ID is required."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            if not razorpay_signature:

                return Response(
                    {
                        "message":
                            "Razorpay signature is required."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            if amount is None:

                return Response(
                    {
                        "message":
                            "Amount is required."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # ---------------------------------------------
            # CONVERT AMOUNT
            # ---------------------------------------------

            try:

                amount = Decimal(
                    str(amount)
                )

            except (
                InvalidOperation,
                ValueError,
                TypeError
            ):

                return Response(
                    {
                        "message":
                            "Invalid amount."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # ---------------------------------------------
            # GET WALLET
            # ---------------------------------------------

            wallet, created = Wallet.objects.get_or_create(
                user=request.user
            )


            # ---------------------------------------------
            # FIND TRANSACTION
            # ---------------------------------------------
            #
            # IMPORTANT:
            #
            # This assumes your WalletTransaction model
            # has razorpay_order_id.
            #
            # If it doesn't, add that field to your model.
            #
            # ---------------------------------------------

            try:

                wallet_transaction = (
                    wallet.transactions
                    .select_for_update()
                    .get(
                        razorpay_order_id=
                            razorpay_order_id
                    )
                )

            except Wallet.transactions.model.DoesNotExist:

                return Response(
                    {
                        "message":
                            "Payment transaction not found."
                    },
                    status=status.HTTP_404_NOT_FOUND
                )


            # ---------------------------------------------
            # PREVENT DUPLICATE CREDIT
            # ---------------------------------------------

            if wallet_transaction.status == "SUCCESS":

                return Response(
                    {

                        "success": True,

                        "message":
                            "Payment already verified.",

                        "balance":
                            str(wallet.balance),

                    },
                    status=status.HTTP_200_OK
                )


            # ---------------------------------------------
            # VERIFY RAZORPAY SIGNATURE
            # ---------------------------------------------

            client = get_razorpay_client()


            verification_data = {

                "razorpay_order_id":
                    razorpay_order_id,

                "razorpay_payment_id":
                    razorpay_payment_id,

                "razorpay_signature":
                    razorpay_signature,

            }


            print(
                "Verifying Razorpay payment..."
            )


            client.utility.verify_payment_signature(
                verification_data
            )


            print(
                "Razorpay signature verified."
            )


            # ---------------------------------------------
            # VERIFY AMOUNT
            # ---------------------------------------------

            if amount != wallet_transaction.amount:

                return Response(
                    {
                        "message":
                            "Payment amount does not match."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # ---------------------------------------------
            # CREDIT WALLET
            # ---------------------------------------------

            wallet.balance += amount

            wallet.save(
                update_fields=[
                    "balance"
                ]
            )


            # ---------------------------------------------
            # UPDATE TRANSACTION
            # ---------------------------------------------

            wallet_transaction.status = "SUCCESS"

            wallet_transaction.razorpay_payment_id = (
                razorpay_payment_id
            )

            wallet_transaction.save(
                update_fields=[
                    "status",
                    "razorpay_payment_id",
                ]
            )


            # ---------------------------------------------
            # RESPONSE
            # ---------------------------------------------

            return Response(
                {

                    "success": True,

                    "message":
                        "Wallet recharge successful.",

                    "amount":
                        str(amount),

                    "balance":
                        str(wallet.balance),

                    "razorpay_order_id":
                        razorpay_order_id,

                    "razorpay_payment_id":
                        razorpay_payment_id,

                },
                status=status.HTTP_200_OK
            )


        except razorpay.errors.SignatureVerificationError:

            return Response(
                {

                    "success": False,

                    "message":
                        "Payment authentication failed. Invalid Razorpay signature.",

                },
                status=status.HTTP_400_BAD_REQUEST
            )


        except Exception as e:

            print(
                "===================================="
            )

            print(
                "RAZORPAY VERIFY ERROR:"
            )

            print(str(e))

            print(
                "===================================="
            )


            return Response(
                {

                    "success": False,

                    "message":
                        "Payment verification failed.",

                    "error":
                        str(e),

                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )