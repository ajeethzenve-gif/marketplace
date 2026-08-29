import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    FaWallet,
    FaPlus,
    FaArrowDown,
    FaArrowUp,
    FaHistory,
    FaRupeeSign,
    FaExclamationTriangle,
    FaSyncAlt,
} from "react-icons/fa";

import "../styles/Wallet.css";


function Wallet() {

    const navigate = useNavigate();

    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // GET AUTH CONFIG
    // ==========================================

    const getAuthConfig = () => {

        const token = localStorage.getItem("access");

        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };


    // ==========================================
    // FETCH WALLET DATA
    // ==========================================

    const fetchWallet = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://127.0.0.1:8000/api/wallet/",
                getAuthConfig()
            );

            setWallet(response.data.wallet);
            setTransactions(response.data.transactions || []);

        } catch (error) {

            console.error("Wallet Error:", error);

            if (error.response?.status === 401) {

                setError("Your session has expired. Please login again.");

            } else {

                setError(
                    error.response?.data?.message ||
                    "Failed to load wallet information."
                );
            }

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // LOAD WALLET
    // ==========================================

    useEffect(() => {

        fetchWallet();

    }, []);


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (dateString) => {

        if (!dateString) return "";

        return new Date(dateString).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    // ==========================================
    // FORMAT TIME
    // ==========================================

    const formatTime = (dateString) => {

        if (!dateString) return "";

        return new Date(dateString).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };


    // ==========================================
    // ADD MONEY
    // ==========================================

    const handleAddMoney = () => {

        navigate("/wallet/add-money");

    };


    // ==========================================
    // TRANSACTION TYPE
    // ==========================================

    const isCredit = (transaction) => {

        return transaction.transaction_type === "CREDIT";

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="wallet-page">

                <div className="wallet-loading">

                    <FaSyncAlt className="wallet-spinner" />

                    <p>Loading your wallet...</p>

                </div>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <div className="wallet-page">

                <div className="wallet-error">

                    <FaExclamationTriangle />

                    <h2>Something went wrong</h2>

                    <p>{error}</p>

                    <button
                        className="wallet-retry-btn"
                        onClick={fetchWallet}
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );

    }


    return (

        <div className="wallet-page">


            {/* ==========================================
                PAGE HEADER
            ========================================== */}

            <div className="wallet-header">

                <div>

                    <h1>
                        <FaWallet />
                        My Wallet
                    </h1>

                    <p>
                        Manage your wallet balance and transactions
                    </p>

                </div>

                <button
                    className="wallet-refresh-btn"
                    onClick={fetchWallet}
                    title="Refresh Wallet"
                >
                    <FaSyncAlt />
                </button>

            </div>


            {/* ==========================================
                WALLET BALANCE CARD
            ========================================== */}

            <div className="wallet-balance-card">

                <div className="wallet-card-top">

                    <div className="wallet-icon">

                        <FaWallet />

                    </div>

                    <span>
                        Available Balance
                    </span>

                </div>


                <div className="wallet-balance">

                    <FaRupeeSign />

                    {Number(
                        wallet?.balance || 0
                    ).toLocaleString(
                        "en-IN",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }
                    )}

                </div>


                <p className="wallet-balance-text">

                    Use your wallet for fast and secure payments.

                </p>


                <button
                    className="add-money-btn"
                    onClick={handleAddMoney}
                >

                    <FaPlus />

                    Add Money

                </button>

            </div>


            {/* ==========================================
                WALLET INFORMATION
            ========================================== */}

            <div className="wallet-info-grid">


                <div className="wallet-info-card">

                    <div className="wallet-info-icon">

                        <FaHistory />

                    </div>

                    <div>

                        <span>
                            Total Transactions
                        </span>

                        <h3>
                            {transactions.length}
                        </h3>

                    </div>

                </div>


                <div className="wallet-info-card">

                    <div className="wallet-info-icon credit">

                        <FaArrowDown />

                    </div>

                    <div>

                        <span>
                            Wallet Credits
                        </span>

                        <h3>
                            {
                                transactions.filter(
                                    (transaction) =>
                                        transaction.transaction_type ===
                                        "CREDIT"
                                ).length
                            }
                        </h3>

                    </div>

                </div>


                <div className="wallet-info-card">

                    <div className="wallet-info-icon debit">

                        <FaArrowUp />

                    </div>

                    <div>

                        <span>
                            Wallet Payments
                        </span>

                        <h3>
                            {
                                transactions.filter(
                                    (transaction) =>
                                        transaction.transaction_type ===
                                        "DEBIT"
                                ).length
                            }
                        </h3>

                    </div>

                </div>


            </div>


            {/* ==========================================
                TRANSACTION HISTORY
            ========================================== */}

            <div className="wallet-transactions">


                <div className="transaction-header">

                    <div>

                        <h2>

                            <FaHistory />

                            Transaction History

                        </h2>

                        <p>
                            View all your wallet activity
                        </p>

                    </div>

                </div>


                {
                    transactions.length === 0 ? (

                        <div className="no-transactions">

                            <FaWallet />

                            <h3>
                                No Transactions Yet
                            </h3>

                            <p>
                                Add money to your wallet to start using it.
                            </p>

                            <button
                                onClick={handleAddMoney}
                            >

                                <FaPlus />

                                Add Money

                            </button>

                        </div>

                    ) : (

                        <div className="transaction-list">

                            {
                                transactions.map(
                                    (transaction) => {

                                        const credit =
                                            isCredit(transaction);

                                        return (

                                            <div
                                                className="transaction-item"
                                                key={transaction.id}
                                            >


                                                {/* TRANSACTION ICON */}

                                                <div
                                                    className={
                                                        `transaction-icon ${
                                                            credit
                                                                ? "credit"
                                                                : "debit"
                                                        }`
                                                    }
                                                >

                                                    {
                                                        credit
                                                            ? (
                                                                <FaArrowDown />
                                                            )
                                                            : (
                                                                <FaArrowUp />
                                                            )
                                                    }

                                                </div>


                                                {/* TRANSACTION DETAILS */}

                                                <div className="transaction-details">

                                                    <h4>

                                                        {
                                                            transaction.description
                                                        }

                                                    </h4>

                                                    <p>

                                                        {
                                                            formatDate(
                                                                transaction.created_at
                                                            )
                                                        }

                                                        {" • "}

                                                        {
                                                            formatTime(
                                                                transaction.created_at
                                                            )
                                                        }

                                                    </p>


                                                    <span
                                                        className={
                                                            `transaction-status ${
                                                                transaction.status
                                                                    ?.toLowerCase()
                                                            }`
                                                        }
                                                    >

                                                        {
                                                            transaction.status ||
                                                            "SUCCESS"
                                                        }

                                                    </span>

                                                </div>


                                                {/* TRANSACTION AMOUNT */}

                                                <div
                                                    className={
                                                        `transaction-amount ${
                                                            credit
                                                                ? "credit"
                                                                : "debit"
                                                        }`
                                                    }
                                                >

                                                    {
                                                        credit
                                                            ? "+"
                                                            : "-"
                                                    }

                                                    ₹

                                                    {
                                                        Number(
                                                            transaction.amount
                                                        ).toLocaleString(
                                                            "en-IN",
                                                            {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            }
                                                        )
                                                    }

                                                </div>


                                            </div>

                                        );

                                    }
                                )
                            }

                        </div>

                    )
                }


            </div>


        </div>

    );

}


export default Wallet;