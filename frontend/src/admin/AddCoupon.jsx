import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddCoupon() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        code: "",

        discount_type: "Percentage",

        discount_value: "",

        minimum_order_value: "",

        maximum_discount: "",

        expiry_date: "",

        usage_limit: 100,

        is_active: true

    });

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setFormData({

            ...formData,

            [name]: type === "checkbox" ? checked : value

        });

    };

    const saveCoupon = async (e) => {

        e.preventDefault();

        try {

            await axios.post(

                "http://127.0.0.1:8000/api/coupons/",

                formData,

                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`
                    }
                }

            );

            alert("Coupon created successfully.");

            navigate("/admin/coupons");

        } catch (error) {

            console.log(error);

            alert("Unable to create coupon.");

        }

    };

    return (

        <form onSubmit={saveCoupon} className="coupon-form">

            <h2>Create Coupon</h2>

            <div className="form-row">

                <div className="form-group">
                    <label>Coupon Code</label>
                    <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Discount Type</label>
                    <select
                        name="discount_type"
                        value={formData.discount_type}
                        onChange={handleChange}
                    >
                        <option value="Percentage">Percentage</option>
                        <option value="Flat">Flat</option>
                    </select>
                </div>

            </div>

            <div className="form-row">

                <div className="form-group">
                    <label>Discount Value</label>
                    <input
                        type="number"
                        name="discount_value"
                        value={formData.discount_value}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Minimum Order Value</label>
                    <input
                        type="number"
                        name="minimum_order_value"
                        value={formData.minimum_order_value}
                        onChange={handleChange}
                    />
                </div>

            </div>

            <div className="form-row">

                <div className="form-group">
                    <label>Maximum Discount</label>
                    <input
                        type="number"
                        name="maximum_discount"
                        value={formData.maximum_discount}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                        type="datetime-local"
                        name="expiry_date"
                        value={formData.expiry_date}
                        onChange={handleChange}
                    />
                </div>

            </div>

            <div className="form-row">

                <div className="form-group">
                    <label>Usage Limit</label>
                    <input
                        type="number"
                        name="usage_limit"
                        value={formData.usage_limit}
                        onChange={handleChange}
                    />
                </div>

                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                    />

                    <label htmlFor="is_active">
                        Active Coupon
                    </label>
                </div>

            </div>

            <button type="submit">
                Save Coupon
            </button>

        </form>

    );

}

export default AddCoupon;