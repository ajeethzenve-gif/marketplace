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


function Orders() {

    const [orders, setOrders] = useState([]);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [activeTab, setActiveTab] = useState("history");

    const [loading, setLoading] = useState(true);


    // ===========================================
    // LOAD ORDERS
    // ===========================================

    useEffect(() => {

        loadOrders();

    }, []);


    const loadOrders = async () => {

        try {

            setLoading(true);

            const response = await axios.get(

                "http://127.0.0.1:8000/api/orders/",

                {
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem("access")}`
                    }
                }

            );

            setOrders(response.data);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };


    // ===========================================
    // LOAD ORDER DETAILS
    // ===========================================

    const loadOrderDetails = async (id) => {

        try {

            const response = await axios.get(

                `http://127.0.0.1:8000/api/orders/${id}/`,

                {
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem("access")}`
                    }
                }

            );

            setSelectedOrder(response.data);

            setActiveTab("details");

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

        catch (error) {

            console.log(error);

        }

    };


    // ===========================================
    // CANCEL ORDER
    // ===========================================

    const cancelOrder = async (orderId) => {

        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this order?"
        );

        if (!confirmCancel) return;


        try {

            await axios.patch(

                `http://127.0.0.1:8000/api/orders/${orderId}/cancel/`,

                {},

                {
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem("access")}`
                    }
                }

            );


            alert("Order cancelled successfully.");

            await loadOrders();

            if (
                selectedOrder &&
                selectedOrder.id === orderId
            ) {

                await loadOrderDetails(orderId);

            }

        }

        catch (error) {

            console.log(error);

            alert(

                error.response?.data?.message ||

                "Unable to cancel order."

            );

        }

    };


    // ===========================================
    // ORDER TRACKING STEPS
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


    const steps =

        selectedOrder?.status === "Cancelled"

            ? cancelledSteps

            : normalSteps;


    const currentStep =

        selectedOrder?.status === "Cancelled"

            ? steps.length - 1

            : steps.indexOf(selectedOrder?.status);


    // ===========================================
    // GET STATUS CLASS
    // ===========================================

    const getStatusClass = (status) => {

        return status
            ?.toLowerCase()
            .replace(/\s+/g, "-");

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
                                Track, manage and view all your pet care orders.
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
                                        (order) =>
                                            ![
                                                "Delivered",
                                                "Cancelled"
                                            ].includes(order.status)
                                    ).length
                                }

                            </strong>

                        </div>

                    </div>


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
                                        (order) =>
                                            order.status ===
                                            "Delivered"
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

                                    ?

                                    <div className="empty-orders">

                                        <div className="empty-orders-icon">

                                            <FaBox />

                                        </div>

                                        <h3>
                                            No Orders Yet
                                        </h3>

                                        <p>
                                            You haven't placed any orders yet.
                                        </p>

                                    </div>


                                    :

                                    orders.map((order) => (

                                        <div
                                            className="modern-order-card"
                                            key={order.id}
                                        >


                                            {/* CARD TOP */}

                                            <div className="modern-order-header">

                                                <div>

                                                    <span className="order-number">

                                                        Order #{order.id}

                                                    </span>

                                                    <p>

                                                        <FaCalendarAlt />

                                                        {

                                                            new Date(
                                                                order.order_date
                                                            ).toLocaleDateString(
                                                                "en-IN",
                                                                {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric"
                                                                }
                                                            )

                                                        }

                                                    </p>

                                                </div>


                                                <span

                                                    className={
                                                        `status-badge ${getStatusClass(
                                                            order.status
                                                        )}`
                                                    }

                                                >

                                                    {order.status}

                                                </span>

                                            </div>


                                            {/* CARD BODY */}

                                            <div className="modern-order-body">


                                                <div className="order-info-item">

                                                    <span>
                                                        Total Amount
                                                    </span>

                                                    <strong className="order-price">

                                                        ₹{
                                                            Number(
                                                                order.total_amount
                                                            ).toFixed(2)
                                                        }

                                                    </strong>

                                                </div>


                                                <div className="order-info-item">

                                                    <span>
                                                        Total Items
                                                    </span>

                                                    <strong>

                                                        {order.total_items}

                                                        {" "}Items

                                                    </strong>

                                                </div>


                                                <div className="order-info-item">

                                                    <span>
                                                        Payment
                                                    </span>

                                                    <strong>

                                                        {order.payment_status ||
                                                            "Pending"}

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
                                                            order.id
                                                        )
                                                    }

                                                >

                                                    <FaEye />

                                                    View Order

                                                </button>

                                            </div>

                                        </div>

                                    ))

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


                            {/* DETAILS HEADER */}

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

                                        Order #{selectedOrder.id}

                                    </h2>


                                    <p>

                                        <FaCalendarAlt />

                                        {

                                            new Date(
                                                selectedOrder.order_date
                                            ).toLocaleString()

                                        }

                                    </p>

                                </div>


                                <span

                                    className={
                                        `status-badge large ${getStatusClass(
                                            selectedOrder.status
                                        )}`
                                    }

                                >

                                    {selectedOrder.status}

                                </span>

                            </div>


                            {/* ORDER INFO CARDS */}

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

                                        selectedOrder.shipping_address

                                            ?

                                            <div className="address-content">

                                                <strong>

                                                    {
                                                        selectedOrder
                                                            .shipping_address
                                                            .full_name
                                                    }

                                                </strong>

                                                <p>

                                                    {
                                                        selectedOrder
                                                            .shipping_address
                                                            .phone_number
                                                    }

                                                </p>

                                                <p>

                                                    {
                                                        selectedOrder
                                                            .shipping_address
                                                            .address_line1
                                                    }

                                                </p>


                                                {

                                                    selectedOrder
                                                        .shipping_address
                                                        .address_line2 && (

                                                        <p>

                                                            {
                                                                selectedOrder
                                                                    .shipping_address
                                                                    .address_line2
                                                            }

                                                        </p>

                                                    )

                                                }


                                                <p>

                                                    {
                                                        selectedOrder
                                                            .shipping_address
                                                            .city
                                                    },

                                                    {" "}

                                                    {
                                                        selectedOrder
                                                            .shipping_address
                                                            .state
                                                    }

                                                </p>


                                                <p>

                                                    {
                                                        selectedOrder
                                                            .shipping_address
                                                            .country
                                                    }

                                                    {" - "}

                                                    {
                                                        selectedOrder
                                                            .shipping_address
                                                            .postal_code
                                                    }

                                                </p>

                                            </div>


                                            :

                                            <p className="no-data">

                                                No address available.

                                            </p>

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
                                                    selectedOrder.customer_name
                                                }

                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Payment Method
                                            </span>

                                            <strong>

                                                {
                                                    selectedOrder.payment_method
                                                }

                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Payment Status
                                            </span>

                                            <strong>

                                                {
                                                    selectedOrder.payment_status
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

                                        {" "} Items

                                    </strong>

                                </div>


                                <div className="order-products-list">

                                    {

                                        selectedOrder.items?.map(
                                            (item) => {

                                                const imageUrl =

                                                    item.product_image

                                                        ?

                                                        item.product_image.startsWith(
                                                            "http"
                                                        )

                                                            ?

                                                            item.product_image

                                                            :

                                                            `http://127.0.0.1:8000${item.product_image}`

                                                        :

                                                        "https://via.placeholder.com/120";


                                                return (

                                                    <div
                                                        className="order-product-item"
                                                        key={item.id}
                                                    >

                                                        <div className="order-product-image">

                                                            <img
                                                                src={imageUrl}
                                                                alt={
                                                                    item.product_name
                                                                }
                                                            />

                                                        </div>


                                                        <div className="order-product-main">

                                                            <h4>

                                                                {
                                                                    item.product_name
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


                                                        <div className="order-product-price">

                                                            <span>
                                                                Price
                                                            </span>

                                                            <strong>

                                                                ₹{
                                                                    Number(
                                                                        item.price
                                                                    ).toFixed(2)
                                                                }

                                                            </strong>

                                                        </div>


                                                        <div className="order-product-subtotal">

                                                            <span>
                                                                Subtotal
                                                            </span>

                                                            <strong>

                                                                ₹{
                                                                    Number(
                                                                        item.subtotal
                                                                    ).toFixed(2)
                                                                }

                                                            </strong>

                                                        </div>

                                                    </div>

                                                );

                                            }

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

                                        ₹{
                                            Number(
                                                selectedOrder.total_amount
                                            ).toFixed(2)
                                        }

                                    </h2>

                                </div>


                                {

                                    [
                                        "Pending",
                                        "Placed",
                                        "Confirmed"
                                    ].includes(
                                        selectedOrder.status
                                    ) && (

                                        <button

                                            className="cancel-order-btn"

                                            onClick={() =>
                                                cancelOrder(
                                                    selectedOrder.id
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

                                                                    step ===
                                                                        "Delivered" &&
                                                                    <FaCheckCircle />

                                                                }

                                                                {

                                                                    step ===
                                                                        "Cancelled" &&
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
                                                                            index <
                                                                            currentStep
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