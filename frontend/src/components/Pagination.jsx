import "../styles/Pagination.css";

function Pagination({
    page,
    totalPages,
    setPage,
}) {
    const scrollToTop = () => {
        // Scroll browser window
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });

        // Scroll main application content
        const mainContent = document.querySelector(".main-content");

        if (mainContent) {
            mainContent.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
            });
        }

        // Scroll product page container if needed
        const productsPage = document.querySelector(".products-page");

        if (productsPage) {
            productsPage.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    const handlePageChange = (newPage) => {
        if (
            newPage < 1 ||
            newPage > totalPages ||
            newPage === page
        ) {
            return;
        }

        setPage(newPage);

        // Scroll to the top after changing page
        setTimeout(() => {
            scrollToTop();
        }, 0);
    };

    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="pagination-container">

            <button
                type="button"
                disabled={page === 1}
                onClick={() =>
                    handlePageChange(page - 1)
                }
            >
                Previous
            </button>

            {pages.map((number) => (
                <button
                    key={number}
                    type="button"
                    className={
                        page === number
                            ? "active-page"
                            : ""
                    }
                    onClick={() =>
                        handlePageChange(number)
                    }
                >
                    {number}
                </button>
            ))}

            <button
                type="button"
                disabled={page === totalPages}
                onClick={() =>
                    handlePageChange(page + 1)
                }
            >
                Next
            </button>

        </div>
    );
}

export default Pagination;