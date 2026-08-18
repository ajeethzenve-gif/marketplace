import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../admin/Coupon.css";

function CouponList() {

    const [coupons, setCoupons] = useState([]);

    useEffect(() => {
        loadCoupons();
    }, []);

    const loadCoupons = async () => {

        try {

            const response = await axios.get(
                "http://127.0.0.1:8000/api/coupons/",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`
                    }
                }
            );

            setCoupons(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="coupon-page">

            <div className="coupon-header">

                <h2>Coupon Management</h2>

                <Link
                    to="/admin/coupons/add"
                    className="btn btn-primary"
                >
                    Add Coupon
                </Link>

            </div>

            <table className="coupon-table">

                <thead>

                    <tr>

                        <th>Code</th>
                        <th>Type</th>
                        <th>Discount</th>
                        <th>Minimum Order</th>
                        <th>Expiry</th>
                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    {
                        coupons.map((coupon) => (

                            <tr key={coupon.id}>

                                <td>{coupon.code}</td>

                                <td>{coupon.discount_type}</td>

                                <td>{coupon.discount_value}</td>

                                <td>₹{coupon.minimum_order_value}</td>

                                <td>{coupon.expiry_date}</td>

                                <td>

                                    {
                                        coupon.is_active
                                            ? "Active"
                                            : "Inactive"
                                    }

                                </td>

                            </tr>

                        ))
                    }

                </tbody>

            </table>

        </div>

    );

}

export default CouponList;