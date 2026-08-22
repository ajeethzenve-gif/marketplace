import { useState } from "react";
import {
    FaHome,
    FaUserMd,
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaPaw,
    FaPhoneAlt,
    FaCheckCircle,
    FaTimes,
} from "react-icons/fa";

import "../styles/HomeVisit.css";

function HomeVisit() {
    const [formData, setFormData] = useState({
        petName: "",
        petType: "",
        service: "",
        date: "",
        time: "",
        address: "",
        phone: "",
        notes: "",
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Backend is not available yet.
        // This only demonstrates the frontend flow.
        setShowSuccess(true);
    };

    return (
        <div className="home-visit-page">

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="home-visit-hero">

                <div className="home-visit-hero-content">

                    <span className="home-visit-label">
                        <FaHome />
                        HOME VISIT SERVICE
                    </span>

                    <h1>
                        Professional Pet Care,
                        <span> Right at Your Doorstep</span>
                    </h1>

                    <p>
                        No need to travel with your pet. Book a convenient
                        home visit from trusted pet care professionals.
                    </p>

                    <button
                        type="button"
                        className="hero-book-button"
                        onClick={() =>
                            document
                                .getElementById("booking-section")
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                })
                        }
                    >
                        <FaCalendarAlt />
                        Book a Home Visit
                    </button>

                </div>

                <div className="hero-pet-icon">
                    <FaPaw />
                </div>

            </section>


            {/* =====================================================
                SERVICES
            ===================================================== */}

            <section className="home-visit-container">

                <div className="section-heading">
                    <span>OUR SERVICES</span>

                    <h2>
                        Care That Comes to You
                    </h2>

                    <p>
                        Choose the service your pet needs and schedule a
                        convenient visit at home.
                    </p>
                </div>


                <div className="home-service-grid">

                    <div className="home-service-card">

                        <div className="service-icon blue">
                            <FaUserMd />
                        </div>

                        <h3>Veterinary Consultation</h3>

                        <p>
                            Get professional veterinary consultation without
                            leaving your home.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setFormData((prev) => ({
                                    ...prev,
                                    service: "Veterinary Consultation",
                                }))
                            }
                        >
                            Select Service
                        </button>

                    </div>


                    <div className="home-service-card">

                        <div className="service-icon orange">
                            <FaPaw />
                        </div>

                        <h3>Pet Grooming</h3>

                        <p>
                            Professional grooming services designed to keep
                            your pet clean and comfortable.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setFormData((prev) => ({
                                    ...prev,
                                    service: "Pet Grooming",
                                }))
                            }
                        >
                            Select Service
                        </button>

                    </div>


                    <div className="home-service-card">

                        <div className="service-icon green">
                            <FaCheckCircle />
                        </div>

                        <h3>Health Checkup</h3>

                        <p>
                            Routine health checks to help monitor your pet's
                            overall health.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setFormData((prev) => ({
                                    ...prev,
                                    service: "Health Checkup",
                                }))
                            }
                        >
                            Select Service
                        </button>

                    </div>


                    <div className="home-service-card">

                        <div className="service-icon purple">
                            <FaHome />
                        </div>

                        <h3>Pet Care Visit</h3>

                        <p>
                            Convenient in-home assistance for your pet's
                            everyday care needs.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setFormData((prev) => ({
                                    ...prev,
                                    service: "Pet Care Visit",
                                }))
                            }
                        >
                            Select Service
                        </button>

                    </div>

                </div>

            </section>


            {/* =====================================================
                HOW IT WORKS
            ===================================================== */}

            <section className="how-home-visit-works">

                <div className="section-heading">

                    <span>HOW IT WORKS</span>

                    <h2>
                        Simple Home Visit Booking
                    </h2>

                </div>


                <div className="steps-grid">

                    <div className="visit-step">

                        <div className="step-number">
                            01
                        </div>

                        <FaCalendarAlt />

                        <h3>Choose a Service</h3>

                        <p>
                            Select the home service your pet needs.
                        </p>

                    </div>


                    <div className="visit-step">

                        <div className="step-number">
                            02
                        </div>

                        <FaClock />

                        <h3>Select Date & Time</h3>

                        <p>
                            Choose a convenient date and time for your visit.
                        </p>

                    </div>


                    <div className="visit-step">

                        <div className="step-number">
                            03
                        </div>

                        <FaMapMarkerAlt />

                        <h3>Provide Your Location</h3>

                        <p>
                            Tell us where your pet needs the service.
                        </p>

                    </div>


                    <div className="visit-step">

                        <div className="step-number">
                            04
                        </div>

                        <FaCheckCircle />

                        <h3>Confirm Booking</h3>

                        <p>
                            Confirm your request and wait for the visit.
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================================
                BOOKING
            ===================================================== */}

            <section
                className="booking-section"
                id="booking-section"
            >

                <div className="booking-wrapper">

                    <div className="booking-information">

                        <span className="booking-label">
                            BOOK A VISIT
                        </span>

                        <h2>
                            Schedule a Home Visit
                        </h2>

                        <p>
                            Fill in your pet and location details. Our service
                            team can use these details to arrange your visit.
                        </p>


                        <div className="booking-benefit">

                            <FaHome />

                            <div>
                                <h4>Convenient Care</h4>
                                <p>
                                    Get pet care without travelling.
                                </p>
                            </div>

                        </div>


                        <div className="booking-benefit">

                            <FaUserMd />

                            <div>
                                <h4>Professional Service</h4>
                                <p>
                                    Care designed around your pet's needs.
                                </p>
                            </div>

                        </div>


                        <div className="booking-benefit">

                            <FaClock />

                            <div>
                                <h4>Flexible Scheduling</h4>
                                <p>
                                    Select a suitable date and time.
                                </p>
                            </div>

                        </div>

                    </div>


                    <form
                        className="home-booking-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-title">
                            <FaHome />
                            <h3>Visit Details</h3>
                        </div>


                        <div className="form-row">

                            <div className="form-group">
                                <label>
                                    Pet Name
                                </label>

                                <input
                                    type="text"
                                    name="petName"
                                    value={formData.petName}
                                    onChange={handleChange}
                                    placeholder="Enter pet name"
                                    required
                                />
                            </div>


                            <div className="form-group">
                                <label>
                                    Pet Type
                                </label>

                                <select
                                    name="petType"
                                    value={formData.petType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Select pet type
                                    </option>

                                    <option value="Dog">
                                        Dog
                                    </option>

                                    <option value="Cat">
                                        Cat
                                    </option>

                                    <option value="Rabbit">
                                        Rabbit
                                    </option>

                                    <option value="Bird">
                                        Bird
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>
                                </select>
                            </div>

                        </div>


                        <div className="form-group">

                            <label>
                                Service
                            </label>

                            <select
                                name="service"
                                value={formData.service}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select service
                                </option>

                                <option value="Veterinary Consultation">
                                    Veterinary Consultation
                                </option>

                                <option value="Pet Grooming">
                                    Pet Grooming
                                </option>

                                <option value="Health Checkup">
                                    Health Checkup
                                </option>

                                <option value="Pet Care Visit">
                                    Pet Care Visit
                                </option>

                            </select>

                        </div>


                        <div className="form-row">

                            <div className="form-group">

                                <label>
                                    Preferred Date
                                </label>

                                <div className="input-with-icon">

                                    <FaCalendarAlt />

                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>


                            <div className="form-group">

                                <label>
                                    Preferred Time
                                </label>

                                <div className="input-with-icon">

                                    <FaClock />

                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                        </div>


                        <div className="form-group">

                            <label>
                                Home Address
                            </label>

                            <div className="input-with-icon textarea-icon">

                                <FaMapMarkerAlt />

                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter complete address"
                                    rows="3"
                                    required
                                />

                            </div>

                        </div>


                        <div className="form-group">

                            <label>
                                Phone Number
                            </label>

                            <div className="input-with-icon">

                                <FaPhoneAlt />

                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    required
                                />

                            </div>

                        </div>


                        <div className="form-group">

                            <label>
                                Additional Notes
                            </label>

                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Tell us anything important about your pet..."
                                rows="3"
                            />

                        </div>


                        <button
                            type="submit"
                            className="submit-booking"
                        >
                            <FaCalendarAlt />
                            Request Home Visit
                        </button>

                    </form>

                </div>

            </section>


            {/* =====================================================
                SUCCESS MODAL
            ===================================================== */}

            {showSuccess && (

                <div className="booking-modal-overlay">

                    <div className="booking-success-modal">

                        <button
                            type="button"
                            className="modal-close"
                            onClick={() => setShowSuccess(false)}
                        >
                            <FaTimes />
                        </button>

                        <div className="success-icon">
                            <FaCheckCircle />
                        </div>

                        <h2>
                            Request Received
                        </h2>

                        <p>
                            Your home visit request has been recorded on this
                            page. Backend booking functionality is not
                            connected yet.
                        </p>

                        <button
                            type="button"
                            onClick={() => setShowSuccess(false)}
                            className="success-button"
                        >
                            Done
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}

export default HomeVisit;