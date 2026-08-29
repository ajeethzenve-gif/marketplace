import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import axios from "axios";

import {
    FaCrown,
    FaCheck,
    FaArrowLeft,
    FaSpinner,
    FaShieldAlt
} from "react-icons/fa";

import "../styles/Membership.css";


function Membership() {

    const navigate = useNavigate();

    const API_BASE_URL =
        "http://127.0.0.1:8000";


    const token =
        localStorage.getItem("access");


    const [plans, setPlans] =
        useState([]);

    const [membership, setMembership] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [purchasing, setPurchasing] =
        useState(false);

    const [error, setError] =
        useState("");


    // ==========================================
    // AUTH HEADERS
    // ==========================================

    const getAuthConfig = () => {

        const currentToken =
            localStorage.getItem("access");

        if (!currentToken) {

            throw new Error(
                "Authentication token is missing."
            );

        }

        return {
            headers: {
                Authorization:
                    `Bearer ${currentToken}`,

                "Content-Type":
                    "application/json",
            }
        };
    };


    // ==========================================
    // LOAD RAZORPAY
    // ==========================================

    const loadRazorpay = () => {

        return new Promise((resolve) => {

            if (window.Razorpay) {

                resolve(true);

                return;

            }


            const existingScript =
                document.querySelector(
                    'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
                );


            if (existingScript) {

                existingScript.addEventListener(
                    "load",
                    () => {

                        resolve(
                            Boolean(
                                window.Razorpay
                            )
                        );

                    }
                );


                existingScript.addEventListener(
                    "error",
                    () => {

                        resolve(false);

                    }
                );

                return;

            }


            const script =
                document.createElement("script");


            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";


            script.async = true;


            script.onload = () => {

                resolve(
                    Boolean(
                        window.Razorpay
                    )
                );

            };


            script.onerror = () => {

                resolve(false);

            };


            document.body.appendChild(script);

        });

    };


    // ==========================================
    // LOAD MEMBERSHIP PLANS
    // ==========================================

    const loadPlans = async () => {

        try {

            const response =
                await axios.get(
                    `${API_BASE_URL}/api/membership/plans/`
                );


            setPlans(
                response.data
            );

        } catch (error) {

            console.error(
                "Membership plans error:",
                error.response?.data ||
                error.message
            );


            setError(
                "Unable to load membership plans."
            );

        }

    };


    // ==========================================
    // LOAD CURRENT MEMBERSHIP
    // ==========================================

    const loadMembership = async () => {

        const currentToken =
            localStorage.getItem("access");


        if (!currentToken) {

            return;

        }


        try {

            const response =
                await axios.get(

                    `${API_BASE_URL}/api/membership/my-membership/`,

                    getAuthConfig()

                );


            if (
                response.data.has_membership
            ) {

                setMembership(
                    response.data.membership
                );

            } else {

                setMembership(null);

            }

        } catch (error) {

            console.error(
                "Membership loading error:",
                error.response?.data ||
                error.message
            );

        }

    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            await Promise.all([
                loadPlans(),
                loadMembership()
            ]);

            setLoading(false);

        };


        loadData();

    }, []);


    // ==========================================
    // PURCHASE MEMBERSHIP
    // ==========================================

    const purchaseMembership =
        async (plan) => {

            setError("");


            // ======================================
            // LOGIN CHECK
            // ======================================

            const currentToken =
                localStorage.getItem("access");


            if (!currentToken) {

                navigate("/login");

                return;

            }


            // ======================================
            // PLAN VALIDATION
            // ======================================

            if (!plan?.id) {

                setError(
                    "Invalid membership plan."
                );

                return;

            }


            const planPrice =
                Number(plan.price);


            if (
                !planPrice ||
                planPrice <= 0
            ) {

                setError(
                    "Invalid membership price."
                );

                return;

            }


            // ======================================
            // CONFIRM
            // ======================================

            const confirmed =
                window.confirm(

                    `Purchase ${plan.name} membership for ₹${plan.price}?`

                );


            if (!confirmed) {

                return;

            }


            try {

                setPurchasing(true);


                // ======================================
                // STEP 1
                // LOAD RAZORPAY
                // ======================================

                console.log(
                    "Loading Razorpay..."
                );


                const razorpayLoaded =
                    await loadRazorpay();


                if (!razorpayLoaded) {

                    throw new Error(
                        "Unable to load Razorpay checkout."
                    );

                }


                if (
                    typeof window.Razorpay !==
                    "function"
                ) {

                    throw new Error(
                        "Razorpay checkout is unavailable."
                    );

                }


                console.log(
                    "Razorpay loaded."
                );


                // ======================================
                // STEP 2
                // CREATE MEMBERSHIP PAYMENT
                // ======================================

                console.log(
                    "Creating membership Razorpay order..."
                );


                const response =
                    await axios.post(

                        `${API_BASE_URL}/api/membership/create-payment/`,

                        {
                            plan_id:
                                plan.id
                        },

                        getAuthConfig()

                    );


                console.log(
                    "Membership payment response:",
                    response.data
                );


                const data =
                    response.data;


                // ======================================
                // VALIDATE RESPONSE
                // ======================================

                if (!data) {

                    throw new Error(
                        "Empty response from payment server."
                    );

                }


                if (!data.key) {

                    throw new Error(
                        "Razorpay key is missing."
                    );

                }


                if (!data.razorpay_order_id) {

                    throw new Error(
                        "Razorpay order ID is missing."
                    );

                }


                if (!data.amount) {

                    throw new Error(
                        "Razorpay payment amount is missing."
                    );

                }


                // ======================================
                // STEP 3
                // RAZORPAY OPTIONS
                // ======================================

                const options = {

                    key:
                        data.key,

                    amount:
                        Number(data.amount),

                    currency:
                        data.currency || "INR",

                    name:
                        "Zenve Membership",

                    description:
                        `${plan.name} Membership`,

                    order_id:
                        data.razorpay_order_id,


                    // ==================================
                    // PAYMENT SUCCESS
                    // ==================================

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
                                // VERIFY MEMBERSHIP PAYMENT
                                // ==================================

                                const verifyResponse =
                                    await axios.post(

                                        `${API_BASE_URL}/api/membership/verify-payment/`,

                                        {

                                            plan_id:
                                                plan.id,

                                            razorpay_order_id:
                                                paymentResponse.razorpay_order_id,

                                            razorpay_payment_id:
                                                paymentResponse.razorpay_payment_id,

                                            razorpay_signature:
                                                paymentResponse.razorpay_signature,

                                        },

                                        getAuthConfig()

                                    );


                                console.log(
                                    "Membership verification:",
                                    verifyResponse.data
                                );


                                // ==================================
                                // SUCCESS
                                // ==================================

                                alert(
                                    "Membership activated successfully!"
                                );


                                // Reload current membership
                                await loadMembership();


                            } catch (error) {

                                console.error(
                                    "Membership payment verification error:",
                                    error.response?.data ||
                                    error.message
                                );


                                setError(

                                    error.response?.data?.message ||

                                    error.response?.data?.error ||

                                    "Payment verification failed."

                                );

                            } finally {

                                setPurchasing(false);

                            }

                        },


                    // ==================================
                    // MODAL CLOSED
                    // ==================================

                    modal: {

                        ondismiss:
                            function () {

                                console.log(
                                    "Razorpay checkout closed."
                                );

                                setPurchasing(false);

                            }

                    },


                    // ==================================
                    // PREFILL
                    // ==================================

                    prefill: {

                        name:
                            localStorage.getItem(
                                "username"
                            ) || "",

                    },


                    // ==================================
                    // NOTES
                    // ==================================

                    notes: {

                        plan_id:
                            String(plan.id),

                        plan_name:
                            plan.name,

                        purpose:
                            "Membership Purchase",

                    },


                    // ==================================
                    // THEME
                    // ==================================

                    theme: {

                        color:
                            "#6C4CE4",

                    }

                };


                // ======================================
                // STEP 4
                // CREATE RAZORPAY
                // ======================================

                const razorpay =
                    new window.Razorpay(
                        options
                    );


                // ======================================
                // PAYMENT FAILED
                // ======================================

                razorpay.on(
                    "payment.failed",
                    function (response) {

                        console.error(
                            "Razorpay payment failed:",
                            response
                        );


                        setError(

                            response?.error?.description ||

                            response?.error?.reason ||

                            "Payment failed. Please try again."

                        );


                        setPurchasing(false);

                    }
                );


                // ======================================
                // STEP 5
                // OPEN RAZORPAY
                // ======================================

                console.log(
                    "Opening Razorpay..."
                );


                razorpay.open();

            } catch (error) {

                console.error(
                    "Membership payment error:",
                    error.response?.data ||
                    error.message ||
                    error
                );


                setError(

                    error.response?.data?.message ||

                    error.response?.data?.error ||

                    error.message ||

                    "Unable to start payment."

                );


                setPurchasing(false);

            }

        };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="membership-page loading-page">

                <FaSpinner className="spin-icon" />

                <p>
                    Loading membership plans...
                </p>

            </div>

        );

    }


    // ==========================================
    // JSX
    // ==========================================

    return (

        <div className="membership-page">


            {/* ======================================
                HERO
            ====================================== */}

            <section className="membership-hero">


                <button
                    className="membership-back-btn"
                    onClick={() =>
                        navigate(-1)
                    }
                    disabled={purchasing}
                >

                    <FaArrowLeft />

                    Back

                </button>


                <div className="membership-hero-icon">

                    <FaCrown />

                </div>


                <span>
                    ZENVE MEMBERSHIP
                </span>


                <h1>
                    Better Care.
                    Better Benefits.
                </h1>


                <p>

                    Unlock exclusive discounts,
                    free delivery and premium
                    pet care benefits.

                </p>

            </section>


            {/* ======================================
                ERROR
            ====================================== */}

            {error && (

                <div
                    className="membership-error"
                    role="alert"
                >

                    {error}

                </div>

            )}


            {/* ======================================
                ACTIVE MEMBERSHIP
            ====================================== */}

            {membership && (

                <div className="active-membership-card">

                    <div>

                        <span>
                            ACTIVE MEMBERSHIP
                        </span>


                        <h2>

                            <FaCrown />

                            {
                                membership.plan.name
                            }

                        </h2>

                    </div>


                    <div className="membership-info">


                        <div>

                            <small>
                                Valid Until
                            </small>


                            <strong>

                                {
                                    new Date(
                                        membership.end_date
                                    ).toLocaleDateString()
                                }

                            </strong>

                        </div>


                        <div>

                            <small>
                                Discount
                            </small>


                            <strong>

                                {
                                    membership.plan
                                        .discount_percentage
                                }%

                            </strong>

                        </div>


                    </div>

                </div>

            )}


            {/* ======================================
                PLANS
            ====================================== */}

            <section className="membership-plans">


                <div className="membership-title">

                    <span>
                        CHOOSE YOUR PLAN
                    </span>


                    <h2>
                        Membership Plans
                    </h2>


                    <p>

                        Choose the plan that works
                        best for you and your pet.

                    </p>

                </div>


                <div className="plans-grid">


                    {plans.map(
                        (plan) => (

                            <div
                                className="membership-plan-card"
                                key={plan.id}
                            >


                                <div className="plan-header">

                                    <FaCrown />


                                    <h3>
                                        {plan.name}
                                    </h3>

                                </div>


                                <div className="plan-price">

                                    <span>
                                        ₹
                                    </span>


                                    <strong>
                                        {plan.price}
                                    </strong>

                                </div>


                                <p className="plan-duration">

                                    {plan.duration_months}

                                    {" Month"}

                                    {
                                        plan.duration_months > 1
                                            ? "s"
                                            : ""
                                    }

                                </p>


                                <div className="plan-features">


                                    <div>

                                        <FaCheck />

                                        {
                                            plan.discount_percentage
                                        }%

                                        discount on eligible products

                                    </div>


                                    {plan.free_delivery && (

                                        <div>

                                            <FaCheck />

                                            Free Delivery

                                        </div>

                                    )}


                                    {plan.priority_support && (

                                        <div>

                                            <FaCheck />

                                            Priority Customer Support

                                        </div>

                                    )}

                                </div>


                                <button
                                    type="button"
                                    className="choose-plan-btn"
                                    onClick={() =>
                                        purchaseMembership(
                                            plan
                                        )
                                    }
                                    disabled={
                                        purchasing
                                    }
                                >

                                    {purchasing
                                        ? "Opening Payment..."
                                        : "Choose Plan"
                                    }

                                </button>


                                <div className="payment-security">

                                    <FaShieldAlt />

                                    <span>
                                        Secure payment powered by Razorpay
                                    </span>

                                </div>


                            </div>

                        )
                    )}

                </div>

            </section>

        </div>

    );

}


export default Membership;