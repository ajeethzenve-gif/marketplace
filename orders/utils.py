from django.core.mail import send_mail
from django.conf import settings


def send_order_status_email(order):

    subject = f"Order #{order.id} Status Updated"

    message = f"""
Hello {order.customer.user.first_name},

Your order has been updated.

Order ID : {order.id}

Current Status : {order.status}

Payment Method : {order.payment_method}

Total Amount : ₹{order.total_amount}

Thank you for shopping with us.

Pet Care Team
"""

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [order.customer.user.email],
        fail_silently=False,
    )