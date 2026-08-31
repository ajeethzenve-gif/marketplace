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
  FaPaw,
  FaFacebookF,
} from "react-icons/fa";

import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [loading, setLoading] = useState(false);

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  /* =====================================================
     HANDLE INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =====================================================
     NORMAL LOGIN
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/accounts/login/",
        {
          username: loginData.username,
          password: loginData.password,
        }
      );

      /* Store authentication data */

      localStorage.setItem(
        "access",
        response.data.access
      );

      localStorage.setItem(
        "refresh",
        response.data.refresh
      );

      localStorage.setItem(
        "username",
        response.data.username
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      /* Remember Me */

      if (loginData.remember) {
        localStorage.setItem(
          "rememberMe",
          "true"
        );
      } else {
        localStorage.removeItem(
          "rememberMe"
        );
      }

      showMessage("Login Successful", "success");

      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1200);

    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        showMessage(
          error.response.data.message ||
          "Invalid username or password.",
          "error"
        );
      } else {
        showMessage("Unable to connect to server.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     GOOGLE LOGIN
  ===================================================== */

  const handleGoogleLogin = async (
    credentialResponse
  ) => {
    try {
      console.log(
        "Google Credential Response:",
        credentialResponse
      );

      if (!credentialResponse?.credential) {
        showMessage("Google login failed. No credential received.", "error");
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

      /* Store authentication data */

      localStorage.setItem(
        "access",
        response.data.access
      );

      localStorage.setItem(
        "refresh",
        response.data.refresh
      );

      localStorage.setItem(
        "username",
        response.data.username
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      showMessage("Google Login Successful", "success");

      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1200);

    } catch (error) {
      console.error(
        "Google Login Error:",
        error
      );

      if (error.response) {
        console.error(
          "Google Response:",
          error.response.data
        );

        showMessage(
          error.response.data.message ||
          error.response.data.error ||
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

  /* =====================================================
     GOOGLE LOGIN ERROR
  ===================================================== */

  const handleGoogleError = () => {
    console.error("Google Login Failed");

    showMessage("Google Login Failed", "error");
  };

  /* =====================================================
     FACEBOOK LOGIN
  ===================================================== */

  const handleFacebookLogin = () => {
    showMessage(
      "Facebook Login will be connected here.",
      "success"
    );
  };

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <div className="login-page">

      {/* =================================================
          INLINE MESSAGE (success / error)
      ================================================= */}

      {message && (
        <div className={`inline-message ${messageType}`}>
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
          <span className="inline-message-text">{message}</span>
        </div>
      )}


      {/* =================================================
          DECORATIVE CIRCLES
      ================================================= */}

      <div className="circle one"></div>
      <div className="circle two"></div>
      <div className="circle three"></div>


      {/* =================================================
          MAIN LOGIN CONTAINER
      ================================================= */}

      <div className="login-container">


        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="login-left">

          {/* BRAND */}

          <div className="brand-section">

           <div className="logo-box">
              <img
                src={logo}
                alt="PetCare Store"
                className="brand-logo"
              />
            </div>

            <div className="brand-text">

              <h1>
               MarketPlace
              </h1>

              <span>
                Premium care for your pets
              </span>

            </div>

          </div>


          {/* WELCOME */}

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


            {/* FEATURES */}

            <div className="feature-list">

              <div className="feature">

                <span>
                  🐾
                </span>

                <p>
                  Premium pet products
                </p>

              </div>


              <div className="feature">

                <span>
                  🛍️
                </span>

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


            {/* LOGIN HEADING */}

            <div className="login-heading">

              <h2>
                Login
              </h2>

              <p className="subtitle">
                Sign in to continue
              </p>

            </div>


            {/* =================================================
                LOGIN FORM
            ================================================= */}

            <form onSubmit={handleSubmit}>


              {/* =================================================
                  USERNAME / EMAIL
              ================================================= */}

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


              {/* =================================================
                  PASSWORD
              ================================================= */}

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
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>


              {/* =================================================
                  REMEMBER ME / FORGOT PASSWORD
              ================================================= */}

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


              {/* =================================================
                  LOGIN BUTTON
              ================================================= */}

              <button
                className="login-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>


              {/* =================================================
                  REGISTER
              ================================================= */}

              <p className="register-text">

                Don't have an account?

                <Link to="/register">
                  Register
                </Link>

              </p>

            </form>


            {/* =================================================
                DIVIDER
            ================================================= */}

            <div className="divider">

              <span></span>

              <p>
                OR
              </p>

              <span></span>

            </div>


            {/* =================================================
                GOOGLE LOGIN
            ================================================= */}

            <div className="google-login">

              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={handleGoogleError}
                useOneTap={false}
                auto_select={false}
                width="100%"
              />

            </div>


            {/* =================================================
                FACEBOOK LOGIN
            ================================================= */}

            <div className="social-login">

              <button
                type="button"
                className="facebook-btn"
                onClick={handleFacebookLogin}
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