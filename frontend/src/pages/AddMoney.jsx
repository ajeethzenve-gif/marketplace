import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    FaWallet,
    FaArrowLeft,
    FaRupeeSign,
    FaPlus,
    FaCheckCircle,
    FaShieldAlt,
    FaCreditCard,
} from "react-icons/fa";

import "../styles/AddMoney.css";


function AddMoney() {

    const navigate = useNavigate();

    // ==========================================
    // API CONFIG
    // ==========================================

    const API_BASE_URL = "http://127.0.0.1:8000";


    // ==========================================
    // STATES
    // ==========================================

    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // ==========================================
    // AUTH CONFIG
    // ==========================================

    const getAuthConfig = () => {

        const token = localStorage.getItem("access");

        if (!token) {
            throw new Error(
                "Authentication token is missing. Please login again."
            );
        }

        return {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };

    };


    // ==========================================
    // QUICK AMOUNT
    // ==========================================

    const selectAmount = (value) => {

        setAmount(value);
        setError("");

    };


    // ==========================================
    // LOAD RAZORPAY SCRIPT
    // ==========================================

    const loadRazorpay = () => {

        return new Promise((resolve) => {

            // Razorpay already loaded
            if (window.Razorpay) {

                console.log(
                    "Razorpay already loaded"
                );

                resolve(true);

                return;
            }


            // Check if script is already loading
            const existingScript =
                document.querySelector(
                    'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
                );


            if (existingScript) {

                existingScript.addEventListener(
                    "load",
                    () => {

                        console.log(
                            "Razorpay script loaded"
                        );

                        resolve(
                            Boolean(window.Razorpay)
                        );

                    }
                );


                existingScript.addEventListener(
                    "error",
                    () => {

                        console.error(
                            "Razorpay script failed to load"
                        );

                        resolve(false);

                    }
                );

                return;
            }

            // Create Razorpay script
            const script =
                document.createElement("script");


            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";


            script.async = true;


            script.onload = () => {

                console.log(
                    "Razorpay script loaded successfully"
                );


                resolve(
                    Boolean(window.Razorpay)
                );

            };


            script.onerror = () => {

                console.error(
                    "Unable to load Razorpay checkout script"
                );


                resolve(false);

            };


            document.body.appendChild(script);

        });

    };


    // ==========================================
    // ADD MONEY
    // ==========================================

    const handleAddMoney = async () => {

        // Clear previous error
        setError("");


        // ==========================================
        // AUTH CHECK
        // ==========================================

        const token =
            localStorage.getItem("access");


        if (!token) {

            setError(
                "Your session has expired. Please login again."
            );

            navigate("/login");

            return;

        }


        // ==========================================
        // AMOUNT
        // ==========================================

        const walletAmount =
            Number(amount);


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !walletAmount ||
            Number.isNaN(walletAmount)
        ) {

            setError(
                "Please enter an amount."
            );

            return;

        }


        if (walletAmount < 10) {

            setError(
                "Please enter an amount of at least ₹10."
            );

            return;

        }


        if (!Number.isInteger(walletAmount)) {

            setError(
                "Please enter a whole number amount."
            );

            return;

        }


        try {

            setLoading(true);


            // ==========================================
            // STEP 1
            // LOAD RAZORPAY
            // ==========================================

            console.log(
                "Step 1: Loading Razorpay..."
            );


            const razorpayLoaded =
                await loadRazorpay();


            if (!razorpayLoaded) {

                setError(
                    "Failed to load Razorpay. Please check your internet connection and disable any browser extension blocking Razorpay."
                );

                setLoading(false);

                return;

            }


            // ==========================================
            // STEP 2
            // CHECK RAZORPAY
            // ==========================================

            if (
                typeof window.Razorpay !==
                "function"
            ) {

                setError(
                    "Razorpay checkout is unavailable. Please refresh the page and try again."
                );

                setLoading(false);

                return;

            }


            console.log(
                "Step 2: Razorpay is ready."
            );


            // ==========================================
            // STEP 3
            // CREATE PAYMENT ORDER
            // ==========================================

            console.log(
                "Step 3: Creating Razorpay order..."
            );


            const response =
                await axios.post(

                    `${API_BASE_URL}/api/wallet/create-payment/`,

                    {
                        amount: walletAmount,
                    },

                    getAuthConfig()

                );


            console.log(
                "Create payment API response:",
                response.data
            );


            const data =
                response.data;


            // ==========================================
            // STEP 4
            // VALIDATE BACKEND RESPONSE
            // ==========================================

            if (!data) {

                throw new Error(
                    "Payment server returned an empty response."
                );

            }


            if (!data.key) {

                console.error(
                    "Razorpay key missing:",
                    data
                );

                throw new Error(
                    "Razorpay Key ID was not returned by the server."
                );

            }


            if (!data.razorpay_order_id) {

                console.error(
                    "Razorpay order ID missing:",
                    data
                );

                throw new Error(
                    "Razorpay Order ID was not returned by the server."
                );

            }


            if (!data.amount) {

                console.error(
                    "Razorpay amount missing:",
                    data
                );

                throw new Error(
                    "Payment amount was not returned by the server."
                );

            }


            // ==========================================
            // SECURITY CHECK
            // ==========================================

            if (
                typeof data.key !== "string"
            ) {

                throw new Error(
                    "Invalid Razorpay Key ID."
                );

            }


            if (
                !data.key.startsWith("rzp_")
            ) {

                console.error(
                    "Invalid Razorpay key:",
                    data.key
                );

                throw new Error(
                    "Invalid Razorpay Key ID returned by the server."
                );

            }


            console.log(
                "Step 4: Razorpay order validated.",
                {
                    orderId:
                        data.razorpay_order_id,

                    amount:
                        data.amount,

                    currency:
                        data.currency,

                    key:
                        data.key,
                }
            );


            // ==========================================
            // STEP 5
            // RAZORPAY OPTIONS
            // ==========================================

            const options = {

                key: data.key,

                amount:
                    Number(data.amount),

                currency:
                    data.currency || "INR",

                name:
                    "Pet Care Marketplace",

                description:
                    "Add Money to Wallet",

                order_id:
                    data.razorpay_order_id,


                // ======================================
                // PAYMENT SUCCESS
                // ======================================

                handler:
                    async function (
                        paymentResponse
                    ) {

                        console.log(
                            "Razorpay payment successful:",
                            paymentResponse
                        );


                        try {

                            // ==================================
                            // VERIFY PAYMENT
                            // ==================================

                            const verifyResponse =
                                await axios.post(

                                    `${API_BASE_URL}/api/wallet/verify-payment/`,

                                    {

                                        razorpay_order_id:
                                            paymentResponse.razorpay_order_id,

                                        razorpay_payment_id:
                                            paymentResponse.razorpay_payment_id,

                                        razorpay_signature:
                                            paymentResponse.razorpay_signature,

                                        amount:
                                            walletAmount,

                                    },

                                    getAuthConfig()

                                );


                            console.log(
                                "Wallet verification response:",
                                verifyResponse.data
                            );


                            // ==================================
                            // SUCCESS
                            // ==================================

                            alert(
                                `₹${walletAmount} added to your wallet successfully!`
                            );


                            navigate(
                                "/wallet",
                                {
                                    replace: true,
                                }
                            );

                        }

                        catch (error) {

                            console.error(
                                "Wallet verification error:",
                                error.response?.data ||
                                error.message ||
                                error
                            );


                            setError(

                                error.response?.data?.message ||

                                error.response?.data?.error ||

                                "Payment verification failed. Please contact support."

                            );

                        }

                        finally {

                            setLoading(false);

                        }

                    },


                // ==========================================
                // MODAL
                // ==========================================

                modal: {

                    ondismiss:
                        function () {

                            console.log(
                                "Razorpay checkout closed."
                            );

                            setLoading(false);

                        },

                },


                // ==========================================
                // PREFILL
                // ==========================================

                prefill: {

                    name:
                        localStorage.getItem(
                            "username"
                        ) || "",

                },


                // ==========================================
                // NOTES
                // ==========================================

                notes: {

                    purpose:
                        "Wallet Recharge",

                },


                // ==========================================
                // THEME
                // ==========================================

                theme: {

                    color:
                        "#0D6EFD",

                },

            };


            // ==========================================
            // STEP 6
            // CREATE RAZORPAY INSTANCE
            // ==========================================

            console.log(
                "Step 5: Creating Razorpay instance..."
            );


            let razorpay;


            try {

                razorpay =
                    new window.Razorpay(
                        options
                    );

            }

            catch (razorpayError) {

                console.error(
                    "Razorpay initialization error:",
                    razorpayError
                );


                throw new Error(
                    razorpayError.message ||
                    "Unable to initialize Razorpay checkout."
                );

            }


            // ==========================================
            // PAYMENT FAILED EVENT
            // ==========================================

            razorpay.on(
                "payment.failed",
                function (response) {

                    console.error(
                        "Razorpay payment failed:",
                        response
                    );


                    const failedError =
                        response?.error;


                    const description =
                        failedError?.description;


                    const reason =
                        failedError?.reason;


                    setError(

                        description ||

                        reason ||

                        "Razorpay payment failed. Please try again."

                    );


                    setLoading(false);

                }
            );


            // ==========================================
            // OPEN RAZORPAY
            // ==========================================

            console.log(
                "Step 6: Opening Razorpay..."
            );


            razorpay.open();


            console.log(
                "Razorpay open() called successfully."
            );

        }

        catch (error) {

            console.error(
                "===================================="
            );

            console.error(
                "ADD MONEY ERROR"
            );

            console.error(
                error.response?.data ||
                error.message ||
                error
            );

            console.error(
                "===================================="
            );


            const backendMessage =
                error.response?.data?.message;


            const backendError =
                error.response?.data?.error;


            setError(

                backendMessage ||

                backendError ||

                error.message ||

                "Unable to create payment. Please try again."

            );


            setLoading(false);

        }

    };


    // ==========================================
    // JSX
    // ==========================================

    return (

        <div className="add-money-page">


            {/* ==========================================
                BACK BUTTON
            ========================================== */}

            <button
                className="back-wallet-btn"
                onClick={() =>
                    navigate("/wallet")
                }
                disabled={loading}
            >

                <FaArrowLeft />

                Back to Wallet

            </button>


            <div className="add-money-container">


                {/* ==========================================
                    HEADER
                ========================================== */}

                <div className="add-money-header">

                    <div className="add-money-icon">

                        <FaWallet />

                    </div>


                    <h1>
                        Add Money
                    </h1>


                    <p>
                        Add money securely to your wallet
                    </p>

                </div>


                {/* ==========================================
                    FORM CARD
                ========================================== */}

                <div className="add-money-card">


                    {/* ======================================
                        AMOUNT LABEL
                    ====================================== */}

                    <div className="amount-label">

                        Enter Amount

                    </div>


                    {/* ======================================
                        AMOUNT INPUT
                    ====================================== */}

                    <div className="amount-input-wrapper">

                        <FaRupeeSign />


                        <input
                            type="number"
                            min="10"
                            step="1"
                            placeholder="Enter amount"
                            value={amount}
                            disabled={loading}
                            onChange={(e) => {

                                setAmount(
                                    e.target.value
                                );

                                setError("");

                            }}
                        />

                    </div>


                    {/* ======================================
                        ERROR
                    ====================================== */}

                    {error && (

                        <div
                            className="add-money-error"
                            role="alert"
                        >

                            {error}

                        </div>

                    )}


                    {/* ==========================================
                        QUICK AMOUNTS
                    ========================================== */}

                    <div className="quick-amount-section">

                        <p>
                            Quick Select
                        </p>


                        <div className="quick-amounts">

                            {[

                                100,
                                200,
                                500,
                                1000,
                                2000,
                                5000,

                            ].map(
                                (value) => (

                                    <button
                                        type="button"
                                        key={value}
                                        disabled={loading}
                                        className={
                                            Number(amount) ===
                                            value
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            selectAmount(
                                                value
                                            )
                                        }
                                    >

                                        ₹{value}

                                    </button>

                                )
                            )}

                        </div>

                    </div>


                    {/* ==========================================
                        ADD MONEY BUTTON
                    ========================================== */}

                    <button
                        type="button"
                        className="proceed-payment-btn"
                        onClick={
                            handleAddMoney
                        }
                        disabled={loading}
                    >

                        {loading ? (

                            <>
                                Processing...
                            </>

                        ) : (

                            <>
                                <FaPlus />

                                Add ₹
                                {amount || 0}

                            </>

                        )}

                    </button>


                    {/* ==========================================
                        SECURITY INFO
                    ========================================== */}

                    <div className="payment-security">

                        <FaShieldAlt />


                        <span>
                            Secure payment powered by Razorpay
                        </span>

                    </div>


                </div>


                {/* ==========================================
                    BENEFITS
                ========================================== */}

                <div className="wallet-benefits">


                    {/* BENEFIT 1 */}

                    <div className="benefit-item">

                        <FaCheckCircle />


                        <span>
                            Instant wallet recharge
                        </span>

                    </div>


                    {/* BENEFIT 2 */}

                    <div className="benefit-item">

                        <FaCreditCard />


                        <span>
                            Secure online payment
                        </span>

                    </div>


                    {/* BENEFIT 3 */}

                    <div className="benefit-item">

                        <FaWallet />


                        <span>
                            Use balance during checkout
                        </span>

                    </div>


                </div>


            </div>

        </div>

    );

}


export default AddMoney;