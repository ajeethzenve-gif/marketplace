import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  Search,
  ShieldCheck,
  Video,
  Clock3,
  Send,
  MapPin,
  Star,
  Phone,
  ExternalLink,
  CalendarCheck,
  X,
  CheckCircle2,
  Calendar,
  User,
  AlertCircle,
  Copy,
} from "lucide-react";
import api from "../api/api";

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Booked = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedRating, setSelectedRating] = useState("");

  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [videoOnly, setVideoOnly] = useState(false);

  // Booking Modal State
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingType, setBookingType] = useState("In Clinic");
  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [bookingSlot, setBookingSlot] = useState("10:30 AM");
  const [petName, setPetName] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [reason, setReason] = useState("");
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState("");
  const [copiedMeeting, setCopiedMeeting] = useState(false);

  const handleOpenBooking = (doc, type = "In Clinic") => {
    setBookingDoctor(doc);
    setBookingType(type);
    setBookingSlot("10:30 AM");
    setBookingSuccess(null);
    setBookingError("");
  };

  const handleCloseBooking = () => {
    setBookingDoctor(null);
    setBookingSuccess(null);
    setBookingError("");
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDoctor) return;
    if (!petName.trim()) {
      setBookingError("Please enter your pet's name.");
      return;
    }
    if (!parentPhone.trim()) {
      setBookingError("Please enter your contact phone number.");
      return;
    }

    try {
      setSubmittingBooking(true);
      setBookingError("");
      const response = await api.post("doctors/book/", {
        doctor_id: bookingDoctor.id || bookingDoctor.doctor_id,
        doctor_name: bookingDoctor.name,
        date: bookingDate,
        time: bookingSlot,
        appointment_type: bookingType,
        pet_name: petName.trim(),
        parent_name: parentName.trim() || "Pet Parent",
        phone: parentPhone.trim(),
        reason: reason.trim() || "Veterinary Consultation",
      });

      if (response.data?.success) {
        setBookingSuccess(response.data);
      } else {
        setBookingSuccess({
          booking_id: response.data?.booking_id || "APT-" + Date.now().toString().slice(-6),
          doctor_name: bookingDoctor.name,
          appointment_date: bookingDate,
          appointment_time: bookingSlot,
          appointment_type: bookingType,
        });
      }
    } catch (err) {
      setBookingError(
        err.response?.data?.error || "Failed to confirm appointment. Please try again or call the clinic."
      );
    } finally {
      setSubmittingBooking(false);
    }
  };

  /* =======================================================
     LOAD DOCTORS FROM API
  ======================================================= */

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get("doctors/");
      const data = response.data?.results || response.data || [];
      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      // Backend endpoint may not be implemented yet; fallback to empty list
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     GET STATE & CITY
  ======================================================= */

  const getLocationParts = (area = "") => {
    if (!area || typeof area !== "string") {
      return { city: "", state: "" };
    }

    const parts = area
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    return {
      city: parts.length >= 2 ? parts[parts.length - 2] : parts[0] || "",
      state: parts.length >= 1 ? parts[parts.length - 1] : "",
    };
  };

  /* =======================================================
     STATES
  ======================================================= */

  const states = useMemo(() => {
    return [
      ...new Set(
        doctors
          .map((doctor) => getLocationParts(doctor.area || doctor.location).state)
          .filter(Boolean)
      ),
    ].sort();
  }, [doctors]);

  /* =======================================================
     CITIES
  ======================================================= */

  const cities = useMemo(() => {
    return [
      ...new Set(
        doctors
          .filter((doctor) => {
            if (!selectedState) return true;

            return (
              getLocationParts(doctor.area || doctor.location).state === selectedState
            );
          })
          .map((doctor) => getLocationParts(doctor.area || doctor.location).city)
          .filter(Boolean)
      ),
    ].sort();
  }, [doctors, selectedState]);

  /* =======================================================
     FILTER DOCTORS
  ======================================================= */

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const location = getLocationParts(doctor.area || doctor.location);

      const doctorText = `
        ${doctor.name || ""}
        ${doctor.area || doctor.location || ""}
        ${doctor.address || ""}
      `.toLowerCase();

      /* SEARCH */

      const matchesSearch = doctorText.includes(
        search.trim().toLowerCase()
      );

      /* STATE */

      const matchesState =
        !selectedState || location.state === selectedState;

      /* CITY */

      const matchesCity =
        !selectedCity || location.city === selectedCity;

      /* PRICE */

      const validPrices = [doctor.videoPrice, doctor.clinicPrice]
        .map(Number)
        .filter((val) => !isNaN(val) && val > 0);

      const minPrice = validPrices.length ? Math.min(...validPrices) : 0;
      const maxPrice = validPrices.length ? Math.max(...validPrices) : 0;

      let matchesPrice = true;

      if (selectedPrice === "under400") {
        matchesPrice = minPrice > 0 && minPrice < 400;
      }

      if (selectedPrice === "400-600") {
        matchesPrice = minPrice <= 600 && maxPrice >= 400;
      }

      if (selectedPrice === "above600") {
        matchesPrice = maxPrice > 600;
      }

      /* RATING */

      const rating = Number(doctor.rating || 0);

      let matchesRating = true;

      if (selectedRating) {
        matchesRating = rating >= Number(selectedRating);
      }

      /* VERIFIED */

      const matchesVerified =
        !verifiedOnly || doctor.verified === true;

      /* VIDEO */

      const matchesVideo =
        !videoOnly || doctor.videoAvailable === true;

      return (
        matchesSearch &&
        matchesState &&
        matchesCity &&
        matchesPrice &&
        matchesRating &&
        matchesVerified &&
        matchesVideo
      );
    });
  }, [
    doctors,
    search,
    selectedState,
    selectedCity,
    selectedPrice,
    selectedRating,
    verifiedOnly,
    videoOnly,
  ]);

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSearch("");
    setSelectedState("");
    setSelectedCity("");
    setSelectedPrice("");
    setSelectedRating("");
    setVerifiedOnly(false);
    setVideoOnly(false);
  };

  return (
    <div className="booked-page">

      {/* ===================================================
          HERO
      =================================================== */}

      <section className="booked-hero">

        <div className="hero-glow hero-glow-one"></div>
        <div className="hero-glow hero-glow-two"></div>

        <div className="booked-container">

          <div className="vet-badge">
            <Stethoscope size={15} />
            ZENVE VET CARE
          </div>

          <h1>
            Book nearby doctors for your pet
            <br />
            — video call or clinic visit
          </h1>

          <p className="hero-description">
            Verified pet clinics across every Indian state.
            Online consultation, in-clinic visits,
            ratings, contact numbers and directions.
            More clinics added regularly as our network grows.
          </p>

          <div style={{ marginTop: "18px", marginBottom: "22px" }}>
            <Link to="/video-consultations" className="booked-top-vc-btn">
              <Video size={16} />
              <span>View My Video Consultations & Appointments →</span>
            </Link>
          </div>

          <div className="feature-list">

            <Feature
              icon={<ShieldCheck />}
              text="Verified doctors"
            />

            <Feature
              icon={<Video />}
              text="Video consult available"
            />

            <Feature
              icon={<Clock3 />}
              text="Same-day slots"
            />

            <Feature
              icon={<Send />}
              text="Maps directions"
            />

          </div>

        </div>
      </section>

      {/* ===================================================
          SEARCH
      =================================================== */}

      <section className="search-section">

        <div className="booked-container">

          {/* SEARCH BOX */}

          <div className="search-box">

            <Search size={20} />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clinic, doctor, area or city..."
            />

            <button type="button">
              Find
            </button>

          </div>

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="filter-list">

            {/* STATE */}

            <select
              className="filter-pill dropdown"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity("");
              }}
            >
              <option value="">All states</option>

              {states.map((state) => (
                <option
                  key={state}
                  value={state}
                >
                  {state}
                </option>
              ))}
            </select>

            {/* CITY */}

            <select
              className="filter-pill dropdown"
              value={selectedCity}
              onChange={(e) =>
                setSelectedCity(e.target.value)
              }
            >
              <option value="">All cities</option>

              {cities.map((city) => (
                <option
                  key={city}
                  value={city}
                >
                  {city}
                </option>
              ))}
            </select>

            {/* PRICE */}

            <select
              className="filter-pill dropdown"
              value={selectedPrice}
              onChange={(e) =>
                setSelectedPrice(e.target.value)
              }
            >
              <option value="">Any price</option>
              <option value="under400">
                Under ₹400
              </option>
              <option value="400-600">
                ₹400 - ₹600
              </option>
              <option value="above600">
                Above ₹600
              </option>
            </select>

            {/* RATING */}

            <select
              className="filter-pill dropdown"
              value={selectedRating}
              onChange={(e) =>
                setSelectedRating(e.target.value)
              }
            >
              <option value="">Any rating</option>
              <option value="4">
                4.0+
              </option>
              <option value="4.5">
                4.5+
              </option>
              <option value="5">
                5.0+
              </option>
            </select>

            {/* VIDEO */}

            <button
              type="button"
              className={`filter-pill ${videoOnly ? "active-purple" : ""
                }`}
              onClick={() =>
                setVideoOnly((prev) => !prev)
              }
            >
              <Video size={15} />
              Video consult
            </button>

            {/* VERIFIED */}

            <button
              type="button"
              className={`filter-pill verified ${verifiedOnly ? "active-red" : ""
                }`}
              onClick={() =>
                setVerifiedOnly((prev) => !prev)
              }
            >
              <ShieldCheck size={15} />
              Verified only
            </button>

            {/* CLEAR */}

            {(search ||
              selectedState ||
              selectedCity ||
              selectedPrice ||
              selectedRating ||
              verifiedOnly ||
              videoOnly) && (
                <button
                  type="button"
                  className="filter-pill clear-filter"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              )}

          </div>

        </div>

      </section>

      {/* ===================================================
          DOCTORS
      =================================================== */}

      <main className="doctors-section">

        <div className="booked-container">

          <div className="results-heading">

            <h2>
              Showing {filteredDoctors.length} doctors near you
            </h2>

            <span>
              {filteredDoctors.length} results
            </span>

          </div>

          {loading ? (
            <div className="no-results">
              <Stethoscope size={42} />
              <h3>Loading doctors...</h3>
              <p>Fetching verified pet doctors and clinics.</p>
            </div>
          ) : filteredDoctors.length > 0 ? (

            <div className="doctor-grid">

              {filteredDoctors.map((doctor, index) => (
                <DoctorCard
                  key={doctor.id || `${doctor.name}-${index}`}
                  doctor={doctor}
                  onBook={handleOpenBooking}
                />
              ))}

            </div>

          ) : (

            <div className="no-results">

              <Stethoscope size={42} />

              <h3>
                No doctors found
              </h3>

              <p>
                {doctors.length === 0
                  ? "No doctors or clinics are available at the moment."
                  : "Try changing your state, city, price or rating filter."}
              </p>

              {(search ||
                selectedState ||
                selectedCity ||
                selectedPrice ||
                selectedRating ||
                verifiedOnly ||
                videoOnly) && (
                <button
                  type="button"
                  onClick={clearFilters}
                >
                  Clear all filters
                </button>
              )}

            </div>

          )}

        </div>

      </main>

      {/* ===================================================
          BOOKING MODAL
      =================================================== */}
      {bookingDoctor && (
        <div className="booking-modal-overlay" onClick={handleCloseBooking}>
          <div className="booking-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseBooking} type="button" aria-label="Close">
              <X size={20} />
            </button>

            {bookingSuccess ? (
              <div className="booking-success-view">
                <div className="success-icon-wrap">
                  <CheckCircle2 size={54} color="#10b981" />
                </div>
                <h3>Appointment Confirmed!</h3>
                <p className="success-subtitle">
                  Your appointment with <strong>{bookingSuccess.doctor_name || bookingDoctor.name}</strong> has been booked successfully.
                </p>

                <div className="success-details-card">
                  <div className="success-row">
                    <span>Booking ID:</span>
                    <strong>#{bookingSuccess.booking_id}</strong>
                  </div>
                  <div className="success-row">
                    <span>Consultation Type:</span>
                    <strong>{bookingSuccess.appointment_type || bookingType}</strong>
                  </div>
                  <div className="success-row">
                    <span>Date & Time:</span>
                    <strong>{bookingSuccess.appointment_date} at {bookingSuccess.appointment_time}</strong>
                  </div>
                  <div className="success-row">
                    <span>Pet Name:</span>
                    <strong>{petName}</strong>
                  </div>
                  <div className="success-row">
                    <span>Clinic / Doctor:</span>
                    <strong>{bookingDoctor.clinic_hospital || bookingDoctor.clinic_name || bookingDoctor.name}</strong>
                  </div>
                  <div className="success-row">
                    <span>Location:</span>
                    <span>{bookingDoctor.address}</span>
                  </div>
                </div>

                {Boolean(bookingSuccess.meeting_link || bookingSuccess.is_video || (bookingSuccess.appointment_type || bookingType) === "Video Call") && (
                  <div className="modal-video-card">
                    <div className="modal-video-header">
                      <div className="modal-video-icon">
                        <Video size={20} />
                      </div>
                      <div>
                        <h4>Video Consultation Meeting Room Ready!</h4>
                        <p>Join directly using this link when consultation starts.</p>
                      </div>
                    </div>

                    <div className="modal-video-link-row">
                      <input
                        type="text"
                        readOnly
                        value={bookingSuccess.meeting_link || `https://meet.jit.si/ZenveConsult-${bookingSuccess.booking_id}`}
                        className="modal-video-input"
                      />
                      <button
                        type="button"
                        className="modal-copy-link-btn"
                        onClick={() => {
                          const link = bookingSuccess.meeting_link || `https://meet.jit.si/ZenveConsult-${bookingSuccess.booking_id}`;
                          navigator.clipboard.writeText(link);
                          setCopiedMeeting(true);
                          setTimeout(() => setCopiedMeeting(false), 2500);
                        }}
                      >
                        <Copy size={14} />
                        <span>{copiedMeeting ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>

                    <div className="modal-video-actions">
                      <a
                        href={bookingSuccess.meeting_link || `https://meet.jit.si/ZenveConsult-${bookingSuccess.booking_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-join-btn"
                      >
                        <Video size={16} /> Join Video Meeting Now <ExternalLink size={14} />
                      </a>
                      <Link
                        to="/video-consultations"
                        className="modal-all-consults-btn"
                        onClick={handleCloseBooking}
                      >
                        <Calendar size={15} /> View in My Appointments
                      </Link>
                    </div>
                  </div>
                )}

                <div className="modal-actions" style={{ marginTop: "24px" }}>
                  {bookingDoctor.phone && (
                    <a href={`tel:${bookingDoctor.phone}`} className="modal-call-btn">
                      <Phone size={16} /> Call Clinic ({bookingDoctor.phone})
                    </a>
                  )}
                  <button type="button" className="modal-done-btn" onClick={handleCloseBooking}>
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookSubmit} className="booking-form">
                <div className="modal-header">
                  <div className="modal-doctor-badge">
                    <Stethoscope size={18} />
                    <span>ZENVE BOOK A VET</span>
                  </div>
                  <h2>Book with {bookingDoctor.name}</h2>
                  <p className="modal-clinic-desc">
                    {bookingDoctor.clinic_hospital || "Zenve Partner Pet Clinic"} • {bookingDoctor.area}, {bookingDoctor.city}
                  </p>
                </div>

                {bookingError && (
                  <div className="booking-error-banner">
                    <AlertCircle size={18} />
                    <span>{bookingError}</span>
                  </div>
                )}

                {/* Consultation Type Selector */}
                <div className="booking-type-toggle">
                  <button
                    type="button"
                    className={`toggle-btn ${bookingType === "In Clinic" ? "active" : ""}`}
                    onClick={() => setBookingType("In Clinic")}
                  >
                    <CalendarCheck size={16} />
                    <span>In-Clinic Visit</span>
                    <strong className="toggle-price">₹{bookingDoctor.clinicPrice || 500}</strong>
                  </button>
                  {bookingDoctor.videoAvailable && (
                    <button
                      type="button"
                      className={`toggle-btn ${bookingType === "Video Call" ? "active" : ""}`}
                      onClick={() => setBookingType("Video Call")}
                    >
                      <Video size={16} />
                      <span>Video Consult</span>
                      <strong className="toggle-price">₹{bookingDoctor.videoPrice || 400}</strong>
                    </button>
                  )}
                </div>

                {/* Date and Time Slot */}
                <div className="form-group-row">
                  <div className="form-group">
                    <label>
                      <Calendar size={14} /> Appointment Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Clock3 size={14} /> Available Time Slot
                    </label>
                    <select
                      value={bookingSlot}
                      onChange={(e) => setBookingSlot(e.target.value)}
                      required
                    >
                      {(bookingDoctor.available_slots || [
                        "09:30 AM", "10:30 AM", "11:30 AM", "02:00 PM", "04:00 PM", "05:30 PM", "07:00 PM"
                      ]).map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pet Name & Parent Name */}
                <div className="form-group-row">
                  <div className="form-group">
                    <label>
                      <User size={14} /> Pet's Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bruno, Bella"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Pet Parent Name</label>
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Parent Phone & Reason */}
                <div className="form-group-row">
                  <div className="form-group">
                    <label>
                      <Phone size={14} /> Contact Phone *
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Reason for Visit</label>
                    <input
                      type="text"
                      placeholder="e.g. Vaccination, Fever, Checkup"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-submit-row">
                  <button
                    type="submit"
                    className="confirm-booking-btn"
                    disabled={submittingBooking}
                  >
                    {submittingBooking ? "Confirming..." : `Confirm Booking • ₹${bookingType === "Video Call" ? (bookingDoctor.videoPrice || 400) : (bookingDoctor.clinicPrice || 500)}`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

/* =========================================================
   FEATURE COMPONENT
========================================================= */

const Feature = ({ icon, text }) => (
  <div className="feature-pill">

    {React.cloneElement(icon, {
      size: 15,
    })}

    <span>
      {text}
    </span>

  </div>
);

/* =========================================================
   DOCTOR CARD
========================================================= */

const DoctorCard = ({ doctor, onBook }) => {

  const videoPrice = doctor.videoPrice;
  const clinicPrice = doctor.clinicPrice;

  return (
    <article className="doctor-card">

      {/* ICON / AVATAR */}

      <div className="doctor-icon">
        {doctor.profile_image ? (
          <img
            src={doctor.profile_image}
            alt={doctor.name}
            style={{ width: "100%", height: "100%", borderRadius: "14px", objectFit: "cover" }}
          />
        ) : (
          <Stethoscope size={24} />
        )}
      </div>

      {/* NAME */}

      <h3>
        {doctor.name}
      </h3>

      {/* SPECIALITY & QUALIFICATION */}
      {(doctor.speciality || doctor.qualification) && (
        <div
          className="doctor-speciality"
          style={{
            fontSize: "12px",
            color: "#64258e",
            fontWeight: "700",
            marginBottom: "8px",
            textTransform: "capitalize",
          }}
        >
          {doctor.speciality || "Veterinarian"}
          {doctor.qualification ? ` • ${doctor.qualification}` : ""}
          {doctor.experience ? ` • ${doctor.experience}+ yrs` : ""}
        </div>
      )}

      {/* CLINIC */}
      {doctor.clinic_hospital && (
        <div
          className="doctor-clinic"
          style={{
            fontSize: "12px",
            color: "#473d55",
            fontWeight: "600",
            marginBottom: "8px",
          }}
        >
          🏥 {doctor.clinic_hospital}
        </div>
      )}

      {/* LOCATION */}

      {(doctor.area || doctor.location) && (
        <div className="doctor-location">
          <MapPin size={15} />
          {doctor.area || doctor.location}
        </div>
      )}

      {/* RATING */}

      <div className="doctor-rating">

        <Star
          size={15}
          fill="currentColor"
        />

        <strong>
          {doctor.rating ?? "—"}
        </strong>

        {doctor.reviews ? (
          <span>
            ({doctor.reviews})
          </span>
        ) : null}

        {/* VERIFIED */}

        {doctor.verified && (
          <span className="verified">

            <ShieldCheck size={13} />

            Verified

          </span>
        )}

        {/* VIDEO */}

        {doctor.videoAvailable && (
          <span className="video-tag">

            <Video size={13} />

            Video call

          </span>
        )}

      </div>

      {/* ADDRESS */}

      {doctor.address && (
        <p className="doctor-address">
          {doctor.address}
        </p>
      )}

      {/* PRICE */}

      {(videoPrice != null || clinicPrice != null) && (
        <div className="price-row">

          {videoPrice != null && (
            <div>
              <span>
                Video
              </span>
              <strong>
                ₹{videoPrice}
              </strong>
            </div>
          )}

          {clinicPrice != null && (
            <div>
              <span>
                Clinic visit
              </span>
              <strong>
                ₹{clinicPrice}
              </strong>
            </div>
          )}

        </div>
      )}

      {/* ACTIONS */}

      <div className="card-actions">

        {doctor.videoAvailable && (
          <button
            type="button"
            className="video-button"
            onClick={() => onBook?.(doctor, "Video Call")}
          >
            <Video size={15} />
            Video consult
          </button>
        )}

        <button
          type="button"
          className="book-button"
          onClick={() => onBook?.(doctor, "In Clinic")}
        >
          <CalendarCheck size={15} />
          Book visit
        </button>

      </div>

      {/* CONTACT */}

      {(doctor.phone || doctor.map || doctor.site) && (
        <div className="contact-row">

          {doctor.phone && (
            <a href={`tel:${doctor.phone}`}>
              <Phone size={14} />
              Call
            </a>
          )}

          {doctor.map && (
            <a
              href={doctor.map}
              target="_blank"
              rel="noreferrer"
            >
              <MapPin size={14} />
              Maps
            </a>
          )}

          {doctor.site && (
            <a
              href={doctor.site}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={14} />
              Site
            </a>
          )}

        </div>
      )}

    </article>
  );
};

export default Booked;