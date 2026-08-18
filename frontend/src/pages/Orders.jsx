import { useEffect, useState } from "react";
import axios from "axios";
import {
    FaClipboardCheck,
    FaBoxOpen,
    FaTruck,
    FaHome,
    FaCheckCircle,
} from "react-icons/fa";
import "../styles/Orders.css";

function Orders() {

    const [orders, setOrders] = useState([]);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [activeTab, setActiveTab] = useState("history");

    useEffect(() => {

        loadOrders();

    }, []);

    const loadOrders = async () => {

        try {

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

    };

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

        }

        catch (error) {

            console.log(error);

        }

    };
    const normalSteps = [
        "Pending",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
    ];

    // Cancelled Order Steps
    const cancelledSteps = [
        "Pending",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Cancelled",
    ];

    // Decide which tracker to show
    const steps =
        selectedOrder?.status === "Cancelled"
            ? cancelledSteps
            : normalSteps;

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
                        Authorization: `Bearer ${localStorage.getItem("access")}`
                    }
                }

            );

            alert("Order cancelled successfully.");

            loadOrders();

            if (selectedOrder && selectedOrder.id === orderId) {

                loadOrderDetails(orderId);

            }

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Unable to cancel order."
            );

        }

    };
// Current active step
    const currentStep =
        selectedOrder?.status === "Cancelled"
            ? steps.length - 1
            : steps.indexOf(selectedOrder?.status);

    return (

        <div className="orders-page">

            <h1>My Orders</h1>

            <div className="tabs">

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
                    Order History
                </button>

                <button

                    className={
                        activeTab === "details"
                            ? "active-tab"
                            : ""
                    }

                    disabled={!selectedOrder}

                >
                    Order Details

                </button>

            </div>

            {activeTab === "history" && (

    <div className="orders-list">

        {orders.length === 0 ? (

            <div className="empty-orders">

                <h3>No Orders Found</h3>

            </div>

        ) : (

            orders.map((order) => (

                <div
                    className="order-card"
                    key={order.id}
                >

                    <div className="order-top">

                        <div>

                            <p>

                                {new Date(
                                    order.order_date
                                ).toLocaleDateString()}

                            </p>

                        </div>

                        <span
                            className={`status ${order.status.toLowerCase()}`}
                        >

                            {order.status}

                        </span>

                    </div>

                    <div className="order-body">

                        <p>

                            <strong>Total Amount</strong>

                        </p>

                        <h2>

                            ₹{order.total_amount}

                        </h2>

                        <p>

                            Total Items :
                            {order.total_items}

                        </p>

                    </div>

                    <button

                        className="order_view-btn"

                        onClick={() =>
                            loadOrderDetails(order.id)
                        }

                    >

                        View Details

                    </button>

                </div>

            ))

        )}

    </div>

)}
        {

activeTab === "details" && selectedOrder && (

    <div className="order-details">

        <div className="details-header">



            <span
                className={`status ${selectedOrder.status.toLowerCase()}`}
            >

                {selectedOrder.status}

            </span>

        </div>

        <div className="customer-info">

            <p>

                <strong>Customer :</strong>

                {selectedOrder.customer_name}

            </p>

            <p>

                <strong>Order Date :</strong>

                {

                    new Date(

                        selectedOrder.order_date

                    ).toLocaleString()

                }

            </p>

            <div className="shipping-address">

                <strong>Shipping Address :</strong>

                {selectedOrder.shipping_address ? (

                    <div className="mt-2">

                        <p>{selectedOrder.shipping_address.full_name}</p>

                        <p>{selectedOrder.shipping_address.phone_number}</p>

                        <p>{selectedOrder.shipping_address.address_line1}</p>

                        {selectedOrder.shipping_address.address_line2 && (
                            <p>{selectedOrder.shipping_address.address_line2}</p>
                        )}

                        <p>
                            {selectedOrder.shipping_address.city},
                            {" "}
                            {selectedOrder.shipping_address.state}
                        </p>

                        <p>
                            {selectedOrder.shipping_address.country}
                            {" - "}
                            {selectedOrder.shipping_address.postal_code}
                        </p>

                    </div>

                ) : (

                    <p>No address available.</p>

                )}

            </div>
            <p>

                <strong>Payment Method :</strong>

                {selectedOrder.payment_method}

            </p>

            <p>

                <strong>Payment Status :</strong>

                {selectedOrder.payment_status}

            </p>

        </div>

        <h3>

            Products

        </h3>

        <table className="details-table">

            <thead>

                <tr>

                    <th>Image</th>

                    <th>Product</th>

                    <th>Price</th>

                    <th>Quantity</th>

                    <th>Subtotal</th>

                </tr>

            </thead>

            <tbody>

                {

                    selectedOrder.items.map((item) => (

                        <tr key={item.id}>

                            <td>

                                <img

                                    src={`http://127.0.0.1:8000${item.product_image}`}

                                    alt={item.product_name}

                                    className="order-image"

                                />

                            </td>

                            <td>

                                {item.product_name}

                            </td>

                            <td>

                                ₹{item.price}

                            </td>

                            <td>

                                {item.quantity}

                            </td>

                            <td>

                                ₹{item.subtotal}

                            </td>

                        </tr>

                    ))

                }

            </tbody>

        </table>

        <div className="order-total">

            <h2>

                Total : ₹{selectedOrder.total_amount}

            </h2>
           {["Pending", "Placed", "Confirmed"].includes(selectedOrder.status) && (
                <button
                    className="cancel-order-btn"
                    onClick={() => cancelOrder(selectedOrder.id)}
                >
                    Cancel Order
                </button>
            )}

        </div>

        <div className="tracking">

            <h3>

                Order Tracking

            </h3>

 <div className="order-tracker">

    {steps.map((step, index) => (

        <div
            className="tracker-step"
            key={step}
        >

            <div
                className={
                    step === "Cancelled"
                        ? "tracker-icon cancelled"
                        : index <= currentStep
                        ? "tracker-icon active"
                        : "tracker-icon"
                }
            >

                {index === 0 && <FaClipboardCheck />}

                {index === 1 && <FaBoxOpen />}

                {index === 2 && <FaTruck />}

                {index === 3 && <FaHome />}

                {step === "Delivered" && <FaCheckCircle />}

                {step === "Cancelled" && (
                    <span style={{fontWeight:"bold"}}>✖</span>
                )}

            </div>

            <p>{step}</p>

            {index !== steps.length - 1 && (

                <div
                    className={
                        step === "Cancelled"
                            ? "tracker-line cancelled"
                            : index < currentStep
                            ? "tracker-line active"
                            : "tracker-line"
                    }
                ></div>

            )}

        </div>

    ))}

</div>
        </div>

        <button

            className="back-btn"

            onClick={() => setActiveTab("history")}

        >

            Back to Orders

        </button>

    </div>

    )}

        </div>

    );

}

export default Orders;