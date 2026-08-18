from rest_framework.permissions import BasePermission
from accounts.models import UserRole


class IsAdminOrStaff(BasePermission):

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        try:
            user_role = UserRole.objects.select_related("role").get(
                user=request.user
            )

            return user_role.role.name in ["Admin", "Staff"]

        except UserRole.DoesNotExist:
            return False