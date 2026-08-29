import React from "react";
import "../styles/Footer.css";
import logo from "../assets/logo/Zenve - 01 (1).png";
function Footer() {
    return (
        <footer className="footer">

            {/* ==============================
                MAIN FOOTER
            ============================== */}
            <div className="footer-main">

                {/* BRAND */}
                <div className="footer-column footer-brand">

                    <div className="footer-logo">
                        <img
                            src={logo}
                            alt="Zenve Logo"
                            className="footer-logo-image"
                        />
                    </div>

                    <p className="footer-tagline">
                        Your trusted marketplace for
                        complete pet care.
                    </p>

                    <p className="footer-description">
                        From medicines and food to grooming,
                        accessories and veterinary services,
                        we care for every member of your family.
                    </p>

                    {/* SOCIAL MEDIA */}
                    <div className="footer-social">

                        <a href="#" aria-label="Facebook">
                            f
                        </a>

                        <a href="#" aria-label="Instagram">
                            ◎
                        </a>

                        <a href="#" aria-label="Twitter">
                            𝕏
                        </a>

                        <a href="#" aria-label="YouTube">
                            ▶
                        </a>

                    </div>

                </div>


                {/* QUICK LINKS */}
                <div className="footer-column">

                    <h3>
                        Quick Links
                    </h3>

                    <a href="/">
                        Home
                    </a>

                    <a href="/products">
                        All Products
                    </a>

                    <a href="/products?product_type=Medicine&product_type=Supplements">
                        Medicines & Supplements
                    </a>

                    <a href="/products?product_type=food&product_type=Other">
                        Pet Food & Products
                    </a>

                    <a href="/offers">
                        Offers
                    </a>

                    <a href="/wishlists">
                        Wishlist
                    </a>

                </div>


                {/* PET SERVICES */}
                <div className="footer-column">

                    <h3>
                        Pet Services
                    </h3>

                    <a href="/products?product_type=VetEquipment">
                        Vet Equipment
                    </a>

                    <a href="/home-visit">
                        Home Visit Service
                    </a>

                    <a href="/adoption">
                        Adoption Platform
                    </a>

                    <a href="/prescription/upload">
                        Upload Prescription
                    </a>

                    <a href="/orders">
                        Track Order
                    </a>

                    <a href="/help">
                        Help Center
                    </a>

                </div>


                {/* CUSTOMER SERVICE */}
                <div className="footer-column">

                    <h3>
                        Customer Service
                    </h3>

                    <a href="">
                        Contact Us
                    </a>

                    <a href="">
                        FAQs
                    </a>

                    <a href="">
                        Shipping & Delivery
                    </a>

                    <a href="/refund-return">
                        Returns & Refunds
                    </a>

                    <a href="">
                        Privacy Policy
                    </a>

                    <a href="">
                        Terms & Conditions
                    </a>

                </div>


                {/* CONTACT */}
                <div className="footer-column footer-contact">

                    <h3>
                        Get In Touch
                    </h3>

                    <p>
                        📞 <span>+91 98765 43210</span>
                    </p>

                    <p>
                        ✉️ <span>support@zenve.com</span>
                    </p>

                    <p>
                        📍 <span>India</span>
                    </p>

                    <h4>
                        Download Our App
                    </h4>

                    <div className="app-buttons">

                        <button type="button">
                            ▶ Google Play
                        </button>

                        <button type="button">
                             App Store
                        </button>

                    </div>

                </div>

            </div>


            {/* ==============================
                TRUST SECTION
            ============================== */}

            <div className="footer-trust">

                <div className="trust-item">

                    <span className="trust-icon">
                        🚚
                    </span>

                    <div>
                        <strong>
                            Free Delivery
                        </strong>

                        <small>
                            On orders above ₹99
                        </small>
                    </div>

                </div>


                <div className="trust-item">

                    <span className="trust-icon">
                        🔒
                    </span>

                    <div>
                        <strong>
                            Secure Payments
                        </strong>

                        <small>
                            100% secure checkout
                        </small>
                    </div>

                </div>


                <div className="trust-item">

                    <span className="trust-icon">
                        💙
                    </span>

                    <div>
                        <strong>
                            Trusted Products
                        </strong>

                        <small>
                            Genuine pet products
                        </small>
                    </div>

                </div>


                <div className="trust-item">

                    <span className="trust-icon">
                        🐾
                    </span>

                    <div>
                        <strong>
                            Pet First
                        </strong>

                        <small>
                            Care for every pet
                        </small>
                    </div>

                </div>

            </div>


            {/* ==============================
                BOTTOM FOOTER
            ============================== */}

            <div className="footer-bottom">

                <p>
                    © {new Date().getFullYear()} Zenve Marketplace.
                    All rights reserved.
                </p>

                <div className="footer-bottom-links">

                    <a href="/privacy">
                        Privacy Policy
                    </a>

                    <span>
                        |
                    </span>

                    <a href="/terms">
                        Terms & Conditions
                    </a>

                    <span>
                        |
                    </span>

                    <a href="/refund">
                        Refund Policy
                    </a>

                </div>

            </div>

        </footer>
    );
}

export default Footer;