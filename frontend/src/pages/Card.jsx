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

        return <h3 className="text-center mt-5">Loading...</h3>;

    }

    return (

        <div className="cart-page">

            <h1>Shopping Cart</h1>

            {

                cart.items.length === 0 ?

                (

                    <h3>Your Cart is Empty</h3>

                )

                :

                (

                    <div className="cart-container">

                        <div className="cart-items">

                            {

                                cart.items.map((item) => (

                                    <div
                                        className="cart-item"
                                        key={item.id}
                                    >

                                        <img
                                            src={`http://127.0.0.1:8000${item.image}`}
                                            alt={item.product_name}
                                            className="cart-image"
                                        />

                                        <div className="cart-details">

                                            <h3>{item.product_name}</h3>

                                            <p>Price : ₹{item.price}</p>

                                            <p>Subtotal : ₹{item.subtotal}</p>

                                        </div>

                                        <div className="quantity-box">

                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.product_id,
                                                        item.quantity - 1
                                                    )
                                                }
                                            >
                                                -
                                            </button>

                                            <span>{item.quantity}</span>

                                            <button
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

                                        <button
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

                        <div className="cart-summary">

                            <h2>Order Summary</h2>

                            <div className="summary-row">

                                <span>Total Items</span>

                                <span>{cart.total_items}</span>

                            </div>

                            <div className="summary-row">

                                <span>Subtotal</span>

                                <span>₹ {cart.subtotal}</span>

                            </div>

                            <div className="summary-row">

                                <span>Shipping</span>

                                <span>₹ {cart.shipping_charge}</span>

                            </div>

                            <hr />

                            <div className="summary-row total">

                                <span>Total</span>

                                <span>₹ {cart.total_price}</span>

                            </div>

                            <button
                                className="checkout-btn"
                                onClick={proceedToCheckout}
                            >
                                Proceed to Checkout
                            </button>

                        </div>

                    </div>

                )

            }

        </div>

    );

}

export default Cart;