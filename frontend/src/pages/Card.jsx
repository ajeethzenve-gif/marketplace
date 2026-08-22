import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../styles/Cart.css";

function Cart() {

    const navigate = useNavigate();

    const [cart, setCart] = useState(null);

    useEffect(() => {

        loadCart();

    }, []);

    const loadCart = async () => {

        try {

            const response = await axios.get(

                "http://127.0.0.1:8000/api/cart/",

                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`
                    }
                }

            );

            setCart(response.data);

        }
        catch (error) {

            console.log(error);

        }

    };

    const updateQuantity = async (productId, quantity) => {

        if (quantity < 1) {

            return;

        }

        try {

            await axios.put(

                "http://127.0.0.1:8000/api/cart/update/",

                {
                    product_id: productId,
                    quantity: quantity
                },

                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`
                    }
                }

            );

            loadCart();

        }
        catch (error) {

            console.log(error);

        }

    };

    const removeItem = async (productId) => {

        try {

            await axios.delete(

                `http://127.0.0.1:8000/api/cart/remove/${productId}/`,

                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`
                    }
                }

            );

            loadCart();

        }
        catch (error) {

            console.log(error);

        }

    };

    // ============================
    // CHECKOUT
    // ============================

    const proceedToCheckout = () => {

        if (!cart || cart.items.length === 0) {

            alert("Your cart is empty.");

            return;

        }

        navigate("/payment", {
            state: {
                products: cart.items,
                subtotal: cart.subtotal,
                shipping: cart.shipping_charge,
                total: cart.total_price,
                totalItems: cart.total_items,
            },
        });

    };

    if (!cart) {

        return (
            <div className="cart-loading">
                <div className="loading-spinner"></div>
                <p>Loading your cart...</p>
            </div>
        );

    }

    return (

        <div className="cart-page">

            {/* ==========================================
                CART HEADER
            ========================================== */}

            <div className="cart-header">

                <div>

                    <span className="cart-label">
                        ZENVE PETCARE
                    </span>

                    <h1>Your Shopping Cart</h1>

                    <p>
                        Review your selected products before checkout.
                    </p>

                </div>

                <div className="cart-header-icon">
                    🛒
                </div>

            </div>

            {

                cart.items.length === 0 ?

                (

                    /* ==========================================
                       EMPTY CART
                    ========================================== */

                    <div className="empty-cart">

                        <div className="empty-cart-icon">
                            🛒
                        </div>

                        <h2>Your Cart is Empty</h2>

                        <p>
                            Looks like you haven't added anything to your cart yet.
                        </p>

                    </div>

                )

                :

                (

                    <div className="cart-container">

                        {/* ==========================================
                            CART PRODUCTS
                        ========================================== */}

                        <div className="cart-items-section">

                            <div className="cart-items-header">

                                <div>
                                    <h2>Cart Items</h2>

                                    <span>
                                        {cart.total_items} item
                                        {cart.total_items !== 1 ? "s" : ""}
                                    </span>
                                </div>

                            </div>

                            <div className="cart-items">

                                {

                                    cart.items.map((item) => (

                                        <div
                                            className="cart-item"
                                            key={item.id}
                                        >

                                            {/* PRODUCT IMAGE */}

                                            <div className="cart-image-wrapper">

                                                <img
                                                    src={`http://127.0.0.1:8000${item.image}`}
                                                    alt={item.product_name}
                                                    className="cart-image"
                                                />

                                            </div>

                                            {/* PRODUCT DETAILS */}

                                            <div className="cart-details">

                                                <span className="product-tag">
                                                    PETCARE PRODUCT
                                                </span>

                                                <h3>
                                                    {item.product_name}
                                                </h3>

                                                <p className="product-price">
                                                    ₹{item.price}
                                                </p>

                                                <p className="product-subtotal">
                                                    Item total: ₹{item.subtotal}
                                                </p>

                                            </div>

                                            {/* QUANTITY */}

                                            <div className="quantity-section">

                                                <span className="quantity-label">
                                                    Quantity
                                                </span>

                                                <div className="quantity-box">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.product_id,
                                                                item.quantity - 1
                                                            )
                                                        }
                                                    >
                                                        −
                                                    </button>

                                                    <span>
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.product_id,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </button>

                                                </div>

                                            </div>

                                            {/* REMOVE */}

                                            <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() =>
                                                    removeItem(item.product_id)
                                                }
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    ))

                                }

                            </div>

                        </div>

                        {/* ==========================================
                            ORDER SUMMARY
                        ========================================== */}

                        <aside className="cart-summary">

                            <div className="summary-heading">

                                <div>

                                    <span>
                                        CHECKOUT
                                    </span>

                                    <h2>Order Summary</h2>

                                </div>

                                <div className="summary-icon">
                                    ✓
                                </div>

                            </div>

                            <div className="summary-content">

                                <div className="summary-row">

                                    <span>
                                        Items
                                    </span>

                                    <span>
                                        {cart.total_items}
                                    </span>

                                </div>

                                <div className="summary-row">

                                    <span>
                                        Subtotal
                                    </span>

                                    <span>
                                        ₹ {cart.subtotal}
                                    </span>

                                </div>

                                <div className="summary-row">

                                    <span>
                                        Shipping
                                    </span>

                                    <span className="shipping-price">
                                        ₹ {cart.shipping_charge}
                                    </span>

                                </div>

                                <div className="summary-divider"></div>

                                <div className="summary-row total">

                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        ₹ {cart.total_price}
                                    </strong>

                                </div>

                                <button
                                    type="button"
                                    className="checkout-btn"
                                    onClick={proceedToCheckout}
                                >
                                    Continue to Checkout
                                    <span>→</span>
                                </button>

                                <div className="secure-checkout">

                                    <span className="secure-icon">
                                        🔒
                                    </span>

                                    <div>

                                        <strong>
                                            Secure Checkout
                                        </strong>

                                        <p>
                                            Your order details are protected.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </aside>

                    </div>

                )

            }

        </div>

    );

}

export default Cart;