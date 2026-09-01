import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/api";
import ProductCard from "../components/ProductCard";

import {
    FaHeart,
    FaRegHeart,
    FaStar,
    FaShoppingCart,
    FaBolt,
    FaMinus,
    FaPlus,
    FaArrowLeft,
    FaBox,
    FaCheckCircle,
    FaTag,
    FaPaw,
} from "react-icons/fa";

import {
    showSuccessAlert,
    showErrorAlert,
    showWarningAlert,
} from "../utils/sweetAlert";

import "../styles/ProductDetails.css";


function ProductDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const token = localStorage.getItem("access");

    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);

    const [quantity, setQuantity] = useState(1);

    const [inWishlist, setInWishlist] = useState(false);

    const [relatedProducts, setRelatedProducts] = useState([]);


    // =============================
    // LOAD PRODUCT
    // =============================

    useEffect(() => {

        const fetchData = async () => {

            await loadProduct();

            if (token) {
                await checkWishlist();
            }

        };

        fetchData();

    }, [id]);


    const loadProduct = async () => {

        try {

            setLoading(true);

            const response = await api.get(
                `products/${id}/`
            );

            setProduct(response.data);

            await loadRelatedProducts(
                response.data.id
            );

        }

        catch (error) {

            console.log(
                "Load Product Error:",
                error.response?.data || error.message
            );

            showErrorAlert(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Failed to load product details."
            );

        }

        finally {

            setLoading(false);

        }

    };


    // =============================
    // RELATED PRODUCTS
    // =============================

    const loadRelatedProducts = async (productId) => {

        try {

            const response = await api.get(
                `products/${productId}/related/`
            );

            setRelatedProducts(response.data);

        }

        catch (error) {

            console.log(
                "Related Products Error:",
                error.response?.data || error.message
            );

        }

    };


    // =============================
    // WISHLIST CHECK
    // =============================

    const checkWishlist = async () => {

        try {

            const response = await axios.get(

                "http://127.0.0.1:8000/api/wishlist/",

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );


            const exists = response.data.some((item) => {

                if (item.product_id) {

                    return item.product_id === Number(id);

                }


                if (item.product) {

                    return (

                        item.product === Number(id)

                        ||

                        item.product.id === Number(id)

                    );

                }

                return false;

            });


            setInWishlist(exists);

        }

        catch (error) {

            console.log(
                "Wishlist Check Error:",
                error.response?.data || error.message
            );

        }

    };


    // =============================
    // TOGGLE WISHLIST
    // =============================

    const toggleWishlist = async () => {

        if (!token) {

            navigate("/login");

            return;

        }


        try {

            const response = await axios.post(

                "http://127.0.0.1:8000/api/wishlist/toggle/",

                {
                    product_id: id
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );


            setInWishlist(
                response.data.in_wishlist
            );


            // =============================
            // WISHLIST SWEET ALERT
            // =============================

            if (response.data.in_wishlist) {

                showSuccessAlert(
                    "Product added to wishlist!"
                );

            }
            else {

                showSuccessAlert(
                    "Product removed from wishlist!"
                );

            }

        }

        catch (error) {

            console.log(
                "Toggle Wishlist Error:",
                error.response?.data || error.message
            );


            showErrorAlert(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Failed to update wishlist."
            );

        }

    };


    // =============================
    // QUANTITY
    // =============================

    const increaseQuantity = () => {

        if (!product) return;

        if (product.stock <= 0) {

            showWarningAlert(
                "Product is out of stock!"
            );

            return;

        }


        if (quantity >= product.stock) {

            showWarningAlert(
                `Only ${product.stock} item${
                    product.stock > 1 ? "s" : ""
                } available.`
            );

            return;

        }


        setQuantity((prev) =>
            prev < product.stock
                ? prev + 1
                : prev
        );

    };


    const decreaseQuantity = () => {

        setQuantity((prev) =>
            prev > 1
                ? prev - 1
                : prev
        );

    };


    // =============================
    // TOTAL PRICE
    // =============================

    const totalPrice = product
        ? Number(product.price) * quantity
        : 0;


    // =============================
    // ADD TO CART
    // =============================

    const addToCart = async () => {

        if (!token) {

            navigate("/login");

            return;

        }


        if (!product) {

            showErrorAlert(
                "Product information is not available."
            );

            return;

        }


        if (product.stock <= 0) {

            showWarningAlert(
                "Product is out of stock!"
            );

            return;

        }


        try {

            await axios.post(

                "http://127.0.0.1:8000/api/cart/add/",

                {
                    product_id: product.id,
                    quantity: quantity
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );


            // =============================
            // SUCCESS SWEET ALERT
            // =============================

            showSuccessAlert(
                "Product added to cart!"
            );

        }

        catch (error) {

            console.log(
                "Add To Cart Error:",
                error.response?.data || error.message
            );


            // =============================
            // ERROR SWEET ALERT
            // =============================

            showErrorAlert(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Failed to add product."
            );

        }

    };


    // =============================
    // BUY NOW
    // =============================

    const buyNow = () => {

        if (!token) {

            navigate("/login");

            return;

        }


        if (!product) {

            showErrorAlert(
                "Product information is not available."
            );

            return;

        }


        if (product.stock <= 0) {

            showWarningAlert(
                "Product is out of stock!"
            );

            return;

        }


        navigate("/payment", {

            state: {

                checkoutType: "buy_now",

                product: {

                    id: product.id,

                    name: product.product_name,

                    image:

                        product.product_image

                            ?

                            (

                                product.product_image.startsWith("http")

                                    ?

                                    product.product_image

                                    :

                                    `http://127.0.0.1:8000${product.product_image}`

                            )

                            :

                            "https://via.placeholder.com/500",

                    quantity: quantity,

                    price: Number(product.price),

                },

                subtotal:
                    Number(product.price) * quantity,

                shipping: 0,

                total:
                    Number(product.price) * quantity,

                totalItems: quantity,

            },

        });

    };


    // =============================
    // LOADING
    // =============================

    if (loading) {

        return (

            <div className="product-loading">

                <div className="loading-spinner"></div>

                <p>
                    Loading product details...
                </p>

            </div>

        );

    }


    // =============================
    // PRODUCT NOT FOUND
    // =============================

    if (!product) {

        return (

            <div className="product-not-found">

                <FaBox />

                <h3>
                    Product not found
                </h3>

                <Link
                    to="/products"
                    className="back-products-btn"
                >

                    <FaArrowLeft />

                    Back to Products

                </Link>

            </div>

        );

    }


    const productImage = product.product_image

        ?

        (

            product.product_image.startsWith("http")

                ?

                product.product_image

                :

                `http://127.0.0.1:8000${product.product_image}`

        )

        :

        "https://via.placeholder.com/600x600";


    // =============================
    // PAGE
    // =============================

    return (

        <div className="product-details-page">


            {/* =============================
                BREADCRUMB
            ============================= */}

            <div className="product-breadcrumb">

                <div className="product-details-container">

                    <Link to="/">
                        Home
                    </Link>

                    <span>/</span>

                    <Link to="/products">
                        Products
                    </Link>

                    <span>/</span>

                    <strong>
                        {product.product_name}
                    </strong>

                </div>

            </div>


            {/* =============================
                PRODUCT SECTION
            ============================= */}

            <main className="product-details-container">

                <div className="product-details-grid">


                    {/* =============================
                        PRODUCT IMAGE
                    ============================= */}

                    <section className="product-gallery">

                        <div className="product-image-wrapper">

                            <div className="product-image-top">

                                <span className="product-category-badge">

                                    <FaTag />

                                    {product.category_name}

                                </span>


                                <button
                                    className={
                                        `wishlist-circle ${
                                            inWishlist
                                                ? "active"
                                                : ""
                                        }`
                                    }
                                    onClick={toggleWishlist}
                                    aria-label="Toggle wishlist"
                                >

                                    {

                                        inWishlist

                                            ?

                                            <FaHeart />

                                            :

                                            <FaRegHeart />

                                    }

                                </button>

                            </div>


                            <img
                                src={productImage}
                                alt={product.product_name}
                                className="main-product-image"
                            />


                            <div className="image-bottom-info">

                                <span>

                                    <FaPaw />

                                    {product.pet_type || "All Pets"}

                                </span>

                            </div>

                        </div>

                    </section>


                    {/* =============================
                        PRODUCT INFORMATION
                    ============================= */}

                    <section className="product-details-content">


                        {/* BRAND */}

                        <p className="product-brand">

                            {product.brand_name || "Zenve"}

                        </p>


                        {/* TITLE */}

                        <h1 className="product-title">

                            {product.product_name}

                        </h1>


                        {/* RATING */}

                        <div className="product-rating-row">

                            <div className="product-stars">

                                {

                                    [1, 2, 3, 4, 5].map(
                                        (star) => (

                                            <FaStar
                                                key={star}
                                                className={
                                                    star <=
                                                    Math.round(
                                                        product.average_rating || 0
                                                    )

                                                        ?

                                                        "star-filled"

                                                        :

                                                        "star-empty"
                                                }
                                            />

                                        )
                                    )

                                }

                            </div>


                            <span className="rating-value">

                                {product.average_rating || 0}/5

                            </span>


                            <Link
                                to={`/products/${id}/reviews`}
                                className="review-link"
                            >

                                See Reviews

                            </Link>

                        </div>


                        {/* PRICE */}

                        <div className="product-price-section">

                            <span className="price-label">

                                Price

                            </span>

                            <h2>

                                ₹ {Number(product.price).toFixed(2)}

                            </h2>

                        </div>


                        {/* STOCK */}

                        <div
                            className={
                                `stock-status ${
                                    product.stock > 0
                                        ? "in-stock"
                                        : "out-stock"
                                }`
                            }
                        >

                            {

                                product.stock > 0

                                    ?

                                    <>

                                        <FaCheckCircle />

                                        In Stock

                                        <span>

                                            Only {product.stock}
                                            {" "}available

                                        </span>

                                    </>

                                    :

                                    "Out of Stock"

                            }

                        </div>


                        {/* DESCRIPTION */}

                        <div className="product-description-section">

                            <h3>

                                About this product

                            </h3>

                            <p>

                                {product.description ||
                                    "No product description available."}

                            </p>

                        </div>


                        {/* PRODUCT INFORMATION */}

                        <div className="product-meta-grid">


                            <div className="product-meta-item">

                                <span>
                                    Category
                                </span>

                                <strong>
                                    {product.category_name || "-"}
                                </strong>

                            </div>


                            <div className="product-meta-item">

                                <span>
                                    Brand
                                </span>

                                <strong>
                                    {product.brand_name || "-"}
                                </strong>

                            </div>


                            <div className="product-meta-item">

                                <span>
                                    Pet Type
                                </span>

                                <strong>
                                    {product.pet_type || "All"}
                                </strong>

                            </div>


                            <div className="product-meta-item">

                                <span>
                                    Weight
                                </span>

                                <strong>
                                    {product.weight || "-"}
                                </strong>

                            </div>

                        </div>


                        {/* QUANTITY */}

                        <div className="purchase-section">


                            <div className="quantity-section">

                                <span className="quantity-label">

                                    Quantity

                                </span>


                                <div className="quantity-control">

                                    <button
                                        onClick={decreaseQuantity}
                                        disabled={quantity === 1}
                                        aria-label="Decrease quantity"
                                    >

                                        <FaMinus />

                                    </button>


                                    <span>

                                        {quantity}

                                    </span>


                                    <button
                                        onClick={increaseQuantity}
                                        disabled={
                                            quantity >= product.stock
                                        }
                                        aria-label="Increase quantity"
                                    >

                                        <FaPlus />

                                    </button>

                                </div>

                            </div>


                            <div className="total-price-box">

                                <span>
                                    Total
                                </span>

                                <strong>

                                    ₹ {totalPrice.toFixed(2)}

                                </strong>

                            </div>

                        </div>


                        {/* ACTION BUTTONS */}

                        <div className="product-action-buttons">


                            <button
                                className="add-cart-btn"
                                onClick={addToCart}
                                disabled={product.stock === 0}
                            >

                                <FaShoppingCart />

                                Add to Cart

                            </button>


                            <button
                                className="buy-now-btn"
                                onClick={buyNow}
                                disabled={product.stock === 0}
                            >

                                <FaBolt />

                                Buy Now

                            </button>

                        </div>


                        {/* EXTRA LINKS */}

                        <div className="product-extra-actions">

                            <Link
                                to={`/products/${id}/reviews`}
                            >

                                <FaStar />

                                Customer Reviews

                            </Link>


                            <Link
                                to="/products"
                            >

                                <FaArrowLeft />

                                Continue Shopping

                            </Link>

                        </div>


                    </section>

                </div>


                {/* =============================
                    RELATED PRODUCTS
                ============================= */}

                <section className="related-products-section">

                    <div className="related-products-header">

                        <div>

                            <span>
                                YOU MAY ALSO LIKE
                            </span>

                            <h2>
                                Related Products
                            </h2>

                        </div>


                        <Link
                            to="/products"
                            className="view-all-products"
                        >

                            View All Products

                        </Link>

                    </div>


                    {

                        relatedProducts.length > 0

                            ?

                            <div className="related-products-grid">

                                {

                                    relatedProducts.map((item) => (

                                        <ProductCard
                                            key={item.id}
                                            product={item}
                                        />

                                    ))

                                }

                            </div>

                            :

                            <div className="no-related-products">

                                <FaBox />

                                <p>
                                    No related products found.
                                </p>

                            </div>

                    }

                </section>

            </main>

        </div>

    );

}


export default ProductDetails;