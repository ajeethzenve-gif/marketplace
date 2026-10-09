from unittest.mock import patch
from django.contrib.auth.models import User
from django.core.cache import cache
from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from .models import Customer


class MobileLoginTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()

    def send(self, mobile="+919876543210"):
        with patch("accounts.mobile_login.send_sms") as delivery:
            response = self.client.post("/api/accounts/send-otp/", {"mobile": mobile})
        self.assertEqual(response.status_code, 200)
        return delivery.call_args.args[1]

    def verify(self, otp):
        return self.client.post("/api/accounts/verify-mobile-otp/", {"mobile": "+919876543210", "otp": otp})

    def test_new_customer_created_only_after_verification_and_code_is_single_use(self):
        otp = self.send()
        self.assertEqual(Customer.objects.count(), 0)
        self.assertEqual(self.verify("xxxxxx").status_code, 400)
        response = self.verify(otp)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["is_new_customer"])
        self.assertIn("access", response.data)
        self.assertTrue(Customer.objects.get().is_verified)
        self.assertFalse(Customer.objects.get().user.has_usable_password())
        self.assertEqual(self.verify(otp).status_code, 400)

    def test_existing_customer_logs_into_same_account(self):
        user = User.objects.create_user(username="existing")
        Customer.objects.create(user=user, phone_number="9876543210")
        response = self.verify(self.send())
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["username"], "existing")
        self.assertFalse(response.data["is_new_customer"])
        self.assertEqual(User.objects.count(), 1)

    def test_inactive_customer_cannot_login(self):
        user = User.objects.create_user(username="inactive", is_active=False)
        Customer.objects.create(user=user, phone_number="+919876543210")
        self.assertEqual(self.verify(self.send()).status_code, 403)

    def test_attempt_limit_invalidates_code(self):
        otp = self.send()
        wrong = "000000" if otp != "000000" else "111111"
        for _ in range(5):
            self.assertEqual(self.verify(wrong).status_code, 400)
        self.assertEqual(self.verify(otp).status_code, 429)
        self.assertEqual(self.verify(otp).status_code, 400)

    def test_resend_cooldown_and_provider_failure(self):
        self.send()
        self.assertEqual(self.client.post("/api/accounts/send-otp/", {"mobile": "9876543210"}).status_code, 429)
        cache.clear()
        with patch("accounts.mobile_login.send_sms", side_effect=ValueError("rejected")):
            self.assertEqual(self.client.post("/api/accounts/send-otp/", {"mobile": "9876543210"}).status_code, 503)
        self.assertEqual(self.verify("123456").status_code, 400)

    @override_settings(SMS_PROVIDER="APITXT", SMS_API_KEY="", SMS_AUTH_KEY="")
    def test_missing_api_key_reports_configuration_without_calling_provider(self):
        with patch("accounts.mobile_login.requests.post") as provider:
            response = self.client.post("/api/accounts/send-otp/", {"mobile": "9876543210"})
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.data["code"], "sms_not_configured")
        self.assertIn("SMS_API_KEY", response.data["message"])
        self.assertNotIn("test-secret", response.data["message"])
        provider.assert_not_called()

    @override_settings(SMS_PROVIDER="APITXT", SMS_API_KEY="test-secret", SMS_AUTH_KEY="")
    def test_api_key_only_sends_documented_form_authkey(self):
        with patch("accounts.mobile_login.requests.post") as provider:
            provider.return_value.status_code = 200
            provider.return_value.json.return_value = {"status": 200}
            response = self.client.post("/api/accounts/send-otp/", {"mobile": "9876543210"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(provider.call_args.kwargs["data"], {
            "authkey": "test-secret", "mobile": "919876543210",
            "otp": provider.call_args.kwargs["data"]["otp"], "channel": "sms",
        })
        self.assertNotIn("headers", provider.call_args.kwargs)
        self.assertNotIn("json", provider.call_args.kwargs)

    @override_settings(SMS_PROVIDER="APITXT", SMS_API_KEY="test-secret", SMS_AUTH_KEY="")
    def test_provider_errors_are_specific_and_do_not_expose_response_body(self):
        for http_status, expected in [(401, "API key"), (404, "endpoint"), (422, "request fields")]:
            cache.clear()
            with patch("accounts.mobile_login.requests.post") as provider:
                provider.return_value.status_code = http_status
                provider.return_value.text = "test-secret"
                response = self.client.post("/api/accounts/send-otp/", {"mobile": "9876543210"})
            self.assertEqual(response.status_code, 503)
            self.assertEqual(response.data["code"], "sms_http_error")
            self.assertIn(expected, response.data["message"])
            self.assertNotIn("test-secret", response.data["message"])


class CustomerProfileTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="customer_generated", password=None)
        self.customer = Customer.objects.create(user=self.user, phone_number="9876543210")
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_mobile_customer_can_save_profile_with_blank_optional_details(self):
        response = self.client.put("/api/accounts/profile/update/", {
            "first_name": "Asha", "last_name": "", "email": "",
            "username": "changed", "phone_number": "9876543210",
            "gender": "", "date_of_birth": "", "address": "", "city": "",
            "state": "", "country": "India", "postal_code": "",
        }, format="multipart")
        self.assertEqual(response.status_code, 200, response.data)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "Asha")
        self.assertEqual(self.user.username, "customer_generated")
        self.assertIsNone(response.data["profile"]["date_of_birth"])

    def test_json_update_saves_full_name(self):
        response = self.client.put("/api/accounts/profile/update/", {
            "first_name": "Asha", "last_name": "Rao"
        }, format="json")
        self.assertEqual(response.status_code, 200, response.data)
        profile = self.client.get("/api/accounts/profile/").data
        self.assertEqual(profile["first_name"], "Asha")
        self.assertEqual(profile["last_name"], "Rao")
