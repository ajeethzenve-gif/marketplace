import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import {
    FaCreditCard,
    FaUniversity,
    FaMoneyBillWave,
    FaWallet,
    FaLock,
    FaShieldAlt,
    FaCheckCircle,
} from "react-icons/fa";

import "../styles/Payment.css";

function Payment() {
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem("access");

    // =====================================
    // GET DATA FROM BUY NOW OR CART
    // =====================================

    const {
        checkoutType,
        product = null,
        products = [],
        subtotal = 0,
        shipping = 0,
        total = 0,
        totalItems = 0,
    } = location.state || {};

    // =====================================
    // STATES
    // =====================================

    const [paymentMethod, setPaymentMethod] =
        useState("Cash on Delivery");

    const [loading, setLoading] =
        useState(false);

    const [loadingAddress, setLoadingAddress] =
        useState(true);

    // Only the default address will be stored here
    const [addresses, setAddresses] =
        useState([]);

    const [selectedAddress, setSelectedAddress] =
        useState(null);

    const [showAddressForm, setShowAddressForm] =
        useState(false);

    const [addressForm, setAddressForm] = useState({
        full_name: "",
        phone_number: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        country: "India",
        postal_code: "",
        is_default: true,
    });

    // =====================================
    // COUPON STATES
    // =====================================

    const [couponCode, setCouponCode] =
        useState("");

    const [couponDiscount, setCouponDiscount] =
        useState(0);

    const [finalAmount, setFinalAmount] =
        useState(Number(total));

    const [appliedCoupon, setAppliedCoupon] =
        useState(null);

    const [couponLoading, setCouponLoading] =
        useState(false);

    const [couponMessage, setCouponMessage] =
        useState("");

    // =====================================
    // LOAD RAZORPAY SCRIPT
    // =====================================

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script =
                document.createElement("script");

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.async = true;

            script.onload = () => {
                resolve(true);
            };

            script.onerror = () => {
                resolve(false);
            };

            document.body.appendChild(script);
        });
    };

    // =====================================
    // LOAD DEFAULT ADDRESS
    // =====================================

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        fetchAddresses();
    }, []);

    // =====================================
    // FETCH ONLY DEFAULT ADDRESS
    // =====================================

    const fetchAddresses = async () => {
        setLoadingAddress(true);

        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/accounts/addresses/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const addressData = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            // Find only default address
            const defaultAddress =
                addressData.find(
                    (item) => item.is_default === true
                );

            if (defaultAddress) {
                // Store only default address
                setAddresses([defaultAddress]);

                // Automatically select default address
                setSelectedAddress(
                    defaultAddress.id
                );

                setShowAddressForm(false);

            } else {
                setAddresses([]);
                setSelectedAddress(null);
            }

        } catch (error) {
            console.error(
                "Address loading error:",
                error.response?.data || error.message
            );

            setAddresses([]);
            setSelectedAddress(null);

        } finally {
            setLoadingAddress(false);
        }
    };

    // =====================================
    // HANDLE ADDRESS INPUT
    // =====================================

    const handleAddressChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setAddressForm({
            ...addressForm,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        });
    };

    // =====================================
    // SAVE DEFAULT ADDRESS
    // =====================================

    const saveAddress = async () => {
        try {
            const dataToSend = {
                ...addressForm,
                is_default: true,
            };

            const response = await axios.post(
                "http://127.0.0.1:8000/api/accounts/addresses/",
                dataToSend,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            alert(
                "Default address added successfully."
            );

            setShowAddressForm(false);

            setAddressForm({
                full_name: "",
                phone_number: "",
                address_line1: "",
                address_line2: "",
                city: "",
                state: "",
                country: "India",
                postal_code: "",
                is_default: true,
            });

            await fetchAddresses();

            if (response.data?.id) {
                setSelectedAddress(
                    response.data.id
                );
            }

        } catch (error) {
            console.error(
                "Save address error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                JSON.stringify(
                    error.response?.data
                ) ||
                "Unable to save address."
            );
        }
    };

    // =====================================
    // DELETE DEFAULT ADDRESS
    // =====================================

    const deleteAddress = async (id) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete your default address?"
            );

        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(
                `http://127.0.0.1:8000/api/accounts/addresses/${id}/`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            setAddresses([]);
            setSelectedAddress(null);

            alert(
                "Default address deleted successfully."
            );

        } catch (error) {
            console.error(
                "Delete address error:",
                error.response?.data || error.message
            );

            alert(
                "Unable to delete address."
            );
        }
    };

    // =====================================
    // CLEAR CART AFTER SUCCESSFUL ORDER
    // =====================================

    const clearCartAfterOrder = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/cart/",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            let cartItems = [];

            if (Array.isArray(response.data)) {
                cartItems = response.data;

            } else if (
                Array.isArray(response.data.results)
            ) {
                cartItems = response.data.results;

            } else if (
                Array.isArray(response.data.items)
            ) {
                cartItems = response.data.items;

            } else if (
                Array.isArray(
                    response.data.cart_items
                )
            ) {
                cartItems =
                    response.data.cart_items;
            }

            if (cartItems.length > 0) {
                await Promise.all(
                    cartItems.map(async (item) => {
                        const productId =
                            item.product_id ||
                            item.product?.id ||
                            item.id;

                        if (!productId) {
                            return;
                        }

                        try {
                            await axios.delete(
                                `http://127.0.0.1:8000/api/cart/remove/${productId}/`,
                                {
                                    headers: {
                                        Authorization:
                                            `Bearer ${token}`,
                                    },
                                }
                            );

                        } catch (error) {
                            console.error(
                                `Unable to remove cart item ${productId}:`,
                                error.response?.data ||
                                error.message
                            );
                        }
                    })
                );
            }

            localStorage.setItem(
                "cartCount",
                "0"
            );

            window.dispatchEvent(
                new Event("cartUpdated")
            );

        } catch (error) {
            console.error(
                "Cart clearing error:",
                error.response?.data ||
                error.message
            );
        }
    };

    // =====================================
    // APPLY COUPON
    // =====================================

    const applyCoupon = async () => {
        if (!couponCode.trim()) {
            alert(
                "Please enter a coupon code."
            );

            return;
        }

        setCouponLoading(true);
        setCouponMessage("");

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/coupons/apply/",
                {
                    code:
                        couponCode
                            .trim()
                            .toUpperCase(),

                    cart_total:
                        Number(subtotal),
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const discount =
                Number(
                    response.data.discount
                ) || 0;

            const backendFinal =
                Number(
                    response.data.final_total
                );

            const calculatedFinal =
                Number.isFinite(
                    backendFinal
                )
                    ? backendFinal
                    : Math.max(
                        0,
                        Number(total) - discount
                    );

            setAppliedCoupon(
                response.data.coupon
            );

            setCouponDiscount(
                discount
            );

            setFinalAmount(
                calculatedFinal
            );

            setCouponMessage(
                "Coupon applied successfully."
            );

        } catch (error) {
            console.error(
                "Coupon error:",
                error.response?.data ||
                error.message
            );

            setAppliedCoupon(null);

            setCouponDiscount(0);

            setFinalAmount(
                Number(total)
            );

            setCouponMessage(
                error.response?.data?.message ||
                "Unable to apply coupon."
            );

        } finally {
            setCouponLoading(false);
        }
    };

    // =====================================
    // REMOVE COUPON
    // =====================================

    const removeCoupon = () => {
        setCouponCode("");
        setCouponDiscount(0);
        setAppliedCoupon(null);
        setFinalAmount(Number(total));
        setCouponMessage("");
    };

    // =====================================
    // RAZORPAY UPI PAYMENT
    // =====================================

    const handleRazorpayPayment = async () => {
        if (!selectedAddress) {
            alert(
                "Please add a default delivery address."
            );

            return;
        }

        if (
            checkoutType === "buy_now" &&
            !product
        ) {
            alert(
                "Product information is missing."
            );

            return;
        }

        if (
            checkoutType !== "buy_now" &&
            products.length === 0
        ) {
            alert(
                "Your cart is empty."
            );

            navigate("/cart");

            return;
        }

        try {
            setLoading(true);

            const razorpayLoaded =
                await loadRazorpayScript();

            if (!razorpayLoaded) {
                alert(
                    "Razorpay failed to load. Please check your internet connection."
                );

                setLoading(false);
                return;
            }

            // =====================================
            // CREATE RAZORPAY ORDER
            // =====================================

            const response = await axios.post(
                "http://127.0.0.1:8000/api/payments/create-order/",
                {
                    amount:
                        Number(finalAmount),
                    currency: "INR",
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data = response.data;

            if (
                !data.razorpay_order_id ||
                !data.amount ||
                !data.key
            ) {
                alert(
                    "Invalid Razorpay order response."
                );

                setLoading(false);
                return;
            }

            // =====================================
            // RAZORPAY CHECKOUT OPTIONS
            // =====================================

            const options = {
                key: data.key,

                amount: data.amount,

                currency:
                    data.currency || "INR",

                name: "Zenve MarketPlace",

                description:
                    "UPI Payment",

                order_id:
                    data.razorpay_order_id,

                handler: async function (
                    razorpayResponse
                ) {
                    try {
                        // =====================================
                        // VERIFY PAYMENT
                        // =====================================

                        const verifyResponse =
                            await axios.post(
                                "http://127.0.0.1:8000/api/payments/verify/",
                                {
                                    razorpay_payment_id:
                                        razorpayResponse.razorpay_payment_id,

                                    razorpay_order_id:
                                        razorpayResponse.razorpay_order_id,

                                    razorpay_signature:
                                        razorpayResponse.razorpay_signature,

                                    checkout_type:
                                        checkoutType,

                                    shipping_address:
                                        selectedAddress,

                                    payment_method:
                                        "UPI",

                                    coupon_code:
                                        appliedCoupon
                                            ? couponCode
                                            : null,

                                    subtotal:
                                        Number(subtotal),

                                    shipping_charge:
                                        Number(shipping),

                                    discount_amount:
                                        Number(
                                            couponDiscount
                                        ),

                                    total_amount:
                                        Number(
                                            finalAmount
                                        ),

                                    product_id:
                                        checkoutType ===
                                        "buy_now"
                                            ? product?.id
                                            : null,

                                    quantity:
                                        checkoutType ===
                                        "buy_now"
                                            ? product?.quantity
                                            : null,
                                },
                                {
                                    headers: {
                                        Authorization:
                                            `Bearer ${token}`,
                                    },
                                }
                            );

                        console.log(
                            "Payment verification:",
                            verifyResponse.data
                        );

                        // =====================================
                        // CLEAR CART AFTER SUCCESS
                        // =====================================

                        if (
                            checkoutType !==
                            "buy_now"
                        ) {
                            await clearCartAfterOrder();
                        }

                        alert(
                            "Payment successful! Order placed successfully."
                        );

                        navigate(
                            "/orders",
                            {
                                replace: true,
                            }
                        );

                    } catch (error) {
                        console.error(
                            "Payment verification error:",
                            error.response?.data ||
                            error.message
                        );

                        alert(
                            error.response?.data?.message ||
                            "Payment verification failed."
                        );

                    } finally {
                        setLoading(false);
                    }
                },

                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    },
                },

                prefill: {
                    name:
                        addresses[0]?.full_name ||
                        "",

                    contact:
                        addresses[0]?.phone_number ||
                        "",
                },

                notes: {
                    checkout_type:
                        checkoutType || "cart",

                    shipping_address:
                        selectedAddress,
                },

                theme: {
                    color: "#0D6EFD",
                },

                // UPI ONLY
                method: {
                    upi: true,

                    card: false,

                    netbanking: false,

                    wallet: false,

                    emi: false,

                    paylater: false,
                },
            };

            const razorpay =
                new window.Razorpay(
                    options
                );

            razorpay.on(
                "payment.failed",
                function (response) {
                    console.error(
                        "Payment failed:",
                        response.error
                    );

                    alert(
                        response.error.description ||
                        "Payment failed. Please try again."
                    );

                    setLoading(false);
                }
            );

            razorpay.open();

        } catch (error) {
            console.error(
                "Razorpay payment error:",
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                "Unable to start Razorpay payment."
            );

            setLoading(false);
        }
    };

    // =====================================
    // PLACE ORDER
    // =====================================

    const placeOrder = async () => {
        if (!selectedAddress) {
            alert(
                "Please add a default delivery address."
            );

            return;
        }

        if (loading) {
            return;
        }

        // =====================================
        // UPI → OPEN RAZORPAY POPUP
        // =====================================

        if (paymentMethod === "UPI") {
            await handleRazorpayPayment();
            return;
        }

        // =====================================
        // BUY NOW VALIDATION
        // =====================================

        if (
            checkoutType === "buy_now" &&
            !product
        ) {
            alert(
                "Product information is missing."
            );

            return;
        }

        // =====================================
        // CART VALIDATION
        // =====================================

        if (
            checkoutType !== "buy_now" &&
            products.length === 0
        ) {
            alert(
                "Your cart is empty."
            );

            navigate("/cart");

            return;
        }

        setLoading(true);

        try {
            // =====================================
            // BUY NOW
            // =====================================

            if (checkoutType === "buy_now") {
                await axios.post(
                    "http://127.0.0.1:8000/api/orders/place/",
                    {
                        product_id:
                            product.id,

                        quantity:
                            product.quantity,

                        shipping_address:
                            selectedAddress,

                        payment_method:
                            paymentMethod,

                        coupon_code:
                            appliedCoupon
                                ? couponCode
                                : null,

                        subtotal:
                            Number(subtotal),

                        shipping_charge:
                            Number(shipping),

                        discount_amount:
                            Number(couponDiscount),

                        total_amount:
                            Number(finalAmount),
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            } else {

                // =====================================
                // CART CHECKOUT
                // =====================================

                await axios.post(
                    "http://127.0.0.1:8000/api/orders/place-cart/",
                    {
                        shipping_address:
                            selectedAddress,

                        payment_method:
                            paymentMethod,

                        coupon_code:
                            appliedCoupon
                                ? couponCode
                                : null,

                        subtotal:
                            Number(subtotal),

                        shipping_charge:
                            Number(shipping),

                        discount_amount:
                            Number(couponDiscount),

                        total_amount:
                            Number(finalAmount),
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                await clearCartAfterOrder();
            }

            alert(
                "Order placed successfully!"
            );

            navigate("/orders", {
                replace: true,
            });

        } catch (error) {
            console.error(
                "Place order error:",
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                JSON.stringify(
                    error.response?.data
                ) ||
                "Unable to place order."
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================
    // JSX
    // =====================================

    return (
        <div className="payment-page">
            <div className="container py-5">
                <div className="row g-4">

                    {/* ============================
                        LEFT SIDE
                    ============================ */}

                    <div className="col-lg-8">

                        {/* DELIVERY ADDRESS */}

                        <div className="premium-card">

                            <div className="d-flex justify-content-between align-items-center mb-3">

                                <h3 className="section-title">
                                    Delivery Address
                                </h3>

                                {addresses.length === 0 && (
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() =>
                                            setShowAddressForm(
                                                !showAddressForm
                                            )
                                        }
                                    >
                                        {showAddressForm
                                            ? "Cancel"
                                            : "Add Default Address"}
                                    </button>
                                )}

                            </div>

                            {loadingAddress ? (

                                <p>
                                    Loading address...
                                </p>

                            ) : (

                                <>
                                    {/* SHOW ONLY DEFAULT ADDRESS */}

                                    {addresses.map(
                                        (item) => (
                                            <div
                                                key={item.id}
                                                className="address-card border rounded p-3 mb-3"
                                            >

                                                <div className="d-flex justify-content-between align-items-start">

                                                    <div>
                                                        <strong>
                                                            {item.full_name}
                                                        </strong>

                                                        <span className="badge bg-success ms-2">
                                                            Default Address
                                                        </span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() =>
                                                            deleteAddress(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                                <p className="mt-3">
                                                    {item.address_line1}
                                                </p>

                                                {item.address_line2 && (
                                                    <p>
                                                        {item.address_line2}
                                                    </p>
                                                )}

                                                <p>
                                                    {item.city},{" "}
                                                    {item.state} -{" "}
                                                    {item.postal_code}
                                                </p>

                                                <p>
                                                    📞{" "}
                                                    {item.phone_number}
                                                </p>

                                            </div>
                                        )
                                    )}

                                    {/* NO DEFAULT ADDRESS */}

                                    {addresses.length === 0 &&
                                        !showAddressForm && (

                                        <div>
                                            <p>
                                                No default delivery address found.
                                            </p>

                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() =>
                                                    setShowAddressForm(true)
                                                }
                                            >
                                                Add Default Address
                                            </button>
                                        </div>
                                    )}

                                    {/* ADD ADDRESS FORM */}

                                    {showAddressForm && (

                                        <div className="address-form mt-4">

                                            <hr />

                                            <h4 className="mb-3">
                                                Add Default Address
                                            </h4>

                                            <div className="row">

                                                <div className="col-md-6 mb-3">

                                                    <input
                                                        type="text"
                                                        name="full_name"
                                                        className="form-control"
                                                        placeholder="Full Name"
                                                        value={addressForm.full_name}
                                                        onChange={handleAddressChange}
                                                    />

                                                </div>

                                                <div className="col-md-6 mb-3">

                                                    <input
                                                        type="text"
                                                        name="phone_number"
                                                        className="form-control"
                                                        placeholder="Phone Number"
                                                        value={addressForm.phone_number}
                                                        onChange={handleAddressChange}
                                                    />

                                                </div>

                                            </div>

                                            <div className="mb-3">

                                                <input
                                                    type="text"
                                                    name="address_line1"
                                                    className="form-control"
                                                    placeholder="Address Line 1"
                                                    value={addressForm.address_line1}
                                                    onChange={handleAddressChange}
                                                />

                                            </div>

                                            <div className="mb-3">

                                                <input
                                                    type="text"
                                                    name="address_line2"
                                                    className="form-control"
                                                    placeholder="Address Line 2 (Optional)"
                                                    value={addressForm.address_line2}
                                                    onChange={handleAddressChange}
                                                />

                                            </div>

                                            <div className="row">

                                                <div className="col-md-4 mb-3">

                                                    <input
                                                        type="text"
                                                        name="city"
                                                        className="form-control"
                                                        placeholder="City"
                                                        value={addressForm.city}
                                                        onChange={handleAddressChange}
                                                    />

                                                </div>

                                                <div className="col-md-4 mb-3">

                                                    <input
                                                        type="text"
                                                        name="state"
                                                        className="form-control"
                                                        placeholder="State"
                                                        value={addressForm.state}
                                                        onChange={handleAddressChange}
                                                    />

                                                </div>

                                                <div className="col-md-4 mb-3">

                                                    <input
                                                        type="text"
                                                        name="postal_code"
                                                        className="form-control"
                                                        placeholder="Postal Code"
                                                        value={addressForm.postal_code}
                                                        onChange={handleAddressChange}
                                                    />

                                                </div>

                                            </div>

                                            <div className="mb-3">

                                                <input
                                                    type="text"
                                                    name="country"
                                                    className="form-control"
                                                    value={addressForm.country}
                                                    onChange={handleAddressChange}
                                                />

                                            </div>

                                            <div className="d-flex gap-2">

                                                <button
                                                    type="button"
                                                    className="btn btn-success"
                                                    onClick={saveAddress}
                                                >
                                                    Save Default Address
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() =>
                                                        setShowAddressForm(false)
                                                    }
                                                >
                                                    Cancel
                                                </button>

                                            </div>

                                        </div>
                                    )}

                                </>

                            )}

                        </div>

                        {/* PAYMENT METHOD */}

                        <div className="premium-card mt-4">

                            <h3 className="section-title">
                                Select Payment Method
                            </h3>

                            <div className="payment-options">

                                <label
                                    className={
                                        paymentMethod === "Credit Card"
                                            ? "payment-option active"
                                            : "payment-option"
                                    }
                                >
                                    <input
                                        type="radio"
                                        value="Credit Card"
                                        checked={
                                            paymentMethod ===
                                            "Credit Card"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <FaCreditCard className="payment-icon" />

                                    <span>
                                        Credit / Debit Card
                                    </span>
                                </label>

                                <label
                                    className={
                                        paymentMethod === "UPI"
                                            ? "payment-option active"
                                            : "payment-option"
                                    }
                                >
                                    <input
                                        type="radio"
                                        value="UPI"
                                        checked={
                                            paymentMethod === "UPI"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <FaWallet className="payment-icon" />

                                    <span>
                                        UPI Payment
                                    </span>
                                </label>

                                <label
                                    className={
                                        paymentMethod === "Net Banking"
                                            ? "payment-option active"
                                            : "payment-option"
                                    }
                                >
                                    <input
                                        type="radio"
                                        value="Net Banking"
                                        checked={
                                            paymentMethod ===
                                            "Net Banking"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <FaUniversity className="payment-icon" />

                                    <span>
                                        Net Banking
                                    </span>
                                </label>

                                <label
                                    className={
                                        paymentMethod ===
                                        "Cash on Delivery"
                                            ? "payment-option active"
                                            : "payment-option"
                                    }
                                >
                                    <input
                                        type="radio"
                                        value="Cash on Delivery"
                                        checked={
                                            paymentMethod ===
                                            "Cash on Delivery"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <FaMoneyBillWave className="payment-icon" />

                                    <span>
                                        Cash on Delivery
                                    </span>
                                </label>

                            </div>

                        </div>

                    </div>

                    {/* ============================
                        RIGHT SIDE - ORDER SUMMARY
                    ============================ */}

                    <div className="col-lg-4">

                        <div className="premium-summary">

                            <h3 className="summary-title">
                                Order Summary
                            </h3>

                            {/* COUPON */}

                            <div className="coupon-box">

                                <label className="coupon-title">
                                    Have a Coupon?
                                </label>

                                <div className="coupon-input">

                                    <input
                                        type="text"
                                        placeholder="Enter Coupon Code"
                                        value={couponCode}
                                        disabled={!!appliedCoupon}
                                        onChange={(e) =>
                                            setCouponCode(
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                    />

                                    {!appliedCoupon ? (

                                        <button
                                            type="button"
                                            onClick={applyCoupon}
                                            disabled={couponLoading}
                                        >
                                            {couponLoading
                                                ? "Applying..."
                                                : "Apply"}
                                        </button>

                                    ) : (

                                        <button
                                            type="button"
                                            onClick={removeCoupon}
                                        >
                                            Remove
                                        </button>

                                    )}

                                </div>

                                {couponMessage && (

                                    <p
                                        style={{
                                            color: appliedCoupon
                                                ? "green"
                                                : "red",
                                            marginTop: "8px",
                                        }}
                                    >
                                        {couponMessage}
                                    </p>

                                )}

                            </div>

                            {/* PRODUCTS */}

                            <div className="summary-products">

                                {checkoutType === "buy_now" ? (

                                    product && (

                                        <div className="summary-product">

                                            <span>
                                                {product.name}
                                            </span>

                                            <span>
                                                × {product.quantity}
                                            </span>

                                        </div>

                                    )

                                ) : (

                                    products.map((item) => (

                                        <div
                                            key={
                                                item.product_id ||
                                                item.id
                                            }
                                            className="summary-product"
                                        >

                                            <span>
                                                {item.product_name}
                                            </span>

                                            <span>
                                                × {item.quantity}
                                            </span>

                                        </div>

                                    ))

                                )}

                            </div>

                            <hr />

                            <div className="summary-row">
                                <span>Total Items</span>
                                <span>{totalItems}</span>
                            </div>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>
                                    ₹ {Number(subtotal).toFixed(2)}
                                </span>
                            </div>

                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>
                                    ₹ {Number(shipping).toFixed(2)}
                                </span>
                            </div>

                            {couponDiscount > 0 && (

                                <div className="summary-row">

                                    <span>
                                        Coupon Discount
                                    </span>

                                    <span
                                        style={{
                                            color: "green",
                                        }}
                                    >
                                        - ₹{" "}
                                        {Number(
                                            couponDiscount
                                        ).toFixed(2)}
                                    </span>

                                </div>

                            )}

                            <hr />

                            <div className="summary-total">

                                <span>
                                    Total Amount
                                </span>

                                <span>
                                    ₹{" "}
                                    {Number(
                                        finalAmount
                                    ).toFixed(2)}
                                </span>

                            </div>

                            {/* PLACE ORDER / PAY */}

                            <button
                                type="button"
                                className="place-order-btn"
                                onClick={placeOrder}
                                disabled={
                                    loading ||
                                    !selectedAddress
                                }
                            >

                                {loading
                                    ? "Processing..."

                                    : !selectedAddress
                                        ? "Add Default Address"

                                        : paymentMethod === "UPI"
                                            ? `Pay ₹${Number(
                                                finalAmount
                                            ).toFixed(2)}`

                                            : "Place Order"
                                }

                            </button>

                            {/* SECURE PAYMENT */}

                            <div className="secure-box">

                                <div className="secure-item">

                                    <FaLock className="secure-icon" />

                                    <span>
                                        Secure SSL Checkout
                                    </span>

                                </div>

                                <div className="secure-item">

                                    <FaShieldAlt className="secure-icon" />

                                    <span>
                                        100% Safe Payment
                                    </span>

                                </div>

                                <div className="secure-item">

                                    <FaCheckCircle className="secure-icon" />

                                    <span>
                                        Easy Returns
                                    </span>

                                </div>

                            </div>

                            {/* OFFERS */}

                            <div className="offer-box">

                                <h6>
                                    🎁 Special Offers
                                </h6>

                                <p>
                                    💳 10% Instant Cashback
                                    on Credit Cards
                                </p>

                                <p>
                                    ⚡ Flat ₹100 Cashback
                                    on UPI Payments
                                </p>

                                <p>
                                    🛡️ 100% Secure Payment
                                    Guarantee
                                </p>

                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default Payment;