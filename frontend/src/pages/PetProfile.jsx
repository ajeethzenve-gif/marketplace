import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Petprofile.css";

function Pets() {
    const navigate = useNavigate();

    const token = localStorage.getItem("access");

    // =====================================================
    // STATES
    // =====================================================

    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPetId, setEditingPetId] = useState(null);
    const [error, setError] = useState("");

    const [petDetails, setPetDetails] = useState({
        pet_name: "",
        pet_type: "Dog",
        breed: "",
        age: "",
        gender: "",
        weight: "",
        health_notes: ""
    });

    // =====================================================
    // API CONFIG
    // =====================================================

    const API_URL =
        "http://127.0.0.1:8000/api/accounts/pets/";

    const BACKEND_URL =
        "http://127.0.0.1:8000";

    // =====================================================
    // LOAD PETS
    // =====================================================

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        loadPets();
    }, [token, navigate]);

    const loadPets = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.results || [];

            setPets(data);
        } catch (error) {
            console.error(
                "Pet loading error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.detail ||
                "Unable to load your pets."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setPetDetails((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {
        setPetDetails({
            pet_name: "",
            pet_type: "Dog",
            breed: "",
            age: "",
            gender: "",
            weight: "",
            health_notes: ""
        });

        setEditingPetId(null);
    };

    // =====================================================
    // OPEN ADD MODAL
    // =====================================================

    const openAddModal = () => {
        setError("");
        resetForm();
        setShowModal(true);
    };

    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {
        setShowModal(false);
        resetForm();
        setError("");
    };

    // =====================================================
    // EDIT PET
    // =====================================================

    const handleEdit = (pet) => {
        console.log("Editing pet:", pet);

        setError("");
        setEditingPetId(pet.id);

        setPetDetails({
            pet_name: pet.pet_name ?? "",
            pet_type: pet.pet_type ?? "Dog",
            breed: pet.breed ?? "",
            age: pet.age ?? "",
            gender: pet.gender ?? "",
            weight: pet.weight ?? "",
            health_notes: pet.health_notes ?? ""
        });

        setShowModal(true);
    };

    // =====================================================
    // SAVE / UPDATE PET
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!petDetails.pet_name.trim()) {
            setError("Pet name is required.");
            return;
        }

        try {
            const data = {
                pet_name: petDetails.pet_name.trim(),
                pet_type: petDetails.pet_type,
                breed: String(petDetails.breed ?? "").trim(),
                age: String(petDetails.age ?? "").trim(),
                gender: petDetails.gender,
                weight: String(petDetails.weight ?? "").trim(),
                health_notes: String(
                    petDetails.health_notes ?? ""
                ).trim()
            };

            // =================================================
            // UPDATE EXISTING PET
            // =================================================

            if (editingPetId) {
                const response = await axios.patch(
                    `${API_URL}${editingPetId}/`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                setPets((previousPets) =>
                    previousPets.map((pet) =>
                        Number(pet.id) === Number(editingPetId)
                            ? response.data
                            : pet
                    )
                );

                alert("Pet updated successfully.");
            }

            // =================================================
            // CREATE NEW PET
            // =================================================

            else {
                const response = await axios.post(
                    API_URL,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                setPets((previousPets) => [
                    response.data,
                    ...previousPets
                ]);

                alert("Pet added successfully.");
            }

            closeModal();
        } catch (error) {
            console.error("PET SAVE ERROR:", error);

            console.error(
                "Backend response:",
                error.response?.data
            );

            const backendError = error.response?.data;

            if (
                backendError &&
                typeof backendError === "object"
            ) {
                setError(
                    Object.entries(backendError)
                        .map(([field, message]) => {
                            const formattedMessage =
                                Array.isArray(message)
                                    ? message.join(", ")
                                    : String(message);

                            return `${field}: ${formattedMessage}`;
                        })
                        .join(" | ")
                );
            } else {
                setError(
                    backendError ||
                    "Unable to save pet details."
                );
            }
        }
    };

    // =====================================================
    // DELETE PET
    // =====================================================

    const handleDelete = async (petId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this pet?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(
                `${API_URL}${petId}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPets((previousPets) =>
                previousPets.filter(
                    (pet) =>
                        Number(pet.id) !== Number(petId)
                )
            );

            setError("");

            alert("Pet deleted successfully.");
        } catch (error) {
            console.error(
                "PET DELETE ERROR:",
                error
            );

            console.error(
                "Backend response:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                error.response?.data?.error ||
                "Unable to delete pet."
            );
        }
    };

    // =====================================================
    // PET ICON
    // =====================================================

    const getPetIcon = (petType) => {
        switch (petType) {
            case "Dog":
                return "🐶";

            case "Cat":
                return "🐱";

            case "Bird":
                return "🐦";

            case "Rabbit":
                return "🐰";

            case "Fish":
                return "🐟";

            default:
                return "🐾";
        }
    };

    // =====================================================
    // PET IMAGE
    // =====================================================

    const getPetImage = (image) => {
        if (!image) {
            return null;
        }

        if (image.startsWith("http")) {
            return image;
        }

        return `${BACKEND_URL}${image}`;
    };

    // =====================================================
    // NOT LOGGED IN
    // =====================================================

    if (!token) {
        return null;
    }

    // =====================================================
    // RETURN
    // =====================================================

    return (
        <main className="pets-page">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="pets-page-header">

                <div className="pets-page-heading">

                    <h1>
                        My Pets
                    </h1>

                    <p>
                        Manage your pet details and health information.
                    </p>

                </div>

                <button
                    type="button"
                    className="add-pet-btn"
                    onClick={openAddModal}
                >
                    🐾 Add New Pet
                </button>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="pet-error">
                    {typeof error === "string"
                        ? error
                        : JSON.stringify(error)}
                </div>
            )}

            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (
                <div className="pets-loading">
                    <div className="pets-loading-spinner"></div>

                    <p>
                        Loading your pets...
                    </p>
                </div>
            ) : pets.length === 0 ? (

                /* =================================================
                    NO PETS
                ================================================= */

                <div className="no-pets">

                    <div className="no-pets-icon">
                        🐾
                    </div>

                    <h2>
                        No pets added yet
                    </h2>

                    <p>
                        Add your pet details to get personalized
                        recommendations.
                    </p>

                    <button
                        type="button"
                        onClick={openAddModal}
                    >
                        Add Your First Pet
                    </button>

                </div>

            ) : (

                /* =================================================
                    PET LIST
                ================================================= */

                <div className="pets-list">

                    {pets.map((pet) => {

                        const petImage =
                            getPetImage(pet.image);

                        return (
                            <div
                                className="pet-profile-card"
                                key={pet.id}
                            >

                                {/* =================================================
                                    PET HEADER
                                ================================================= */}

                                <div className="pet-profile-header">

                                    {/* PET IMAGE */}

                                    <div className="pet-profile-image-wrapper">

                                        {petImage ? (

                                            <img
                                                src={petImage}
                                                alt={pet.pet_name}
                                                className="pet-profile-image"
                                            />

                                        ) : (

                                            <div className="pet-profile-placeholder">
                                                {getPetIcon(
                                                    pet.pet_type
                                                )}
                                            </div>

                                        )}

                                    </div>

                                    {/* PET NAME / BREED */}

                                    <div className="pet-profile-title">

                                        <div className="pet-name-row">

                                            <h2>
                                                {pet.pet_name}
                                            </h2>

                                            <span className="pet-type-badge">
                                                {pet.pet_type}
                                            </span>

                                        </div>

                                        <p className="pet-breed">
                                            {pet.breed ||
                                                "Breed not specified"}
                                        </p>

                                    </div>

                                </div>

                                {/* =================================================
                                    PET INFORMATION
                                ================================================= */}

                                <div className="pet-profile-details">

                                    {/* AGE */}

                                    <div className="pet-profile-detail">

                                        <div className="pet-detail-label">
                                            📅 Age
                                        </div>

                                        <div className="pet-detail-value">
                                            {pet.age ||
                                                "Not specified"}
                                        </div>

                                    </div>

                                    {/* GENDER */}

                                    <div className="pet-profile-detail">

                                        <div className="pet-detail-label">
                                            ⚥ Gender
                                        </div>

                                        <div className="pet-detail-value">
                                            {pet.gender ||
                                                "Not specified"}
                                        </div>

                                    </div>

                                    {/* WEIGHT */}

                                    <div className="pet-profile-detail">

                                        <div className="pet-detail-label">
                                            ⚖️ Weight
                                        </div>

                                        <div className="pet-detail-value">
                                            {pet.weight ||
                                                "Not specified"}
                                        </div>

                                    </div>

                                    {/* BREED */}

                                    <div className="pet-profile-detail">

                                        <div className="pet-detail-label">
                                            🐕 Breed
                                        </div>

                                        <div className="pet-detail-value">
                                            {pet.breed ||
                                                "Not specified"}
                                        </div>

                                    </div>

                                </div>


                                {/* =================================================
                                    ACTIONS
                                ================================================= */}

                                <div className="pet-profile-actions">

                                     <button
                                        type="button"
                                        className="profile-recommended-btn"
                                        onClick={() =>
                                            navigate(`/recommended-products/${pet.id}`)
                                        }
                                        title="Recommended Products"
                                        aria-label="Recommended Products"
                                    >
                                        🛍️
                                    </button>

                                    <button
                                        type="button"
                                        className="profile-edit-btn"
                                        onClick={() => handleEdit(pet)}
                                        title="Edit Pet"
                                        aria-label="Edit Pet"
                                    >
                                        ✏️
                                    </button>

                                    <button
                                        type="button"
                                        className="profile-delete-btn"
                                        onClick={() => handleDelete(pet.id)}
                                        title="Delete Pet"
                                        aria-label="Delete Pet"
                                    >
                                        🗑️
                                    </button>

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

            {/* =================================================
                ADD / EDIT MODAL
            ================================================= */}

            {showModal && (

                <div
                    className="pet-modal-overlay"
                    onClick={closeModal}
                >

                    <div
                        className="pet-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* MODAL HEADER */}

                        <div className="pet-modal-header">

                            <div className="pet-modal-heading">

                                <span className="pet-modal-icon">
                                    🐾
                                </span>

                                <div>

                                    <h2>
                                        {editingPetId
                                            ? "Edit Pet"
                                            : "Add Your Pet"}
                                    </h2>

                                    <p>
                                        {editingPetId
                                            ? "Update your pet details"
                                            : "Tell us about your pet"}
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                className="pet-modal-close"
                                onClick={closeModal}
                            >
                                ×
                            </button>

                        </div>

                        {/* FORM */}

                        <form
                            className="pet-details-form"
                            onSubmit={handleSubmit}
                        >

                            {/* PET NAME */}

                            <div className="pet-form-group">

                                <label>
                                    Pet Name
                                </label>

                                <input
                                    type="text"
                                    name="pet_name"
                                    value={
                                        petDetails.pet_name
                                    }
                                    onChange={handleChange}
                                    placeholder="Enter pet name"
                                    required
                                />

                            </div>

                            {/* TYPE + GENDER */}

                            <div className="pet-form-row">

                                <div className="pet-form-group">

                                    <label>
                                        Pet Type
                                    </label>

                                    <select
                                        name="pet_type"
                                        value={
                                            petDetails.pet_type
                                        }
                                        onChange={handleChange}
                                    >

                                        <option value="Dog">
                                            🐶 Dog
                                        </option>

                                        <option value="Cat">
                                            🐱 Cat
                                        </option>

                                        <option value="Bird">
                                            🐦 Bird
                                        </option>

                                        <option value="Rabbit">
                                            🐰 Rabbit
                                        </option>

                                        <option value="Fish">
                                            🐟 Fish
                                        </option>

                                        <option value="Other">
                                            🐾 Other
                                        </option>

                                    </select>

                                </div>

                                <div className="pet-form-group">

                                    <label>
                                        Gender
                                    </label>

                                    <select
                                        name="gender"
                                        value={
                                            petDetails.gender
                                        }
                                        onChange={handleChange}
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

                                    </select>

                                </div>

                            </div>

                            {/* BREED */}

                            <div className="pet-form-group">

                                <label>
                                    Breed
                                </label>

                                <input
                                    type="text"
                                    name="breed"
                                    value={
                                        petDetails.breed
                                    }
                                    onChange={handleChange}
                                    placeholder="e.g. Labrador, Persian"
                                />

                            </div>

                            {/* AGE + WEIGHT */}

                            <div className="pet-form-row">

                                <div className="pet-form-group">

                                    <label>
                                        Age
                                    </label>

                                    <input
                                        type="text"
                                        name="age"
                                        value={
                                            petDetails.age
                                        }
                                        onChange={handleChange}
                                        placeholder="e.g. 3 Years"
                                    />

                                </div>

                                <div className="pet-form-group">

                                    <label>
                                        Weight
                                    </label>

                                    <input
                                        type="text"
                                        name="weight"
                                        value={
                                            petDetails.weight
                                        }
                                        onChange={handleChange}
                                        placeholder="e.g. 28 kg"
                                    />

                                </div>

                            </div>

                            {/* HEALTH NOTES */}

                            <div className="pet-form-group">

                                <label>
                                    Health / Special Requirements
                                </label>

                                <textarea
                                    name="health_notes"
                                    value={
                                        petDetails.health_notes
                                    }
                                    onChange={handleChange}
                                    placeholder="Enter allergies or special requirements"
                                    rows="3"
                                />

                            </div>

                            {/* MODAL ACTIONS */}

                            <div className="pet-modal-actions">

                                <button
                                    type="button"
                                    className="pet-cancel-btn"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="pet-save-btn"
                                >
                                    {editingPetId
                                        ? "✏️ Update Pet"
                                        : "🐾 Save Pet"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </main>
    );
}

export default Pets;