import { Fragment, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import {
    FaBoxOpen,
    FaShieldAlt,
    FaTruck,
    FaHeart,
    FaTimes,
    FaSortAmountDown,
    FaCheck,
    FaChevronRight,
} from "react-icons/fa";

import api from "../api/api";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination.jsx";

import dogImage from "../assets/images/dog-transparent.png";
import catImage from "../assets/images/cat-transparent.png";
import productImage from "../assets/images/product-transparent.png";
import otherFeedsBanner from "../assets/images/other_feeds_banner.jpg";

import "../styles/ProductList.css";


function ProductList({ forcedPetType }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    /* =====================================================
       DETERMINE PET EXPERIENCE TYPE
       From prop, URL pathname (/products/dogs, /products/cats, /products/other-pets),
       or query params (?pet_type=Dog)
    ===================================================== */

    const pathname = location.pathname.toLowerCase();

    let initialPetType = forcedPetType || "";
    if (!initialPetType) {
        if (pathname === "/products/dogs" || pathname === "/products/dog") {
            initialPetType = "Dog";
        } else if (pathname === "/products/cats" || pathname === "/products/cat") {
            initialPetType = "Cat";
        } else if (
            pathname === "/products/other-pets" ||
            pathname === "/products/others" ||
            pathname === "/products/other"
        ) {
            initialPetType = "other-pets";
        } else {
            initialPetType =
                searchParams.get("pet_type") ||
                searchParams.get("pet") ||
                "";
        }
    }

    // Sub-pet filter for Other Pets page (e.g. "", "Bird", "Cattle")
    const [specificPetFilter, setSpecificPetFilter] = useState("");

    /* =====================================================
       PET EXPERIENCE CONFIGURATION
    ===================================================== */

    const petConfig = useMemo(() => {
        const pt = (initialPetType || "").toLowerCase();

        if (pt === "dog" || pt === "dogs") {
            return {
                key: "dog",
                title: "Everything for Your Dog",
                subtitle:
                    "Discover high-protein food, healthy treats, grooming essentials, veterinary medicines, joint care & fun toys tailored for dogs.",
                badge: "🐶 DEDICATED DOG SHOP",
                breadcrumb: "Dogs",
                breadcrumbPath: "/products/dogs",
                bannerImage: dogImage,
                bannerBg:
                    "linear-gradient(135deg, #FFFDF5 0%, #FFF8E6 50%, #FDF1D0 100%)",
                badgeBg: "linear-gradient(135deg, #D4AF37, #9C7415)",
                borderColor: "#E6CA65",
                accentColor: "#9C7415",
                categories: [
                    "Food",
                    "Medicine",
                    "Supplements",
                    "Grooming",
                    "Toys",
                    "Leashes",
                    "Accessories",
                    "DentalCare",
                ],
                subPets: null,
            };
        }

        if (pt === "cat" || pt === "cats") {
            return {
                key: "cat",
                title: "Everything for Your Cat",
                subtitle:
                    "Nutritious ocean fish & poultry meals, soothing drops, hairball remedies, interactive catnip toys & grooming for happy felines.",
                badge: "🐱 DEDICATED CAT SHOP",
                breadcrumb: "Cats",
                breadcrumbPath: "/products/cats",
                bannerImage: catImage,
                bannerBg:
                    "linear-gradient(135deg, #FBF8FF 0%, #F5EEFF 50%, #EADCFF 100%)",
                badgeBg: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                borderColor: "#D8B4FE",
                accentColor: "#7C3AED",
                categories: [
                    "Food",
                    "Medicine",
                    "Supplements",
                    "Grooming",
                    "Toys",
                    "Accessories",
                ],
                subPets: null,
            };
        }

        if (
            pt === "other-pets" ||
            pt === "other" ||
            pt === "others"
        ) {
            return {
                key: "other-pets",
                title: "Everything for Your Other Pets",
                subtitle:
                    "Specialized care for Birds, Rabbits, Cattle & Farm Animals. Fortified feeds, mineral mixtures, feeders & clinical vet equipment.",
                badge: "🕊️ BIRDS, FARM & SMALL PETS",
                breadcrumb: "Other Pets",
                breadcrumbPath: "/products/other-pets",
                bannerImage: otherFeedsBanner,
                bannerBg:
                    "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #BBF7D0 100%)",
                badgeBg: "linear-gradient(135deg, #10B981, #047857)",
                borderColor: "#86EFAC",
                accentColor: "#15803D",
                categories: [
                    "Food",
                    "Supplements",
                    "FarmSupplies",
                    "VetEquipment",
                    "Accessories",
                ],
                subPets: [
                    { label: "All Other Pets", value: "", icon: "🐾" },
                    { label: "Birds & Poultry", value: "Bird", icon: "🦜" },
                    { label: "Cattle & Farm", value: "Cattle", icon: "🐄" },
                ],
            };
        }

        return {
            key: "all",
            title: "Explore All Products",
            subtitle:
                "Browse premium pet foods, medicines, vitamins, grooming essentials, toys and accessories for every beloved pet.",
            badge: "🐾 ZENVE PET MARKETPLACE",
            breadcrumb: "All Products",
            breadcrumbPath: "/products",
            bannerImage: productImage,
            bannerBg:
                "linear-gradient(135deg, #F4F9FF 0%, #E8F3FF 50%, #D7EBFF 100%)",
            badgeBg: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
            borderColor: "#93C5FD",
            accentColor: "#1D4ED8",
            categories: [
                "Medicine",
                "Supplements",
                "Food",
                "Accessories",
                "Grooming",
                "Toys",
            ],
            subPets: null,
        };
    }, [initialPetType]);

    /* =====================================================
       PRODUCT STATE
    ===================================================== */

    const [products, setProducts] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const [loading, setLoading] = useState(true);

    /* =====================================================
       BRAND STATE
    ===================================================== */

    const [brands, setBrands] = useState([]);
    const [brandsLoading, setBrandsLoading] = useState(false);
    const [showAllBrands, setShowAllBrands] = useState(false);

    /* =====================================================
       FILTER STATE
    ===================================================== */

    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedProductType, setSelectedProductType] = useState("");

    const [search, setSearch] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("");

    /* =====================================================
       PAGINATION STATE
    ===================================================== */

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    /* =====================================================
       URL SEARCH PARAMS
    ===================================================== */

    const searchFromNavbar =
        searchParams.get("search") || "";

    const productTypesFromNavbar =
        searchParams.getAll("product_type");

    /* =====================================================
       CATEGORIES FOR SIDEBAR
    ===================================================== */

    const categories = petConfig.categories;


    /* =====================================================
       SCROLL TO TOP
    ===================================================== */

    const scrollToTop = () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

        const mainContent =
            document.querySelector(".main-content");

        if (mainContent) {

            mainContent.scrollTo({
                top: 0,
                behavior: "smooth",
            });

        }

    };


    /* =====================================================
       LOAD BRANDS
    ===================================================== */

    const loadBrands = async () => {

        try {

            setBrandsLoading(true);

            const response =
                await api.get("brands/");

            const data =
                response.data.results ||
                response.data ||
                [];

            setBrands(data);

        }

        catch (error) {

            console.error(
                "Brand loading error:",
                error.response?.data ||
                error.message
            );

            setBrands([]);

        }

        finally {

            setBrandsLoading(false);

        }

    };


    /* =====================================================
       LOAD PRODUCTS
    ===================================================== */

    const loadProducts = async () => {

        try {

            setLoading(true);


            const params =
                new URLSearchParams();


            params.append(
                "page",
                page
            );


            if (search) {

                params.append(
                    "search",
                    search
                );

            }


            /* PRODUCT TYPE */

            const activeProductTypes =
                selectedProductType
                    ? [selectedProductType]
                    : productTypesFromNavbar;


            if (
                activeProductTypes &&
                activeProductTypes.length > 0
            ) {

                activeProductTypes.forEach(
                    (type) => {

                        params.append(
                            "product_type",
                            type
                        );

                    }
                );

            }


            /* BRAND */

            if (selectedBrand) {

                params.append(
                    "brand",
                    selectedBrand
                );

            }

            /* PET TYPE */
            const effectivePetType = specificPetFilter || initialPetType;

            if (effectivePetType) {
                params.append(
                    "pet_type",
                    effectivePetType
                );
            }


            /* MIN PRICE */

            if (minPrice !== "") {

                params.append(
                    "min_price",
                    minPrice
                );

            }


            /* MAX PRICE */

            if (maxPrice !== "") {

                params.append(
                    "max_price",
                    maxPrice
                );

            }


            /* SORT */

            if (sort) {

                params.append(
                    "sort",
                    sort
                );

            }


            const response =
                await api.get(
                    `products/?${params.toString()}`
                );


            const results =
                response.data.results || [];

            const count =
                response.data.count || 0;


            setProducts(results);

            setProductCount(count);


            setTotalPages(

                Math.max(
                    1,
                    Math.ceil(count / 12)
                )

            );

        }

        catch (error) {

            console.error(
                "Product loading error:",
                error.response?.data ||
                error.message
            );


            setProducts([]);

            setProductCount(0);

            setTotalPages(1);

        }

        finally {

            setLoading(false);

        }

    };


    /* =====================================================
       LOAD BRANDS ON PAGE LOAD
    ===================================================== */

    useEffect(() => {

        loadBrands();

    }, []);


    /* =====================================================
       RESET FILTERS ON PET TYPE OR ROUTE CHANGE
    ===================================================== */

    useEffect(() => {

        setSelectedProductType("");
        setSpecificPetFilter("");
        setSelectedBrand("");
        setSearch("");
        setMinPrice("");
        setMaxPrice("");
        setSort("");
        setPage(1);

    }, [initialPetType, pathname]);


    /* =====================================================
       NAVBAR SEARCH / CATEGORY CHANGE
    ===================================================== */

    useEffect(() => {

        setSearch(searchFromNavbar);

        setSelectedProductType("");

        setPage(1);

    }, [
        searchFromNavbar,
        productTypesFromNavbar.join("|"),
    ]);


    /* =====================================================
       LOAD PRODUCTS
    ===================================================== */

    useEffect(() => {

        loadProducts();

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [
        page,
        search,
        selectedBrand,
        selectedProductType,
        minPrice,
        maxPrice,
        sort,
        productTypesFromNavbar.join("|"),
        initialPetType,
        specificPetFilter,
    ]);


    /* =====================================================
       SCROLL WHEN PAGE CHANGES
    ===================================================== */

    useEffect(() => {

        if (page > 1) {

            scrollToTop();

        }

    }, [page]);


    /* =====================================================
       CHANGE PAGE
    ===================================================== */

    const handlePageChange = (newPage) => {

        if (
            newPage < 1 ||
            newPage > totalPages ||
            newPage === page
        ) {

            return;

        }


        setPage(newPage);

    };


    /* =====================================================
       APPLY FILTERS
    ===================================================== */

    const applyFilters = (

        brand = selectedBrand,

        productType =
            selectedProductType,

        min = minPrice,

        max = maxPrice,

        sorting = sort

    ) => {

        setSelectedBrand(brand);

        setSelectedProductType(productType);

        setMinPrice(min);

        setMaxPrice(max);

        setSort(sorting);

        setPage(1);

    };


    /* =====================================================
       BRAND CHANGE
    ===================================================== */

    const handleBrandChange = (brandId) => {

        applyFilters(

            String(brandId),

            selectedProductType,

            minPrice,

            maxPrice,

            sort

        );

    };


    /* =====================================================
       CATEGORY CHANGE
    ===================================================== */

    const handleCategoryClick = (
        category
    ) => {

        applyFilters(

            selectedBrand,

            category,

            minPrice,

            maxPrice,

            sort

        );

    };


    /* =====================================================
       ALL PRODUCTS
    ===================================================== */

    const handleAllProducts = () => {

        setSelectedProductType("");

        setPage(1);

    };


    /* =====================================================
       SORT
    ===================================================== */

    const handleSort = (value) => {

        setSort(value);

        setPage(1);

    };


    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const clearFilters = () => {

        setSearch("");

        setSelectedBrand("");

        setSelectedProductType("");

        setMinPrice("");

        setMaxPrice("");

        setSort("");

        setSpecificPetFilter("");

        setPage(1);

    };


    /* =====================================================
       ACTIVE FILTERS
    ===================================================== */

    const hasActiveFilters =
        search ||
        minPrice ||
        maxPrice ||
        sort ||
        selectedBrand ||
        selectedProductType ||
        productTypesFromNavbar.length > 0 ||
        Boolean(specificPetFilter);


    /* =====================================================
       NORMALIZE BRAND DATA
    ===================================================== */

    const normalizedBrands = useMemo(() => {

        return brands.map((brand) => {

            /*
                Handles API responses like:

                { id: 1, brand_name: "Royal Canin" }

                { id: 1, name: "Royal Canin" }

                "Royal Canin"

                1
            */

            if (
                typeof brand === "object" &&
                brand !== null
            ) {

                return {

                    id:
                        brand.id ??
                        brand.brand_id ??
                        brand.pk,

                    name:
                        brand.brand_name ??
                        brand.name ??
                        brand.title ??
                        "Unknown Brand",

                };

            }


            return {

                id: brand,

                name: String(brand),

            };

        });

    }, [brands]);


    /* =====================================================
       VISIBLE BRANDS
    ===================================================== */

    const visibleBrands =
        showAllBrands
            ? normalizedBrands
            : normalizedBrands.slice(0, 6);


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="products-page">

            <div className="products-main-container">

                {/* =============================================
                    BREADCRUMB NAVIGATION
                ============================================= */}
                <nav className="products-breadcrumb-nav" aria-label="Breadcrumb">
                    <ol className="products-breadcrumb-list">
                        <li>
                            <Link to="/home">Home</Link>
                        </li>
                        <li className="breadcrumb-separator">
                            <FaChevronRight />
                        </li>
                        <li>
                            <Link to="/products">Products</Link>
                        </li>
                        {petConfig.key !== "all" && (
                            <>
                                <li className="breadcrumb-separator">
                                    <FaChevronRight />
                                </li>
                                <li className="breadcrumb-current" aria-current="page">
                                    {petConfig.breadcrumb}
                                </li>
                            </>
                        )}
                        {selectedProductType && (
                            <>
                                <li className="breadcrumb-separator">
                                    <FaChevronRight />
                                </li>
                                <li className="breadcrumb-current">
                                    {selectedProductType}
                                </li>
                            </>
                        )}
                    </ol>
                </nav>

                {/* =============================================
                    PET CATEGORY HERO BANNER
                ============================================= */}
                <div
                    className={`pet-category-hero-banner pet-banner-${petConfig.key}`}
                    style={{
                        background: petConfig.bannerBg,
                        borderColor: petConfig.borderColor,
                    }}
                >
                    <div className="pet-hero-text">
                        <span
                            className="pet-hero-badge"
                            style={{
                                background: petConfig.badgeBg,
                            }}
                        >
                            {petConfig.badge}
                        </span>

                        <h1 className="pet-hero-title">{petConfig.title}</h1>

                        <p className="pet-hero-subtitle">{petConfig.subtitle}</p>

                        <div className="pet-hero-meta">
                            <span className="pet-hero-pill">
                                <strong>{productCount}</strong> Products Found
                            </span>
                            <span className="pet-hero-pill">
                                ✓ 100% Quality Assured
                            </span>
                            <span className="pet-hero-pill">
                                🚚 Doorstep Delivery
                            </span>
                        </div>
                    </div>

                    {petConfig.bannerImage && (
                        <div className="pet-hero-image-wrap">
                            <img
                                src={petConfig.bannerImage}
                                alt={petConfig.title}
                                className="pet-hero-image"
                            />
                        </div>
                    )}
                </div>

                <div className="products-layout">


                    {/* =============================================
                        SIDEBAR
                    ============================================= */}

                    <aside className="products-sidebar">


                        <div className="sidebar-mobile-header">

                            <strong>
                                Filters
                            </strong>


                            <button
                                type="button"
                                onClick={() =>
                                    document
                                        .querySelector(
                                            ".products-sidebar"
                                        )
                                        ?.classList.remove(
                                            "sidebar-open"
                                        )
                                }
                            >

                                <FaTimes />

                            </button>

                        </div>


                        {/* =========================================
                            CATEGORIES
                        ========================================= */}

                        <div className="sidebar-section">


                            <h3>
                                Categories
                            </h3>


                            <button
                                type="button"
                                className={
                                    !selectedProductType
                                        ? "active"
                                        : ""
                                }
                                onClick={
                                    handleAllProducts
                                }
                            >

                                All Products

                            </button>


                            {categories.map(
                                (category) => (

                                    <button
                                        key={category}
                                        type="button"
                                        className={
                                            selectedProductType ===
                                            category
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            handleCategoryClick(
                                                category
                                            )
                                        }
                                    >

                                        {category}

                                    </button>

                                )
                            )}


                        </div>


                        {/* =========================================
                            PRICE RANGE
                        ========================================= */}

                        <div className="sidebar-section">


                            <h3>
                                Price Range
                            </h3>


                            <div className="range-values">

                                <span>
                                    ₹{minPrice || 0}
                                </span>

                                <span>
                                    ₹{maxPrice || 5000}
                                </span>

                            </div>


                            <div className="range-slider">


                                <input
                                    type="range"
                                    min="0"
                                    max="5000"
                                    step="50"
                                    value={
                                        Number(minPrice) || 0
                                    }
                                    onChange={(e) => {

                                        const value =
                                            Math.min(

                                                Number(
                                                    e.target.value
                                                ),

                                                Number(
                                                    maxPrice
                                                ) || 5000

                                            );


                                        setMinPrice(
                                            String(value)
                                        );

                                    }}
                                />


                                <input
                                    type="range"
                                    min="0"
                                    max="5000"
                                    step="50"
                                    value={
                                        Number(maxPrice) ||
                                        5000
                                    }
                                    onChange={(e) => {

                                        const value =
                                            Math.max(

                                                Number(
                                                    e.target.value
                                                ),

                                                Number(
                                                    minPrice
                                                ) || 0

                                            );


                                        setMaxPrice(
                                            String(value)
                                        );

                                    }}
                                />


                            </div>


                            <button
                                type="button"
                                className="apply-price-btn"
                                onClick={() =>
                                    setPage(1)
                                }
                            >

                                Apply Price

                            </button>


                        </div>


                        {/* =========================================
                            BRANDS
                        ========================================= */}

                        <div className="sidebar-section">


                            <h3>
                                Popular Brands
                            </h3>


                            {brandsLoading ? (

                                <p className="sidebar-empty">
                                    Loading brands...
                                </p>

                            ) : visibleBrands.length > 0 ? (

                                visibleBrands.map(
                                    (brand) => (

                                        <label
                                            className="brand-option"
                                            key={brand.id}
                                        >


                                            <input
                                                type="radio"
                                                name="sidebar-brand"
                                                value={brand.id}
                                                checked={
                                                    String(
                                                        selectedBrand
                                                    ) ===
                                                    String(
                                                        brand.id
                                                    )
                                                }
                                                onChange={() =>
                                                    handleBrandChange(
                                                        brand.id
                                                    )
                                                }
                                            />


                                            <span>

                                                {brand.name}

                                            </span>


                                        </label>

                                    )
                                )

                            ) : (

                                <p className="sidebar-empty">

                                    No brands available.

                                </p>

                            )}


                            {normalizedBrands.length > 6 && (

                                <button
                                    type="button"
                                    className="view-more-btn"
                                    onClick={() =>
                                        setShowAllBrands(
                                            !showAllBrands
                                        )
                                    }
                                >

                                    {showAllBrands
                                        ? "View Less"
                                        : "View More"}

                                </button>

                            )}


                        </div>


                        {/* =========================================
                            SORT
                        ========================================= */}

                        <div className="sidebar-sort">


                            <div className="sidebar-sort-title">

                                <FaSortAmountDown />

                                <h3>
                                    Sort Products
                                </h3>

                            </div>


                            <div className="sort-buttons">


                                <button
                                    type="button"
                                    className={
                                        sort === ""
                                            ? "sort-option active"
                                            : "sort-option"
                                    }
                                    onClick={() =>
                                        handleSort("")
                                    }
                                >

                                    <span>
                                        Default
                                    </span>

                                    {sort === "" && (
                                        <FaCheck />
                                    )}

                                </button>


                                <button
                                    type="button"
                                    className={
                                        sort === "price_low"
                                            ? "sort-option active"
                                            : "sort-option"
                                    }
                                    onClick={() =>
                                        handleSort(
                                            "price_low"
                                        )
                                    }
                                >

                                    <span>
                                        Price: Low to High
                                    </span>

                                    {sort ===
                                        "price_low" && (
                                        <FaCheck />
                                    )}

                                </button>


                                <button
                                    type="button"
                                    className={
                                        sort === "price_high"
                                            ? "sort-option active"
                                            : "sort-option"
                                    }
                                    onClick={() =>
                                        handleSort(
                                            "price_high"
                                        )
                                    }
                                >

                                    <span>
                                        Price: High to Low
                                    </span>

                                    {sort ===
                                        "price_high" && (
                                        <FaCheck />
                                    )}

                                </button>


                                <button
                                    type="button"
                                    className={
                                        sort === "newest"
                                            ? "sort-option active"
                                            : "sort-option"
                                    }
                                    onClick={() =>
                                        handleSort(
                                            "newest"
                                        )
                                    }
                                >

                                    <span>
                                        Newest First
                                    </span>

                                    {sort === "newest" && (
                                        <FaCheck />
                                    )}

                                </button>


                            </div>


                        </div>


                        {/* =========================================
                            CLEAR FILTERS
                        ========================================= */}

                        {hasActiveFilters && (

                            <button
                                type="button"
                                className="sidebar-clear-btn"
                                onClick={clearFilters}
                            >

                                <FaTimes />

                                Clear Filters

                            </button>

                        )}


                    </aside>


                    {/* =============================================
                        PRODUCT CONTENT
                    ============================================= */}

                    <main className="products-content">


                        {/* =========================================
                            SUB-PET TYPE TABS (REQUIREMENT 4)
                        ========================================= */}
                        {petConfig.subPets && (
                            <div className="sub-pet-filter-bar">
                                <span className="sub-pet-filter-label">
                                    Pet Category:
                                </span>

                                <div className="sub-pet-pills">
                                    {petConfig.subPets.map((sp) => (
                                        <button
                                            key={sp.value}
                                            type="button"
                                            className={`sub-pet-pill ${
                                                specificPetFilter === sp.value
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                setSpecificPetFilter(sp.value);
                                                setPage(1);
                                            }}
                                        >
                                            <span className="sub-pet-pill-icon">
                                                {sp.icon}
                                            </span>
                                            <span>{sp.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="products-result-header">

                            <div>

                                <h2>
                                    {petConfig.title}
                                </h2>

                                <p>
                                    {productCount} products found {petConfig.key !== "all" ? `for ${petConfig.breadcrumb.toLowerCase()}` : "in store"}
                                    {selectedProductType ? ` • ${selectedProductType}` : ""}
                                    {specificPetFilter ? ` • ${specificPetFilter}` : ""}
                                </p>

                            </div>

                            <div className="page-indicator">

                                Page {page} of {totalPages}

                            </div>

                        </div>


                        {/* =========================================
                            LOADING
                        ========================================= */}

                        {loading ? (

                            <div className="products-loading">

                                <div className="loading-spinner"></div>

                                <p>
                                    Loading products...
                                </p>

                            </div>

                        ) : products.length > 0 ? (


                            <div className="products-ad-grid">


                                {Array.from(

                                    {
                                        length:
                                            Math.ceil(
                                                products.length / 4
                                            ),
                                    },

                                    (_, rowIndex) => {


                                        const rowProducts =
                                            products.slice(

                                                rowIndex * 4,

                                                rowIndex * 4 + 4

                                            );


                                        return (

                                            <Fragment
                                                key={`product-row-${rowIndex}`}
                                            >


                                                <div className="product-row">


                                                    {rowProducts.map(
                                                        (product) => (

                                                            <div
                                                                className="product-grid-item"
                                                                key={
                                                                    product.id
                                                                }
                                                            >

                                                                <ProductCard
                                                                    product={
                                                                        product
                                                                    }
                                                                />

                                                            </div>

                                                        )
                                                    )}


                                                </div>


                                                <div className="product-row-ad">


                                                    <div className="row-ad-icon">

                                                        {rowIndex % 2 === 0
                                                            ? "🐾"
                                                            : "🐶"}

                                                    </div>


                                                    <div className="row-ad-copy">


                                                        <span className="row-ad-badge">

                                                            SPECIAL PET CARE

                                                        </span>


                                                        <h3>

                                                            Everything Your Pet
                                                            Needs in One Place

                                                        </h3>


                                                        <p>

                                                            Quality food,
                                                            medicines,
                                                            supplements and
                                                            accessories for
                                                            happy pets.

                                                        </p>


                                                    </div>


                                                    <button
                                                        type="button"
                                                        className="row-ad-button"
                                                    >

                                                        Shop Now

                                                    </button>


                                                </div>


                                            </Fragment>

                                        );

                                    }

                                )}


                            </div>


                        ) : (


                            <div className="no-products">


                                <div className="no-products-icon">

                                    <FaBoxOpen />

                                </div>


                                <h3>
                                    No Products Found
                                </h3>


                                <p>

                                    We couldn't find
                                    products matching
                                    your filters.

                                </p>


                                <button
                                    type="button"
                                    onClick={clearFilters}
                                >

                                    Clear Filters

                                </button>


                            </div>


                        )}


                        {/* =========================================
                            PAGINATION
                        ========================================= */}

                        {totalPages > 1 && (

                            <div className="products-pagination">


                                <Pagination
                                    page={page}
                                    totalPages={totalPages}
                                    setPage={handlePageChange}
                                />


                            </div>

                        )}


                    </main>


                </div>


                {/* =============================================
                    BENEFITS
                ============================================= */}

                <section className="shopping-benefits">


                    <div className="benefit-item">

                        <div className="benefit-icon">

                            <FaShieldAlt />

                        </div>

                        <div>

                            <h4>
                                Trusted Products
                            </h4>

                            <p>
                                Quality products for
                                your pet's care.
                            </p>

                        </div>

                    </div>


                    <div className="benefit-item">

                        <div className="benefit-icon">

                            <FaTruck />

                        </div>

                        <div>

                            <h4>
                                Easy Delivery
                            </h4>

                            <p>

                                Get your pet essentials
                                delivered.

                            </p>

                        </div>

                    </div>


                    <div className="benefit-item">

                        <div className="benefit-icon">

                            <FaHeart />

                        </div>

                        <div>

                            <h4>
                                Pet First Care
                            </h4>

                            <p>

                                Everything your pet
                                needs in one place.

                            </p>

                        </div>

                    </div>


                </section>


            </div>


        </div>

    );

}


export default ProductList;