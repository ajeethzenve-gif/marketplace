import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Product.css";

function EditProduct() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [categories, setCategories] = useState([]);

    const [brands, setBrands] = useState([]);

    const [loading, setLoading] = useState(false);

    const [preview, setPreview] = useState("");

    const [formData, setFormData] = useState({

        product_name: "",

        sku: "",

        category: "",

        brand: "",

        pet_type: "Dog",

        price: "",

        stock: "",

        weight: "",

        description: "",

        is_available: true,

        image: null,

    });

    useEffect(() => {

        loadCategories();

        loadBrands();

        loadProduct();

    }, []);

    const loadCategories = async () => {

        try {

            const response = await axios.get(
                "http://127.0.0.1:8000/api/categories/"
            );

            setCategories(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const loadBrands = async () => {

        try {

            const response = await axios.get(
                "http://127.0.0.1:8000/api/brands/"
            );

            setBrands(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const loadProduct = async () => {

        try {

            const response = await axios.get(
                `http://127.0.0.1:8000/api/products/${id}/`
            );

            const product = response.data;

            setFormData({

                product_name: product.product_name,

                sku: product.sku,

                category: product.category,

                brand: product.brand,

                pet_type: product.pet_type,

                price: product.price,

                stock: product.stock,

                weight: product.weight,

                description: product.description,

                is_available: product.is_available,

                image: null,

            });

            if (product.image) {

                setPreview(
                    `http://127.0.0.1:8000${product.image}`
                );

            }

        }

        catch (error) {

            console.log(error);

            alert("Unable to load product.");

        }

    };

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setFormData({

            ...formData,

            [name]: type === "checkbox" ? checked : value,

        });

    };

    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setFormData({

            ...formData,

            image: file,

        });

        setPreview(URL.createObjectURL(file));

    };

    const handleCancel = () => {

        navigate("/products/manage");

    };
        return (

        <div className="admin-page">

            <div className="admin-header">

                <h2>Edit Product</h2>

            </div>

            <form
                className="product-form"
                onSubmit={handleSubmit}
            >

                {/* Row 1 */}

                <div className="form-row">

                    <div className="form-group">

                        <label>Product Name</label>

                        <input
                            type="text"
                            name="product_name"
                            value={formData.product_name}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>SKU</label>

                        <input
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            required
                        />

                    </div>

                </div>

                {/* Row 2 */}

                <div className="form-row">

                    <div className="form-group">

                        <label>Category</label>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Category
                            </option>

                            {

                                categories.map((category) => (

                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.category_name}
                                    </option>

                                ))

                            }

                        </select>

                    </div>

                    <div className="form-group">

                        <label>Brand</label>

                        <select
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Brand
                            </option>

                            {

                                brands.map((brand) => (

                                    <option
                                        key={brand.id}
                                        value={brand.id}
                                    >
                                        {brand.brand_name}
                                    </option>

                                ))

                            }

                        </select>

                    </div>

                </div>

                {/* Row 3 */}

                <div className="form-row">

                    <div className="form-group">

                        <label>Pet Type</label>

                        <select
                            name="pet_type"
                            value={formData.pet_type}
                            onChange={handleChange}
                        >

                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                            <option value="Bird">Bird</option>
                            <option value="Rabbit">Rabbit</option>
                            <option value="Fish">Fish</option>

                        </select>

                    </div>

                    <div className="form-group">

                        <label>Weight</label>

                        <input
                            type="text"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            placeholder="500 g / 1 kg"
                        />

                    </div>

                </div>

                {/* Row 4 */}

                <div className="form-row">

                    <div className="form-group">

                        <label>Price</label>

                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Stock</label>

                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                        />

                    </div>

                </div>

                {/* Row 5 */}

                <div className="form-row">

                    <div className="form-group">

                        <label>Description</label>

                        <textarea
                            rows="5"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>Product Image</label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                        />

                        {

                            preview && (

                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="preview-image"
                                />

                            )

                        }

                    </div>

                </div>
                            {/* Row 6 */}

                <div className="form-row">

                    <div className="form-group">

                        <label>

                            <input
                                type="checkbox"
                                name="is_available"
                                checked={formData.is_available}
                                onChange={handleChange}
                            />

                            &nbsp;Available

                        </label>

                    </div>

                    <div className="button-group">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-btn"
                            disabled={loading}
                        >
                            {
                                loading
                                    ? "Updating..."
                                    : "Update Product"
                            }
                        </button>

                    </div>

                </div>

            </form>

        </div>

    );

    async function handleSubmit(e) {

        e.preventDefault();

        setLoading(true);

        const data = new FormData();

        data.append("product_name", formData.product_name);
        data.append("sku", formData.sku);
        data.append("category", formData.category);
        data.append("brand", formData.brand);
        data.append("pet_type", formData.pet_type);
        data.append("price", formData.price);
        data.append("stock", formData.stock);
        data.append("weight", formData.weight);
        data.append("description", formData.description);
        data.append("is_available", formData.is_available);

        if (formData.image) {

            data.append("image", formData.image);

        }

        try {

            await axios.put(

                `http://127.0.0.1:8000/api/products/${id}/`,

                data,

                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }

            );

            alert("Product Updated Successfully");

            navigate("/products/manage");

        }

        catch (error) {

            console.log("UPDATE ERROR:", error.response?.data);

            alert(
                JSON.stringify(error.response?.data)
            );

        }

        finally {

            setLoading(false);

        }

    }

}

export default EditProduct;