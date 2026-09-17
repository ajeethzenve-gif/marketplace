import { useEffect, useState } from "react";
import axios from "axios";

import {
    FaClipboardCheck,
    FaBoxOpen,
    FaTruck,
    FaHome,
    FaCheckCircle,
    FaTimesCircle,
    FaShoppingBag,
    FaBox,
    FaArrowLeft,
    FaMapMarkerAlt,
    FaCreditCard,
    FaCalendarAlt,
    FaEye,
    FaClock,
} from "react-icons/fa";

import "../styles/Orders.css";

import {
    showSuccessAlert,
    showErrorAlert,
    showConfirmAlert,
} from "../utils/sweetAlert";


function Orders() {

    // ===========================================
    // STATE
    // ===========================================

    const [orders, setOrders] = useState([]);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [activeTab, setActiveTab] = useState("history");

    const [loading, setLoading] = useState(true);


    // ===========================================
    // LOAD CURRENT CUSTOMER ORDERS
    // ===========================================

    useEffect(() => {
        loadOrders();
    }, []);


    const loadOrders = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem("access");

            if (!token) {
                console.log("No access token found.");
                setOrders([]);
                return;
            }

            const response = await axios.get(
                "http://127.0.0.1:8000/api/orders/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("ORDERS API RESPONSE:", response.data);

            /*
             * Supports both:
             *
             * [
             *    {...},
             *    {...}
             * ]
             *
             * and Django pagination:
             *
             * {
             *    count: 2,
             *    results: [...]
             * }
             */

            const data = response.data;

            if (Array.isArray(data)) {

                setOrders(data);

            } else if (Array.isArray(data.results)) {

                setOrders(data.results);

            } else {

                setOrders([]);

            }

        } catch (error) {

            console.log(
                "LOAD ORDERS ERROR:",
                error.response?.data || error
            );

            setOrders([]);

        } finally {

            setLoading(false);

        }

    };


    // ===========================================
    // LOAD ORDER DETAILS
    // ===========================================

    const loadOrderDetails = async (id) => {

        try {

            const token = localStorage.getItem("access");

            if (!token) {
                console.log("No access token found.");
                return;
            }

            console.log("Loading order:", id);

            const response = await axios.get(
                `http://127.0.0.1:8000/api/orders/${id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(
                "ORDER DETAILS RESPONSE:",
                response.data
            );

            setSelectedOrder(response.data);

            setActiveTab("details");

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

        } catch (error) {

            console.log(
                "ORDER DETAILS ERROR:",
                error.response?.data || error
            );

            showErrorAlert(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Unable to load order details."
            );

        }

    };


    // ===========================================
    // CANCEL ORDER
    // ===========================================

    const cancelOrder = async (orderId) => {

        const confirmed = await showConfirmAlert({
            title: "Are you sure?",
            text: "Are you sure you want to cancel this order?",
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
        });

        if (!confirmed) return;


        try {

            const token = localStorage.getItem("access");

            await axios.patch(
                `http://127.0.0.1:8000/api/orders/${orderId}/cancel/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            showSuccessAlert(
                "Order cancelled successfully."
            );


            await loadOrders();


            if (
                selectedOrder &&
                (
                    selectedOrder.id === orderId ||
                    selectedOrder.id === `ord-${orderId}`
                )
            ) {

                await loadOrderDetails(orderId);

            }

        } catch (error) {

            console.log(
                "CANCEL ORDER ERROR:",
                error.response?.data || error
            );

            showErrorAlert(
                error.response?.data?.message ||
                error.response?.data?.detail ||
                "Unable to cancel order."
            );

        }

    };


    // ===========================================
    // ORDER STATUS
    // ===========================================

    const normalSteps = [
        "Pending",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
    ];


    const cancelledSteps = [
        "Pending",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Cancelled",
    ];


    const selectedStatus =
        selectedOrder?.orderStatus ||
        selectedOrder?.status ||
        "Pending";


    const normalizedSelectedStatus =
        selectedStatus.toLowerCase();


    const steps =
        normalizedSelectedStatus === "cancelled"
            ? cancelledSteps
            : normalSteps;


    const currentStep = (() => {

        const index = steps.findIndex(
            (step) =>
                step.toLowerCase() ===
                normalizedSelectedStatus
        );

        return index >= 0 ? index : 0;

    })();


    // ===========================================
    // STATUS CLASS
    // ===========================================

    const getStatusClass = (status) => {

        return status
            ?.toString()
            .toLowerCase()
            .replace(/\s+/g, "-");

    };


    // ===========================================
    // FORMAT DATE
    // ===========================================

    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return "N/A";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );

    };


    const formatDateTime = (date) => {

        if (!date) {
            return "N/A";
        }

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return "N/A";
        }

        return parsedDate.toLocaleString(
            "en-IN"
        );

    };


    // ===========================================
    // GET ORDER ID
    // ===========================================

    const getOrderDatabaseId = (order) => {

        /*
         * Serializer:
         *
         * id = "ord-15"
         *
         * But detail API expects:
         *
         * /api/orders/15/
         */

        if (!order?.id) {
            return null;
        }

        if (
            typeof order.id === "string" &&
            order.id.startsWith("ord-")
        ) {

            return order.id.replace("ord-", "");

        }

        return order.id;

    };


    // ===========================================
    // LOADING
    // ===========================================

    if (loading) {

        return (

            <div className="orders-loading">

                <div className="orders-spinner"></div>

                <p>
                    Loading your orders...
                </p>

            </div>

        );

    }


    // ===========================================
    // PAGE
    // ===========================================

    return (

        <div className="orders-page">


            {/* =====================================
                PAGE HEADER
            ====================================== */}

            <div className="orders-hero">

                <div className="orders-container">

                    <div className="orders-hero-content">

                        <div className="orders-icon">

                            <FaShoppingBag />

                        </div>


                        <div>

                            <span>
                                ZENVE MARKETPLACE
                            </span>

                            <h1>
                                My Orders
                            </h1>

                            <p>
                                Track, manage and view all your
                                pet care orders.
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            <main className="orders-container">


                {/* =====================================
                    ORDER SUMMARY
                ====================================== */}

                <div className="orders-summary">


                    {/* TOTAL */}

                    <div className="summary-card">

                        <div className="summary-icon total">

                            <FaShoppingBag />

                        </div>


                        <div>

                            <span>
                                Total Orders
                            </span>

                            <strong>
                                {orders.length}
                            </strong>

                        </div>

                    </div>


                    {/* ACTIVE */}

                    <div className="summary-card">

                        <div className="summary-icon pending">

                            <FaClock />

                        </div>


                        <div>

                            <span>
                                Active Orders
                            </span>

                            <strong>

                                {
                                    orders.filter(
                                        (order) => {

                                            const status =
                                                (
                                                    order.orderStatus ||
                                                    order.status ||
                                                    ""
                                                ).toLowerCase();

                                            return (
                                                status !== "delivered" &&
                                                status !== "cancelled"
                                            );

                                        }
                                    ).length
                                }

                            </strong>

                        </div>

                    </div>


                    {/* DELIVERED */}

                    <div className="summary-card">

                        <div className="summary-icon delivered">

                            <FaCheckCircle />

                        </div>


                        <div>

                            <span>
                                Delivered
                            </span>

                            <strong>

                                {
                                    orders.filter(
                                        (order) => {

                                            const status =
                                                (
                                                    order.orderStatus ||
                                                    order.status ||
                                                    ""
                                                ).toLowerCase();

                                            return (
                                                status === "delivered"
                                            );

                                        }
                                    ).length
                                }

                            </strong>

                        </div>

                    </div>


                </div>


                {/* =====================================
                    TABS
                ====================================== */}

                <div className="orders-tabs">


                    <button
                        className={
                            activeTab === "history"
                                ? "active-tab"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("history")
                        }
                    >

                        <FaShoppingBag />

                        Order History

                    </button>


                    <button
                        className={
                            activeTab === "details"
                                ? "active-tab"
                                : ""
                        }
                        disabled={!selectedOrder}
                        onClick={() =>
                            selectedOrder &&
                            setActiveTab("details")
                        }
                    >

                        <FaClipboardCheck />

                        Order Details

                    </button>


                </div>


                {/* =====================================
                    ORDER HISTORY
                ====================================== */}

                {
                    activeTab === "history" && (

                        <div className="orders-list">


                            {
                                orders.length === 0

                                    ? (

                                        <div className="empty-orders">

                                            <div className="empty-orders-icon">

                                                <FaBox />

                                            </div>

                                            <h3>
                                                No Orders Yet
                                            </h3>

                                            <p>
                                                You haven't placed any
                                                orders yet.
                                            </p>

                                        </div>

                                    )

                                    : (

                                        orders.map((order) => {

                                            const orderStatus =
                                                order.orderStatus ||
                                                order.status ||
                                                "Pending";

                                            const orderId =
                                                getOrderDatabaseId(
                                                    order
                                                );

                                            return (

                                                <div
                                                    className="modern-order-card"
                                                    key={order.id}
                                                >


                                                    {/* CARD TOP */}

                                                    <div className="modern-order-header">

                                                        <div>

                                                            <span className="order-number">

                                                                Order #{
                                                                    order.orderNumber ||
                                                                    order.id
                                                                }

                                                            </span>


                                                            <p>

                                                                <FaCalendarAlt />

                                                                {
                                                                    formatDate(
                                                                        order.createdAt ||
                                                                        order.order_date
                                                                    )
                                                                }

                                                            </p>

                                                        </div>


                                                        <span
                                                            className={
                                                                `status-badge ${getStatusClass(
                                                                    orderStatus
                                                                )}`
                                                            }
                                                        >

                                                            {orderStatus}

                                                        </span>

                                                    </div>


                                                    {/* CARD BODY */}

                                                    <div className="modern-order-body">


                                                        {/* TOTAL */}

                                                        <div className="order-info-item">

                                                            <span>
                                                                Total Amount
                                                            </span>

                                                            <strong className="order-price">

                                                                ₹
                                                                {
                                                                    Number(
                                                                        order.total ??
                                                                        order.total_amount ??
                                                                        0
                                                                    ).toFixed(2)
                                                                }

                                                            </strong>

                                                        </div>


                                                        {/* ITEMS */}

                                                        <div className="order-info-item">

                                                            <span>
                                                                Total Items
                                                            </span>

                                                            <strong>

                                                                {
                                                                    order.items?.length ??
                                                                    order.total_items ??
                                                                    0
                                                                }

                                                                {" "}Items

                                                            </strong>

                                                        </div>


                                                        {/* PAYMENT */}

                                                        <div className="order-info-item">

                                                            <span>
                                                                Payment
                                                            </span>

                                                            <strong>

                                                                {
                                                                    order.paymentStatus ||
                                                                    order.payment_status ||
                                                                    "Pending"
                                                                }

                                                            </strong>

                                                        </div>


                                                    </div>


                                                    {/* CARD FOOTER */}

                                                    <div className="modern-order-footer">

                                                        <span>

                                                            <FaBoxOpen />

                                                            View complete order details

                                                        </span>


                                                        <button
                                                            className="view-order-btn"
                                                            onClick={() =>
                                                                loadOrderDetails(
                                                                    orderId
                                                                )
                                                            }
                                                        >

                                                            <FaEye />

                                                            View Order

                                                        </button>

                                                    </div>


                                                </div>

                                            );

                                        })

                                    )

                            }


                        </div>

                    )

                }


                {/* =====================================
                    ORDER DETAILS
                ====================================== */}

                {
                    activeTab === "details" &&
                    selectedOrder && (

                        <div className="order-details-modern">


                            {/* =================================
                                DETAILS HEADER
                            ================================== */}

                            <div className="details-top-header">

                                <div>


                                    <button
                                        className="back-orders-link"
                                        onClick={() =>
                                            setActiveTab("history")
                                        }
                                    >

                                        <FaArrowLeft />

                                        Back to Orders

                                    </button>


                                    <h2>

                                        Order #{
                                            selectedOrder.orderNumber ||
                                            selectedOrder.id
                                        }

                                    </h2>


                                    <p>

                                        <FaCalendarAlt />

                                        {
                                            formatDateTime(
                                                selectedOrder.createdAt ||
                                                selectedOrder.order_date
                                            )
                                        }

                                    </p>


                                </div>


                                <span
                                    className={
                                        `status-badge large ${getStatusClass(
                                            selectedOrder.orderStatus ||
                                            selectedOrder.status
                                        )}`
                                    }
                                >

                                    {
                                        selectedOrder.orderStatus ||
                                        selectedOrder.status ||
                                        "Pending"
                                    }

                                </span>


                            </div>


                            {/* =================================
                                ORDER INFO CARDS
                            ================================== */}

                            <div className="details-info-grid">


                                {/* SHIPPING */}

                                <div className="details-info-card">


                                    <div className="details-card-title">

                                        <div className="details-card-icon">

                                            <FaMapMarkerAlt />

                                        </div>

                                        <h3>
                                            Shipping Address
                                        </h3>

                                    </div>


                                    {

                                        selectedOrder.shippingAddress

                                            ? (

                                                <div className="address-content">


                                                    <strong>

                                                        {
                                                            selectedOrder
                                                                .shippingAddress
                                                                .fullName
                                                        }

                                                    </strong>


                                                    <p>

                                                        📞{" "}

                                                        {
                                                            selectedOrder
                                                                .shippingAddress
                                                                .mobile
                                                        }

                                                    </p>


                                                    {
                                                        selectedOrder
                                                            .shippingAddress
                                                            .email && (

                                                            <p>

                                                                {
                                                                    selectedOrder
                                                                        .shippingAddress
                                                                        .email
                                                                }

                                                            </p>

                                                        )
                                                    }


                                                    <p>

                                                        {
                                                            selectedOrder
                                                                .shippingAddress
                                                                .addressLine1
                                                        }

                                                    </p>


                                                    {
                                                        selectedOrder
                                                            .shippingAddress
                                                            .addressLine2 && (

                                                            <p>

                                                                {
                                                                    selectedOrder
                                                                        .shippingAddress
                                                                        .addressLine2
                                                                }

                                                            </p>

                                                        )
                                                    }


                                                    <p>

                                                        {
                                                            selectedOrder
                                                                .shippingAddress
                                                                .city
                                                        }

                                                        ,{" "}

                                                        {
                                                            selectedOrder
                                                                .shippingAddress
                                                                .state
                                                        }

                                                    </p>


                                                    <p>

                                                        {
                                                            selectedOrder
                                                                .shippingAddress
                                                                .country
                                                        }

                                                        {" - "}

                                                        {
                                                            selectedOrder
                                                                .shippingAddress
                                                                .pincode
                                                        }

                                                    </p>


                                                </div>

                                            )

                                            : (

                                                <p className="no-data">

                                                    No address available.

                                                </p>

                                            )

                                    }


                                </div>


                                {/* PAYMENT */}

                                <div className="details-info-card">


                                    <div className="details-card-title">

                                        <div className="details-card-icon">

                                            <FaCreditCard />

                                        </div>

                                        <h3>
                                            Payment Information
                                        </h3>

                                    </div>


                                    <div className="payment-info">


                                        <div>

                                            <span>
                                                Customer
                                            </span>

                                            <strong>

                                                {
                                                    selectedOrder.userId ||
                                                    selectedOrder.customer_name ||
                                                    "Current Customer"
                                                }

                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Payment Method
                                            </span>

                                            <strong>

                                                {
                                                    selectedOrder.paymentMethod ||
                                                    selectedOrder.payment_method ||
                                                    "Cash on Delivery"
                                                }

                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Payment Status
                                            </span>

                                            <strong>

                                                {
                                                    selectedOrder.paymentStatus ||
                                                    selectedOrder.payment_status ||
                                                    "Pending"
                                                }

                                            </strong>

                                        </div>


                                    </div>


                                </div>


                            </div>


                            {/* =====================================
                                PRODUCTS
                            ====================================== */}

                            <div className="order-products-section">


                                <div className="section-heading">

                                    <div>

                                        <span>
                                            ORDER ITEMS
                                        </span>

                                        <h3>
                                            Products in your order
                                        </h3>

                                    </div>


                                    <strong>

                                        {
                                            selectedOrder.items?.length || 0
                                        }

                                        {" "}Items

                                    </strong>

                                </div>


                                <div className="order-products-list">


                                    {

                                        selectedOrder.items?.length > 0

                                            ? (

                                                selectedOrder.items.map(
                                                    (item) => {

                                                        const imageUrl =
                                                            item.product_image

                                                                ? (
                                                                    item.product_image.startsWith(
                                                                        "http"
                                                                    )
                                                                        ? item.product_image
                                                                        : `http://127.0.0.1:8000${item.product_image}`
                                                                )

                                                                : null;


                                                        return (

                                                            <div
                                                                className="order-product-item"
                                                                key={item.id}
                                                            >


                                                                {/* IMAGE */}

                                                                <div className="order-product-image">

                                                                    {

                                                                        imageUrl

                                                                            ? (

                                                                                <img
                                                                                    src={imageUrl}
                                                                                    alt={
                                                                                        item.product_name ||
                                                                                        "Product"
                                                                                    }
                                                                                    onError={(event) => {
                                                                                        event.currentTarget.style.display = "none";
                                                                                    }}
                                                                                />

                                                                            )

                                                                            : (

                                                                                <FaBox />

                                                                            )

                                                                    }

                                                                </div>


                                                                {/* PRODUCT */}

                                                                <div className="order-product-main">

                                                                    <h4>

                                                                        {
                                                                            item.product_name ||
                                                                            `Product #${item.product}`
                                                                        }

                                                                    </h4>


                                                                    <span>

                                                                        Quantity:
                                                                        {" "}

                                                                        {
                                                                            item.quantity
                                                                        }

                                                                    </span>

                                                                </div>


                                                                {/* PRICE */}

                                                                <div className="order-product-price">

                                                                    <span>
                                                                        Price
                                                                    </span>

                                                                    <strong>

                                                                        ₹
                                                                        {
                                                                            Number(
                                                                                item.price || 0
                                                                            ).toFixed(2)
                                                                        }

                                                                    </strong>

                                                                </div>


                                                                {/* SUBTOTAL */}

                                                                <div className="order-product-subtotal">

                                                                    <span>
                                                                        Subtotal
                                                                    </span>

                                                                    <strong>

                                                                        ₹
                                                                        {
                                                                            Number(
                                                                                item.subtotal || 0
                                                                            ).toFixed(2)
                                                                        }

                                                                    </strong>

                                                                    </div>


                                                            </div>

                                                        );

                                                    }
                                                )

                                            )

                                            : (

                                                <div className="no-data">

                                                    No products found
                                                    for this order.

                                                </div>

                                            )

                                    }


                                </div>


                            </div>


                            {/* =====================================
                                TOTAL + CANCEL
                            ====================================== */}

                            <div className="order-summary-bottom">


                                <div>

                                    <span>
                                        Order Total
                                    </span>


                                    <h2>

                                        ₹
                                        {
                                            Number(
                                                selectedOrder.total ??
                                                selectedOrder.total_amount ??
                                                0
                                            ).toFixed(2)
                                        }

                                    </h2>

                                </div>


                                {

                                    [
                                        "pending",
                                        "placed",
                                        "confirmed",
                                    ].includes(
                                        (
                                            selectedOrder.orderStatus ||
                                            selectedOrder.status ||
                                            ""
                                        ).toLowerCase()
                                    ) && (

                                        <button
                                            className="cancel-order-btn"
                                            onClick={() =>
                                                cancelOrder(
                                                    getOrderDatabaseId(
                                                        selectedOrder
                                                    )
                                                )
                                            }
                                        >

                                            <FaTimesCircle />

                                            Cancel Order

                                        </button>

                                    )

                                }


                            </div>


                            {/* =====================================
                                TRACKING
                            ====================================== */}

                            <div className="tracking-section">


                                <div className="section-heading">

                                    <div>

                                        <span>
                                            ORDER STATUS
                                        </span>

                                        <h3>
                                            Track your order
                                        </h3>

                                    </div>

                                </div>


                                <div className="modern-order-tracker">


                                    {

                                        steps.map(
                                            (step, index) => {

                                                const isCancelled =
                                                    step === "Cancelled";


                                                const isActive =
                                                    index <= currentStep;


                                                return (

                                                    <div
                                                        className="tracker-step-modern"
                                                        key={step}
                                                    >


                                                        <div className="tracker-step-content">


                                                            <div
                                                                className={
                                                                    `tracker-icon-modern ${
                                                                        isCancelled
                                                                            ? "cancelled"
                                                                            : isActive
                                                                                ? "active"
                                                                                : ""
                                                                    }`
                                                                }
                                                            >


                                                                {
                                                                    index === 0 &&
                                                                    <FaClipboardCheck />
                                                                }


                                                                {
                                                                    index === 1 &&
                                                                    <FaBoxOpen />
                                                                }


                                                                {
                                                                    index === 2 &&
                                                                    <FaTruck />
                                                                }


                                                                {
                                                                    index === 3 &&
                                                                    <FaHome />
                                                                }


                                                                {
                                                                    step === "Delivered" &&
                                                                    <FaCheckCircle />
                                                                }


                                                                {
                                                                    step === "Cancelled" &&
                                                                    <FaTimesCircle />
                                                                }


                                                            </div>


                                                            <p>

                                                                {step}

                                                            </p>


                                                        </div>


                                                        {

                                                            index !==
                                                            steps.length - 1 && (

                                                                <div
                                                                    className={
                                                                        `tracker-line-modern ${
                                                                            index < currentStep
                                                                                ? "active"
                                                                                : ""
                                                                        }`
                                                                    }
                                                                />

                                                            )

                                                        }


                                                    </div>

                                                );

                                            }

                                        )

                                    }


                                </div>


                            </div>


                        </div>

                    )

                }


            </main>


        </div>

    );

}


export default Orders;