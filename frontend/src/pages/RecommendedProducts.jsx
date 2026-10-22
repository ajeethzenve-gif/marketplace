import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FaPaw,
    FaHeartbeat,
    FaShieldAlt,
    FaArrowLeft,
    FaMagic,
    FaFilter,
    FaInfoCircle,
} from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import "../styles/RecommendedProducts.css";

function RecommendedProducts() {
    const { petId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("access");

    const [pet, setPet] = useState(null);
    const [summary, setSummary] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'high_match' | 'health' | 'food' | 'care'

    const PET_API = `http://127.0.0.1:8000/api/accounts/pets/${petId}/`;
    const RECOMMENDED_API = `http://127.0.0.1:8000/api/pet/${petId}/recommended/`;

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        loadRecommendedProducts();
    }, [petId, token]);

    const loadRecommendedProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const petResponse = await axios.get(PET_API, { headers });
            setPet(petResponse.data);

            const productResponse = await axios.get(RECOMMENDED_API, { headers });
            const data = productResponse.data;

            setSummary(data.summary || null);
            const filtered = (data.categories || []).filter(
                (cat) => !cat.product_type.toLowerCase().includes("medicine")
            );
            setCategories(filtered);
        } catch (err) {
            console.error("Recommended products error:", err.response?.data || err.message);
            setError(
                err.response?.data?.detail ||
                err.response?.data?.error ||
                "Unable to load explainable recommendations."
            );
        } finally {
            setLoading(false);
        }
    };

    // Callback when user marks recommendation as not relevant
    const handleFeedbackSubmitted = (productId, isHelpful) => {
        if (!isHelpful) {
            // Remove product from state for immediate responsive feedback
            setCategories((prev) =>
                prev
                    .map((cat) => ({
                        ...cat,
                        products: cat.products.filter((p) => p.id !== productId),
                    }))
                    .filter((cat) => cat.products.length > 0)
            );
        }
    };

    const getProductTypeIcon = (type) => {
        const value = String(type).toLowerCase();
        if (value.includes("medicine")) return "💊";
        if (value.includes("supplement") || value.includes("vitamin")) return "🧴";
        if (value.includes("food") || value.includes("treat")) return "🍖";
        if (value.includes("grooming") || value.includes("hygiene")) return "🧼";
        if (value.includes("dental")) return "🦷";
        if (value.includes("skin")) return "🧴";
        if (value.includes("joint")) return "🦴";
        if (value.includes("flea") || value.includes("tick")) return "🐜";
        if (value.includes("deworm")) return "💊";
        if (value.includes("toy")) return "🎾";
        if (value.includes("accessor")) return "🎒";
        if (value.includes("feeding")) return "🥣";
        if (value.includes("bed")) return "🛏️";
        return "🐾";
    };

    const formatProductType = (type) => {
        if (!type) return "Care Products";
        return String(type)
            .replace(/_/g, " ")
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    };

    // Filter categories based on active filter tab
    const filteredCategories = useMemo(() => {
        if (activeFilter === "all") return categories;

        return categories
            .map((cat) => {
                let filteredProducts = cat.products;

                if (activeFilter === "high_match") {
                    filteredProducts = cat.products.filter(
                        (p) => (p.recommendation?.match_score || 0) >= 90
                    );
                } else if (activeFilter === "health") {
                    const healthTypes = ["supplement", "joint", "skin", "flea", "dental"];
                    const matchesCategory = healthTypes.some((h) => cat.product_type.toLowerCase().includes(h));
                    if (!matchesCategory) return null;
                } else if (activeFilter === "food") {
                    const foodTypes = ["food", "treat", "feeding"];
                    const matchesCategory = foodTypes.some((f) => cat.product_type.toLowerCase().includes(f));
                    if (!matchesCategory) return null;
                } else if (activeFilter === "care") {
                    const careTypes = ["grooming", "hygiene", "accessories", "leashes", "beds", "toys"];
                    const matchesCategory = careTypes.some((c) => cat.product_type.toLowerCase().includes(c));
                    if (!matchesCategory) return null;
                }

                return {
                    ...cat,
                    products: filteredProducts,
                };
            })
            .filter((cat) => cat && cat.products.length > 0);
    }, [categories, activeFilter]);

    const totalProducts = filteredCategories.reduce(
        (total, category) => total + category.products.length,
        0
    );

    if (!token) return null;

    return (
        <main className="recommended-products-page">
            {/* Header */}
            <div className="recommended-header">
                <button
                    type="button"
                    className="back-btn"
                    onClick={() => navigate("/pets")}
                    title="Back to My Pets"
                    aria-label="Back to My Pets"
                >
                    <FaArrowLeft />
                </button>

                <div className="recommended-title">
                    <div className="xai-title-row">
                        <h1>Explainable AI Recommendations</h1>
                        <span className="xai-certified-badge">
                            <FaShieldAlt /> 100% Transparent
                        </span>
                    </div>
                    {pet && (
                        <p>
                            Algorithmic care plan tailored specifically for <strong>{pet.pet_name}</strong>
                        </p>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && <div className="recommended-error">{error}</div>}

            {/* Loading */}
            {loading ? (
                <div className="recommended-loading">
                    <div className="recommended-spinner"></div>
                    <p>
                        Analyzing clinical profile & calculating match compatibility for{" "}
                        {pet?.pet_name || "your pet"}...
                    </p>
                </div>
            ) : categories.length === 0 ? (
                /* No Products */
                <div className="no-recommended-products">
                    <div className="no-products-icon">🐾</div>
                    <h2>No Tailored Recommendations Yet</h2>
                    <p>
                        We could not find matching products for {pet?.pet_name || "this pet"} at the moment.
                    </p>
                    <button type="button" onClick={() => navigate("/Home")}>
                        Browse All Products
                    </button>
                </div>
            ) : (
                <>
                    {/* Pet Profile & Telemetry Bar */}
                    <div className="recommended-pet-hero">
                        <div className="pet-hero-main">
                            <div className="pet-hero-avatar">
                                <FaPaw />
                            </div>
                            <div className="pet-hero-info">
                                <div className="pet-hero-name-row">
                                    <h2>{pet?.pet_name}</h2>
                                    <span className="pet-hero-species">{pet?.pet_type}</span>
                                    {pet?.breed && <span className="pet-hero-breed">{pet.breed}</span>}
                                </div>
                                <div className="pet-hero-tags">
                                    <span className="pet-hero-tag">Age: {pet?.age || "Adult"}</span>
                                    <span className="pet-hero-tag">Weight: {pet?.weight || "Medium"}</span>
                                    {pet?.health_notes &&
                                        pet.health_notes.toLowerCase() !== "nothing" && (
                                            <span className="pet-hero-health-alert">
                                                <FaHeartbeat /> Health Focus: <em>"{pet.health_notes}"</em>
                                            </span>
                                        )}
                                </div>
                            </div>
                        </div>

                        {/* Telemetry Metric Cards */}
                        <div className="pet-telemetry-cards">
                            <div className="telemetry-card">
                                <span className="telemetry-label">Avg Compatibility</span>
                                <span className="telemetry-value">
                                    {summary?.average_compatibility || 91}%
                                </span>
                            </div>
                            <div className="telemetry-card">
                                <span className="telemetry-label">Curated Items</span>
                                <span className="telemetry-value">{totalProducts}</span>
                            </div>
                            <div className="telemetry-card highlight">
                                <span className="telemetry-label">Engine Standard</span>
                                <span className="telemetry-value">Explainable AI</span>
                            </div>
                        </div>
                    </div>

                    {/* Filter Navigation Tabs */}
                    <div className="xai-filter-nav">
                        <button
                            type="button"
                            className={`xai-filter-pill ${activeFilter === "all" ? "active" : ""}`}
                            onClick={() => setActiveFilter("all")}
                        >
                            All Recommendations ({categories.reduce((acc, c) => acc + c.products.length, 0)})
                        </button>

                        <button
                            type="button"
                            className={`xai-filter-pill ${activeFilter === "high_match" ? "active" : ""}`}
                            onClick={() => setActiveFilter("high_match")}
                        >
                            ⭐ Optimal Fit (90%+ Match)
                        </button>

                        <button
                            type="button"
                            className={`xai-filter-pill ${activeFilter === "health" ? "active" : ""}`}
                            onClick={() => setActiveFilter("health")}
                        >
                            🩹 Health & Supplements
                        </button>

                        <button
                            type="button"
                            className={`xai-filter-pill ${activeFilter === "food" ? "active" : ""}`}
                            onClick={() => setActiveFilter("food")}
                        >
                            🍖 Diet & Nutrition
                        </button>

                        <button
                            type="button"
                            className={`xai-filter-pill ${activeFilter === "care" ? "active" : ""}`}
                            onClick={() => setActiveFilter("care")}
                        >
                            🧼 Grooming & Gear
                        </button>
                    </div>

                    {/* Notice bar on Explainability */}
                    <div className="xai-transparency-banner">
                        <FaInfoCircle className="banner-icon" />
                        <p>
                            <strong>Transparent Recommendations:</strong> Every product below is scored based on{" "}
                            {pet?.pet_name}'s species, life-stage, weight, breed needs, and health profile. Click{" "}
                            <strong>"Why?"</strong> on any item to view the exact multi-factor algorithmic breakdown.
                        </p>
                    </div>

                    {/* Product Type Sections */}
                    <div className="recommended-product-sections">
                        {filteredCategories.map((category) => (
                            <section
                                className="recommended-product-section"
                                key={category.product_type}
                            >
                                <div className="product-type-header">
                                    <div className="product-type-title">
                                        <span className="product-type-icon">
                                            {getProductTypeIcon(category.product_type)}
                                        </span>
                                        <h2>{formatProductType(category.product_type)}</h2>
                                    </div>

                                    <span className="product-type-count">
                                        {category.products.length}{" "}
                                        {category.products.length === 1 ? "Product" : "Products"}
                                    </span>
                                </div>

                                <div className="recommended-products-grid">
                                    {category.products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            pet={pet}
                                            onFeedbackSubmitted={handleFeedbackSubmitted}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </>
            )}
        </main>
    );
}

export default RecommendedProducts;