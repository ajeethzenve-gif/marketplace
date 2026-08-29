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
    FaCrown,
    FaMapMarkerAlt,
    FaTrash,
    FaStar,
    FaArrowRight,
    FaGift,
} from "react-icons/fa";

import "../styles/Payment.css";

function Payment() {
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem("access");

    // =====================================
    // API CONFIG
    // =====================================

    const API_BASE_URL = "http://127.0.0.1:8000";

    const WALLET_BALANCE_API_URL =
        `${API_BASE_URL}/api/wallet/balance/`;

    const WALLET_PAYMENT_API_URL =
        `${API_BASE_URL}/api/payments/wallet-pay/`;

    // =====================================
    // GET CHECKOUT DATA
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
    // PAYMENT STATES
    // =====================================

    const [paymentMethod, setPaymentMethod] =
        useState("Cash on Delivery");

    const [loading, setLoading] =
        useState(false);

    // =====================================
    // ADDRESS STATES
    // =====================================

    const [loadingAddress, setLoadingAddress] =
        useState(true);

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
    // MEMBERSHIP STATES
    // =====================================

    const [membershipLoading, setMembershipLoading] =
        useState(true);

    const [hasMembership, setHasMembership] =
        useState(false);

    const [membershipPlan, setMembershipPlan] =
        useState(null);

    const [
        membershipDiscountPercentage,
        setMembershipDiscountPercentage,
    ] = useState(0);

    const [
        membershipDiscountAmount,
        setMembershipDiscountAmount,
    ] = useState(0);

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
    // WALLET STATES
    // =====================================

    const [walletBalance, setWalletBalance] =
        useState(0);

    const [walletLoading, setWalletLoading] =
        useState(true);

    // =====================================
    // CALCULATE MEMBERSHIP DISCOUNT
    // =====================================

    const calculateMembershipDiscount = (
        percentage,
        subtotalAmount
    ) => {
        const discountPercentage =
            Number(percentage) || 0;

        const subtotalValue =
            Number(subtotalAmount) || 0;

        if (
            discountPercentage <= 0 ||
            subtotalValue <= 0
        ) {
            return 0;
        }

        return (
            subtotalValue *
            discountPercentage /
            100
        );
    };

    // =====================================
    // CALCULATE FINAL TOTAL
    // =====================================

    const calculateFinalAmount = (
        membershipDiscount,
        couponDiscountValue
    ) => {
        const subtotalValue =
            Number(subtotal) || 0;

        const shippingValue =
            Number(shipping) || 0;

        const membershipValue =
            Number(membershipDiscount) || 0;

        const couponValue =
            Number(couponDiscountValue) || 0;

        return Math.max(
            0,
            subtotalValue +
            shippingValue -
            membershipValue -
            couponValue
        );
    };

    // =====================================
    // CHECK LOGIN + LOAD DATA
    // =====================================

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        fetchAddresses();
        fetchMembership();
        fetchWalletBalance();
    }, [token, navigate]);

    // =====================================
    // LOAD CURRENT CUSTOMER MEMBERSHIP
    // =====================================

    const fetchMembership = async () => {
        setMembershipLoading(true);

        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/membership/my-membership/`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data =
                response.data || {};

            console.log(
                "Current customer membership:",
                data
            );

            if (
                !data.has_membership ||
                !data.membership
            ) {
                setHasMembership(false);
                setMembershipPlan(null);
                setMembershipDiscountPercentage(0);
                setMembershipDiscountAmount(0);

                return;
            }

            const membership =
                data.membership;

            const discountPercentage =
                Number(
                    data.discount_percentage ??
                    data.plan?.discount_percentage ??
                    membership.plan?.discount_percentage ??
                    membership.discount_percentage ??
                    0
                );

            setHasMembership(true);

            setMembershipPlan(
                membership
            );

            setMembershipDiscountPercentage(
                discountPercentage
            );

            const discountAmount =
                calculateMembershipDiscount(
                    discountPercentage,
                    subtotal
                );

            setMembershipDiscountAmount(
                discountAmount
            );

            const newFinalAmount =
                calculateFinalAmount(
                    discountAmount,
                    couponDiscount
                );

            setFinalAmount(
                newFinalAmount
            );

        } catch (error) {
            console.error(
                "Membership loading error:",
                error.response?.data ||
                error.message
            );

            setHasMembership(false);
            setMembershipPlan(null);
            setMembershipDiscountPercentage(0);
            setMembershipDiscountAmount(0);

            setFinalAmount(
                calculateFinalAmount(
                    0,
                    couponDiscount
                )
            );

        } finally {
            setMembershipLoading(false);
        }
    };

    // =====================================
    // LOAD WALLET BALANCE
    // =====================================

    const fetchWalletBalance = async () => {
        setWalletLoading(true);

        try {
            const response =
                await axios.get(
                    WALLET_BALANCE_API_URL,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const balance =
                Number(
                    response.data?.balance ??
                    response.data?.wallet_balance ??
                    response.data?.amount ??
                    0
                );

            setWalletBalance(
                Math.max(0, balance)
            );

        } catch (error) {
            console.error(
                "Wallet balance loading error:",
                error.response?.data ||
                error.message
            );

            setWalletBalance(0);

        } finally {
            setWalletLoading(false);
        }
    };

    // =====================================
    // RECALCULATE WHEN TOTAL CHANGES
    // =====================================

    useEffect(() => {
        const membershipDiscount =
            calculateMembershipDiscount(
                membershipDiscountPercentage,
                subtotal
            );

        setMembershipDiscountAmount(
            membershipDiscount
        );

        const newFinalAmount =
            calculateFinalAmount(
                membershipDiscount,
                couponDiscount
            );

        setFinalAmount(
            newFinalAmount
        );

    }, [
        subtotal,
        shipping,
        membershipDiscountPercentage,
        couponDiscount,
    ]);

    // =====================================
    // LOAD RAZORPAY
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

            document.body.appendChild(
                script
            );
        });
    };

    // =====================================
    // FETCH DEFAULT ADDRESS
    // =====================================

    const fetchAddresses = async () => {
        setLoadingAddress(true);

        try {
            const response =
                await axios.get(
                    `${API_BASE_URL}/api/accounts/addresses/`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const addressData =
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || [];

            const defaultAddress =
                addressData.find(
                    (item) =>
                        item.is_default === true
                );

            if (defaultAddress) {
                setAddresses([
                    defaultAddress,
                ]);

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
                error.response?.data ||
                error.message
            );

            setAddresses([]);
            setSelectedAddress(null);

        } finally {
            setLoadingAddress(false);
        }
    };

    // =====================================
    // ADDRESS INPUT
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
    // SAVE ADDRESS
    // =====================================

    const saveAddress = async () => {
        if (
            !addressForm.full_name.trim() ||
            !addressForm.phone_number.trim() ||
            !addressForm.address_line1.trim() ||
            !addressForm.city.trim() ||
            !addressForm.state.trim() ||
            !addressForm.postal_code.trim()
        ) {
            alert(
                "Please fill all required address fields."
            );

            return;
        }

        try {
            const dataToSend = {
                ...addressForm,

                full_name:
                    addressForm.full_name.trim(),

                phone_number:
                    addressForm.phone_number.trim(),

                address_line1:
                    addressForm.address_line1.trim(),

                address_line2:
                    addressForm.address_line2.trim(),

                city:
                    addressForm.city.trim(),

                state:
                    addressForm.state.trim(),

                country:
                    addressForm.country.trim() ||
                    "India",

                postal_code:
                    addressForm.postal_code.trim(),

                is_default: true,
            };

            const response =
                await axios.post(
                    `${API_BASE_URL}/api/accounts/addresses/`,
                    dataToSend,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json",
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
                error.response?.data ||
                error.message
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
    // DELETE ADDRESS
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
                `${API_BASE_URL}/api/accounts/addresses/${id}/`,
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
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                error.response?.data?.detail ||
                "Unable to delete address."
            );
        }
    };

    // =====================================
    // CLEAR CART
    // =====================================

    const clearCartAfterOrder = async () => {
        try {
            const response =
                await axios.get(
                    `${API_BASE_URL}/api/cart/`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            let cartItems = [];

            if (Array.isArray(response.data)) {
                cartItems =
                    response.data;

            } else if (
                Array.isArray(
                    response.data.results
                )
            ) {
                cartItems =
                    response.data.results;

            } else if (
                Array.isArray(
                    response.data.items
                )
            ) {
                cartItems =
                    response.data.items;

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
                    cartItems.map(
                        async (item) => {
                            const productId =
                                item.product_id ||
                                item.product?.id ||
                                item.id;

                            if (!productId) {
                                return;
                            }

                            try {
                                await axios.delete(
                                    `${API_BASE_URL}/api/cart/remove/${productId}/`,
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
                        }
                    )
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
            const response =
                await axios.post(
                    `${API_BASE_URL}/api/coupons/apply/`,
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

            setAppliedCoupon(
                response.data.coupon
            );

            setCouponDiscount(
                discount
            );

            const newFinalAmount =
                calculateFinalAmount(
                    membershipDiscountAmount,
                    discount
                );

            setFinalAmount(
                newFinalAmount
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
                calculateFinalAmount(
                    membershipDiscountAmount,
                    0
                )
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

        setFinalAmount(
            calculateFinalAmount(
                membershipDiscountAmount,
                0
            )
        );

        setCouponMessage("");
    };

    // =====================================
    // RAZORPAY PAYMENT
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

            const orderResponse =
                await axios.post(
                    `${API_BASE_URL}/api/payments/create-order/`,
                    {
                        amount:
                            Number(finalAmount),

                        currency:
                            "INR",
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const data =
                orderResponse.data;

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

            const selectedMethod =
                paymentMethod;

            const options = {
                key:
                    data.key,

                amount:
                    data.amount,

                currency:
                    data.currency || "INR",

                name:
                    "Zenve MarketPlace",

                description:
                    `Order Payment - ${selectedMethod}`,

                order_id:
                    data.razorpay_order_id,

                handler:
                    async function (
                        razorpayResponse
                    ) {
                        try {
                            const verifyResponse =
                                await axios.post(
                                    `${API_BASE_URL}/api/payments/verify/`,
                                    {
                                        razorpay_payment_id:
                                            razorpayResponse
                                                .razorpay_payment_id,

                                        razorpay_order_id:
                                            razorpayResponse
                                                .razorpay_order_id,

                                        razorpay_signature:
                                            razorpayResponse
                                                .razorpay_signature,

                                        checkout_type:
                                            checkoutType,

                                        shipping_address:
                                            selectedAddress,

                                        payment_method:
                                            selectedMethod,

                                        coupon_code:
                                            appliedCoupon
                                                ? couponCode
                                                : null,

                                        subtotal:
                                            Number(
                                                subtotal
                                            ),

                                        shipping_charge:
                                            Number(
                                                shipping
                                            ),

                                        membership_discount_percentage:
                                            Number(
                                                membershipDiscountPercentage
                                            ),

                                        membership_discount_amount:
                                            Number(
                                                membershipDiscountAmount
                                            ),

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
                    ondismiss:
                        function () {
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
                        checkoutType ||
                        "cart",

                    payment_method:
                        selectedMethod,

                    shipping_address:
                        selectedAddress,
                },

                theme: {
                    color:
                        "#5b4bdb",
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
                        "Razorpay payment failed:",
                        response.error
                    );

                    alert(
                        response.error?.description ||
                        "Payment failed. Please try again."
                    );

                    setLoading(false);
                }
            );

            razorpay.open();

        } catch (error) {
            console.error(
                "Razorpay error:",
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
    // WALLET PAYMENT
    // =====================================

    const handleWalletPayment = async () => {
        if (!selectedAddress) {
            alert(
                "Please add a default delivery address."
            );

            return;
        }

        const orderAmount =
            Number(finalAmount) || 0;

        const currentWalletBalance =
            Number(walletBalance) || 0;

        if (
            currentWalletBalance <
            orderAmount
        ) {
            alert(
                `Insufficient wallet balance.\n\nWallet Balance: ₹${currentWalletBalance.toFixed(
                    2
                )}\nOrder Total: ₹${orderAmount.toFixed(
                    2
                )}`
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

        if (loading) {
            return;
        }

        setLoading(true);

        try {
            const response =
                await axios.post(
                    WALLET_PAYMENT_API_URL,
                    {
                        checkout_type:
                            checkoutType,

                        shipping_address:
                            selectedAddress,

                        payment_method:
                            "Wallet",

                        coupon_code:
                            appliedCoupon
                                ? couponCode
                                : null,

                        subtotal:
                            Number(subtotal),

                        shipping_charge:
                            Number(shipping),

                        membership_discount_percentage:
                            Number(
                                membershipDiscountPercentage
                            ),

                        membership_discount_amount:
                            Number(
                                membershipDiscountAmount
                            ),

                        discount_amount:
                            Number(
                                couponDiscount
                            ),

                        total_amount:
                            orderAmount,

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
                "Wallet payment response:",
                response.data
            );

            if (
                checkoutType !==
                "buy_now"
            ) {
                await clearCartAfterOrder();
            }

            // Refresh balance after payment
            await fetchWalletBalance();

            alert(
                response.data?.message ||
                "Payment successful! Order placed successfully using your wallet."
            );

            navigate(
                "/orders",
                {
                    replace: true,
                }
            );

        } catch (error) {
            console.error(
                "Wallet payment error:",
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                error.response?.data?.detail ||
                "Unable to complete wallet payment."
            );

        } finally {
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
        // WALLET
        // =====================================

        if (
            paymentMethod === "Wallet"
        ) {
            await handleWalletPayment();
            return;
        }

        // =====================================
        // UPI
        // =====================================

        if (
            paymentMethod === "UPI"
        ) {
            await handleRazorpayPayment();
            return;
        }

        // =====================================
        // BUY NOW
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
        // CART
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

            if (
                checkoutType ===
                "buy_now"
            ) {
                await axios.post(
                    `${API_BASE_URL}/api/orders/place/`,
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

                        membership_discount_percentage:
                            Number(
                                membershipDiscountPercentage
                            ),

                        membership_discount_amount:
                            Number(
                                membershipDiscountAmount
                            ),

                        discount_amount:
                            Number(
                                couponDiscount
                            ),

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
                    `${API_BASE_URL}/api/orders/place-cart/`,
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

                        membership_discount_percentage:
                            Number(
                                membershipDiscountPercentage
                            ),

                        membership_discount_amount:
                            Number(
                                membershipDiscountAmount
                            ),

                        discount_amount:
                            Number(
                                couponDiscount
                            ),

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

            navigate(
                "/orders",
                {
                    replace: true,
                }
            );

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
    // MEMBERSHIP PLAN NAME
    // =====================================

    const getMembershipPlanName = () => {
        if (!membershipPlan) {
            return "Zenve Premium";
        }

        return (
            membershipPlan.plan_name ||
            membershipPlan.name ||
            membershipPlan.plan?.name ||
            "Zenve Premium"
        );
    };

    // =====================================
    // WALLET CAN PAY
    // =====================================

    const walletCanPay =
        Number(walletBalance) >=
        Number(finalAmount);

    // =====================================
    // JSX
    // =====================================

    return (
        <div className="payment-page">

            <div className="container py-5">

                <div className="row g-4">

                    {/* =================================================
                        LEFT SIDE
                    ================================================= */}

                    <div className="col-lg-8">

                        {/* =================================================
                            PAYMENT METHOD
                        ================================================= */}

                        <div className="premium-card payment-method-card">

                            <div className="section-heading">

                                <div className="heading-icon">
                                    <FaWallet />
                                </div>

                                <div>
                                    <span>
                                        CHECKOUT
                                    </span>

                                    <h3>
                                        Select Payment Method
                                    </h3>
                                </div>

                            </div>

                            <div className="payment-options">

                                {/* CREDIT CARD */}

                                <label
                                    className={
                                        paymentMethod ===
                                        "Credit Card"
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

                                    <div className="payment-option-icon">
                                        <FaCreditCard />
                                    </div>

                                    <div>
                                        <strong>
                                            Credit / Debit Card
                                        </strong>

                                        <small>
                                            Pay securely using your card
                                        </small>
                                    </div>

                                </label>

                                {/* UPI */}

                                <label
                                    className={
                                        paymentMethod ===
                                        "UPI"
                                            ? "payment-option active"
                                            : "payment-option"
                                    }
                                >

                                    <input
                                        type="radio"
                                        value="UPI"
                                        checked={
                                            paymentMethod ===
                                            "UPI"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <div className="payment-option-icon">
                                        <FaWallet />
                                    </div>

                                    <div>
                                        <strong>
                                            UPI Payment
                                        </strong>

                                        <small>
                                            Google Pay, PhonePe, Paytm and more
                                        </small>
                                    </div>

                                </label>

                                {/* WALLET */}

                                <label
                                    className={
                                        paymentMethod ===
                                        "Wallet"
                                            ? "payment-option active wallet-payment-option"
                                            : "payment-option wallet-payment-option"
                                    }
                                >

                                    <input
                                        type="radio"
                                        value="Wallet"
                                        checked={
                                            paymentMethod ===
                                            "Wallet"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <div className="payment-option-icon wallet-icon">
                                        <FaWallet />
                                    </div>

                                    <div className="wallet-payment-info">

                                        <strong>
                                            Zenve Wallet
                                        </strong>

                                        <small>
                                            {walletLoading
                                                ? "Checking balance..."
                                                : `Available Balance: ₹${Number(
                                                    walletBalance
                                                ).toFixed(2)}`
                                            }
                                        </small>

                                    </div>

                                    {paymentMethod ===
                                        "Wallet" && (
                                        <span
                                            className={
                                                walletCanPay
                                                    ? "wallet-option-status available"
                                                    : "wallet-option-status insufficient"
                                            }
                                        >
                                            {walletCanPay
                                                ? "Available"
                                                : "Insufficient"
                                            }
                                        </span>
                                    )}

                                </label>

                                {/* NET BANKING */}

                                <label
                                    className={
                                        paymentMethod ===
                                        "Net Banking"
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

                                    <div className="payment-option-icon">
                                        <FaUniversity />
                                    </div>

                                    <div>
                                        <strong>
                                            Net Banking
                                        </strong>

                                        <small>
                                            Pay directly through your bank
                                        </small>
                                    </div>

                                </label>

                                {/* COD */}

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

                                    <div className="payment-option-icon">
                                        <FaMoneyBillWave />
                                    </div>

                                    <div>
                                        <strong>
                                            Cash on Delivery
                                        </strong>

                                        <small>
                                            Pay when your order arrives
                                        </small>
                                    </div>

                                </label>

                            </div>

                        </div>

                        {/* =================================================
                            DELIVERY ADDRESS
                        ================================================= */}

                        <div className="premium-card address-section">

                            <div className="section-heading">

                                <div className="heading-icon">
                                    <FaMapMarkerAlt />
                                </div>

                                <div>
                                    <span>
                                        DELIVERY
                                    </span>

                                    <h3>
                                        Delivery Address
                                    </h3>
                                </div>

                            </div>

                            {loadingAddress ? (

                                <div className="address-loader">
                                    Loading your address...
                                </div>

                            ) : (

                                <>

                                    {addresses.map(
                                        (item) => (

                                            <div
                                                key={item.id}
                                                className="selected-address-card"
                                            >

                                                <div className="address-top">

                                                    <div className="address-name">

                                                        <FaMapMarkerAlt />

                                                        <strong>
                                                            {item.full_name}
                                                        </strong>

                                                        <span className="default-badge">

                                                            <FaStar />

                                                            Default

                                                        </span>

                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="delete-address-btn"
                                                        onClick={() =>
                                                            deleteAddress(
                                                                item.id
                                                            )
                                                        }
                                                    >

                                                        <FaTrash />

                                                        Delete

                                                    </button>

                                                </div>

                                                <div className="address-content">

                                                    <p>
                                                        {item.address_line1}
                                                    </p>

                                                    {item.address_line2 && (
                                                        <p>
                                                            {item.address_line2}
                                                        </p>
                                                    )}

                                                    <p>
                                                        {item.city},{" "}
                                                        {item.state}
                                                        {" - "}
                                                        {item.postal_code}
                                                    </p>

                                                    <p>
                                                        {item.country}
                                                    </p>

                                                    <p className="phone-line">
                                                        📞{" "}
                                                        {item.phone_number}
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                                    {addresses.length === 0 &&
                                        !showAddressForm && (

                                        <div className="no-address-box">

                                            <FaMapMarkerAlt />

                                            <h4>
                                                No Default Address
                                            </h4>

                                            <p>
                                                Add a delivery address
                                                before placing your order.
                                            </p>

                                            <button
                                                type="button"
                                                className="add-address-main-btn"
                                                onClick={() =>
                                                    setShowAddressForm(
                                                        true
                                                    )
                                                }
                                            >
                                                + Add Default Address
                                            </button>

                                        </div>

                                    )}

                                    {showAddressForm && (

                                        <div className="address-form">

                                            <div className="form-header">

                                                <div>

                                                    <h4>
                                                        Add Default Address
                                                    </h4>

                                                    <p>
                                                        Enter your delivery details
                                                    </p>

                                                </div>

                                            </div>

                                            <div className="row">

                                                <div className="col-md-6 mb-3">

                                                    <label>
                                                        Full Name *
                                                    </label>

                                                    <input
                                                        type="text"
                                                        name="full_name"
                                                        className="form-control"
                                                        placeholder="Full Name"
                                                        value={
                                                            addressForm.full_name
                                                        }
                                                        onChange={
                                                            handleAddressChange
                                                        }
                                                    />

                                                </div>

                                                <div className="col-md-6 mb-3">

                                                    <label>
                                                        Phone Number *
                                                    </label>

                                                    <input
                                                        type="text"
                                                        name="phone_number"
                                                        className="form-control"
                                                        placeholder="Phone Number"
                                                        value={
                                                            addressForm.phone_number
                                                        }
                                                        onChange={
                                                            handleAddressChange
                                                        }
                                                    />

                                                </div>

                                            </div>

                                            <div className="mb-3">

                                                <label>
                                                    Address Line 1 *
                                                </label>

                                                <input
                                                    type="text"
                                                    name="address_line1"
                                                    className="form-control"
                                                    placeholder="House number, street, area"
                                                    value={
                                                        addressForm.address_line1
                                                    }
                                                    onChange={
                                                        handleAddressChange
                                                    }
                                                />

                                            </div>

                                            <div className="mb-3">

                                                <label>
                                                    Address Line 2
                                                </label>

                                                <input
                                                    type="text"
                                                    name="address_line2"
                                                    className="form-control"
                                                    placeholder="Apartment, landmark"
                                                    value={
                                                        addressForm.address_line2
                                                    }
                                                    onChange={
                                                        handleAddressChange
                                                    }
                                                />

                                            </div>

                                            <div className="row">

                                                <div className="col-md-4 mb-3">

                                                    <label>
                                                        City *
                                                    </label>

                                                    <input
                                                        type="text"
                                                        name="city"
                                                        className="form-control"
                                                        placeholder="City"
                                                        value={
                                                            addressForm.city
                                                        }
                                                        onChange={
                                                            handleAddressChange
                                                        }
                                                    />

                                                </div>

                                                <div className="col-md-4 mb-3">

                                                    <label>
                                                        State *
                                                    </label>

                                                    <input
                                                        type="text"
                                                        name="state"
                                                        className="form-control"
                                                        placeholder="State"
                                                        value={
                                                            addressForm.state
                                                        }
                                                        onChange={
                                                            handleAddressChange
                                                        }
                                                    />

                                                </div>

                                                <div className="col-md-4 mb-3">

                                                    <label>
                                                        Postal Code *
                                                    </label>

                                                    <input
                                                        type="text"
                                                        name="postal_code"
                                                        className="form-control"
                                                        placeholder="Postal Code"
                                                        value={
                                                            addressForm.postal_code
                                                        }
                                                        onChange={
                                                            handleAddressChange
                                                        }
                                                    />

                                                </div>

                                            </div>

                                            <div className="mb-3">

                                                <label>
                                                    Country
                                                </label>

                                                <input
                                                    type="text"
                                                    name="country"
                                                    className="form-control"
                                                    value={
                                                        addressForm.country
                                                    }
                                                    onChange={
                                                        handleAddressChange
                                                    }
                                                />

                                            </div>

                                            <div className="address-form-buttons">

                                                <button
                                                    type="button"
                                                    className="cancel-address-btn"
                                                    onClick={() =>
                                                        setShowAddressForm(
                                                            false
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="button"
                                                    className="save-address-btn"
                                                    onClick={
                                                        saveAddress
                                                    }
                                                >
                                                    Save Address
                                                    <FaArrowRight />
                                                </button>

                                            </div>

                                        </div>

                                    )}

                                </>

                            )}

                        </div>

                    </div>

                    {/* =================================================
                        RIGHT SIDE
                    ================================================= */}

                    <div className="col-lg-4">

                        <div className="premium-summary">

                            {/* =================================================
                                COUPON
                            ================================================= */}

                            <div className="coupon-section">

                                <div className="coupon-header">

                                    <FaGift />

                                    <div>

                                        <strong>
                                            Have a Coupon?
                                        </strong>

                                        <small>
                                            Save more on your order
                                        </small>

                                    </div>

                                </div>

                                <div className="coupon-input">

                                    <input
                                        type="text"
                                        placeholder="Enter coupon code"
                                        value={couponCode}
                                        disabled={
                                            !!appliedCoupon
                                        }
                                        onChange={(e) =>
                                            setCouponCode(
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                    />

                                    {!appliedCoupon ? (

                                        <button
                                            type="button"
                                            onClick={
                                                applyCoupon
                                            }
                                            disabled={
                                                couponLoading
                                            }
                                        >
                                            {couponLoading
                                                ? "..."
                                                : "Apply"}
                                        </button>

                                    ) : (

                                        <button
                                            type="button"
                                            onClick={
                                                removeCoupon
                                            }
                                        >
                                            Remove
                                        </button>

                                    )}

                                </div>

                                {couponMessage && (

                                    <p
                                        className={
                                            appliedCoupon
                                                ? "coupon-success"
                                                : "coupon-error"
                                        }
                                    >
                                        {couponMessage}
                                    </p>

                                )}

                            </div>

                            {/* =================================================
                                SUMMARY TITLE
                            ================================================= */}

                            <div className="summary-heading">

                                <div>

                                    <span>
                                        YOUR ORDER
                                    </span>

                                    <h3>
                                        Order Summary
                                    </h3>

                                </div>

                            </div>

                            {/* =================================================
                                MEMBERSHIP
                            ================================================= */}

                            {membershipLoading ? (

                                <div className="membership-loading">
                                    Checking membership...
                                </div>

                            ) : hasMembership ? (

                                <div className="membership-ad active-membership">

                                    <div className="membership-ad-icon">
                                        <FaCrown />
                                    </div>

                                    <div className="membership-ad-content">

                                        <span className="membership-ad-label">
                                            MEMBER BENEFIT
                                        </span>

                                        <h4>
                                            {getMembershipPlanName()}
                                        </h4>

                                        <p>
                                            You saved{" "}
                                            <strong>
                                                {membershipDiscountPercentage}%
                                            </strong>{" "}
                                            with your membership.
                                        </p>

                                    </div>

                                    <div className="membership-percent">
                                        {membershipDiscountPercentage}%
                                    </div>

                                </div>

                            ) : (

                                <div className="membership-ad">

                                    <div className="membership-ad-icon">
                                        <FaCrown />
                                    </div>

                                    <div className="membership-ad-content">

                                        <span className="membership-ad-label">
                                            ZENVE MEMBERSHIP
                                        </span>

                                        <h4>
                                            Save More With Membership
                                        </h4>

                                        <p>
                                            Unlock exclusive discounts
                                            and pet care benefits.
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    "/membership"
                                                )
                                            }
                                        >
                                            Explore Membership
                                            <FaArrowRight />
                                        </button>

                                    </div>

                                </div>

                            )}

                            {/* =================================================
                                WALLET BALANCE
                            ================================================= */}

                            <div className="wallet-summary-card">

                                <div className="wallet-summary-left">

                                    <div className="wallet-summary-icon">
                                        <FaWallet />
                                    </div>

                                    <div>

                                        <span className="wallet-summary-label">
                                            WALLET BALANCE
                                        </span>

                                        <h4>
                                            {walletLoading
                                                ? "Loading..."
                                                : `₹${Number(
                                                    walletBalance
                                                ).toFixed(2)}`
                                            }
                                        </h4>

                                    </div>

                                </div>

                                {paymentMethod ===
                                    "Wallet" && (

                                    <div
                                        className={
                                            walletCanPay
                                                ? "wallet-status available"
                                                : "wallet-status insufficient"
                                        }
                                    >
                                        {walletCanPay
                                            ? "Available"
                                            : "Insufficient"}
                                    </div>

                                )}

                            </div>

                            {/* =================================================
                                PRODUCTS
                            ================================================= */}

                            <div className="summary-products">

                                {checkoutType ===
                                "buy_now" ? (

                                    product && (

                                        <div className="summary-product">

                                            <span>
                                                {product.name}
                                            </span>

                                            <span>
                                                ×{" "}
                                                {
                                                    product.quantity
                                                }
                                            </span>

                                        </div>

                                    )

                                ) : (

                                    products.map(
                                        (item) => (

                                            <div
                                                key={
                                                    item.product_id ||
                                                    item.id
                                                }
                                                className="summary-product"
                                            >

                                                <span>
                                                    {
                                                        item.product_name
                                                    }
                                                </span>

                                                <span>
                                                    ×{" "}
                                                    {
                                                        item.quantity
                                                    }
                                                </span>

                                            </div>

                                        )
                                    )

                                )}

                            </div>

                            <hr />

                            {/* =================================================
                                TOTAL ITEMS
                            ================================================= */}

                            <div className="summary-row">

                                <span>
                                    Total Items
                                </span>

                                <span>
                                    {totalItems}
                                </span>

                            </div>

                            {/* =================================================
                                SUBTOTAL
                            ================================================= */}

                            <div className="summary-row">

                                <span>
                                    Subtotal
                                </span>

                                <span>
                                    ₹{" "}
                                    {Number(
                                        subtotal
                                    ).toFixed(2)}
                                </span>

                            </div>

                            {/* =================================================
                                SHIPPING
                            ================================================= */}

                            <div className="summary-row">

                                <span>
                                    Shipping
                                </span>

                                <span>
                                    ₹{" "}
                                    {Number(
                                        shipping
                                    ).toFixed(2)}
                                </span>

                            </div>

                            {/* =================================================
                                MEMBERSHIP DISCOUNT
                            ================================================= */}

                            {membershipDiscountAmount >
                                0 && (

                                <div className="summary-row discount-row">

                                    <span>
                                        <FaCrown />

                                        Membership Discount
                                        ({membershipDiscountPercentage}%)
                                    </span>

                                    <span>
                                        - ₹{" "}
                                        {Number(
                                            membershipDiscountAmount
                                        ).toFixed(2)}
                                    </span>

                                </div>

                            )}

                            {/* =================================================
                                COUPON DISCOUNT
                            ================================================= */}

                            {couponDiscount > 0 && (

                                <div className="summary-row discount-row coupon-discount-row">

                                    <span>
                                        <FaGift />

                                        Coupon Discount
                                    </span>

                                    <span>
                                        - ₹{" "}
                                        {Number(
                                            couponDiscount
                                        ).toFixed(2)}
                                    </span>

                                </div>

                            )}

                            <hr />

                            {/* =================================================
                                FINAL TOTAL
                            ================================================= */}

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

                            {/* =================================================
                                WALLET SHORTAGE
                            ================================================= */}

                            {paymentMethod ===
                                "Wallet" &&
                                !walletLoading &&
                                !walletCanPay && (

                                <div className="wallet-shortage-box">

                                    <FaWallet />

                                    <div>

                                        <strong>
                                            Insufficient Wallet Balance
                                        </strong>

                                        <p>
                                            You need ₹
                                            {(
                                                Number(
                                                    finalAmount
                                                ) -
                                                Number(
                                                    walletBalance
                                                )
                                            ).toFixed(2)}
                                            {" "}more in your wallet.
                                        </p>

                                    </div>

                                </div>

                            )}

                            {/* =================================================
                                PLACE ORDER
                            ================================================= */}

                            <button
                                type="button"
                                className="place-order-btn"
                                onClick={
                                    placeOrder
                                }
                                disabled={
                                    loading ||
                                    !selectedAddress ||
                                    (
                                        paymentMethod ===
                                        "Wallet" &&
                                        (
                                            walletLoading ||
                                            !walletCanPay
                                        )
                                    )
                                }
                            >

                                {loading

                                    ? "Processing..."

                                    : !selectedAddress

                                        ? "Add Default Address"

                                        : paymentMethod ===
                                          "UPI"

                                            ? `Pay ₹${Number(
                                                finalAmount
                                            ).toFixed(2)}`

                                            : paymentMethod ===
                                              "Wallet"

                                                ? `Pay ₹${Number(
                                                    finalAmount
                                                ).toFixed(2)} from Wallet`

                                                : "Place Order"

                                }

                            </button>

                            {/* =================================================
                                SECURITY
                            ================================================= */}

                            <div className="secure-box">

                                <div className="secure-item">

                                    <FaLock />

                                    <span>
                                        Secure SSL Checkout
                                    </span>

                                </div>

                                <div className="secure-item">

                                    <FaShieldAlt />

                                    <span>
                                        100% Safe Payment
                                    </span>

                                </div>

                                <div className="secure-item">

                                    <FaCheckCircle />

                                    <span>
                                        Easy Returns
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Payment;