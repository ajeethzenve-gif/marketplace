
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { GoogleLogin } from "@react-oauth/google";
import logo from "../assets/logo/Zenve - 01 (1).png";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaFacebookF,
  FaMobileAlt,
} from "react-icons/fa";

import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  // =====================================================
  // LOGIN METHOD
  // =====================================================

  const [loginMethod, setLoginMethod] = useState("email");

  // =====================================================
  // PASSWORD
  // =====================================================

  const [showPassword, setShowPassword] = useState(false);

  // =====================================================
  // EMAIL LOGIN DATA
  // =====================================================

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    remember: false,
  });

  // =====================================================
  // MOBILE LOGIN DATA
  // =====================================================

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // =====================================================
  // MESSAGE
  // =====================================================

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // =====================================================
  // SHOW MESSAGE
  // =====================================================

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // =====================================================
  // HANDLE EMAIL INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================================
  // EMAIL / PASSWORD LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loginMethod !== "email") {
      return;
    }

    if (!loginData.username.trim()) {
      showMessage("Enter username or email", "error");
      return;
    }

    if (!loginData.password) {
      showMessage("Enter password", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/accounts/login/",
        {
          username: loginData.username,
          password: loginData.password,
        }
      );

      if (response.data.access) {
        localStorage.setItem("access", response.data.access);
      }

      if (response.data.refresh) {
        localStorage.setItem("refresh", response.data.refresh);
      }

      if (response.data.username) {
        localStorage.setItem(
          "username",
          response.data.username
        );
      }

      if (response.data.role) {
        localStorage.setItem(
          "role",
          response.data.role
        );
      }

      if (loginData.remember) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      showMessage("Login Successful", "success");

      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        showMessage(
          error.response.data?.message ||
            error.response.data?.detail ||
            "Invalid username or password.",
          "error"
        );
      } else {
        showMessage(
          "Unable to connect to server.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // MOBILE NUMBER
  // =====================================================

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 10) {
      setMobile(value);
    }
  };

  // =====================================================
  // SEND OTP
  // =====================================================

  const handleSendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      showMessage(
        "Enter a valid 10-digit mobile number",
        "error"
      );
      return;
    }

    setOtpLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/accounts/send-otp/",
        {
          mobile: `+91${mobile}`,
        }
      );

      console.log(
        "Send OTP Response:",
        response.data
      );

      setOtpSent(true);

      showMessage(
        response.data?.message ||
          "OTP sent successfully",
        "success"
      );
    } catch (error) {
      console.error(
        "Send OTP Error:",
        error
      );

      if (error.response) {
        showMessage(
          error.response.data?.message ||
            error.response.data?.detail ||
            "Unable to send OTP",
          "error"
        );
      } else {
        showMessage(
          "Unable to connect to server.",
          "error"
        );
      }
    } finally {
      setOtpLoading(false);
    }
  };

  // =====================================================
  // OTP CHANGE
  // =====================================================

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 6) {
      setOtp(value);
    }
  };

  // =====================================================
  // VERIFY OTP
  // =====================================================

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      showMessage(
        "Enter 6-digit OTP",
        "error"
      );
      return;
    }

    setOtpLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/accounts/verify-otp/",
        {
          mobile: `+91${mobile}`,
          otp: otp,
        }
      );

      console.log(
        "Verify OTP Response:",
        response.data
      );

      if (response.data.access) {
        localStorage.setItem(
          "access",
          response.data.access
        );
      }

      if (response.data.refresh) {
        localStorage.setItem(
          "refresh",
          response.data.refresh
        );
      }

      if (response.data.username) {
        localStorage.setItem(
          "username",
          response.data.username
        );
      }

      if (response.data.role) {
        localStorage.setItem(
          "role",
          response.data.role
        );
      }

      showMessage(
        "OTP verified. Login Successful",
        "success"
      );

      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(
        "Verify OTP Error:",
        error
      );

      if (error.response) {
        showMessage(
          error.response.data?.message ||
            error.response.data?.detail ||
            "Invalid OTP",
          "error"
        );
      } else {
        showMessage(
          "Unable to connect to server.",
          "error"
        );
      }
    } finally {
      setOtpLoading(false);
    }
  };

  // =====================================================
  // CHANGE NUMBER
  // =====================================================

  const handleChangeNumber = () => {
    setOtpSent(false);
    setOtp("");
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleLogin = async (
    credentialResponse
  ) => {
    try {
      if (!credentialResponse?.credential) {
        showMessage(
          "Google login failed. No credential received.",
          "error"
        );
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/accounts/google-login/",
        {
          token: credentialResponse.credential,
        }
      );

      console.log(
        "Google Login Response:",
        response.data
      );

      if (response.data.access) {
        localStorage.setItem(
          "access",
          response.data.access
        );
      }

      if (response.data.refresh) {
        localStorage.setItem(
          "refresh",
          response.data.refresh
        );
      }

      if (response.data.username) {
        localStorage.setItem(
          "username",
          response.data.username
        );
      }

      if (response.data.role) {
        localStorage.setItem(
          "role",
          response.data.role
        );
      }

      showMessage(
        "Google Login Successful",
        "success"
      );

      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(
        "Google Login Error:",
        error
      );

      if (error.response) {
        showMessage(
          error.response.data?.message ||
            error.response.data?.error ||
            "Google Login Failed",
          "error"
        );
      } else {
        showMessage(
          "Unable to connect to server.",
          "error"
        );
      }
    }
  };

  // =====================================================
  // GOOGLE ERROR
  // =====================================================

  const handleGoogleError = () => {
    console.error("Google Login Failed");

    showMessage(
      "Google Login Failed",
      "error"
    );
  };

  // =====================================================
  // FACEBOOK LOGIN
  // =====================================================

  const handleFacebookLogin = () => {
    showMessage(
      "Facebook Login will be connected here.",
      "success"
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="login-page">

      {/* =================================================
          MESSAGE
      ================================================= */}

      {message && (
        <div
          className={`inline-message ${messageType}`}
        >
          <svg
            className="inline-message-check"
            viewBox="0 0 52 52"
          >
            {messageType === "success" ? (
              <path
                className="inline-message-check-path"
                fill="none"
                d="M14 27l7 7 16-16"
              />
            ) : (
              <path
                className="inline-message-cross-path"
                fill="none"
                d="M16 16l20 20M36 16l-20 20"
              />
            )}
          </svg>

          <span className="inline-message-text">
            {message}
          </span>
        </div>
      )}

      {/* =================================================
          DECORATIVE CIRCLES
      ================================================= */}

      <div className="circle one"></div>
      <div className="circle two"></div>
      <div className="circle three"></div>

      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div className="login-container">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="login-left">

          <div className="brand-section">

            <div className="logo-box">
              <img
                src={logo}
                alt="PetCare Store"
                className="brand-logo"
              />
            </div>

            <div className="brand-text">
              <h1>MarketPlace</h1>

              <span>
                Premium care for your pets
              </span>
            </div>

          </div>

          <div className="welcome-content">

            <h2>
              Welcome Back,
              <br />
              Pet Parent ❤️
            </h2>

            <p>
              Everything your furry friend
              needs in one place. Login to
              continue shopping premium
              food, toys, grooming essentials,
              and healthcare products.
            </p>

            <div className="feature-list">

              <div className="feature">
                <span>🐾</span>

                <p>
                  Premium pet products
                </p>
              </div>

              <div className="feature">
                <span>🛍️</span>

                <p>
                  Easy and secure shopping
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="login-right">

          <div className="login-card">

            {/* MOBILE LOGO */}

            <div className="mobile-logo">
              <img
                src={logo}
                alt="PetCare Store"
              />
            </div>

            {/* HEADING */}

            <div className="login-heading">

              <h2>Login</h2>

              <p className="subtitle">
                Sign in to continue
              </p>

            </div>

            {/* =================================================
                LOGIN METHOD
            ================================================= */}

            <div className="login-method">

              <button
                type="button"
                className={
                  loginMethod === "email"
                    ? "active"
                    : ""
                }
                onClick={() => {
                  setLoginMethod("email");
                  setOtpSent(false);
                  setOtp("");
                }}
              >
                <FaEnvelope />
                <span>Email Login</span>
              </button>

              <button
                type="button"
                className={
                  loginMethod === "mobile"
                    ? "active"
                    : ""
                }
                onClick={() => {
                  setLoginMethod("mobile");
                  setOtpSent(false);
                  setOtp("");
                }}
              >
                <FaMobileAlt />
                <span>Number Login</span>
              </button>

            </div>

            {/* =================================================
                EMAIL LOGIN
            ================================================= */}

            {loginMethod === "email" ? (

              <form onSubmit={handleSubmit}>

                {/* USERNAME / EMAIL */}

                <div className="login-input-group">

                  <FaEnvelope
                    className="input-icon"
                  />

                  <input
                    type="text"
                    name="username"
                    placeholder="Username or Email"
                    value={loginData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                  />

                </div>

                {/* PASSWORD */}

                <div className="login-input-group">

                  <FaLock
                    className="input-icon"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

                {/* OPTIONS */}

                <div className="login-options">

                  <label className="remember">

                    <input
                      type="checkbox"
                      name="remember"
                      checked={
                        loginData.remember
                      }
                      onChange={handleChange}
                    />

                    <span>
                      Remember Me
                    </span>

                  </label>

                  <Link
                    to="/forgotpassword"
                    className="forgot-link"
                  >
                    Forgot Password?
                  </Link>

                </div>

                {/* LOGIN */}

                <button
                  className="login-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Logging in..."
                    : "Login"}
                </button>

                {/* REGISTER */}

                <p className="register-text">

                  Don't have an account?

                  <Link to="/register">
                    Register
                  </Link>

                </p>

              </form>

            ) : (

              /* =================================================
                  NUMBER LOGIN
              ================================================= */

              <div className="mobile-login">

                {!otpSent ? (

                  <>
                    {/* MOBILE NUMBER */}

                    <div className="mobile-number-wrapper">

                      {/* COUNTRY CODE */}

                      <div className="country-code">
                        +91
                      </div>

                      {/* NUMBER INPUT */}

                      <div className="login-input-group mobile-input-group">

                        <FaMobileAlt
                          className="input-icon"
                        />

                        <input
                          type="tel"
                          placeholder="Enter mobile number"
                          value={mobile}
                          onChange={
                            handleMobileChange
                          }
                          maxLength={10}
                          inputMode="numeric"
                          autoComplete="tel"
                        />

                      </div>

                    </div>

                    <p className="input-hint">
                      Enter your 10-digit Indian
                      mobile number
                    </p>

                    {/* SEND OTP */}

                    <button
                      type="button"
                      className="login-btn"
                      onClick={
                        handleSendOtp
                      }
                      disabled={otpLoading}
                    >
                      {otpLoading
                        ? "Sending OTP..."
                        : "Send OTP"}
                    </button>

                  </>

                ) : (

                  <>
                    {/* OTP INFO */}

                    <div className="otp-info">

                      <p>
                        OTP sent to
                      </p>

                      <strong>
                        +91 {mobile}
                      </strong>

                    </div>

                    {/* OTP INPUT */}

                    <div className="login-input-group">

                      <FaLock
                        className="input-icon"
                      />

                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={
                          handleOtpChange
                        }
                        maxLength={6}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                      />

                    </div>

                    <p className="input-hint">
                      Enter the 6-digit OTP
                      sent to your mobile
                    </p>

                    {/* VERIFY */}

                    <button
                      type="button"
                      className="login-btn"
                      onClick={
                        handleVerifyOtp
                      }
                      disabled={otpLoading}
                    >
                      {otpLoading
                        ? "Verifying..."
                        : "Verify OTP"}
                    </button>

                    {/* CHANGE NUMBER */}

                    <button
                      type="button"
                      className="change-number-btn"
                      onClick={
                        handleChangeNumber
                      }
                    >
                      ← Change Number
                    </button>

                    {/* RESEND */}

                    <button
                      type="button"
                      className="resend-otp-btn"
                      onClick={
                        handleSendOtp
                      }
                      disabled={otpLoading}
                    >
                      Resend OTP
                    </button>

                  </>

                )}

                {/* REGISTER */}

                <p className="register-text">

                  Don't have an account?

                  <Link to="/register">
                    Register
                  </Link>

                </p>

              </div>

            )}

            {/* =================================================
                DIVIDER
            ================================================= */}

            <div className="divider">

              <span></span>

              <p>OR</p>

              <span></span>

            </div>

            {/* =================================================
                GOOGLE
            ================================================= */}

            <div className="google-login">

              <GoogleLogin
                onSuccess={
                  handleGoogleLogin
                }
                onError={
                  handleGoogleError
                }
                useOneTap={false}
                auto_select={false}
                width="100%"
              />

            </div>

            {/* =================================================
                FACEBOOK
            ================================================= */}

            <div className="social-login">

              <button
                type="button"
                className="facebook-btn"
                onClick={
                  handleFacebookLogin
                }
              >

                <FaFacebookF />

                <span>
                  Sign in with Facebook
                </span>

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;