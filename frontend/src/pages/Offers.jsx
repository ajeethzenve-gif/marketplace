import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
    FaShoppingCart,
    FaHeart,
    FaRegHeart,
    FaArrowRight,
    FaTag,
    FaPaw
} from "react-icons/fa";

import "../styles/Offers.css";


function Offers() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [wishlist, setWishlist] = useState([]);


    // =====================================================
    // API URL
    // =====================================================

    const API_URL = "http://127.0.0.1:8000/api";


    // =====================================================
    // LOAD OFFER PRODUCTS
    // =====================================================

    useEffect(() => {

        loadOfferProducts();

        loadWishlist();

    }, []);


    // =====================================================
    // LOAD PRODUCTS
    // =====================================================

    const loadOfferProducts = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/products/`
            );

            let data = response.data;

            /*
             * Supports:
             *
             * [
             *   {...},
             *   {...}
             * ]
             *
             * OR
             *
             * {
             *   results: [...]
             * }
             */

            if (Array.isArray(data)) {

                setProducts(
                    data.filter(product => isOfferProduct(product))
                );

            }
            else if (Array.isArray(data.results)) {

                setProducts(
                    data.results.filter(
                        product => isOfferProduct(product)
                    )
                );

            }
            else {

                setProducts([]);

            }

        }
        catch (err) {

            console.error(
                "Offer products error:",
                err.response?.data || err.message
            );

            setError(
                "Unable to load offer products."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // CHECK OFFER PRODUCT
    // =====================================================

    const isOfferProduct = (product) => {

        const discount =
            Number(
                product.discount_percentage ??
                product.discount ??
                product.offer_percentage ??
                0
            );

        const originalPrice =
            Number(
                product.original_price ??
                product.price ??
                0
            );

        const offerPrice =
            Number(
                product.offer_price ??
                product.discounted_price ??
                0
            );


        /*
         * Product is considered an offer product
         * when:
         *
         * discount > 0
         *
         * OR
         *
         * offer price is less than original price
         */

        return (
            discount > 0 ||
            (
                offerPrice > 0 &&
                originalPrice > offerPrice
            )
        );

    };


    // =====================================================
    // LOAD WISHLIST
    // =====================================================

    const loadWishlist = async () => {

        const token =
            localStorage.getItem("access");

        if (!token) {

            setWishlist([]);

            return;

        }


        try {

            const response = await axios.get(
                `${API_URL}/wishlist/`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            const data = response.data;


            if (Array.isArray(data)) {

                setWishlist(
                    data.map(item =>
                        Number(
                            item.product_id ??
                            item.product?.id ??
                            item.product
                        )
                    )
                );

            }
            else if (Array.isArray(data.results)) {

                setWishlist(
                    data.results.map(item =>
                        Number(
                            item.product_id ??
                            item.product?.id ??
                            item.product
                        )
                    )
                );

            }
            else {

                setWishlist([]);

            }

        }
        catch (error) {

            console.log(
                "Wishlist loading error:",
                error.response?.data ||
                error.message
            );

            setWishlist([]);

        }

    };


    // =====================================================
    // GET PRODUCT IMAGE
    // =====================================================

    const getProductImage = (product) => {

        if (!product.image) {

            return null;

        }


        if (
            product.image.startsWith("http")
        ) {

            return product.image;

        }


        return `http://127.0.0.1:8000${product.image}`;

    };


    // =====================================================
    // GET ORIGINAL PRICE
    // =====================================================

    const getOriginalPrice = (product) => {

        return Number(
            product.original_price ??
            product.price ??
            0
        );

    };


    // =====================================================
    // GET DISCOUNT
    // =====================================================

    const getDiscount = (product) => {

        const discount =
            Number(
                product.discount_percentage ??
                product.discount ??
                product.offer_percentage ??
                0
            );


        if (discount > 0) {

            return discount;

        }


        const originalPrice =
            getOriginalPrice(product);


        const offerPrice =
            Number(
                product.offer_price ??
                product.discounted_price ??
                0
            );


        if (
            originalPrice > 0 &&
            offerPrice > 0 &&
            offerPrice < originalPrice
        ) {

            return Math.round(
                (
                    (originalPrice - offerPrice) /
                    originalPrice
                ) * 100
            );

        }


        return 0;

    };


    // =====================================================
    // GET FINAL PRICE
    // =====================================================

    const getOfferPrice = (product) => {

        const originalPrice =
            getOriginalPrice(product);


        const existingOfferPrice =
            Number(
                product.offer_price ??
                product.discounted_price ??
                0
            );


        if (
            existingOfferPrice > 0 &&
            existingOfferPrice < originalPrice
        ) {

            return existingOfferPrice;

        }


        const discount =
            getDiscount(product);


        if (discount > 0) {

            return (
                originalPrice -
                (
                    originalPrice *
                    discount /
                    100
                )
            );

        }


        return originalPrice;

    };


    // =====================================================
    // ADD TO CART
    // =====================================================

    const addToCart = async (product) => {

        const token =
            localStorage.getItem("access");


        if (!token) {

            navigate("/login");

            return;

        }


        try {

            await axios.post(
                `${API_URL}/cart/add/`,
                {
                    product_id: product.id,
                    quantity: 1
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            /*
             * Notify Navbar
             */

            window.dispatchEvent(
                new Event("cartUpdated")
            );


            alert(
                `${product.product_name} added to cart`
            );

        }
        catch (error) {

            console.error(
                "Add cart error:",
                error.response?.data ||
                error.message
            );


            alert(
                error.response?.data?.detail ||
                "Unable to add product to cart."
            );

        }

    };


    // =====================================================
    // ADD / REMOVE WISHLIST
    // =====================================================

    const toggleWishlist = async (product) => {

        const token =
            localStorage.getItem("access");


        if (!token) {

            navigate("/login");

            return;

        }


        const productId =
            Number(product.id);


        const alreadyWishlisted =
            wishlist.includes(productId);


        try {

            if (alreadyWishlisted) {

                await axios.delete(
                    `${API_URL}/wishlist/remove/${productId}/`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


                setWishlist(
                    prev =>
                        prev.filter(
                            id => id !== productId
                        )
                );

            }
            else {

                await axios.post(
                    `${API_URL}/wishlist/add/`,
                    {
                        product_id: productId
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


                setWishlist(
                    prev => [
                        ...prev,
                        productId
                    ]
                );

            }


            /*
             * Notify Navbar
             */

            window.dispatchEvent(
                new Event("wishlistUpdated")
            );

        }
        catch (error) {

            console.error(
                "Wishlist error:",
                error.response?.data ||
                error.message
            );

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="offers-page">

                <div className="offers-loading">

                    <div className="offers-spinner"></div>

                    <p>
                        Loading amazing offers...
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="offers-page">

                <div className="offers-empty">

                    <FaTag />

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={loadOfferProducts}
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="offers-page">


            {/* =================================================
                OFFER HERO
            ================================================= */}

            <section className="offers-hero">

                <div className="offers-hero-content">

                    <div className="offer-tag">

                        <FaTag />

                        SPECIAL OFFERS

                    </div>


                    <h1>

                        Big Savings for
                        <span>
                            Your Best Friend 🐾
                        </span>

                    </h1>


                    <p>

                        Get amazing discounts on
                        medicines, food, supplements
                        and pet care products.

                    </p>


                    <Link
                        to="/products"
                        className="shop-all-btn"
                    >

                        Shop All Products

                        <FaArrowRight />

                    </Link>

                </div>


                <div className="hero-paw">

                    <FaPaw />

                </div>

            </section>



            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <section className="offers-header">

                <div>

                    <h2>
                        Today's Best Offers
                    </h2>

                    <p>
                        Save more on your pet's
                        favourite products
                    </p>

                </div>


                <div className="offer-count">

                    {products.length}
                    {" "}
                    Offers

                </div>

            </section>



            {/* =================================================
                EMPTY
            ================================================= */}

            {products.length === 0 ? (

                <div className="offers-empty">

                    <FaTag />

                    <h2>
                        No Offers Available
                    </h2>

                    <p>
                        There are currently no discounted
                        products. Please check again later.
                    </p>

                    <Link
                        to="/products"
                        className="shop-all-btn"
                    >

                        Browse Products

                        <FaArrowRight />

                    </Link>

                </div>

            ) : (


                /* =================================================
                   PRODUCTS
                ================================================= */

                <section className="offer-products-grid">

                    {products.map(product => {

                        const originalPrice =
                            getOriginalPrice(product);


                        const offerPrice =
                            getOfferPrice(product);


                        const discount =
                            getDiscount(product);


                        const isWishlisted =
                            wishlist.includes(
                                Number(product.id)
                            );


                        return (

                            <div
                                className="offer-product-card"
                                key={product.id}
                            >


                                {/* DISCOUNT */}

                                <div className="discount-badge">

                                    {discount}% OFF

                                </div>


                                {/* WISHLIST */}

                                <button
                                    type="button"
                                    className="offer-wishlist-btn"
                                    onClick={() =>
                                        toggleWishlist(product)
                                    }
                                >

                                    {isWishlisted ? (
                                        <FaHeart />
                                    ) : (
                                        <FaRegHeart />
                                    )}

                                </button>


                                {/* IMAGE */}

                                <Link
                                    to={`/products/${product.id}`}
                                    className="offer-image-container"
                                >

                                    {getProductImage(product) ? (

                                        <img
                                            src={
                                                getProductImage(
                                                    product
                                                )
                                            }
                                            alt={
                                                product.product_name
                                            }
                                        />

                                    ) : (

                                        <div className="no-product-image">

                                            🐾

                                        </div>

                                    )}

                                </Link>


                                {/* PRODUCT INFO */}

                                <div className="offer-product-info">


                                    <span className="offer-label">

                                        <FaTag />

                                        Special Offer

                                    </span>


                                    <Link
                                        to={`/products/${product.id}`}
                                        className="offer-product-name"
                                    >

                                        {product.product_name}

                                    </Link>


                                    {product.brand_name && (

                                        <p className="offer-brand">

                                            {product.brand_name}

                                        </p>

                                    )}


                                    {/* PRICE */}

                                    <div className="offer-price-row">

                                        <span className="offer-price">

                                            ₹
                                            {offerPrice.toFixed(2)}

                                        </span>


                                        <span className="original-price">

                                            ₹
                                            {originalPrice.toFixed(2)}

                                        </span>

                                    </div>


                                    <p className="saved-price">

                                        You save ₹
                                        {(
                                            originalPrice -
                                            offerPrice
                                        ).toFixed(2)}

                                    </p>


                                    {/* ADD CART */}

                                    <button
                                        type="button"
                                        className="offer-cart-btn"
                                        onClick={() =>
                                            addToCart(product)
                                        }
                                    >

                                        <FaShoppingCart />

                                        Add to Cart

                                    </button>


                                </div>

                            </div>

                        );

                    })}

                </section>

            )}

        </div>

    );

}


export default Offers;