import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Help.css";

function Help() {
    const [openFAQ, setOpenFAQ] = useState(null);

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };
    const openAIChat = () => {
            window.location.href = "https://zynvo.ai/";
        };
    const faqs = [
        {
            question: "How do I place an order?",
            answer:
                "Browse the products you need, open the product details, select the required quantity and click Add to Cart. Then go to your cart, proceed to checkout, enter your delivery details and complete the payment."
        },
        {
            question: "How can I track my order?",
            answer:
                "After placing an order, you can view your order status from your account. Go to My Orders and select the order you want to track."
        },
        {
            question: "Can I cancel my order?",
            answer:
                "Order cancellation depends on the current status of your order. If the order has not been shipped, you may be able to cancel it from your order details."
        },
        {
            question: "What payment methods are available?",
            answer:
                "You can complete your purchase using the payment methods supported by the checkout system. Select your preferred payment method during checkout."
        },
        {
            question: "How can I upload a prescription?",
            answer:
                "Go to the Prescription Upload section, select your prescription file and submit it. Our system can use the prescription information to help you find the appropriate medicines."
        },
        {
            question: "Do I need a prescription for all medicines?",
            answer:
                "Some medicines may require a valid veterinary prescription. Prescription requirements depend on the specific product."
        },
        {
            question: "How can I book a veterinary home visit?",
            answer:
                "Go to the Home Visit Service section and choose the service you need. Follow the booking process to provide your pet and appointment details."
        },
        {
            question: "How can I add my pet details?",
            answer:
                "You can add your pet's information from the pet section of your account. Providing your pet's details can help with personalized product recommendations."
        },
        {
            question: "Can I get help choosing products for my pet?",
            answer:
                "Yes. You can use our AI Pet Care Assistant for general pet-care guidance, product assistance and smart recommendations."
        },
        {
            question: "How do I contact customer support?",
            answer:
                "You can contact our support team using the contact details provided in the Contact Support section of this page."
        }
    ];

    return (
        <main className="help-page">

            {/* ================================
                HERO
            ================================= */}

            <section className="help-hero">

                <div className="help-hero-content">

                    <span className="help-badge">
                        🐾 ZENVE MARKETPLACE SUPPORT
                    </span>

                    <h1>
                        How Can We
                        <span> Help You?</span>
                    </h1>

                    <p>
                        Find answers to common questions about
                        products, orders, payments, prescriptions,
                        pet services and more.
                    </p>

                    <div className="help-search">

                        <span className="search-icon">
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search for help..."
                        />

                    </div>

                </div>

                <div className="help-hero-icon">
                    🐶
                </div>

            </section>


            {/* ================================
                QUICK HELP
            ================================= */}

            <section className="help-section">

                <div className="help-section-heading">

                    <span>
                        QUICK HELP
                    </span>

                    <h2>
                        What Do You Need Help With?
                    </h2>

                    <p>
                        Select a topic to quickly find the information
                        you are looking for.
                    </p>

                </div>

                <div className="help-category-grid">

                    <Link
                        to="/products"
                        className="help-category-card"
                    >
                        <div className="help-category-icon">
                            🛍️
                        </div>

                        <h3>
                            Shopping
                        </h3>

                        <p>
                            Browse products and learn how to place
                            an order.
                        </p>

                        <span>
                            Get Help →
                        </span>
                    </Link>


                    <Link
                        to="/orders"
                        className="help-category-card"
                    >
                        <div className="help-category-icon">
                            📦
                        </div>

                        <h3>
                            Orders
                        </h3>

                        <p>
                            Track, manage and understand your orders.
                        </p>

                        <span>
                            Get Help →
                        </span>
                    </Link>


                    <div className="help-category-card">

                        <div className="help-category-icon">
                            💳
                        </div>

                        <h3>
                            Payments
                        </h3>

                        <p>
                            Get information about payments and
                            checkout.
                        </p>

                        <span>
                            Get Help →
                        </span>

                    </div>


                    <Link
                        to="/prescription-upload"
                        className="help-category-card"
                    >
                        <div className="help-category-icon">
                            💊
                        </div>

                        <h3>
                            Medicines
                        </h3>

                        <p>
                            Learn about prescriptions and medicines.
                        </p>

                        <span>
                            Get Help →
                        </span>
                    </Link>


                    <Link
                        to="/services"
                        className="help-category-card"
                    >
                        <div className="help-category-icon">
                            🩺
                        </div>

                        <h3>
                            Vet Services
                        </h3>

                        <p>
                            Get help with veterinary and home visit
                            services.
                        </p>

                        <span>
                            Get Help →
                        </span>
                    </Link>


                    <Link
                        to="/adoption"
                        className="help-category-card"
                    >
                        <div className="help-category-icon">
                            🐾
                        </div>

                        <h3>
                            Pet Adoption
                        </h3>

                        <p>
                            Learn more about finding and adopting pets.
                        </p>

                        <span>
                            Get Help →
                        </span>
                    </Link>

                </div>

            </section>


            {/* ================================
                HOW IT WORKS
            ================================= */}

            <section className="help-how-section">

                <div className="help-section-heading">

                    <span>
                        SIMPLE & EASY
                    </span>

                    <h2>
                        How Zenve Works
                    </h2>

                </div>

                <div className="help-steps">

                    <div className="help-step">

                        <div className="help-step-number">
                            01
                        </div>

                        <div className="help-step-icon">
                            🔎
                        </div>

                        <h3>
                            Find Products
                        </h3>

                        <p>
                            Browse medicines, food, supplements,
                            accessories and other pet products.
                        </p>

                    </div>


                    <div className="help-step">

                        <div className="help-step-number">
                            02
                        </div>

                        <div className="help-step-icon">
                            🛒
                        </div>

                        <h3>
                            Add to Cart
                        </h3>

                        <p>
                            Select your products and add them
                            to your shopping cart.
                        </p>

                    </div>


                    <div className="help-step">

                        <div className="help-step-number">
                            03
                        </div>

                        <div className="help-step-icon">
                            💳
                        </div>

                        <h3>
                            Checkout
                        </h3>

                        <p>
                            Enter your delivery information and
                            complete your payment.
                        </p>

                    </div>


                    <div className="help-step">

                        <div className="help-step-number">
                            04
                        </div>

                        <div className="help-step-icon">
                            🚚
                        </div>

                        <h3>
                            Track Delivery
                        </h3>

                        <p>
                            Follow your order status until your
                            products reach you.
                        </p>

                    </div>

                </div>

            </section>


            {/* ================================
                FAQ
            ================================= */}

            <section className="faq-section">

                <div className="help-section-heading">

                    <span>
                        FAQ
                    </span>

                    <h2>
                        Frequently Asked Questions
                    </h2>

                    <p>
                        Find quick answers to the most common
                        questions from our customers.
                    </p>

                </div>

                <div className="faq-container">

                    {faqs.map((faq, index) => (

                        <div
                            className={
                                openFAQ === index
                                    ? "faq-item active"
                                    : "faq-item"
                            }
                            key={index}
                        >

                            <button
                                type="button"
                                className="faq-question"
                                onClick={() =>
                                    toggleFAQ(index)
                                }
                            >

                                <span>
                                    {faq.question}
                                </span>

                                <span className="faq-icon">
                                    {openFAQ === index
                                        ? "−"
                                        : "+"}
                                </span>

                            </button>

                            {openFAQ === index && (

                                <div className="faq-answer">

                                    <p>
                                        {faq.answer}
                                    </p>

                                </div>

                            )}

                        </div>

                    ))}

                </div>

            </section>


            {/* ================================
                AI ASSISTANT
            ================================= */}

            <section className="help-ai-section">

                <div className="help-ai-visual">

                    <div className="help-ai-circle">
                        🤖
                    </div>

                    <div className="help-ai-floating one">
                        🐶
                    </div>

                    <div className="help-ai-floating two">
                        💡
                    </div>

                    <div className="help-ai-floating three">
                        ❤️
                    </div>

                </div>

                <div className="help-ai-content">

                    <span className="help-ai-badge">
                        ✨ Zynvo AI
                    </span>

                    <h2>
                        Still Need Help?
                    </h2>

                    <p>
                        Meet our AI Pet Care Assistant. Ask questions
                        about your pet, get general pet-care guidance,
                        discover products and receive smart assistance.
                    </p>

                    <Link
                        to="/ai-chat"
                        className="help-ai-button"
                    >
                        💬 Chat With Our AI
                    </Link>

                </div>

            </section>


            {/* ================================
                CONTACT SUPPORT
            ================================= */}

            <section className="support-section">

                <div className="support-heading">

                    <span>
                        CUSTOMER SUPPORT
                    </span>

                    <h2>
                        We're Here to Help
                    </h2>

                    <p>
                        If you couldn't find the answer you were
                        looking for, our support team is ready to help.
                    </p>

                </div>

                <div className="support-grid">

                    <div className="support-card">

                        <div className="support-icon">
                            📧
                        </div>

                        <h3>
                            Email Support
                        </h3>

                        <p>
                            Send us your questions and our support
                            team will get back to you.
                        </p>

                        <a href="mailto:support@zenve.com">
                            support@zenve.com
                        </a>

                    </div>


                    <div className="support-card">

                        <div className="support-icon">
                            📞
                        </div>

                        <h3>
                            Call Us
                        </h3>

                        <p>
                            Talk to our support team for assistance
                            with your orders and services.
                        </p>

                        <a href="tel:+919999999999">
                            +91 99999 99999
                        </a>

                    </div>


                    <div className="support-card">

                        <div className="support-icon">
                            💬
                        </div>

                        <h3>
                            AI Assistant
                        </h3>

                        <p>
                            Get instant assistance from our AI
                            Pet Care Assistant.
                        </p>

                        <Link to="/ai-chat">
                            Start Chat →
                        </Link>

                    </div>

                </div>

            </section>


            {/* ================================
                FINAL CTA
            ================================= */}

            <section className="help-final-cta">

                <div>

                    <span>
                        🐾 ZENVE PETCARE
                    </span>

                    <h2>
                        Your Pet's Health & Happiness Matter
                    </h2>

                    <p>
                        Shop smarter, care better and give your
                        pet the best possible life.
                    </p>

                </div>

                <Link
                    to="/products"
                    className="help-shop-button"
                >
                    Start Shopping →
                </Link>

            </section>

        </main>
    );
}

export default Help;