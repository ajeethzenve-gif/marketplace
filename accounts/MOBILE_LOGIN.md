Mobile OTP login
===============

POST /api/accounts/send-otp/ with {"mobile": "+919876543210"}.
POST /api/accounts/verify-mobile-otp/ with the same mobile and a six-digit otp.
The existing /verify-otp/ endpoint remains for email password resets.

Verified registered mobiles log into the existing Customer account. Unknown
mobiles create a Customer with an unusable password after verification.
Numbers are stored as ten digits; existing 91 and +91 prefixes are also matched.
New customers can complete their details through the existing profile page.

SMS_PROVIDER, SMS_API_URL and SMS_API_KEY are read from the existing settings.
Never put credentials in frontend code. A separate SMS_AUTH_KEY is not required.
SMS_API_KEY is sent in the authkey form field, with mobile, otp and channel=sms.
The request uses application/x-www-form-urlencoded, as required by APITxT's
Unified OTP API documentation at https://apitxt.com/developer/otp-api.
The official documentation data is also publicly available at
https://apitxt.com/assets/data-Ca-VGY0D.js (the otp schema).
The endpoint is /api/sendOTP. Sender and route fields are not used by this API.
Without template_id, APITxT uses the system default SMS OTP configuration.
A deployment may optionally define SMS_TEMPLATE_ID in Django settings to use
its internal SMS template ID. No live SMS has been tested.

OTP expiry is five minutes, resend cooldown is sixty seconds, and verification
allows five attempts. Codes are hashed and consumed after successful login.
Use a shared cache with atomic add/incr (such as Redis or Memcached) for a
deployment with multiple application processes; the default local-memory cache
does not share OTP state or limits across workers.

Tests mock SMS delivery and can run with an isolated SQLite test database.
