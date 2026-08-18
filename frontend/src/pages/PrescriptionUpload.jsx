import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FaCloudUploadAlt,
    FaFilePdf,
    FaPaw,
    FaShieldAlt,
    FaCheckCircle,
    FaTimes,
    FaArrowLeft,
    FaStethoscope,
    FaClipboardCheck
} from "react-icons/fa";
import "../styles/PrescriptionUpload.css";

function PrescriptionUpload() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg"
    ];

    const handleFile = (file) => {
        setError("");
        setMessage("");

        if (!file) return;

        if (!allowedTypes.includes(file.type)) {
            setError("Please upload a PDF, JPG, or PNG file.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError("File size must be less than 10 MB.");
            return;
        }

        setSelectedFile(file);
    };

    const handleInputChange = (event) => {
        handleFile(event.target.files[0]);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragActive(false);

        const file = event.dataTransfer.files[0];
        handleFile(file);
    };

    const removeFile = () => {
        setSelectedFile(null);
        setError("");
        setMessage("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const uploadPrescription = async () => {
        if (!selectedFile) {
            setError("Please select your prescription first.");
            return;
        }

        const token = localStorage.getItem("access");

        if (!token) {
            navigate("/login");
            return;
        }

        const formData = new FormData();
        formData.append("prescription_file", selectedFile);

        try {
            setLoading(true);
            setError("");
            setMessage("");

            const response = await axios.post(
                "http://127.0.0.1:8000/api/prescriptions/upload/",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setMessage(
                response.data?.message ||
                "Prescription uploaded successfully. We will analyze it shortly."
            );

            // If your backend returns a prescription ID,
            // you can redirect to the result page here.
            // navigate(`/prescription/${response.data.id}`);
        } catch (err) {
            console.error("Prescription upload error:", err);

            setError(
                err.response?.data?.error ||
                err.response?.data?.detail ||
                "Unable to upload the prescription. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="prescription-page">

            {/* Decorative background */}
            <div className="prescription-bg-shape shape-one"></div>
            <div className="prescription-bg-shape shape-two"></div>

            <div className="prescription-container">

                {/* Back */}
                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft />
                    Back
                </button>

                {/* Hero */}
                <section className="prescription-hero">

                    <div className="hero-content">
                        <div className="hero-badge">
                            <FaPaw />
                            Pet Care Clinic
                        </div>

                        <h1>
                            Upload Your
                            <span> E-Prescription</span>
                        </h1>

                        <p>
                            Upload your veterinarian's prescription and
                            we'll help you find the matching medicines
                            and pet-care products.
                        </p>

                        <div className="hero-points">
                            <div>
                                <FaCheckCircle />
                                PDF, JPG & PNG supported
                            </div>

                            <div>
                                <FaShieldAlt />
                                Secure document handling
                            </div>

                            <div>
                                <FaClipboardCheck />
                                Prescription verification
                            </div>
                        </div>
                    </div>

                    <div className="hero-illustration">
                        <div className="illustration-circle">
                            <FaPaw className="paw-large" />
                        </div>

                        <div className="floating-card card-top">
                            <FaFilePdf />
                            <div>
                                <strong>Prescription.pdf</strong>
                                <small>Ready to upload</small>
                            </div>
                        </div>

                        <div className="floating-card card-bottom">
                            <FaStethoscope />
                            <span>Veterinary Care</span>
                        </div>
                    </div>

                </section>

                {/* Upload Card */}
                <section className="upload-section">

                    <div className="upload-card">

                        <div className="upload-heading">
                            <div className="upload-icon">
                                <FaCloudUploadAlt />
                            </div>

                            <div>
                                <h2>Upload Prescription</h2>
                                <p>
                                    Upload the prescription provided by your
                                    veterinarian.
                                </p>
                            </div>
                        </div>

                        {!selectedFile ? (
                            <div
                                className={`drop-zone ${
                                    dragActive ? "drag-active" : ""
                                }`}
                                onDragOver={(event) => {
                                    event.preventDefault();
                                    setDragActive(true);
                                }}
                                onDragLeave={() => setDragActive(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="drop-icon">
                                    <FaCloudUploadAlt />
                                </div>

                                <h3>Drag & drop your prescription here</h3>

                                <p>
                                    or
                                    <span> browse from your computer</span>
                                </p>

                                <div className="file-types">
                                    <span>PDF</span>
                                    <span>JPG</span>
                                    <span>PNG</span>
                                    <span>Max 10 MB</span>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                                    onChange={handleInputChange}
                                    hidden
                                />
                            </div>
                        ) : (
                            <div className="selected-file">

                                <div className="file-preview-icon">
                                    {selectedFile.type === "application/pdf" ? (
                                        <FaFilePdf />
                                    ) : (
                                        <FaClipboardCheck />
                                    )}
                                </div>

                                <div className="file-details">
                                    <strong>{selectedFile.name}</strong>
                                    <span>
                                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                    </span>

                                    <div className="upload-ready">
                                        <FaCheckCircle />
                                        File ready for upload
                                    </div>
                                </div>

                                <button
                                    className="remove-file"
                                    onClick={removeFile}
                                    aria-label="Remove file"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        )}

                        {error && (
                            <div className="upload-message error-message">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="upload-message success-message">
                                <FaCheckCircle />
                                {message}
                            </div>
                        )}

                        <button
                            className="upload-button"
                            onClick={uploadPrescription}
                            disabled={!selectedFile || loading}
                        >
                            <FaCloudUploadAlt />
                            {loading ? "Uploading..." : "Upload Prescription"}
                        </button>

                        <p className="upload-note">
                            Your prescription will be used only for
                            prescription processing and product matching.
                        </p>
                    </div>

                    {/* Right information card */}
                    <aside className="info-card">

                        <div className="info-header">
                            <FaStethoscope />
                            <h3>How it works</h3>
                        </div>

                        <div className="step">
                            <span>01</span>
                            <div>
                                <strong>Upload</strong>
                                <p>Upload your veterinary prescription.</p>
                            </div>
                        </div>

                        <div className="step">
                            <span>02</span>
                            <div>
                                <strong>Analyze</strong>
                                <p>
                                    Prescription text can be extracted and
                                    organized for review.
                                </p>
                            </div>
                        </div>

                        <div className="step">
                            <span>03</span>
                            <div>
                                <strong>Match</strong>
                                <p>
                                    Find products matching the prescribed
                                    medicine and strength.
                                </p>
                            </div>
                        </div>

                        <div className="step">
                            <span>04</span>
                            <div>
                                <strong>Verify</strong>
                                <p>
                                    Prescription medicines can be reviewed
                                    before purchase.
                                </p>
                            </div>
                        </div>

                        <div className="safety-box">
                            <FaShieldAlt />
                            <p>
                                <strong>Important:</strong> The system does
                                not change the veterinarian's prescription
                                or independently prescribe medicines.
                            </p>
                        </div>

                    </aside>

                </section>

                {/* Bottom clinic banner */}
                <section className="clinic-banner">
                    <div className="clinic-paw">
                        <FaPaw />
                    </div>

                    <div>
                        <h3>Need help with your prescription?</h3>
                        <p>
                            Make sure the prescription is clear and includes
                            the pet details, medicine name, dosage and
                            veterinarian information.
                        </p>
                    </div>

                    <button onClick={() => navigate("/help")}>
                        Help Center
                    </button>
                </section>

            </div>
        </div>
    );
}

export default PrescriptionUpload;