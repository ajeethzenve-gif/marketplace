import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api";
import ProductCard from "../components/ProductCard";

import dogImage from "../assets/images/dog-transparent.png";
import catImage from "../assets/images/cat-transparent.png";
import productImage from "../assets/images/product-transparent.png";
import petAdoption from "../assets/images/pet-adoption-removebg.png";
import homeService from "../assets/images/pet_home_service_remove_bg.png";
import prescriptionUpload from "../assets/images/prescription_upload-removebg.png";
import offerProduct from "../assets/images/offer_proudct-removebg.png";
import vetVisitImage from "../assets/images/vet_home_visit.jpg";
import petFashionImage from "../assets/images/pet_fashion_nobg.png";

import catHealthBanner from "../assets/images/cat_health_banner.jpg";
import catFoodBanner from "../assets/images/cat_food_banner.jpg";
import otherPetsBanner from "../assets/images/other_pets_banner.jpg";
import vetInstrumentsBanner from "../assets/images/vet_instruments_banner.jpg";
import otherFeedsBanner from "../assets/images/other_feeds_banner.jpg";
import kiwiParrot from "../assets/images/kiwi_parrot.jpg";
import thumperRabbit from "../assets/images/thumper_rabbit.jpg";

import "../styles/Home.css";

function Home() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // =====================================================
    // ACTIVE PET MODE & THEME
    // =====================================================
    const petParam = searchParams.get("pet") || searchParams.get("pet_type") || "";
    const activePetMode = petParam.toLowerCase();

    // =====================================================
    // PRODUCTS
    // =====================================================

    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);

    // =====================================================
    // PET MODAL
    // =====================================================

    const [showPetModal, setShowPetModal] = useState(false);
    const [savingPet, setSavingPet] = useState(false);

    const [petDetails, setPetDetails] = useState({
        pet_name: "",
        pet_type: activePetMode === "cat" ? "Cat" : activePetMode === "dog" ? "Dog" : "Dog",
        breed: "",
        age: "",
        gender: "",
        weight: "",
        health_notes: "",
    });

    // =====================================================
    // EXPLAINABLE AI RECOMMENDATIONS
    // =====================================================

    const [aiRecSections, setAiRecSections] = useState([]);

    // =====================================================
    // LOAD ALL PRODUCTS & RECOMMENDATIONS
    // =====================================================

    useEffect(() => {
        loadAllProducts();
        loadCustomerRecommendations();
    }, [activePetMode]);

    const loadCustomerRecommendations = async () => {
        const token = localStorage.getItem("access");
        if (!token) {
            setAiRecSections([]);
            return;
        }

        try {
            let url = "recommendations/customer/";
            if (activePetMode === "dog") {
                url += "?pet_type=Dog";
            } else if (activePetMode === "cat") {
                url += "?pet_type=Cat";
            } else if (["others", "other", "setting", "settings"].includes(activePetMode)) {
                url += "?pet_type=others";
            }

            const response = await api.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data?.sections) {
                setAiRecSections(response.data.sections);
            } else {
                setAiRecSections([]);
            }
        } catch (err) {
            console.log("Customer AI recommendations not available:", err?.message);
            setAiRecSections([]);
        }
    };

    const loadAllProducts = async () => {
        try {
            setProductsLoading(true);
            setProducts([]); // Clear stale products immediately when switching pet mode

            let allProducts = [];
            let page = 1;

            while (true) {
                let url = `products/?page=${page}`;
                if (activePetMode === "dog") {
                    url += "&pet_type=Dog";
                } else if (activePetMode === "cat") {
                    url += "&pet_type=Cat";
                } else if (["others", "other", "setting", "settings"].includes(activePetMode)) {
                    url += "&pet_type=others";
                }

                const response = await api.get(url);

                const responseData = response.data;

                // ---------------------------------------------
                // PAGINATED RESPONSE
                // ---------------------------------------------

                if (
                    responseData &&
                    Array.isArray(responseData.results)
                ) {
                    allProducts = [
                        ...allProducts,
                        ...responseData.results,
                    ];

                    if (responseData.next) {
                        page += 1;
                        continue;
                    }

                    break;
                }

                // ---------------------------------------------
                // NON PAGINATED RESPONSE
                // ---------------------------------------------

                if (Array.isArray(responseData)) {
                    allProducts = responseData;
                }

                break;
            }

            // ---------------------------------------------
            // REMOVE DUPLICATES
            // ---------------------------------------------

            const uniqueProducts = [];
            const productIds = new Set();

            allProducts.forEach((product) => {
                if (!product || product.id == null) {
                    return;
                }

                if (!productIds.has(product.id)) {
                    productIds.add(product.id);
                    uniqueProducts.push(product);
                }
            });

            console.log(
                "TOTAL PRODUCTS:",
                uniqueProducts.length
            );

            console.log(
                "PRODUCT DATA:",
                uniqueProducts
            );

            setProducts(uniqueProducts);
        } catch (error) {
            console.error(
                "PRODUCT LOAD ERROR:",
                error.response?.data || error
            );

            setProducts([]);
        } finally {
            setProductsLoading(false);
        }
    };

    // =====================================================
    // NORMALIZE PRODUCT TYPE
    // =====================================================

    const getProductType = (product) => {
        return String(product?.product_type || "")
            .trim()
            .toLowerCase()
            .replace(/[\s_-]/g, "");
    };

    // =====================================================
    // FILTERED PRODUCTS FOR ACTIVE THEME
    // =====================================================

    const displayedProducts = useMemo(() => {
        if (!products || !products.length) return [];
        return products.filter((product) => {
            const pt = (product?.pet_type || "").trim().toLowerCase();
            if (activePetMode === "dog") {
                return pt === "dog" || pt === "universal";
            }
            if (activePetMode === "cat") {
                return pt === "cat" || pt === "universal";
            }
            if (["others", "other", "setting", "settings"].includes(activePetMode)) {
                return pt !== "dog" && pt !== "cat";
            }
            return true;
        });
    }, [products, activePetMode]);

    // Filter AI Recommendation sections to ensure strict pet-type isolation
    const activeAiRecSections = useMemo(() => {
        if (!aiRecSections?.length) return [];
        return aiRecSections.filter((sec) => {
            if (!sec.pet_type) return true;
            const pt = sec.pet_type.toLowerCase();
            if (activePetMode === "dog") return pt === "dog";
            if (activePetMode === "cat") return pt === "cat";
            if (["others", "other", "setting", "settings"].includes(activePetMode)) {
                return pt !== "dog" && pt !== "cat";
            }
            return true;
        });
    }, [aiRecSections, activePetMode]);

    // Category URL helper to preserve active pet mode
    const getCategoryUrl = (base) => {
        if (activePetMode === "dog") {
            return `${base}${base.includes("?") ? "&" : "?"}pet_type=Dog`;
        }
        if (activePetMode === "cat") {
            return `${base}${base.includes("?") ? "&" : "?"}pet_type=Cat`;
        }
        if (["others", "other", "setting", "settings"].includes(activePetMode)) {
            return `${base}${base.includes("?") ? "&" : "?"}pet_type=others`;
        }
        return base;
    };

    // Filtered adoption pets matching active pet mode
    const allAdoptionPets = useMemo(() => [
        {
            id: 1,
            name: "Bruno",
            type: "Dog",
            breed: "Labrador",
            age: "2 Years",
            gender: "Male",
            location: "Bangalore, Karnataka",
            image: dogImage,
        },
        {
            id: 2,
            name: "Luna",
            type: "Cat",
            breed: "Indie",
            age: "1 Year",
            gender: "Female",
            location: "Pune, Maharashtra",
            image: catImage,
        },
        {
            id: 3,
            name: "Rocky",
            type: "Dog",
            breed: "German Shepherd",
            age: "3 Years",
            gender: "Male",
            location: "Hyderabad, Telangana",
            image: dogImage,
        },
        {
            id: 4,
            name: "Milo",
            type: "Cat",
            breed: "Persian",
            age: "8 Months",
            gender: "Male",
            location: "Chennai, Tamil Nadu",
            image: catImage,
        },
        {
            id: 5,
            name: "Kiwi",
            type: "Bird",
            breed: "Sun Conure Parrot",
            age: "1.5 Years",
            gender: "Male",
            location: "Bangalore, Karnataka",
            image: kiwiParrot,
        },
        {
            id: 6,
            name: "Thumper",
            type: "Rabbit",
            breed: "Holland Lop",
            age: "10 Months",
            gender: "Female",
            location: "Mumbai, Maharashtra",
            image: thumperRabbit,
        },
    ], []);

    const displayedAdoptionPets = useMemo(() => {
        if (activePetMode === "dog") {
            return allAdoptionPets.filter(p => p.type.toLowerCase() === "dog");
        }
        if (activePetMode === "cat") {
            return allAdoptionPets.filter(p => p.type.toLowerCase() === "cat");
        }
        if (["others", "other", "setting", "settings"].includes(activePetMode)) {
            return allAdoptionPets.filter(p => p.type.toLowerCase() !== "dog" && p.type.toLowerCase() !== "cat");
        }
        return allAdoptionPets.slice(0, 4);
    }, [allAdoptionPets, activePetMode]);

    // =====================================================
    // MEDICINE + SUPPLEMENTS
    // =====================================================

    const medicineProducts = useMemo(() => {
        return displayedProducts
            .filter((product) => {
                const type = getProductType(product);
                return (
                    type === "medicine" ||
                    type === "supplement" ||
                    type === "supplements"
                );
            })
            .slice(0, 5);
    }, [displayedProducts]);

    // =====================================================
    // FOOD + OTHER
    // =====================================================

    const foodAndOtherProducts = useMemo(() => {
        return displayedProducts
            .filter((product) => {
                const type = getProductType(product);
                return (
                    type === "food" ||
                    type === "treat" ||
                    type === "treats" ||
                    type === "grooming" ||
                    type === "hygiene" ||
                    type === "fleatick" ||
                    type === "deworming" ||
                    type === "dentalcare" ||
                    type === "skincare" ||
                    type === "jointcare" ||
                    type === "vitamins" ||
                    type === "accessories" ||
                    type === "toys" ||
                    type === "beds" ||
                    type === "leashes" ||
                    type === "clothing" ||
                    type === "feeding" ||
                    type === "aquarium" ||
                    type === "birdcare" ||
                    type === "other"
                );
            })
            .slice(0, 5);
    }, [displayedProducts]);

    // =====================================================
    // VET EQUIPMENT
    // =====================================================

    const vetEquipmentProducts = useMemo(() => {
        return displayedProducts
            .filter((product) => {
                const type = getProductType(product);
                return (
                    type === "vetequipment" ||
                    type === "veterinaryequipment"
                );
            })
            .slice(0, 5);
    }, [displayedProducts]);

    // =====================================================
    // FARM SUPPLIES
    // =====================================================

    const farmSupplyProducts = useMemo(() => {
        return displayedProducts
            .filter((product) => {
                const type = getProductType(product);
                return (
                    type === "farmsupply" ||
                    type === "farmsupplies"
                );
            })
            .slice(0, 5);
    }, [displayedProducts]);

    // =====================================================
    // DEBUG
    // =====================================================

    useEffect(() => {
        if (!products.length) return;

        console.log(
            "MEDICINE + SUPPLEMENT:",
            medicineProducts.length
        );

        console.log(
            "FOOD + OTHER:",
            foodAndOtherProducts.length
        );

        console.log(
            "VET EQUIPMENT:",
            vetEquipmentProducts.length
        );

        console.log(
            "FARM SUPPLIES:",
            farmSupplyProducts.length
        );
    }, [products]);

    // =====================================================
    // PET CHANGE
    // =====================================================

    const handlePetChange = (e) => {
        const { name, value } = e.target;

        setPetDetails((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =====================================================
    // SAVE PET
    // =====================================================

    const savePetDetails = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("access");

        if (!token) {
            alert("Please login to save your pet details.");
            navigate("/login");
            return;
        }

        if (!petDetails.pet_name.trim()) {
            alert("Please enter your pet name.");
            return;
        }

        try {
            setSavingPet(true);

            const response = await api.post(
                "accounts/pets/",
                petDetails,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(
                "Pet created:",
                response.data
            );

            alert(
                `${petDetails.pet_name} details saved successfully!`
            );

            setPetDetails({
                pet_name: "",
                pet_type: "Dog",
                breed: "",
                age: "",
                gender: "",
                weight: "",
                health_notes: "",
            });

            setShowPetModal(false);
        } catch (error) {
            console.error(
                "Save Pet Error:",
                error.response?.data || error
            );

            if (error.response?.status === 401) {
                alert(
                    "Your session has expired. Please login again."
                );

                localStorage.removeItem("access");

                navigate("/login");
            } else {
                alert(
                    error.response?.data?.detail ||
                    "Failed to save pet details."
                );
            }
        } finally {
            setSavingPet(false);
        }
    };

    // =====================================================
    // HERO SLIDES
    // =====================================================

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        setCurrentSlide(0);
    }, [activePetMode]);

    const defaultHeroSlides = [
        {
            key: "store",
            label: "Smart Care for Every Pet",
            title: (
                <>
                    Smart Pet
                    <br />
                    <span>Store</span>
                </>
            ),
            description:
                "Everything your pet needs in one place. Discover food, medicines, supplements, grooming products and expert veterinary care.",
            primaryText: "Shop for Your Pet",
            primaryAction: () =>
                navigate("/products"),
            secondaryText: "🐾 Add Your Pet Details",
            secondaryAction: () =>
                setShowPetModal(true),
            smartText:
                "✨ Get smarter recommendations based on your pet",
            image: productImage,
            imageAlt: "Pet products",
        },

        {
            key: "adoption",
            label: "Find Your New Best Friend",
            title: (
                <>
                    Pet
                    <br />
                    <span>Adoption</span>
                </>
            ),
            description:
                "Give a loving pet a forever home. Explore adorable pets waiting for their perfect family.",
            primaryText: "View Pets",
            primaryAction: () =>
                navigate("/adoption"),
            secondaryText: "🐾 Start Adoption",
            secondaryAction: () =>
                navigate("/adoption"),
            smartText:
                "❤️ Give a pet the loving home they deserve",
            image: petAdoption,
            imageAlt: "Pet adoption",
        },

        {
            key: "prescription",
            label: "Easy & Secure Medicine Ordering",
            title: (
                <>
                    Prescription
                    <br />
                    <span>Upload</span>
                </>
            ),
            description:
                "Upload your pet's prescription and quickly find the medicines recommended by your veterinarian.",
            primaryText: "Upload Prescription",
            primaryAction: () =>
                navigate("/prescription/upload"),
            secondaryText: "View Medicines",
            secondaryAction: () =>
                navigate(
                    "/products?product_type=Medicine&product_type=Supplements"
                ),
            smartText:
                "📄 Simple prescription upload and medicine matching",
            image: prescriptionUpload,
            imageAlt: "Prescription upload",
        },

        {
            key: "home-visit",
            label: "Professional Care at Your Doorstep",
            title: (
                <>
                    Vet Home
                    <br />
                    <span>Visit Service</span>
                </>
            ),
            description:
                "Book experienced veterinary professionals for health checkups, vaccinations, grooming and pet care at home.",
            primaryText: "Book a Home Visit",
            primaryAction: () =>
                navigate("/home-visit"),
            secondaryText: "Explore Services",
            secondaryAction: () =>
                navigate("/home-visit"),
            smartText:
                "🏠 Professional pet care without leaving home",
            image: homeService,
            imageAlt: "Pet home veterinary service",
        },

        {
            key: "offers",
            label: "Limited Time Deals",
            title: (
                <>
                    Mega Pet
                    <br />
                    <span>Offers</span>
                </>
            ),
            description:
                "Save more on pet food, medicines, supplements and everyday essentials with exciting special offers.",
            primaryText: "Shop Offers",
            primaryAction: () =>
                navigate("/products"),
            secondaryText: "Browse Products",
            secondaryAction: () =>
                navigate("/products"),
            smartText:
                "🎉 New deals and savings for every pet parent",
            image: offerProduct,
            imageAlt: "Pet product offers",
        },

        {
            key: "book-vet",
            label: "Trusted Vets · Home Visits",
            title: (
                <>
                    Book a Vet,
                    <br />
                    <span>At Your Doorstep</span>
                </>
            ),
            description:
                "Skip the clinic queue. Book certified veterinary professionals for health checkups, vaccinations, grooming and emergency care — all from the comfort of your home.",
            primaryText: "Book a Vet Now",
            primaryAction: () =>
                navigate("/home-visit"),
            secondaryText: "Explore Services",
            secondaryAction: () =>
                navigate("/home-visit"),
            smartText:
                "🩺 500+ Certified Vets · 4.9★ Rating · 30 min Response",
            image: vetVisitImage,
            imageAlt: "Book a vet home visit",
        },

        {
            key: "zenve-fashion",
            label: "Style · Fashion · Accessories",
            title: (
                <>
                    Dress Your Pet in
                    <br />
                    <span>Zenve Fashion</span>
                </>
            ),
            description:
                "Explore our exclusive pet fashion collection — from cozy sweaters and raincoats to stylish bandanas and party outfits. Because your pet deserves to look amazing.",
            primaryText: "Shop Fashion",
            primaryAction: () =>
                navigate("/Fashion"),
            secondaryText: "View All Styles",
            secondaryAction: () =>
                navigate("/Fashion"),
            smartText:
                "👕 200+ Styles · All Sizes Available · New Every Week",
            image: petFashionImage,
            imageAlt: "Zenve Pet and Owner Matching Fashion",
        },
    ];

    const heroSlides = useMemo(() => {
        if (activePetMode === "dog") {
            return [
                {
                    key: "dog-store",
                    label: "🐶 Canine Dedicated Sanctuary",
                    title: (
                        <>
                            World of
                            <br />
                            <span>Dogs</span>
                        </>
                    ),
                    description:
                        "Everything your dog loves & needs. Wholesome kibble, chew treats, veterinary care, grooming & toys crafted especially for dogs.",
                    primaryText: "Shop Dog Collection",
                    primaryAction: () => navigate("/products?pet_type=Dog"),
                    secondaryText: "🐾 Add Dog Profile",
                    secondaryAction: () => {
                        setPetDetails((prev) => ({ ...prev, pet_type: "Dog" }));
                        setShowPetModal(true);
                    },
                    smartText: "🐕 100% Curated for Dogs of all breeds & ages",
                    image: dogImage,
                    imageAlt: "Dog products and care",
                },
                {
                    key: "dog-health",
                    label: "🩺 Veterinary Care for Dogs",
                    title: (
                        <>
                            Canine
                            <br />
                            <span>Healthcare</span>
                        </>
                    ),
                    description:
                        "From vaccines and deworming to joint care supplements and dental hygiene, keep your dog happy and healthy.",
                    primaryText: "View Dog Medicines",
                    primaryAction: () => navigate("/products?pet_type=Dog&product_type=Medicine&product_type=Supplements"),
                    secondaryText: "Book Vet Visit",
                    secondaryAction: () => navigate("/home-visit"),
                    smartText: "⭐ Veterinary approved formulas for dogs",
                    image: prescriptionUpload,
                    imageAlt: "Dog healthcare",
                },
                {
                    key: "dog-nutrition",
                    label: "🥩 Premium Dog Nutrition",
                    title: (
                        <>
                            Healthy Meals
                            <br />
                            <span>& Biscuits</span>
                        </>
                    ),
                    description:
                        "High-protein puppy and adult dog food from top brands like Drools, Pedigree, and Royal Canin.",
                    primaryText: "Shop Dog Food",
                    primaryAction: () => navigate("/products?pet_type=Dog&product_type=food"),
                    secondaryText: "Browse All",
                    secondaryAction: () => navigate("/products?pet_type=Dog"),
                    smartText: "🦴 Delicious meals, gravies and training treats",
                    image: offerProduct,
                    imageAlt: "Dog food and treats",
                },
            ];
        }

        if (activePetMode === "cat") {
            return [
                {
                    key: "cat-store",
                    label: "🐱 Feline Haven Sanctuary",
                    title: (
                        <>
                            World of
                            <br />
                            <span>Cats</span>
                        </>
                    ),
                    description:
                        "Purr-fect care for every cat. Delicious wet & dry food, hairball remedies, soothing catnip, scratchers and gentle grooming.",
                    primaryText: "Shop Cat Collection",
                    primaryAction: () => navigate("/products?pet_type=Cat"),
                    secondaryText: "🐾 Add Cat Profile",
                    secondaryAction: () => {
                        setPetDetails((prev) => ({ ...prev, pet_type: "Cat" }));
                        setShowPetModal(true);
                    },
                    smartText: "🐈 100% Curated for Cats and Kittens",
                    image: catImage,
                    imageAlt: "Cat products and care",
                },
                {
                    key: "cat-health",
                    label: "💊 Feline Wellness & Care",
                    title: (
                        <>
                            Gentle Care
                            <br />
                            <span>For Cats</span>
                        </>
                    ),
                    description:
                        "Veterinary-approved drops, parasite control, calming treats and vitamin boosters formulated specially for cats.",
                    primaryText: "View Cat Medicines",
                    primaryAction: () => navigate("/products?pet_type=Cat&product_type=Medicine&product_type=Supplements"),
                    secondaryText: "Book Vet Visit",
                    secondaryAction: () => navigate("/home-visit"),
                    smartText: "✨ Gentle, stress-free health solutions for cats",
                    image: catHealthBanner,
                    imageAlt: "Cat healthcare and wellness",
                },
                {
                    key: "cat-food",
                    label: "🐟 Gourmet Cat Meals",
                    title: (
                        <>
                            Nutritious
                            <br />
                            <span>Cat Dinners</span>
                        </>
                    ),
                    description:
                        "Tender salmon, chicken pouches, crunchy kibble and dental bites crafted for finicky felines.",
                    primaryText: "Shop Cat Food",
                    primaryAction: () => navigate("/products?pet_type=Cat&product_type=food"),
                    secondaryText: "Browse All",
                    secondaryAction: () => navigate("/products?pet_type=Cat"),
                    smartText: "🥣 Real meat recipes rich in taurine & omega fatty acids",
                    image: catFoodBanner,
                    imageAlt: "Cat food and treats",
                },
            ];
        }

        if (["others", "other", "setting", "settings"].includes(activePetMode)) {
            return [
                {
                    key: "others-store",
                    label: "⚙️ Specialized Pets & Farm Care",
                    title: (
                        <>
                            Exotic &
                            <br />
                            <span>Farm Pets</span>
                        </>
                    ),
                    description:
                        "Specialized care for Birds, Aquarium Fish, Rabbits, Cattle and Farm Animals. Professional equipment, feeds and health supplements.",
                    primaryText: "Shop Other Pet Supplies",
                    primaryAction: () => navigate("/products?pet_type=others"),
                    secondaryText: "🐾 Add Pet Profile",
                    secondaryAction: () => {
                        setPetDetails((prev) => ({ ...prev, pet_type: "Bird" }));
                        setShowPetModal(true);
                    },
                    smartText: "🕊️ Specialized for Birds, Fish, Rabbits & Livestock",
                    image: otherPetsBanner,
                    imageAlt: "Other pets products and accessories",
                },
                {
                    key: "others-equipment",
                    label: "🩺 Clinical Veterinary Equipment",
                    title: (
                        <>
                            Veterinary
                            <br />
                            <span>Instruments</span>
                        </>
                    ),
                    description:
                        "Professional clinical tools, surgical equipment, examination kits, stethoscopes and diagnostic gear for veterinarians.",
                    primaryText: "View Vet Equipment",
                    primaryAction: () => navigate("/products?product_type=VetEquipment"),
                    secondaryText: "Farm Supplies",
                    secondaryAction: () => navigate("/products?product_type=FarmSupplies"),
                    smartText: "🔬 Precision surgical & clinical tools by VetLife",
                    image: vetInstrumentsBanner,
                    imageAlt: "Clinical veterinary instruments",
                },
                {
                    key: "others-feeds",
                    label: "🌾 Feeds & Habitat Nutrition",
                    title: (
                        <>
                            Seeds, Feeds
                            <br />
                            <span>& Tonics</span>
                        </>
                    ),
                    description:
                        "Fortified seed blends for birds, poultry feeds, mineral mixtures, and nutritional supplements for small and farm animals.",
                    primaryText: "Shop Feeds & Tonics",
                    primaryAction: () => navigate("/products?pet_type=others"),
                    secondaryText: "Browse All",
                    secondaryAction: () => navigate("/products?pet_type=others"),
                    smartText: "🌿 Natural herbal supplements by Himalaya & VetLife",
                    image: otherFeedsBanner,
                    imageAlt: "Bird, small pet and farm feeds",
                },
            ];
        }

        return defaultHeroSlides;
    }, [activePetMode]);

    // =====================================================
    // HERO AUTO SLIDER
    // =====================================================

    useEffect(() => {
        const slider = setInterval(() => {
            setCurrentSlide((previous) =>
                previous === heroSlides.length - 1
                    ? 0
                    : previous + 1
            );
        }, 5000);

        return () => clearInterval(slider);
    }, [heroSlides.length]);

    const nextSlide = () => {
        setCurrentSlide((previous) =>
            previous === heroSlides.length - 1
                ? 0
                : previous + 1
        );
    };

    const previousSlide = () => {
        setCurrentSlide((previous) =>
            previous === 0
                ? heroSlides.length - 1
                : previous - 1
        );
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // =====================================================
    // PRODUCT ROW
    // =====================================================

    const ProductRow = ({
        title,
        products: rowProducts,
        viewLink,
    }) => {
        return (
            <section className="home-section product-category-section">

                <div className="section-heading">

                    <h2>{title}</h2>

                    <Link to={viewLink}>
                        View All →
                    </Link>

                </div>

                <div className="category-product-grid">

                    {productsLoading ? (

                        <div className="category-products-loading">

                            <div className="loading-spinner"></div>

                            <p>
                                Loading products...
                            </p>

                        </div>

                    ) : rowProducts.length > 0 ? (

                        rowProducts
                            .slice(0, 5)
                            .map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))

                    ) : (

                        <div className="category-products-empty">

                            <div className="empty-product-icon">
                                🐾
                            </div>

                            <p>
                                No products available
                                in this category.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/products")
                                }
                            >
                                Browse All Products
                            </button>

                        </div>

                    )}

                </div>

            </section>
        );
    };

    // =====================================================
    // ADVERTISEMENT
    // =====================================================

    const AdvertisementBanner = ({
        icon,
        title,
        subtitle,
        buttonText,
        onClick,
    }) => {
        return (
            <section className="home-advertisement">

                <div className="advertisement-left">

                    <div className="advertisement-icon">
                        {icon}
                    </div>

                    <div>

                        <span className="advertisement-label">
                            SPECIAL OFFER
                        </span>

                        <h2>{title}</h2>

                        <p>{subtitle}</p>

                    </div>

                </div>

                <button
                    type="button"
                    className="advertisement-button"
                    onClick={onClick}
                >
                    {buttonText} →
                </button>

            </section>
        );
    };

    // =====================================================
    // AI CHAT
    // =====================================================

    const openAIChat = () => {
        window.open(
            "https://zynvo.ai/",
            "_blank",
            "noopener,noreferrer"
        );
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <main className={`home-body theme-${activePetMode === "dog" ? "dog" : activePetMode === "cat" ? "cat" : ["others", "other", "setting", "settings"].includes(activePetMode) ? "others" : "all"}`}>

            {/* =================================================
                PET THEME & MODE SWITCHER BAR
            ================================================= */}
            <div className="pet-theme-switcher-bar">
                <div className="pet-theme-switcher-inner">
                    <span className="pet-theme-label">
                        {activePetMode === "dog" && "🐶 Showing Dog Products — Canine Sanctuary Theme"}
                        {activePetMode === "cat" && "🐱 Showing Cat Products — Feline Haven Theme"}
                        {["others", "other", "setting", "settings"].includes(activePetMode) && "⚙️ Showing Other Pets (Birds, Fish, Farm) — Exotic Care Theme"}
                        {(!activePetMode || activePetMode === "all") && "🐾 Showing All Pets — Complete Marketplace"}
                    </span>
                    <div className="pet-theme-pills">
                        <button
                            type="button"
                            className={`pet-pill ${!activePetMode || activePetMode === "all" ? "active" : ""}`}
                            onClick={() => {
                                setSearchParams({});
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                        >
                            🐾 All Pets
                        </button>
                        <button
                            type="button"
                            className={`pet-pill pet-pill-dog ${activePetMode === "dog" ? "active" : ""}`}
                            onClick={() => {
                                setSearchParams({ pet: "dog" });
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                        >
                            🐶 Dogs Only
                        </button>
                        <button
                            type="button"
                            className={`pet-pill pet-pill-cat ${activePetMode === "cat" ? "active" : ""}`}
                            onClick={() => {
                                setSearchParams({ pet: "cat" });
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                        >
                            🐱 Cats Only
                        </button>
                        <button
                            type="button"
                            className={`pet-pill pet-pill-others ${["others", "other", "setting", "settings"].includes(activePetMode) ? "active" : ""}`}
                            onClick={() => {
                                setSearchParams({ pet: "others" });
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                        >
                            ⚙️ Other Pets
                        </button>
                    </div>
                </div>
            </div>

            {/* =================================================
                HERO
            ================================================= */}

            <section
                className={`hero-section hero-slider ${heroSlides[currentSlide]?.key || "store"}-slide`}
            >

                <div
                    className="hero-slide"
                    key={heroSlides[currentSlide].key}
                >

                    <div className="hero-content">

                        <span className="hero-label">
                            {heroSlides[currentSlide].label}
                        </span>

                        <h1>
                            {heroSlides[currentSlide].title}
                        </h1>

                        <p>
                            {heroSlides[currentSlide].description}
                        </p>

                        <div className="hero-features">

                            <div className="hero-feature">
                                <span className="feature-icon">
                                    🐾
                                </span>
                                <span>
                                    <b>Personalized</b>
                                    <br />
                                    Pet Care
                                </span>
                            </div>

                            <div className="hero-feature">
                                <span className="feature-icon">
                                    🩺
                                </span>
                                <span>
                                    <b>Expert Vet</b>
                                    <br />
                                    Support
                                </span>
                            </div>

                            <div className="hero-feature">
                                <span className="feature-icon">
                                    ⚡
                                </span>
                                <span>
                                    <b>Fast & Safe</b>
                                    <br />
                                    Service
                                </span>
                            </div>

                            <div className="hero-feature">
                                <span className="feature-icon">
                                    ❤️
                                </span>
                                <span>
                                    <b>Complete</b>
                                    <br />
                                    Pet Wellness
                                </span>
                            </div>

                        </div>

                        <div className="hero-buttons">

                            <button
                                type="button"
                                onClick={
                                    heroSlides[currentSlide]
                                        .primaryAction
                                }
                            >
                                {
                                    heroSlides[currentSlide]
                                        .primaryText
                                }
                            </button>

                            <button
                                type="button"
                                className="hero-outline-btn"
                                onClick={
                                    heroSlides[currentSlide]
                                        .secondaryAction
                                }
                            >
                                {
                                    heroSlides[currentSlide]
                                        .secondaryText
                                }
                            </button>

                        </div>

                        <div className="hero-smart-text">
                            {
                                heroSlides[currentSlide]
                                    .smartText
                            }
                        </div>

                    </div>

                    {heroSlides[currentSlide].image && (
                        <div className="hero-visual">

                            <div className="hero-circle"></div>

                            <div className="hero-image-wrapper">

                                <img
                                    src={
                                        heroSlides[currentSlide]
                                            .image
                                    }
                                    alt={
                                        heroSlides[currentSlide]
                                            .imageAlt
                                    }
                                    className="hero-slide-image"
                                />

                            </div>

                        </div>
                    )}

                </div>

                <button
                    type="button"
                    className="slider-arrow slider-prev"
                    onClick={previousSlide}
                    aria-label="Previous slide"
                >
                    ❮
                </button>

                <button
                    type="button"
                    className="slider-arrow slider-next"
                    onClick={nextSlide}
                    aria-label="Next slide"
                >
                    ❯
                </button>

                <div className="slider-dots">

                    {heroSlides.map(
                        (slide, index) => (
                            <button
                                key={slide.key}
                                type="button"
                                className={
                                    currentSlide === index
                                        ? "slider-dot active"
                                        : "slider-dot"
                                }
                                onClick={() =>
                                    goToSlide(index)
                                }
                                aria-label={`Go to slide ${
                                    index + 1
                                }`}
                            />
                        )
                    )}

                </div>

            </section>


            {/* =================================================
                PET MODAL
            ================================================= */}

            {showPetModal && (

                <div
                    className="pet-modal-overlay"
                    onClick={() => {
                        if (!savingPet) {
                            setShowPetModal(false);
                        }
                    }}
                >

                    <div
                        className="pet-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="pet-modal-header">

                            <div className="pet-modal-title">

                                <span className="pet-modal-icon">
                                    🐾
                                </span>

                                <div>

                                    <h2>
                                        Add Your Pet
                                    </h2>

                                    <p>
                                        Tell us about your pet
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                className="pet-modal-close"
                                onClick={() =>
                                    setShowPetModal(false)
                                }
                                disabled={savingPet}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            className="pet-details-form"
                            onSubmit={savePetDetails}
                        >

                            <div className="pet-form-group">

                                <label htmlFor="pet_name">
                                    Pet Name
                                </label>

                                <input
                                    id="pet_name"
                                    type="text"
                                    name="pet_name"
                                    value={
                                        petDetails.pet_name
                                    }
                                    onChange={
                                        handlePetChange
                                    }
                                    placeholder="Enter your pet's name"
                                    required
                                />

                            </div>

                            <div className="pet-form-row">

                                <div className="pet-form-group">

                                    <label htmlFor="pet_type">
                                        Pet Type
                                    </label>

                                    <select
                                        id="pet_type"
                                        name="pet_type"
                                        value={
                                            petDetails.pet_type
                                        }
                                        onChange={
                                            handlePetChange
                                        }
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

                                    <label htmlFor="gender">
                                        Gender
                                    </label>

                                    <select
                                        id="gender"
                                        name="gender"
                                        value={
                                            petDetails.gender
                                        }
                                        onChange={
                                            handlePetChange
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

                                    </select>

                                </div>

                            </div>

                            <div className="pet-form-group">

                                <label htmlFor="breed">
                                    Breed
                                </label>

                                <input
                                    id="breed"
                                    type="text"
                                    name="breed"
                                    value={
                                        petDetails.breed
                                    }
                                    onChange={
                                        handlePetChange
                                    }
                                    placeholder="e.g. Labrador, Persian, Indie"
                                />

                            </div>

                            <div className="pet-form-row">

                                <div className="pet-form-group">

                                    <label htmlFor="age">
                                        Age
                                    </label>

                                    <input
                                        id="age"
                                        type="text"
                                        name="age"
                                        value={
                                            petDetails.age
                                        }
                                        onChange={
                                            handlePetChange
                                        }
                                        placeholder="e.g. 2 years"
                                    />

                                </div>

                                <div className="pet-form-group">

                                    <label htmlFor="weight">
                                        Weight
                                    </label>

                                    <input
                                        id="weight"
                                        type="text"
                                        name="weight"
                                        value={
                                            petDetails.weight
                                        }
                                        onChange={
                                            handlePetChange
                                        }
                                        placeholder="e.g. 12 kg"
                                    />

                                </div>

                            </div>

                            <div className="pet-form-group">

                                <label htmlFor="health_notes">
                                    Health / Special Requirements
                                </label>

                                <textarea
                                    id="health_notes"
                                    name="health_notes"
                                    value={
                                        petDetails.health_notes
                                    }
                                    onChange={
                                        handlePetChange
                                    }
                                    placeholder="Enter allergies or special requirements"
                                    rows="3"
                                />

                            </div>

                            <div className="pet-modal-actions">

                                <button
                                    type="button"
                                    className="pet-cancel-btn"
                                    onClick={() =>
                                        setShowPetModal(false)
                                    }
                                    disabled={savingPet}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="pet-save-btn"
                                    disabled={savingPet}
                                >
                                    {savingPet
                                        ? "Saving..."
                                        : "🐾 Save Pet Details"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =====================================================
                EXPLAINABLE AI RECOMMENDATIONS FOR YOUR PETS
            ===================================================== */}
            {activeAiRecSections.length > 0 && (
                <section className="home-section home-xai-section">
                    <div className="section-heading">
                        <div>
                            <span className="xai-chip-pill" style={{ marginBottom: "8px" }}>
                                ✨ EXPLAINABLE AI CARE
                            </span>
                            <h2>Tailored Care For Your Pets</h2>
                            <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" }}>
                                Transparently personalized based on your pets' life-stage, breed, and health requirements.
                            </p>
                        </div>
                        <Link to="/pets" style={{ fontSize: "14px", fontWeight: "600", color: "#2563eb" }}>
                            Manage Pets & View All Care Plans →
                        </Link>
                    </div>

                    <div className="home-xai-container">
                        {activeAiRecSections.map((sec) => (
                            <div key={sec.section_id} className="home-xai-block">
                                <div className="home-xai-subheading">
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <span style={{ fontSize: "22px" }}>🐾</span>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: "17px", color: "#0f172a", fontWeight: "700" }}>{sec.title}</h3>
                                            <span style={{ fontSize: "12px", color: "#64748b" }}>{sec.subtitle}</span>
                                        </div>
                                    </div>
                                    {sec.pet_id && (
                                        <Link to={`/recommended-products/${sec.pet_id}`} className="home-xai-details-link">
                                            Full Explanation Plan ({sec.products.length}) →
                                        </Link>
                                    )}
                                </div>
                                <div className="category-product-grid" style={{ marginTop: "14px" }}>
                                    {sec.products.slice(0, 5).map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            pet={{ id: sec.pet_id, pet_name: sec.pet_name, pet_type: sec.pet_type }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}


            {/* =================================================
                SHOP BY CATEGORIES
            ================================================= */}

            <section className="home-section">

                <div className="section-heading">

                    <h2>
                        Shop by Categories
                    </h2>

                    <Link to={getCategoryUrl("/products")}>
                        View All Categories →
                    </Link>

                </div>

                <div className="category-slider">
                    <div className="category-track">

                        {/* Your 7 category cards */}

                        <Link
                            to={getCategoryUrl("/products?product_type=Medicine&product_type=Supplements")}
                            className="category-card category-medicine"
                        >
                            <div className="category-image">💊</div>
                            <h3>Medicines &<br />Supplements</h3>
                        </Link>

                        <Link
                            to={getCategoryUrl("/products?product_type=food&product_type=Other")}
                            className="category-card category-food"
                        >
                            <div className="category-image">🥣</div>
                            <h3>Pet Food &<br />Products</h3>
                        </Link>

                        <Link
                            to={getCategoryUrl("/products?product_type=FarmSupplies")}
                            className="category-card category-farm"
                        >
                            <div className="category-image">🐄</div>
                            <h3>Farm<br />Supplies</h3>
                        </Link>

                        <Link
                            to={getCategoryUrl("/products?product_type=VetEquipment")}
                            className="category-card category-vet"
                        >
                            <div className="category-image">🩺</div>
                            <h3>Vet<br />Equipment</h3>
                        </Link>

                        <Link
                            to="/home-visit"
                            className="category-card category-home"
                        >
                            <div className="category-image">🏠</div>
                            <h3>Home Visit<br />Service</h3>
                        </Link>

                        <Link
                            to="/adoption"
                            className="category-card category-adoption"
                        >
                            <div className="category-image">🐾</div>
                            <h3>Adoption<br />Platform</h3>
                        </Link>

                        <Link
                            to="/Fashion"
                            className="category-card category-fashion"
                        >
                            <div className="category-image">👕</div>
                            <h3>Zenve<br />Fashion</h3>
                        </Link>

                        {/* DUPLICATE FOR INFINITE LOOP */}

                        <Link
                            to={getCategoryUrl("/products?product_type=Medicine&product_type=Supplements")}
                            className="category-card category-medicine"
                        >
                            <div className="category-image">💊</div>
                            <h3>Medicines &<br />Supplements</h3>
                        </Link>

                        <Link
                            to={getCategoryUrl("/products?product_type=food&product_type=Other")}
                            className="category-card category-food"
                        >
                            <div className="category-image">🥣</div>
                            <h3>Pet Food &<br />Products</h3>
                        </Link>

                        <Link
                            to={getCategoryUrl("/products?product_type=FarmSupplies")}
                            className="category-card category-farm"
                        >
                            <div className="category-image">🐄</div>
                            <h3>Farm<br />Supplies</h3>
                        </Link>

                        <Link
                            to={getCategoryUrl("/products?product_type=VetEquipment")}
                            className="category-card category-vet"
                        >
                            <div className="category-image">🩺</div>
                            <h3>Vet<br />Equipment</h3>
                        </Link>

                        <Link
                            to="/home-visit"
                            className="category-card category-home"
                        >
                            <div className="category-image">🏠</div>
                            <h3>Home Visit<br />Service</h3>
                        </Link>

                        <Link
                            to="/adoption"
                            className="category-card category-adoption"
                        >
                            <div className="category-image">🐾</div>
                            <h3>Adoption<br />Platform</h3>
                        </Link>

                        <Link
                            to="/Fashion"
                            className="category-card category-fashion"
                        >
                            <div className="category-image">👕</div>
                            <h3>Zenve<br />Fashion</h3>
                        </Link>

                    </div>
                </div>

            </section>

            {/* =================================================
                AI CHAT
            ================================================= */}

            <section className="ai-chat-section">

                <div className="ai-chat-content">

                    <div className="ai-chat-badge">
                        ✨ SMART PET CARE
                    </div>

                    <h2>
                        Meet Our Zynvo AI Pet Care Assistant
                    </h2>

                    <p>
                        Have questions about your pet?
                        Our AI assistant helps you understand
                        your pet's needs, discover suitable
                        products and get quick pet-care guidance.
                    </p>

                    <div className="ai-chat-features">

                        <div>
                            <span>🐾</span>
                            <strong>
                                Pet Care Guidance
                            </strong>
                        </div>

                        <div>
                            <span>💊</span>
                            <strong>
                                Product Assistance
                            </strong>
                        </div>

                        <div>
                            <span>🧠</span>
                            <strong>
                                Smart Recommendations
                            </strong>
                        </div>

                    </div>

                    <button
                        type="button"
                        className="ai-chat-button"
                        onClick={openAIChat}
                    >
                        💬 Chat With Our AI
                    </button>

                </div>

                <div className="ai-chat-visual">

                    <div className="ai-chat-circle">
                        🤖
                    </div>

                    <div className="ai-floating-card ai-card-one">
                        🐶
                        <span>
                            Pet Questions
                        </span>
                    </div>

                    <div className="ai-floating-card ai-card-two">
                        💡
                        <span>
                            Smart Advice
                        </span>
                    </div>

                    <div className="ai-floating-card ai-card-three">
                        ❤️
                        <span>
                            Pet Wellness
                        </span>
                    </div>

                </div>

            </section>

            {/*/!* =================================================*/}
            {/*    OFFER*/}
            {/*================================================= *!/*/}

            {/*<section className="offer-banner">*/}

            {/*    <div className="offer-content">*/}

            {/*        <span>*/}
            {/*            Mega Savings*/}
            {/*        </span>*/}

            {/*        <h2>*/}
            {/*            Upto 30% OFF*/}
            {/*        </h2>*/}

            {/*        <p>*/}
            {/*            On Selected Products*/}
            {/*        </p>*/}

            {/*        <button*/}
            {/*            type="button"*/}
            {/*            onClick={() =>*/}
            {/*                navigate("/products")*/}
            {/*            }*/}
            {/*        >*/}
            {/*            Shop Offers →*/}
            {/*        </button>*/}

            {/*    </div>*/}

            {/*    <div className="offer-image">*/}

            {/*        <img*/}
            {/*            src={offerProduct}*/}
            {/*            alt="Special offers"*/}
            {/*        />*/}

            {/*    </div>*/}

            {/*    <div className="countdown-box">*/}

            {/*        <strong>*/}
            {/*            Offer Ends In*/}
            {/*        </strong>*/}

            {/*        <div className="countdown-time">*/}

            {/*            <span>02</span>*/}
            {/*            :*/}
            {/*            <span>18</span>*/}
            {/*            :*/}
            {/*            <span>45</span>*/}
            {/*            :*/}
            {/*            <span>30</span>*/}

            {/*        </div>*/}

            {/*        <div className="countdown-labels">*/}

            {/*            <span>Days</span>*/}
            {/*            <span>Hrs</span>*/}
            {/*            <span>Mins</span>*/}
            {/*            <span>Secs</span>*/}

            {/*        </div>*/}

            {/*    </div>*/}

            {/*</section>*/}


            {/* =================================================
                MEDICINE + SUPPLEMENT
            ================================================= */}

            <ProductRow
                title={
                    activePetMode === "dog"
                        ? "🐕 Dog Healthcare & Veterinary Medicines"
                        : activePetMode === "cat"
                        ? "🐱 Cat Healthcare & Medicines"
                        : ["others", "other", "setting", "settings"].includes(activePetMode)
                        ? "🕊️ Small Pets & Bird Health Supplies"
                        : "Medicine & Supplements"
                }
                products={medicineProducts}
                viewLink={
                    activePetMode === "dog"
                        ? "/products?pet_type=Dog&product_type=Medicine&product_type=Supplements"
                        : activePetMode === "cat"
                        ? "/products?pet_type=Cat&product_type=Medicine&product_type=Supplements"
                        : ["others", "other", "setting", "settings"].includes(activePetMode)
                        ? "/products?pet_type=others&product_type=Medicine&product_type=Supplements"
                        : "/products?product_type=Medicine&product_type=Supplements"
                }
            />


            <AdvertisementBanner
                icon="💊"
                title={
                    activePetMode === "dog"
                        ? "Complete Health Care for Your Dog"
                        : activePetMode === "cat"
                        ? "Gentle Wellness Care for Your Cat"
                        : ["others", "other", "setting", "settings"].includes(activePetMode)
                        ? "Specialized Health Tonics & Vitamins"
                        : "Complete Care for Your Pet"
                }
                subtitle={
                    activePetMode === "dog"
                        ? "Veterinary approved deworming, joint boosters, flea sprays and drops for dogs."
                        : activePetMode === "cat"
                        ? "Hairball control, soothing drops, multivitamins and gentle parasite care for cats."
                        : ["others", "other", "setting", "settings"].includes(activePetMode)
                        ? "Herbal vitality tonics, respiratory care and vitamins for birds, fish & farm animals."
                        : "Trusted medicines and supplements for your pet's everyday health."
                }
                buttonText="Shop Medicines"
                onClick={() =>
                    navigate(
                        activePetMode === "dog"
                            ? "/products?pet_type=Dog&product_type=Medicine&product_type=Supplements"
                            : activePetMode === "cat"
                            ? "/products?pet_type=Cat&product_type=Medicine&product_type=Supplements"
                            : ["others", "other", "setting", "settings"].includes(activePetMode)
                            ? "/products?pet_type=others&product_type=Medicine&product_type=Supplements"
                            : "/products?product_type=Medicine&product_type=Supplements"
                    )
                }
            />


            {/* =================================================
                FOOD + OTHER
            ================================================= */}

            <ProductRow
                title={
                    activePetMode === "dog"
                        ? "🥩 Wholesome Dog Food, Meals & Treats"
                        : activePetMode === "cat"
                        ? "🐟 Delicious Cat Food, Broths & Treats"
                        : ["others", "other", "setting", "settings"].includes(activePetMode)
                        ? "🌾 Feeds, Seeds & Mineral Nutrition"
                        : "Food & Other"
                }
                products={foodAndOtherProducts}
                viewLink={
                    activePetMode === "dog"
                        ? "/products?pet_type=Dog&product_type=food&product_type=Other"
                        : activePetMode === "cat"
                        ? "/products?pet_type=Cat&product_type=food&product_type=Other"
                        : ["others", "other", "setting", "settings"].includes(activePetMode)
                        ? "/products?pet_type=others&product_type=food&product_type=Other"
                        : "/products?product_type=food&product_type=Other"
                }
            />


            <AdvertisementBanner
                icon="🥣"
                title={
                    activePetMode === "dog"
                        ? "Nutritious Dog Food & Crunchy Treats"
                        : activePetMode === "cat"
                        ? "Gourmet Cat Dinners & Tasty Nibbles"
                        : ["others", "other", "setting", "settings"].includes(activePetMode)
                        ? "Feeds, Seed Blends & Essential Nutrients"
                        : "Healthy Food & Everyday Essentials"
                }
                subtitle={
                    activePetMode === "dog"
                        ? "Protein-rich recipes, puppy gravies and crunchy biscuits from top canine brands."
                        : activePetMode === "cat"
                        ? "Tender salmon pouches, taurine-rich kibble and catnip crunchy bites."
                        : ["others", "other", "setting", "settings"].includes(activePetMode)
                        ? "Fortified bird seed blends, poultry feed, and mineral mixtures by VetLife & Himalaya."
                        : "Discover nutritious food, treats and everyday products for your pets."
                }
                buttonText="Shop Products"
                onClick={() =>
                    navigate(
                        activePetMode === "dog"
                            ? "/products?pet_type=Dog&product_type=food&product_type=Other"
                            : activePetMode === "cat"
                            ? "/products?pet_type=Cat&product_type=food&product_type=Other"
                            : ["others", "other", "setting", "settings"].includes(activePetMode)
                            ? "/products?pet_type=others&product_type=food&product_type=Other"
                            : "/products?product_type=food&product_type=Other"
                    )
                }
            />


            {/* =================================================
                VET EQUIPMENT
            ================================================= */}

            <ProductRow
                title={
                    activePetMode === "dog"
                        ? "🩺 Dog Veterinary Supplies & Tools"
                        : activePetMode === "cat"
                        ? "🩺 Cat Veterinary Care & Hygiene"
                        : "🩺 Professional Veterinary Clinical Equipment"
                }
                products={vetEquipmentProducts}
                viewLink={
                    activePetMode === "dog"
                        ? "/products?pet_type=Dog&product_type=VetEquipment"
                        : activePetMode === "cat"
                        ? "/products?pet_type=Cat&product_type=VetEquipment"
                        : "/products?product_type=VetEquipment"
                }
            />


            <AdvertisementBanner
                icon="🩺"
                title="Professional Veterinary Equipment"
                subtitle="Quality equipment and supplies for professional veterinary care."
                buttonText="View Equipment"
                onClick={() =>
                    navigate(
                        activePetMode === "dog"
                            ? "/products?pet_type=Dog&product_type=VetEquipment"
                            : activePetMode === "cat"
                            ? "/products?pet_type=Cat&product_type=VetEquipment"
                            : "/products?product_type=VetEquipment"
                    )
                }
            />


            {/* =================================================
                FARM SUPPLIES (Shown for Other Pets & All Pets)
            ================================================= */}

            {activePetMode !== "dog" && activePetMode !== "cat" && (
                <>
                    <ProductRow
                        title="Farm Supplies"
                        products={farmSupplyProducts}
                        viewLink="/products?product_type=FarmSupplies"
                    />

                    <AdvertisementBanner
                        icon="🐄"
                        title="Farm & Livestock Supplies"
                        subtitle="Reliable products for farm, livestock and agricultural care."
                        buttonText="Shop Farm Supplies"
                        onClick={() =>
                            navigate(
                                "/products?product_type=FarmSupplies"
                            )
                        }
                    />
                </>
            )}



            {/* =================================================
                FEATURED PETS
            ================================================= */}

            <section className="home-section">

                <div className="section-heading">

                    <h2>
                        Featured Pets for Adoption
                    </h2>

                    <Link to="/adoption">
                        View All Pets →
                    </Link>

                </div>

                <div className="pets-grid">
                    {displayedAdoptionPets.map((pet) => (
                        <div key={pet.id} className="pet-card">
                            <div className="pet-image">
                                <img
                                    src={pet.image}
                                    alt={pet.name}
                                    style={{ objectFit: "cover" }}
                                />
                                <span className={`pet-type ${pet.type.toLowerCase()}`}>
                                    {pet.type}
                                </span>
                                <button
                                    type="button"
                                    className="favorite"
                                >
                                    ♡
                                </button>
                            </div>
                            <div className="pet-info">
                                <h3>{pet.name}</h3>
                                <p>
                                    {pet.age} · {pet.gender} · {pet.breed}
                                </p>
                                <small>
                                    📍 {pet.location}
                                </small>
                            </div>
                        </div>
                    ))}
                </div>

            </section>


            {/* =================================================
                TRUSTED BRANDS
            ================================================= */}

            <section className="home-section">

                <div className="section-heading">

                    <h2>
                        Trusted Brands
                    </h2>

                </div>

                <div className="brands-grid">

                    {[
                        "Royal Canin",
                        "Drools",
                        "Pedigree",
                        "Himalaya",
                        "Virbac",
                        "Intas",
                        "Bayer",
                        "N&D",
                    ].map((brand) => (

                        <div
                            className="brand-placeholder"
                            key={brand}
                        >
                            {brand}
                        </div>

                    ))}

                </div>

            </section>


            {/* =================================================
                REVIEWS
            ================================================= */}

            <section className="reviews-section">

                <div className="section-heading">

                    <h2>
                        What Pet Parents Say
                    </h2>

                </div>

                <div className="reviews-grid">

                    <div className="review-card">

                        <span className="quote">
                            “
                        </span>

                        <p>
                            Zenve has everything my pet
                            needs — from medicines to healthy
                            food. Delivery is always on time
                            and products are genuine.
                        </p>

                        <div className="review-user">

                            <div className="review-avatar">
                                PS
                            </div>

                            <div>

                                <strong>
                                    Priya Sharma
                                </strong>

                                <span>
                                    ⭐⭐⭐⭐⭐
                                </span>

                            </div>

                        </div>

                    </div>


                    <div className="review-card">

                        <span className="quote">
                            “
                        </span>

                        <p>
                            The home visit service is a
                            lifesaver! The vet was very
                            professional and my pet felt
                            comfortable at home.
                        </p>

                        <div className="review-user">

                            <div className="review-avatar">
                                RM
                            </div>

                            <div>

                                <strong>
                                    Rahul Mehta
                                </strong>

                                <span>
                                    ⭐⭐⭐⭐⭐
                                </span>

                            </div>

                        </div>

                    </div>


                    <div className="review-card">

                        <span className="quote">
                            “
                        </span>

                        <p>
                            We adopted our cute Indie puppy
                            from the platform. Great experience
                            and good support from the team.
                        </p>

                        <div className="review-user">

                            <div className="review-avatar">
                                AI
                            </div>

                            <div>

                                <strong>
                                    Anjali Iyer
                                </strong>

                                <span>
                                    ⭐⭐⭐⭐⭐
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default Home;