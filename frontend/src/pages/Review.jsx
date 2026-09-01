import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaStar,
    FaRegStar,
    FaTrash,
    FaUserCircle,
    FaArrowLeft,
    FaBoxOpen,
} from "react-icons/fa";

import api from "../api/api";

import "../styles/Review.css";

import {
    showSuccessAlert,
    showErrorAlert,
    showWarningAlert,
    showConfirmAlert,
    showLoadingAlert,
    closeAlert,
} from "../utils/sweetAlert";


function Review() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [productLoading, setProductLoading] = useState(true);

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");

    const [loading, setLoading] = useState(false);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [hoverRating, setHoverRating] = useState(0);

    const token = localStorage.getItem("access");
    const username = localStorage.getItem("username");

    /* =====================================================
       LOAD PRODUCT + REVIEWS
    ===================================================== */

    useEffect(() => {
        loadProduct();
        loadReviews();

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [id]);

    /* =====================================================
       LOAD PRODUCT
    ===================================================== */

    const loadProduct = async () => {
        try {
            setProductLoading(true);

            const response = await api.get(
                `products/${id}/`
            );

            setProduct(response.data);
        } catch (error) {
            console.error(
                "Product loading error:",
                error.response?.data || error.message
            );

            setProduct(null);
        } finally {
            setProductLoading(false);
        }
    };

    /* =====================================================
       LOAD REVIEWS
    ===================================================== */

    const loadReviews = async () => {
        try {
            setReviewsLoading(true);

            const response = await api.get(
                `reviews/${id}/`
            );

            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.results || [];

            setReviews(data);
        } catch (error) {
            console.error(
                "Review loading error:",
                error.response?.data || error.message
            );

            setReviews([]);
        } finally {
            setReviewsLoading(false);
        }
    };

    /* =====================================================
       SUBMIT REVIEW
    ===================================================== */

    const submitReview = async (e) => {
        e.preventDefault();

        if (!token) {
            alert(
                "Please login first to write a review."
            );

            navigate("/login");
            return;
        }

        if (!review.trim()) {
                showErrorAlert("Please write a review.");
            return;
        }

        try {
            setLoading(true);

            await api.post(
                "reviews/add/",
                {
                    product_id: id,
                    rating: rating,
                    review: review.trim(),
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            showSuccessAlert(
                "Thank you! Your review was added successfully."
            );

            setReview("");
            setRating(5);

            loadReviews();
        } catch (error) {
            console.error(
                "Add review error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.detail ||
                "Failed to submit your review."
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       DELETE REVIEW
    ===================================================== */

   const deleteReview = async (reviewId) => {
    // SweetAlert confirmation
        const confirmed = await showConfirmAlert({
            title: "Delete Review?",
            text: "Are you sure you want to delete this review?",
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel",
        });

        // User clicked Cancel
        if (!confirmed) {
            return;
        }

        try {
            await api.delete(
                `reviews/delete/${reviewId}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Remove review from UI
            setReviews((previousReviews) =>
                previousReviews.filter(
                    (item) => item.id !== reviewId
                )
            );

            // Success SweetAlert
            showSuccessAlert("Review deleted successfully!");

        } catch (error) {
            console.error(
                "Delete review error:",
                error.response?.data || error.message
            );

            // Error SweetAlert
            showErrorAlert(
                error.response?.data?.detail ||
                "Failed to delete review."
            );
        }
    };

    /* =====================================================
       CALCULATE RATING
    ===================================================== */

    const totalReviews = reviews.length;

    const averageRating =
        totalReviews > 0
            ? reviews.reduce(
                  (total, item) =>
                      total +
                      Number(item.rating || 0),
                  0
              ) / totalReviews
            : 0;

    const ratingPercentage = (star) => {
        if (totalReviews === 0) {
            return 0;
        }

        const count = reviews.filter(
            (item) =>
                Number(item.rating) === star
        ).length;

        return Math.round(
            (count / totalReviews) * 100
        );
    };

    /* =====================================================
       RENDER STARS
    ===================================================== */

    const renderStars = (value) => {
        return [1, 2, 3, 4, 5].map(
            (star) => (
                <span
                    className="display-star"
                    key={star}
                >
                    {star <=
                    Math.round(Number(value)) ? (
                        <FaStar />
                    ) : (
                        <FaRegStar />
                    )}
                </span>
            )
        );
    };

    /* =====================================================
       PRODUCT IMAGE
    ===================================================== */

    const getProductImage = () => {
        if (!product?.image) {
            return null;
        }

        if (
            product.image.startsWith("http")
        ) {
            return product.image;
        }

        return product.image;
    };

    /* =====================================================
       LOADING PRODUCT
    ===================================================== */

    if (productLoading) {
        return (
            <main className="review-page">

                <div className="review-product-loading">

                    <div className="review-spinner" />

                    <p>
                        Loading product details...
                    </p>

                </div>

            </main>
        );
    }

    /* =====================================================
       PRODUCT NOT FOUND
    ===================================================== */

    if (!product) {
        return (
            <main className="review-page">

                <div className="review-product-not-found">

                    <FaBoxOpen />

                    <h2>
                        Product Not Found
                    </h2>

                    <p>
                        The product you are looking for
                        does not exist.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/products")
                        }
                    >
                        Browse Products
                    </button>

                </div>

            </main>
        );
    }

    return (
        <main className="review-page">

            {/* =================================================
                PRODUCT DETAILS
            ================================================= */}

            <section className="review-product-section">

                <div className="review-product-container">

                    {/* BACK BUTTON */}

                    <button
                        type="button"
                        className="back-product-btn"
                        onClick={() =>
                            navigate(`/products/${id}`)
                        }
                    >
                        <FaArrowLeft />

                        Back to Product

                    </button>

                    <div className="review-product-card">

                        {/* PRODUCT IMAGE */}

                        <div className="review-product-image">

                            {getProductImage() ? (

                                <img
                                    src={
                                        getProductImage()
                                    }
                                    alt={
                                        product.product_name
                                    }
                                />

                            ) : (

                                <div className="review-no-image">

                                    <FaBoxOpen />

                                </div>

                            )}

                        </div>

                        {/* PRODUCT INFO */}

                        <div className="review-product-info">

                            {product.category && (

                                <span className="review-product-category">

                                    {typeof product.category ===
                                    "object"
                                        ? product.category.name
                                        : product.category}

                                </span>

                            )}

                            <h1>

                                {product.product_name}

                            </h1>

                            {/* BRAND */}

                            {product.brand && (

                                <p className="review-product-brand">

                                    Brand:

                                    <strong>

                                        {" "}

                                        {typeof product.brand ===
                                        "object"
                                            ? product.brand.name
                                            : product.brand}

                                    </strong>

                                </p>

                            )}

                            {/* PRICE */}

                            {product.price && (

                                <div className="review-product-price">

                                    ₹{product.price}

                                </div>

                            )}

                            {/* RATING */}

                            <div className="review-product-rating">

                                <div>

                                    {renderStars(
                                        averageRating
                                    )}

                                </div>

                                <strong>

                                    {totalReviews > 0
                                        ? averageRating.toFixed(
                                            1
                                        )
                                        : "No Rating"}

                                </strong>

                                <span>

                                    (
                                    {totalReviews}{" "}

                                    {totalReviews === 1
                                        ? "Review"
                                        : "Reviews"}

                                    )

                                </span>

                            </div>

                            {/* PRODUCT DESCRIPTION */}

                            {product.description && (

                                <p className="review-product-description">

                                    {
                                        product.description
                                    }

                                </p>

                            )}

                        </div>

                    </div>

                </div>

            </section>

            {/* =================================================
                REVIEW HERO
            ================================================= */}


            <div className="review-container">

                {/* =================================================
                    RATING SUMMARY
                ================================================= */}

                <section className="rating-summary">

                    <div className="rating-overview">

                        <div className="average-rating">

                            <strong>

                                {averageRating.toFixed(1)}

                            </strong>

                            <div className="average-stars">

                                {renderStars(
                                    averageRating
                                )}

                            </div>

                            <span>

                                Based on {totalReviews}{" "}

                                {totalReviews === 1
                                    ? "review"
                                    : "reviews"}

                            </span>

                        </div>

                    </div>

                    <div className="rating-breakdown">

                        {[5, 4, 3, 2, 1].map(
                            (star) => (

                                <div
                                    className="rating-row"
                                    key={star}
                                >

                                    <span>

                                        {star}

                                        <FaStar />

                                    </span>

                                    <div className="rating-progress">

                                        <div
                                            className="rating-progress-fill"
                                            style={{

                                                width:
                                                    `${ratingPercentage(
                                                        star
                                                    )}%`,

                                            }}
                                        />

                                    </div>

                                    <small>

                                        {ratingPercentage(
                                            star
                                        )}

                                        %

                                    </small>

                                </div>

                            )
                        )}

                    </div>

                </section>

                {/* =================================================
                    WRITE REVIEW
                ================================================= */}

                <section className="write-review-card">

                    <div className="write-review-header">

                        <div className="write-review-icon">

                            ⭐

                        </div>

                        <div>

                            <h2>

                                Share Your Experience

                            </h2>

                            <p>

                                How was your experience
                                with this product?

                            </p>

                        </div>

                    </div>

                    <form onSubmit={submitReview}>

                        <div className="rating-selector">

                            <span>

                                Your Rating

                            </span>

                            <div className="interactive-stars">

                                {[1, 2, 3, 4, 5].map(
                                    (star) => (

                                        <button
                                            key={star}
                                            type="button"
                                            className="star-button"
                                            onClick={() =>
                                                setRating(
                                                    star
                                                )
                                            }
                                            onMouseEnter={() =>
                                                setHoverRating(
                                                    star
                                                )
                                            }
                                            onMouseLeave={() =>
                                                setHoverRating(
                                                    0
                                                )
                                            }
                                        >

                                            <FaStar
                                                className={
                                                    star <=
                                                    (hoverRating ||
                                                        rating)
                                                        ? "selected"
                                                        : ""
                                                }
                                            />

                                        </button>

                                    )
                                )}

                            </div>

                            <strong className="rating-text">

                                {rating === 1 &&
                                    "Poor"}

                                {rating === 2 &&
                                    "Fair"}

                                {rating === 3 &&
                                    "Good"}

                                {rating === 4 &&
                                    "Very Good"}

                                {rating === 5 &&
                                    "Excellent!"}

                            </strong>

                        </div>

                        <div className="review-input-group">

                            <label htmlFor="review">

                                Tell us what you think

                            </label>

                            <textarea
                                id="review"
                                rows="5"
                                placeholder="Share your experience with this product..."
                                value={review}
                                onChange={(e) =>
                                    setReview(
                                        e.target.value
                                    )
                                }
                                maxLength="1000"
                            />

                            <div className="review-character-count">

                                {review.length}/1000

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="submit-review-btn"
                            disabled={loading}
                        >

                            {loading
                                ? "Submitting Review..."
                                : "Submit Your Review →"}

                        </button>

                    </form>

                </section>

                {/* =================================================
                    CUSTOMER REVIEWS
                ================================================= */}

                <section className="customer-reviews">

                    <div className="customer-reviews-header">

                        <div>

                            <h2>

                                Customer Reviews

                            </h2>

                            <p>

                                {totalReviews}{" "}

                                {totalReviews === 1
                                    ? "review"
                                    : "reviews"}

                                {" "}from pet parents

                            </p>

                        </div>

                    </div>

                    {reviewsLoading ? (

                        <div className="reviews-loading">

                            <div className="review-spinner" />

                            <p>
                                Loading reviews...
                            </p>

                        </div>

                    ) : totalReviews === 0 ? (

                        <div className="no-reviews">

                            <div className="no-reviews-icon">

                                💬

                            </div>

                            <h3>

                                No Reviews Yet

                            </h3>

                            <p>

                                Be the first pet parent
                                to share your experience!

                            </p>

                        </div>

                    ) : (

                        <div className="reviews-list">

                            {reviews.map(
                                (item) => (

                                    <article
                                        className="modern-review-card"
                                        key={item.id}
                                    >

                                        <div className="modern-review-header">

                                            <div className="review-profile">

                                                <div className="review-avatar">

                                                    {item.customer_name
                                                        ? item.customer_name
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()
                                                        : (
                                                            <FaUserCircle />
                                                        )}

                                                </div>

                                                <div>

                                                    <h3>

                                                        {item.customer_name ||
                                                            "Pet Parent"}

                                                    </h3>

                                                    <span className="verified-review">

                                                        ✓ Verified Customer

                                                    </span>

                                                </div>

                                            </div>

                                            {item.customer_name ===
                                                username && (

                                                <button
                                                    type="button"
                                                    className="delete-review-btn"
                                                    onClick={() =>
                                                        deleteReview(
                                                            item.id
                                                        )
                                                    }
                                                    title="Delete Review"
                                                >

                                                    <FaTrash />

                                                </button>

                                            )}

                                        </div>

                                        <div className="review-rating-row">

                                            <div className="review-stars">

                                                {renderStars(
                                                    item.rating
                                                )}

                                            </div>

                                            <span className="review-date">

                                                {item.created_at
                                                    ? new Date(
                                                        item.created_at
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )
                                                    : ""}

                                            </span>

                                        </div>

                                        <p className="modern-review-text">

                                            {item.review}

                                        </p>

                                    </article>

                                )
                            )}

                        </div>

                    )}

                </section>

            </div>

        </main>
    );
}

export default Review;