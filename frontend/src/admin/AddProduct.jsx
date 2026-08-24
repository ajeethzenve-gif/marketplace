import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./ProductAdd.css";


const API_URL = "http://127.0.0.1:8000/api";


function AddProduct() {

    const navigate = useNavigate();


    // =====================================================
    // BASIC PRODUCT DATA
    // =====================================================

    const [formData, setFormData] = useState({

        category: "",
        brand: "",

        product_name: "",
        description: "",

        sku: "",

        pet_type: "Dog",

        product_type: "Other",

        price: "",
        stock: 0,

        weight: "",

        is_available: true,

    });


    // =====================================================
    // IMAGE
    // =====================================================

    const [image, setImage] = useState(null);

    const [imagePreview, setImagePreview] =
        useState(null);


    // =====================================================
    // CATEGORY / BRAND
    // =====================================================

    const [categories, setCategories] =
        useState([]);

    const [brands, setBrands] =
        useState([]);


    // =====================================================
    // LOADING
    // =====================================================

    const [loading, setLoading] =
        useState(false);

    const [loadingData, setLoadingData] =
        useState(true);


    // =====================================================
    // MEDICINE DATA
    // =====================================================

    const [medicineData, setMedicineData] =
        useState({

            active_ingredient: "",

            dosage: "",

            dosage_form: "",

            prescription_required: false,

            manufacturer: "",

            batch_number: "",

            expiry_date: "",

            storage_instructions: "",

            warnings: "",

        });


    // =====================================================
    // SUPPLEMENT DATA
    // =====================================================

    const [supplementData, setSupplementData] =
        useState({

            ingredients: "",

            dosage: "",

            form: "",

            flavor: "",

            age_group: "",

            weight_range: "",

            manufacturer: "",

            batch_number: "",

            expiry_date: "",

            storage_instructions: "",

            warnings: "",

        });


    // =====================================================
    // PRODUCT TYPES
    // =====================================================

    const productTypes = [

        {
            value: "Medicine",
            label: "Medicine",
        },

        {
            value: "Supplements",
            label: "Supplements",
        },

        {
            value: "Food",
            label: "Food",
        },

        {
            value: "Treat",
            label: "Treats",
        },

        {
            value: "Grooming",
            label: "Grooming",
        },

        {
            value: "Hygiene",
            label: "Hygiene",
        },

        {
            value: "FleaTick",
            label: "Flea & Tick Control",
        },

        {
            value: "Deworming",
            label: "Deworming",
        },

        {
            value: "DentalCare",
            label: "Dental Care",
        },

        {
            value: "SkinCare",
            label: "Skin Care",
        },

        {
            value: "JointCare",
            label: "Joint & Bone Care",
        },

        {
            value: "Vitamins",
            label: "Vitamins",
        },

        {
            value: "Accessories",
            label: "Pet Accessories",
        },

        {
            value: "Toys",
            label: "Toys",
        },

        {
            value: "Beds",
            label: "Beds & Furniture",
        },

        {
            value: "Leashes",
            label: "Leashes & Collars",
        },

        {
            value: "Clothing",
            label: "Pet Clothing",
        },

        {
            value: "Feeding",
            label: "Feeding Supplies",
        },

        {
            value: "Aquarium",
            label: "Aquarium Supplies",
        },

        {
            value: "BirdCare",
            label: "Bird Care",
        },

        {
            value: "FarmSupplies",
            label: "Farm Supplies",
        },

        {
            value: "VetEquipment",
            label: "Veterinary Equipment",
        },

        {
            value: "Other",
            label: "Other",
        },

    ];


    // =====================================================
    // LOAD CATEGORIES / BRANDS
    // =====================================================

    useEffect(() => {

        loadCategories();

        loadBrands();

    }, []);


    const loadCategories = async () => {

        try {

            const response = await axios.get(
                `${API_URL}/categories/`
            );

            setCategories(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );

        } catch (error) {

            console.error(
                "Category Load Error:",
                error.response?.data || error
            );

        }

    };


    const loadBrands = async () => {

        try {

            const response = await axios.get(
                `${API_URL}/brands/`
            );

            setBrands(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );

        } catch (error) {

            console.error(
                "Brand Load Error:",
                error.response?.data || error
            );

        } finally {

            setLoadingData(false);

        }

    };


    // =====================================================
    // BASIC INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;


        setFormData((previous) => ({

            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,

        }));

    };


    // =====================================================
    // MEDICINE INPUT CHANGE
    // =====================================================

    const handleMedicineChange = (e) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;


        setMedicineData((previous) => ({

            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,

        }));

    };


    // =====================================================
    // SUPPLEMENT INPUT CHANGE
    // =====================================================

    const handleSupplementChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setSupplementData((previous) => ({

            ...previous,

            [name]: value,

        }));

    };


    // =====================================================
    // IMAGE CHANGE
    // =====================================================

    const handleImageChange = (e) => {

        const file =
            e.target.files?.[0];


        if (!file) {

            setImage(null);

            setImagePreview(null);

            return;

        }


        setImage(file);


        setImagePreview(
            URL.createObjectURL(file)
        );

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!formData.category) {

            alert(
                "Please select a category."
            );

            return;

        }


        if (!formData.brand) {

            alert(
                "Please select a brand."
            );

            return;

        }


        if (!formData.product_name.trim()) {

            alert(
                "Please enter product name."
            );

            return;

        }


        if (!formData.sku.trim()) {

            alert(
                "Please enter SKU."
            );

            return;

        }


        if (!formData.price) {

            alert(
                "Please enter price."
            );

            return;

        }


        try {

            setLoading(true);


            const accessToken =
                localStorage.getItem("access");


            const data =
                new FormData();


            // =================================================
            // BASIC PRODUCT
            // =================================================

            data.append(
                "category",
                formData.category
            );

            data.append(
                "brand",
                formData.brand
            );

            data.append(
                "product_name",
                formData.product_name
            );

            data.append(
                "description",
                formData.description
            );

            data.append(
                "sku",
                formData.sku
            );

            data.append(
                "pet_type",
                formData.pet_type
            );

            data.append(
                "product_type",
                formData.product_type
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
                "is_available",
                formData.is_available
            );


            // =================================================
            // IMAGE
            // =================================================

            if (image) {

                data.append(
                    "image",
                    image
                );

            }


            // =================================================
            // CREATE PRODUCT
            // =================================================

            const response =
                await axios.post(

                    `${API_URL}/products/admin/`,

                    data,

                    {
                        headers: {

                            Authorization:
                                `Bearer ${accessToken}`,

                            "Content-Type":
                                "multipart/form-data",

                        },

                    }

                );


            const product =
                response.data;


            // =================================================
            // MEDICINE
            // =================================================

            if (
                formData.product_type ===
                "Medicine"
            ) {

                try {

                    await axios.post(

                        `${API_URL}/products/${product.id}/medicine/`,

                        medicineData,

                        {
                            headers: {

                                Authorization:
                                    `Bearer ${accessToken}`,

                            },

                        }

                    );

                } catch (medicineError) {

                    console.error(
                        "Medicine Save Error:",
                        medicineError.response?.data ||
                        medicineError
                    );

                    alert(
                        "Product created, but medicine details could not be saved."
                    );

                }

            }


            // =================================================
            // SUPPLEMENT
            // =================================================

            if (
                formData.product_type ===
                "Supplement"
            ) {

                try {

                    await axios.post(

                        `${API_URL}/products/${product.id}/supplement/`,

                        supplementData,

                        {
                            headers: {

                                Authorization:
                                    `Bearer ${accessToken}`,

                            },

                        }

                    );

                } catch (supplementError) {

                    console.error(
                        "Supplement Save Error:",
                        supplementError.response?.data ||
                        supplementError
                    );

                    alert(
                        "Product created, but supplement details could not be saved."
                    );

                }

            }


            alert(
                "Product added successfully!"
            );


            navigate(
                "/admin/products"
            );


        } catch (error) {

            console.error(
                "Add Product Error:",
                error.response?.data ||
                error
            );


            const backendErrors =
                error.response?.data;


            if (
                backendErrors &&
                typeof backendErrors === "object"
            ) {

                alert(
                    Object.entries(
                        backendErrors
                    )
                        .map(
                            ([key, value]) =>
                                `${key}: ${Array.isArray(value)
                                    ? value.join(", ")
                                    : value}`
                        )
                        .join("\n")
                );

            } else {

                alert(
                    "Failed to add product."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loadingData) {

        return (

            <div className="product-form-page">

                <p>
                    Loading...
                </p>

            </div>

        );

    }


    // =====================================================
    // JSX
    // =====================================================

    return (

        <div className="product-form-page">


            <div className="product-form-container">


                <div className="product-form-header">

                    <h2>
                        Add Product
                    </h2>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/products"
                            )
                        }
                    >
                        Back
                    </button>

                </div>


                <form
                    onSubmit={
                        handleSubmit
                    }
                >


                    {/* =============================================
                        BASIC INFORMATION
                    ============================================== */}

                    <section className="form-section">

                        <h3>
                            Product Information
                        </h3>


                        <div className="form-grid">


                            {/* CATEGORY */}

                            <div className="form-group">

                                <label>
                                    Category *
                                </label>

                                <select
                                    name="category"
                                    value={
                                        formData.category
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Category
                                    </option>


                                    {categories.map(
                                        (category) => (

                                            <option
                                                key={
                                                    category.id
                                                }
                                                value={
                                                    category.id
                                                }
                                            >

                                                {
                                                    category.category_name
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* BRAND */}

                            <div className="form-group">

                                <label>
                                    Brand *
                                </label>

                                <select
                                    name="brand"
                                    value={
                                        formData.brand
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Brand
                                    </option>


                                    {brands.map(
                                        (brand) => (

                                            <option
                                                key={
                                                    brand.id
                                                }
                                                value={
                                                    brand.id
                                                }
                                            >

                                                {
                                                    brand.brand_name
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* PRODUCT NAME */}

                            <div className="form-group">

                                <label>
                                    Product Name *
                                </label>

                                <input
                                    type="text"
                                    name="product_name"
                                    value={
                                        formData.product_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            {/* SKU */}

                            <div className="form-group">

                                <label>
                                    SKU *
                                </label>

                                <input
                                    type="text"
                                    name="sku"
                                    value={
                                        formData.sku
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            {/* PET TYPE */}

                            <div className="form-group">

                                <label>
                                    Pet Type *
                                </label>

                                <select
                                    name="pet_type"
                                    value={
                                        formData.pet_type
                                    }
                                    onChange={
                                        handleChange
                                    }
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


                            {/* PRODUCT TYPE */}

                            <div className="form-group">

                                <label>
                                    Product Type *
                                </label>

                                <select
                                    name="product_type"
                                    value={
                                        formData.product_type
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    {productTypes.map(
                                        (type) => (

                                            <option
                                                key={
                                                    type.value
                                                }
                                                value={
                                                    type.value
                                                }
                                            >

                                                {
                                                    type.label
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* PRICE */}

                            <div className="form-group">

                                <label>
                                    Price *
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    value={
                                        formData.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    step="0.01"
                                    required
                                />

                            </div>


                            {/* STOCK */}

                            <div className="form-group">

                                <label>
                                    Stock
                                </label>

                                <input
                                    type="number"
                                    name="stock"
                                    value={
                                        formData.stock
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                />

                            </div>


                            {/* WEIGHT */}

                            <div className="form-group">

                                <label>
                                    Weight
                                </label>

                                <input
                                    type="text"
                                    name="weight"
                                    value={
                                        formData.weight
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. 500g"
                                />

                            </div>


                            {/* AVAILABLE */}

                            <div className="form-group checkbox-group">

                                <label>

                                    <input
                                        type="checkbox"
                                        name="is_available"
                                        checked={
                                            formData.is_available
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                    Product Available

                                </label>

                            </div>


                        </div>


                        {/* DESCRIPTION */}

                        <div className="form-group">

                            <label>
                                Description *
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                rows="5"
                                required
                            />

                        </div>

                    </section>


                    {/* =============================================
                        IMAGE
                    ============================================== */}

                    <section className="form-section">

                        <h3>
                            Product Image
                        </h3>


                        <div className="form-group">

                            <input
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleImageChange
                                }
                            />


                            {imagePreview && (

                                <div className="image-preview">

                                    <img
                                        src={
                                            imagePreview
                                        }
                                        alt="Preview"
                                    />

                                </div>

                            )}

                        </div>

                    </section>


                    {/* =============================================
                        MEDICINE
                    ============================================== */}

                    {formData.product_type ===
                        "Medicine" && (

                        <section
                            className="form-section"
                        >

                            <h3>
                                Medicine Information
                            </h3>


                            <div
                                className="form-grid"
                            >


                                <div className="form-group">

                                    <label>
                                        Active Ingredient
                                    </label>

                                    <input
                                        type="text"
                                        name="active_ingredient"
                                        value={
                                            medicineData.active_ingredient
                                        }
                                        onChange={
                                            handleMedicineChange
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Dosage
                                    </label>

                                    <input
                                        type="text"
                                        name="dosage"
                                        value={
                                            medicineData.dosage
                                        }
                                        onChange={
                                            handleMedicineChange
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Dosage Form
                                    </label>

                                    <input
                                        type="text"
                                        name="dosage_form"
                                        value={
                                            medicineData.dosage_form
                                        }
                                        onChange={
                                            handleMedicineChange
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Manufacturer
                                    </label>

                                    <input
                                        type="text"
                                        name="manufacturer"
                                        value={
                                            medicineData.manufacturer
                                        }
                                        onChange={
                                            handleMedicineChange
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Batch Number
                                    </label>

                                    <input
                                        type="text"
                                        name="batch_number"
                                        value={
                                            medicineData.batch_number
                                        }
                                        onChange={
                                            handleMedicineChange
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Expiry Date
                                    </label>

                                    <input
                                        type="date"
                                        name="expiry_date"
                                        value={
                                            medicineData.expiry_date
                                        }
                                        onChange={
                                            handleMedicineChange
                                        }
                                    />

                                </div>


                                <div
                                    className="form-group checkbox-group"
                                >

                                    <label>

                                        <input
                                            type="checkbox"
                                            name="prescription_required"
                                            checked={
                                                medicineData.prescription_required
                                            }
                                            onChange={
                                                handleMedicineChange
                                            }
                                        />

                                        Prescription Required

                                    </label>

                                </div>

                            </div>


                            <div className="form-group">

                                <label>
                                    Storage Instructions
                                </label>

                                <textarea
                                    name="storage_instructions"
                                    value={
                                        medicineData.storage_instructions
                                    }
                                    onChange={
                                        handleMedicineChange
                                    }
                                    rows="3"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Warnings
                                </label>

                                <textarea
                                    name="warnings"
                                    value={
                                        medicineData.warnings
                                    }
                                    onChange={
                                        handleMedicineChange
                                    }
                                    rows="3"
                                />

                            </div>

                        </section>

                    )}


                    {/* =============================================
                        SUPPLEMENT
                    ============================================== */}

                    {formData.product_type ===
                        "Supplement" && (

                        <section
                            className="form-section"
                        >

                            <h3>
                                Supplement Information
                            </h3>


                            <div
                                className="form-grid"
                            >


                                <div className="form-group">

                                    <label>
                                        Ingredients
                                    </label>

                                    <textarea
                                        name="ingredients"
                                        value={
                                            supplementData.ingredients
                                        }
                                        onChange={
                                            handleSupplementChange
                                        }
                                        rows="3"
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Dosage
                                    </label>

                                    <input
                                        type="text"
                                        name="dosage"
                                        value={
                                            supplementData.dosage
                                        }
                                        onChange={
                                            handleSupplementChange
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Form
                                    </label>

                                    <input
                                        type="text"
                                        name="form"
                                        value={
                                            supplementData.form
                                        }
                                        onChange={
                                            handleSupplementChange
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Flavor
                                    </label>

                                    <input
                                        type="text"
                                        name="flavor"
                                        value={
                                            supplementData.flavor
                                        }
                                        onChange={
                                            handleSupplementChange
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Age Group
                                    </label>

                                    <input
                                        type="text"
                                        name="age_group"
                                        value={
                                            supplementData.age_group
                                        }
                                        onChange={
                                            handleSupplementChange
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Weight Range
                                    </label>

                                    <input
                                        type="text"
                                        name="weight_range"
                                        value={
                                            supplementData.weight_range
                                        }
                                        onChange={
                                            handleSupplementChange
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Manufacturer
                                    </label>

                                    <input
                                        type="text"
                                        name="manufacturer"
                                        value={
                                            supplementData.manufacturer
                                        }
                                        onChange={
                                            handleSupplementChange
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Batch Number
                                    </label>

                                    <input
                                        type="text"
                                        name="batch_number"
                                        value={
                                            supplementData.batch_number
                                        }
                                        onChange={
                                            handleSupplementChange
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Expiry Date
                                    </label>

                                    <input
                                        type="date"
                                        name="expiry_date"
                                        value={
                                            supplementData.expiry_date
                                        }
                                        onChange={
                                            handleSupplementChange
                                        }
                                    />

                                </div>

                            </div>


                            <div className="form-group">

                                <label>
                                    Storage Instructions
                                </label>

                                <textarea
                                    name="storage_instructions"
                                    value={
                                        supplementData.storage_instructions
                                    }
                                    onChange={
                                        handleSupplementChange
                                    }
                                    rows="3"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Warnings
                                </label>

                                <textarea
                                    name="warnings"
                                    value={
                                        supplementData.warnings
                                    }
                                    onChange={
                                        handleSupplementChange
                                    }
                                    rows="3"
                                />

                            </div>

                        </section>

                    )}


                    {/* =============================================
                        SUBMIT
                    ============================================== */}

                    <div className="form-actions">


                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                                navigate(
                                    "/admin/products"
                                )
                            }
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Saving..."
                                : "Add Product"}

                        </button>


                    </div>


                </form>

            </div>

        </div>

    );

}


export default AddProduct;