import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import ProductCard from "../components/ProductCard";

import dogImage from "../assets/images/dog-transparent.png";
import catImage from "../assets/images/cat-transparent.png";
import productImage from "../assets/images/product-transparent.png";
import petAdoption from "../assets/images/pet-adoption-removebg.png";
import homeService from "../assets/images/pet_home_service_remove_bg.png";
import prescriptionUpload from "../assets/images/prescription_upload-removebg.png";
import offerProduct from "../assets/images/offer_proudct-removebg.png";

import "../styles/Home.css";

function Home() {
    const navigate = useNavigate();

    // =====================================================
    // PRODUCTS
    // =====================================================

    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);

    // =====================================================
    // PET MODAL
    // =====================================================

    const [showPetModal, setShowPetModal] = useState(false);
    const [savingPet, setSavingPet] = useState(false);

    const [petDetails, setPetDetails] = useState({
        pet_name: "",
        pet_type: "Dog",
        breed: "",
        age: "",
        gender: "",
        weight: "",
        health_notes: "",
    });

    // =====================================================
    // LOAD ALL PRODUCTS
    // =====================================================

    useEffect(() => {
        loadAllProducts();
    }, []);

    const loadAllProducts = async () => {
        try {
            setProductsLoading(true);

            let allProducts = [];
            let page = 1;

            while (true) {
                const response = await api.get(
                    `products/?page=${page}`
                );

                const responseData = response.data;

                // ---------------------------------------------
                // PAGINATED RESPONSE
                // ---------------------------------------------

                if (
                    responseData &&
                    Array.isArray(responseData.results)
                ) {
                    allProducts = [
                        ...allProducts,
                        ...responseData.results,
                    ];

                    if (responseData.next) {
                        page += 1;
                        continue;
                    }

                    break;
                }

                // ---------------------------------------------
                // NON PAGINATED RESPONSE
                // ---------------------------------------------

                if (Array.isArray(responseData)) {
                    allProducts = responseData;
                }

                break;
            }

            // ---------------------------------------------
            // REMOVE DUPLICATES
            // ---------------------------------------------

            const uniqueProducts = [];
            const productIds = new Set();

            allProducts.forEach((product) => {
                if (!product || product.id == null) {
                    return;
                }

                if (!productIds.has(product.id)) {
                    productIds.add(product.id);
                    uniqueProducts.push(product);
                }
            });

            console.log(
                "TOTAL PRODUCTS:",
                uniqueProducts.length
            );

            console.log(
                "PRODUCT DATA:",
                uniqueProducts
            );

            setProducts(uniqueProducts);
        } catch (error) {
            console.error(
                "PRODUCT LOAD ERROR:",
                error.response?.data || error
            );

            setProducts([]);
        } finally {
            setProductsLoading(false);
        }
    };

    // =====================================================
    // NORMALIZE PRODUCT TYPE
    // =====================================================

    const getProductType = (product) => {
        return String(product?.product_type || "")
            .trim()
            .toLowerCase()
            .replace(/[\s_-]/g, "");
    };

    // =====================================================
    // MEDICINE + SUPPLEMENTS
    // =====================================================

    const medicineProducts = products
        .filter((product) => {
            const type = getProductType(product);

            return (
                type === "medicine" ||
                type === "supplement" ||
                type === "supplements"
            );
        })
        .slice(0, 5);

    // =====================================================
    // FOOD + OTHER
    // =====================================================

    const foodAndOtherProducts = products
        .filter((product) => {
            const type = getProductType(product);

            return (
                type === "food" ||
                type === "treats" ||
                type === "grooming" ||
                type === "hygiene" ||
                type === "fleatick" ||
                type === "deworming" ||
                type === "dentalcare" ||
                type === "skincare" ||
                type === "jointcare" ||
                type === "vitamins" ||
                type === "accessories" ||
                type === "toys" ||
                type === "beds" ||
                type === "leashes" ||
                type === "clothing" ||
                type === "feeding" ||
                type === "aquarium" ||
                type === "birdcare" ||
                type === "other"
            );
        })
        .slice(0, 5);

    // =====================================================
    // VET EQUIPMENT
    // =====================================================

    const vetEquipmentProducts = products
        .filter((product) => {
            const type = getProductType(product);

            return (
                type === "vetequipment" ||
                type === "veterinaryequipment"
            );
        })
        .slice(0, 5);

    // =====================================================
    // FARM SUPPLIES
    // =====================================================

    const farmSupplyProducts = products
        .filter((product) => {
            const type = getProductType(product);

            return (
                type === "farmsupply" ||
                type === "farmsupplies"
            );
        })
        .slice(0, 5);

    // =====================================================
    // DEBUG
    // =====================================================

    useEffect(() => {
        if (!products.length) return;

        console.log(
            "MEDICINE + SUPPLEMENT:",
            medicineProducts.length
        );

        console.log(
            "FOOD + OTHER:",
            foodAndOtherProducts.length
        );

        console.log(
            "VET EQUIPMENT:",
            vetEquipmentProducts.length
        );

        console.log(
            "FARM SUPPLIES:",
            farmSupplyProducts.length
        );
    }, [products]);

    // =====================================================
    // PET CHANGE
    // =====================================================

    const handlePetChange = (e) => {
        const { name, value } = e.target;

        setPetDetails((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =====================================================
    // SAVE PET
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

            const response = await api.post(
                "accounts/pets/",
                petDetails,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(
                "Pet created:",
                response.data
            );

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
                health_notes: "",
            });

            setShowPetModal(false);
        } catch (error) {
            console.error(
                "Save Pet Error:",
                error.response?.data || error
            );

            if (error.response?.status === 401) {
                alert(
                    "Your session has expired. Please login again."
                );

                localStorage.removeItem("access");

                navigate("/login");
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
    // HERO SLIDES
    // =====================================================

    const [currentSlide, setCurrentSlide] = useState(0);

    const heroSlides = [
        {
            key: "store",
            label: "Smart Care for Every Pet",
            title: (
                <>
                    Smart Pet
                    <br />
                    <span>Store</span>
                </>
            ),
            description:
                "Everything your pet needs in one place. Discover food, medicines, supplements, grooming products and expert veterinary care.",
            primaryText: "Shop for Your Pet",
            primaryAction: () =>
                navigate("/products"),
            secondaryText: "🐾 Add Your Pet Details",
            secondaryAction: () =>
                setShowPetModal(true),
            smartText:
                "✨ Get smarter recommendations based on your pet",
            image: productImage,
            imageAlt: "Pet products",
        },

        {
            key: "adoption",
            label: "Find Your New Best Friend",
            title: (
                <>
                    Pet
                    <br />
                    <span>Adoption</span>
                </>
            ),
            description:
                "Give a loving pet a forever home. Explore adorable pets waiting for their perfect family.",
            primaryText: "View Pets",
            primaryAction: () =>
                navigate("/adoption"),
            secondaryText: "🐾 Start Adoption",
            secondaryAction: () =>
                navigate("/adoption"),
            smartText:
                "❤️ Give a pet the loving home they deserve",
            image: petAdoption,
            imageAlt: "Pet adoption",
        },

        {
            key: "prescription",
            label: "Easy & Secure Medicine Ordering",
            title: (
                <>
                    Prescription
                    <br />
                    <span>Upload</span>
                </>
            ),
            description:
                "Upload your pet's prescription and quickly find the medicines recommended by your veterinarian.",
            primaryText: "Upload Prescription",
            primaryAction: () =>
                navigate("/prescription-upload"),
            secondaryText: "View Medicines",
            secondaryAction: () =>
                navigate(
                    "/products?category=Medicine"
                ),
            smartText:
                "📄 Simple prescription upload and medicine matching",
            image: prescriptionUpload,
            imageAlt: "Prescription upload",
        },

        {
            key: "home-visit",
            label: "Professional Care at Your Doorstep",
            title: (
                <>
                    Vet Home
                    <br />
                    <span>Visit Service</span>
                </>
            ),
            description:
                "Book experienced veterinary professionals for health checkups, vaccinations, grooming and pet care at home.",
            primaryText: "Book a Home Visit",
            primaryAction: () =>
                navigate("/services"),
            secondaryText: "Explore Services",
            secondaryAction: () =>
                navigate("/services"),
            smartText:
                "🏠 Professional pet care without leaving home",
            image: homeService,
            imageAlt: "Pet home veterinary service",
        },

        {
            key: "offers",
            label: "Limited Time Deals",
            title: (
                <>
                    Mega Pet
                    <br />
                    <span>Offers</span>
                </>
            ),
            description:
                "Save more on pet food, medicines, supplements and everyday essentials with exciting special offers.",
            primaryText: "Shop Offers",
            primaryAction: () =>
                navigate("/products"),
            secondaryText: "Browse Products",
            secondaryAction: () =>
                navigate("/products"),
            smartText:
                "🎉 New deals and savings for every pet parent",
            image: offerProduct,
            imageAlt: "Pet product offers",
        },
    ];

    // =====================================================
    // HERO AUTO SLIDER
    // =====================================================

    useEffect(() => {
        const slider = setInterval(() => {
            setCurrentSlide((previous) =>
                previous === heroSlides.length - 1
                    ? 0
                    : previous + 1
            );
        }, 5000);

        return () => clearInterval(slider);
    }, [heroSlides.length]);

    const nextSlide = () => {
        setCurrentSlide((previous) =>
            previous === heroSlides.length - 1
                ? 0
                : previous + 1
        );
    };

    const previousSlide = () => {
        setCurrentSlide((previous) =>
            previous === 0
                ? heroSlides.length - 1
                : previous - 1
        );
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // =====================================================
    // PRODUCT ROW
    // =====================================================

    const ProductRow = ({
        title,
        products: rowProducts,
        viewLink,
    }) => {
        return (
            <section className="home-section product-category-section">

                <div className="section-heading">

                    <h2>{title}</h2>

                    <Link to={viewLink}>
                        View All →
                    </Link>

                </div>

                <div className="category-product-grid">

                    {productsLoading ? (

                        <div className="category-products-loading">

                            <div className="loading-spinner"></div>

                            <p>
                                Loading products...
                            </p>

                        </div>

                    ) : rowProducts.length > 0 ? (

                        rowProducts
                            .slice(0, 5)
                            .map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))

                    ) : (

                        <div className="category-products-empty">

                            <div className="empty-product-icon">
                                🐾
                            </div>

                            <p>
                                No products available
                                in this category.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/products")
                                }
                            >
                                Browse All Products
                            </button>

                        </div>

                    )}

                </div>

            </section>
        );
    };

    // =====================================================
    // ADVERTISEMENT
    // =====================================================

    const AdvertisementBanner = ({
        icon,
        title,
        subtitle,
        buttonText,
        onClick,
    }) => {
        return (
            <section className="home-advertisement">

                <div className="advertisement-left">

                    <div className="advertisement-icon">
                        {icon}
                    </div>

                    <div>

                        <span className="advertisement-label">
                            SPECIAL OFFER
                        </span>

                        <h2>{title}</h2>

                        <p>{subtitle}</p>

                    </div>

                </div>

                <button
                    type="button"
                    className="advertisement-button"
                    onClick={onClick}
                >
                    {buttonText} →
                </button>

            </section>
        );
    };

    // =====================================================
    // AI CHAT
    // =====================================================

    const openAIChat = () => {
        window.location.href = "https://zynvo.ai/";
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <main className="home-body">

            {/* =================================================
                HERO
            ================================================= */}

            <section
                className={`hero-section hero-slider ${heroSlides[currentSlide].key}-slide`}
            >

                <div
                    className="hero-slide"
                    key={heroSlides[currentSlide].key}
                >

                    <div className="hero-content">

                        <span className="hero-label">
                            {heroSlides[currentSlide].label}
                        </span>

                        <h1>
                            {heroSlides[currentSlide].title}
                        </h1>

                        <p>
                            {heroSlides[currentSlide].description}
                        </p>

                        <div className="hero-features">

                            <div className="hero-feature">
                                <span className="feature-icon">
                                    🐾
                                </span>
                                <span>
                                    <b>Personalized</b>
                                    <br />
                                    Pet Care
                                </span>
                            </div>

                            <div className="hero-feature">
                                <span className="feature-icon">
                                    🩺
                                </span>
                                <span>
                                    <b>Expert Vet</b>
                                    <br />
                                    Support
                                </span>
                            </div>

                            <div className="hero-feature">
                                <span className="feature-icon">
                                    ⚡
                                </span>
                                <span>
                                    <b>Fast & Safe</b>
                                    <br />
                                    Service
                                </span>
                            </div>

                            <div className="hero-feature">
                                <span className="feature-icon">
                                    ❤️
                                </span>
                                <span>
                                    <b>Complete</b>
                                    <br />
                                    Pet Wellness
                                </span>
                            </div>

                        </div>

                        <div className="hero-buttons">

                            <button
                                type="button"
                                onClick={
                                    heroSlides[currentSlide]
                                        .primaryAction
                                }
                            >
                                {
                                    heroSlides[currentSlide]
                                        .primaryText
                                }
                            </button>

                            <button
                                type="button"
                                className="hero-outline-btn"
                                onClick={
                                    heroSlides[currentSlide]
                                        .secondaryAction
                                }
                            >
                                {
                                    heroSlides[currentSlide]
                                        .secondaryText
                                }
                            </button>

                        </div>

                        <div className="hero-smart-text">
                            {
                                heroSlides[currentSlide]
                                    .smartText
                            }
                        </div>

                    </div>

                    <div className="hero-visual">

                        <div className="hero-circle"></div>

                        <div className="hero-image-wrapper">

                            <img
                                src={
                                    heroSlides[currentSlide]
                                        .image
                                }
                                alt={
                                    heroSlides[currentSlide]
                                        .imageAlt
                                }
                                className="hero-slide-image"
                            />

                        </div>

                    </div>

                </div>

                <button
                    type="button"
                    className="slider-arrow slider-prev"
                    onClick={previousSlide}
                    aria-label="Previous slide"
                >
                    ❮
                </button>

                <button
                    type="button"
                    className="slider-arrow slider-next"
                    onClick={nextSlide}
                    aria-label="Next slide"
                >
                    ❯
                </button>

                <div className="slider-dots">

                    {heroSlides.map(
                        (slide, index) => (
                            <button
                                key={slide.key}
                                type="button"
                                className={
                                    currentSlide === index
                                        ? "slider-dot active"
                                        : "slider-dot"
                                }
                                onClick={() =>
                                    goToSlide(index)
                                }
                                aria-label={`Go to slide ${
                                    index + 1
                                }`}
                            />
                        )
                    )}

                </div>

            </section>


            {/* =================================================
                PET MODAL
            ================================================= */}

            {showPetModal && (

                <div
                    className="pet-modal-overlay"
                    onClick={() => {
                        if (!savingPet) {
                            setShowPetModal(false);
                        }
                    }}
                >

                    <div
                        className="pet-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

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
                                onClick={() =>
                                    setShowPetModal(false)
                                }
                                disabled={savingPet}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            className="pet-details-form"
                            onSubmit={savePetDetails}
                        >

                            <div className="pet-form-group">

                                <label htmlFor="pet_name">
                                    Pet Name
                                </label>

                                <input
                                    id="pet_name"
                                    type="text"
                                    name="pet_name"
                                    value={
                                        petDetails.pet_name
                                    }
                                    onChange={
                                        handlePetChange
                                    }
                                    placeholder="Enter your pet's name"
                                    required
                                />

                            </div>

                            <div className="pet-form-row">

                                <div className="pet-form-group">

                                    <label htmlFor="pet_type">
                                        Pet Type
                                    </label>

                                    <select
                                        id="pet_type"
                                        name="pet_type"
                                        value={
                                            petDetails.pet_type
                                        }
                                        onChange={
                                            handlePetChange
                                        }
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
                                        value={
                                            petDetails.gender
                                        }
                                        onChange={
                                            handlePetChange
                                        }
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

                            <div className="pet-form-group">

                                <label htmlFor="breed">
                                    Breed
                                </label>

                                <input
                                    id="breed"
                                    type="text"
                                    name="breed"
                                    value={
                                        petDetails.breed
                                    }
                                    onChange={
                                        handlePetChange
                                    }
                                    placeholder="e.g. Labrador, Persian, Indie"
                                />

                            </div>

                            <div className="pet-form-row">

                                <div className="pet-form-group">

                                    <label htmlFor="age">
                                        Age
                                    </label>

                                    <input
                                        id="age"
                                        type="text"
                                        name="age"
                                        value={
                                            petDetails.age
                                        }
                                        onChange={
                                            handlePetChange
                                        }
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
                                        value={
                                            petDetails.weight
                                        }
                                        onChange={
                                            handlePetChange
                                        }
                                        placeholder="e.g. 12 kg"
                                    />

                                </div>

                            </div>

                            <div className="pet-form-group">

                                <label htmlFor="health_notes">
                                    Health / Special Requirements
                                </label>

                                <textarea
                                    id="health_notes"
                                    name="health_notes"
                                    value={
                                        petDetails.health_notes
                                    }
                                    onChange={
                                        handlePetChange
                                    }
                                    placeholder="Enter allergies or special requirements"
                                    rows="3"
                                />

                            </div>

                            <div className="pet-modal-actions">

                                <button
                                    type="button"
                                    className="pet-cancel-btn"
                                    onClick={() =>
                                        setShowPetModal(false)
                                    }
                                    disabled={savingPet}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="pet-save-btn"
                                    disabled={savingPet}
                                >
                                    {savingPet
                                        ? "Saving..."
                                        : "🐾 Save Pet Details"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =================================================
                SHOP BY CATEGORIES
            ================================================= */}

            <section className="home-section">

                <div className="section-heading">

                    <h2>
                        Shop by Categories
                    </h2>

                    <Link to="/products">
                        View All Categories →
                    </Link>

                </div>

                <div className="category-slider">
                    <div className="category-track">

                        {/* Your 7 category cards */}

                        <Link
                            to="/products?product_type=Medicine&product_type=Supplements"
                            className="category-card category-medicine"
                        >
                            <div className="category-image">💊</div>
                            <h3>Medicines &<br />Supplements</h3>
                        </Link>

                        <Link
                            to="/products?product_type=food&product_type=Other"
                            className="category-card category-food"
                        >
                            <div className="category-image">🥣</div>
                            <h3>Pet Food &<br />Products</h3>
                        </Link>

                        <Link
                            to="/products?product_type=FarmSupplies"
                            className="category-card category-farm"
                        >
                            <div className="category-image">🐄</div>
                            <h3>Farm<br />Supplies</h3>
                        </Link>

                        <Link
                            to="/products?product_type=VetEquipment"
                            className="category-card category-vet"
                        >
                            <div className="category-image">🩺</div>
                            <h3>Vet<br />Equipment</h3>
                        </Link>

                        <Link
                            to="/services"
                            className="category-card category-home"
                        >
                            <div className="category-image">🏠</div>
                            <h3>Home Visit<br />Service</h3>
                        </Link>

                        <Link
                            to="/adoption"
                            className="category-card category-adoption"
                        >
                            <div className="category-image">🐾</div>
                            <h3>Adoption<br />Platform</h3>
                        </Link>

                        <Link
                            to="/Fashion"
                            className="category-card category-fashion"
                        >
                            <div className="category-image">👕</div>
                            <h3>Zenve<br />Fashion</h3>
                        </Link>

                        {/* DUPLICATE FOR INFINITE LOOP */}

                        <Link
                            to="/products?product_type=Medicine&product_type=Supplements"
                            className="category-card category-medicine"
                        >
                            <div className="category-image">💊</div>
                            <h3>Medicines &<br />Supplements</h3>
                        </Link>

                        <Link
                            to="/products?product_type=food&product_type=Other"
                            className="category-card category-food"
                        >
                            <div className="category-image">🥣</div>
                            <h3>Pet Food &<br />Products</h3>
                        </Link>

                        <Link
                            to="/products?product_type=FarmSupplies"
                            className="category-card category-farm"
                        >
                            <div className="category-image">🐄</div>
                            <h3>Farm<br />Supplies</h3>
                        </Link>

                        <Link
                            to="/products?product_type=VetEquipment"
                            className="category-card category-vet"
                        >
                            <div className="category-image">🩺</div>
                            <h3>Vet<br />Equipment</h3>
                        </Link>

                        <Link
                            to="/services"
                            className="category-card category-home"
                        >
                            <div className="category-image">🏠</div>
                            <h3>Home Visit<br />Service</h3>
                        </Link>

                        <Link
                            to="/adoption"
                            className="category-card category-adoption"
                        >
                            <div className="category-image">🐾</div>
                            <h3>Adoption<br />Platform</h3>
                        </Link>

                        <Link
                            to="/Fashion"
                            className="category-card category-fashion"
                        >
                            <div className="category-image">👕</div>
                            <h3>Zenve<br />Fashion</h3>
                        </Link>

                    </div>
                </div>

            </section>

            {/* =================================================
                AI CHAT
            ================================================= */}

            <section className="ai-chat-section">

                <div className="ai-chat-content">

                    <div className="ai-chat-badge">
                        ✨ SMART PET CARE
                    </div>

                    <h2>
                        Meet Our Zynvo AI Pet Care Assistant
                    </h2>

                    <p>
                        Have questions about your pet?
                        Our AI assistant helps you understand
                        your pet's needs, discover suitable
                        products and get quick pet-care guidance.
                    </p>

                    <div className="ai-chat-features">

                        <div>
                            <span>🐾</span>
                            <strong>
                                Pet Care Guidance
                            </strong>
                        </div>

                        <div>
                            <span>💊</span>
                            <strong>
                                Product Assistance
                            </strong>
                        </div>

                        <div>
                            <span>🧠</span>
                            <strong>
                                Smart Recommendations
                            </strong>
                        </div>

                    </div>

                    <button
                        type="button"
                        className="ai-chat-button"
                        onClick={openAIChat}
                    >
                        💬 Chat With Our AI
                    </button>

                </div>

                <div className="ai-chat-visual">

                    <div className="ai-chat-circle">
                        🤖
                    </div>

                    <div className="ai-floating-card ai-card-one">
                        🐶
                        <span>
                            Pet Questions
                        </span>
                    </div>

                    <div className="ai-floating-card ai-card-two">
                        💡
                        <span>
                            Smart Advice
                        </span>
                    </div>

                    <div className="ai-floating-card ai-card-three">
                        ❤️
                        <span>
                            Pet Wellness
                        </span>
                    </div>

                </div>

            </section>

            {/*/!* =================================================*/}
            {/*    OFFER*/}
            {/*================================================= *!/*/}

            {/*<section className="offer-banner">*/}

            {/*    <div className="offer-content">*/}

            {/*        <span>*/}
            {/*            Mega Savings*/}
            {/*        </span>*/}

            {/*        <h2>*/}
            {/*            Upto 30% OFF*/}
            {/*        </h2>*/}

            {/*        <p>*/}
            {/*            On Selected Products*/}
            {/*        </p>*/}

            {/*        <button*/}
            {/*            type="button"*/}
            {/*            onClick={() =>*/}
            {/*                navigate("/products")*/}
            {/*            }*/}
            {/*        >*/}
            {/*            Shop Offers →*/}
            {/*        </button>*/}

            {/*    </div>*/}

            {/*    <div className="offer-image">*/}

            {/*        <img*/}
            {/*            src={offerProduct}*/}
            {/*            alt="Special offers"*/}
            {/*        />*/}

            {/*    </div>*/}

            {/*    <div className="countdown-box">*/}

            {/*        <strong>*/}
            {/*            Offer Ends In*/}
            {/*        </strong>*/}

            {/*        <div className="countdown-time">*/}

            {/*            <span>02</span>*/}
            {/*            :*/}
            {/*            <span>18</span>*/}
            {/*            :*/}
            {/*            <span>45</span>*/}
            {/*            :*/}
            {/*            <span>30</span>*/}

            {/*        </div>*/}

            {/*        <div className="countdown-labels">*/}

            {/*            <span>Days</span>*/}
            {/*            <span>Hrs</span>*/}
            {/*            <span>Mins</span>*/}
            {/*            <span>Secs</span>*/}

            {/*        </div>*/}

            {/*    </div>*/}

            {/*</section>*/}


            {/* =================================================
                MEDICINE + SUPPLEMENT
            ================================================= */}

            <ProductRow
                title="Medicine & Supplements"
                products={medicineProducts}
                viewLink="/products?product_type=Medicine&product_type=Supplements"
            />


            <AdvertisementBanner
                icon="💊"
                title="Complete Care for Your Pet"
                subtitle="Trusted medicines and supplements for your pet's everyday health."
                buttonText="Shop Medicines"
                onClick={() =>
                    navigate(
                        "/products?category=Medicine"
                    )
                }
            />


            {/* =================================================
                FOOD + OTHER
            ================================================= */}

            <ProductRow
                title="Food & Other"
                products={foodAndOtherProducts}
                viewLink="/products?product_type=food&product_type=Other"
            />


            <AdvertisementBanner
                icon="🥣"
                title="Healthy Food & Everyday Essentials"
                subtitle="Discover nutritious food, treats and everyday products for your pets."
                buttonText="Shop Products"
                onClick={() =>
                    navigate(
                        "/products?category=Food"
                    )
                }
            />


            {/* =================================================
                VET EQUIPMENT
            ================================================= */}

            <ProductRow
                title="Vet Equipment"
                products={vetEquipmentProducts}
                viewLink="/products?product_type=VetEquipment"
            />


            <AdvertisementBanner
                icon="🩺"
                title="Professional Veterinary Equipment"
                subtitle="Quality equipment and supplies for professional veterinary care."
                buttonText="View Equipment"
                onClick={() =>
                    navigate(
                        "/products?category=VetEquipment"
                    )
                }
            />


            {/* =================================================
                FARM SUPPLIES
            ================================================= */}

            <ProductRow
                title="Farm Supplies"
                products={farmSupplyProducts}
                viewLink="/products?product_type=FarmSupplies"
            />


            <AdvertisementBanner
                icon="🐄"
                title="Farm & Livestock Supplies"
                subtitle="Reliable products for farm, livestock and agricultural care."
                buttonText="Shop Farm Supplies"
                onClick={() =>
                    navigate(
                        "/products?category=FarmSupplies"
                    )
                }
            />




            {/* =================================================
                FEATURED PETS
            ================================================= */}

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
                                src={dogImage}
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

                            <h3>Bruno</h3>

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
                                src={catImage}
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

                            <h3>Luna</h3>

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
                                src={dogImage}
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

                            <h3>Rocky</h3>

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
                                src={catImage}
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

                            <h3>Milo</h3>

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


            {/* =================================================
                TRUSTED BRANDS
            ================================================= */}

            <section className="home-section">

                <div className="section-heading">

                    <h2>
                        Trusted Brands
                    </h2>

                </div>

                <div className="brands-grid">

                    {[
                        "Royal Canin",
                        "Drools",
                        "Pedigree",
                        "Himalaya",
                        "Virbac",
                        "Intas",
                        "Bayer",
                        "N&D",
                    ].map((brand) => (

                        <div
                            className="brand-placeholder"
                            key={brand}
                        >
                            {brand}
                        </div>

                    ))}

                </div>

            </section>


            {/* =================================================
                REVIEWS
            ================================================= */}

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
                            Zenve has everything my pet
                            needs — from medicines to healthy
                            food. Delivery is always on time
                            and products are genuine.
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