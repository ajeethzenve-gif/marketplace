import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Video,
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Lock,
  FileText,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Search,
  Filter,
  Maximize2,
  X,
  Stethoscope,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

// Get the official Twilio telehealth video room link
const getDoctorTelehealthUrl = (appointment) => {
  if (appointment?.meeting_link && !appointment.meeting_link.includes("localhost")) {
    return appointment.meeting_link;
  }
  const roomCode = appointment?.room_code || `ZenveTelehealth-${appointment?.doctor_id || 1}-${appointment?.id || 1}`;
  return `https://video.twilio.com/rooms/${encodeURIComponent(roomCode)}`;
};

// Format doctor name cleanly without duplicate 'Dr.'
const formatDoctorName = (name) => {
  if (!name) return "Dr. Veterinarian";
  const cleaned = name.trim().replace(/^(Dr\.?\s*)+/i, "");
  return `Dr. ${cleaned}`;
};

// Format time to clean 12-hour AM/PM format
const formatTime12h = (timeStr) => {
  if (!timeStr) return "--:--";
  const trimmed = timeStr.trim();
  if (/am|pm/i.test(trimmed)) return trimmed;
  const match = trimmed.match(/^(\d{1,2}):(\d{2})/);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const padHour = String(hours).padStart(2, "0");
    return `${padHour}:${minutes} ${ampm}`;
  }
  return timeStr;
};

// Format friendly date (e.g. 'Thu, 05 Nov 2026')
const formatDateDisplay = (dateStr) => {
  if (!dateStr) return "";
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "2-digit",
          year: "numeric",
        });
      }
    }
    return dateStr;
  } catch (e) {
    return dateStr;
  }
};
import api from "../api/api";
import TwilioConsultationRoom from "../components/video/TwilioConsultationRoom";
import "../styles/VideoConsultations.css";

const VideoConsultations = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming"); // 'all' | 'upcoming' | 'completed'
  const [videoOnly, setVideoOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // In-app video meeting modal state
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
    const roomParam = searchParams.get('room') || searchParams.get('join');
    if (roomParam) {
      setActiveMeeting({
        room_code: roomParam,
        doctor_name: 'Attending Veterinarian',
        parent_name: 'Pet Parent',
        reason: 'Telehealth Consultation',
      });
    }
  }, [searchParams]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("doctors/appointments/");
      const data = res.data?.results || res.data || [];
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("Unable to load consultations. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (appointment) => {
    const link = getDoctorTelehealthUrl(appointment);
    navigator.clipboard.writeText(link);
    setCopiedId(appointment.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  const handleMarkCompleted = async (appointmentId) => {
    try {
      setUpdatingId(appointmentId);
      await api.post(`doctors/appointments/${appointmentId}/status/`, {
        status: "Completed",
      });
      // Refresh local list
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId
            ? { ...app, status: "Completed", category: "completed" }
            : app
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Could not update appointment status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      // Tab filter
      if (activeTab === "upcoming" && app.category !== "upcoming") return false;
      if (activeTab === "completed" && app.category !== "completed") return false;

      // Video-only filter
      if (videoOnly && !app.is_video) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const searchTarget = `
          ${app.doctor_name || ""}
          ${app.pet_name || ""}
          ${app.parent_name || ""}
          ${app.clinic_hospital || ""}
          ${app.reason || ""}
          ${app.appointment_type || ""}
        `.toLowerCase();
        if (!searchTarget.includes(query)) return false;
      }

      return true;
    });
  }, [appointments, activeTab, videoOnly, searchQuery]);

  // Statistics
  const upcomingCount = useMemo(
    () => appointments.filter((a) => a.category === "upcoming").length,
    [appointments]
  );
  const completedCount = useMemo(
    () => appointments.filter((a) => a.category === "completed").length,
    [appointments]
  );
  const videoCount = useMemo(
    () => appointments.filter((a) => a.is_video).length,
    [appointments]
  );

  return (
    <div className="vc-page">
      {/* HERO SECTION */}
      <section className="vc-hero">
        <div className="vc-hero-glow glow-1" />
        <div className="vc-hero-glow glow-2" />
        <div className="vc-container">
          <div className="vc-hero-badge">
            <Video size={16} className="vc-pulse-icon" />
            <span>ZENVE VET TELEHEALTH</span>
          </div>

          <h1 className="vc-hero-title">
            Video Consultations & <span>Appointments</span>
          </h1>

          <p className="vc-hero-desc">
            Connect live with licensed veterinarians via secure HD video meetings, review
            upcoming schedules, and manage completed pet care consultations all in one place.
          </p>

          <div className="vc-hero-actions">
            <Link to="/vet-booked" className="vc-hero-btn primary">
              <Stethoscope size={18} />
              <span>Book New Video Consult</span>
            </Link>
            <button
              type="button"
              className="vc-hero-btn secondary"
              onClick={fetchAppointments}
              disabled={loading}
            >
              <RefreshCw size={17} className={loading ? "spin" : ""} />
              <span>Refresh Schedule</span>
            </button>
          </div>
        </div>
      </section>

      {/* STATS OVERVIEW */}
      <section className="vc-stats-section">
        <div className="vc-container">
          <div className="vc-stats-grid">
            <div className="vc-stat-card" onClick={() => setActiveTab("upcoming")}>
              <div className="vc-stat-icon-wrap upcoming-icon">
                <Video size={22} />
              </div>
              <div className="vc-stat-info">
                <span className="vc-stat-number">{upcomingCount}</span>
                <span className="vc-stat-label">Upcoming Consultations</span>
              </div>
              <span className="vc-stat-badge live">Live Ready</span>
            </div>

            <div className="vc-stat-card" onClick={() => setActiveTab("completed")}>
              <div className="vc-stat-icon-wrap completed-icon">
                <CheckCircle2 size={22} />
              </div>
              <div className="vc-stat-info">
                <span className="vc-stat-number">{completedCount}</span>
                <span className="vc-stat-label">Completed Consultations</span>
              </div>
              <span className="vc-stat-badge done">Archived</span>
            </div>

            <div className="vc-stat-card" onClick={() => { setActiveTab("all"); setVideoOnly(true); }}>
              <div className="vc-stat-icon-wrap video-icon">
                <Sparkles size={22} />
              </div>
              <div className="vc-stat-info">
                <span className="vc-stat-number">{videoCount}</span>
                <span className="vc-stat-label">Video Consults Total</span>
              </div>
              <span className="vc-stat-badge video">Instant Link</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <div className="vc-container vc-main-content">
        {/* CONTROLS BAR: TABS & SEARCH */}
        <div className="vc-controls-card">
          <div className="vc-tabs">
            <button
              type="button"
              className={`vc-tab ${activeTab === "upcoming" ? "active" : ""}`}
              onClick={() => setActiveTab("upcoming")}
            >
              <span className="vc-tab-dot live-dot" />
              <span>Upcoming</span>
              <span className="vc-tab-count">{upcomingCount}</span>
            </button>

            <button
              type="button"
              className={`vc-tab ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => setActiveTab("completed")}
            >
              <CheckCircle2 size={16} />
              <span>Completed</span>
              <span className="vc-tab-count">{completedCount}</span>
            </button>

            <button
              type="button"
              className={`vc-tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              <Calendar size={16} />
              <span>All Consultations</span>
              <span className="vc-tab-count">{appointments.length}</span>
            </button>
          </div>

          <div className="vc-filters-row">
            {/* SEARCH */}
            <div className="vc-search-wrap">
              <Search size={16} className="vc-search-icon" />
              <input
                type="text"
                placeholder="Search by doctor, pet name, reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="vc-clear-search"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* VIDEO TOGGLE */}
            <label className={`vc-toggle-pill ${videoOnly ? "checked" : ""}`}>
              <input
                type="checkbox"
                checked={videoOnly}
                onChange={(e) => setVideoOnly(e.target.checked)}
              />
              <Video size={15} />
              <span>Video Consults Only</span>
            </label>
          </div>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="vc-error-banner">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button type="button" onClick={fetchAppointments}>
              Retry
            </button>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="vc-loading-state">
            <div className="vc-spinner" />
            <p>Loading your appointments & video consultations...</p>
          </div>
        )}

        {/* APPOINTMENTS LIST */}
        {!loading && filteredAppointments.length > 0 && (
          <div className="vc-cards-grid">
            {filteredAppointments.map((app) => {
              const isUpcoming = app.category === "upcoming";
              const isVideo = app.is_video;
              const meetingLink = getDoctorTelehealthUrl(app);
              const docName = formatDoctorName(app.doctor_name);
              const formattedDate = formatDateDisplay(app.appointment_date);
              const formattedTime = formatTime12h(app.appointment_time);
              const roomCodeDisplay = app.room_code || `ZenveConsult-${app.id}`;

              return (
                <div
                  key={app.id}
                  className={`vc-card ${isUpcoming ? "is-upcoming" : "is-completed"} ${isVideo ? "is-video-card" : ""
                    }`}
                >
                  {/* CARD TOP / DOCTOR PROFILE */}
                  <div className="vc-card-top">
                    <div className="vc-doctor-profile">
                      <div className="vc-avatar">
                        {app.profile_image ? (
                          <img src={app.profile_image} alt={docName} />
                        ) : (
                          <div className="vc-avatar-placeholder">
                            <Stethoscope size={22} />
                          </div>
                        )}
                        {isVideo && (
                          <span className="vc-avatar-badge" title="HD Video Telehealth Ready">
                            <Video size={11} />
                          </span>
                        )}
                      </div>

                      <div className="vc-doctor-meta">
                        <div className="vc-doctor-name-row">
                          <h3 className="vc-doctor-name">{docName}</h3>
                          <span className="vc-verified-badge" title="Verified Veterinary Specialist">
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                              <circle cx="12" cy="12" r="10" fill="#3b82f6" />
                              <path d="M7.5 12l3 3 6-6" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                        <p className="vc-doctor-spec">{app.speciality || "Chief Veterinary Surgeon & Telehealth Specialist"}</p>
                        <p className="vc-clinic-name">
                          <MapPin size={12} className="vc-clinic-icon" />
                          <span>{app.clinic_hospital || "Zenve Central Veterinary Clinic"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="vc-card-badges">
                      {isVideo ? (
                        <span className="vc-badge video-badge">
                          <Video size={12} />
                          <span>Video Consult</span>
                        </span>
                      ) : (
                        <span className="vc-badge clinic-badge">
                          <Calendar size={12} />
                          <span>In Clinic</span>
                        </span>
                      )}

                      <span
                        className={`vc-badge status-badge ${isUpcoming ? "status-confirmed" : "status-completed"
                          }`}
                      >
                        {isUpcoming ? (
                          <>
                            <span className="pulse-dot" />
                            <span>Confirmed</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={12} />
                            <span>Completed</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* APPOINTMENT DETAILS 4-ITEM GRID */}
                  <div className="vc-details-box">
                    <div className="vc-detail-item">
                      <div className="vc-detail-icon-wrap">
                        <Calendar size={15} />
                      </div>
                      <div className="vc-detail-content">
                        <span className="detail-label">Date</span>
                        <strong className="detail-value">{formattedDate}</strong>
                      </div>
                    </div>

                    <div className="vc-detail-item">
                      <div className="vc-detail-icon-wrap">
                        <Clock size={15} />
                      </div>
                      <div className="vc-detail-content">
                        <span className="detail-label">Time</span>
                        <strong className="detail-value">{formattedTime}</strong>
                      </div>
                    </div>

                    <div className="vc-detail-item">
                      <div className="vc-detail-icon-wrap">
                        <User size={15} />
                      </div>
                      <div className="vc-detail-content">
                        <span className="detail-label">Pet & Parent</span>
                        <strong className="detail-value">
                          {app.pet_name} <span className="vc-bullet">•</span> {app.parent_name}
                        </strong>
                      </div>
                    </div>

                    <div className="vc-detail-item">
                      <div className="vc-detail-icon-wrap">
                        <Phone size={15} />
                      </div>
                      <div className="vc-detail-content">
                        <span className="detail-label">Clinic Contact</span>
                        <strong className="detail-value">{app.doctor_phone || "+91 90803 41343"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* CHIEF CONCERN / SYMPTOMS CALLOUT */}
                  {app.reason && (
                    <div className="vc-reason-strip">
                      <span className="reason-label-badge">
                        <FileText size={12} />
                        <span>Concern</span>
                      </span>
                      <span className="reason-text">{app.reason}</span>
                    </div>
                  )}

                  {/* VIDEO CONSULTATION CONNECT BLOCK */}
                  {isVideo && (
                    <div className="vc-meeting-box">
                      <div className="vc-meeting-header">
                        <div className="vc-meeting-icon">
                          <Video size={18} />
                        </div>
                        <div className="vc-meeting-title">
                          <div className="vc-meeting-title-row">
                            <h4>
                              {isUpcoming
                                ? "Live Video Consultation Ready"
                                : "Consultation Video Room"}
                            </h4>
                            <span className="vc-encrypted-pill">
                              <Lock size={10} />
                              <span>Encrypted HD</span>
                            </span>
                          </div>
                          <p>
                            Both you and {docName} connect to this private consultation room.
                          </p>
                        </div>
                      </div>

                      {/* MEETING LINK DISPLAY */}
                      <div className="vc-meeting-link-bar">
                        <div className="vc-room-id-tag">
                          <span className="vc-room-prefix">ROOM</span>
                          <span className="vc-room-code">{roomCodeDisplay}</span>
                        </div>
                        <input
                          type="text"
                          readOnly
                          value={meetingLink}
                          className="vc-meeting-link-input"
                          title="Meeting URL"
                        />
                        <button
                          type="button"
                          className={`vc-copy-btn ${copiedId === app.id ? "is-copied" : ""}`}
                          onClick={() => handleCopyLink(app)}
                          title="Copy meeting link"
                        >
                          {copiedId === app.id ? (
                            <>
                              <Check size={13} />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* MEETING ACTIONS */}
                      <div className="vc-meeting-actions">
                        {/* Primary Hero Action */}
                        <button
                          type="button"
                          className="vc-btn-primary-connect"
                          onClick={() => setActiveMeeting(app)}
                        >
                          <Video size={17} />
                          <span>Join Twilio Video Consultation</span>
                          <Sparkles size={15} />
                        </button>

                        {/* Secondary Split Action Row */}
                        <div className="vc-secondary-actions-row">
                          <button
                            type="button"
                            className="vc-btn-inapp"
                            onClick={() => handleCopyLink(app)}
                          >
                            <Copy size={14} />
                            <span>{copiedId === app.id ? "Twilio Link Copied!" : "Copy Twilio Link"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CARD FOOTER ACTIONS */}
                  <div className="vc-card-footer">
                    {isUpcoming ? (
                      <button
                        type="button"
                        className="vc-footer-btn complete"
                        onClick={() => handleMarkCompleted(app.id)}
                        disabled={updatingId === app.id}
                      >
                        <CheckCircle2 size={15} />
                        <span>
                          {updatingId === app.id ? "Updating..." : "Mark as Completed"}
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="vc-footer-btn rebook"
                        onClick={() => navigate("/vet-booked")}
                      >
                        <RefreshCw size={14} />
                        <span>Book Follow-Up</span>
                      </button>
                    )}

                    {app.doctor_phone && (
                      <a href={`tel:${app.doctor_phone}`} className="vc-footer-btn call">
                        <Phone size={14} />
                        <span>Call Doctor</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredAppointments.length === 0 && (
          <div className="vc-empty-state">
            <div className="vc-empty-icon">
              <Video size={48} />
            </div>
            <h3>
              {activeTab === "upcoming"
                ? "No Upcoming Consultations"
                : activeTab === "completed"
                  ? "No Completed Consultations"
                  : "No Appointments Found"}
            </h3>
            <p>
              {activeTab === "upcoming"
                ? "You don't have any upcoming video or clinic appointments right now. Book an expert veterinary consultation in just 2 minutes!"
                : "Your appointment history will appear here once consultations are concluded."}
            </p>
            <Link to="/vet-booked" className="vc-empty-cta">
              <Stethoscope size={18} />
              <span>Book a Video Consultation</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>

      {/* IN-APP TWILIO VIDEO CALL MODAL */}
      {activeMeeting && (
        <div className="vc-modal-overlay vc-modal-fullscreen">
          <div className="vc-modal-dialog vc-dialog-fullscreen">
            <TwilioConsultationRoom
              roomName={
                activeMeeting.room_code ||
                `ZenveTelehealth-${activeMeeting.doctor_id || 1}-${activeMeeting.id}`
              }
              identity={`PetParent-${activeMeeting.parent_name || "Parent"}`}
              displayName={activeMeeting.parent_name || "Pet Parent"}
              role="patient"
              patientName={
                activeMeeting.pet_name
                  ? `${activeMeeting.pet_name} (${activeMeeting.parent_name || "Parent"})`
                  : activeMeeting.parent_name || "Pet Parent"
              }
              doctorName={formatDoctorName(activeMeeting.doctor_name)}
              reason={activeMeeting.reason || "Virtual Veterinary Consultation"}
              onLeave={() => setActiveMeeting(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConsultations;

