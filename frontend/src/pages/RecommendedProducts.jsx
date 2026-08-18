import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "../styles/RecommendedProducts.css";

function RecommendedProducts() {

    const { petId } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem("access");

    const [pet, setPet] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const PET_API =
        `http://127.0.0.1:8000/api/accounts/pets/${petId}/`;

    const RECOMMENDED_API =
        `http://127.0.0.1:8000/api/pet/${petId}/recommended/`;


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        if (!token) {
            navigate("/login");
            return;
        }

        loadRecommendedProducts();

    }, [petId, token]);


    // =====================================================
    // LOAD PET + RECOMMENDED PRODUCTS
    // =====================================================

    const loadRecommendedProducts = async () => {

        try {

            setLoading(true);
            setError("");

            const headers = {
                Authorization: `Bearer ${token}`
            };


            // =================================================
            // LOAD PARTICULAR PET
            // =================================================

            const petResponse = await axios.get(
                PET_API,
                { headers }
            );

            setPet(petResponse.data);


            // =================================================
            // LOAD RECOMMENDED PRODUCTS
            // =================================================

            const productResponse = await axios.get(
                RECOMMENDED_API,
                { headers }
            );

            console.log(
                "RECOMMENDED API RESPONSE:",
                productResponse.data
            );


            // =================================================
            // GET GROUPED CATEGORIES
            // =================================================

            const categoryData =
                productResponse.data?.categories || [];

            setCategories(categoryData);

        } catch (error) {

            console.error(
                "Recommended products error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.detail ||
                error.response?.data?.error ||
                "Unable to load recommended products."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // PRODUCT TYPE ICON
    // =====================================================

    const getProductTypeIcon = (type) => {

        const value = String(type).toLowerCase();


        if (value.includes("medicine")) {
            return "💊";
        }


        if (
            value.includes("supplement") ||
            value.includes("vitamin")
        ) {
            return "🧴";
        }


        if (
            value.includes("food") ||
            value.includes("treat")
        ) {
            return "🍖";
        }


        if (
            value.includes("grooming") ||
            value.includes("hygiene")
        ) {
            return "🧼";
        }


        if (value.includes("dental")) {
            return "🦷";
        }


        if (value.includes("skin")) {
            return "🧴";
        }


        if (value.includes("joint")) {
            return "🦴";
        }


        if (
            value.includes("flea") ||
            value.includes("tick")
        ) {
            return "🐜";
        }


        if (value.includes("deworm")) {
            return "💊";
        }


        if (value.includes("toy")) {
            return "🎾";
        }


        if (value.includes("accessor")) {
            return "🎒";
        }


        if (value.includes("feeding")) {
            return "🥣";
        }


        if (value.includes("bed")) {
            return "🛏️";
        }


        return "🐾";
    };


    // =====================================================
    // FORMAT PRODUCT TYPE
    // =====================================================

    const formatProductType = (type) => {

        if (!type) {
            return "Other Products";
        }

        return String(type)
            .replace(/_/g, " ")
            .replace(/-/g, " ")
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };


    // =====================================================
    // TOTAL PRODUCTS
    // =====================================================

    const totalProducts = categories.reduce(
        (total, category) =>
            total + category.products.length,
        0
    );


    // =====================================================
    // NOT LOGGED IN
    // =====================================================

    if (!token) {
        return null;
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <main className="recommended-products-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="recommended-header">

                <button
                    type="button"
                    className="back-btn"
                    onClick={() => navigate("/pets")}
                    title="Back to My Pets"
                    aria-label="Back to My Pets"
                >
                    ←
                </button>


                <div className="recommended-title">

                    <h1>
                        Recommended Products
                    </h1>


                    {pet && (

                        <p>
                            Products recommended for{" "}

                            <strong>
                                {pet.pet_name}
                            </strong>

                        </p>

                    )}

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="recommended-error">
                    {error}
                </div>

            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <div className="recommended-loading">

                    <div className="recommended-spinner"></div>

                    <p>
                        Finding products for{" "}
                        {pet?.pet_name || "your pet"}...
                    </p>

                </div>


            ) : categories.length === 0 ? (

                /* =================================================
                    NO PRODUCTS
                ================================================= */

                <div className="no-recommended-products">

                    <div className="no-products-icon">
                        🐾
                    </div>


                    <h2>
                        No Recommended Products
                    </h2>


                    <p>
                        We couldn't find any products recommended
                        for {pet?.pet_name || "this pet"} yet.
                    </p>


                    <button
                        type="button"
                        onClick={() => navigate("/Home")}
                    >
                        Browse All Products
                    </button>

                </div>


            ) : (

                /* =================================================
                    PRODUCTS
                ================================================= */

                <>

                    {/* =============================================
                        PET INFORMATION
                    ============================================= */}

                    <div className="recommended-info">

                        <div className="recommended-pet-details">

                            <span className="recommended-pet-icon">
                                🐾
                            </span>


                            <div>

                                <strong>
                                    {pet?.pet_name}
                                </strong>


                                <span>

                                    {pet?.pet_type}

                                    {pet?.breed
                                        ? ` • ${pet.breed}`
                                        : ""}

                                </span>

                            </div>

                        </div>


                        <span className="product-count">

                            {totalProducts}

                            {" "}

                            {totalProducts === 1
                                ? "Product"
                                : "Products"}

                        </span>

                    </div>


                    {/* =============================================
                        PRODUCT TYPE SECTIONS
                    ============================================= */}

                    <div className="recommended-product-sections">

                        {categories.map(
                            (category) => (

                                <section
                                    className="recommended-product-section"
                                    key={category.product_type}
                                >


                                    {/* =================================
                                        PRODUCT TYPE HEADER
                                    ================================= */}

                                    <div className="product-type-header">

                                        <div className="product-type-title">

                                            <span className="product-type-icon">

                                                {getProductTypeIcon(
                                                    category.product_type
                                                )}

                                            </span>


                                            <h2>

                                                {formatProductType(
                                                    category.product_type
                                                )}

                                            </h2>

                                        </div>


                                        <span className="product-type-count">

                                            {category.products.length}

                                            {" "}

                                            {category.products.length === 1
                                                ? "Product"
                                                : "Products"}

                                        </span>

                                    </div>


                                    {/* =================================
                                        PRODUCTS GRID
                                    ================================= */}

                                    <div className="recommended-products-grid">

                                        {category.products.map(
                                            (product) => (

                                                <ProductCard
                                                    key={product.id}
                                                    product={product}
                                                />

                                            )
                                        )}

                                    </div>


                                </section>

                            )
                        )}

                    </div>

                </>

            )}

        </main>
    );
}

export default RecommendedProducts;