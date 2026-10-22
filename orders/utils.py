import logging
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)

def send_order_status_email(order):
    try:
        recipient = getattr(getattr(getattr(order, "customer", None), "user", None), "email", None)
        if not recipient:
            return

        first_name = getattr(getattr(order.customer, "user", None), "first_name", "Customer")
        subject = f"Order #{order.id} Status Updated"
        message = f"""
Hello {first_name},

Your order has been updated.

Order ID : {order.id}
Current Status : {order.status}
Payment Method : {order.payment_method}
Total Amount : ₹{order.total_amount}

Thank you for shopping with us.

Pet Care Team
"""
        from_email = getattr(settings, "DEFAULT_FROM_EMAIL", None) or "noreply@zenve.com"
        send_mail(
            subject,
            message,
            from_email,
            [recipient],
            fail_silently=True,
        )
    except Exception as e:
        logger.warning(f"send_order_status_email failed for order #{order.id}: {e}")