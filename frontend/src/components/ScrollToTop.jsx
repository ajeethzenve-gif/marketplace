import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
    const { pathname, search } = useLocation();

    useEffect(() => {
        // Scroll the window to the top
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });

        // Also reset any internal scrolling containers
        const mainContent = document.querySelector(".main-content");

        if (mainContent) {
            mainContent.scrollTo({
                top: 0,
                left: 0,
                behavior: "auto",
            });
        }

        const homeBody = document.querySelector(".home-body");

        if (homeBody) {
            homeBody.scrollTo({
                top: 0,
                left: 0,
                behavior: "auto",
            });
        }
    }, [pathname, search]);

    return null;
}

export default ScrollToTop;