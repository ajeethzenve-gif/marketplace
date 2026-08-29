import { Link, useNavigate } from "react-router-dom";

import {
    FaSearch,
    FaUserCircle,
    FaPaw
} from "react-icons/fa";

import {
    MdOutlineShoppingCart,
    MdOutlineFavoriteBorder,
    MdOutlineLocalOffer,
    MdAccountBalanceWallet
} from "react-icons/md";

import { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/logo/Zenve - 01 (1).png";
import "../styles/Navbar.css";


function Navbar({ toggleSidebar }) {

    const navigate = useNavigate();

    // =====================================================
    // LOCAL STORAGE
    // =====================================================

    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("access");

    const isAdminOrStaff =
        role === "Admin" ||
        role === "Staff";


    // =====================================================
    // STATES
    // =====================================================

    const [profileImage, setProfileImage] = useState("");
    const [search, setSearch] = useState("");
    const [hasPet, setHasPet] = useState(false);

    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);


    // =====================================================
    // LOAD USER DATA
    // =====================================================

    useEffect(() => {

        if (!token) {

            setCartCount(0);
            setWishlistCount(0);
            setHasPet(false);
            setProfileImage("");

            return;
        }


        // Profile is required for both Customer and Admin/Staff
        loadProfile();


        // =================================================
        // CUSTOMER DATA ONLY
        // =================================================

        if (!isAdminOrStaff) {

            loadPetDetails();
            loadCartCount();
            loadWishlistCount();

        } else {

            // Make sure admin doesn't keep old customer data
            setCartCount(0);
            setWishlistCount(0);
            setHasPet(false);

        }


        // =================================================
        // CART EVENT
        // =================================================

        const handleCartUpdate = () => {

            if (!isAdminOrStaff) {
                loadCartCount();
            }

        };


        // =================================================
        // WISHLIST EVENT
        // =================================================

        const handleWishlistUpdate = () => {

            if (!isAdminOrStaff) {
                loadWishlistCount();
            }

        };


        window.addEventListener(
            "cartUpdated",
            handleCartUpdate
        );

        window.addEventListener(
            "wishlistUpdated",
            handleWishlistUpdate
        );


        // =================================================
        // CLEANUP
        // =================================================

        return () => {

            window.removeEventListener(
                "cartUpdated",
                handleCartUpdate
            );

            window.removeEventListener(
                "wishlistUpdated",
                handleWishlistUpdate
            );

        };

    }, [token, isAdminOrStaff]);


    // =====================================================
    // LOAD CART COUNT
    // =====================================================

    const loadCartCount = async () => {

        if (!token) {

            setCartCount(0);

            return;
        }


        try {

            const response = await axios.get(
                "http://127.0.0.1:8000/api/cart/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            const data = response.data;


            if (Array.isArray(data)) {

                const totalQuantity =
                    data.reduce(
                        (total, item) =>
                            total +
                            Number(item.quantity || 1),
                        0
                    );

                setCartCount(totalQuantity);

            }

            else if (Array.isArray(data.items)) {

                const totalQuantity =
                    data.items.reduce(
                        (total, item) =>
                            total +
                            Number(item.quantity || 1),
                        0
                    );

                setCartCount(totalQuantity);

            }

            else if (
                data.total_items !== undefined
            ) {

                setCartCount(
                    Number(data.total_items)
                );

            }

            else if (
                data.count !== undefined
            ) {

                setCartCount(
                    Number(data.count)
                );

            }

            else {

                setCartCount(0);

            }

        }

        catch (error) {

            console.error(
                "Cart count loading error:",
                error.response?.data ||
                error.message
            );


            const savedCartCount =
                localStorage.getItem("cartCount");


            setCartCount(
                Number(savedCartCount || 0)
            );

        }

    };


    // =====================================================
    // LOAD WISHLIST COUNT
    // =====================================================

    const loadWishlistCount = async () => {

        if (!token) {

            setWishlistCount(0);

            return;
        }


        try {

            const response = await axios.get(
                "http://127.0.0.1:8000/api/wishlist/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            const data = response.data;


            if (Array.isArray(data)) {

                setWishlistCount(data.length);

            }

            else if (
                Array.isArray(data.results)
            ) {

                setWishlistCount(
                    data.results.length
                );

            }

            else if (
                Array.isArray(data.items)
            ) {

                setWishlistCount(
                    data.items.length
                );

            }

            else if (
                data.count !== undefined
            ) {

                setWishlistCount(
                    Number(data.count)
                );

            }

            else if (
                data.total_items !== undefined
            ) {

                setWishlistCount(
                    Number(data.total_items)
                );

            }

            else {

                setWishlistCount(0);

            }

        }

        catch (error) {

            console.error(
                "Wishlist count loading error:",
                error.response?.data ||
                error.message
            );


            const savedWishlistCount =
                localStorage.getItem(
                    "wishlistCount"
                );


            setWishlistCount(
                Number(savedWishlistCount || 0)
            );

        }

    };


    // =====================================================
    // LOAD PROFILE
    // =====================================================

    const loadProfile = async () => {

        try {

            const response = await axios.get(
                "http://127.0.0.1:8000/api/accounts/profile/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            if (response.data.profile_image) {

                const image =
                    response.data.profile_image;


                if (image.startsWith("http")) {

                    setProfileImage(image);

                }

                else {

                    setProfileImage(
                        `http://127.0.0.1:8000${image}`
                    );

                }

            }

            else {

                setProfileImage("");

            }

        }

        catch (error) {

            console.log(
                "Profile loading error:",
                error.response?.data ||
                error.message
            );

            setProfileImage("");

        }

    };


    // =====================================================
    // LOAD PET DETAILS
    // =====================================================

    const loadPetDetails = async () => {

        try {

            const response = await axios.get(
                "http://127.0.0.1:8000/api/accounts/pets/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            const pets =
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || [];


            setHasPet(pets.length > 0);

        }

        catch (error) {

            console.log(
                "Pet loading error:",
                error.response?.data ||
                error.message
            );

            setHasPet(false);

        }

    };


    // =====================================================
    // PRODUCT SEARCH
    // =====================================================

    const handleSearch = (e) => {

        const value = e.target.value;

        setSearch(value);


        if (value.trim()) {

            navigate(
                `/products?search=${encodeURIComponent(value)}`
            );

        }

        else {

            navigate("/products");

        }

    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("cartCount");
        localStorage.removeItem("wishlistCount");

        setCartCount(0);
        setWishlistCount(0);
        setHasPet(false);
        setProfileImage("");

        navigate("/login");

        window.location.reload();

    };


    // =====================================================
    // ADMIN / STAFF NAVBAR
    // =====================================================

    if (isAdminOrStaff) {

        return (

            <header className="navbar admin-simple-navbar">

                {/* =================================================
                    ADMIN LOGO
                ================================================= */}

                <div className="logo">

                    <Link
                        to="/products/manage"
                        className="logo-link"
                    >

                        <img
                            src={logo}
                            alt="Zenve"
                            className="navbar-logo"
                        />

                    </Link>

                </div>


                {/* =================================================
                    ADMIN PROFILE
                ================================================= */}

                <div className="profile-menu admin-profile-menu">

                    <Link
                        to="/profile"
                        className="profile-link admin-profile-link"
                    >

                        {profileImage ? (

                            <img
                                src={profileImage}
                                className="avatar-img"
                                alt="Profile"
                            />

                        ) : (

                            <FaUserCircle
                                size={40}
                            />

                        )}

                        <p>
                            {username || "Admin"}
                        </p>

                    </Link>


                    {/* =================================================
                        ADMIN HOVER POPUP
                    ================================================= */}

                    <div className="profile-popup admin-profile-popup">

                        <h4>
                            Hello, {username || "Admin"}
                        </h4>


                        <Link
                            to="/profile"
                            className="popup-btn"
                        >
                            My Profile
                        </Link>


                        <button
                            type="button"
                            onClick={handleLogout}
                            className="popup-btn logout-popup-btn"
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </header>

        );

    }


    // =====================================================
    // CUSTOMER NAVBAR
    // =====================================================

    return (

        <>

            {/* =================================================
                TOP BAR
            ================================================= */}

            <div className="top-bar">

                <div className="top-left">

                    <span>
                        🚚 Free Delivery on orders above ₹99
                    </span>

                </div>


                <div className="top-right">

                    <Link to="/orders">
                        Track Order
                    </Link>

                    <Link to="/help">
                        Help Center
                    </Link>

                    <Link to="/download-app">
                        Download App
                    </Link>

                </div>

            </div>


            {/* =================================================
                MAIN NAVBAR
            ================================================= */}

            <header className="navbar">

                {/* LOGO */}

                <div className="logo">

                    <Link
                        to="/home"
                        className="logo-link"
                    >

                        <img
                            src={logo}
                            alt="Zenve"
                            className="navbar-logo"
                        />

                    </Link>

                </div>


                {/* SEARCH */}

                <div className="search-container">

                    <input
                        type="text"
                        placeholder="Search medicines, pet food, products..."
                        value={search}
                        onChange={handleSearch}
                    />


                    <button
                        type="button"
                        className="search-btn"
                    >

                        <FaSearch />

                    </button>

                </div>


                {/* =================================================
                    NAV ICONS
                ================================================= */}

                <div className="nav-icons">

                    {/* OFFERS */}

                    <Link to="/offers">

                        <MdOutlineLocalOffer />

                        <p>
                            Offers
                        </p>

                    </Link>


                    {/* WISHLIST */}

                    <Link
                        to="/wishlists"
                        className="nav-count-link"
                    >

                        <div className="icon-wrapper">

                            <MdOutlineFavoriteBorder />

                            {wishlistCount > 0 && (

                                <span className="wishlist-count">
                                    {wishlistCount}
                                </span>

                            )}

                        </div>

                        <p>
                            Wishlist
                        </p>

                    </Link>


                    {/* CART */}

                    <Link
                        to="/cart"
                        className="nav-count-link"
                    >

                        <div className="icon-wrapper">

                            <MdOutlineShoppingCart />

                            {cartCount > 0 && (

                                <span className="cart-count">
                                    {cartCount}
                                </span>

                            )}

                        </div>

                        <p>
                            Cart
                        </p>

                    </Link>


                    {/* =================================================
                        WALLET
                    ================================================= */}

                    {username && hasPet && (
                    <Link
                        to="/wallet"
                        className="nav-count-link"
                    >

                        <div className="icon-wrapper">

                            <MdAccountBalanceWallet />

                        </div>

                        <p>
                            Wallet
                        </p>

                    </Link>
                    )}


                    {/* PET PROFILE */}

                    {username && hasPet && (

                        <Link
                            to="/pets"
                            className="pet-profile-nav"
                            title="My Pets"
                        >

                            <FaPaw />

                            <p>
                                My Pets
                            </p>

                        </Link>

                    )}


                    {/* PROFILE */}

                    <div className="profile-menu">

                        <Link
                            to={
                                username
                                    ? "/profile"
                                    : "/login"
                            }
                            className="profile-link"
                        >

                            {profileImage ? (

                                <img
                                    src={profileImage}
                                    className="avatar-img"
                                    alt="Profile"
                                />

                            ) : (

                                <FaUserCircle
                                    size={35}
                                />

                            )}

                            <p>
                                {username || "Login"}
                            </p>

                        </Link>


                        {/* PROFILE POPUP */}

                        <div className="profile-popup">

                            {username ? (

                                <>

                                    <h4>
                                        Hello, {username}
                                    </h4>


                                    <Link
                                        to="/profile"
                                        className="popup-btn"
                                    >
                                        My Profile
                                    </Link>


                                    {hasPet && (

                                        <Link
                                            to="/pets"
                                            className="popup-btn"
                                        >
                                            🐾 My Pets
                                        </Link>

                                    )}


                                    <Link
                                        to="/orders"
                                        className="popup-btn"
                                    >
                                        My Orders
                                    </Link>


                                    {/* WALLET IN PROFILE MENU */}

                                    <Link
                                        to="/wallet"
                                        className="popup-btn"
                                    >
                                        💳 My Wallet
                                    </Link>


                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="popup-btn logout-popup-btn"
                                    >
                                        Logout
                                    </button>

                                </>

                            ) : (

                                <>

                                    <h4>
                                        Welcome
                                    </h4>

                                    <p>
                                        Please login to continue.
                                    </p>

                                    <Link
                                        to="/login"
                                        className="popup-btn"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/register"
                                        className="popup-btn"
                                    >
                                        Sign Up
                                    </Link>

                                </>

                            )}

                        </div>

                    </div>

                </div>

            </header>


            {/* =================================================
                BOTTOM MENU
            ================================================= */}

            {/*

            <nav className="bottom-menu">

                <Link to="/products?product_type=Medicine&product_type=Supplements">
                    Medicines & Supplements
                </Link>

                <Link
                    to="/prescription/upload"
                    className="prescription-link"
                >
                    📄 Upload Prescription
                </Link>

                <Link to="/products?product_type=food&product_type=Other">
                    Pet Food & Products
                </Link>

                <Link to="/products?product_type=FarmSupplies">
                    Farm Supplies
                </Link>

                <Link to="/products?product_type=VetEquipment">
                    Vet Equipment
                </Link>

                <Link to="/home-visit">
                    Home Visit Service
                </Link>

                <Link to="/adoption">
                    Adoption Platform
                </Link>

            </nav>

            */}

        </>

    );

}


export default Navbar;