import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
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
import fashionlogo from "../assets/logo/zenve-logo-CGDKnQD9.png";

import "../styles/Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("access");

    const isAdminOrStaff =
        role === "Admin" ||
        role === "Staff";

    /*
    =====================================================
    FASHION PAGE DETECTION
    =====================================================
    */

    const isFashionPage =
        location.pathname.toLowerCase() === "/fashion" ||
        location.pathname.toLowerCase().startsWith("/fashion/");

    /*
    =====================================================
    STATES
    =====================================================
    */

    const [profileImage, setProfileImage] = useState("");
    const [search, setSearch] = useState("");
    const [hasPet, setHasPet] = useState(false);

    const [cartCount, setCartCount] = useState(
        Number(localStorage.getItem("cartCount") || 0)
    );

    const [wishlistCount, setWishlistCount] = useState(
        Number(localStorage.getItem("wishlistCount") || 0)
    );

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    /*
    =====================================================
    SAVE CART COUNT
    =====================================================
    */

    const updateCartCount = useCallback((count) => {
        const newCount = Math.max(
            0,
            Number(count || 0)
        );

        setCartCount(newCount);

        localStorage.setItem(
            "cartCount",
            String(newCount)
        );
    }, []);

    /*
    =====================================================
    SAVE WISHLIST COUNT
    =====================================================
    */

    const updateWishlistCount = useCallback((count) => {
        const newCount = Math.max(
            0,
            Number(count || 0)
        );

        setWishlistCount(newCount);

        localStorage.setItem(
            "wishlistCount",
            String(newCount)
        );
    }, []);

    /*
    =====================================================
    LOAD PROFILE
    =====================================================
    */

    const loadProfile = useCallback(async () => {
        if (!token) {
            setProfileImage("");
            return;
        }

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
                error.response?.data ||
                error.message
            );

            setProfileImage("");
        }
    }, [token]);

    /*
    =====================================================
    LOAD PET DETAILS
    =====================================================
    */

    const loadPetDetails = useCallback(async () => {
        if (!token || isAdminOrStaff) {
            setHasPet(false);
            return;
        }

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
                error.response?.data ||
                error.message
            );

            setHasPet(false);
        }
    }, [token, isAdminOrStaff]);

    /*
    =====================================================
    LOAD CART COUNT
    =====================================================
    */

    const loadCartCount = useCallback(async () => {
        if (!token || isAdminOrStaff) {
            updateCartCount(0);
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

            let count = 0;

            if (Array.isArray(data)) {
                count = data.reduce(
                    (total, item) =>
                        total +
                        Number(item.quantity || 1),
                    0
                );
            } else if (
                Array.isArray(data?.items)
            ) {
                count = data.items.reduce(
                    (total, item) =>
                        total +
                        Number(item.quantity || 1),
                    0
                );
            } else if (
                data?.total_items !== undefined
            ) {
                count = Number(
                    data.total_items
                );
            } else if (
                data?.count !== undefined
            ) {
                count = Number(data.count);
            }

            updateCartCount(count);
        } catch (error) {
            console.error(
                "Cart count error:",
                error.response?.data ||
                error.message
            );

            const saved =
                localStorage.getItem(
                    "cartCount"
                );

            updateCartCount(
                Number(saved || 0)
            );
        }
    }, [
        token,
        isAdminOrStaff,
        updateCartCount,
    ]);

    /*
    =====================================================
    LOAD WISHLIST COUNT
    =====================================================
    */

    const loadWishlistCount = useCallback(async () => {
        if (!token || isAdminOrStaff) {
            updateWishlistCount(0);
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

            let count = 0;

            if (Array.isArray(data)) {
                count = data.length;
            } else if (
                Array.isArray(data?.results)
            ) {
                count = data.results.length;
            } else if (
                Array.isArray(data?.items)
            ) {
                count = data.items.length;
            } else if (
                data?.count !== undefined
            ) {
                count = Number(data.count);
            }

            updateWishlistCount(count);
        } catch (error) {
            console.error(
                "Wishlist count error:",
                error.response?.data ||
                error.message
            );

            const saved =
                localStorage.getItem(
                    "wishlistCount"
                );

            updateWishlistCount(
                Number(saved || 0)
            );
        }
    }, [
        token,
        isAdminOrStaff,
        updateWishlistCount,
    ]);

    /*
    =====================================================
    INITIAL USER DATA
    =====================================================
    */

    useEffect(() => {
        if (!token) {
            setProfileImage("");
            setHasPet(false);

            updateCartCount(0);
            updateWishlistCount(0);

            return;
        }

        loadProfile();

        if (!isAdminOrStaff) {
            loadPetDetails();
            loadCartCount();
            loadWishlistCount();
        } else {
            setHasPet(false);

            updateCartCount(0);
            updateWishlistCount(0);
        }
    }, [
        token,
        isAdminOrStaff,
        loadProfile,
        loadPetDetails,
        loadCartCount,
        loadWishlistCount,
        updateCartCount,
        updateWishlistCount,
    ]);

    /*
    =====================================================
    CART / WISHLIST EVENTS
    =====================================================
    */

    useEffect(() => {
        if (!token || isAdminOrStaff) {
            return;
        }

        const handleCartUpdate = (event) => {
            if (
                event.detail &&
                event.detail.count !== undefined
            ) {
                updateCartCount(
                    event.detail.count
                );
            }

            loadCartCount();
        };

        const handleWishlistUpdate = (event) => {
            if (
                event.detail &&
                event.detail.count !== undefined
            ) {
                updateWishlistCount(
                    event.detail.count
                );
            }

            loadWishlistCount();
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
    }, [
        token,
        isAdminOrStaff,
        loadCartCount,
        loadWishlistCount,
        updateCartCount,
        updateWishlistCount,
    ]);

    /*
    =====================================================
    RELOAD COUNTS ON ROUTE CHANGE
    =====================================================
    */

    useEffect(() => {
        if (!token || isAdminOrStaff) {
            return;
        }

        loadCartCount();
        loadWishlistCount();
    }, [
        location.pathname,
        location.search,
        token,
        isAdminOrStaff,
        loadCartCount,
        loadWishlistCount,
    ]);

    /*
    =====================================================
    WINDOW FOCUS
    =====================================================
    */

    useEffect(() => {
        if (!token || isAdminOrStaff) {
            return;
        }

        const handleFocus = () => {
            loadCartCount();
            loadWishlistCount();
        };

        window.addEventListener(
            "focus",
            handleFocus
        );

        return () => {
            window.removeEventListener(
                "focus",
                handleFocus
            );
        };
    }, [
        token,
        isAdminOrStaff,
        loadCartCount,
        loadWishlistCount,
    ]);

    /*
    =====================================================
    STORAGE CHANGES
    =====================================================
    */

    useEffect(() => {
        const handleStorage = (event) => {
            if (
                event.key === "cartCount"
            ) {
                updateCartCount(
                    Number(
                        event.newValue || 0
                    )
                );
            }

            if (
                event.key ===
                "wishlistCount"
            ) {
                updateWishlistCount(
                    Number(
                        event.newValue || 0
                    )
                );
            }
        };

        window.addEventListener(
            "storage",
            handleStorage
        );

        return () => {
            window.removeEventListener(
                "storage",
                handleStorage
            );
        };
    }, [
        updateCartCount,
        updateWishlistCount,
    ]);

    /*
    =====================================================
    CLOSE MOBILE MENU ON DESKTOP
    =====================================================
    */

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 992) {
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

    /*
    =====================================================
    BODY SCROLL
    =====================================================
    */

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow =
                "hidden";
        } else {
            document.body.style.overflow =
                "";
        }

        return () => {
            document.body.style.overflow =
                "";
        };
    }, [mobileMenuOpen]);

    /*
    =====================================================
    SEARCH
    =====================================================
    */

    const handleSearch = (event) => {
        const value =
            event.target.value;

        setSearch(value);

        if (value.trim()) {
            navigate(
                `/products?search=${encodeURIComponent(
                    value
                )}`
            );
        }
    };

    const handleSearchSubmit = () => {
        const value =
            search.trim();

        if (value) {
            navigate(
                `/products?search=${encodeURIComponent(
                    value
                )}`
            );
        } else {
            navigate("/products");
        }
    };

    const handleSearchKeyDown = (
        event
    ) => {
        if (event.key === "Enter") {
            handleSearchSubmit();
        }
    };

    /*
    =====================================================
    MOBILE MENU
    =====================================================
    */

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

    /*
    =====================================================
    LOGOUT
    =====================================================
    */

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

    /*
    =====================================================
    ADMIN / STAFF NAVBAR
    =====================================================
    */

    if (isAdminOrStaff) {
        return (
            <>
                <header className="navbar admin-simple-navbar">

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
                                {username ||
                                    "Admin"}
                            </p>
                        </Link>

                        <div className="profile-popup">

                            <h4>
                                Hello,{" "}
                                {username ||
                                    "Admin"}
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
                                onClick={
                                    handleLogout
                                }
                            >
                                Logout
                            </button>

                        </div>
                    </div>

                    <button
                        type="button"
                        className="mobile-menu-btn"
                        onClick={
                            openMobileMenu
                        }
                        aria-label="Open menu"
                    >
                        {mobileMenuOpen ? (
                            <FaTimes />
                        ) : (
                            <FaBars />
                        )}
                    </button>

                </header>

                {mobileMenuOpen && (
                    <>
                        <div
                            className="mobile-menu-overlay"
                            onClick={
                                closeMobileMenu
                            }
                        />

                        <aside className="mobile-drawer">

                            <div className="mobile-drawer-header">

                                <div className="mobile-drawer-title">

                                    <FaUserCircle />

                                    <div>
                                        <strong>
                                            {username ||
                                                "Admin"}
                                        </strong>

                                        <small>
                                            {role ||
                                                "Admin"}
                                        </small>
                                    </div>

                                </div>

                                <button
                                    type="button"
                                    className="drawer-close-btn"
                                    onClick={
                                        closeMobileMenu
                                    }
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
                                        goToPage(
                                            "/profile"
                                        )
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
                                        goToPage(
                                            "/orders"
                                        )
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
                                    onClick={
                                        handleLogout
                                    }
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

    /*
    =====================================================
    FASHION NAVBAR
    =====================================================
    */

    if (isFashionPage) {
        return (
            <>
                <header className="navbar fashion-navbar">

                    {/* LOGO */}

                    <div className="fashion-logo">

                        <Link
                            to="/Fashion"
                            className="fashion-logo-link"
                        >

                            <img
                                src={fashionlogo}
                                alt="Zenve Fashion"
                                className="fashion-navbar-logo"
                            />

                            <div className="fashion-brand-text">
                            </div>

                        </Link>

                    </div>

                    {/* FASHION NAVIGATION */}

                    <nav className="fashion-main-links">

                        <Link
                            to="/Fashion"
                            className="fashion-nav-link active"
                        >
                            Home
                        </Link>

                        <Link
                            to="/products?search=Fashion"
                            className="fashion-nav-link"
                        >
                            Collections
                        </Link>

                        <Link
                            to="/products?search=Pet Fashion"
                            className="fashion-nav-link"
                        >
                            Pet Fashion
                        </Link>

                        <Link
                            to="/products?search=Human Fashion"
                            className="fashion-nav-link"
                        >
                            People
                        </Link>

                        <Link
                            to="/products?search=Twin Fashion"
                            className="fashion-nav-link"
                        >
                            Twin Fashion
                        </Link>

                        <Link
                            to="/offers"
                            className="fashion-nav-link"
                        >
                            Offers
                        </Link>

                    </nav>

                    {/* SEARCH */}

                    <div className="fashion-search">

                        <input
                            type="text"
                            placeholder="Search fashion..."
                            value={search}
                            onChange={handleSearch}
                            onKeyDown={
                                handleSearchKeyDown
                            }
                        />

                        <button
                            type="button"
                            onClick={
                                handleSearchSubmit
                            }
                            aria-label="Search"
                        >
                            <FaSearch />
                        </button>

                    </div>

                    {/* EXISTING DESKTOP ICONS */}

                    <div className="fashion-icons">

                        {/* OFFERS */}

                        <Link
                            to="/offers"
                            className="fashion-icon-link"
                            title="Offers"
                        >
                            <MdOutlineLocalOffer />

                            <span>
                                Offers
                            </span>
                        </Link>

                        {/* WISHLIST */}

                        <Link
                            to="/wishlists"
                            className="fashion-icon-link fashion-count-link"
                            title="Wishlist"
                        >

                            <div className="fashion-icon-wrapper">

                                <MdOutlineFavoriteBorder />

                                {wishlistCount > 0 && (
                                    <span className="fashion-badge">
                                        {wishlistCount}
                                    </span>
                                )}

                            </div>

                            <span>
                                Wishlist
                            </span>

                        </Link>

                        {/* CART */}

                        <Link
                            to="/cart"
                            className="fashion-icon-link fashion-count-link"
                            title="Cart"
                        >

                            <div className="fashion-icon-wrapper">

                                <FaShoppingCart />

                                {cartCount > 0 && (
                                    <span className="fashion-badge">
                                        {cartCount}
                                    </span>
                                )}

                            </div>

                            <span>
                                Cart
                            </span>

                        </Link>

                        {/* WALLET */}

                        {username &&
                            hasPet && (
                                <Link
                                    to="/wallet"
                                    className="fashion-icon-link"
                                    title="Wallet"
                                >
                                    <MdAccountBalanceWallet />

                                    <span>
                                        Wallet
                                    </span>
                                </Link>
                            )}

                        {/* PET */}

                        {username &&
                            hasPet && (
                                <Link
                                    to="/pets"
                                    className="fashion-icon-link"
                                    title="My Pets"
                                >
                                    <FaPaw />

                                    <span>
                                        My Pets
                                    </span>
                                </Link>
                            )}

                    </div>

                    {/* DESKTOP PROFILE */}

                    <div className="profile-menu fashion-profile-menu">

                        <Link
                            to={
                                username
                                    ? "/profile"
                                    : "/login"
                            }
                            className="fashion-profile-link"
                        >

                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="fashion-avatar"
                                />
                            ) : (
                                <FaUserCircle />
                            )}

                            <span>
                                {username ||
                                    "Login"}
                            </span>

                        </Link>

                        <div className="profile-popup fashion-profile-popup">

                            {username ? (
                                <>
                                    <h4>
                                        Hello,{" "}
                                        {username}
                                    </h4>

                                    <Link
                                        to="/profile"
                                        className="popup-btn fashion-popup-btn"
                                    >
                                        My Profile
                                    </Link>

                                    {hasPet && (
                                        <Link
                                            to="/pets"
                                            className="popup-btn fashion-popup-btn"
                                        >
                                            My Pets
                                        </Link>
                                    )}

                                    <Link
                                        to="/orders"
                                        className="popup-btn fashion-popup-btn"
                                    >
                                        My Orders
                                    </Link>

                                    <Link
                                        to="/wallet"
                                        className="popup-btn fashion-popup-btn"
                                    >
                                        My Wallet
                                    </Link>

                                    <button
                                        type="button"
                                        className="popup-btn logout-popup-btn"
                                        onClick={
                                            handleLogout
                                        }
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
                                        className="popup-btn fashion-popup-btn"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/register"
                                        className="popup-btn fashion-popup-btn"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}

                        </div>

                    </div>

                    {/* =================================================
                        TABLET / MOBILE WISHLIST + CART
                    ================================================= */}

                    <div className="fashion-mobile-actions">

                        {/* WISHLIST */}

                        <Link
                            to="/wishlists"
                            className="fashion-mobile-action"
                            title="Wishlist"
                        >

                            <div className="fashion-mobile-action-icon">

                                <MdOutlineFavoriteBorder />

                                {wishlistCount > 0 && (
                                    <span className="fashion-mobile-badge">
                                        {wishlistCount}
                                    </span>
                                )}

                            </div>

                        </Link>

                        {/* CART */}

                        <Link
                            to="/cart"
                            className="fashion-mobile-action"
                            title="Cart"
                        >

                            <div className="fashion-mobile-action-icon">

                                <FaShoppingCart />

                                {cartCount > 0 && (
                                    <span className="fashion-mobile-badge">
                                        {cartCount}
                                    </span>
                                )}

                            </div>

                        </Link>

                    </div>

                    {/* MOBILE / TABLET MENU */}

                    <button
                        type="button"
                        className="mobile-menu-btn fashion-mobile-menu-btn"
                        onClick={
                            openMobileMenu
                        }
                        aria-label="Open menu"
                    >
                        {mobileMenuOpen ? (
                            <FaTimes />
                        ) : (
                            <FaBars />
                        )}
                    </button>

                </header>

                {/* FASHION MOBILE DRAWER */}

                {mobileMenuOpen && (
                    <>
                        <div
                            className="mobile-menu-overlay fashion-mobile-overlay"
                            onClick={
                                closeMobileMenu
                            }
                        />

                        <aside className="mobile-drawer fashion-mobile-drawer">

                            <div className="fashion-mobile-header">

                                <div className="fashion-mobile-brand">

                                    <img
                                        src={logo}
                                        alt="Zenve Fashion"
                                    />

                                    <div>
                                        <strong>
                                            ZENVE
                                        </strong>

                                        <small>
                                            FASHION
                                        </small>
                                    </div>

                                </div>

                                <button
                                    type="button"
                                    className="fashion-drawer-close"
                                    onClick={
                                        closeMobileMenu
                                    }
                                >
                                    <FaTimes />
                                </button>

                            </div>

                            <div className="fashion-mobile-body">

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage(
                                            "/Fashion"
                                        )
                                    }
                                >
                                    <FaHome />
                                    <span>
                                        Fashion Home
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage(
                                            "/products?search=Fashion"
                                        )
                                    }
                                >
                                    <FaTag />
                                    <span>
                                        Collections
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage(
                                            "/products?search=Pet Fashion"
                                        )
                                    }
                                >
                                    <FaPaw />
                                    <span>
                                        Pet Fashion
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage(
                                            "/products?search=Human Fashion"
                                        )
                                    }
                                >
                                    <FaUser />
                                    <span>
                                        People Fashion
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage(
                                            "/products?search=Twin Fashion"
                                        )
                                    }
                                >
                                    <FaHeart />
                                    <span>
                                        Twin Fashion
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage(
                                            "/offers"
                                        )
                                    }
                                >
                                    <MdOutlineLocalOffer />
                                    <span>
                                        Offers
                                    </span>
                                </button>

                                {/* CART */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage(
                                            "/cart"
                                        )
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

                                {/* WISHLIST */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage(
                                            "/wishlists"
                                        )
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

                                {/* ORDERS */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage(
                                            "/orders"
                                        )
                                    }
                                >
                                    <FaBox />

                                    <span>
                                        My Orders
                                    </span>
                                </button>

                                {/* PETS */}

                                {username &&
                                    hasPet && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                goToPage(
                                                    "/pets"
                                                )
                                            }
                                        >
                                            <FaPaw />

                                            <span>
                                                My Pets
                                            </span>
                                        </button>
                                    )}

                                {/* WALLET */}

                                {username &&
                                    hasPet && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                goToPage(
                                                    "/wallet"
                                                )
                                            }
                                        >
                                            <FaWallet />

                                            <span>
                                                My Wallet
                                            </span>
                                        </button>
                                    )}

                                {/* PROFILE */}

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

                                {/* LOGOUT */}

                                {username && (
                                    <button
                                        type="button"
                                        className="mobile-logout fashion-mobile-logout"
                                        onClick={
                                            handleLogout
                                        }
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

    /*
    =====================================================
    NORMAL CUSTOMER NAVBAR
    =====================================================
    */

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

                <div className="search-container">

                    <input
                        type="text"
                        placeholder="Search medicines, pet food, products..."
                        value={search}
                        onChange={handleSearch}
                        onKeyDown={
                            handleSearchKeyDown
                        }
                    />

                    <button
                        type="button"
                        className="search-btn"
                        onClick={
                            handleSearchSubmit
                        }
                        aria-label="Search"
                    >
                        <FaSearch />
                    </button>

                </div>

                {/* DESKTOP ICONS */}

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

                    {username &&
                        hasPet && (
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

                    {username &&
                        hasPet && (
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

                {/* DESKTOP PROFILE */}

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
                            {username ||
                                "Login"}
                        </p>

                    </Link>

                    <div className="profile-popup">

                        {username ? (
                            <>
                                <h4>
                                    Hello,{" "}
                                    {username}
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
                                    onClick={
                                        handleLogout
                                    }
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

                {/* TABLET / MOBILE ACTIONS */}

                <div className="normal-mobile-actions">

                    {/* WISHLIST */}

                    <Link
                        to="/wishlists"
                        className="normal-mobile-action"
                        title="Wishlist"
                    >

                        <div className="normal-mobile-action-icon">

                            <MdOutlineFavoriteBorder />

                            {wishlistCount > 0 && (
                                <span className="normal-mobile-badge">
                                    {wishlistCount}
                                </span>
                            )}

                        </div>

                    </Link>

                    {/* CART */}

                    <Link
                        to="/cart"
                        className="normal-mobile-action"
                        title="Cart"
                    >

                        <div className="normal-mobile-action-icon">

                            <FaShoppingCart />

                            {cartCount > 0 && (
                                <span className="normal-mobile-badge">
                                    {cartCount}
                                </span>
                            )}

                        </div>

                    </Link>

                </div>

                <button
                    type="button"
                    className="mobile-menu-btn"
                    onClick={
                        openMobileMenu
                    }
                    aria-label="Open menu"
                >
                    {mobileMenuOpen ? (
                        <FaTimes />
                    ) : (
                        <FaBars />
                    )}
                </button>

            </header>
             <nav className="category-nav">

                <div className="category-nav-scroll">

                    <Link to="/category/food">
                        Pet Food
                    </Link>

                    <Link to="/category/treats">
                        Treats
                    </Link>

                    <Link to="/category/toys">
                        Toys
                    </Link>

                    <Link to="/category/fashion">
                        Pet Fashion
                    </Link>

                    <Link to="/category/grooming">
                        Grooming
                    </Link>

                    <Link to="/category/accessories">
                        Accessories
                    </Link>

                    <Link to="/">
                        Shop
                    </Link>

                    <Link to="/vet-booked">
                        Book a Vet
                    </Link>

                    <Link to="/fashion">
                        Zenve Fashion
                    </Link>

                    <Link to="/account">
                        My Space
                    </Link>

                    <Link to="/contact">
                        Help & Care
                    </Link>

                    <Link to="/policies">
                        Shipping & Returns
                    </Link>

                </div>

            </nav>
            {/* NORMAL MOBILE DRAWER */}

            {mobileMenuOpen && (
                <>
                    <div
                        className="mobile-menu-overlay"
                        onClick={
                            closeMobileMenu
                        }
                    />

                    <aside className="mobile-drawer">

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
                                        {username ||
                                            "Welcome"}
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
                                onClick={
                                    closeMobileMenu
                                }
                                aria-label="Close menu"
                            >
                                <FaTimes />
                            </button>

                        </div>

                        <div className="mobile-drawer-body">

                            <button
                                type="button"
                                onClick={() =>
                                    goToPage(
                                        "/home"
                                    )
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
                                    goToPage(
                                        "/offers"
                                    )
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
                                    goToPage(
                                        "/cart"
                                    )
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
                                    goToPage(
                                        "/wishlists"
                                    )
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
                                    goToPage(
                                        "/orders"
                                    )
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

                            {username &&
                                hasPet && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            goToPage(
                                                "/pets"
                                            )
                                        }
                                    >
                                        <FaPaw />

                                        <span>
                                            My Pets
                                        </span>
                                    </button>
                                )}

                            {username &&
                                hasPet && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            goToPage(
                                                "/wallet"
                                            )
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
                                    goToPage(
                                        "/home-visit"
                                    )
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
                                    goToPage(
                                        "/adoption"
                                    )
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
                                    onClick={
                                        handleLogout
                                    }
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