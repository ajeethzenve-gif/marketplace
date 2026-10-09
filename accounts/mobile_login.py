"""Customer mobile login, separate from email password-reset verification."""
import re
import secrets
import uuid

import requests
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import User
from django.core.cache import cache
from django.db import transaction
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Customer, Role, UserRole


class SMSConfigurationError(ValueError):
    """Safe configuration message that contains no credentials."""


class SMSDeliveryError(ValueError):
    def __init__(self, message, code):
        super().__init__(message)
        self.code = code


def normalize_mobile(value):
    if not isinstance(value, str):
        raise ValueError("Enter a valid Indian mobile number.")
    number = re.sub(r"[\s()-]", "", value)
    if number.startswith("+91"):
        number = number[3:]
    elif len(number) == 12 and number.startswith("91"):
        number = number[2:]
    if not re.fullmatch(r"[6-9][0-9]{9}", number):
        raise ValueError("Enter a valid 10-digit mobile number.")
    return number


def customer_for_mobile(number):
    matches = Customer.objects.select_related("user").filter(
        phone_number__in=[number, "91" + number, "+91" + number]
    )
    if matches.count() > 1:
        raise ValueError("Multiple accounts use this mobile number. Contact support.")
    return matches.first()


def send_sms(number, otp):
    if settings.SMS_PROVIDER.upper() != "APITXT":
        raise SMSConfigurationError("SMS_PROVIDER must be APITXT for this integration.")
    missing = [name for name in ("SMS_API_KEY",) if not getattr(settings, name, "").strip()]
    if missing:
        raise SMSConfigurationError("SMS configuration missing: " + ", ".join(missing) + ". Configure the server and restart it.")
    payload = {
        "authkey": settings.SMS_API_KEY.strip(),
        "mobile": "91" + number,
        "otp": otp,
        "channel": "sms",
    }
    template_id = getattr(settings, "SMS_TEMPLATE_ID", "")
    if template_id:
        payload["template_id"] = template_id
    try:
        response = requests.post(
            settings.SMS_API_URL,
            data=payload,
            timeout=15,
        )
    except requests.Timeout:
        raise SMSDeliveryError("APITxT timed out. Please try again later.", "sms_timeout") from None
    except requests.ConnectionError:
        raise SMSDeliveryError("The server cannot connect to APITxT. Check the API URL and server internet connection.", "sms_connection_failed") from None
    except requests.RequestException:
        raise SMSDeliveryError("APITxT request could not be sent. Check the SMS API URL.", "sms_request_failed") from None
    if not 200 <= response.status_code < 300:
        reasons = {
            400: "APITxT rejected the request fields. Confirm the OTP API example from your dashboard.",
            401: "APITxT rejected the API key sent in authkey. Check that SMS_API_KEY matches an active key in your APITxT dashboard.",
            403: "APITxT denied access. Check API permissions and account restrictions.",
            404: "APITxT OTP endpoint was not found. Set SMS_API_URL to the endpoint in your dashboard.",
            405: "APITxT rejected the request method. Confirm the OTP API example from your dashboard.",
            422: "APITxT rejected the request fields. Confirm the OTP API example from your dashboard.",
            429: "APITxT request limit reached. Please try again later.",
        }
        message = reasons.get(response.status_code, "APITxT could not accept the OTP request.")
        raise SMSDeliveryError(f"{message} (HTTP {response.status_code})", "sms_http_error")
    try:
        result = response.json()
    except ValueError:
        raise SMSDeliveryError("APITxT returned an unexpected response instead of JSON. Confirm SMS_API_URL.", "sms_invalid_response") from None
    # A successful HTTP response alone does not establish provider acceptance.
    if not isinstance(result, dict) or str(result.get("status", "")).lower() not in {"200", "success", "true"}:
        raise SMSDeliveryError("APITxT did not confirm OTP acceptance. Its response format or request fields need checking against your dashboard API example.", "sms_not_accepted")


class MobileOTPAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            number = normalize_mobile(request.data.get("mobile"))
        except ValueError as exc:
            return Response({"message": str(exc)}, status=400)
        # Bound requests by both phone and originating address.
        ip_key = "mobile-login:ip:" + request.META.get("REMOTE_ADDR", "unknown")
        if cache.add(ip_key, 1, 3600):
            count = 1
        else:
            count = cache.incr(ip_key)
        if count > 30:
            return Response({"message": "Too many OTP requests. Try again later."}, status=429)
        cooldown = "mobile-login:cooldown:" + number
        if not cache.add(cooldown, True, 60):
            return Response({"message": "Please wait 60 seconds before requesting another OTP."}, status=429)
        otp = f"{secrets.randbelow(1000000):06d}"
        key = "mobile-login:otp:" + number
        cache.delete(key)
        try:
            send_sms(number, otp)
        except SMSConfigurationError as exc:
            cache.delete(cooldown)
            return Response({"message": str(exc), "code": "sms_not_configured"}, status=503)
        except SMSDeliveryError as exc:
            cache.delete(cooldown)
            return Response({"message": str(exc), "code": exc.code}, status=503)
        except (ValueError, requests.RequestException):
            cache.delete(cooldown)
            return Response({"message": "Unable to send OTP. Check SMS service configuration or try again later."}, status=503)
        cache.set(key, {"hash": make_password(otp)}, 300)
        cache.delete("mobile-login:attempts:" + number)
        return Response({"message": "OTP sent successfully. It expires in 5 minutes."})


class VerifyMobileOTPAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            number = normalize_mobile(request.data.get("mobile"))
        except ValueError as exc:
            return Response({"message": str(exc)}, status=400)
        otp = request.data.get("otp")
        if not isinstance(otp, str) or not re.fullmatch(r"[0-9]{6}", otp):
            return Response({"message": "Enter a 6-digit OTP."}, status=400)
        lock = "mobile-login:verify-lock:" + number
        if not cache.add(lock, True, 30):
            return Response({"message": "Verification in progress. Please try again."}, status=429)
        try:
            key = "mobile-login:otp:" + number
            challenge = cache.get(key)
            if not challenge:
                return Response({"message": "OTP expired or already used. Request a new OTP."}, status=400)
            attempts_key = "mobile-login:attempts:" + number
            if not cache.add(attempts_key, 1, 300):
                attempts = cache.incr(attempts_key)
            else:
                attempts = 1
            if attempts > 5:
                cache.delete(key)
                return Response({"message": "Too many attempts. Request a new OTP."}, status=429)
            if not check_password(otp, challenge["hash"]):
                return Response({"message": "Invalid OTP."}, status=400)
            with transaction.atomic():
                try:
                    customer = customer_for_mobile(number)
                except ValueError as exc:
                    return Response({"message": str(exc)}, status=409)
                is_new = customer is None
                if is_new:
                    user = User.objects.create_user(username="customer_" + uuid.uuid4().hex, password=None)
                    customer = Customer.objects.create(user=user, phone_number=number)
                    role, _ = Role.objects.get_or_create(name="Customer")
                    UserRole.objects.create(user=user, role=role)
                user = customer.user
                if not user.is_active:
                    return Response({"message": "This account is inactive. Contact support."}, status=403)
                customer.is_verified = True
                customer.save(update_fields=["is_verified"])
            cache.delete(key)
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful", "access": str(refresh.access_token),
                "refresh": str(refresh), "username": user.username, "email": user.email,
                "role": "Customer", "is_new_customer": is_new,
            })
        finally:
            cache.delete(lock)
