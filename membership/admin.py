from django.contrib import admin

from .models import (
    MembershipPlan,
    CustomerMembership
)


@admin.register(MembershipPlan)
class MembershipPlanAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "price",
        "duration_months",
        "discount_percentage",
        "free_delivery",
        "is_active"
    )


@admin.register(CustomerMembership)
class CustomerMembershipAdmin(admin.ModelAdmin):

    list_display = (
        "customer",
        "plan",
        "start_date",
        "end_date",
        "status",
        "amount_paid"
    )

    list_filter = (
        "status",
        "plan"
    )