import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/api";
import ProductCard from "../components/ProductCard";

import {
    FaHeart,
    FaRegHeart,
    FaStar,
    FaShoppingCart,
    FaBolt
} from "react-icons/fa";

import "../styles/ProductDetails.css";

function ProductDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const token = localStorage.getItem("access");

    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);

    const [quantity, setQuantity] = useState(1);

    const [inWishlist, setInWishlist] = useState(false);

    const [relatedProducts, setRelatedProducts] = useState([]);

    // =============================
    // Load Product
    // =============================


    useEffect(() => {
        const fetchData = async () => {
            await loadProduct();
            await loadRelatedProducts(id);

            if (token) {
                await checkWishlist();
            }
        };

        fetchData();
    }, [id]);


    const loadProduct = async () => {
        try {
            const response = await api.get(`products/${id}/`);

            setProduct(response.data);

            loadRelatedProducts(response.data.id);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // =============================
    // Wishlist
    // =============================

    const checkWishlist = async () => {

        try {

            const response = await axios.get(

                "http://127.0.0.1:8000/api/wishlist/",

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            const exists = response.data.some((item) => {

                if (item.product_id) {

                    return item.product_id === Number(id);

                }

                if (item.product) {

                    return (

                        item.product === Number(id)

                        ||

                        item.product.id === Number(id)

                    );

                }

                return false;

            });

            setInWishlist(exists);

        }

        catch (error) {

            console.log(error);

        }

    };
   const loadRelatedProducts = async (productId) => {

        try {

            const response = await api.get(
                `products/${productId}/related/`
            );

            console.log("Related Products:", response.data);

            setRelatedProducts(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };
    const toggleWishlist = async () => {

        if (!token) {

            navigate("/login");

            return;

        }

        try {

            const response = await axios.post(

                "http://127.0.0.1:8000/api/wishlist/toggle/",

                {

                    product_id: id

                },

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setInWishlist(

                response.data.in_wishlist

            );

        }

        catch (error) {

            console.log(error);

        }

    };

    // =============================
    // Quantity
    // =============================

    const increaseQuantity = () => {

        if (!product) return;

        setQuantity((prev) =>

            prev < product.stock

                ? prev + 1

                : prev

        );

    };

    const decreaseQuantity = () => {

        setQuantity((prev) =>

            prev > 1

                ? prev - 1

                : prev

        );

    };

    // =============================
    // Total Price
    // =============================

    const totalPrice =

        product

            ? Number(product.price) * quantity

            : 0;
        // =============================
    // Add To Cart
    // =============================

    const addToCart = async () => {

        if (!token) {

            navigate("/login");

            return;

        }

        try {

            await axios.post(

                "http://127.0.0.1:8000/api/cart/add/",

                {

                    product_id: product.id,

                    quantity: quantity

                },

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            alert("Product added to cart.");

        }

        catch (error) {

            console.log(error);

            alert("Failed to add product.");

        }

    };

// =============================
// Buy Now
// =============================
const buyNow = () => {

    if (!token) {

        navigate("/login");

        return;

    }

    navigate("/payment", {

        state: {

            checkoutType: "buy_now",

            product: {

                id: product.id,

                name: product.product_name,

                image: product.product_image
                    ? (
                        product.product_image.startsWith("http")
                            ? product.product_image
                            : `http://127.0.0.1:8000${product.product_image}`
                    )
                    : "https://via.placeholder.com/150",

                quantity: quantity,

                price: Number(product.price),

            },

            subtotal: Number(product.price) * quantity,

            shipping: 0,

            total: Number(product.price) * quantity,

            totalItems: quantity,

        },

    });

};
    // =============================
    // Loading
    // =============================

    if (loading) {

        return (

            <h3 className="text-center mt-5">

                Loading...

            </h3>

        );

    }

    if (!product) {

        return (

            <h3 className="text-center mt-5">

                Product not found.

            </h3>

        );

    }

    return (

        <div className="container py-5">

            <div className="row g-4">

                {/* Product Image */}

                <div className="col-lg-5">

                    <div className="product-image-card">

                        <img

                            src={

                                product.product_image

                                    ?

                                    (

                                        product.product_image.startsWith("http")

                                            ?

                                            product.product_image

                                            :

                                            `http://127.0.0.1:8000${product.product_image}`

                                    )

                                    :

                                    "https://via.placeholder.com/500x500"

                            }

                            alt={product.product_name}

                            className="img-fluid rounded"

                        />

                    </div>

                </div>

                {/* Product Details */}

                <div className="col-lg-7">

                    <div className="product-info-card">

                        <div className="d-flex justify-content-between align-items-start">

                            <div>

                                <h2 className="fw-bold">

                                    {product.product_name}

                                </h2>

                                <p className="text-muted">

                                    {product.brand_name}

                                </p>

                            </div>

                            <button

                                className="btn btn-light border"

                                onClick={toggleWishlist}

                            >

                                {

                                    inWishlist

                                        ?

                                        <FaHeart

                                            color="red"

                                            size={24}

                                        />

                                        :

                                        <FaRegHeart

                                            color="#666"

                                            size={24}

                                        />

                                }

                            </button>

                        </div>

                        {/* Rating */}

                        <div className="rating-section my-3">

                            {

                                [1, 2, 3, 4, 5].map((star) => (

                                    <FaStar

                                        key={star}

                                        className={

                                            star <= Math.round(product.average_rating || 0)

                                                ?

                                                "star-filled"

                                                :

                                                "star-empty"

                                        }

                                    />

                                ))

                            }

                            <span className="ms-2">

                                {product.average_rating || 0}/5

                            </span>

                        </div>

                        {/* Price */}

                        <h2 className="text-success fw-bold">

                            ₹ {product.price}

                        </h2>

                        <hr />

                        <h5>Description</h5>

                        <p>

                            {product.description}

                        </p>

                        {/* Product Info Table */}

                        <table className="table table-bordered mt-3">

                            <tbody>

                                <tr>

                                    <th width="180">

                                        Category

                                    </th>

                                    <td>

                                        {product.category_name}

                                    </td>

                                </tr>

                                <tr>

                                    <th>

                                        Brand

                                    </th>

                                    <td>

                                        {product.brand_name}

                                    </td>

                                </tr>

                                <tr>

                                    <th>

                                        Pet Type

                                    </th>

                                    <td>

                                        {product.pet_type}

                                    </td>

                                </tr>

                                <tr>

                                    <th>

                                        Weight

                                    </th>

                                    <td>

                                        {product.weight}

                                    </td>

                                </tr>

                                <tr>

                                    <th>

                                        Stock

                                    </th>

                                    <td>

                                        {

                                            product.stock > 0

                                                ?

                                                <span className="text-success fw-bold">

                                                    In Stock ({product.stock})

                                                </span>

                                                :

                                                <span className="text-danger fw-bold">

                                                    Out of Stock

                                                </span>

                                        }

                                    </td>

                                </tr>

                            </tbody>

                        </table>
                                {/* Quantity */}

                        <div className="mt-4">

                            <label className="form-label">

                                <strong>Quantity</strong>

                            </label>

                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">

                                <div className="d-flex align-items-center">

                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={decreaseQuantity}
                                        disabled={quantity === 1}
                                    >
                                        -
                                    </button>

                                    <input
                                        type="text"
                                        readOnly
                                        value={quantity}
                                        className="form-control text-center mx-2"
                                        style={{ width: "70px",
                                        marginTop:"0px"}}
                                    />

                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={increaseQuantity}
                                        disabled={quantity >= product.stock}
                                    >
                                        +
                                    </button>

                                </div>

                                <div className="btn btn-outline-primary">

                                    <strong>Total Price :</strong>

                                    {" "}

                                    ₹ {totalPrice.toFixed(2)}

                                </div>

                            </div>

                        </div>

                        {/* Action Buttons */}

                        <div className="d-flex flex-wrap gap-3 mt-4">

                            <button

                                className="btn btn-warning"

                                onClick={addToCart}

                                disabled={product.stock === 0}

                            >

                                <FaShoppingCart />

                                {" "}

                                Add To Cart

                            </button>

                            <button

                                className="btn btn-success"

                                onClick={buyNow}

                                disabled={product.stock === 0}

                            >

                                <FaBolt />

                                {" "}

                                Buy Now

                            </button>

                            <Link

                                to={`/products/${id}/reviews`}

                                className="btn btn-primary"

                            >

                                Reviews

                            </Link>

                            <Link

                                to="/products"

                                className="btn btn-secondary"

                            >

                                Back

                            </Link>

                        </div>

                    </div>

                </div>

            </div>
            {/* Related Products */}

            <div className="container mt-5">

                <h3 className="fw-bold mb-4">

                    Related Products

                </h3>

                <div className="row">

                    {

                        relatedProducts.length > 0 ?

                        relatedProducts.map((item) => (

                            <div
                                className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4"
                                key={item.id}
                            >

                                <ProductCard
                                    product={item}
                                />

                            </div>

                        ))

                        :

                        <div className="col-12">

                            <p className="text-muted">

                                No related products found.

                            </p>

                        </div>

                    }

                </div>

            </div>
        </div>


    );

}

export default ProductDetails;