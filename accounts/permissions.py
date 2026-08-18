from rest_framework.permissions import BasePermission


class IsAdminOrStaff(BasePermission):

    """
    Customers can only view.
    Admin & Staff can perform CRUD.
    """

    def has_permission(self, request, view):

        # Allow everyone to view products
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        # Login required for POST/PUT/DELETE
        if not request.user.is_authenticated:
            return False

        customer = getattr(request.user, "customer", None)

        if customer is None:
            return False

        if customer.role is None:
            return False

        return customer.role.role_name in ["Admin", "Staff"]