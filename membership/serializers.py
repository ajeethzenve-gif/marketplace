from rest_framework import serializers

from .models import (
    MembershipPlan,
    CustomerMembership
)


class MembershipPlanSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = MembershipPlan

        fields = "__all__"


class CustomerMembershipSerializer(
    serializers.ModelSerializer
):

    plan = MembershipPlanSerializer(
        read_only=True
    )

    class Meta:

        model = CustomerMembership

        fields = (
            "id",
            "plan",
            "start_date",
            "end_date",
            "status",
            "payment_id",
            "amount_paid",
            "created_at"
        )