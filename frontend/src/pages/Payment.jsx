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

    const [addresses, setAddresses] =
        useState([]);

    const [selectedAddress, setSelectedAddress] =
        useState(null);

    const [showAddressForm, setShowAddressForm] =
        useState(false);

    const [addressForm, setAddressForm] =
        useState({

            full_name: "",

            phone_number: "",

            address_line1: "",

            address_line2: "",

            city: "",

            state: "",

            country: "India",

            postal_code: "",

            is_default: false,

        });

        // =====================================
    // LOAD ADDRESSES
    // =====================================

    useEffect(() => {

        if (!token) {

            navigate("/login");

            return;

        }

        fetchAddresses();

    }, []);

    // =====================================
    // FETCH ADDRESS LIST
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

            setAddresses(response.data);

            if (response.data.length > 0) {

                const defaultAddress =
                    response.data.find(
                        item => item.is_default
                    );

                if (defaultAddress) {

                    setSelectedAddress(defaultAddress.id);

                }

                else {

                    setSelectedAddress(
                        response.data[0].id
                    );

                }

            }

        }

        catch (error) {

            console.log(error);

        }

        finally {

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

            checked

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
    // SAVE ADDRESS
    // =====================================

    const saveAddress = async () => {

        try {

            const response = await axios.post(

                "http://127.0.0.1:8000/api/accounts/addresses/",

                addressForm,

                {

                    headers: {

                        Authorization: `Bearer ${token}`,

                    },

                }

            );

            alert("Address added successfully.");

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

                is_default: false,

            });

            await fetchAddresses();

            if (response.data.id) {

                setSelectedAddress(response.data.id);

            }

        }

        catch (error) {

            console.log(error);

            if (error.response) {

                alert(

                    error.response.data.message ||

                    JSON.stringify(error.response.data)

                );

            }

            else {

                alert("Unable to save address.");

            }

        }

    };

    // =====================================
    // DELETE ADDRESS
    // =====================================

    const deleteAddress = async (id) => {

        const confirmDelete = window.confirm(

            "Are you sure you want to delete this address?"

        );

        if (!confirmDelete) {

            return;

        }

        try {

            await axios.delete(

                `http://127.0.0.1:8000/api/accounts/addresses/${id}/`,

                {

                    headers: {

                        Authorization: `Bearer ${token}`,

                    },

                }

            );

            alert("Address deleted successfully.");

            await fetchAddresses();

        }

        catch (error) {

            console.log(error);

            alert("Unable to delete address.");

        }

    };

    // =====================================
    // PLACE ORDER
    // =====================================

    const placeOrder = async () => {

        if (!selectedAddress) {

            alert("Please select a delivery address.");

            return;

        }

        setLoading(true);

        try {

            // BUY NOW

            if (checkoutType === "buy_now") {

                await axios.post(

                    "http://127.0.0.1:8000/api/orders/place/",

                    {

                        product_id: product.id,

                        quantity: product.quantity,

                        shipping_address: selectedAddress,

                        payment_method: paymentMethod,

                        coupon_code: couponCode,

                        subtotal: subtotal,

                        shipping_charge: shipping,

                        discount_amount: couponDiscount,

                        total_amount: finalAmount



                    },

                    {

                        headers: {

                            Authorization: `Bearer ${token}`,

                        },

                    }

                );

            }

            // CART CHECKOUT

            else {

                await axios.post(

                    "http://127.0.0.1:8000/api/orders/place-cart/",

                    {

                        shipping_address: selectedAddress,

                        payment_method: paymentMethod,

                        coupon_code: couponCode,

                        subtotal: subtotal,

                        shipping_charge: shipping,

                        discount_amount: couponDiscount,

                        total_amount: finalAmount

                    },

                    {

                        headers: {

                            Authorization: `Bearer ${token}`,

                        },

                    }

                );

            }

            alert("Order placed successfully!");

            navigate("/orders");

        }

        catch (error) {

            console.log(error);

            if (error.response) {

                alert(

                    error.response.data.message ||

                    JSON.stringify(error.response.data)

                );

            }

            else {

                alert("Server not responding.");

            }

        }

        finally {

            setLoading(false);

        }

    };

     // Coupon
    const [couponCode, setCouponCode] = useState("");
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [finalAmount, setFinalAmount] = useState(total);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponMessage, setCouponMessage] = useState("");
    const applyCoupon = async () => {

        if (!couponCode.trim()) {
            alert("Please enter a coupon code.");
            return;
        }

        setCouponLoading(true);

        try {

            const response = await axios.post(

                "http://127.0.0.1:8000/api/coupons/apply/",

                {
                    code: couponCode,
                    cart_total:total
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            setAppliedCoupon(response.data.coupon);
            setCouponDiscount(response.data.discount);
            setFinalAmount(response.data.final_total);

            setCouponMessage("Coupon applied successfully.");

        }

        catch (error) {

            setAppliedCoupon(null);
            setCouponDiscount(0);
            setFinalAmount(total);

            setCouponMessage(

                error.response?.data?.message ||

                "Unable to apply coupon."

            );

        }

        finally {

            setCouponLoading(false);

        }

    };

    // =====================================
    // JSX
    // =====================================

    return (

        <div className="payment-page">

            <div className="container py-5">

                <div className="row g-4">

                    {/* LEFT SIDE */}

                    <div className="col-lg-8">

                        <div className="premium-card">

                            <div className="d-flex justify-content-between align-items-center mb-3">

                                <h3 className="section-title">

                                    Delivery Address

                                </h3>
                                    {

                                addresses.length > 0 && (

                                    <button

                                        className="btn btn-primary"

                                        onClick={() =>
                                            setShowAddressForm(!showAddressForm)
                                        }

                                    >

                                        {

                                            showAddressForm
                                                ? "Cancel"
                                                : "Add New Address"

                                        }

                                    </button>

                                )

                            }

                        </div>

                        {

                            loadingAddress ? (

                                <p>Loading addresses...</p>

                            ) : (

                                <>

                                    {

                                        addresses.length === 0 &&
                                        !showAddressForm && (

                                            <div>

                                                <p>

                                                    No saved address found.

                                                </p>

                                                <button

                                                    className="btn btn-primary"

                                                    onClick={() =>
                                                        setShowAddressForm(true)
                                                    }

                                                >

                                                    Add Address

                                                </button>

                                            </div>

                                        )

                                    }

                                    {

                                        addresses.map((item) => (

                                            <div

                                                key={item.id}

                                                className="address-card border rounded p-3 mb-3"

                                            >

                                                <div className="d-flex justify-content-between align-items-start">

                                                    <label>

                                                        <input

                                                            type="radio"

                                                            name="shippingAddress"

                                                            checked={
                                                                selectedAddress === item.id
                                                            }

                                                            onChange={() =>
                                                                setSelectedAddress(item.id)
                                                            }

                                                        />

                                                        <strong className="ms-2">

                                                            {item.full_name}

                                                        </strong>

                                                        {

                                                            item.is_default && (

                                                                <span className="badge bg-success ms-2">

                                                                    Default

                                                                </span>

                                                            )

                                                        }

                                                    </label>

                                                    <button

                                                        className="btn btn-danger btn-sm"

                                                        onClick={() =>
                                                            deleteAddress(item.id)
                                                        }

                                                    >

                                                        Delete

                                                    </button>

                                                </div>

                                                <p>

                                                    {item.address_line1}

                                                </p>

                                                {

                                                    item.address_line2 && (

                                                        <p>

                                                            {item.address_line2}

                                                        </p>

                                                    )

                                                }

                                                <p>

                                                    {item.city},

                                                    {" "}

                                                    {item.state}

                                                    {" - "}

                                                    {item.postal_code}

                                                </p>

                                                <p>

                                                    📞 {item.phone_number}

                                                </p>

                                            </div>

                                        ))

                                    }

                                    {

                                        showAddressForm && (

                                            <div className="address-form mt-4">

                                                <hr />

                                                <h4 className="mb-3">

                                                    Add New Address

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

                                                        placeholder="Address Line 2"

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

                                                <div className="form-check mb-3">

                                                    <input

                                                        type="checkbox"

                                                        className="form-check-input"

                                                        name="is_default"

                                                        checked={addressForm.is_default}

                                                        onChange={handleAddressChange}

                                                    />

                                                    <label className="form-check-label">

                                                        Set as Default Address

                                                    </label>

                                                </div>

                                                <div className="d-flex gap-2">

                                                    <button

                                                        className="btn btn-success"

                                                        onClick={saveAddress}

                                                    >

                                                        Save Address

                                                    </button>

                                                    <button

                                                        className="btn btn-secondary"

                                                        onClick={() =>
                                                            setShowAddressForm(false)
                                                        }

                                                    >

                                                        Cancel

                                                    </button>

                                                </div>

                                            </div>

                                        )

                                    }

                                </>

                            )

                        }

                    </div>

                    {/* ===========================
                        PAYMENT METHOD
                    =========================== */}

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
                                        paymentMethod === "Credit Card"
                                    }

                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
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
                                        setPaymentMethod(e.target.value)
                                    }

                                />

                                <FaWallet className="payment-icon" />

                                <span>

                                    UPI Payment

                                </span>

                            </label>
                                    {/* NET BANKING */}

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
                                        paymentMethod === "Net Banking"
                                    }

                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }

                                />

                                <FaUniversity className="payment-icon" />

                                <span>

                                    Net Banking

                                </span>

                            </label>

                            {/* CASH ON DELIVERY */}

                            <label

                                className={
                                    paymentMethod === "Cash on Delivery"
                                        ? "payment-option active"
                                        : "payment-option"
                                }

                            >

                                <input

                                    type="radio"

                                    value="Cash on Delivery"

                                    checked={
                                        paymentMethod === "Cash on Delivery"
                                    }

                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
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

                {/* ===========================
                    RIGHT SIDE
                =========================== */}

                <div className="col-lg-4">

                    <div className="premium-summary">

                        <h3 className="summary-title">

                            Order Summary

                        </h3>
                        <div className="coupon-box">

                            <label className="coupon-title">
                                Have a Coupon?
                            </label>

                            <div className="coupon-input">

                                <input

                                    type="text"

                                    placeholder="Enter Coupon Code"

                                    value={couponCode}

                                    onChange={(e) =>
                                        setCouponCode(e.target.value.toUpperCase())
                                    }

                                />

                                <button

                                    onClick={applyCoupon}

                                    disabled={couponLoading}

                                >

                                    {
                                        couponLoading
                                            ? "Applying..."
                                            : "Apply"
                                    }

                                </button>

                            </div>

                            {
                                couponMessage && (

                                    <p

                                        style={{
                                            color: appliedCoupon ? "green" : "red",
                                            marginTop: "8px"
                                        }}

                                    >
                                        {couponMessage}
                                    </p>

                                )
                            }

                        </div>
                        <div className="summary-products">

                            {

                                checkoutType === "buy_now"

                                    ?

                                    (

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

                                    )

                                    :

                                    (

                                        products.map((item) => (

                                            <div

                                                key={item.product_id}

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

                                    )

                            }

                        </div>

                        <hr />

                        <div className="summary-row">

                            <span>

                                Total Items

                            </span>

                            <span>

                                {totalItems}

                            </span>

                        </div>

                        <div className="summary-row">

                            <span>Subtotal</span>

                            <span>₹ {Number(subtotal).toFixed(2)}</span>

                        </div>

                        <div className="summary-row">

                            <span>Shipping</span>

                            <span>₹ {Number(shipping).toFixed(2)}</span>

                        </div>

                        {
                            couponDiscount > 0 && (

                                <div className="summary-row">

                                    <span>
                                        Coupon Discount
                                    </span>

                                    <span
                                        style={{ color: "green" }}
                                    >
                                        - ₹ {Number(couponDiscount).toFixed(2)}
                                    </span>

                                </div>

                            )
                        }

                        <hr />

                        <div className="summary-total">

                            <span>Total Amount</span>

                            <span>

                                ₹ {Number(finalAmount).toFixed(2)}

                            </span>

                        </div>

                        <button

                            className="place-order-btn"

                            onClick={placeOrder}

                            disabled={loading}

                        >

                            {

                                loading

                                    ? "Processing..."

                                    : "Place Order"

                            }

                        </button>
                                {/* ===========================
                            SECURE PAYMENT
                        =========================== */}

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

                        {/* ===========================
                            OFFERS
                        =========================== */}

                        <div className="offer-box">

                            <h6>

                                🎁 Special Offers

                            </h6>

                            <p>

                                💳 10% Instant Cashback on Credit Cards

                            </p>

                            <p>

                                ⚡ Flat ₹100 Cashback on UPI Payments

                            </p>

                            <p>

                                🛡️ 100% Secure Payment Guarantee

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