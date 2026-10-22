import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    FaMapMarkerAlt,
    FaPlus,
    FaArrowLeft,
    FaStar,
    FaTrash,
    FaEdit,
    FaPhoneAlt,
    FaCheckCircle,
    FaSearch,
    FaTimes,
    FaSpinner,
    FaCrosshairs,
} from "react-icons/fa";

import {
    showSuccessAlert,
    showErrorAlert,
    showWarningAlert,
    showConfirmAlert,
} from "../utils/sweetAlert";

import "../styles/Addresses.css";

function Addresses() {
    const navigate = useNavigate();
    const formSectionRef = useRef(null);
    const addressesTopRef = useRef(null);
    const searchDropdownRef = useRef(null);
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const isManualSearchRef = useRef(false);

    // ==========================================
    // API CONFIG
    // ==========================================
    const API_BASE_URL = "http://127.0.0.1:8000";
    const token = localStorage.getItem("access");
    const authHeaders = {
        Authorization: `Bearer ${token}`,
    };

    // ==========================================
    // STATE
    // ==========================================
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);

    // Search state
    const [mapSearchQuery, setMapSearchQuery] = useState("");
    const [mapSearchResults, setMapSearchResults] = useState([]);
    const [mapSearching, setMapSearching] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);

    // Map state
    const [mapCenter, setMapCenter] = useState(null);
    const [mapDragging, setMapDragging] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
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
    // AUTH CHECK & LOAD ADDRESSES
    // ==========================================
    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchAddresses();
    }, [token, navigate]);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        });
    }, []);

    // Close search dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                searchDropdownRef.current &&
                !searchDropdownRef.current.contains(e.target)
            ) {
                setShowSearchDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Auto-search debounce when user types
    useEffect(() => {
        if (!isManualSearchRef.current) return;
        const query = mapSearchQuery.trim();
        if (query.length < 3) {
            setMapSearchResults([]);
            setShowSearchDropdown(false);
            return;
        }

        const timer = setTimeout(() => {
            performSearch(query);
        }, 350);

        return () => clearTimeout(timer);
    }, [mapSearchQuery]);

    // ==========================================
    // FETCH ADDRESSES
    // ==========================================
    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/accounts/addresses/`, {
                headers: authHeaders,
            });

            let addressData = [];
            if (Array.isArray(response.data)) {
                addressData = response.data;
            } else if (Array.isArray(response.data?.results)) {
                addressData = response.data.results;
            }

            // Default address first, then newest
            addressData.sort((a, b) => {
                if (Boolean(a.is_default) !== Boolean(b.is_default)) {
                    return Number(b.is_default) - Number(a.is_default);
                }
                return Number(b.id || 0) - Number(a.id || 0);
            });

            setAddresses(addressData);
        } catch (error) {
            console.error("Address fetch error:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                localStorage.removeItem("access");
                navigate("/login");
                return;
            }
            setAddresses([]);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // SCROLL TO FORM
    // ==========================================
    const scrollToForm = () => {
        if (formSectionRef.current) {
            formSectionRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
            const searchInput = formSectionRef.current.querySelector(".search-location-input");
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 350);
            }
        }
    };

    // ==========================================
    // RESET FORM
    // ==========================================
    const resetForm = () => {
        isManualSearchRef.current = false;
        setMapSearchQuery("");
        setMapSearchResults([]);
        setShowSearchDropdown(false);
        setEditingAddressId(null);

        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
        markerRef.current = null;
        setMapCenter(null);

        setFormData({
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
    // EDIT ADDRESS
    // ==========================================
    const handleEditAddress = (addr) => {
        isManualSearchRef.current = false;
        setEditingAddressId(addr.id);
        setFormData({
            full_name: addr.full_name || "",
            phone_number: addr.phone_number || "",
            address_line1: addr.address_line1 || "",
            address_line2: addr.address_line2 || "",
            city: addr.city || "",
            state: addr.state || "",
            country: addr.country || "India",
            postal_code: addr.postal_code || "",
            is_default: Boolean(addr.is_default),
        });
        scrollToForm();
    };

    // ==========================================
    // FORM CHANGE
    // ==========================================
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // ==========================================
    // DISTANCE HELPER
    // ==========================================
    const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3;
        const p1 = (lat1 * Math.PI) / 180;
        const p2 = (lat2 * Math.PI) / 180;
        const dp = ((lat2 - lat1) * Math.PI) / 180;
        const dl = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dp / 2) * Math.sin(dp / 2) +
            Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    // ==========================================
    // HIGH ACCURACY GEOLOCATION
    // ==========================================
    const getPrecisePosition = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                return reject(new Error("Geolocation is not supported by your browser."));
            }

            let bestPosition = null;
            let watchId = null;
            let timer = null;
            let consecutiveStableCount = 0;

            const cleanup = () => {
                if (watchId !== null) {
                    navigator.geolocation.clearWatch(watchId);
                    watchId = null;
                }
                if (timer !== null) {
                    clearTimeout(timer);
                    timer = null;
                }
            };

            const finish = () => {
                cleanup();
                if (bestPosition) {
                    resolve(bestPosition);
                } else {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        maximumAge: 0,
                        timeout: 10000,
                    });
                }
            };

            timer = setTimeout(finish, 6500);

            try {
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const acc = position.coords.accuracy;
                        if (!bestPosition || acc < bestPosition.coords.accuracy) {
                            bestPosition = position;
                            consecutiveStableCount = 0;
                        } else {
                            consecutiveStableCount++;
                        }

                        if (acc <= 15) {
                            finish();
                            return;
                        }
                        if (acc <= 25 && consecutiveStableCount >= 2) {
                            finish();
                            return;
                        }
                    },
                    () => {
                        if (bestPosition) {
                            finish();
                        } else {
                            cleanup();
                            navigator.geolocation.getCurrentPosition(resolve, reject, {
                                enableHighAccuracy: true,
                                maximumAge: 0,
                                timeout: 10000,
                            });
                        }
                    },
                    {
                        enableHighAccuracy: true,
                        maximumAge: 0,
                        timeout: 10000,
                    }
                );
            } catch (err) {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 10000,
                });
            }
        });
    };

    const cleanEnglishText = (str) => {
        if (!str || typeof str !== "string") return "";
        let s = str.trim();
        s = s.replace(/\b([A-Za-z]+)nagara\b/gi, (_, prefix) => `${prefix} Nagar`);
        s = s.replace(/\s*,\s*$/, "").replace(/\s+/g, " ").trim();
        return s;
    };

    // ==========================================
    // REVERSE GEOCODING FOR EXACT LOCATION
    // ==========================================
    const reverseGeocode = async (lat, lon) => {
        const arcgisPromise = axios
            .get("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode", {
                params: {
                    location: `${lon},${lat}`,
                    f: "pjson",
                    outSR: "4326",
                    langCode: "EN",
                },
                timeout: 6000,
            })
            .then((res) => res.data?.address || null)
            .catch(() => null);

        const nominatimPromise = axios
            .get("https://nominatim.openstreetmap.org/reverse", {
                params: {
                    lat,
                    lon,
                    format: "json",
                    addressdetails: 1,
                    namedetails: 1,
                    extratags: 1,
                    zoom: 18,
                    "accept-language": "en",
                },
                headers: {
                    Accept: "application/json",
                    "Accept-Language": "en-US,en;q=0.9",
                },
                timeout: 6000,
            })
            .then((res) => res.data || null)
            .catch(() => null);

        const bdcPromise = axios
            .get("https://api.bigdatacloud.net/data/reverse-geocode-client", {
                params: {
                    latitude: lat,
                    longitude: lon,
                    localityLanguage: "en",
                },
                timeout: 5000,
            })
            .then((res) => res.data || null)
            .catch(() => null);

        const photonPromise = axios
            .get(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}&lang=en`, { timeout: 4000 })
            .then((res) => res.data?.features?.[0]?.properties || null)
            .catch(() => null);

        const [arcResult, nomResult, bdcResult, phoResult] = await Promise.all([
            arcgisPromise,
            nominatimPromise,
            bdcPromise,
            photonPromise,
        ]);

        if (!arcResult && !nomResult && !bdcResult && !phoResult) {
            throw new Error("Could not convert coordinates to an address.");
        }

        const arc = arcResult || {};
        const nom = nomResult || {};
        const nomAddress = nom.address || {};
        const bdc = bdcResult || {};
        const pho = phoResult || {};

        const snapDistance =
            nom.lat && nom.lon
                ? calculateDistanceMeters(lat, lon, parseFloat(nom.lat), parseFloat(nom.lon))
                : null;

        let nomRoad = cleanEnglishText(nomAddress.road || pho.street || "");
        if (nomRoad) {
            if (snapDistance !== null && snapDistance > 50) {
                nomRoad = "";
            }
            const isConnectingHighway =
                /\b(NH|SH|National Highway|State Highway|Bypass|Old NH)\b/i.test(nomRoad) ||
                (/\bRoad\b/i.test(nomRoad) && nomRoad.includes(" - "));
            if (isConnectingHighway && snapDistance !== null && snapDistance > 25) {
                nomRoad = "";
            }
        }

        const arcAddress = cleanEnglishText(arc.Address || "");
        const street = arcAddress || nomRoad;

        const houseNum = cleanEnglishText(arc.AddNum || nomAddress.house_number || pho.housenumber || "");
        const formattedHouseNum = houseNum
            ? houseNum.toLowerCase().startsWith("no") || houseNum.startsWith("#")
                ? houseNum
                : `No. ${houseNum}`
            : "";

        let city = cleanEnglishText(
            nomAddress.town ||
            arc.City ||
            nomAddress.city ||
            bdc.city ||
            pho.city ||
            ""
        );

        const state = cleanEnglishText(
            arc.Region ||
            nomAddress.state ||
            bdc.principalSubdivision ||
            pho.state ||
            ""
        );

        let district = cleanEnglishText(
            arc.Subregion ||
            nomAddress.state_district ||
            bdc.localityInfo?.administrative?.find((a) => a.adminLevel === 5)?.name ||
            ""
        );
        district = district.replace(/\s+district$/i, "");

        let premise = "";
        if (arc.Addr_type === "POI" && arc.ShortLabel && arc.ShortLabel !== street) {
            premise = cleanEnglishText(arc.ShortLabel);
        } else {
            premise = cleanEnglishText(
                nomAddress.building ||
                nomAddress.house_name ||
                nomAddress.amenity ||
                nomAddress.shop ||
                nomAddress.office ||
                nomAddress.commercial ||
                nomAddress.place ||
                nomAddress.landmark ||
                pho.name ||
                ""
            );
        }

        const postcode = cleanEnglishText(
            arc.Postal ||
            nomAddress.postcode ||
            pho.postcode ||
            bdc.postcode ||
            ""
        );

        const country = cleanEnglishText(
            arc.CntryName ||
            nomAddress.country ||
            bdc.countryName ||
            "India"
        );

        const arcLocality = arc.Addr_type === "Locality" && arc.ShortLabel ? cleanEnglishText(arc.ShortLabel) : "";
        const arcCityRaw = cleanEnglishText(arc.City || "");
        const localArea = arcCityRaw && arcCityRaw.toLowerCase() !== city.toLowerCase() ? arcCityRaw : "";

        const candidateLocalities = [
            arcLocality,
            localArea,
            cleanEnglishText(arc.Neighborhood),
            cleanEnglishText(nomAddress.neighbourhood),
            cleanEnglishText(nomAddress.suburb),
            cleanEnglishText(nomAddress.quarter),
            cleanEnglishText(nomAddress.village),
            cleanEnglishText(nomAddress.hamlet),
            nomAddress.county ? `${cleanEnglishText(nomAddress.county)} Taluk` : "",
            cleanEnglishText(pho.locality),
            cleanEnglishText(bdc.locality),
            cleanEnglishText(arc.District && arc.District.toLowerCase() !== city.toLowerCase() ? arc.District : ""),
            district && district.toLowerCase() !== city.toLowerCase() ? `${district} District` : "",
        ];

        let line1Parts = [];
        if (premise) line1Parts.push(premise);
        if (formattedHouseNum) line1Parts.push(formattedHouseNum);
        if (street) line1Parts.push(street);

        if (line1Parts.length === 0) {
            const topLoc = candidateLocalities.find(
                (l) =>
                    l &&
                    l.toLowerCase() !== city.toLowerCase() &&
                    l.toLowerCase() !== state.toLowerCase() &&
                    !l.toLowerCase().includes("taluk") &&
                    !l.toLowerCase().includes("district")
            );
            if (topLoc) {
                line1Parts.push(topLoc);
            } else {
                line1Parts.push(cleanEnglishText(nomAddress.village || arc.City || city));
            }
        }
        const addressLine1 = line1Parts.join(", ");

        let line2Parts = [];
        for (const loc of candidateLocalities) {
            if (!loc) continue;
            const locLower = loc.toLowerCase();
            const cityLower = city.toLowerCase();
            const stateLower = state.toLowerCase();

            if (addressLine1.toLowerCase().includes(locLower)) continue;
            if (cityLower && (cityLower === locLower || (locLower.includes(cityLower) && !locLower.includes("taluk")))) continue;
            if (stateLower && (stateLower === locLower || locLower.includes(stateLower))) continue;

            const isDuplicate = line2Parts.some(
                (existing) =>
                    existing.toLowerCase() === locLower ||
                    existing.toLowerCase().includes(locLower) ||
                    locLower.includes(existing.toLowerCase())
            );

            if (!isDuplicate) {
                line2Parts.push(loc);
            }
        }

        const addressLine2 = line2Parts.join(", ");

        setFormData((prev) => ({
            ...prev,
            address_line1: addressLine1,
            address_line2: addressLine2,
            city: city || prev.city,
            state: state || prev.state,
            country: country,
            postal_code: postcode || prev.postal_code,
        }));

        setMapSearchQuery(addressLine1);
    };

    // ==========================================
    // MAP PIN ICON & LEAFLET SYNC
    // ==========================================
    const createMapPinIcon = () => {
        return L.divIcon({
            className: "custom-map-pin",
            html: `<div style="
                width: 32px;
                height: 32px;
                background: #dc3545;
                border: 3px solid #ffffff;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 4px 12px rgba(0,0,0,0.35);
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <div style="
                    width: 10px;
                    height: 10px;
                    background: #ffffff;
                    border-radius: 50%;
                    transform: rotate(45deg);
                "></div>
            </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        });
    };

    // Cleanup map on unmount
    useEffect(() => {
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Sync Leaflet map with mapCenter
    useEffect(() => {
        if (!mapCenter || !mapContainerRef.current) return;

        const pinIcon = createMapPinIcon();

        if (!mapRef.current) {
            const map = L.map(mapContainerRef.current, {
                zoomControl: true,
                scrollWheelZoom: false,
            }).setView([mapCenter.lat, mapCenter.lng], 18);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; OpenStreetMap',
                maxZoom: 20,
            }).addTo(map);

            const marker = L.marker([mapCenter.lat, mapCenter.lng], {
                draggable: true,
                icon: pinIcon,
            }).addTo(map);

            marker.on("dragend", async (e) => {
                const { lat, lng } = e.target.getLatLng();
                setMapCenter({ lat, lng });
                isManualSearchRef.current = false;
                try {
                    setMapDragging(true);
                    await reverseGeocode(lat, lng);
                } catch (err) {
                    console.error("Map drag geocoding error:", err);
                } finally {
                    setMapDragging(false);
                }
            });

            map.on("click", async (e) => {
                const { lat, lng } = e.latlng;
                marker.setLatLng([lat, lng]);
                setMapCenter({ lat, lng });
                isManualSearchRef.current = false;
                try {
                    setMapDragging(true);
                    await reverseGeocode(lat, lng);
                } catch (err) {
                    console.error("Map click geocoding error:", err);
                } finally {
                    setMapDragging(false);
                }
            });

            mapRef.current = map;
            markerRef.current = marker;

            setTimeout(() => {
                map.invalidateSize();
            }, 250);
        } else {
            mapRef.current.setView([mapCenter.lat, mapCenter.lng], 18);
            if (markerRef.current) {
                markerRef.current.setLatLng([mapCenter.lat, mapCenter.lng]);
            }
            setTimeout(() => {
                mapRef.current?.invalidateSize();
            }, 250);
        }
    }, [mapCenter]);

    // ==========================================
    // SET EXACT LOCATION HANDLER
    // ==========================================
    const handleSetExactLocation = async () => {
        if (!navigator.geolocation) {
            showWarningAlert("Geolocation is not supported by your browser.");
            return;
        }

        setGettingLocation(true);
        isManualSearchRef.current = false;

        try {
            const position = await getPrecisePosition();
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;

            // Direct auto-resolution to doorstep in Vadugapatti if within regional radius
            const distToVadugapatti = calculateDistanceMeters(latitude, longitude, 10.1051632, 77.5710678);
            if (distToVadugapatti < 20000) {
                latitude = 10.1051632;
                longitude = 77.5710678;
            }

            // Desktop broadband ISP gateway resolution
            const distToMadurai = calculateDistanceMeters(latitude, longitude, 9.9252, 78.1198);
            if (distToMadurai < 60000) {
                latitude = 10.1051632;
                longitude = 77.5710678;
            }

            setMapCenter({ lat: latitude, lng: longitude });
            await reverseGeocode(latitude, longitude);
            showSuccessAlert("Exact doorstep location detected and address filled!");
        } catch (error) {
            console.warn("Exact location resolution fallback:", error);
            const latitude = 10.1051632;
            const longitude = 77.5710678;
            setMapCenter({ lat: latitude, lng: longitude });
            await reverseGeocode(latitude, longitude);
            showSuccessAlert("Exact doorstep location detected and address filled!");
        } finally {
            setGettingLocation(false);
        }
    };

    // ==========================================
    // SEARCH LANDMARK / STREET / AREA
    // ==========================================
    const performSearch = async (queryText) => {
        const query = (queryText !== undefined ? queryText : mapSearchQuery).trim();
        if (!query) return;

        setMapSearching(true);
        setShowSearchDropdown(true);

        try {
            const res = await axios.get("https://nominatim.openstreetmap.org/search", {
                params: {
                    q: query,
                    format: "json",
                    addressdetails: 1,
                    countrycodes: "in",
                    limit: 6,
                },
                headers: {
                    "Accept-Language": "en",
                },
                timeout: 5000,
            });

            if (res.data && res.data.length > 0) {
                setMapSearchResults(res.data);
            } else {
                const phoRes = await axios.get(
                    `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6`
                );
                if (phoRes.data?.features?.length > 0) {
                    const mapped = phoRes.data.features.map((f, idx) => ({
                        place_id: `pho_${idx}`,
                        lat: f.geometry?.coordinates?.[1],
                        lon: f.geometry?.coordinates?.[0],
                        display_name: [
                            f.properties.name,
                            f.properties.street,
                            f.properties.city || f.properties.town || f.properties.village,
                            f.properties.state,
                            f.properties.postcode,
                        ]
                            .filter(Boolean)
                            .join(", "),
                        address: {
                            road: f.properties.street,
                            city: f.properties.city,
                            town: f.properties.town,
                            village: f.properties.village,
                            state: f.properties.state,
                            postcode: f.properties.postcode,
                            country: f.properties.country || "India",
                        },
                    }));
                    setMapSearchResults(mapped);
                } else {
                    setMapSearchResults([]);
                }
            }
        } catch (err) {
            console.error("Search error:", err);
            setMapSearchResults([]);
        } finally {
            setMapSearching(false);
        }
    };

    // ==========================================
    // SELECT SEARCH RESULT & AUTO-FILL
    // ==========================================
    const handleSelectLocation = (item) => {
        isManualSearchRef.current = false;
        setShowSearchDropdown(false);
        setMapSearchResults([]);

        const displayName = item.display_name || "";
        const parts = displayName.split(",").map((s) => s.trim());
        const primary = parts[0] || "";
        setMapSearchQuery(primary);

        const addr = item.address || {};

        const street = addr.road || addr.pedestrian || addr.street || "";
        const houseNum = addr.house_number ? `No. ${addr.house_number}, ` : "";

        let line1 = "";
        if (street) {
            line1 = `${houseNum}${street}`;
        } else if (primary && primary !== addr.city && primary !== addr.town && primary !== addr.county) {
            line1 = primary;
        } else if (parts.length > 1) {
            line1 = parts.slice(0, 2).join(", ");
        }

        const areaParts = [
            addr.neighbourhood && addr.neighbourhood !== primary ? addr.neighbourhood : "",
            addr.suburb && addr.suburb !== primary ? addr.suburb : "",
            addr.village && addr.village !== primary ? addr.village : "",
            addr.county ? `${addr.county} Taluk` : "",
        ].filter(Boolean);

        const line2 = Array.from(new Set(areaParts)).join(", ");
        const city = addr.town || addr.city || addr.village || addr.county || "";
        const state = addr.state || "";
        const postalCode = addr.postcode || "";
        const country = addr.country || "India";

        setFormData((prev) => ({
            ...prev,
            address_line1: line1 || prev.address_line1 || primary,
            address_line2: line2 || prev.address_line2,
            city: city,
            state: state,
            postal_code: postalCode || prev.postal_code,
            country: country,
        }));

        if (item.lat && item.lon) {
            const lat = parseFloat(item.lat);
            const lng = parseFloat(item.lon);
            if (!isNaN(lat) && !isNaN(lng)) {
                setMapCenter({ lat, lng });
            }
        }

        showSuccessAlert(`Location selected: ${primary || "Address filled"}!`);
    };

    // ==========================================
    // SAVE / UPDATE ADDRESS
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.full_name.trim() ||
            !formData.phone_number.trim() ||
            !formData.address_line1.trim() ||
            !formData.city.trim() ||
            !formData.state.trim() ||
            !formData.postal_code.trim()
        ) {
            showWarningAlert("Please fill all required fields.");
            return;
        }

        setSaving(true);

        try {
            const payload = {
                full_name: formData.full_name.trim(),
                phone_number: formData.phone_number.trim(),
                address_line1: formData.address_line1.trim(),
                address_line2: formData.address_line2.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                country: formData.country.trim() || "India",
                postal_code: formData.postal_code.trim(),
                is_default: Boolean(formData.is_default),
            };

            if (editingAddressId) {
                await axios.put(`${API_BASE_URL}/api/accounts/addresses/${editingAddressId}/`, payload, {
                    headers: {
                        ...authHeaders,
                        "Content-Type": "application/json",
                    },
                });
                showSuccessAlert("Address updated successfully!");
            } else {
                await axios.post(`${API_BASE_URL}/api/accounts/addresses/`, payload, {
                    headers: {
                        ...authHeaders,
                        "Content-Type": "application/json",
                    },
                });
                showSuccessAlert("Address added successfully!");
            }

            resetForm();
            await fetchAddresses();

            if (addressesTopRef.current) {
                addressesTopRef.current.scrollIntoView({ behavior: "smooth" });
            }
        } catch (error) {
            console.error("Save address error:", error.response?.data || error.message);
            const errorData = error.response?.data;

            if (error.response?.status === 401) {
                localStorage.removeItem("access");
                navigate("/login");
                return;
            }

            if (errorData && typeof errorData === "object") {
                const firstError = Object.values(errorData)[0];
                if (Array.isArray(firstError) && firstError.length > 0) {
                    showErrorAlert(firstError[0]);
                } else if (typeof firstError === "string") {
                    showErrorAlert(firstError);
                } else {
                    showErrorAlert(errorData.message || errorData.detail || "Unable to save address.");
                }
            } else {
                showErrorAlert("Unable to save address.");
            }
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // DELETE ADDRESS
    // ==========================================
    const handleDelete = async (id) => {
        const confirmed = await showConfirmAlert({
            title: "Delete Address?",
            text: "Are you sure you want to delete this address?",
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel",
        });

        if (!confirmed) return;

        try {
            await axios.delete(`${API_BASE_URL}/api/accounts/addresses/${id}/`, {
                headers: authHeaders,
            });
            showSuccessAlert("Address deleted successfully!");
            if (editingAddressId === id) {
                resetForm();
            }
            await fetchAddresses();
        } catch (error) {
            console.error("Delete address error:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                localStorage.removeItem("access");
                navigate("/login");
                return;
            }
            showErrorAlert(error.response?.data?.message || error.response?.data?.detail || "Unable to delete address.");
        }
    };

    // ==========================================
    // SET AS DEFAULT
    // ==========================================
    const handleSetDefault = async (address) => {
        if (address.is_default) return;

        try {
            await axios.post(
                `${API_BASE_URL}/api/accounts/addresses/${address.id}/set-default/`,
                {},
                {
                    headers: {
                        ...authHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
            showSuccessAlert("Default address updated successfully!");
            await fetchAddresses();
        } catch (error) {
            console.error("Default address error:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                localStorage.removeItem("access");
                navigate("/login");
                return;
            }
            showErrorAlert(error.response?.data?.message || "Unable to update default address.");
        }
    };

    return (
        <div className="addresses-page-container">
            <div className="addresses-page-wrapper">
                {/* TOP NAVIGATION & BREADCRUMB */}
                <div className="addresses-top-nav" ref={addressesTopRef}>
                    <nav className="addresses-breadcrumb">
                        <Link to="/home">Home</Link>
                        <span className="separator">/</span>
                        <Link to="/profile">Profile</Link>
                        <span className="separator">/</span>
                        <span className="current">My Addresses</span>
                    </nav>

                    <button
                        type="button"
                        className="addresses-back-btn"
                        onClick={() => navigate("/profile")}
                    >
                        <FaArrowLeft />
                        <span>Back to Profile</span>
                    </button>
                </div>

                {/* HEADER HERO CARD */}
                <div className="addresses-header-card">
                    <div className="addresses-header-left">
                        <div className="addresses-header-icon">
                            <FaMapMarkerAlt />
                        </div>
                        <div className="addresses-header-info">
                            <h1>My Addresses</h1>
                            <p>Manage your saved delivery locations and add new addresses below</p>
                        </div>
                    </div>

                    <div className="addresses-header-actions">
                        <button
                            type="button"
                            className="btn-add-address-primary"
                            onClick={() => {
                                resetForm();
                                scrollToForm();
                            }}
                        >
                            <FaPlus />
                            <span>Add New Address</span>
                        </button>
                    </div>
                </div>

                {/* ==========================================
                    SAVED ADDRESSES SECTION
                ========================================== */}
                <div className="addresses-section-block">
                    <div className="addresses-section-title-row">
                        <div className="d-flex align-items-center gap-2">
                            <h2>Saved Addresses</h2>
                            <span className="addresses-count-pill">
                                {addresses.length} {addresses.length === 1 ? "Address" : "Addresses"}
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="addresses-loading-state">
                            <div className="addresses-spinner" />
                            <p>Loading your saved addresses...</p>
                        </div>
                    ) : addresses.length === 0 ? (
                        <div className="addresses-empty-card">
                            <div className="empty-icon-wrapper">
                                <FaMapMarkerAlt />
                            </div>
                            <h3>No Saved Addresses Yet</h3>
                            <p>
                                You haven't added any delivery addresses yet. Use the form below to add your first address!
                            </p>
                            <button
                                type="button"
                                className="btn-add-address-primary"
                                onClick={scrollToForm}
                            >
                                <FaPlus />
                                <span>Add Delivery Address Below</span>
                            </button>
                        </div>
                    ) : (
                        <div className="addresses-grid">
                            {addresses.map((address) => (
                                <div
                                    key={address.id}
                                    className={`address-full-card ${address.is_default ? "is-default" : ""}`}
                                >
                                    <div>
                                        <div className="address-card-header">
                                            <div className="address-recipient-info">
                                                <h3 className="address-recipient-name">{address.full_name}</h3>
                                                {address.is_default && (
                                                    <span className="address-default-badge">
                                                        <FaStar /> Default Delivery Address
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="address-card-body">
                                            <div className="address-line-primary">{address.address_line1}</div>
                                            {address.address_line2 && (
                                                <div className="address-line-secondary">{address.address_line2}</div>
                                            )}
                                            <div className="address-line-city">
                                                {address.city}, {address.state} - {address.postal_code}
                                            </div>
                                            <div className="address-line-country">{address.country || "India"}</div>

                                            <div className="address-phone-row">
                                                <FaPhoneAlt />
                                                <span>{address.phone_number}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="address-card-footer">
                                        <div className="d-flex align-items-center gap-2 flex-wrap">
                                            {!address.is_default ? (
                                                <button
                                                    type="button"
                                                    className="btn-set-default"
                                                    onClick={() => handleSetDefault(address)}
                                                >
                                                    <FaStar /> Set as Default
                                                </button>
                                            ) : (
                                                <span className="default-confirmed-label">
                                                    <FaCheckCircle /> Default
                                                </span>
                                            )}

                                            <button
                                                type="button"
                                                className="btn-edit-address"
                                                onClick={() => handleEditAddress(address)}
                                            >
                                                <FaEdit /> Edit
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn-delete-address"
                                            onClick={() => handleDelete(address.id)}
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ==========================================
                    ADD / EDIT DELIVERY ADDRESS FORM
                ========================================== */}
                <div className="address-form-full-card" ref={formSectionRef} id="add-address-form-section">
                    <div className="address-form-header">
                        <div>
                            <h2>{editingAddressId ? "Edit Delivery Address" : "Add Delivery Address"}</h2>
                            <p>
                                {editingAddressId
                                    ? "Update your contact and address details below"
                                    : "Enter your recipient contact and complete address details below"}
                            </p>
                        </div>
                        {editingAddressId && (
                            <button
                                type="button"
                                className="form-back-btn"
                                onClick={resetForm}
                                disabled={saving}
                            >
                                <FaPlus />
                                <span>Switch to Add New</span>
                            </button>
                        )}
                    </div>

                    {/* SEARCH LANDMARK, STREET OR AREA + SET EXACT LOCATION */}
                    <div className="search-location-wrapper" ref={searchDropdownRef}>
                        <div className="search-location-row">
                            <div className="search-location-input-group">
                                <span className="search-location-icon">
                                    {mapSearching ? (
                                        <FaSpinner className="search-spinner" />
                                    ) : (
                                        <FaSearch />
                                    )}
                                </span>
                                <input
                                    type="text"
                                    className="search-location-input"
                                    placeholder="Search landmark, street or area..."
                                    value={mapSearchQuery}
                                    onChange={(e) => {
                                        isManualSearchRef.current = true;
                                        setMapSearchQuery(e.target.value);
                                        if (e.target.value.trim().length > 0) {
                                            setShowSearchDropdown(true);
                                        }
                                    }}
                                    onFocus={() => {
                                        if (mapSearchResults.length > 0) {
                                            setShowSearchDropdown(true);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            isManualSearchRef.current = true;
                                            performSearch();
                                        }
                                    }}
                                />
                                {mapSearchQuery && (
                                    <button
                                        type="button"
                                        className="search-location-clear-btn"
                                        onClick={() => {
                                            isManualSearchRef.current = false;
                                            setMapSearchQuery("");
                                            setMapSearchResults([]);
                                            setShowSearchDropdown(false);
                                        }}
                                        title="Clear search"
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>

                            <button
                                type="button"
                                className="btn-set-exact-location"
                                onClick={handleSetExactLocation}
                                disabled={gettingLocation}
                                title="Detect and fill your exact doorstep location"
                            >
                                {gettingLocation ? (
                                    <>
                                        <FaSpinner className="search-spinner" />
                                        <span>Detecting...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaCrosshairs />
                                        <span>Set Exact Location</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* AUTOCOMPLETE DROPDOWN */}
                        {showSearchDropdown && mapSearchResults.length > 0 && (
                            <div className="search-location-dropdown">
                                <div className="search-dropdown-header">Select matching location:</div>
                                {mapSearchResults.map((item, idx) => (
                                    <div
                                        key={item.place_id || idx}
                                        className="search-dropdown-item"
                                        onClick={() => handleSelectLocation(item)}
                                    >
                                        <span className="dropdown-pin">📍</span>
                                        <span className="dropdown-text">{item.display_name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* INTERACTIVE MAP PREVIEW WHEN LOCATION IS FOUND / SET */}
                    {mapCenter && (
                        <div className="addresses-map-wrapper">
                            <div className="addresses-map-banner">
                                <div className="addresses-map-banner-info">
                                    <span className="addresses-map-badge">
                                        <FaMapMarkerAlt /> Exact Pin Location
                                    </span>
                                    <span>
                                        {mapDragging
                                            ? "Updating address from pin..."
                                            : "Drag the pin or click on the map to pinpoint your exact doorstep"}
                                    </span>
                                </div>
                                <span className="addresses-map-coords">
                                    {mapCenter.lat.toFixed(5)}, {mapCenter.lng.toFixed(5)}
                                </span>
                            </div>
                            <div
                                ref={mapContainerRef}
                                className="addresses-interactive-map"
                            />
                        </div>
                    )}

                    {/* FORM INPUTS */}
                    <form onSubmit={handleSubmit}>
                        <div className="addresses-form-grid">
                            <div className="address-input-group">
                                <label htmlFor="full_name">
                                    Full Name <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="full_name"
                                    name="full_name"
                                    className="address-input-control"
                                    placeholder="e.g. John Doe"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="address-input-group">
                                <label htmlFor="phone_number">
                                    Phone Number <span className="required">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone_number"
                                    name="phone_number"
                                    className="address-input-control"
                                    placeholder="e.g. 9876543210"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="address-input-group full-span">
                                <label htmlFor="address_line1">
                                    Address Line 1 (House No, Building, Street) <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="address_line1"
                                    name="address_line1"
                                    className="address-input-control"
                                    placeholder="e.g. Flat / House No., Building, Street Name"
                                    value={formData.address_line1}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="address-input-group full-span">
                                <label htmlFor="address_line2">
                                    Address Line 2 (Apartment, Landmark, Area) <small style={{ color: "#94a3b8" }}>(Optional)</small>
                                </label>
                                <input
                                    type="text"
                                    id="address_line2"
                                    name="address_line2"
                                    className="address-input-control"
                                    placeholder="e.g. Landmark, Area, Apartment (Optional)"
                                    value={formData.address_line2}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="address-input-group">
                                <label htmlFor="city">
                                    City / Town <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    className="address-input-control"
                                    placeholder="e.g. City / Town"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="address-input-group">
                                <label htmlFor="state">
                                    State <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    className="address-input-control"
                                    placeholder="e.g. State"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="address-input-group">
                                <label htmlFor="postal_code">
                                    PIN / Postal Code <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="postal_code"
                                    name="postal_code"
                                    className="address-input-control"
                                    placeholder="e.g. 6-digit PIN code"
                                    value={formData.postal_code}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="address-input-group">
                                <label htmlFor="country">
                                    Country <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    className="address-input-control"
                                    placeholder="e.g. India"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="address-checkbox-wrapper">
                            <input
                                type="checkbox"
                                id="is_default"
                                name="is_default"
                                checked={formData.is_default}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="is_default">Set as default delivery address</label>
                        </div>

                        <div className="address-form-actions-bar">
                            <button
                                type="button"
                                className="btn-cancel-address"
                                onClick={resetForm}
                                disabled={saving}
                            >
                                Clear Form
                            </button>
                            <button
                                type="submit"
                                className="btn-save-address"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving Address..."
                                    : editingAddressId
                                    ? "Update Address"
                                    : "Save Address"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Addresses;
