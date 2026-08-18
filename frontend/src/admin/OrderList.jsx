import { useEffect, useState } from "react";
import axios from "axios";
import "./Order.css";

function OrderList() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const role = localStorage.getItem("role");
    const token = localStorage.getItem("access");

    useEffect(() => {

        if (role === "Admin" || role === "Staff") {

            loadOrders();

        }

    }, [role]);

    // =====================================
    // LOAD ALL ORDERS
    // =====================================

    const loadOrders = async () => {

        setLoading(true);

        try {

            const response = await axios.get(

                "http://127.0.0.1:8000/api/orders/admin/",

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );
            console.log("Orders API Response:", response.data);

            setOrders(response.data);

        }

        catch (error) {

            console.log(error);

            if (error.response?.status === 401) {

                alert("Session expired. Please login again.");

                localStorage.clear();

                window.location.href = "/login";

            }

            else {

                alert(

                    error.response?.data?.message ||

                    "Unable to load orders."

                );

            }

        }

        finally {

            setLoading(false);

        }

    };

    // =====================================
    // UPDATE ORDER STATUS
    // =====================================

    const updateStatus = async (id, status) => {

        setUpdatingId(id);

        try {

            await axios.patch(

                `http://127.0.0.1:8000/api/orders/status/${id}/`,

                {

                    status

                },

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setOrders((previousOrders) =>

                previousOrders.map((order) =>

                    order.id === id

                        ? {

                              ...order,

                              status: status

                          }

                        : order

                )

            );

        }

        catch (error) {

            console.log(error);

            alert(

                error.response?.data?.message ||

                "Unable to update order status."

            );

        }

        finally {

            setUpdatingId(null);

        }

    };

    // =====================================
    // ACCESS DENIED
    // =====================================

    if (!(role === "Admin" || role === "Staff")) {

        return (

            <div className="access-denied">

                <h2>Access Denied</h2>

                <p>

                    You don't have permission to view this page.

                </p>

            </div>

        );

    }
        return (

        <div className="order-page">

            <div className="page-header">

                <h2>Order Management</h2>

            </div>

            <div className="table-container">

                <table className="order-table">

                    <thead>

                        <tr>

                            <th>Sl.No</th>

                            <th>Order ID</th>

                            <th>Customer</th>

                            <th style={{ textAlign: "center" }}>Items</th>

                            <th>Total</th>

                            <th>Payment</th>

                            <th>Method</th>

                            <th>Status</th>

                            <th>Date</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            loading ? (

                                <tr>

                                    <td colSpan="11">

                                        Loading Orders...

                                    </td>

                                </tr>

                            ) : orders.length === 0 ? (

                                <tr>

                                    <td colSpan="11">

                                        No Orders Found

                                    </td>

                                </tr>

                            ) : (

                                orders.map((order, index) => (

                                    <tr key={order.id}>

                                        <td>

                                            {index + 1}

                                        </td>

                                        <td>

                                            #{order.id}

                                        </td>

                                        <td>

                                            <strong>

                                                {order.customer_name}

                                            </strong>

                                        </td>

                                        <td style={{ textAlign: "center" }}>

                                            {order.total_items}

                                        </td>

                                        <td>

                                            ₹{order.total_amount}

                                        </td>

                                        <td>

                                            <span

                                                className={

                                                    order.payment_status === "Paid"

                                                        ? "paid"

                                                        : "pending"

                                                }

                                            >

                                                {

                                                    order.payment_status

                                                }

                                            </span>

                                        </td>

                                        <td>

                                            {order.payment_method}

                                        </td>

                                        <td>

                                            <span

                                                className={`status-badge ${order.status.toLowerCase()}`}

                                            >

                                                {order.status}

                                            </span>

                                        </td>

                                        <td>

                                            {

                                                new Date(

                                                    order.order_date

                                                ).toLocaleDateString()

                                            }

                                        </td>

                                        <td>

                                            <select

                                                value={order.status}

                                                disabled={

                                                    updatingId === order.id ||

                                                    order.status === "Delivered" ||

                                                    order.status === "Cancelled"

                                                }

                                                onChange={(e) =>

                                                    updateStatus(

                                                        order.id,

                                                        e.target.value

                                                    )

                                                }

                                            >

                                                <option value="Pending">

                                                    Pending

                                                </option>

                                                <option value="Confirmed">

                                                    Confirmed

                                                </option>

                                                <option value="Packed">

                                                    Packed

                                                </option>

                                                <option value="Shipped">

                                                    Shipped

                                                </option>

                                                <option value="Delivered">

                                                    Delivered

                                                </option>

                                                <option value="Cancelled">

                                                    Cancelled

                                                </option>

                                            </select>

                                        </td>

                                    </tr>

                                ))

                            )

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default OrderList;