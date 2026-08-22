import { useEffect, useState } from "react";
import {
    FaHeart,
    FaMapMarkerAlt,
    FaPaw,
    FaSearch,
    FaVenusMars,
    FaBirthdayCake,
} from "react-icons/fa";

import api from "../api/api";
import "../styles/PetAdoption.css";

function PetAdoption() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [species, setSpecies] = useState("");
    const [gender, setGender] = useState("");

    useEffect(() => {
        loadPets();
    }, []);

    const loadPets = async () => {
        try {
            setLoading(true);

            // Change this endpoint according to your backend
            const response = await api.get("adoption/pets/");

            setPets(response.data.results || response.data || []);
        } catch (error) {
            console.error(
                "Pet adoption loading error:",
                error.response?.data || error.message
            );

            setPets([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredPets = pets.filter((pet) => {
        const petName = pet.name?.toLowerCase() || "";
        const petSpecies = pet.species?.toLowerCase() || "";
        const petBreed = pet.breed?.toLowerCase() || "";

        const searchMatch =
            !search ||
            petName.includes(search.toLowerCase()) ||
            petSpecies.includes(search.toLowerCase()) ||
            petBreed.includes(search.toLowerCase());

        const speciesMatch =
            !species ||
            petSpecies === species.toLowerCase();

        const genderMatch =
            !gender ||
            pet.gender?.toLowerCase() === gender.toLowerCase();

        return searchMatch && speciesMatch && genderMatch;
    });

    return (
        <div className="adoption-page">

            {/* HEADER */}
            <section className="adoption-header">
                <div className="adoption-header-content">
                    <span className="adoption-small-title">
                        <FaPaw /> PET ADOPTION
                    </span>

                    <h1>Find Your New Best Friend</h1>

                    <p>
                        Give a loving pet a forever home and make a difference
                        in their life.
                    </p>
                </div>
            </section>

            {/* FILTERS */}
            <section className="adoption-filter-section">
                <div className="adoption-search">
                    <FaSearch />

                    <input
                        type="text"
                        placeholder="Search pets by name, breed..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                >
                    <option value="">All Pets</option>
                    <option value="Dog">Dogs</option>
                    <option value="Cat">Cats</option>
                    <option value="Rabbit">Rabbits</option>
                    <option value="Bird">Birds</option>
                </select>

                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <option value="">All Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </section>

            {/* CONTENT */}
            <main className="adoption-container">

                <div className="adoption-result-header">
                    <div>
                        <h2>Pets Looking for a Home</h2>

                        <p>
                            {filteredPets.length} pets available for adoption
                        </p>
                    </div>

                    <div className="adoption-count">
                        <FaPaw />
                        {filteredPets.length} Available
                    </div>
                </div>

                {loading ? (
                    <div className="adoption-loading">
                        <div className="adoption-spinner"></div>
                        <p>Finding pets for you...</p>
                    </div>
                ) : filteredPets.length > 0 ? (

                    <div className="pet-grid">

                        {filteredPets.map((pet) => (

                            <article
                                className="pet-card"
                                key={pet.id}
                            >

                                {/* IMAGE */}
                                <div className="pet-image-wrapper">

                                    {pet.image ? (
                                        <img
                                            src={pet.image}
                                            alt={pet.name}
                                            className="pet-image"
                                        />
                                    ) : (
                                        <div className="pet-no-image">
                                            <FaPaw />
                                        </div>
                                    )}

                                    <span className="adoption-badge">
                                        Available
                                    </span>

                                    <button
                                        type="button"
                                        className="pet-heart"
                                        aria-label="Add to favorites"
                                    >
                                        <FaHeart />
                                    </button>
                                </div>

                                {/* DETAILS */}
                                <div className="pet-card-body">

                                    <div className="pet-title-row">
                                        <h3>{pet.name || "Unknown Pet"}</h3>

                                        <span className="pet-species">
                                            {pet.species || "Pet"}
                                        </span>
                                    </div>

                                    <p className="pet-breed">
                                        {pet.breed || "Mixed Breed"}
                                    </p>

                                    <div className="pet-details">

                                        <div>
                                            <FaVenusMars />
                                            <span>
                                                {pet.gender || "Unknown"}
                                            </span>
                                        </div>

                                        <div>
                                            <FaBirthdayCake />
                                            <span>
                                                {pet.age
                                                    ? `${pet.age} years`
                                                    : "Age unknown"}
                                            </span>
                                        </div>

                                    </div>

                                    {pet.location && (
                                        <div className="pet-location">
                                            <FaMapMarkerAlt />
                                            <span>{pet.location}</span>
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        className="adopt-button"
                                    >
                                        <FaHeart />
                                        Meet {pet.name || "This Pet"}
                                    </button>

                                </div>
                            </article>

                        ))}

                    </div>

                ) : (

                    <div className="no-pets">

                        <div className="no-pets-icon">
                            <FaPaw />
                        </div>

                        <h3>No Pets Found</h3>

                        <p>
                            We couldn't find any pets matching your filters.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setSpecies("");
                                setGender("");
                            }}
                        >
                            View All Pets
                        </button>

                    </div>

                )}

            </main>

            {/* BOTTOM INFORMATION */}
            <section className="adoption-info">

                <div className="adoption-info-item">
                    <div className="info-icon">
                        <FaHeart />
                    </div>

                    <div>
                        <h3>Adopt With Love</h3>
                        <p>
                            Give a pet the loving home they deserve.
                        </p>
                    </div>
                </div>

                <div className="adoption-info-item">
                    <div className="info-icon">
                        <FaPaw />
                    </div>

                    <div>
                        <h3>Pet First</h3>
                        <p>
                            Every pet deserves care, safety and happiness.
                        </p>
                    </div>
                </div>

                <div className="adoption-info-item">
                    <div className="info-icon">
                        <FaMapMarkerAlt />
                    </div>

                    <div>
                        <h3>Find Nearby</h3>
                        <p>
                            Discover pets waiting for adoption near you.
                        </p>
                    </div>
                </div>

            </section>

        </div>
    );
}

export default PetAdoption;