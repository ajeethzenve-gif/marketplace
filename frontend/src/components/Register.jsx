import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaHome,
  FaPaw,
} from "react-icons/fa";

import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    address: "",
    username: "",
    password: "",
    confirm_password: "",
  });

  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     REGISTER
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/accounts/register/",
        formData
      );

      alert(response.data.message || "Registration successful");

      setFormData({
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        address: "",
        username: "",
        password: "",
        confirm_password: "",
      });

      setShowPassword(false);
      setShowConfirmPassword(false);

      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error);

      if (error.response) {
        console.error("Server Response:", error.response.data);

        if (typeof error.response.data === "object") {
          alert(JSON.stringify(error.response.data));
        } else {
          alert(error.response.data);
        }
      } else {
        alert("Unable to connect to server.");
      }
    }
  };

  return (
    <div className="register-page">

      {/* =================================================
          BACKGROUND DECORATION
      ================================================= */}

      <div className="register-circle register-circle-one"></div>
      <div className="register-circle register-circle-two"></div>
      <div className="register-circle register-circle-three"></div>

      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div className="register-container">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="register-left">

          {/* BRAND */}

          <div className="register-brand">

            <div className="register-paw-box">
              <FaPaw />
            </div>

            <div className="register-brand-text">
              <h1>PetCare Store</h1>

              <span>
                Premium care for your pets
              </span>
            </div>

          </div>

          {/* WELCOME */}

          <div className="register-welcome">

            <h2>
              Join Our Family,
              <br />
              Pet Parent ❤️
            </h2>

            <p>
              Create your account and give your
              furry friend the best care possible.
              Shop premium food, medicines,
              grooming essentials, toys, and
              healthcare products.
            </p>

            {/* FEATURES */}

            <div className="register-feature-list">

              <div className="register-feature">

                <span>🐾</span>

                <p>
                  Premium pet products
                </p>

              </div>

              <div className="register-feature">

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

        <div className="register-right">

          <div className="register-card">

            {/* MOBILE LOGO */}

            <div className="register-mobile-logo">
              <FaPaw />
            </div>

            {/* HEADING */}

            <div className="register-heading">

              <h2>
                Create Account
              </h2>

              <p>
                Fill in your details to continue
              </p>

            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="register-form"
            >

              <div className="register-form-grid">

                {/* FIRST NAME */}

                <div className="register-input-group">

                  <FaUser className="register-input-icon" />

                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* LAST NAME */}

                <div className="register-input-group">

                  <FaUser className="register-input-icon" />

                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* PHONE */}

                <div className="register-input-group">

                  <FaPhone className="register-input-icon" />

                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* EMAIL */}

                <div className="register-input-group">

                  <FaEnvelope className="register-input-icon" />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* ADDRESS */}

                <div className="register-input-group">

                  <FaHome className="register-input-icon" />

                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* USERNAME */}

                <div className="register-input-group">

                  <FaUser className="register-input-icon" />

                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* PASSWORD */}

                <div className="register-input-group">

                  <FaLock className="register-input-icon" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
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

                {/* CONFIRM PASSWORD */}

                <div className="register-input-group">

                  <FaLock className="register-input-icon" />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirm_password"
                    placeholder="Confirm Password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

              </div>

              {/* REGISTER BUTTON */}

              <button
                type="submit"
                className="register-btn"
              >
                Create Account
              </button>

              {/* LOGIN */}

              <p className="register-login-text">

                Already have an account?

                <Link to="/login">
                  Login
                </Link>

              </p>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;