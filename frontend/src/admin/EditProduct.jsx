import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import "./ProductAdd.css";


const API_URL = "http://127.0.0.1:8000/api";


function EditProduct() {

    const { id } = useParams();

    const navigate = useNavigate();


    // =====================================================
    // PRODUCT
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
    // CATEGORIES / BRANDS
    // =====================================================

    const [categories, setCategories] =
        useState([]);

    const [brands, setBrands] =
        useState([]);


    // =====================================================
    // MEDICINE
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
    // SUPPLEMENT
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


    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);


    // =====================================================
    // LOAD
    // =====================================================

    useEffect(() => {

        loadInitialData();

    }, [id]);


    const loadInitialData = async () => {

        try {

            const accessToken =
                localStorage.getItem("access");


            const headers = {

                Authorization:
                    `Bearer ${accessToken}`,

            };


            const [
                productResponse,
                categoryResponse,
                brandResponse,
            ] = await Promise.all([

                axios.get(
                    `${API_URL}/products/${id}/`,
                    {
                        headers,
                    }
                ),

                axios.get(
                    `${API_URL}/categories/`
                ),

                axios.get(
                    `${API_URL}/brands/`
                ),

            ]);


            // =================================================
            // PRODUCT
            // =================================================

            const product =
                productResponse.data;


            setFormData({

                category:
                    product.category ?? "",

                brand:
                    product.brand ?? "",

                product_name:
                    product.product_name ?? "",

                description:
                    product.description ?? "",

                sku:
                    product.sku ?? "",

                pet_type:
                    product.pet_type ?? "Dog",

                product_type:
                    product.product_type ?? "Other",

                price:
                    product.price ?? "",

                stock:
                    product.stock ?? 0,

                weight:
                    product.weight ?? "",

                is_available:
                    product.is_available ?? true,

            });


            // =================================================
            // IMAGE
            // =================================================

            if (product.image) {

                if (
                    product.image.startsWith(
                        "http"
                    )
                ) {

                    setImagePreview(
                        product.image
                    );

                } else {

                    setImagePreview(
                        `http://127.0.0.1:8000${product.image}`
                    );

                }

            }


            // =================================================
            // CATEGORIES
            // =================================================

            setCategories(

                Array.isArray(
                    categoryResponse.data
                )
                    ? categoryResponse.data
                    : categoryResponse.data.results ||
                      []

            );


            // =================================================
            // BRANDS
            // =================================================

            setBrands(

                Array.isArray(
                    brandResponse.data
                )
                    ? brandResponse.data
                    : brandResponse.data.results ||
                      []

            );


            // =================================================
            // MEDICINE
            // =================================================

            if (
                product.product_type ===
                "Medicine"
            ) {

                try {

                    const response =
                        await axios.get(

                            `${API_URL}/products/${id}/medicine/`,

                            {
                                headers,
                            }

                        );


                    if (response.data) {

                        setMedicineData({

                            active_ingredient:
                                response.data.active_ingredient ??
                                "",

                            dosage:
                                response.data.dosage ??
                                "",

                            dosage_form:
                                response.data.dosage_form ??
                                "",

                            prescription_required:
                                response.data.prescription_required ??
                                false,

                            manufacturer:
                                response.data.manufacturer ??
                                "",

                            batch_number:
                                response.data.batch_number ??
                                "",

                            expiry_date:
                                response.data.expiry_date ??
                                "",

                            storage_instructions:
                                response.data.storage_instructions ??
                                "",

                            warnings:
                                response.data.warnings ??
                                "",

                        });

                    }

                } catch (error) {

                    console.log(
                        "No medicine details found."
                    );

                }

            }


            // =================================================
            // SUPPLEMENT
            // =================================================

            if (
                product.product_type ===
                "Supplement"
            ) {

                try {

                    const response =
                        await axios.get(

                            `${API_URL}/products/${id}/supplement/`,

                            {
                                headers,
                            }

                        );


                    if (response.data) {

                        setSupplementData({

                            ingredients:
                                response.data.ingredients ??
                                "",

                            dosage:
                                response.data.dosage ??
                                "",

                            form:
                                response.data.form ??
                                "",

                            flavor:
                                response.data.flavor ??
                                "",

                            age_group:
                                response.data.age_group ??
                                "",

                            weight_range:
                                response.data.weight_range ??
                                "",

                            manufacturer:
                                response.data.manufacturer ??
                                "",

                            batch_number:
                                response.data.batch_number ??
                                "",

                            expiry_date:
                                response.data.expiry_date ??
                                "",

                            storage_instructions:
                                response.data.storage_instructions ??
                                "",

                            warnings:
                                response.data.warnings ??
                                "",

                        });

                    }

                } catch (error) {

                    console.log(
                        "No supplement details found."
                    );

                }

            }


        } catch (error) {

            console.error(
                "Load Product Error:",
                error.response?.data ||
                error
            );


            alert(
                "Unable to load product."
            );


            navigate(
                "/admin/products"
            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INPUT
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;


        setFormData(
            (previous) => ({

                ...previous,

                [name]:
                    type === "checkbox"
                        ? checked
                        : value,

            })
        );

    };


    // =====================================================
    // MEDICINE INPUT
    // =====================================================

    const handleMedicineChange = (e) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;


        setMedicineData(
            (previous) => ({

                ...previous,

                [name]:
                    type === "checkbox"
                        ? checked
                        : value,

            })
        );

    };


    // =====================================================
    // SUPPLEMENT INPUT
    // =====================================================

    const handleSupplementChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setSupplementData(
            (previous) => ({

                ...previous,

                [name]: value,

            })
        );

    };


    // =====================================================
    // IMAGE
    // =====================================================

    const handleImageChange = (e) => {

        const file =
            e.target.files?.[0];


        if (!file) {

            return;

        }


        setImage(file);


        setImagePreview(
            URL.createObjectURL(file)
        );

    };


    // =====================================================
    // UPDATE
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        try {

            setSaving(true);


            const accessToken =
                localStorage.getItem("access");


            const data =
                new FormData();


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
            // NEW IMAGE
            // =================================================

            if (image) {

                data.append(
                    "image",
                    image
                );

            }


            // =================================================
            // UPDATE PRODUCT
            // =================================================

            await axios.put(

                `${API_URL}/products/${id}/`,

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


            // =================================================
            // MEDICINE
            // =================================================

            if (
                formData.product_type ===
                "Medicine"
            ) {

                try {

                    await axios.put(

                        `${API_URL}/products/${id}/medicine/`,

                        medicineData,

                        {
                            headers: {

                                Authorization:
                                    `Bearer ${accessToken}`,

                            },
                        }

                    );

                } catch (error) {

                    console.error(
                        "Medicine Update Error:",
                        error.response?.data ||
                        error
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

                    await axios.put(

                        `${API_URL}/products/${id}/supplement/`,

                        supplementData,

                        {
                            headers: {

                                Authorization:
                                    `Bearer ${accessToken}`,

                            },
                        }

                    );

                } catch (error) {

                    console.error(
                        "Supplement Update Error:",
                        error.response?.data ||
                        error
                    );

                }

            }


            alert(
                "Product updated successfully!"
            );


            navigate(
                "/admin/products"
            );


        } catch (error) {

            console.error(
                "Update Product Error:",
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
                                `${key}: ${
                                    Array.isArray(value)
                                        ? value.join(", ")
                                        : value
                                }`
                        )
                        .join("\n")

                );

            } else {

                alert(
                    "Failed to update product."
                );

            }

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="product-form-page">

                <p>
                    Loading product...
                </p>

            </div>

        );

    }


    // =====================================================
    // PRODUCT TYPES
    // =====================================================

    const productTypes = [

        ["Medicine", "Medicine"],
        ["Supplement", "Supplement"],
        ["Food", "Food"],
        ["Treat", "Treats"],
        ["Grooming", "Grooming"],
        ["Hygiene", "Hygiene"],
        ["FleaTick", "Flea & Tick Control"],
        ["Deworming", "Deworming"],
        ["DentalCare", "Dental Care"],
        ["SkinCare", "Skin Care"],
        ["JointCare", "Joint & Bone Care"],
        ["Vitamins", "Vitamins"],
        ["Accessories", "Pet Accessories"],
        ["Toys", "Toys"],
        ["Beds", "Beds & Furniture"],
        ["Leashes", "Leashes & Collars"],
        ["Clothing", "Pet Clothing"],
        ["Feeding", "Feeding Supplies"],
        ["Aquarium", "Aquarium Supplies"],
        ["BirdCare", "Bird Care"],
        ["FarmSupplies", "Farm Supplies"],
        ["VetEquipment", "Veterinary Equipment"],
        ["Other", "Other"],

    ];


    // =====================================================
    // JSX
    // =====================================================

    return (

        <div className="product-form-page">

            <div className="product-form-container">


                <div className="product-form-header">

                    <h2>
                        Edit Product
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


                    {/* =========================================
                        PRODUCT INFORMATION
                    ========================================== */}

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


                            {/* NAME */}

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
                                    Pet Type
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
                                    Product Type
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
                                        ([value, label]) => (

                                            <option
                                                key={
                                                    value
                                                }
                                                value={
                                                    value
                                                }
                                            >

                                                {label}

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
                                Description
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


                    {/* =========================================
                        IMAGE
                    ========================================== */}

                    <section className="form-section">

                        <h3>
                            Product Image
                        </h3>


                        {imagePreview && (

                            <div className="image-preview">

                                <img
                                    src={
                                        imagePreview
                                    }
                                    alt="Product"
                                />

                            </div>

                        )}


                        <div className="form-group">

                            <label>
                                Change Image
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleImageChange
                                }
                            />

                        </div>

                    </section>


                    {/* =========================================
                        MEDICINE
                    ========================================== */}

                    {formData.product_type ===
                        "Medicine" && (

                        <section className="form-section">

                            <h3>
                                Medicine Information
                            </h3>


                            <div className="form-grid">


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


                                <div className="form-group checkbox-group">

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


                    {/* =========================================
                        SUPPLEMENT
                    ========================================== */}

                    {formData.product_type ===
                        "Supplement" && (

                        <section className="form-section">

                            <h3>
                                Supplement Information
                            </h3>


                            <div className="form-grid">


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


                    {/* =========================================
                        ACTIONS
                    ========================================== */}

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
                            disabled={saving}
                        >

                            {saving
                                ? "Updating..."
                                : "Update Product"}

                        </button>


                    </div>


                </form>

            </div>

        </div>

    );

}


export default EditProduct;