import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import {
    FaTimes,
    FaCheckCircle,
    FaExclamationTriangle,
    FaInfoCircle,
    FaThumbsUp,
    FaThumbsDown,
    FaPaw,
    FaShieldAlt,
    FaHeartbeat,
    FaStar,
    FaNotesMedical,
} from "react-icons/fa";
import { showSuccessAlert, showErrorAlert } from "../utils/sweetAlert";
import "../styles/ExplainModal.css";

function ExplainModal({ product, pet, isOpen, onClose, onFeedbackSubmitted }) {
    // ✅ ALL hooks must be declared before any conditional returns
    const [feedbackStatus, setFeedbackStatus] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Guard: render nothing when closed or no product
    if (!isOpen || !product) return null;

    const token = localStorage.getItem("access");
    const rec = product.recommendation || {};
    const related = product.related_explanation || null;
    const factorBreakdown = rec.factor_breakdown || [];
    const badges = rec.badges || [];

    const matchScore = rec.match_score ?? related?.match_score ?? 88;
    const matchLevel = rec.match_level || related?.relationship_label || "Recommended Care";
    const primaryReason =
        rec.primary_reason ||
        related?.explanation ||
        "Carefully selected for your pet's wellness.";

    const handleFeedback = async (isHelpful, reason) => {
        if (!token) {
            showErrorAlert("Please log in to submit recommendation feedback.");
            return;
        }
        try {
            setSubmitting(true);
            await axios.post(
                "/api/products/recommendations/feedback/",
                {
                    product_id: product.id,
                    pet_id: pet?.id || null,
                    is_helpful: isHelpful,
                    feedback_reason: reason,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFeedbackStatus(isHelpful ? "helpful" : "not_relevant");
            showSuccessAlert(
                isHelpful
                    ? "Thank you! We've refined future recommendations."
                    : "Feedback noted. We'll tune down similar items."
            );
            if (onFeedbackSubmitted) {
                onFeedbackSubmitted(product.id, isHelpful);
            }
        } catch (err) {
            console.error("Feedback error:", err);
            showErrorAlert("Failed to save feedback. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 90) return "#10b981";
        if (score >= 80) return "#3b82f6";
        if (score >= 70) return "#8b5cf6";
        return "#f59e0b";
    };

    const scoreColor = getScoreColor(matchScore);

    const imageURL = (() => {
        const src = product.product_image || product.image || "";
        if (!src) return "https://via.placeholder.com/88x88";
        if (src.startsWith("http")) return src;
        return `${src}`;
    })();

    // ✅ Render via Portal so the modal escapes any overflow:hidden parent
    return ReactDOM.createPortal(
        <div
            className="xai-modal-overlay"
            onClick={onClose}
            role="presentation"
        >
            <div
                className="xai-modal-container"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="xai-modal-title"
            >
                {/* ── Header ── */}
                <div className="xai-modal-header">
                    <div className="xai-header-badge-group">
                        <span className="xai-chip-pill">
                            <span className="xai-sparkle">✨</span> Explainable AI RecSys
                        </span>
                        <span
                            className="xai-match-badge"
                            style={{
                                backgroundColor: `${scoreColor}18`,
                                color: scoreColor,
                                borderColor: `${scoreColor}40`,
                            }}
                        >
                            {matchScore}% Match • {matchLevel}
                        </span>
                    </div>
                    <button
                        type="button"
                        className="xai-close-btn"
                        onClick={onClose}
                        aria-label="Close explanation modal"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="xai-modal-body">
                    {/* Product Summary */}
                    <div className="xai-product-header">
                        <div className="xai-product-thumb">
                            <img src={imageURL} alt={product.product_name} />
                        </div>
                        <div className="xai-product-info">
                            <span className="xai-category-tag">
                                {product.category_name || product.pet_type || "Pet Care"} •{" "}
                                {product.product_type || "Care"}
                            </span>
                            <h2 id="xai-modal-title">{product.product_name}</h2>
                            <p className="xai-primary-rationale">
                                <strong>Why this was recommended:</strong> {primaryReason}
                            </p>
                        </div>
                    </div>

                    {/* Badges */}
                    {badges.length > 0 && (
                        <div className="xai-badges-row">
                            {badges.map((b, idx) => (
                                <span
                                    key={idx}
                                    className={`xai-tag-badge xai-tag-${b.type || "general"}`}
                                >
                                    <span>{b.icon}</span>
                                    <span>{b.label}</span>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Pet Context */}
                    {pet && (
                        <div className="xai-pet-context-card">
                            <div className="xai-pet-avatar">
                                <FaPaw />
                            </div>
                            <div className="xai-pet-meta">
                                <h4>
                                    Evaluated for <strong>{pet.pet_name}</strong>
                                </h4>
                                <p>
                                    {pet.pet_type} • {pet.breed || "Cross Breed"} • Age:{" "}
                                    {pet.age || "Adult"} • Weight: {pet.weight || "N/A"}
                                </p>
                                {pet.health_notes &&
                                    pet.health_notes.toLowerCase() !== "nothing" && (
                                        <div className="xai-health-note-pill">
                                            <FaHeartbeat /> Health Notes:{" "}
                                            <em>"{pet.health_notes}"</em>
                                        </div>
                                    )}
                            </div>
                        </div>
                    )}

                    {/* Factor Breakdown */}
                    <div className="xai-breakdown-section">
                        <div className="xai-section-title">
                            <FaShieldAlt />
                            <h3>Multi-Factor Explainability Weights</h3>
                            <span className="xai-subtext">
                                Transparent breakdown of algorithmic factors
                            </span>
                        </div>

                        {factorBreakdown.length > 0 ? (
                            <div className="xai-factors-list">
                                {factorBreakdown.map((factor, idx) => (
                                    <div key={idx} className="xai-factor-item">
                                        <div className="xai-factor-header">
                                            <span className="xai-factor-name">
                                                {factor.title}
                                            </span>
                                            <div className="xai-factor-scores">
                                                <span className="xai-factor-weight">
                                                    Weight: {factor.weight_percentage}%
                                                </span>
                                                <span
                                                    className="xai-factor-score"
                                                    style={{
                                                        color: getScoreColor(factor.score),
                                                    }}
                                                >
                                                    {factor.score}% Fit
                                                </span>
                                            </div>
                                        </div>
                                        <div className="xai-progress-track">
                                            <div
                                                className="xai-progress-bar"
                                                style={{
                                                    width: `${factor.score}%`,
                                                    backgroundColor: getScoreColor(factor.score),
                                                }}
                                            />
                                        </div>
                                        <p className="xai-factor-reason">{factor.reason}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                                This product was selected based on your pet's overall profile
                                compatibility.
                            </p>
                        )}
                    </div>

                    {/* Clinical Notes */}
                    {rec.clinical_notes && (
                        <div className="xai-clinical-alert">
                            <FaNotesMedical className="xai-alert-icon" />
                            <div>
                                <h4>Veterinary &amp; Usage Guidance</h4>
                                <p>{rec.clinical_notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Why Choose Narrative */}
                    {rec.why_choose && (
                        <div className="xai-narrative-box">
                            <FaInfoCircle className="xai-info-icon" />
                            <p>{rec.why_choose}</p>
                        </div>
                    )}
                </div>

                {/* ── Footer: Feedback ── */}
                <div className="xai-modal-footer">
                    <div className="xai-feedback-prompt">
                        <span>Was this recommendation helpful for your pet?</span>
                    </div>
                    <div className="xai-feedback-actions">
                        <button
                            type="button"
                            className={`xai-feedback-btn xai-btn-helpful ${
                                feedbackStatus === "helpful" ? "active" : ""
                            }`}
                            onClick={() => handleFeedback(true, "helpful")}
                            disabled={submitting || feedbackStatus !== null}
                        >
                            <FaThumbsUp />{" "}
                            {feedbackStatus === "helpful" ? "Helpful ✓" : "Helpful"}
                        </button>
                        <button
                            type="button"
                            className={`xai-feedback-btn xai-btn-unhelpful ${
                                feedbackStatus === "not_relevant" ? "active" : ""
                            }`}
                            onClick={() => handleFeedback(false, "not_relevant")}
                            disabled={submitting || feedbackStatus !== null}
                        >
                            <FaThumbsDown />{" "}
                            {feedbackStatus === "not_relevant" ? "Noted ✕" : "Not Relevant"}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body   // portal target — escapes all parent overflow constraints
    );
}

export default ExplainModal;
