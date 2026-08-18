import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import "./Product.css";

function ManageProducts() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {

        loadProducts();

    }, []);

    const loadProducts = async () => {

        try {

            const response = await axios.get(
                "http://127.0.0.1:8000/api/products/"
            );

            setProducts(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const openEditPage = (id) => {

        navigate(`/products/edit/${id}`);

    };

    const confirmDelete = (product) => {

        setSelectedProduct(product);

        setShowDeleteModal(true);

    };

    const deleteProduct = async () => {

        if (!selectedProduct) return;

        try {

            await axios.delete(

                `http://127.0.0.1:8000/api/products/${selectedProduct.id}/`,

                {

                    headers: {

                        Authorization: `Bearer ${localStorage.getItem("access")}`,

                    },

                }

            );

            alert("Product Deleted Successfully");

            setShowDeleteModal(false);

            setSelectedProduct(null);

            loadProducts();

        }

        catch (error) {

            console.log(error);

            alert("Unable to Delete Product");

        }

    };

    return (

        <div className="manage-products">

            <div className="page-header">

                <h2>Manage Products</h2>

                <Link
                    to="/products/add"
                    className="add-btn"
                >

                    <FaPlus />

                    &nbsp;Add Product

                </Link>

            </div>

            <table className="product-table">

                <thead>

                    <tr>

                        <th>Sl.No</th>

                        <th>Name</th>

                        <th>Category</th>

                        <th>Brand</th>

                        <th>Price</th>

                        <th>Stock</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>
        {
    products.length === 0 ? (

        <tr>

            <td
                colSpan="7"
                style={{ textAlign: "center" }}
            >
                No Products Found
            </td>

        </tr>

    ) : (

        products.map((product, index) => (

            <tr
                key={product.id}
                className={
                    Number(product.stock) < 10
                        ? "low-stock-row"
                        : ""
                }
            >

                <td>{index + 1}</td>

                <td>{product.product_name}</td>

                <td>{product.category_name}</td>

                <td>{product.brand_name}</td>

                <td>₹{product.price}</td>

                <td>

                    {
                        Number(product.stock) < 10 ? (

                            <span className="low-stock-text">

                                ⚠ {product.stock}

                            </span>

                        ) : (

                            product.stock

                        )
                    }

                </td>

                <td className="action-buttons">

                    <button
                        className="edit-btn"
                        onClick={() =>
                            openEditPage(product.id)
                        }
                        title="Edit Product"
                    >

                        <FaEdit />

                    </button>

                    <button
                        className="delete-btn"
                        onClick={() =>
                            confirmDelete(product)
                        }
                        title="Delete Product"
                    >

                        <FaTrash />

                    </button>

                </td>

            </tr>

        ))

    )
}

                </tbody>

            </table>
                    {/* Delete Confirmation Modal */}

            {
                showDeleteModal && (

                    <div className="modal-overlay">

                        <div className="delete-modal">

                            <h3>
                                Delete Product
                            </h3>

                            <p>

                                Are you sure you want to delete

                                <br />

                                <strong>

                                    {selectedProduct?.product_name}

                                </strong>

                                ?

                            </p>

                            <div className="modal-buttons">

                                <button
                                    className="cancel-btn"
                                    onClick={() => {

                                        setShowDeleteModal(false);

                                        setSelectedProduct(null);

                                    }}
                                >

                                    Cancel

                                </button>

                                <button
                                    className="delete-confirm-btn"
                                    onClick={deleteProduct}
                                >

                                    Delete

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </div>

    );

}

export default ManageProducts;