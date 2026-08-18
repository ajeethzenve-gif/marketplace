import { Link } from "react-router-dom";
import {
    FaTruck,
    FaCheckCircle,
    FaUserMd,
    FaMapMarkerAlt,
    FaQuestionCircle,
    FaMobileAlt,
} from "react-icons/fa";

import "../styles/TopBar.css";

function TopBar() {
    return (
        <div className="topbar">

            <div className="topbar-left">

                <div className="topbar-item">
                    <FaTruck className="topbar-icon" />
                    <span>Free Delivery on orders above ₹999</span>
                </div>

                <div className="topbar-item">
                    <FaCheckCircle className="topbar-icon" />
                    <span>100% Genuine Products</span>
                </div>

                <div className="topbar-item">
                    <FaUserMd className="topbar-icon" />
                    <span>Veterinarian Approved</span>
                </div>

            </div>

            <div className="topbar-right">

                <Link to="/orders">
                    <FaMapMarkerAlt />
                    <span>Track Order</span>
                </Link>

                <Link to="/help">
                    <FaQuestionCircle />
                    <span>Help Center</span>
                </Link>

                <Link to="/download-app">
                    <FaMobileAlt />
                    <span>Download App</span>
                </Link>

            </div>

        </div>
    );
}

export default TopBar;