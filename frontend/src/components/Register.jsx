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
  FaMapMarkerAlt,
  FaCity,
  FaMapPin,
} from "react-icons/fa";

import "../styles/Register.css";
import logo from "../assets/logo/Zenve - 01 (1).png";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    postal_code: "",
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
     VALIDATE FORM
  ===================================================== */

  const validateForm = () => {
    if (!formData.first_name.trim()) {
      alert("Please enter your first name.");
      return false;
    }

    if (!formData.last_name.trim()) {
      alert("Please enter your last name.");
      return false;
    }

    if (!formData.phone_number.trim()) {
      alert("Please enter your phone number.");
      return false;
    }

    if (!/^[0-9]{10,15}$/.test(formData.phone_number.trim())) {
      alert("Please enter a valid phone number.");
      return false;
    }

    if (!formData.email.trim()) {
      alert("Please enter your email address.");
      return false;
    }

    if (!formData.address.trim()) {
      alert("Please enter your address.");
      return false;
    }

    if (!formData.city.trim()) {
      alert("Please enter your city.");
      return false;
    }

    if (!formData.state.trim()) {
      alert("Please enter your state.");
      return false;
    }

    if (!formData.postal_code.trim()) {
      alert("Please enter your postal code.");
      return false;
    }

    if (!/^[0-9]{5,10}$/.test(formData.postal_code.trim())) {
      alert("Please enter a valid postal code.");
      return false;
    }

    if (!formData.username.trim()) {
      alert("Please enter your username.");
      return false;
    }

    if (!formData.password) {
      alert("Please enter your password.");
      return false;
    }

    if (formData.password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return false;
    }

    if (!formData.confirm_password) {
      alert("Please confirm your password.");
      return false;
    }

    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match.");
      return false;
    }

    return true;
  };

  /* =====================================================
     REGISTER
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/accounts/register/",
        formData
      );

      alert(
        response.data?.message ||
          "Registration successful"
      );

      setFormData({
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        address: "",
        city: "",
        state: "",
        country: "India",
        postal_code: "",
        username: "",
        password: "",
        confirm_password: "",
      });

      setShowPassword(false);
      setShowConfirmPassword(false);

      navigate("/login");
    } catch (error) {
      console.error(
        "Registration Error:",
        error
      );

      if (error.response) {
        console.error(
          "Server Response:",
          error.response.data
        );

        const data = error.response.data;

        if (typeof data === "object") {
          const messages = Object.entries(data)
            .map(([field, message]) => {
              if (Array.isArray(message)) {
                return `${field}: ${message.join(", ")}`;
              }

              return `${field}: ${message}`;
            })
            .join("\n");

          alert(
            messages ||
              "Registration failed."
          );
        } else {
          alert(
            data ||
              "Registration failed."
          );
        }
      } else {
        alert(
          "Unable to connect to server. Please make sure Django is running."
        );
      }
    } finally {
      setLoading(false);
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

          <div className="register-brand">

           <div className="logo-box">
              <img
                src={logo}
                alt="PetCare Store"
                className="brand-logo"
              />
            </div>

            <div className="register-brand-text">

               <h1>
               MarketPlace
              </h1>

              <span>
                Premium care for your pets
              </span>

            </div>

          </div>


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
              noValidate
            >

              <div className="register-form-grid">

                {/* =================================================
                    FIRST NAME
                ================================================= */}

                <div className="register-input-group">

                  <FaUser className="register-input-icon" />

                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    autoComplete="given-name"
                    required
                  />

                </div>


                {/* =================================================
                    LAST NAME
                ================================================= */}

                <div className="register-input-group">

                  <FaUser className="register-input-icon" />

                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    autoComplete="family-name"
                    required
                  />

                </div>


                {/* =================================================
                    PHONE
                ================================================= */}

                <div className="register-input-group">

                  <FaPhone className="register-input-icon" />

                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength="15"
                    required
                  />

                </div>


                {/* =================================================
                    EMAIL
                ================================================= */}

                <div className="register-input-group">

                  <FaEnvelope className="register-input-icon" />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />

                </div>


                {/* =================================================
                    ADDRESS
                ================================================= */}

                <div className="register-input-group">

                  <FaHome className="register-input-icon" />

                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    autoComplete="street-address"
                    required
                  />

                </div>


                {/* =================================================
                    CITY
                ================================================= */}

                <div className="register-input-group">

                  <FaCity className="register-input-icon" />

                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    autoComplete="address-level2"
                    required
                  />

                </div>


                {/* =================================================
                    STATE
                ================================================= */}

                <div className="register-input-group">

                  <FaMapMarkerAlt className="register-input-icon" />

                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    autoComplete="address-level1"
                    required
                  />

                </div>


                {/* =================================================
                    COUNTRY
                ================================================= */}

                <div className="register-input-group">

                  <FaMapMarkerAlt className="register-input-icon" />

                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                    autoComplete="country-name"
                    required
                  />

                </div>


                {/* =================================================
                    POSTAL CODE
                ================================================= */}

                <div className="register-input-group">

                  <FaMapPin className="register-input-icon" />

                  <input
                    type="text"
                    name="postal_code"
                    placeholder="Postal Code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    autoComplete="postal-code"
                    inputMode="numeric"
                    maxLength="10"
                    required
                  />

                </div>


                {/* =================================================
                    USERNAME
                ================================================= */}

                <div className="register-input-group">

                  <FaUser className="register-input-icon" />

                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                  />

                </div>


                {/* =================================================
                    PASSWORD
                ================================================= */}

                <div className="register-input-group">

                  <FaLock className="register-input-icon" />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />


                  <button
                    type="button"
                    className="register-password-toggle"
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
                    CONFIRM PASSWORD
                ================================================= */}

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
                    value={
                      formData.confirm_password
                    }
                    onChange={handleChange}
                    autoComplete="new-password"
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


              {/* =================================================
                  REGISTER BUTTON
              ================================================= */}

              <button
                type="submit"
                className="register-btn"
                disabled={loading}
              >

                {loading
                  ? "Creating Account..."
                  : "Create Account"}

              </button>


              {/* =================================================
                  LOGIN
              ================================================= */}

              <p className="register-login-text">

                Already have an account?

                {" "}

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