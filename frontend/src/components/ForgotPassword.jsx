import React, {
  useRef,
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import axios from "axios";

import "../styles/ForgotPassword.css";

import {
  FaEnvelope,
  FaLock,
  FaPaw,
  FaArrowLeft,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";


function ForgotPassword() {

  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");

  const [resetToken, setResetToken] =
    useState("");

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    ""
  ]);

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const otpRefs = useRef([]);


  // =====================================================
  // STEP 1
  // CHECK EMAIL + SEND OTP
  // =====================================================

  const handleEmailSubmit = async (e) => {

    e.preventDefault();

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {

      alert(
        "Please enter your email."
      );

      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(

        "http://127.0.0.1:8000/api/accounts/forgot-password/",

        {
          email: cleanEmail
        }

      );

      console.log(
        "Forgot password:",
        response.data
      );

      // =================================================
      // GET RESET TOKEN
      // =================================================

      if (!response.data.reset_token) {

        alert(
          "Reset token was not received from server."
        );

        return;
      }

      // Save email

      setEmail(cleanEmail);

      // Save reset token

      setResetToken(
        response.data.reset_token
      );

      // Clear old OTP

      setOtp([
        "",
        "",
        "",
        "",
        "",
        ""
      ]);

      alert(
        response.data.message ||
        "OTP sent successfully."
      );

      // Go to OTP page

      setStep(2);

    } catch (error) {

      console.error(
        "Forgot password error:",
        error.response?.data ||
        error.message
      );

      alert(

        error.response?.data?.detail ||

        error.response?.data?.message ||

        "Unable to send OTP."

      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // OTP CHANGE
  // =====================================================

  const handleOtpChange = (
    value,
    index
  ) => {

    // Only numbers

    if (!/^\d*$/.test(value)) {

      return;
    }

    const newOtp = [
      ...otp
    ];

    newOtp[index] =
      value.slice(-1);

    setOtp(newOtp);

    // Move to next input

    if (
      value &&
      index < 5 &&
      otpRefs.current[index + 1]
    ) {

      otpRefs.current[
        index + 1
      ].focus();

    }

  };


  // =====================================================
  // OTP BACKSPACE
  // =====================================================

  const handleOtpKeyDown = (
    e,
    index
  ) => {

    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {

      otpRefs.current[
        index - 1
      ].focus();

    }

  };


  // =====================================================
  // STEP 2
  // VERIFY OTP
  // =====================================================

  const handleVerifyOtp = async (e) => {

    e.preventDefault();

    const enteredOtp =
      otp.join("");

    if (
      enteredOtp.length !== 6
    ) {

      alert(
        "Please enter the complete 6-digit OTP."
      );

      return;
    }

    // =================================================
    // CHECK RESET TOKEN
    // =================================================

    if (!resetToken) {

      alert(
        "Reset token is missing. Please request a new OTP."
      );

      setStep(1);

      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(

        "http://127.0.0.1:8000/api/accounts/verify-otp/",

        {
          email:
            email.trim().toLowerCase(),

          otp:
            enteredOtp,

          // IMPORTANT
          // This was missing in your old code

          reset_token:
            resetToken
        }

      );

      console.log(
        "OTP verification:",
        response.data
      );

      if (
        !response.data.verified
      ) {

        alert(
          "OTP verification failed."
        );

        return;
      }

      // Keep reset token

      setResetToken(
        response.data.reset_token ||
        resetToken
      );

      alert(
        "OTP verified successfully."
      );

      // Go to password page

      setStep(3);

    } catch (error) {

      console.error(
        "OTP verification error:",
        error.response?.data ||
        error.message
      );

      alert(

        error.response?.data?.detail ||

        error.response?.data?.message ||

        "Invalid or expired OTP."

      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // RESEND OTP
  // =====================================================

  const handleResendOtp = async () => {

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {

      alert(
        "Email is missing."
      );

      setStep(1);

      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(

        "http://127.0.0.1:8000/api/accounts/forgot-password/",

        {
          email: cleanEmail
        }

      );

      console.log(
        "Resend OTP:",
        response.data
      );

      // IMPORTANT
      // New OTP gets a NEW token

      if (!response.data.reset_token) {

        alert(
          "New reset token was not received."
        );

        return;
      }

      setResetToken(
        response.data.reset_token
      );

      setOtp([
        "",
        "",
        "",
        "",
        "",
        ""
      ]);

      if (
        otpRefs.current[0]
      ) {

        otpRefs.current[0].focus();

      }

      alert(
        response.data.message ||
        "A new OTP has been sent."
      );

    } catch (error) {

      console.error(
        "Resend OTP error:",
        error.response?.data ||
        error.message
      );

      alert(

        error.response?.data?.detail ||

        error.response?.data?.message ||

        "Unable to resend OTP."

      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // CHANGE EMAIL
  // =====================================================

  const handleChangeEmail = () => {

    setStep(1);

    setOtp([
      "",
      "",
      "",
      "",
      "",
      ""
    ]);

    setResetToken("");

  };


  // =====================================================
  // STEP 3
  // RESET PASSWORD
  // =====================================================

  const handleResetPassword = async (e) => {

    e.preventDefault();

    // =================================================
    // CHECK PASSWORD
    // =================================================

    if (
      !newPassword ||
      !confirmPassword
    ) {

      alert(
        "Please enter your new password."
      );

      return;
    }

    // =================================================
    // CHECK PASSWORD MATCH
    // =================================================

    if (
      newPassword !==
      confirmPassword
    ) {

      alert(
        "Passwords do not match."
      );

      return;
    }

    // =================================================
    // CHECK PASSWORD LENGTH
    // =================================================

    if (
      newPassword.length < 8
    ) {

      alert(
        "Password must be at least 8 characters."
      );

      return;
    }

    // =================================================
    // CHECK RESET TOKEN
    // =================================================

    if (!resetToken) {

      alert(
        "Reset token is missing. Please verify the OTP again."
      );

      setStep(2);

      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(

        "http://127.0.0.1:8000/api/accounts/reset-password/",

        {
          email:
            email.trim().toLowerCase(),

          reset_token:
            resetToken,

          new_password:
            newPassword
        }

      );

      console.log(
        "Password reset:",
        response.data
      );

      alert(
        response.data.message ||
        "Password reset successfully."
      );

      // =================================================
      // CLEAR RESET DATA
      // =================================================

      setResetToken("");

      setOtp([
        "",
        "",
        "",
        "",
        "",
        ""
      ]);

      setNewPassword("");

      setConfirmPassword("");

      // =================================================
      // GO LOGIN
      // =================================================

      navigate("/login");

    } catch (error) {

      console.error(
        "Password reset error:",
        error.response?.data ||
        error.message
      );

      alert(

        error.response?.data?.detail ||

        error.response?.data?.message ||

        "Unable to reset password."

      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="forgot-page">

      <div className="forgot-decoration decoration-one"></div>

      <div className="forgot-decoration decoration-two"></div>


      <div className="forgot-card">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="forgot-header">

          <div className="forgot-icon">

            <FaPaw />

          </div>

          <div>

            <h1>
              Zenve
            </h1>

            <p>
              Pet Marketplace
            </p>

          </div>

        </div>


        {/* =================================================
            STEP 1
        ================================================= */}

        {step === 1 && (

          <div className="forgot-content">

            <h2>
              Forgot Password?
            </h2>

            <p className="forgot-description">

              Enter the email address
              associated with your account
              and we'll send you a 6-digit OTP.

            </p>


            <form
              onSubmit={
                handleEmailSubmit
              }
            >

              <div className="forgot-input">

                <FaEnvelope />

                <input

                  type="email"

                  placeholder="Enter your email"

                  value={email}

                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }

                  required

                  disabled={
                    loading
                  }

                />

              </div>


              <button

                type="submit"

                className="forgot-btn"

                disabled={
                  loading
                }

              >

                {loading
                  ? "Sending OTP..."
                  : "Send OTP"
                }

              </button>

            </form>

          </div>

        )}


        {/* =================================================
            STEP 2
        ================================================= */}

        {step === 2 && (

          <div className="forgot-content">

            <h2>
              Verify OTP
            </h2>

            <p className="forgot-description">

              Enter the 6-digit OTP sent to

              <strong>
                {" "}
                {email}
              </strong>

            </p>


            <form
              onSubmit={
                handleVerifyOtp
              }
            >

              <div className="otp-container">

                {otp.map(
                  (
                    digit,
                    index
                  ) => (

                    <input

                      key={index}

                      ref={(element) =>
                        otpRefs.current[
                          index
                        ] = element
                      }

                      type="text"

                      inputMode="numeric"

                      maxLength={1}

                      value={digit}

                      onChange={(e) =>
                        handleOtpChange(
                          e.target.value,
                          index
                        )
                      }

                      onKeyDown={(e) =>
                        handleOtpKeyDown(
                          e,
                          index
                        )
                      }

                      className="otp-box"

                      disabled={
                        loading
                      }

                    />

                  )
                )}

              </div>


              <button

                type="submit"

                className="forgot-btn"

                disabled={
                  loading
                }

              >

                {loading
                  ? "Verifying..."
                  : "Verify OTP"
                }

              </button>

            </form>


            <button

              type="button"

              className="resend-btn"

              onClick={
                handleResendOtp
              }

              disabled={
                loading
              }

            >

              {loading
                ? "Sending..."
                : "Resend OTP"
              }

            </button>


            <button

              type="button"

              className="resend-btn"

              onClick={
                handleChangeEmail
              }

              disabled={
                loading
              }

            >

              Change Email

            </button>

          </div>

        )}


        {/* =================================================
            STEP 3
        ================================================= */}

        {step === 3 && (

          <div className="forgot-content">

            <h2>
              Create New Password
            </h2>

            <p className="forgot-description">

              Enter your new password below.

            </p>


            <form
              onSubmit={
                handleResetPassword
              }
            >


              {/* NEW PASSWORD */}

              <label>
                New Password
              </label>

              <div className="forgot-input">

                <FaLock />

                <input

                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }

                  placeholder="Enter new password"

                  value={
                    newPassword
                  }

                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }

                  required

                  disabled={
                    loading
                  }

                />

                <button

                  type="button"

                  className="password-toggle"

                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }

                >

                  {showPassword
                    ? <FaEyeSlash />
                    : <FaEye />
                  }

                </button>

              </div>


              {/* CONFIRM PASSWORD */}

              <label>
                Confirm Password
              </label>

              <div className="forgot-input">

                <FaLock />

                <input

                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }

                  placeholder="Confirm new password"

                  value={
                    confirmPassword
                  }

                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }

                  required

                  disabled={
                    loading
                  }

                />

                <button

                  type="button"

                  className="password-toggle"

                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }

                >

                  {showConfirmPassword
                    ? <FaEyeSlash />
                    : <FaEye />
                  }

                </button>

              </div>


              <button

                type="submit"

                className="forgot-btn"

                disabled={
                  loading
                }

              >

                {loading
                  ? "Resetting Password..."
                  : "Reset Password"
                }

              </button>

            </form>

          </div>

        )}


        {/* =================================================
            BACK TO LOGIN
        ================================================= */}

        <div className="back-login">

          <Link to="/login">

            <FaArrowLeft />

            Back to Login

          </Link>

        </div>


      </div>

    </div>

  );

}


export default ForgotPassword;