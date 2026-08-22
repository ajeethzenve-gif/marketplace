import { Fragment, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
    FaBoxOpen,
    FaShieldAlt,
    FaTruck,
    FaHeart,
    FaTimes,
    FaSortAmountDown,
    FaCheck,
} from "react-icons/fa";

import api from "../api/api";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination.jsx";

import "../styles/ProductList.css";


function ProductList() {

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

    const [searchParams] = useSearchParams();

    const searchFromNavbar =
        searchParams.get("search") || "";

    const productTypesFromNavbar =
        searchParams.getAll("product_type");


    /* =====================================================
       CATEGORIES
    ===================================================== */

    const categories = [
        "Medicine",
        "Supplements",
        "Food",
        "Accessory",
        "Grooming",
    ];


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
        productTypesFromNavbar.length > 0;


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


                        <div className="products-result-header">


                            <div>

                                <h2>
                                    Explore Products
                                </h2>

                                <p>

                                    {productCount} products
                                    found for your pet

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