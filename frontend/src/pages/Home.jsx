import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import "../styles/Home.css";

function Home() {

    const navigate = useNavigate();

    // =====================================================
    // PRODUCTS
    // =====================================================

    const [products, setProducts] = useState([]);


    // =====================================================
    // PET MODAL
    // =====================================================

    const [showPetModal, setShowPetModal] = useState(false);

    const [petDetails, setPetDetails] = useState({
        pet_name: "",
        pet_type: "Dog",
        breed: "",
        age: "",
        gender: "",
        weight: "",
        health_notes: ""
    });
    const [savingPet, setSavingPet] = useState(false);

    const [petMessage, setPetMessage] = useState("");

    // =====================================================
    // LOAD PRODUCTS
    // =====================================================

    useEffect(() => {

        loadProducts();

    }, []);


    const loadProducts = async () => {

        try {

            const response = await api.get("products/?page=1");

            const data = response.data.results || response.data || [];

            setProducts(data.slice(0, 5));

        } catch (error) {

            console.error(
                "Products loading error:",
                error
            );

        }

    };


    // =====================================================
    // PET INPUT CHANGE
    // =====================================================

    const handlePetChange = (e) => {
        const { name, value } = e.target;

        setPetDetails((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    // =====================================================
    // SAVE PET DETAILS
    // =====================================================

     const savePetDetails = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("access");

        if (!token) {
            alert("Please login to save your pet details.");
            navigate("/login");
            return;
        }

        if (!petDetails.pet_name.trim()) {
            alert("Please enter your pet name.");
            return;
        }

        try {
            setSavingPet(true);
            setPetMessage("");

            const response = await api.post(
                "accounts/pets/",
                petDetails,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Pet created:", response.data);

            setPetMessage("Pet details saved successfully!");

            alert(
                `${petDetails.pet_name} details saved successfully!`
            );

            setPetDetails({
                pet_name: "",
                pet_type: "Dog",
                breed: "",
                age: "",
                gender: "",
                weight: "",
                health_notes: ""
            });

            setShowPetModal(false);

        } catch (error) {

            console.error(
                "Save Pet Error:",
                error.response?.data || error
            );

            if (error.response?.status === 401) {

                alert("Your session has expired. Please login again.");

                localStorage.removeItem("access");

                navigate("/login");

            } else if (error.response?.status === 403) {

                alert("You do not have permission to add pet details.");

            } else {

                alert(
                    error.response?.data?.detail ||
                    "Failed to save pet details."
                );
            }

        } finally {

            setSavingPet(false);

        }
    };

    // =====================================================
    // OPEN PET MODAL
    // =====================================================

    const openPetModal = () => {

        setShowPetModal(true);

    };


    // =====================================================
    // CLOSE PET MODAL
    // =====================================================

    const closePetModal = () => {

        setShowPetModal(false);

    };


    return (

        <main className="home-body">


            {/* =====================================================
                HERO SECTION
            ===================================================== */}

            <section className="hero-section">


                {/* HERO CONTENT */}

                <div className="hero-content">


                    <span className="hero-label">
                        Smart Care for Every Pet
                    </span>


                    <h1>

                        Smart Pet

                        <br />

                        <span>
                            Store
                        </span>

                    </h1>


                    <p>

                        Everything your pet needs in one place.
                        Discover food, medicines, supplements,
                        grooming products and expert veterinary
                        care — all designed for smarter pet care.

                    </p>


                    {/* HERO FEATURES */}

                    <div className="hero-features">


                        <div className="hero-feature">

                            <span className="feature-icon">
                                🐾
                            </span>

                            <span>

                                <b>
                                    Personalized
                                </b>

                                Pet Care

                            </span>

                        </div>


                        <div className="hero-feature">

                            <span className="feature-icon">
                                🩺
                            </span>

                            <span>

                                <b>
                                    Expert Vet
                                </b>

                                Support

                            </span>

                        </div>


                        <div className="hero-feature">

                            <span className="feature-icon">
                                🚚
                            </span>

                            <span>

                                <b>
                                    Fast & Safe
                                </b>

                                Delivery

                            </span>

                        </div>


                        <div className="hero-feature">

                            <span className="feature-icon">
                                ❤️
                            </span>

                            <span>

                                <b>
                                    Complete
                                </b>

                                Pet Wellness

                            </span>

                        </div>


                    </div>


                    {/* HERO BUTTONS */}

                    <div className="hero-buttons">


                        <button
                            type="button"
                            onClick={() => navigate("/pets")}
                        >
                            Shop for Your Pet
                        </button>


                        <button
                            type="button"
                            className="hero-outline-btn"
                            onClick={openPetModal}
                        >
                            🐾 Add Your Pet Details
                        </button>


                    </div>


                    <div className="hero-smart-text">

                        ✨ Get smarter recommendations based on your pet

                    </div>


                </div>


                {/* =================================================
                    HERO VISUAL
                ================================================= */}

                <div className="hero-visual">


                    <div className="hero-circle"></div>


                    {/* PET IMAGES */}

                    <div className="hero-pet-images">


                        <img
                            src="/images/home/dog.png"
                            alt="Dog"
                        />


                        <img
                            src="/images/home/cat.png"
                            alt="Cat"
                        />


                    </div>


                    {/* PRODUCTS IMAGE */}

                    <div className="hero-products-image">

                        <img
                            src="/images/home/hero-products.png"
                            alt="Pet products"
                        />

                    </div>


                    {/* DISCOUNT CARD */}

                    <div className="discount-card">


                        <strong>
                            20% OFF
                        </strong>


                        <span>
                            On First Order
                        </span>


                        <button
                            type="button"
                            onClick={() => navigate("/products")}
                        >
                            Use Code: WELCOME10
                        </button>


                    </div>


                </div>


            </section>



            {/* =====================================================
                PET DETAILS MODAL
            ===================================================== */}

            {showPetModal && (

                <div
                    className="pet-modal-overlay"
                    onClick={closePetModal}
                >


                    <div
                        className="pet-modal"
                        onClick={(e) => e.stopPropagation()}
                    >


                        {/* MODAL HEADER */}

                        <div className="pet-modal-header">


                            <div className="pet-modal-title">


                                <span className="pet-modal-icon">
                                    🐾
                                </span>


                                <div>

                                    <h2>
                                        Add Your Pet
                                    </h2>

                                    <p>
                                        Tell us about your pet
                                    </p>

                                </div>


                            </div>


                            <button
                                type="button"
                                className="pet-modal-close"
                                onClick={closePetModal}
                                aria-label="Close"
                            >
                                ×
                            </button>


                        </div>



                        {/* PET FORM */}

                        <form
                            className="pet-details-form"
                            onSubmit={savePetDetails}
                        >


                            {/* PET NAME */}

                            <div className="pet-form-group">

                                <label htmlFor="petName">
                                    Pet Name
                                </label>


                                <input
                                    id="pet_name"
                                    type="text"
                                    name="pet_name"
                                    value={petDetails.pet_name}
                                    onChange={handlePetChange}
                                    placeholder="Enter your pet's name"
                                    required
                                />

                            </div>



                            {/* PET TYPE + GENDER */}

                            <div className="pet-form-row">


                                <div className="pet-form-group">

                                    <label htmlFor="petType">
                                        Pet Type
                                    </label>


                                    <select
                                        id="petType"
                                        name="petType"
                                        value={petDetails.petType}
                                        onChange={handlePetChange}
                                    >

                                        <option value="Dog">
                                            🐶 Dog
                                        </option>

                                        <option value="Cat">
                                            🐱 Cat
                                        </option>

                                        <option value="Bird">
                                            🐦 Bird
                                        </option>

                                        <option value="Rabbit">
                                            🐰 Rabbit
                                        </option>

                                        <option value="Fish">
                                            🐟 Fish
                                        </option>

                                        <option value="Other">
                                            🐾 Other
                                        </option>

                                    </select>

                                </div>



                                <div className="pet-form-group">

                                    <label htmlFor="gender">
                                        Gender
                                    </label>


                                    <select
                                        id="gender"
                                        name="gender"
                                        value={petDetails.gender}
                                        onChange={handlePetChange}
                                    >

                                        <option value="">
                                            Select Gender
                                        </option>

                                        <option value="Male">
                                            Male
                                        </option>

                                        <option value="Female">
                                            Female
                                        </option>

                                    </select>

                                </div>


                            </div>



                            {/* BREED */}

                            <div className="pet-form-group">

                                <label htmlFor="breed">
                                    Breed
                                </label>


                                <input
                                    id="breed"
                                    type="text"
                                    name="breed"
                                    value={petDetails.breed}
                                    onChange={handlePetChange}
                                    placeholder="e.g. Labrador, Persian, Indie"
                                />

                            </div>



                            {/* AGE + WEIGHT */}

                            <div className="pet-form-row">


                                <div className="pet-form-group">

                                    <label htmlFor="age">
                                        Age
                                    </label>


                                    <input
                                        id="age"
                                        type="text"
                                        name="age"
                                        value={petDetails.age}
                                        onChange={handlePetChange}
                                        placeholder="e.g. 2 years"
                                    />

                                </div>



                                <div className="pet-form-group">

                                    <label htmlFor="weight">
                                        Weight
                                    </label>


                                    <input
                                        id="weight"
                                        type="text"
                                        name="weight"
                                        value={petDetails.weight}
                                        onChange={handlePetChange}
                                        placeholder="e.g. 12 kg"
                                    />

                                </div>


                            </div>



                            {/* HEALTH NOTES */}

                            <div className="pet-form-group">

                                <label htmlFor="notes">
                                    Health / Special Requirements
                                </label>


                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={petDetails.notes}
                                    onChange={handlePetChange}
                                    placeholder="Enter allergies or special requirements"
                                    rows="3"
                                />

                            </div>



                            {/* ACTION BUTTONS */}

                            <div className="pet-modal-actions">


                                <button
                                    type="button"
                                    className="pet-cancel-btn"
                                    onClick={closePetModal}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="pet-save-btn"
                                >
                                    🐾 Save Pet Details
                                </button>


                            </div>


                        </form>


                    </div>


                </div>

            )}



            {/* =====================================================
                SHOP BY CATEGORIES
            ===================================================== */}

            <section className="home-section">


                <div className="section-heading">


                    <h2>
                        Shop by Categories
                    </h2>


                    <Link to="/categories">
                        View All Categories →
                    </Link>


                </div>



                <div className="category-grid">


                    <Link
                        to="/products?category=Medicines"
                        className="category-card"
                    >

                        <div className="category-image">

                            <img
                                src="/images/home/medicine.png"
                                alt="Medicines"
                            />

                        </div>


                        <h3>

                            Medicines &

                            <br />

                            Supplements

                        </h3>


                    </Link>



                    <Link
                        to="/products?category=Pet Food"
                        className="category-card"
                    >

                        <div className="category-image">

                            <img
                                src="/images/home/pet-food.png"
                                alt="Pet Food"
                            />

                        </div>


                        <h3>

                            Pet Food &

                            <br />

                            Products

                        </h3>


                    </Link>



                    <Link
                        to="/products?category=Farm"
                        className="category-card"
                    >

                        <div className="category-image">

                            <img
                                src="/images/home/farm.png"
                                alt="Farm Supplies"
                            />

                        </div>


                        <h3>

                            Farm

                            <br />

                            Supplies

                        </h3>


                    </Link>



                    <Link
                        to="/products?category=Vet"
                        className="category-card"
                    >

                        <div className="category-image">

                            <img
                                src="/images/home/vet-equipment.png"
                                alt="Vet Equipment"
                            />

                        </div>


                        <h3>

                            Vet

                            <br />

                            Equipment

                        </h3>


                    </Link>



                    <Link
                        to="/services"
                        className="category-card"
                    >

                        <div className="category-image">

                            <img
                                src="/images/home/home-visit.png"
                                alt="Home Visit"
                            />

                        </div>


                        <h3>

                            Home Visit

                            <br />

                            Service

                        </h3>


                    </Link>



                    <Link
                        to="/adoption"
                        className="category-card"
                    >

                        <div className="category-image adoption-icon">

                            <img
                                src="/images/home/adoption.png"
                                alt="Adoption"
                            />

                        </div>


                        <h3>

                            Adoption

                            <br />

                            Platform

                        </h3>


                    </Link>


                </div>


            </section>



            {/* =====================================================
                MEGA SAVINGS
            ===================================================== */}

            <section className="offer-banner">


                <div className="offer-content">


                    <span>
                        Mega Savings
                    </span>


                    <h2>
                        Upto 30% OFF
                    </h2>


                    <p>
                        On Selected Products
                    </p>


                    <button
                        type="button"
                        onClick={() => navigate("/products")}
                    >
                        Shop Offers →
                    </button>


                </div>



                <div className="offer-image">


                    <img
                        src="/images/home/offer-products.png"
                        alt="Special offers"
                    />


                </div>



                <div className="countdown-box">


                    <strong>
                        Offer Ends In
                    </strong>


                    <div className="countdown-time">

                        <span>
                            02
                        </span>

                        :

                        <span>
                            18
                        </span>

                        :

                        <span>
                            45
                        </span>

                        :

                        <span>
                            30
                        </span>

                    </div>


                    <div className="countdown-labels">

                        <span>
                            Days
                        </span>

                        <span>
                            Hrs
                        </span>

                        <span>
                            Mins
                        </span>

                        <span>
                            Secs
                        </span>

                    </div>


                </div>


            </section>



            {/* =====================================================
                BEST SELLERS
            ===================================================== */}

            <section className="home-section">


                <div className="section-heading">


                    <h2>
                        Best Sellers
                    </h2>


                    <Link to="/products">
                        View All →
                    </Link>


                </div>



                <div className="best-seller-grid">


                    {products.length > 0 ? (

                        products.map((product) => (

                            <ProductCard
                                key={product.id}
                                product={product}
                            />

                        ))

                    ) : (

                        <div className="home-products-loading">

                            <p>
                                No products available.
                            </p>

                        </div>

                    )}


                </div>


            </section>



            {/* =====================================================
                POPULAR SERVICES
            ===================================================== */}

            <section className="home-section">


                <div className="section-heading">


                    <h2>
                        Popular Services
                    </h2>


                    <Link to="/services">
                        View All Services →
                    </Link>


                </div>



                <div className="services-grid">


                    <div className="service-card">

                        <img
                            src="/images/home/home-vet.jpg"
                            alt="Home Visit"
                        />


                        <div className="service-info">

                            <h3>

                                Home Visit

                                <br />

                                by Vet

                            </h3>


                            <span>
                                Starting at ₹499
                            </span>


                            <button
                                type="button"
                                onClick={() => navigate("/services")}
                            >
                                →
                            </button>


                        </div>


                    </div>



                    <div className="service-card">

                        <img
                            src="/images/home/vaccination.jpg"
                            alt="Vaccination"
                        />


                        <div className="service-info">

                            <h3>

                                Vaccination &

                                <br />

                                Deworming

                            </h3>


                            <span>
                                Starting at ₹299
                            </span>


                            <button
                                type="button"
                                onClick={() => navigate("/services")}
                            >
                                →
                            </button>


                        </div>


                    </div>



                    <div className="service-card">

                        <img
                            src="/images/home/grooming.jpg"
                            alt="Pet Grooming"
                        />


                        <div className="service-info">

                            <h3>

                                Pet Grooming

                                <br />

                                at Home

                            </h3>


                            <span>
                                Starting at ₹599
                            </span>


                            <button
                                type="button"
                                onClick={() => navigate("/services")}
                            >
                                →
                            </button>


                        </div>


                    </div>



                    <div className="service-card">

                        <img
                            src="/images/home/checkup.jpg"
                            alt="Health Checkup"
                        />


                        <div className="service-info">

                            <h3>

                                Health Checkup

                                <br />

                                at Home

                            </h3>


                            <span>
                                Starting at ₹699
                            </span>


                            <button
                                type="button"
                                onClick={() => navigate("/services")}
                            >
                                →
                            </button>


                        </div>


                    </div>



                    <div className="service-card">

                        <img
                            src="/images/home/emergency.jpg"
                            alt="Emergency Care"
                        />


                        <div className="service-info">

                            <h3>
                                Emergency Care
                            </h3>


                            <span>
                                Starting at ₹999
                            </span>


                            <button
                                type="button"
                                onClick={() => navigate("/services")}
                            >
                                →
                            </button>


                        </div>


                    </div>


                </div>


            </section>



            {/* =====================================================
                FEATURED PETS
            ===================================================== */}

            <section className="home-section">


                <div className="section-heading">


                    <h2>
                        Featured Pets for Adoption
                    </h2>


                    <Link to="/adoption">
                        View All Pets →
                    </Link>


                </div>



                <div className="pets-grid">


                    <div className="pet-card">

                        <div className="pet-image">


                            <img
                                src="/images/home/bruno.jpg"
                                alt="Bruno"
                            />


                            <span className="pet-type">
                                Dog
                            </span>


                            <button
                                type="button"
                                className="favorite"
                            >
                                ♡
                            </button>


                        </div>


                        <div className="pet-info">


                            <h3>
                                Bruno
                            </h3>


                            <p>
                                2 Years · Male · Labrador
                            </p>


                            <small>
                                📍 Bangalore, Karnataka
                            </small>


                        </div>


                    </div>



                    <div className="pet-card">

                        <div className="pet-image">


                            <img
                                src="/images/home/luna.jpg"
                                alt="Luna"
                            />


                            <span className="pet-type cat">
                                Cat
                            </span>


                            <button
                                type="button"
                                className="favorite"
                            >
                                ♡
                            </button>


                        </div>


                        <div className="pet-info">


                            <h3>
                                Luna
                            </h3>


                            <p>
                                1 Year · Female · Indie
                            </p>


                            <small>
                                📍 Pune, Maharashtra
                            </small>


                        </div>


                    </div>



                    <div className="pet-card">

                        <div className="pet-image">


                            <img
                                src="/images/home/rocky.jpg"
                                alt="Rocky"
                            />


                            <span className="pet-type">
                                Dog
                            </span>


                            <button
                                type="button"
                                className="favorite"
                            >
                                ♡
                            </button>


                        </div>


                        <div className="pet-info">


                            <h3>
                                Rocky
                            </h3>


                            <p>
                                3 Years · Male · German Shepherd
                            </p>


                            <small>
                                📍 Hyderabad, Telangana
                            </small>


                        </div>


                    </div>



                    <div className="pet-card">

                        <div className="pet-image">


                            <img
                                src="/images/home/milo.jpg"
                                alt="Milo"
                            />


                            <span className="pet-type cat">
                                Cat
                            </span>


                            <button
                                type="button"
                                className="favorite"
                            >
                                ♡
                            </button>


                        </div>


                        <div className="pet-info">


                            <h3>
                                Milo
                            </h3>


                            <p>
                                8 Months · Male · Persian
                            </p>


                            <small>
                                📍 Chennai, Tamil Nadu
                            </small>


                        </div>


                    </div>


                </div>


            </section>



            {/* =====================================================
                TRUSTED BRANDS
            ===================================================== */}

            <section className="home-section">


                <div className="section-heading">


                    <h2>
                        Trusted Brands
                    </h2>


                </div>



                <div className="brands-grid">


                    <div>

                        <img
                            src="/images/brands/royal-canin.png"
                            alt="Royal Canin"
                        />

                    </div>


                    <div>

                        <img
                            src="/images/brands/drools.png"
                            alt="Drools"
                        />

                    </div>


                    <div>

                        <img
                            src="/images/brands/pedigree.png"
                            alt="Pedigree"
                        />

                    </div>


                    <div>

                        <img
                            src="/images/brands/himalaya.png"
                            alt="Himalaya"
                        />

                    </div>


                    <div>

                        <img
                            src="/images/brands/virbac.png"
                            alt="Virbac"
                        />

                    </div>


                    <div>

                        <img
                            src="/images/brands/intas.png"
                            alt="Intas"
                        />

                    </div>


                    <div>

                        <img
                            src="/images/brands/bayer.png"
                            alt="Bayer"
                        />

                    </div>


                    <div>

                        <img
                            src="/images/brands/nd.png"
                            alt="N&D"
                        />

                    </div>


                </div>


            </section>



            {/* =====================================================
                REVIEWS
            ===================================================== */}

            <section className="reviews-section">


                <div className="section-heading">


                    <h2>
                        What Pet Parents Say
                    </h2>


                </div>



                <div className="reviews-grid">


                    <div className="review-card">


                        <span className="quote">
                            “
                        </span>


                        <p>

                            VetMart has everything my pet
                            needs — from medicines to healthy
                            food. Delivery is always on time
                            and products are 100% genuine.

                        </p>


                        <div className="review-user">


                            <div className="review-avatar">
                                PS
                            </div>


                            <div>

                                <strong>
                                    Priya Sharma
                                </strong>


                                <span>
                                    ⭐⭐⭐⭐⭐
                                </span>

                            </div>


                        </div>


                    </div>



                    <div className="review-card">


                        <span className="quote">
                            “
                        </span>


                        <p>

                            The home visit service is a
                            lifesaver! The vet was very
                            professional and my pet felt
                            comfortable at home.

                        </p>


                        <div className="review-user">


                            <div className="review-avatar">
                                RM
                            </div>


                            <div>

                                <strong>
                                    Rahul Mehta
                                </strong>


                                <span>
                                    ⭐⭐⭐⭐⭐
                                </span>

                            </div>


                        </div>


                    </div>



                    <div className="review-card">


                        <span className="quote">
                            “
                        </span>


                        <p>

                            We adopted our cute Indie puppy
                            from the platform. Great experience
                            and good support from the team.

                        </p>


                        <div className="review-user">


                            <div className="review-avatar">
                                AI
                            </div>


                            <div>

                                <strong>
                                    Anjali Iyer
                                </strong>


                                <span>
                                    ⭐⭐⭐⭐⭐
                                </span>

                            </div>


                        </div>


                    </div>


                </div>


            </section>


        </main>

    );

}

export default Home;