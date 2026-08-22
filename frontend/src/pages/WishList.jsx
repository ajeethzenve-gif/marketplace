import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "../styles/Wishlist.css";

function Wishlist() {

    const navigate = useNavigate();

    const [wishlist, setWishlist] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        loadWishlist();

    }, []);


    const getHeaders = () => {

        return {

            headers: {

                Authorization:
                    `Bearer ${localStorage.getItem("access")}`

            }

        };

    };


    const loadWishlist = async () => {

        const token = localStorage.getItem("access");

        if (!token) {

            navigate("/login");

            return;

        }

        try {

            const response = await axios.get(

                "http://127.0.0.1:8000/api/wishlist/",

                getHeaders()

            );

            setWishlist(response.data);

        }

        catch(error) {

            console.log(
                "Wishlist Load Error:",
                error.response?.data
            );

        }

        finally {

            setLoading(false);

        }

    };


    const removeWishlist = async(productId) => {

        try {

            await axios.delete(

                `http://127.0.0.1:8000/api/wishlist/remove/${productId}/`,

                getHeaders()

            );

            setWishlist(

                wishlist.filter(

                    item =>
                    item.product !== productId

                )

            );

        }

        catch(error) {

            console.log(
                "Remove Wishlist Error:",
                error.response?.data
            );

        }

    };


    const addToCart = async(productId) => {

        try {

            await axios.post(

                "http://127.0.0.1:8000/api/cart/add/",

                {

                    product_id: productId,

                    quantity: 1

                },

                getHeaders()

            );

            alert(
                "Product added to cart"
            );

        }

        catch(error) {

            console.log(
                "Cart Error:",
                error.response?.data
            );

        }

    };


    if(loading) {

        return (

            <div className="wishlist-loading">

                <div className="wishlist-loader"></div>

                <p>Loading your wishlist...</p>

            </div>

        );

    }


    return (

        <div className="wishlist-page">


            {/* ==================================================
                WISHLIST HERO
            ================================================== */}

            <section className="wishlist-hero">


                <div className="wishlist-hero-content">


                    <span className="wishlist-hero-label">
                        ♥ YOUR SAVED COLLECTION
                    </span>


                    <h1>

                        Things You Love,

                        <span>
                            Saved For Later.
                        </span>

                    </h1>


                    <p>

                        Keep your favourite pet care products
                        close at hand. Come back anytime and
                        shop the products your pets love.

                    </p>


                    <div className="wishlist-hero-info">


                        <div className="wishlist-stat">

                            <strong>
                                {wishlist.length}
                            </strong>

                            <span>
                                Saved Products
                            </span>

                        </div>


                        <div className="wishlist-stat-divider"></div>


                        <div className="wishlist-stat">

                            <strong>
                                ♥
                            </strong>

                            <span>
                                Made With Love
                            </span>

                        </div>


                    </div>


                </div>


                {/* HERO VISUAL */}

                <div className="wishlist-hero-visual">


                    <div className="wishlist-hero-circle"></div>


                    <div className="wishlist-paw paw-one">
                        🐾
                    </div>


                    <div className="wishlist-paw paw-two">
                        🐾
                    </div>


                    <div className="wishlist-big-heart">
                        ♥
                    </div>


                    <div className="wishlist-mini-card">

                        <span>
                            ♥
                        </span>

                        <div>

                            <strong>
                                Your Favorites
                            </strong>

                            <small>
                                Always close to you
                            </small>

                        </div>

                    </div>


                </div>


            </section>


            {/* ==================================================
                WISHLIST TITLE
            ================================================== */}

            <div className="wishlist-section-header">

                <div>

                    <span>
                        YOUR COLLECTION
                    </span>

                    <h2>
                        My Wishlist
                    </h2>

                </div>


                <div className="wishlist-item-count">

                    {wishlist.length}

                    <span>
                        items
                    </span>

                </div>

            </div>


            {/* ==================================================
                EMPTY WISHLIST
            ================================================== */}

            {

                wishlist.length === 0

                ?

                (

                    <div className="wishlist-empty">

                        <div className="empty-heart">
                            ♡
                        </div>

                        <h3>
                            Your Wishlist is Empty
                        </h3>

                        <p>
                            Save products you love and they'll
                            appear here.
                        </p>

                        <Link
                            to="/products"
                            className="browse-products-btn"
                        >
                            Browse Products
                        </Link>

                    </div>

                )

                :

                (

                    /* ==================================================
                       PRODUCTS
                    ================================================== */

                    <div className="wishlist-grid">


                        {

                            wishlist.map((item) => (

                                <div
                                    className="wishlist-product-card"
                                    key={item.id}
                                >


                                    {/* IMAGE */}

                                    <div className="wishlist-product-image">


                                        <img

                                            src={
                                                item.product_image
                                                ?
                                                item.product_image
                                                :
                                                "https://via.placeholder.com/300x220"
                                            }

                                            alt={item.product_name}

                                        />


                                        <button

                                            type="button"

                                            className="wishlist-remove-heart"

                                            onClick={() =>
                                                removeWishlist(item.product)
                                            }

                                        >
                                            ♥
                                        </button>


                                    </div>


                                    {/* CONTENT */}

                                    <div className="wishlist-product-content">


                                        <span className="wishlist-product-category">

                                            {item.category_name}

                                        </span>


                                        <h3>
                                            {item.product_name}
                                        </h3>


                                        <div className="wishlist-product-brand">

                                            <span>
                                                Brand
                                            </span>

                                            <strong>
                                                {item.brand_name}
                                            </strong>

                                        </div>


                                        <div className="wishlist-product-bottom">


                                            <div>

                                                <small>
                                                    Price
                                                </small>

                                                <strong>
                                                    ₹{item.price}
                                                </strong>

                                            </div>


                                            <Link

                                                to={`/products/${item.product}`}

                                                className="wishlist-details-btn"

                                            >
                                                Details
                                            </Link>


                                        </div>


                                        <button

                                            type="button"

                                            className="wishlist-cart-btn"

                                            onClick={() =>
                                                addToCart(item.product)
                                            }

                                        >
                                            Add to Cart
                                        </button>


                                        <button

                                            type="button"

                                            className="wishlist-remove-text"

                                            onClick={() =>
                                                removeWishlist(item.product)
                                            }

                                        >
                                            Remove from wishlist

                                        </button>


                                    </div>


                                </div>

                            ))

                        }


                    </div>

                )

            }


        </div>

    );

}

export default Wishlist;