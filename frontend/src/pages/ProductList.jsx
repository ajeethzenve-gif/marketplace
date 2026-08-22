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
    const [products, setProducts] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedProductType, setSelectedProductType] = useState("");

    const [search, setSearch] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [showAllBrands, setShowAllBrands] = useState(false);

    const [searchParams] = useSearchParams();

    const searchFromNavbar = searchParams.get("search") || "";
    const productTypesFromNavbar = searchParams.getAll("product_type");


    const categories = [
        "Medicine",
        "Supplements",
        "Food",
        "Accessory",
        "Grooming",
    ];

    /* =====================================================
       LOAD PRODUCTS
    ===================================================== */

    const loadProducts = async (
        productTypes = productTypesFromNavbar,
        brand = selectedBrand,
        searchValue = search,
        min = minPrice,
        max = maxPrice,
        sorting = sort,
        currentPage = page
    ) => {
        try {
            setLoading(true);

            let url = `products/?page=${currentPage}`;

            if (searchValue) {
                url += `&search=${encodeURIComponent(searchValue)}`;
            }

            if (productTypes && productTypes.length > 0) {
                productTypes.forEach((type) => {
                    url += `&product_type=${encodeURIComponent(type)}`;
                });
            }

            if (brand) {
                url += `&brand=${encodeURIComponent(brand)}`;
            }

            if (min) {
                url += `&min_price=${encodeURIComponent(min)}`;
            }

            if (max) {
                url += `&max_price=${encodeURIComponent(max)}`;
            }

            if (sorting) {
                url += `&sort=${encodeURIComponent(sorting)}`;
            }

            const response = await api.get(url);

            const results = response.data.results || [];
            const count = response.data.count || 0;

            setProducts(results);
            setProductCount(count);

            setTotalPages(
                Math.max(1, Math.ceil(count / 12))
            );
        } catch (error) {
            console.error(
                "Product loading error:",
                error.response?.data || error.message
            );

            setProducts([]);
            setProductCount(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       NAVBAR SEARCH / CATEGORY
    ===================================================== */

    useEffect(() => {
        setSearch(searchFromNavbar);
        setPage(1);

        loadProducts(
            productTypesFromNavbar,
            selectedBrand,
            searchFromNavbar,
            minPrice,
            maxPrice,
            sort,
            1
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        searchFromNavbar,
        productTypesFromNavbar.join("|"),
    ]);

    /* =====================================================
       PAGINATION
    ===================================================== */

    useEffect(() => {
        if (page === 1) return;

        loadProducts(
            productTypesFromNavbar,
            selectedBrand,
            search,
            minPrice,
            maxPrice,
            sort,
            page
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    /* =====================================================
       APPLY FILTERS
    ===================================================== */

    const applyFilters = (
        brand = selectedBrand,
        productType = selectedProductType,
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

        const types = productType
            ? [productType]
            : productTypesFromNavbar;

        loadProducts(
            types,
            brand,
            search,
            min,
            max,
            sorting,
            1
        );
    };

    /* =====================================================
       BRAND
    ===================================================== */

    const handleBrandChange = (brand) => {
        applyFilters(
            brand,
            selectedProductType,
            minPrice,
            maxPrice,
            sort
        );
    };

    /* =====================================================
       CATEGORY
    ===================================================== */

    const handleCategoryClick = (category) => {
        applyFilters(
            selectedBrand,
            category,
            minPrice,
            maxPrice,
            sort
        );
    };

    const handleAllProducts = () => {
        setSelectedProductType("");
        setPage(1);

        loadProducts(
            [],
            selectedBrand,
            search,
            minPrice,
            maxPrice,
            sort,
            1
        );
    };

    /* =====================================================
       SORT
       BUTTON BASED - NO DROPDOWN
    ===================================================== */

    const handleSort = (value) => {
        setSort(value);
        setPage(1);

        loadProducts(
            productTypesFromNavbar,
            selectedBrand,
            search,
            minPrice,
            maxPrice,
            value,
            1
        );
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

        loadProducts(
            [],
            "",
            "",
            "",
            "",
            "",
            1
        );
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
       BRANDS
    ===================================================== */

    const brands = useMemo(() => {
        const values = products
            .map((product) => product.brand)
            .filter(Boolean);

        return [...new Set(values)];
    }, [products]);

    const visibleBrands = showAllBrands
        ? brands
        : brands.slice(0, 6);

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="products-page">

            <div className="products-main-container">

                <div className="products-layout">

                    {/* =================================================
                        SIDEBAR
                    ================================================= */}

                    <aside className="products-sidebar">

                        <div className="sidebar-mobile-header">
                            <strong>Filters</strong>

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

                        {/* ================= CATEGORIES ================= */}

                        <div className="sidebar-section">

                            <h3>Categories</h3>

                            <button
                                type="button"
                                className={
                                    !selectedProductType
                                        ? "active"
                                        : ""
                                }
                                onClick={handleAllProducts}
                            >
                                All Products
                            </button>

                            {categories.map((category) => (
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
                            ))}

                        </div>

                        {/* ================= PRICE ================= */}

                        <div className="sidebar-section">

                            <h3>Price Range</h3>

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
                                    applyFilters(
                                        selectedBrand,
                                        selectedProductType,
                                        minPrice,
                                        maxPrice,
                                        sort
                                    )
                                }
                            >
                                Apply Price
                            </button>

                        </div>

                        {/* ================= BRANDS ================= */}

                        <div className="sidebar-section">

                            <h3>Popular Brands</h3>

                            {visibleBrands.length > 0 ? (
                                visibleBrands.map(
                                    (brand) => (
                                        <label
                                            className="brand-option"
                                            key={brand}
                                        >

                                            <input
                                                type="radio"
                                                name="sidebar-brand"
                                                checked={
                                                    selectedBrand ===
                                                    brand
                                                }
                                                onChange={() =>
                                                    handleBrandChange(
                                                        brand
                                                    )
                                                }
                                            />

                                            <span>
                                                {brand}
                                            </span>

                                        </label>
                                    )
                                )
                            ) : (
                                <p className="sidebar-empty">
                                    Brands will appear here.
                                </p>
                            )}

                            {brands.length > 6 && (
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

                        {/* ================= SORT ================= */}

                        <div className="sidebar-sort">

                            <div className="sidebar-sort-title">
                                <FaSortAmountDown />
                                <h3>Sort Products</h3>
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
                                    <span>Default</span>

                                    {sort === "" && (
                                        <FaCheck />
                                    )}
                                </button>

                                <button
                                    type="button"
                                    className={
                                        sort ===
                                        "price_low"
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
                                        sort ===
                                        "price_high"
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

                        {/* ================= CLEAR ================= */}

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

                    {/* =================================================
                        PRODUCT SECTION
                    ================================================= */}

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

                        {/* ================= LOADING ================= */}

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
                                        length: Math.ceil(
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

                                                {/* =================
                                                    4 PRODUCTS
                                                ================= */}

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

                                                {/* =================
                                                    ADVERTISEMENT
                                                ================= */}

                                                <div className="product-row-ad">

                                                    <div className="row-ad-icon">
                                                        {rowIndex % 2 ===
                                                        0
                                                            ? "🐾"
                                                            : "🐶"}
                                                    </div>

                                                    <div className="row-ad-copy">

                                                        <span className="row-ad-badge">
                                                            SPECIAL PET
                                                            CARE
                                                        </span>

                                                        <h3>
                                                            Everything
                                                            Your Pet
                                                            Needs in One
                                                            Place
                                                        </h3>

                                                        <p>
                                                            Quality food,
                                                            medicines,
                                                            supplements
                                                            and
                                                            accessories
                                                            for happy
                                                            pets.
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

                        {/* ================= PAGINATION ================= */}

                        {totalPages > 1 && (
                            <div className="products-pagination">

                                <Pagination
                                    page={page}
                                    totalPages={totalPages}
                                    setPage={setPage}
                                />

                            </div>
                        )}

                    </main>

                </div>

                {/* =================================================
                    BENEFITS
                ================================================= */}

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