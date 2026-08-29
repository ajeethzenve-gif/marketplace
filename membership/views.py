import razorpay

from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import transaction
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status

from accounts.models import Customer

from .models import (
    MembershipPlan,
    CustomerMembership
)

from .serializers import (
    MembershipPlanSerializer,
    CustomerMembershipSerializer
)


# ============================================================
# RAZORPAY CLIENT
# ============================================================

def get_razorpay_client():

    return razorpay.Client(
        auth=(
            settings.RAZORPAY_KEY_ID,
            settings.RAZORPAY_KEY_SECRET
        )
    )


# ============================================================
# GET ALL ACTIVE MEMBERSHIP PLANS
# ============================================================

class MembershipPlanListAPIView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        plans = MembershipPlan.objects.filter(
            is_active=True
        ).order_by("price")

        serializer = MembershipPlanSerializer(
            plans,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# ============================================================
# GET CURRENT CUSTOMER MEMBERSHIP
# ============================================================

class MyMembershipAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        customer = get_object_or_404(
            Customer,
            user=request.user
        )

        membership = (
            CustomerMembership.objects
            .filter(
                customer=customer,
                status="Active",
                end_date__gte=timezone.now()
            )
            .select_related("plan")
            .order_by("-created_at")
            .first()
        )

        if not membership:

            return Response(
                {
                    "has_membership": False,

                    "membership": None,

                    "discount_percentage": 0
                },
                status=status.HTTP_200_OK
            )

        serializer = CustomerMembershipSerializer(
            membership
        )

        discount_percentage = (
            membership.plan.discount_percentage
        )

        return Response(
            {
                "has_membership": True,

                "membership":
                    serializer.data,

                "discount_percentage":
                    discount_percentage,

                "plan": {

                    "id":
                        membership.plan.id,

                    "name":
                        membership.plan.name,

                    "discount_percentage":
                        membership.plan.discount_percentage,

                    "free_delivery":
                        membership.plan.free_delivery,

                    "priority_support":
                        membership.plan.priority_support,

                }
            },
            status=status.HTTP_200_OK
        )


# ============================================================
# CREATE RAZORPAY MEMBERSHIP ORDER
#
# POST:
# /api/membership/create-payment/
#
# Request:
# {
#     "plan_id": 1
# }
# ============================================================

class CreateMembershipPaymentAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        try:

            # ------------------------------------------------
            # GET PLAN ID
            # ------------------------------------------------

            plan_id = request.data.get(
                "plan_id"
            )

            if not plan_id:

                return Response(
                    {
                        "message":
                            "Membership plan is required."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # ------------------------------------------------
            # GET CUSTOMER
            # ------------------------------------------------

            customer = get_object_or_404(
                Customer,
                user=request.user
            )


            # ------------------------------------------------
            # GET ACTIVE PLAN
            # ------------------------------------------------

            plan = get_object_or_404(
                MembershipPlan,
                id=plan_id,
                is_active=True
            )


            # ------------------------------------------------
            # CHECK EXISTING MEMBERSHIP
            # ------------------------------------------------

            active_membership = (
                CustomerMembership.objects
                .filter(
                    customer=customer,
                    status="Active",
                    end_date__gte=timezone.now()
                )
                .select_related("plan")
                .first()
            )


            if active_membership:

                return Response(
                    {
                        "message":
                            "You already have an active membership."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # ------------------------------------------------
            # PRICE
            # ------------------------------------------------

            amount_paise = int(
                plan.price * 100
            )


            if amount_paise <= 0:

                return Response(
                    {
                        "message":
                            "Invalid membership price."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # ------------------------------------------------
            # RAZORPAY CLIENT
            # ------------------------------------------------

            client = get_razorpay_client()


            # ------------------------------------------------
            # CREATE RAZORPAY ORDER
            # ------------------------------------------------

            order_data = {

                "amount":
                    amount_paise,

                "currency":
                    "INR",

                "receipt":
                    f"membership_{customer.id}_{plan.id}",

                "notes": {

                    "customer_id":
                        str(customer.id),

                    "user_id":
                        str(request.user.id),

                    "plan_id":
                        str(plan.id),

                    "purpose":
                        "Membership Purchase"

                }
            }


            print(
                "Creating Razorpay membership order:",
                order_data
            )


            razorpay_order = client.order.create(
                data=order_data
            )


            print(
                "Razorpay membership order created:",
                razorpay_order
            )


            # ------------------------------------------------
            # RESPONSE
            # ------------------------------------------------

            return Response(
                {

                    "success":
                        True,

                    "key":
                        settings.RAZORPAY_KEY_ID,

                    "razorpay_order_id":
                        razorpay_order["id"],

                    "amount":
                        razorpay_order["amount"],

                    "currency":
                        razorpay_order["currency"],

                    "plan_id":
                        plan.id,

                    "plan_name":
                        plan.name,

                    "plan_price":
                        str(plan.price),

                },
                status=status.HTTP_200_OK
            )


        except Exception as e:

            print(
                "======================================"
            )

            print(
                "RAZORPAY MEMBERSHIP CREATE ERROR:"
            )

            print(
                str(e)
            )

            print(
                "======================================"
            )


            return Response(
                {

                    "success":
                        False,

                    "message":
                        "Unable to create Razorpay payment.",

                    "error":
                        str(e)

                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ============================================================
# VERIFY RAZORPAY MEMBERSHIP PAYMENT
#
# POST:
# /api/membership/verify-payment/
#
# Request:
#
# {
#     "plan_id": 1,
#     "razorpay_order_id": "order_xxx",
#     "razorpay_payment_id": "pay_xxx",
#     "razorpay_signature": "xxx"
# }
# ============================================================

class VerifyMembershipPaymentAPIView(APIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        try:

            # ------------------------------------------------
            # GET PAYMENT DATA
            # ------------------------------------------------

            plan_id = request.data.get(
                "plan_id"
            )

            razorpay_order_id = request.data.get(
                "razorpay_order_id"
            )

            razorpay_payment_id = request.data.get(
                "razorpay_payment_id"
            )

            razorpay_signature = request.data.get(
                "razorpay_signature"
            )


            # ------------------------------------------------
            # VALIDATION
            # ------------------------------------------------

            if not plan_id:

                return Response(
                    {
                        "message":
                            "Membership plan is required."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


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


            # ------------------------------------------------
            # GET CUSTOMER
            # ------------------------------------------------

            customer = get_object_or_404(
                Customer,
                user=request.user
            )


            # ------------------------------------------------
            # GET PLAN
            # ------------------------------------------------

            plan = get_object_or_404(
                MembershipPlan,
                id=plan_id,
                is_active=True
            )


            # ------------------------------------------------
            # VERIFY RAZORPAY SIGNATURE
            # ------------------------------------------------

            client = get_razorpay_client()


            verification_data = {

                "razorpay_order_id":
                    razorpay_order_id,

                "razorpay_payment_id":
                    razorpay_payment_id,

                "razorpay_signature":
                    razorpay_signature

            }


            print(
                "Verifying Razorpay membership payment..."
            )


            client.utility.verify_payment_signature(
                verification_data
            )


            print(
                "Razorpay membership payment verified."
            )


            # ------------------------------------------------
            # CHECK DUPLICATE PAYMENT
            # ------------------------------------------------

            existing_membership = (
                CustomerMembership.objects
                .filter(
                    payment_id=razorpay_payment_id
                )
                .first()
            )


            if existing_membership:

                return Response(
                    {

                        "success":
                            True,

                        "message":
                            "Payment already processed.",

                        "membership":
                            CustomerMembershipSerializer(
                                existing_membership
                            ).data

                    },
                    status=status.HTTP_200_OK
                )


            # ------------------------------------------------
            # EXPIRE PREVIOUS MEMBERSHIP
            # ------------------------------------------------

            CustomerMembership.objects.filter(
                customer=customer,
                status="Active"
            ).update(
                status="Expired"
            )


            # ------------------------------------------------
            # CREATE MEMBERSHIP
            # ------------------------------------------------

            membership = CustomerMembership.objects.create(

                customer=
                    customer,

                plan=
                    plan,

                amount_paid=
                    plan.price,

                payment_id=
                    razorpay_payment_id,

                status=
                    "Active"

            )


            # ------------------------------------------------
            # SERIALIZE
            # ------------------------------------------------

            serializer = CustomerMembershipSerializer(
                membership
            )


            # ------------------------------------------------
            # SUCCESS RESPONSE
            # ------------------------------------------------

            return Response(
                {

                    "success":
                        True,

                    "message":
                        "Membership activated successfully.",

                    "membership":
                        serializer.data,

                    "discount_percentage":
                        plan.discount_percentage

                },
                status=status.HTTP_201_CREATED
            )


        except razorpay.errors.SignatureVerificationError:

            print(
                "Razorpay signature verification failed."
            )


            return Response(
                {

                    "success":
                        False,

                    "message":
                        "Payment authentication failed. Invalid Razorpay signature."

                },
                status=status.HTTP_400_BAD_REQUEST
            )


        except Exception as e:

            print(
                "======================================"
            )

            print(
                "RAZORPAY MEMBERSHIP VERIFY ERROR:"
            )

            print(
                str(e)
            )

            print(
                "======================================"
            )


            return Response(
                {

                    "success":
                        False,

                    "message":
                        "Membership payment verification failed.",

                    "error":
                        str(e)

                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ============================================================
# OLD PURCHASE API
#
# Keep this only if you still need it for admin/demo purposes.
#
# IMPORTANT:
# Your React Membership.jsx should NOT call this API anymore.
# ============================================================

class PurchaseMembershipAPIView(APIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        plan_id = request.data.get(
            "plan_id"
        )

        payment_id = request.data.get(
            "payment_id",
            ""
        )

        if not plan_id:

            return Response(
                {
                    "message":
                        "Membership plan is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        customer = get_object_or_404(
            Customer,
            user=request.user
        )


        plan = get_object_or_404(
            MembershipPlan,
            id=plan_id,
            is_active=True
        )


        CustomerMembership.objects.filter(
            customer=customer,
            status="Active"
        ).update(
            status="Expired"
        )


        membership = CustomerMembership.objects.create(
            customer=customer,
            plan=plan,
            amount_paid=plan.price,
            payment_id=payment_id,
            status="Active"
        )


        serializer = CustomerMembershipSerializer(
            membership
        )


        return Response(
            {

                "message":
                    "Membership activated successfully.",

                "membership":
                    serializer.data,

                "discount_percentage":
                    plan.discount_percentage

            },
            status=status.HTTP_201_CREATED
        )