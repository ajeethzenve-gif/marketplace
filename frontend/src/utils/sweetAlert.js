import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

/* =========================================================
   COMMON SWEET ALERT CONFIGURATION
========================================================= */

const commonConfig = {
    toast: true,
    position: "bottom-end",

    showConfirmButton: false,
    showCloseButton: false,

    allowOutsideClick: true,
    allowEscapeKey: true,

    timerProgressBar: true,

    customClass: {
        popup: "pet-swal-popup",
        title: "pet-swal-title",
        timerProgressBar: "pet-swal-progress",
    },

    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
};


/* =========================================================
   SUCCESS ALERT
========================================================= */

export const showSuccessAlert = (message, title = "") => {
    Swal.fire({
        ...commonConfig,

        icon: "success",

        title: title || message,

        timer: 2500,
    });
};


/* =========================================================
   ERROR ALERT
========================================================= */

export const showErrorAlert = (message, title = "") => {
    Swal.fire({
        ...commonConfig,

        icon: "error",

        title: title || message,

        timer: 3000,
    });
};


/* =========================================================
   WARNING ALERT
========================================================= */

export const showWarningAlert = (message, title = "") => {
    Swal.fire({
        ...commonConfig,

        icon: "warning",

        title: title || message,

        timer: 3000,
    });
};


/* =========================================================
   INFO ALERT
========================================================= */

export const showInfoAlert = (message, title = "") => {
    Swal.fire({
        ...commonConfig,

        icon: "info",

        title: title || message,

        timer: 3000,
    });
};


/* =========================================================
   QUESTION / CONFIRMATION ALERT
========================================================= */

export const showConfirmAlert = async ({
    title = "Are you sure?",
    text = "",
    confirmButtonText = "Yes",
    cancelButtonText = "Cancel",
}) => {
    const result = await Swal.fire({
        toast: false,
        position: "center",

        icon: "question",

        title,
        text,

        showCancelButton: true,
        showConfirmButton: true,

        confirmButtonText,
        cancelButtonText,

        reverseButtons: true,

        allowOutsideClick: false,
        allowEscapeKey: true,

        customClass: {
            popup: "pet-confirm-popup",
            title: "pet-confirm-title",
            confirmButton: "pet-confirm-button",
            cancelButton: "pet-cancel-button",
        },
    });

    return result.isConfirmed;
};


/* =========================================================
   LOADING ALERT
========================================================= */

export const showLoadingAlert = (message = "Please wait...") => {
    Swal.fire({
        toast: true,
        position: "bottom-end",

        title: message,

        allowOutsideClick: false,
        allowEscapeKey: false,

        showConfirmButton: false,

        didOpen: () => {
            Swal.showLoading();
        },

        customClass: {
            popup: "pet-swal-popup",
            title: "pet-swal-title",
        },
    });
};


/* =========================================================
   CLOSE CURRENT ALERT
========================================================= */

export const closeAlert = () => {
    Swal.close();
};


/* =========================================================
   CUSTOM ALERT
========================================================= */

export const showCustomAlert = ({
    icon = "info",
    title = "",
    text = "",
    timer = 3000,
    position = "bottom-end",
}) => {
    Swal.fire({
        toast: position !== "center",
        position,

        icon,
        title,
        text,

        showConfirmButton: false,

        timer,
        timerProgressBar: true,

        allowOutsideClick: true,
        allowEscapeKey: true,

        customClass: {
            popup: "pet-swal-popup",
            title: "pet-swal-title",
            timerProgressBar: "pet-swal-progress",
        },
    });
};