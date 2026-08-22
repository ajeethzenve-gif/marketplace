import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaHome,
    FaSyringe,
    FaCut,
    FaStethoscope,
    FaAmbulance,
    FaFlask,
    FaPaw,
    FaHospital,
    FaCheckCircle,
    FaArrowRight,
    FaTimes,
} from "react-icons/fa";

import "../styles/Services.css";

function Services() {
    const navigate = useNavigate();

    const [selectedService, setSelectedService] =
        useState(null);

    const services = [
        {
            id: 1,
            title: "Vet Home Visit",
            description:
                "Book an experienced veterinarian for a professional consultation at your home.",
            price: "Starting at ₹499",
            icon: <FaHome />,
            features: [
                "Professional veterinarian",
                "Home consultation",
                "Pet health assessment",
                "Basic treatment guidance",
            ],
        },
        {
            id: 2,
            title: "Vaccination & Deworming",
            description:
                "Keep your pet healthy and protected with essential vaccinations and deworming.",
            price: "Starting at ₹299",
            icon: <FaSyringe />,
            features: [
                "Vaccination schedule",
                "Deworming treatment",
                "Health monitoring",
                "Vet consultation",
            ],
        },
        {
            id: 3,
            title: "Pet Grooming",
            description:
                "Professional grooming services to keep your pet clean, healthy and happy.",
            price: "Starting at ₹599",
            icon: <FaCut />,
            features: [
                "Bath and cleaning",
                "Hair trimming",
                "Nail clipping",
                "Ear cleaning",
            ],
        },
        {
            id: 4,
            title: "Health Checkup",
            description:
                "Complete health checkup for your pet from qualified veterinary professionals.",
            price: "Starting at ₹699",
            icon: <FaStethoscope />,
            features: [
                "General examination",
                "Weight check",
                "Health assessment",
                "Vet recommendations",
            ],
        },
        {
            id: 5,
            title: "Emergency Pet Care",
            description:
                "Quick assistance for urgent pet health and emergency care requirements.",
            price: "Starting at ₹999",
            icon: <FaAmbulance />,
            features: [
                "Priority consultation",
                "Emergency support",
                "Professional guidance",
                "Quick response",
            ],
        },
        {
            id: 6,
            title: "Pet Lab Tests",
            description:
                "Book diagnostic and laboratory tests recommended by veterinary professionals.",
            price: "Starting at ₹399",
            icon: <FaFlask />,
            features: [
                "Blood tests",
                "Urine tests",
                "Diagnostic support",
                "Test reports",
            ],
        },
        {
            id: 7,
            title: "Pet Training",
            description:
                "Professional training sessions to improve your pet's behaviour and obedience.",
            price: "Starting at ₹799",
            icon: <FaPaw />,
            features: [
                "Basic obedience",
                "Behaviour training",
                "Social training",
                "Expert trainers",
            ],
        },
        {
            id: 8,
            title: "Clinic Consultation",
            description:
                "Book an appointment with experienced veterinarians at partner clinics.",
            price: "Starting at ₹499",
            icon: <FaHospital />,
            features: [
                "Experienced veterinarians",
                "Detailed consultation",
                "Health diagnosis",
                "Treatment guidance",
            ],
        },
    ];

    const openBooking = (service) => {
        setSelectedService(service);
    };

    const closeBooking = () => {
        setSelectedService(null);
    };

    const confirmBooking = () => {
        if (!selectedService) return;

        navigate("/login");

        // Later you can replace this with:
        // navigate(`/service-booking/${selectedService.id}`);
    };

    return (
        <div className="services-page">

            {/* ================= HERO ================= */}

            <section className="services-hero">

                <div className="services-hero-content">

                    <span className="services-label">
                        🐾 PROFESSIONAL PET CARE
                    </span>

                    <h1>
                        Everything Your Pet Needs,
                        <span> All in One Place</span>
                    </h1>

                    <p>
                        Book trusted pet care services from
                        experienced veterinarians and pet care
                        professionals.
                    </p>

                    <button
                        type="button"
                        className="services-hero-btn"
                        onClick={() =>
                            document
                                .querySelector(".services-grid")
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                })
                        }
                    >
                        Explore Services
                        <FaArrowRight />
                    </button>

                </div>

                <div className="services-hero-visual">

                    <div className="hero-paw hero-paw-one">
                        🐾
                    </div>

                    <div className="hero-paw hero-paw-two">
                        🐶
                    </div>

                    <div className="hero-paw hero-paw-three">
                        🐱
                    </div>

                    <div className="services-hero-card">

                        <FaStethoscope />

                        <h3>
                            Trusted Pet Care
                        </h3>

                        <p>
                            Expert professionals for your
                            beloved pets.
                        </p>

                    </div>

                </div>

            </section>

            {/* ================= STATS ================= */}

            <section className="services-stats">

                <div className="service-stat">

                    <strong>500+</strong>

                    <span>
                        Happy Pet Parents
                    </span>

                </div>

                <div className="service-stat">

                    <strong>50+</strong>

                    <span>
                        Pet Care Experts
                    </span>

                </div>

                <div className="service-stat">

                    <strong>1000+</strong>

                    <span>
                        Successful Services
                    </span>

                </div>

                <div className="service-stat">

                    <strong>4.8 ★</strong>

                    <span>
                        Customer Rating
                    </span>

                </div>

            </section>

            {/* ================= SERVICES ================= */}

            <section className="services-section">

                <div className="services-heading">

                    <span>
                        OUR SERVICES
                    </span>

                    <h2>
                        Professional Care for Every Pet
                    </h2>

                    <p>
                        Choose from a range of trusted pet care
                        services designed to keep your pet happy
                        and healthy.
                    </p>

                </div>

                <div className="services-grid">

                    {services.map((service) => (

                        <div
                            className="service-card"
                            key={service.id}
                        >

                            <div className="service-card-icon">

                                {service.icon}

                            </div>

                            <h3>
                                {service.title}
                            </h3>

                            <p>
                                {service.description}
                            </p>

                            <div className="service-price">

                                {service.price}

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    openBooking(service)
                                }
                            >
                                Book Service
                                <FaArrowRight />
                            </button>

                        </div>

                    ))}

                </div>

            </section>

            {/* ================= WHY CHOOSE ================= */}

            <section className="why-services">

                <div className="why-services-content">

                    <span>
                        WHY CHOOSE ZENVE
                    </span>

                    <h2>
                        Pet Care You Can Trust
                    </h2>

                    <p>
                        We connect pet parents with reliable
                        veterinary and pet care professionals.
                    </p>

                    <div className="why-list">

                        <div>
                            <FaCheckCircle />

                            <span>
                                Experienced professionals
                            </span>
                        </div>

                        <div>
                            <FaCheckCircle />

                            <span>
                                Convenient home services
                            </span>
                        </div>

                        <div>
                            <FaCheckCircle />

                            <span>
                                Transparent pricing
                            </span>
                        </div>

                        <div>
                            <FaCheckCircle />

                            <span>
                                Easy online booking
                            </span>
                        </div>

                    </div>

                </div>

                <div className="why-services-image">

                    <div className="why-circle">
                        🐶
                    </div>

                    <div className="why-small-card">

                        <FaCheckCircle />

                        <div>

                            <strong>
                                Trusted Experts
                            </strong>

                            <span>
                                Verified pet professionals
                            </span>

                        </div>

                    </div>

                </div>

            </section>

            {/* ================= BOOKING MODAL ================= */}

            {selectedService && (

                <div
                    className="service-modal-overlay"
                    onClick={closeBooking}
                >

                    <div
                        className="service-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            type="button"
                            className="service-modal-close"
                            onClick={closeBooking}
                        >
                            <FaTimes />
                        </button>

                        <div className="service-modal-icon">

                            {selectedService.icon}

                        </div>

                        <h2>
                            {selectedService.title}
                        </h2>

                        <p>
                            {selectedService.description}
                        </p>

                        <div className="service-modal-price">

                            {selectedService.price}

                        </div>

                        <h3>
                            What's Included
                        </h3>

                        <ul>

                            {selectedService.features.map(
                                (feature) => (

                                    <li key={feature}>

                                        <FaCheckCircle />

                                        {feature}

                                    </li>

                                )
                            )}

                        </ul>

                        <div className="service-modal-actions">

                            <button
                                type="button"
                                className="service-cancel-btn"
                                onClick={closeBooking}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="service-confirm-btn"
                                onClick={confirmBooking}
                            >
                                Continue Booking
                                <FaArrowRight />
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Services;