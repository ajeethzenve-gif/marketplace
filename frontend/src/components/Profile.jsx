import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    FaUser,
    FaMapMarkerAlt,
    FaCrown,
    FaBox,
    FaEdit,
    FaCamera,
    FaCheckCircle,
    FaArrowRight,
    FaTrash,
    FaStar,
} from "react-icons/fa";

import "../styles/Profile.css";


function Profile() {

    const navigate = useNavigate();

    // ==========================================
    // API CONFIG
    // ==========================================

    const API_BASE_URL = "http://127.0.0.1:8000";

    const token = localStorage.getItem("access");

    const authHeaders = {
        Authorization: `Bearer ${token}`,
    };


    // ==========================================
    // PROFILE STATES
    // ==========================================

    const [profileImage, setProfileImage] = useState(null);

    const [preview, setPreview] = useState("");

    const [loading, setLoading] = useState(false);

    const [profileLoading, setProfileLoading] = useState(true);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        phone_number: "",
        gender: "",
        date_of_birth: "",
        address: "",
        city: "",
        state: "",
        country: "India",
        postal_code: "",
    });


    // ==========================================
    // ADDRESS STATES
    // ==========================================

    const [showAddressModal, setShowAddressModal] =
        useState(false);

    const [addresses, setAddresses] =
        useState([]);

    const [addressLoading, setAddressLoading] =
        useState(false);

    const [addressSaving, setAddressSaving] =
        useState(false);

    const [showAddAddressForm, setShowAddAddressForm] =
        useState(false);


    // ==========================================
    // CURRENT LOCATION STATE
    // ==========================================

    const [gettingLocation, setGettingLocation] =
        useState(false);


    // ==========================================
    // ADDRESS FORM
    // ==========================================

    const [addressForm, setAddressForm] = useState({
        full_name: "",
        phone_number: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        country: "India",
        postal_code: "",
        is_default: false,
    });


    // ==========================================
    // CHECK LOGIN
    // ==========================================

    useEffect(() => {

        if (!token) {

            navigate("/login");

            return;
        }

        loadProfile();

    }, [token, navigate]);


    // ==========================================
    // LOAD PROFILE
    // ==========================================

    const loadProfile = async () => {

        setProfileLoading(true);

        try {

            const response = await axios.get(
                `${API_BASE_URL}/api/accounts/profile/`,
                {
                    headers: authHeaders,
                }
            );

            const data = response.data;

            setFormData({
                first_name: data.first_name || "",
                last_name: data.last_name || "",
                username: data.username || "",
                email: data.email || "",
                phone_number: data.phone_number || "",
                gender: data.gender || "",
                date_of_birth: data.date_of_birth || "",
                address: data.address || "",
                city: data.city || "",
                state: data.state || "",
                country: data.country || "India",
                postal_code: data.postal_code || "",
            });


            // ==========================================
            // PROFILE IMAGE
            // ==========================================

            if (data.profile_image) {

                if (
                    data.profile_image.startsWith("http")
                ) {

                    setPreview(data.profile_image);

                } else {

                    setPreview(
                        `${API_BASE_URL}${data.profile_image}`
                    );
                }

            } else {

                setPreview("");
            }

        } catch (error) {

            console.error(
                "Profile loading error:",
                error.response?.data ||
                error.message
            );

            if (error.response?.status === 401) {

                localStorage.removeItem("access");

                navigate("/login");
            }

        } finally {

            setProfileLoading(false);
        }
    };


    // ==========================================
    // PROFILE INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    // ==========================================
    // PROFILE IMAGE CHANGE
    // ==========================================

    const handleImage = (e) => {

        const file =
            e.target.files?.[0];

        if (!file) {
            return;
        }


        if (!file.type.startsWith("image/")) {

            alert(
                "Please select a valid image."
            );

            return;
        }


        if (file.size > 5 * 1024 * 1024) {

            alert(
                "Image size must be less than 5 MB."
            );

            return;
        }


        setProfileImage(file);


        const imageUrl =
            URL.createObjectURL(file);

        setPreview(imageUrl);
    };


    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const data = new FormData();


            Object.entries(formData).forEach(
                ([key, value]) => {

                    data.append(
                        key,
                        value || ""
                    );

                }
            );


            if (profileImage) {

                data.append(
                    "profile_image",
                    profileImage
                );

            }


            await axios.put(
                `${API_BASE_URL}/api/accounts/profile/update/`,
                data,
                {
                    headers: {
                        ...authHeaders,
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );


            alert(
                "Profile updated successfully!"
            );


            setProfileImage(null);


            await loadProfile();

        } catch (error) {

            console.error(
                "Profile update error:",
                error.response?.data ||
                error.message
            );


            alert(
                error.response?.data?.message ||
                error.response?.data?.detail ||
                "Failed to update profile."
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // FETCH ALL ADDRESSES
    // ==========================================

    const fetchAddresses = async () => {

        setAddressLoading(true);

        try {

            const response = await axios.get(
                `${API_BASE_URL}/api/accounts/addresses/`,
                {
                    headers: authHeaders,
                }
            );


            let addressData = [];


            if (
                Array.isArray(response.data)
            ) {

                addressData =
                    response.data;

            } else if (
                Array.isArray(
                    response.data?.results
                )
            ) {

                addressData =
                    response.data.results;
            }


            // Default address first

            addressData.sort(
                (a, b) => {

                    if (
                        Boolean(a.is_default) !==
                        Boolean(b.is_default)
                    ) {

                        return (
                            Number(b.is_default) -
                            Number(a.is_default)
                        );
                    }

                    return (
                        Number(b.id || 0) -
                        Number(a.id || 0)
                    );
                }
            );


            setAddresses(addressData);

        } catch (error) {

            console.error(
                "Address loading error:",
                error.response?.data ||
                error.message
            );


            if (error.response?.status === 401) {

                localStorage.removeItem("access");

                navigate("/login");

                return;
            }


            setAddresses([]);

        } finally {

            setAddressLoading(false);
        }
    };


    // ==========================================
    // OPEN ADDRESS MODAL
    // ==========================================

    const openAddressModal = async () => {

        setShowAddressModal(true);

        setShowAddAddressForm(false);

        await fetchAddresses();
    };


    // ==========================================
    // CLOSE ADDRESS MODAL
    // ==========================================

    const closeAddressModal = () => {

        if (addressSaving || gettingLocation) {
            return;
        }

        setShowAddressModal(false);

        setShowAddAddressForm(false);

        resetAddressForm();
    };


    // ==========================================
    // RESET ADDRESS FORM
    // ==========================================

    const resetAddressForm = () => {

        setAddressForm({
            full_name: "",
            phone_number: "",
            address_line1: "",
            address_line2: "",
            city: "",
            state: "",
            country: "India",
            postal_code: "",
            is_default: false,
        });
    };


    // ==========================================
    // ADDRESS FORM CHANGE
    // ==========================================

    const handleAddressChange = (e) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;


        setAddressForm((previous) => ({
            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };


    // ==========================================
    // OPEN ADD ADDRESS FORM
    // ==========================================

    const openAddAddressForm = () => {

        resetAddressForm();

        setShowAddAddressForm(true);
    };


    // ==========================================
    // CLOSE ADD ADDRESS FORM
    // ==========================================

    const closeAddAddressForm = () => {

        if (gettingLocation || addressSaving) {
            return;
        }

        resetAddressForm();

        setShowAddAddressForm(false);
    };


    // ==========================================
    // GET CURRENT LOCATION
    // ==========================================

    const [locationLoading, setLocationLoading] = useState(false);
    const [locationAccuracy, setLocationAccuracy] = useState(null);

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert(
                "Geolocation is not supported by your browser."
            );
            return;
        }

        setLocationLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const accuracy = position.coords.accuracy;

                    console.log("GPS Latitude:", latitude);
                    console.log("GPS Longitude:", longitude);
                    console.log(
                        "GPS Accuracy:",
                        accuracy,
                        "meters"
                    );

                    setLocationAccuracy(
                        Math.round(accuracy)
                    );

                    const response = await axios.get(
                        "https://nominatim.openstreetmap.org/reverse",
                        {
                            params: {
                                lat: latitude,
                                lon: longitude,
                                format: "json",
                                addressdetails: 1,
                                zoom: 18,
                            },
                            headers: {
                                Accept:
                                    "application/json",
                            },
                        }
                    );

                    const address =
                        response.data?.address || {};

                    console.log(
                        "Reverse Geocoded Address:",
                        response.data
                    );

                    /*
                     * Nominatim may return different
                     * fields depending on the location.
                     */

                    const houseNumber =
                        address.house_number || "";

                    const road =
                        address.road ||
                        address.pedestrian ||
                        address.residential ||
                        "";

                    const neighbourhood =
                        address.neighbourhood ||
                        address.suburb ||
                        address.quarter ||
                        "";

                    const city =
                        address.city ||
                        address.town ||
                        address.village ||
                        address.municipality ||
                        "";

                    const state =
                        address.state || "";

                    const postcode =
                        address.postcode || "";

                    const country =
                        address.country ||
                        "India";


                    /*
                     * Build Address Line 1
                     */

                    const addressParts = [
                        houseNumber,
                        road,
                    ].filter(Boolean);


                    /*
                     * If road is missing,
                     * use neighbourhood.
                     */

                    if (
                        addressParts.length === 0 &&
                        neighbourhood
                    ) {
                        addressParts.push(
                            neighbourhood
                        );
                    }


                    const addressLine1 =
                        addressParts.join(", ");


                    /*
                     * Address Line 2
                     */

                    const addressLine2 =
                        neighbourhood &&
                        !addressLine1
                            .toLowerCase()
                            .includes(
                                neighbourhood.toLowerCase()
                            )
                            ? neighbourhood
                            : "";


                    /*
                     * Fill address form
                     */

                    setAddressForm(
                        (previous) => ({
                            ...previous,

                            address_line1:
                                addressLine1,

                            address_line2:
                                addressLine2,

                            city: city,

                            state: state,

                            country: country,

                            postal_code:
                                postcode,
                        })
                    );


                    alert(
                        `Current location detected successfully.\n\nAccuracy: approximately ${Math.round(
                            accuracy
                        )} meters`
                    );

                } catch (error) {

                    console.error(
                        "Reverse geocoding error:",
                        error.response?.data ||
                        error.message
                    );

                    alert(
                        "Location detected, but the address could not be converted. Please enter the address manually."
                    );

                } finally {

                    setLocationLoading(false);
                }
            },

            (error) => {

                console.error(
                    "Geolocation error:",
                    error
                );

                setLocationLoading(false);

                switch (error.code) {

                    case error.PERMISSION_DENIED:

                        alert(
                            "Location permission was denied. Please allow location access in your browser settings."
                        );

                        break;

                    case error.POSITION_UNAVAILABLE:

                        alert(
                            "Your current location is unavailable. Please turn on GPS/location services and try again."
                        );

                        break;

                    case error.TIMEOUT:

                        alert(
                            "Location detection timed out. Please try again."
                        );

                        break;

                    default:

                        alert(
                            "Unable to detect your current location."
                        );
                }
            },

            {
                /*
                 * IMPORTANT
                 * These settings request
                 * the best available location.
                 */

                enableHighAccuracy: true,

                /*
                 * Do not use an old cached location.
                 */

                maximumAge: 0,

                /*
                 * Give GPS enough time to obtain
                 * a better position.
                 */

                timeout: 30000,
            }
        );
    };


    // ==========================================
    // SAVE NEW ADDRESS
    // ==========================================

    const saveAddress = async (e) => {

        e.preventDefault();


        if (
            !addressForm.full_name.trim() ||
            !addressForm.phone_number.trim() ||
            !addressForm.address_line1.trim() ||
            !addressForm.city.trim() ||
            !addressForm.state.trim() ||
            !addressForm.postal_code.trim()
        ) {

            alert(
                "Please fill all required fields."
            );

            return;
        }


        setAddressSaving(true);


        try {

            const payload = {

                full_name:
                    addressForm.full_name.trim(),

                phone_number:
                    addressForm.phone_number.trim(),

                address_line1:
                    addressForm.address_line1.trim(),

                address_line2:
                    addressForm.address_line2.trim(),

                city:
                    addressForm.city.trim(),

                state:
                    addressForm.state.trim(),

                country:
                    addressForm.country.trim() ||
                    "India",

                postal_code:
                    addressForm.postal_code.trim(),

                is_default:
                    Boolean(
                        addressForm.is_default
                    ),
            };


            const response =
                await axios.post(

                    `${API_BASE_URL}/api/accounts/addresses/`,

                    payload,

                    {
                        headers: {
                            ...authHeaders,

                            "Content-Type":
                                "application/json",
                        },
                    }
                );


            console.log(
                "Address created:",
                response.data
            );


            alert(
                "Address added successfully!"
            );


            resetAddressForm();

            setShowAddAddressForm(false);


            await fetchAddresses();

        } catch (error) {

            console.error(
                "Save address error:",
                error.response?.data ||
                error.message
            );


            const errorData =
                error.response?.data;


            if (
                error.response?.status === 401
            ) {

                localStorage.removeItem("access");

                navigate("/login");

                return;
            }


            if (
                errorData &&
                typeof errorData === "object"
            ) {

                const firstError =
                    Object.values(
                        errorData
                    )[0];


                if (
                    Array.isArray(firstError) &&
                    firstError.length > 0
                ) {

                    alert(
                        firstError[0]
                    );

                } else if (
                    typeof firstError === "string"
                ) {

                    alert(
                        firstError
                    );

                } else {

                    alert(
                        errorData.message ||
                        errorData.detail ||
                        "Unable to add address."
                    );
                }

            } else {

                alert(
                    "Unable to add address."
                );
            }

        } finally {

            setAddressSaving(false);
        }
    };


    // ==========================================
    // DELETE ADDRESS
    // ==========================================

    const deleteAddress = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this address?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await axios.delete(

                `${API_BASE_URL}/api/accounts/addresses/${id}/`,

                {
                    headers: authHeaders,
                }
            );


            alert(
                "Address deleted successfully!"
            );


            await fetchAddresses();

        } catch (error) {

            console.error(
                "Delete address error:",
                error.response?.data ||
                error.message
            );


            if (error.response?.status === 401) {

                localStorage.removeItem("access");

                navigate("/login");

                return;
            }


            alert(
                error.response?.data?.message ||
                error.response?.data?.detail ||
                "Unable to delete address."
            );
        }
    };


    // ==========================================
    // SET DEFAULT ADDRESS
    // ==========================================

    const setDefaultAddress = async (address) => {

        if (address.is_default) {
            return;
        }


        try {

            await axios.post(

                `${API_BASE_URL}/api/accounts/addresses/${address.id}/set-default/`,

                {},

                {
                    headers: {
                        ...authHeaders,

                        "Content-Type":
                            "application/json",
                    },
                }
            );


            alert(
                "Default address changed successfully!"
            );


            await fetchAddresses();

        } catch (error) {

            console.error(
                "Default address error:",
                error.response?.data ||
                error.message
            );


            if (error.response?.status === 401) {

                localStorage.removeItem("access");

                navigate("/login");

                return;
            }


            alert(
                error.response?.data?.message ||
                error.response?.data?.detail ||
                "Unable to change default address."
            );
        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (profileLoading) {

        return (

            <div className="profile-page">

                <div className="profile-loader">

                    Loading profile...

                </div>

            </div>
        );
    }


    // ==========================================
    // JSX
    // ==========================================

    return (

        <div className="profile-page">

            <div className="profile-container">


                {/* =====================================
                    PROFILE HERO
                ====================================== */}

                <div className="profile-hero">

                    <div className="profile-image-wrapper">

                        <img
                            src={
                                preview ||
                                "https://via.placeholder.com/150"
                            }
                            alt="Profile"
                            className="profile-image"
                        />


                        <label
                            htmlFor="profile-image"
                            className="camera-btn"
                            title="Change profile image"
                        >

                            <FaCamera />

                        </label>


                        <input
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                            hidden
                        />

                    </div>


                    <div className="profile-user-info">

                        <h2>

                            {
                                formData.first_name ||
                                formData.last_name
                                    ? `${formData.first_name} ${formData.last_name}`
                                    : "My Profile"
                            }

                        </h2>


                        <p>

                            @
                            {
                                formData.username ||
                                "username"
                            }

                        </p>


                        <span className="profile-email">

                            {formData.email}

                        </span>

                    </div>


                    <div className="profile-status">

                        <FaCheckCircle />

                        <span>
                            Account Active
                        </span>

                    </div>

                </div>



                {/* =====================================
                    QUICK ACTIONS
                ====================================== */}

                <div className="profile-actions">


                    {/* PROFILE */}

                    <div className="action-card active">

                        <div className="action-icon">

                            <FaUser />

                        </div>


                        <div>

                            <h5>
                                My Profile
                            </h5>

                            <p>
                                Manage your account
                            </p>

                        </div>


                        <FaArrowRight
                            className="action-arrow"
                        />

                    </div>



                    {/* ADDRESSES */}

                    <button
                        type="button"
                        className="action-card action-card-button"
                        onClick={openAddressModal}
                    >

                        <div className="action-icon address-icon">

                            <FaMapMarkerAlt />

                        </div>


                        <div className="action-card-content">

                            <h5>
                                My Addresses
                            </h5>

                            <p>
                                Add and manage delivery addresses
                            </p>

                        </div>


                        <FaArrowRight
                            className="action-arrow"
                        />

                    </button>



                    {/* MEMBERSHIP */}

                    <button
                        type="button"
                        className="action-card action-card-button membership-action"
                        onClick={() =>
                            navigate("/membership")
                        }
                    >

                        <div className="action-icon crown-icon">

                            <FaCrown />

                        </div>


                        <div className="action-card-content">

                            <h5>
                                Zenve Membership
                            </h5>

                            <p>
                                Unlock exclusive member benefits
                            </p>

                        </div>


                        <FaArrowRight
                            className="action-arrow"
                        />

                    </button>



                    {/* ORDERS */}

                    <button
                        type="button"
                        className="action-card action-card-button"
                        onClick={() =>
                            navigate("/orders")
                        }
                    >

                        <div className="action-icon order-icon">

                            <FaBox />

                        </div>


                        <div className="action-card-content">

                            <h5>
                                My Orders
                            </h5>

                            <p>
                                Track your recent orders
                            </p>

                        </div>


                        <FaArrowRight
                            className="action-arrow"
                        />

                    </button>

                </div>



                {/* =====================================
                    MEMBERSHIP BANNER
                ====================================== */}

                <div className="membership-banner">

                    <div className="membership-left">

                        <div className="membership-crown">

                            <FaCrown />

                        </div>


                        <div>

                            <span className="membership-label">

                                ZENVE PREMIUM

                            </span>


                            <h3>

                                Unlock Exclusive Pet Care Benefits

                            </h3>


                            <p>

                                Save more on pet medicines,
                                supplements and exclusive services.

                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="membership-btn"
                        onClick={() =>
                            navigate("/membership")
                        }
                    >

                        Explore Membership

                        <FaArrowRight />

                    </button>

                </div>



                {/* =====================================
                    PROFILE DETAILS
                ====================================== */}

                <div className="profile-card">

                    <div className="profile-card-header">

                        <div>

                            <span className="section-tag">

                                ACCOUNT SETTINGS

                            </span>


                            <h3>

                                Personal Information

                            </h3>


                            <p>

                                Keep your profile information
                                up to date.

                            </p>

                        </div>


                        <FaEdit
                            className="edit-icon"
                        />

                    </div>


                    <form onSubmit={handleSubmit}>

                        <div className="row">


                            {/* FIRST NAME */}

                            <div className="col-md-6 mb-4">

                                <label>
                                    First Name
                                </label>


                                <input
                                    type="text"
                                    className="form-control"
                                    name="first_name"
                                    value={
                                        formData.first_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>



                            {/* LAST NAME */}

                            <div className="col-md-6 mb-4">

                                <label>
                                    Last Name
                                </label>


                                <input
                                    type="text"
                                    className="form-control"
                                    name="last_name"
                                    value={
                                        formData.last_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>



                            {/* USERNAME */}

                            <div className="col-md-6 mb-4">

                                <label>
                                    Username
                                </label>


                                <input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    value={
                                        formData.username
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>



                            {/* EMAIL */}

                            <div className="col-md-6 mb-4">

                                <label>
                                    Email Address
                                </label>


                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>



                            {/* PHONE */}

                            <div className="col-md-6 mb-4">

                                <label>
                                    Phone Number
                                </label>


                                <input
                                    type="text"
                                    className="form-control"
                                    name="phone_number"
                                    value={
                                        formData.phone_number
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>



                            {/* GENDER */}

                            <div className="col-md-6 mb-4">

                                <label>
                                    Gender
                                </label>


                                <select
                                    className="form-select"
                                    name="gender"
                                    value={
                                        formData.gender
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="">
                                        Select Gender
                                    </option>


                                    <option value="Male">
                                        Male
                                    </option>


                                    <option value="Female">
                                        Female
                                    </option>


                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </div>



                            {/* DATE OF BIRTH */}

                            <div className="col-md-6 mb-4">

                                <label>
                                    Date of Birth
                                </label>


                                <input
                                    type="date"
                                    className="form-control"
                                    name="date_of_birth"
                                    value={
                                        formData.date_of_birth
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>



                            {/* COUNTRY */}

                            <div className="col-md-6 mb-4">

                                <label>
                                    Country
                                </label>


                                <input
                                    type="text"
                                    className="form-control"
                                    name="country"
                                    value={
                                        formData.country
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>



                            {/* PRIMARY ADDRESS */}

                            <div className="col-12 mb-4">

                                <label>
                                    Primary Address
                                </label>


                                <textarea
                                    className="form-control"
                                    name="address"
                                    value={
                                        formData.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>



                            {/* CITY */}

                            <div className="col-md-4 mb-4">

                                <label>
                                    City
                                </label>


                                <input
                                    type="text"
                                    className="form-control"
                                    name="city"
                                    value={
                                        formData.city
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>



                            {/* STATE */}

                            <div className="col-md-4 mb-4">

                                <label>
                                    State
                                </label>


                                <input
                                    type="text"
                                    className="form-control"
                                    name="state"
                                    value={
                                        formData.state
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>



                            {/* POSTAL CODE */}

                            <div className="col-md-4 mb-4">

                                <label>
                                    Postal Code
                                </label>


                                <input
                                    type="text"
                                    className="form-control"
                                    name="postal_code"
                                    value={
                                        formData.postal_code
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                        </div>



                        {/* PROFILE SUBMIT */}

                        <div className="profile-submit">

                            <button
                                type="submit"
                                className="profile-btn"
                                disabled={loading}
                            >

                                {loading
                                    ? "Updating..."
                                    : "Update Profile"
                                }

                            </button>

                        </div>

                    </form>

                </div>



                {/* =====================================
                    ADDRESS MODAL
                ====================================== */}

                {showAddressModal && (

                    <div
                        className="address-modal-overlay"
                        onClick={closeAddressModal}
                    >

                        <div
                            className="address-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >


                            {/* =================================
                                MODAL HEADER
                            ================================== */}

                            <div className="address-modal-header">

                                <div>

                                    <h3>
                                        My Addresses
                                    </h3>


                                    <p>
                                        Manage your delivery addresses
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    className="modal-close-btn"
                                    onClick={
                                        closeAddressModal
                                    }
                                    disabled={
                                        addressSaving ||
                                        gettingLocation
                                    }
                                >

                                    ×

                                </button>

                            </div>



                            {/* =================================
                                ADDRESS LIST
                            ================================== */}

                            {!showAddAddressForm && (

                                <>

                                    <button
                                        type="button"
                                        className="add-address-btn"
                                        onClick={
                                            openAddAddressForm
                                        }
                                    >

                                        + Add New Address

                                    </button>



                                    <div className="address-list">

                                        {addressLoading ? (

                                            <div className="address-loading">

                                                Loading addresses...

                                            </div>

                                        ) : addresses.length === 0 ? (

                                            <div className="empty-address">

                                                <FaMapMarkerAlt />

                                                <h5>
                                                    No Address Found
                                                </h5>

                                                <p>
                                                    Add your first delivery
                                                    address.
                                                </p>

                                            </div>

                                        ) : (

                                            addresses.map(
                                                (address) => (

                                                    <div
                                                        key={
                                                            address.id
                                                        }
                                                        className={
                                                            address.is_default
                                                                ? "address-item default-address"
                                                                : "address-item"
                                                        }
                                                    >


                                                        {/* ADDRESS HEADER */}

                                                        <div className="address-item-top">

                                                            <div>

                                                                <h5>

                                                                    {
                                                                        address.full_name
                                                                    }


                                                                    {address.is_default && (

                                                                        <span className="default-badge">

                                                                            <FaStar />

                                                                            Default

                                                                        </span>

                                                                    )}

                                                                </h5>

                                                            </div>



                                                            {/* DELETE */}

                                                            <button
                                                                type="button"
                                                                className="delete-address-btn"
                                                                onClick={() =>
                                                                    deleteAddress(
                                                                        address.id
                                                                    )
                                                                }
                                                            >

                                                                <FaTrash />

                                                                Delete

                                                            </button>

                                                        </div>



                                                        {/* ADDRESS LINE 1 */}

                                                        <p>

                                                            {
                                                                address.address_line1
                                                            }

                                                        </p>



                                                        {/* ADDRESS LINE 2 */}

                                                        {address.address_line2 && (

                                                            <p>

                                                                {
                                                                    address.address_line2
                                                                }

                                                            </p>

                                                        )}



                                                        {/* CITY */}

                                                        <p>

                                                            {
                                                                address.city
                                                            }

                                                            {", "}

                                                            {
                                                                address.state
                                                            }

                                                            {" - "}

                                                            {
                                                                address.postal_code
                                                            }

                                                        </p>



                                                        {/* COUNTRY */}

                                                        <p>

                                                            {
                                                                address.country
                                                            }

                                                        </p>



                                                        {/* PHONE */}

                                                        <p className="address-phone">

                                                            📞{" "}

                                                            {
                                                                address.phone_number
                                                            }

                                                        </p>



                                                        {/* SET DEFAULT */}

                                                        {!address.is_default && (

                                                            <button
                                                                type="button"
                                                                className="set-default-btn"
                                                                onClick={() =>
                                                                    setDefaultAddress(
                                                                        address
                                                                    )
                                                                }
                                                            >

                                                                Set as Default

                                                            </button>

                                                        )}

                                                    </div>

                                                )
                                            )

                                        )}

                                    </div>

                                </>

                            )}



                            {/* =================================
                                ADD ADDRESS FORM
                            ================================== */}

                            {showAddAddressForm && (

                                <form
                                    className="add-address-form"
                                    onSubmit={
                                        saveAddress
                                    }
                                >


                                    {/* FORM HEADER */}

                                    <div className="form-title-row">

                                        <div>

                                            <h4>
                                                Add New Address
                                            </h4>


                                            <p>
                                                Enter your delivery details
                                            </p>

                                        </div>


                                        <button
                                            type="button"
                                            className="back-btn"
                                            onClick={
                                                closeAddAddressForm
                                            }
                                            disabled={
                                                gettingLocation ||
                                                addressSaving
                                            }
                                        >

                                            ← Back

                                        </button>

                                    </div>



                                    {/* =================================
                                        CURRENT LOCATION
                                    ================================== */}

                                    <div className="current-location-box">

                                        <div className="current-location-info">

                                            <span className="current-location-icon">

                                                📍

                                            </span>


                                            <div>

                                                <h5>
                                                    Use Current Location
                                                </h5>

                                                <p>
                                                    Automatically fill your
                                                    address using your current
                                                    location.
                                                </p>

                                            </div>

                                        </div>


                                        <button
                                            type="button"
                                            className="current-location-btn"
                                            onClick={
                                                getCurrentLocation
                                            }
                                            disabled={
                                                gettingLocation ||
                                                addressSaving
                                            }
                                        >

                                            {gettingLocation
                                                ? "📍 Detecting..."
                                                : "📍 Use My Location"
                                            }

                                        </button>

                                    </div>



                                    {/* =================================
                                        FULL NAME + PHONE
                                    ================================== */}

                                    <div className="row">


                                        {/* FULL NAME */}

                                        <div className="col-md-6 mb-3">

                                            <label>
                                                Full Name *
                                            </label>


                                            <input
                                                type="text"
                                                name="full_name"
                                                className="form-control"
                                                placeholder="Enter full name"
                                                value={
                                                    addressForm.full_name
                                                }
                                                onChange={
                                                    handleAddressChange
                                                }
                                                required
                                            />

                                        </div>



                                        {/* PHONE */}

                                        <div className="col-md-6 mb-3">

                                            <label>
                                                Phone Number *
                                            </label>


                                            <input
                                                type="tel"
                                                name="phone_number"
                                                className="form-control"
                                                placeholder="Enter phone number"
                                                value={
                                                    addressForm.phone_number
                                                }
                                                onChange={
                                                    handleAddressChange
                                                }
                                                required
                                            />

                                        </div>

                                    </div>



                                    {/* =================================
                                        ADDRESS LINE 1
                                    ================================== */}

                                    <div className="mb-3">

                                        <label>
                                            Address Line 1 *
                                        </label>


                                        <input
                                            type="text"
                                            name="address_line1"
                                            className="form-control"
                                            placeholder="House number, street, area"
                                            value={
                                                addressForm.address_line1
                                            }
                                            onChange={
                                                handleAddressChange
                                            }
                                            required
                                        />

                                    </div>



                                    {/* =================================
                                        ADDRESS LINE 2
                                    ================================== */}

                                    <div className="mb-3">

                                        <label>
                                            Address Line 2
                                        </label>


                                        <input
                                            type="text"
                                            name="address_line2"
                                            className="form-control"
                                            placeholder="Apartment, landmark (optional)"
                                            value={
                                                addressForm.address_line2
                                            }
                                            onChange={
                                                handleAddressChange
                                            }
                                        />

                                    </div>



                                    {/* =================================
                                        CITY / STATE / POSTAL
                                    ================================== */}

                                    <div className="row">


                                        {/* CITY */}

                                        <div className="col-md-4 mb-3">

                                            <label>
                                                City *
                                            </label>


                                            <input
                                                type="text"
                                                name="city"
                                                className="form-control"
                                                placeholder="City"
                                                value={
                                                    addressForm.city
                                                }
                                                onChange={
                                                    handleAddressChange
                                                }
                                                required
                                            />

                                        </div>



                                        {/* STATE */}

                                        <div className="col-md-4 mb-3">

                                            <label>
                                                State *
                                            </label>


                                            <input
                                                type="text"
                                                name="state"
                                                className="form-control"
                                                placeholder="State"
                                                value={
                                                    addressForm.state
                                                }
                                                onChange={
                                                    handleAddressChange
                                                }
                                                required
                                            />

                                        </div>



                                        {/* POSTAL */}

                                        <div className="col-md-4 mb-3">

                                            <label>
                                                Postal Code *
                                            </label>


                                            <input
                                                type="text"
                                                name="postal_code"
                                                className="form-control"
                                                placeholder="Postal code"
                                                value={
                                                    addressForm.postal_code
                                                }
                                                onChange={
                                                    handleAddressChange
                                                }
                                                required
                                            />

                                        </div>

                                    </div>



                                    {/* =================================
                                        COUNTRY
                                    ================================== */}

                                    <div className="mb-3">

                                        <label>
                                            Country
                                        </label>


                                        <input
                                            type="text"
                                            name="country"
                                            className="form-control"
                                            value={
                                                addressForm.country
                                            }
                                            onChange={
                                                handleAddressChange
                                            }
                                        />

                                    </div>



                                    {/* =================================
                                        DEFAULT CHECKBOX
                                    ================================== */}

                                    <div className="default-checkbox">

                                        <input
                                            type="checkbox"
                                            name="is_default"
                                            id="is_default"
                                            checked={
                                                addressForm.is_default
                                            }
                                            onChange={
                                                handleAddressChange
                                            }
                                        />


                                        <label
                                            htmlFor="is_default"
                                        >

                                            Set as default delivery
                                            address

                                        </label>

                                    </div>



                                    {/* =================================
                                        FORM ACTIONS
                                    ================================== */}

                                    <div className="address-form-actions">

                                        <button
                                            type="button"
                                            className="cancel-address-btn"
                                            onClick={
                                                closeAddAddressForm
                                            }
                                            disabled={
                                                addressSaving ||
                                                gettingLocation
                                            }
                                        >

                                            Cancel

                                        </button>


                                        <button
                                            type="submit"
                                            className="save-address-btn"
                                            disabled={
                                                addressSaving ||
                                                gettingLocation
                                            }
                                        >

                                            {addressSaving
                                                ? "Saving..."
                                                : "Save Address"
                                            }

                                        </button>

                                    </div>

                                </form>

                            )}

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}


export default Profile;