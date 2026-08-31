import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import {
    FaSearch,
    FaUserCircle,
    FaPaw,
    FaBars,
    FaTimes,
    FaHome,
    FaTag,
    FaPills,
    FaShoppingCart,
    FaHeart,
    FaBox,
    FaUser,
    FaWallet,
    FaHospital,
    FaFilePrescription,
    FaTractor,
    FaStethoscope,
    FaSignOutAlt,
} from "react-icons/fa";

import {
    MdOutlineFavoriteBorder,
    MdOutlineLocalOffer,
    MdAccountBalanceWallet,
} from "react-icons/md";

import logo from "../assets/logo/Zenve - 01 (1).png";

import "../styles/Navbar.css";


function Navbar() {

    const navigate = useNavigate();

    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("access");

    const isAdminOrStaff =
        role === "Admin" ||
        role === "Staff";


    /* =====================================================
       STATES
    ===================================================== */

    const [profileImage, setProfileImage] = useState("");
    const [search, setSearch] = useState("");
    const [hasPet, setHasPet] = useState(false);

    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


    /* =====================================================
       LOAD USER DATA
    ===================================================== */

    useEffect(() => {

        if (!token) {

            setProfileImage("");
            setHasPet(false);
            setCartCount(0);
            setWishlistCount(0);

            return;
        }


        loadProfile();


        if (!isAdminOrStaff) {

            loadPetDetails();
            loadCartCount();
            loadWishlistCount();

        } else {

            setHasPet(false);
            setCartCount(0);
            setWishlistCount(0);

        }


        const handleCartUpdate = () => {

            if (!isAdminOrStaff) {
                loadCartCount();
            }

        };


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


    /* =====================================================
       CLOSE MOBILE MENU ON DESKTOP
    ===================================================== */

    useEffect(() => {

        const handleResize = () => {

            if (window.innerWidth > 768) {
                setMobileMenuOpen(false);
            }

        };


        window.addEventListener(
            "resize",
            handleResize
        );


        return () => {

            window.removeEventListener(
                "resize",
                handleResize
            );

        };

    }, []);


    /* =====================================================
       LOCK BODY SCROLL WHEN MENU OPEN
    ===================================================== */

    useEffect(() => {

        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }


        return () => {
            document.body.style.overflow = "";
        };

    }, [mobileMenuOpen]);


    /* =====================================================
       PROFILE
    ===================================================== */

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


            const image =
                response.data?.profile_image;


            if (!image) {

                setProfileImage("");

                return;
            }


            if (image.startsWith("http")) {

                setProfileImage(image);

            } else {

                setProfileImage(
                    `http://127.0.0.1:8000${image}`
                );

            }

        } catch (error) {

            console.error(
                "Profile loading error:",
                error.response?.data || error.message
            );

            setProfileImage("");

        }

    };


    /* =====================================================
       PET DETAILS
    ===================================================== */

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


            const data = response.data;


            const pets = Array.isArray(data)
                ? data
                : Array.isArray(data?.results)
                    ? data.results
                    : [];


            setHasPet(pets.length > 0);

        } catch (error) {

            console.error(
                "Pet loading error:",
                error.response?.data || error.message
            );

            setHasPet(false);

        }

    };


    /* =====================================================
       CART COUNT
    ===================================================== */

    const loadCartCount = async () => {

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

                const count = data.reduce(
                    (total, item) =>
                        total +
                        Number(item.quantity || 1),
                    0
                );

                setCartCount(count);

            } else if (Array.isArray(data?.items)) {

                const count = data.items.reduce(
                    (total, item) =>
                        total +
                        Number(item.quantity || 1),
                    0
                );

                setCartCount(count);

            } else if (
                data?.total_items !== undefined
            ) {

                setCartCount(
                    Number(data.total_items)
                );

            } else if (
                data?.count !== undefined
            ) {

                setCartCount(
                    Number(data.count)
                );

            } else {

                setCartCount(0);

            }

        } catch (error) {

            console.error(
                "Cart count error:",
                error.response?.data || error.message
            );

            const saved =
                localStorage.getItem("cartCount");

            setCartCount(
                Number(saved || 0)
            );

        }

    };


    /* =====================================================
       WISHLIST COUNT
    ===================================================== */

    const loadWishlistCount = async () => {

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

            } else if (Array.isArray(data?.results)) {

                setWishlistCount(
                    data.results.length
                );

            } else if (Array.isArray(data?.items)) {

                setWishlistCount(
                    data.items.length
                );

            } else if (
                data?.count !== undefined
            ) {

                setWishlistCount(
                    Number(data.count)
                );

            } else {

                setWishlistCount(0);

            }

        } catch (error) {

            console.error(
                "Wishlist count error:",
                error.response?.data || error.message
            );

            const saved =
                localStorage.getItem(
                    "wishlistCount"
                );

            setWishlistCount(
                Number(saved || 0)
            );

        }

    };


    /* =====================================================
       SEARCH
    ===================================================== */

    const handleSearch = (event) => {

        const value = event.target.value;

        setSearch(value);


        if (value.trim()) {

            navigate(
                `/products?search=${encodeURIComponent(value)}`
            );

        }

    };


    const handleSearchSubmit = () => {

        const value = search.trim();


        if (value) {

            navigate(
                `/products?search=${encodeURIComponent(value)}`
            );

        } else {

            navigate("/products");

        }

    };


    const handleSearchKeyDown = (event) => {

        if (event.key === "Enter") {

            handleSearchSubmit();

        }

    };


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const openMobileMenu = () => {

        setMobileMenuOpen(true);

    };


    const closeMobileMenu = () => {

        setMobileMenuOpen(false);

    };


    const goToPage = (path) => {

        setMobileMenuOpen(false);

        navigate(path);

    };


    /* =====================================================
       LOGOUT
    ===================================================== */

    const handleLogout = () => {

        setMobileMenuOpen(false);

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("cartCount");
        localStorage.removeItem("wishlistCount");

        setProfileImage("");
        setHasPet(false);
        setCartCount(0);
        setWishlistCount(0);

        navigate("/login");

        window.location.reload();

    };


    /* =====================================================
       ADMIN / STAFF NAVBAR
    ===================================================== */

    if (isAdminOrStaff) {

        return (
            <>
                <header className="navbar admin-simple-navbar">

                    {/* LOGO */}

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


                    {/* PROFILE */}

                    <div className="profile-menu">

                        <Link
                            to="/profile"
                            className="profile-link admin-profile-link"
                        >

                            {profileImage ? (

                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="avatar-img"
                                />

                            ) : (

                                <FaUserCircle />

                            )}

                            <p>
                                {username || "Admin"}
                            </p>

                        </Link>


                        <div className="profile-popup">

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
                                className="popup-btn logout-popup-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </div>

                    </div>


                    {/* MENU */}

                    <button
                        type="button"
                        className="mobile-menu-btn"
                        onClick={openMobileMenu}
                        aria-label="Open menu"
                    >

                        {mobileMenuOpen
                            ? <FaTimes />
                            : <FaBars />
                        }

                    </button>

                </header>


                {/* ADMIN MOBILE DRAWER */}

                {mobileMenuOpen && (

                    <>
                        <div
                            className="mobile-menu-overlay"
                            onClick={closeMobileMenu}
                        />

                        <aside className="mobile-drawer">

                            <div className="mobile-drawer-header">

                                <div className="mobile-drawer-title">

                                    <FaUserCircle />

                                    <div>

                                        <strong>
                                            {username || "Admin"}
                                        </strong>

                                        <small>
                                            {role || "Admin"}
                                        </small>

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    className="drawer-close-btn"
                                    onClick={closeMobileMenu}
                                >
                                    <FaTimes />
                                </button>

                            </div>


                            <div className="mobile-drawer-body">

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage(
                                            "/products/manage"
                                        )
                                    }
                                >
                                    <FaBox />

                                    <span>
                                        Manage Products
                                    </span>

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage("/profile")
                                    }
                                >
                                    <FaUser />

                                    <span>
                                        My Profile
                                    </span>

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage("/orders")
                                    }
                                >
                                    <FaBox />

                                    <span>
                                        Orders
                                    </span>

                                </button>


                                <button
                                    type="button"
                                    className="mobile-logout"
                                    onClick={handleLogout}
                                >
                                    <FaSignOutAlt />

                                    <span>
                                        Logout
                                    </span>

                                </button>

                            </div>

                        </aside>
                    </>
                )}

            </>
        );

    }


    /* =====================================================
       CUSTOMER NAVBAR
    ===================================================== */

    return (
        <>
            {/* TOP BAR */}

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


            {/* MAIN NAVBAR */}

            <header className="navbar">

                {/* =================================================
                    1. LOGO
                ================================================= */}

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


                {/* =================================================
                    2. SEARCH BAR + SEARCH ICON
                ================================================= */}

                <div className="search-container">

                    <input
                        type="text"
                        placeholder="Search medicines, pet food, products..."
                        value={search}
                        onChange={handleSearch}
                        onKeyDown={handleSearchKeyDown}
                    />

                    <button
                        type="button"
                        className="search-btn"
                        onClick={handleSearchSubmit}
                        aria-label="Search"
                    >

                        <FaSearch />

                    </button>

                </div>


                {/* =================================================
                    3. DESKTOP NAVIGATION
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

                            <FaShoppingCart />

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


                    {/* WALLET */}

                    {username && hasPet && (

                        <Link
                            to="/wallet"
                            className="nav-count-link"
                        >

                            <MdAccountBalanceWallet />

                            <p>
                                Wallet
                            </p>

                        </Link>

                    )}


                    {/* MY PETS */}

                    {username && hasPet && (

                        <Link
                            to="/pets"
                            className="pet-profile-nav"
                        >

                            <FaPaw />

                            <p>
                                My Pets
                            </p>

                        </Link>

                    )}

                </div>


                {/* =================================================
                    4. PROFILE
                ================================================= */}

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
                                alt="Profile"
                                className="avatar-img"
                            />

                        ) : (

                            <FaUserCircle />

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
                                        My Pets
                                    </Link>

                                )}


                                <Link
                                    to="/orders"
                                    className="popup-btn"
                                >
                                    My Orders
                                </Link>


                                <Link
                                    to="/wallet"
                                    className="popup-btn"
                                >
                                    My Wallet
                                </Link>


                                <button
                                    type="button"
                                    className="popup-btn logout-popup-btn"
                                    onClick={handleLogout}
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


                {/* =================================================
                    5. MOBILE MENU
                ================================================= */}

                <button
                    type="button"
                    className="mobile-menu-btn"
                    onClick={openMobileMenu}
                    aria-label="Open menu"
                >

                    {mobileMenuOpen
                        ? <FaTimes />
                        : <FaBars />
                    }

                </button>

            </header>


            {/* =====================================================
                MOBILE SIDE DRAWER
            ===================================================== */}

            {mobileMenuOpen && (

                <>
                    <div
                        className="mobile-menu-overlay"
                        onClick={closeMobileMenu}
                    />


                    <aside className="mobile-drawer">

                        {/* DRAWER HEADER */}

                        <div className="mobile-drawer-header">

                            <div className="mobile-drawer-title">

                                {profileImage ? (

                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="mobile-drawer-avatar"
                                    />

                                ) : (

                                    <FaUserCircle />

                                )}


                                <div>

                                    <strong>
                                        {username || "Welcome"}
                                    </strong>

                                    <small>
                                        {username
                                            ? "My Account"
                                            : "Please Login"}
                                    </small>

                                </div>

                            </div>


                            <button
                                type="button"
                                className="drawer-close-btn"
                                onClick={closeMobileMenu}
                                aria-label="Close menu"
                            >

                                <FaTimes />

                            </button>

                        </div>


                        {/* DRAWER ITEMS */}

                        <div className="mobile-drawer-body">

                            <button
                                type="button"
                                onClick={() =>
                                    goToPage("/home")
                                }
                            >
                                <FaHome />

                                <span>
                                    Home
                                </span>

                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    goToPage("/offers")
                                }
                            >
                                <FaTag />

                                <span>
                                    Offers
                                </span>

                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    goToPage(
                                        "/products?product_type=Medicine&product_type=Supplements"
                                    )
                                }
                            >
                                <FaPills />

                                <span>
                                    Medicines & Supplements
                                </span>

                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    goToPage(
                                        "/products?product_type=food&product_type=Other"
                                    )
                                }
                            >
                                <FaPaw />

                                <span>
                                    Pet Food & Products
                                </span>

                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    goToPage(
                                        "/prescription/upload"
                                    )
                                }
                            >
                                <FaFilePrescription />

                                <span>
                                    Upload Prescription
                                </span>

                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    goToPage(
                                        "/products?product_type=FarmSupplies"
                                    )
                                }
                            >
                                <FaTractor />

                                <span>
                                    Farm Supplies
                                </span>

                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    goToPage(
                                        "/products?product_type=VetEquipment"
                                    )
                                }
                            >
                                <FaStethoscope />

                                <span>
                                    Vet Equipment
                                </span>

                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    goToPage("/cart")
                                }
                            >
                                <FaShoppingCart />

                                <span>
                                    Cart
                                </span>

                                {cartCount > 0 && (
                                    <b>
                                        {cartCount}
                                    </b>
                                )}

                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    goToPage("/wishlists")
                                }
                            >
                                <FaHeart />

                                <span>
                                    Wishlist
                                </span>

                                {wishlistCount > 0 && (
                                    <b>
                                        {wishlistCount}
                                    </b>
                                )}

                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    goToPage("/orders")
                                }
                            >
                                <FaBox />

                                <span>
                                    My Orders
                                </span>

                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    goToPage(
                                        username
                                            ? "/profile"
                                            : "/login"
                                    )
                                }
                            >
                                <FaUser />

                                <span>
                                    {username
                                        ? "My Profile"
                                        : "Login"}
                                </span>

                            </button>


                            {username && hasPet && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage("/pets")
                                    }
                                >
                                    <FaPaw />

                                    <span>
                                        My Pets
                                    </span>

                                </button>

                            )}


                            {username && hasPet && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage("/wallet")
                                    }
                                >
                                    <FaWallet />

                                    <span>
                                        My Wallet
                                    </span>

                                </button>

                            )}


                            <button
                                type="button"
                                onClick={() =>
                                    goToPage("/home-visit")
                                }
                            >
                                <FaHospital />

                                <span>
                                    Home Visit Service
                                </span>

                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    goToPage("/adoption")
                                }
                            >
                                <FaPaw />

                                <span>
                                    Adoption Platform
                                </span>

                            </button>


                            {username && (

                                <button
                                    type="button"
                                    className="mobile-logout"
                                    onClick={handleLogout}
                                >
                                    <FaSignOutAlt />

                                    <span>
                                        Logout
                                    </span>

                                </button>

                            )}

                        </div>

                    </aside>

                </>
            )}

        </>
    );
}


export default Navbar;