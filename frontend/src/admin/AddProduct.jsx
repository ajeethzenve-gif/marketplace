import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Product.css";

function AddProduct() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState("");

    const [formData, setFormData] = useState({
        product_name: "",
        sku: "",
        category: "",
        brand: "",
        product_type: "Medicine",
        pet_type: "Dog",
        price: "",
        stock: "",
        weight: "",
        description: "",
        is_available: true,
        image: null,
    });

    // ==============================
    // LOAD CATEGORY & BRAND
    // ==============================

    useEffect(() => {
        loadCategories();
        loadBrands();
    }, []);

    const loadCategories = async () => {

        try {

            const response = await axios.get(
                "http://127.0.0.1:8000/api/categories/"
            );

            setCategories(response.data);

        } catch (error) {

            console.error(
                "Category loading error:",
                error.response?.data || error.message
            );

        }

    };

    const loadBrands = async () => {

        try {

            const response = await axios.get(
                "http://127.0.0.1:8000/api/brands/"
            );

            setBrands(response.data);

        } catch (error) {

            console.error(
                "Brand loading error:",
                error.response?.data || error.message
            );

        }

    };

    // ==============================
    // HANDLE INPUT CHANGE
    // ==============================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox"
                ? checked
                : value,
        }));

    };

    // ==============================
    // HANDLE IMAGE
    // ==============================

    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        // Image size validation
        if (file.size > 5 * 1024 * 1024) {

            alert("Image size must be less than 5 MB.");

            e.target.value = "";

            return;
        }

        setFormData((prev) => ({
            ...prev,
            image: file,
        }));

        setPreview(
            URL.createObjectURL(file)
        );

    };

    // ==============================
    // SUBMIT PRODUCT
    // ==============================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        const data = new FormData();

        data.append(
            "product_name",
            formData.product_name
        );

        data.append(
            "sku",
            formData.sku
        );

        data.append(
            "category",
            formData.category
        );

        data.append(
            "brand",
            formData.brand
        );

        // IMPORTANT
        data.append(
            "product_type",
            formData.product_type
        );

        data.append(
            "pet_type",
            formData.pet_type
        );

        data.append(
            "price",
            formData.price
        );

        data.append(
            "stock",
            formData.stock
        );

        data.append(
            "weight",
            formData.weight
        );

        data.append(
            "description",
            formData.description
        );

        data.append(
            "is_available",
            formData.is_available
        );

        if (formData.image) {

            data.append(
                "image",
                formData.image
            );

        }

        try {

            const token =
                localStorage.getItem("access");

            const response = await axios.post(
                "http://127.0.0.1:8000/api/products/",
                data,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            console.log(
                "Product created:",
                response.data
            );

            alert(
                "Product Added Successfully"
            );

            navigate(
                "/products/manage"
            );

        } catch (error) {

            console.error(
                "Product creation error:",
                error.response?.data ||
                error.message
            );

            if (error.response?.data) {

                alert(
                    JSON.stringify(
                        error.response.data
                    )
                );

            } else {

                alert(
                    "Unable to Add Product"
                );

            }

        } finally {

            setLoading(false);

        }

    };

    // ==============================
    // CANCEL
    // ==============================

    const handleCancel = () => {

        navigate(
            "/products/manage"
        );

    };

    // ==============================
    // JSX
    // ==============================

    return (

        <div className="admin-page">

            <div className="admin-header">

                <h2>
                    Add Product
                </h2>

            </div>

            <form
                className="product-form"
                onSubmit={handleSubmit}
            >

                {/* =========================
                    ROW 1
                ========================== */}

                <div className="form-row">

                    <div className="form-group">

                        <label>
                            Product Name
                        </label>

                        <input
                            type="text"
                            name="product_name"
                            value={
                                formData.product_name
                            }
                            onChange={handleChange}
                            placeholder="Enter product name"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            SKU
                        </label>

                        <input
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            placeholder="Example: MED-001"
                            required
                        />

                    </div>

                </div>


                {/* =========================
                    ROW 2
                ========================== */}

                <div className="form-row">

                    <div className="form-group">

                        <label>
                            Category
                        </label>

                        <select
                            name="category"
                            value={
                                formData.category
                            }
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Category
                            </option>

                            {categories.map(
                                (category) => (

                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {
                                            category.category_name
                                        }
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    <div className="form-group">

                        <label>
                            Brand
                        </label>

                        <select
                            name="brand"
                            value={
                                formData.brand
                            }
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Brand
                            </option>

                            {brands.map(
                                (brand) => (

                                    <option
                                        key={brand.id}
                                        value={brand.id}
                                    >
                                        {
                                            brand.brand_name
                                        }
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                </div>


                {/* =========================
                    PRODUCT TYPE
                ========================== */}

                <div className="form-row">

                    <div className="form-group">

                        <label>
                            Product Type
                        </label>

                        <select
                            name="product_type"
                            value={
                                formData.product_type
                            }
                            onChange={handleChange}
                            required
                        >

                            <option value="Medicine">
                                Medicine
                            </option>

                            <option value="Supplement">
                                Supplement
                            </option>

                            <option value="Food">
                                Food
                            </option>

                            <option value="Treat">
                                Treats
                            </option>

                            <option value="Grooming">
                                Grooming
                            </option>

                            <option value="Hygiene">
                                Hygiene
                            </option>

                            <option value="FleaTick">
                                Flea & Tick Control
                            </option>

                            <option value="Deworming">
                                Deworming
                            </option>

                            <option value="DentalCare">
                                Dental Care
                            </option>

                            <option value="SkinCare">
                                Skin Care
                            </option>

                            <option value="JointCare">
                                Joint & Bone Care
                            </option>

                            <option value="Vitamins">
                                Vitamins
                            </option>

                            <option value="Accessories">
                                Pet Accessories
                            </option>

                            <option value="Toys">
                                Toys
                            </option>

                            <option value="Beds">
                                Beds & Furniture
                            </option>

                            <option value="Leashes">
                                Leashes & Collars
                            </option>

                            <option value="Clothing">
                                Pet Clothing
                            </option>

                            <option value="Feeding">
                                Feeding Supplies
                            </option>

                            <option value="Aquarium">
                                Aquarium Supplies
                            </option>

                            <option value="BirdCare">
                                Bird Care
                            </option>

                            <option value="FarmSupplies">
                                Farm Supplies
                            </option>

                            <option value="VetEquipment">
                                Veterinary Equipment
                            </option>

                            <option value="Other">
                                Other
                            </option>

                        </select>

                    </div>


                    <div className="form-group">

                        <label>
                            Pet Type
                        </label>

                        <select
                            name="pet_type"
                            value={
                                formData.pet_type
                            }
                            onChange={handleChange}
                            required
                        >

                            <option value="Dog">
                                Dog
                            </option>

                            <option value="Cat">
                                Cat
                            </option>

                            <option value="Bird">
                                Bird
                            </option>

                            <option value="Rabbit">
                                Rabbit
                            </option>

                            <option value="Fish">
                                Fish
                            </option>

                        </select>

                    </div>

                </div>


                {/* =========================
                    ROW 4
                ========================== */}

                <div className="form-row">

                    <div className="form-group">

                        <label>
                            Price (₹)
                        </label>

                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Stock
                        </label>

                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            min="0"
                            placeholder="0"
                            required
                        />

                    </div>

                </div>


                {/* =========================
                    ROW 5
                ========================== */}

                <div className="form-row">

                    <div className="form-group">

                        <label>
                            Weight / Quantity
                        </label>

                        <input
                            type="text"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            placeholder="500 g / 1 kg / 10 Tablets"
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Product Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                        />

                        {preview && (

                            <img
                                src={preview}
                                alt="Product Preview"
                                className="preview-image"
                            />

                        )}

                    </div>

                </div>


                {/* =========================
                    DESCRIPTION
                ========================== */}

                <div className="form-row">

                    <div
                        className="form-group full-width"
                    >

                        <label>
                            Description
                        </label>

                        <textarea
                            rows="5"
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={handleChange}
                            placeholder="Enter product description..."
                            required
                        />

                    </div>

                </div>


                {/* =========================
                    AVAILABLE + BUTTONS
                ========================== */}

                <div className="form-row">

                    <div className="form-group">

                        <label className="available-label">

                            <input
                                type="checkbox"
                                name="is_available"
                                checked={
                                    formData.is_available
                                }
                                onChange={handleChange}
                            />

                            <span>
                                Available
                            </span>

                        </label>

                    </div>


                    <div className="button-group">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="save-btn"
                            disabled={loading}
                        >

                            {loading
                                ? "Saving..."
                                : "Save Product"
                            }

                        </button>

                    </div>

                </div>

            </form>

        </div>

    );

}

export default AddProduct;