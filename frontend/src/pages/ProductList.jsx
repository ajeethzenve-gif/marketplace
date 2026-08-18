import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import api from "../api/api";

import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination.jsx";


function ProductList() {

    // =====================================================
    // PRODUCTS
    // =====================================================

    const [products, setProducts] = useState([]);


    // =====================================================
    // FILTER STATES
    // =====================================================

    const [selectedBrand, setSelectedBrand] = useState("");

    const [search, setSearch] = useState("");

    const [minPrice, setMinPrice] = useState("");

    const [maxPrice, setMaxPrice] = useState("");

    const [sort, setSort] = useState("");


    // =====================================================
    // URL
    // =====================================================

    const [searchParams] = useSearchParams();


    // Search from Navbar
    const searchFromNavbar =
        searchParams.get("search") || "";


    // IMPORTANT:
    // getAll() allows one or multiple product types
    //
    // Example:
    //
    // ?product_type=Medicine
    //
    // returns:
    // ["Medicine"]
    //
    // ?product_type=Medicine&product_type=Supplement
    //
    // returns:
    // ["Medicine", "Supplement"]

    const productTypesFromNavbar =
        searchParams.getAll("product_type");


    // =====================================================
    // PAGINATION
    // =====================================================

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);


    // =====================================================
    // LOAD PRODUCTS
    // =====================================================

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

            // =================================================
            // BASE URL
            // =================================================

            let url =
                `products/?page=${currentPage}`;


            // =================================================
            // SEARCH
            // =================================================

            if (searchValue) {

                url +=
                    `&search=${encodeURIComponent(
                        searchValue
                    )}`;

            }


            // =================================================
            // PRODUCT TYPE
            // =================================================

            /*
                IMPORTANT:

                We must add every product_type separately.

                Example:

                ["Medicine", "Supplement"]

                becomes:

                ?product_type=Medicine
                &product_type=Supplement
            */

            if (
                productTypes &&
                productTypes.length > 0
            ) {

                productTypes.forEach(
                    (type) => {

                        url +=
                            `&product_type=${encodeURIComponent(
                                type
                            )}`;

                    }
                );

            }


            // =================================================
            // BRAND
            // =================================================

            if (brand) {

                url +=
                    `&brand=${encodeURIComponent(
                        brand
                    )}`;

            }


            // =================================================
            // MIN PRICE
            // =================================================

            if (min) {

                url +=
                    `&min_price=${encodeURIComponent(
                        min
                    )}`;

            }


            // =================================================
            // MAX PRICE
            // =================================================

            if (max) {

                url +=
                    `&max_price=${encodeURIComponent(
                        max
                    )}`;

            }


            // =================================================
            // SORT
            // =================================================

            if (sorting) {

                url +=
                    `&sort=${encodeURIComponent(
                        sorting
                    )}`;

            }


            // =================================================
            // DEBUG
            // =================================================

            console.log(
                "PRODUCT API:",
                url
            );


            // =================================================
            // API CALL
            // =================================================

            const response =
                await api.get(url);


            // =================================================
            // PRODUCTS
            // =================================================

            setProducts(
                response.data.results || []
            );


            // =================================================
            // TOTAL PAGES
            // =================================================

            const count =
                response.data.count || 0;

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

            setTotalPages(1);

        }

    };


    // =====================================================
    // URL FILTER CHANGE
    // =====================================================

    useEffect(() => {

        // ---------------------------------------------
        // Update search from Navbar
        // ---------------------------------------------

        setSearch(
            searchFromNavbar
        );


        // ---------------------------------------------
        // Reset page
        // ---------------------------------------------

        setPage(1);


        // ---------------------------------------------
        // Load products
        // ---------------------------------------------

        loadProducts(

            productTypesFromNavbar,

            selectedBrand,

            searchFromNavbar,

            minPrice,

            maxPrice,

            sort,

            1

        );

    }, [
        searchFromNavbar,
        productTypesFromNavbar.join("|")
    ]);


    // =====================================================
    // PAGE CHANGE
    // =====================================================

    useEffect(() => {

        // Page 1 is already loaded
        // by the URL/filter effect.

        if (page === 1) {
            return;
        }


        loadProducts(

            productTypesFromNavbar,

            selectedBrand,

            search,

            minPrice,

            maxPrice,

            sort,

            page

        );

    }, [page]);


    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = (e) => {

        const value =
            e.target.value;


        setSearch(value);

        setPage(1);


        loadProducts(

            productTypesFromNavbar,

            selectedBrand,

            value,

            minPrice,

            maxPrice,

            sort,

            1

        );

    };


    // =====================================================
    // MIN PRICE
    // =====================================================

    const handleMinPrice = (e) => {

        const value =
            e.target.value;


        setMinPrice(value);

        setPage(1);


        loadProducts(

            productTypesFromNavbar,

            selectedBrand,

            search,

            value,

            maxPrice,

            sort,

            1

        );

    };


    // =====================================================
    // MAX PRICE
    // =====================================================

    const handleMaxPrice = (e) => {

        const value =
            e.target.value;


        setMaxPrice(value);

        setPage(1);


        loadProducts(

            productTypesFromNavbar,

            selectedBrand,

            search,

            minPrice,

            value,

            sort,

            1

        );

    };


    // =====================================================
    // SORT
    // =====================================================

    const handleSort = (e) => {

        const value =
            e.target.value;


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


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <>

            {/* =================================================
                PRODUCTS
            ================================================= */}

            <div className="container product-container">

                <div className="row">

                    {products.length > 0 ? (

                        products.map(
                            (product) => (

                                <div
                                    className="col-lg-4 col-md-6 col-sm-12 mb-4"
                                    key={product.id}
                                >

                                    <ProductCard
                                        product={product}
                                    />

                                </div>

                            )
                        )

                    ) : (

                        <div className="col-12">

                            <h4 className="text-center text-muted">

                                No Products Found

                            </h4>

                        </div>

                    )}

                </div>

            </div>


            {/* =================================================
                PAGINATION
            ================================================= */}

            {totalPages > 1 && (

                <Pagination
                    page={page}
                    totalPages={totalPages}
                    setPage={setPage}
                />

            )}

        </>

    );

}


export default ProductList;