import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import api from "../api/api";
import "../styles/VideoConsultations.css";

const VideoConsultations = () => {
  const navigate = useNavigate();
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
  }, []);

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
    const link = appointment.meeting_link || `https://meet.jit.si/ZenveConsult-${appointment.id}`;
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
              const meetingLink =
                app.meeting_link || `https://meet.jit.si/ZenveConsult-${app.id}`;

              return (
                <div
                  key={app.id}
                  className={`vc-card ${isUpcoming ? "is-upcoming" : "is-completed"} ${
                    isVideo ? "is-video-card" : ""
                  }`}
                >
                  {/* CARD HEADER */}
                  <div className="vc-card-top">
                    <div className="vc-doctor-profile">
                      <div className="vc-avatar">
                        {app.profile_image ? (
                          <img src={app.profile_image} alt={app.doctor_name} />
                        ) : (
                          <div className="vc-avatar-placeholder">
                            <Stethoscope size={22} />
                          </div>
                        )}
                        {isVideo && (
                          <span className="vc-avatar-badge" title="Video Enabled">
                            <Video size={12} />
                          </span>
                        )}
                      </div>

                      <div className="vc-doctor-meta">
                        <h3 className="vc-doctor-name">{app.doctor_name}</h3>
                        <p className="vc-doctor-spec">{app.speciality || "Veterinary Surgeon"}</p>
                        <p className="vc-clinic-name">
                          <MapPin size={13} />
                          <span>{app.clinic_hospital || "Zenve Partner Pet Clinic"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="vc-card-badges">
                      {isVideo ? (
                        <span className="vc-badge video-badge">
                          <Video size={13} />
                          <span>Video Consult</span>
                        </span>
                      ) : (
                        <span className="vc-badge clinic-badge">
                          <Calendar size={13} />
                          <span>In Clinic</span>
                        </span>
                      )}

                      <span
                        className={`vc-badge status-badge ${
                          isUpcoming ? "status-confirmed" : "status-completed"
                        }`}
                      >
                        {isUpcoming ? (
                          <>
                            <span className="pulse-dot" />
                            Confirmed
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={13} />
                            Completed
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* APPOINTMENT DETAILS */}
                  <div className="vc-details-box">
                    <div className="vc-detail-item">
                      <Calendar size={16} className="detail-icon" />
                      <div>
                        <span className="detail-label">Consultation Date</span>
                        <strong className="detail-value">{app.appointment_date}</strong>
                      </div>
                    </div>

                    <div className="vc-detail-item">
                      <Clock size={16} className="detail-icon" />
                      <div>
                        <span className="detail-label">Scheduled Time</span>
                        <strong className="detail-value">{app.appointment_time}</strong>
                      </div>
                    </div>

                    <div className="vc-detail-item">
                      <User size={16} className="detail-icon" />
                      <div>
                        <span className="detail-label">Pet & Parent</span>
                        <strong className="detail-value">
                          {app.pet_name} • {app.parent_name}
                        </strong>
                      </div>
                    </div>

                    {app.doctor_phone && (
                      <div className="vc-detail-item">
                        <Phone size={16} className="detail-icon" />
                        <div>
                          <span className="detail-label">Clinic Contact</span>
                          <strong className="detail-value">{app.doctor_phone}</strong>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* REASON / SYMPTOMS */}
                  {app.reason && (
                    <div className="vc-reason-strip">
                      <span className="reason-label">Concern / Symptoms:</span>
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
                          <h4>
                            {isUpcoming
                              ? "Live Video Consultation Link Ready"
                              : "Consultation Video Room"}
                          </h4>
                          <p>
                            Both you and Dr. {app.doctor_name} connect to this secure link.
                          </p>
                        </div>
                      </div>

                      {/* MEETING LINK DISPLAY */}
                      <div className="vc-meeting-link-bar">
                        <input
                          type="text"
                          readOnly
                          value={meetingLink}
                          className="vc-meeting-link-input"
                        />
                        <button
                          type="button"
                          className="vc-copy-btn"
                          onClick={() => handleCopyLink(app)}
                          title="Copy meeting link"
                        >
                          <Copy size={15} />
                          <span>{copiedId === app.id ? "Copied!" : "Copy Link"}</span>
                        </button>
                      </div>

                      {/* MEETING ACTIONS */}
                      <div className="vc-meeting-actions">
                        <a
                          href={meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="vc-btn-connect"
                        >
                          <Video size={17} />
                          <span>Join Video Meeting (New Tab)</span>
                          <ExternalLink size={15} />
                        </a>

                        <button
                          type="button"
                          className="vc-btn-inapp"
                          onClick={() => setActiveMeeting(app)}
                        >
                          <Maximize2 size={16} />
                          <span>Connect In App</span>
                        </button>
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
                        <CheckCircle2 size={16} />
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
                        <RefreshCw size={15} />
                        <span>Book Follow-Up</span>
                      </button>
                    )}

                    {app.doctor_phone && (
                      <a href={`tel:${app.doctor_phone}`} className="vc-footer-btn call">
                        <Phone size={15} />
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

      {/* IN-APP INTERACTIVE VIDEO CALL MODAL */}
      {activeMeeting && (
        <div className="vc-modal-overlay">
          <div className="vc-modal-dialog">
            <div className="vc-modal-header">
              <div className="vc-modal-meta">
                <div className="vc-modal-badge">
                  <span className="live-dot" />
                  <span>LIVE CONSULTATION</span>
                </div>
                <h3>
                  Video Call with {activeMeeting.doctor_name} • Pet: {activeMeeting.pet_name}
                </h3>
              </div>
              <div className="vc-modal-header-actions">
                <a
                  href={activeMeeting.meeting_link || `https://meet.jit.si/ZenveConsult-${activeMeeting.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vc-modal-newtab-btn"
                  title="Open in Full Window"
                >
                  <ExternalLink size={16} />
                  <span>Open Full Window</span>
                </a>
                <button
                  type="button"
                  className="vc-modal-close-btn"
                  onClick={() => setActiveMeeting(null)}
                  title="Close Video Window"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="vc-iframe-wrapper">
              <iframe
                src={activeMeeting.meeting_link || `https://meet.jit.si/ZenveConsult-${activeMeeting.id}`}
                title={`Video Meeting with ${activeMeeting.doctor_name}`}
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                className="vc-meeting-iframe"
              />
            </div>

            <div className="vc-modal-footer">
              <span>
                🔒 Encrypted Consultation Room • Zenve Pet Telehealth
              </span>
              <button
                type="button"
                className="vc-modal-hangup-btn"
                onClick={() => setActiveMeeting(null)}
              >
                Leave Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConsultations;

