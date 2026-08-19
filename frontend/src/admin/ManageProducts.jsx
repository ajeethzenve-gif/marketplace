import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
    FaPlus,
    FaEdit,
    FaTrash,
} from "react-icons/fa";

import "./Product.css";


function ManageProducts() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [selectedProduct, setSelectedProduct] =
        useState(null);


    // =====================================================
    // LOAD ALL ADMIN PRODUCTS
    // =====================================================

    useEffect(() => {

        loadProducts();

    }, []);


    const loadProducts = async () => {

        try {

            const accessToken =
                localStorage.getItem("access");


            const response = await axios.get(
                "http://127.0.0.1:8000/api/products/admin/",
                {
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                    },
                }
            );


            /*
             * ADMIN API RETURNS ALL PRODUCTS
             *
             * Expected response:
             *
             * [
             *     {...},
             *     {...},
             *     {...}
             * ]
             *
             */


            const data = response.data;


            if (Array.isArray(data)) {

                setProducts(data);

            } else if (
                Array.isArray(data?.results)
            ) {

                setProducts(data.results);

            } else {

                setProducts([]);

            }


        } catch (error) {

            console.error(
                "Load Products Error:",
                error.response?.data || error
            );


            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                alert(
                    "You are not authorized to access admin products."
                );

            }


            setProducts([]);

        }

    };


    // =====================================================
    // EDIT PRODUCT
    // =====================================================

    const openEditPage = (id) => {

        navigate(
            `/products/edit/${id}`
        );

    };


    // =====================================================
    // DELETE MODAL
    // =====================================================

    const confirmDelete = (product) => {

        setSelectedProduct(product);

        setShowDeleteModal(true);

    };


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    const deleteProduct = async () => {

        if (!selectedProduct) {
            return;
        }


        try {

            const accessToken =
                localStorage.getItem("access");


            await axios.delete(

                `http://127.0.0.1:8000/api/products/${selectedProduct.id}/`,

                {
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                    },
                }

            );


            alert(
                "Product Deleted Successfully"
            );


            setShowDeleteModal(false);

            setSelectedProduct(null);


            // Reload all products
            loadProducts();


        } catch (error) {

            console.error(
                "Delete Product Error:",
                error.response?.data || error
            );


            alert(
                error.response?.data?.detail ||
                "Unable to Delete Product"
            );

        }

    };


    // =====================================================
    // IMAGE URL
    // =====================================================

    const getImageUrl = (image) => {

        if (!image) {

            return null;

        }


        // If serializer returns full URL
        if (image.startsWith("http")) {

            return image;

        }


        // If serializer returns /media/...
        return `http://127.0.0.1:8000${image}`;

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="manage-products">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="page-header">

                <h2>
                    Manage Products
                </h2>


                <Link
                    to="/products/add"
                    className="add-btn"
                >

                    <FaPlus />

                    &nbsp;

                    Add Product

                </Link>

            </div>


            {/* =================================================
                PRODUCT COUNT
            ================================================= */}

            <div className="product-count">

                Total Products:

                <strong>
                    &nbsp;{products.length}
                </strong>

            </div>


            {/* =================================================
                PRODUCT TABLE
            ================================================= */}

            <div className="product-table-wrapper">

                <table className="product-table">


                    <thead>

                        <tr>

                            <th>
                                Sl.No
                            </th>

                            <th>
                                Image
                            </th>

                            <th>
                                Name
                            </th>

                            <th>
                                Category
                            </th>

                            <th>
                                Brand
                            </th>

                            <th>
                                Price
                            </th>

                            <th>
                                Stock
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                    </thead>


                    <tbody>


                        {products.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="8"
                                    style={{
                                        textAlign:
                                            "center",

                                        padding:
                                            "30px",
                                    }}
                                >

                                    No Products Found

                                </td>

                            </tr>

                        ) : (

                            products.map(
                                (
                                    product,
                                    index
                                ) => (

                                    <tr
                                        key={
                                            product.id
                                        }

                                        className={
                                            Number(
                                                product.stock
                                            ) < 10

                                                ? "low-stock-row"

                                                : ""
                                        }
                                    >


                                        {/* =====================================
                                            SERIAL NUMBER
                                        ===================================== */}

                                        <td>

                                            {index + 1}

                                        </td>


                                        {/* =====================================
                                            IMAGE
                                        ===================================== */}

                                        <td
                                            className="product-image-cell"
                                        >

                                            {product.image ? (

                                                <img

                                                    src={
                                                        getImageUrl(
                                                            product.image
                                                        )
                                                    }

                                                    alt={
                                                        product.product_name ||
                                                        "Product"
                                                    }

                                                    className="product-table-image"

                                                    onError={(
                                                        e
                                                    ) => {

                                                        e.target.style.display =
                                                            "none";

                                                        if (
                                                            e.target
                                                                .nextSibling
                                                        ) {

                                                            e.target
                                                                .nextSibling
                                                                .style.display =
                                                                "flex";

                                                        }

                                                    }}

                                                />

                                            ) : null}


                                            <span

                                                className="no-product-image"

                                                style={{
                                                    display:
                                                        product.image
                                                            ? "none"
                                                            : "flex",
                                                }}

                                            >

                                                No Image

                                            </span>

                                        </td>


                                        {/* =====================================
                                            PRODUCT NAME
                                        ===================================== */}

                                        <td>

                                            {
                                                product.product_name
                                            }

                                        </td>


                                        {/* =====================================
                                            CATEGORY
                                        ===================================== */}

                                        <td>

                                            {
                                                product.category_name ||
                                                "-"
                                            }

                                        </td>


                                        {/* =====================================
                                            BRAND
                                        ===================================== */}

                                        <td>

                                            {
                                                product.brand_name ||
                                                "-"
                                            }

                                        </td>


                                        {/* =====================================
                                            PRICE
                                        ===================================== */}

                                        <td>

                                            ₹
                                            {
                                                product.price
                                            }

                                        </td>


                                        {/* =====================================
                                            STOCK
                                        ===================================== */}

                                        <td>

                                            {
                                                Number(
                                                    product.stock
                                                ) < 10 ? (

                                                    <span
                                                        className="low-stock-text"
                                                    >

                                                        ⚠{" "}

                                                        {
                                                            product.stock
                                                        }

                                                    </span>

                                                ) : (

                                                    product.stock

                                                )
                                            }

                                        </td>


                                        {/* =====================================
                                            ACTIONS
                                        ===================================== */}

                                        <td
                                            className="action-buttons"
                                        >


                                            <button

                                                className="edit-btn"

                                                onClick={() =>
                                                    openEditPage(
                                                        product.id
                                                    )
                                                }

                                                title="Edit Product"

                                            >

                                                <FaEdit />

                                            </button>


                                            <button

                                                className="delete-btn"

                                                onClick={() =>
                                                    confirmDelete(
                                                        product
                                                    )
                                                }

                                                title="Delete Product"

                                            >

                                                <FaTrash />

                                            </button>


                                        </td>


                                    </tr>

                                )
                            )

                        )}

                    </tbody>

                </table>

            </div>


            {/* =================================================
                DELETE CONFIRMATION MODAL
            ================================================= */}

            {showDeleteModal && (

                <div className="modal-overlay">

                    <div className="delete-modal">


                        <h3>
                            Delete Product
                        </h3>


                        <p>

                            Are you sure you want
                            to delete

                            <br />

                            <strong>

                                {
                                    selectedProduct?.product_name
                                }

                            </strong>

                            ?

                        </p>


                        <div
                            className="modal-buttons"
                        >


                            <button

                                className="cancel-btn"

                                onClick={() => {

                                    setShowDeleteModal(
                                        false
                                    );

                                    setSelectedProduct(
                                        null
                                    );

                                }}

                            >

                                Cancel

                            </button>


                            <button

                                className="delete-confirm-btn"

                                onClick={
                                    deleteProduct
                                }

                            >

                                Delete

                            </button>


                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


export default ManageProducts;