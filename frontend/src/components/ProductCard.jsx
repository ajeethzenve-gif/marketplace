import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import {
    FaHeart,
    FaRegHeart,
    FaStar,
    FaShoppingCart
} from "react-icons/fa";

import "../styles/ProductCard.css";


function ProductCard({ product }) {

    const navigate = useNavigate();

    const [inWishlist, setInWishlist] = useState(false);

    const token = localStorage.getItem("access");


    /* =====================================================
       CHECK WISHLIST
       ===================================================== */

    useEffect(() => {

        if (token) {
            checkWishlist();
        }

    }, [product.id]);


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

                    return item.product_id === product.id;

                }


                if (item.product) {

                    return (
                        item.product === product.id ||
                        item.product.id === product.id
                    );

                }

                return false;

            });


            setInWishlist(exists);

        }
        catch (error) {

            console.log(
                "Wishlist Check Error:",
                error.response?.data
            );

        }

    };


    /* =====================================================
       WISHLIST TOGGLE
       ===================================================== */

    const toggleWishlist = async (e) => {

        e.stopPropagation();

        if (!token) {

            navigate("/login");

            return;

        }


        try {

            const response = await axios.post(

                "http://127.0.0.1:8000/api/wishlist/toggle/",

                {
                    product_id: product.id
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

        }
        catch (error) {

            console.log(
                "Toggle Wishlist Error:",
                error.response?.data
            );

        }

    };


    /* =====================================================
       ADD TO CART
       ===================================================== */

    const addToCart = async (e) => {

        e.stopPropagation();


        if (!token) {

            localStorage.setItem(
                "pendingCartProduct",
                JSON.stringify({
                    product_id: product.id,
                    quantity: 1
                })
            );

            navigate("/login");

            return;

        }


        if (product.stock <= 0) {

            alert("Product is out of stock");

            return;

        }


        try {

            await axios.post(

                "http://127.0.0.1:8000/api/cart/add/",

                {
                    product_id: product.id,
                    quantity: 1
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );


            alert("Product added to cart");


        }
        catch (error) {

            console.log(
                "Cart Error:",
                error.response?.data
            );

        }

    };


    /* =====================================================
       BUY / PRODUCT DETAILS
       ===================================================== */

    const openProduct = () => {

        navigate(`/products/${product.id}`);

    };


    /* =====================================================
       IMAGE URL
       ===================================================== */

    const imageURL = product.image
        ? (
            product.image.startsWith("http")
                ? product.image
                : `http://127.0.0.1:8000${product.image}`
        )
        : "https://via.placeholder.com/300x200";


    /* =====================================================
       PRICE
       ===================================================== */

    const currentPrice = Number(product.price || 0);

    const oldPrice = Math.round(
        currentPrice * 1.20
    );


    /* =====================================================
       RATING
       ===================================================== */

    const rating = Number(
        product.average_rating || 0
    );


    return (

        <div
            className="market-product-card"
            onClick={openProduct}
        >


            {/* =================================================
                PRODUCT IMAGE AREA
            ================================================= */}

            <div className="market-product-image">


                {/* DISCOUNT */}

                <span className="product-discount">
                    -20%
                </span>


                {/* WISHLIST */}

                <button
                    className="product-wishlist"
                    onClick={toggleWishlist}
                >

                    {inWishlist ? (

                        <FaHeart />

                    ) : (

                        <FaRegHeart />

                    )}

                </button>


                {/* IMAGE */}

                <img
                    src={imageURL}
                    alt={product.product_name}
                />

            </div>



            {/* =================================================
                PRODUCT CONTENT
            ================================================= */}

            <div className="market-product-content">


                {/* PRODUCT NAME */}

                <h3 className="market-product-title">

                    {product.product_name}

                </h3>



                {/* RATING */}

                <div className="market-product-rating">

                    <div className="stars">

                        {[1, 2, 3, 4, 5].map((star) => (

                            <FaStar
                                key={star}
                                className={
                                    star <= Math.round(rating)
                                        ? "star-active"
                                        : "star-inactive"
                                }
                            />

                        ))}

                    </div>


                    <span>
                        ({rating.toFixed(1)})
                    </span>

                </div>



                {/* PRICE */}

                <div className="market-product-price">

                    <span className="current-price">
                        ₹{currentPrice.toLocaleString("en-IN")}
                    </span>

                    <span className="old-price">
                        ₹{oldPrice.toLocaleString("en-IN")}
                    </span>

                </div>



                {/* BUTTONS */}

                <div
                    className="market-product-actions"
                    onClick={(e) => e.stopPropagation()}
                >

                    <button
                        className="market-add-cart"
                        onClick={addToCart}
                        disabled={product.stock <= 0}
                    >

                        {product.stock > 0
                            ? "Add to Cart"
                            : "Out of Stock"
                        }

                    </button>


                    <button
                        className="market-cart-icon"
                        onClick={addToCart}
                        disabled={product.stock <= 0}
                        aria-label="Add to cart"
                    >

                        <FaShoppingCart />

                    </button>

                </div>


            </div>

        </div>

    );

}


export default ProductCard;