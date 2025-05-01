import React, { useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";

const History = () => {
    const [transactions, setTransactions] = useState([]);
    const [userFullname, setUserFullname] = useState("");
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("descending");
    const [showLimit, setShowLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterType, setFilterType] = useState("all");

    useEffect(() => {
        const fetchProfileAndTransactions = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error("No auth token found.");
                setLoading(false);
                return;
            }

            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };

            try {
                const profileRes = await fetch("https://kelompok2.serverku.org/api/auth/profile", {
                    headers,
                });
                if (!profileRes.ok) throw new Error("Failed to fetch profile");
                const profileData = await profileRes.json();
                const fullname = profileData.fullname;
                setUserFullname(fullname);

                const txRes = await fetch("https://kelompok2.serverku.org/api/transactions", {
                    headers,
                });
                if (!txRes.ok) throw new Error("Failed to fetch transactions");
                const txData = await txRes.json();

                const processed = txData.data.map(tx => {
                    let direction = "";

                    if (tx.transactionType.toLowerCase() === "top up") {
                        direction = "Income";
                    } else if (
                        tx.transactionType.toLowerCase() === "transfer" &&
                        tx.sender === fullname
                    ) {
                        direction = "Outcome";
                    } else if (
                        tx.transactionType.toLowerCase() === "transfer" &&
                        tx.recipient === fullname
                    ) {
                        direction = "Income";
                    }

                    return { ...tx, direction };
                });

                setTransactions(processed);
            } catch (err) {
                console.error("Error:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileAndTransactions();
    }, []);

    const filteredTransactions = useMemo(() => {
        let data = [...transactions];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            data = data.filter((tx) =>
                (tx.description && tx.description.toLowerCase().includes(query)) ||
                (tx.transactionType && tx.transactionType.toLowerCase().includes(query)) ||
                (tx.recipient && tx.recipient.toLowerCase().includes(query)) ||
                (tx.sender && tx.sender.toLowerCase().includes(query))
            );
        }

        // Income/Outcome filter
        if (filterType !== "all") {
            data = data.filter(tx => tx.direction.toLowerCase() === filterType);
        }

        // Sort
        data.sort((a, b) => {
            const aVal = sortBy === "date" ? new Date(a.transactionDateFormatted) : a.amount;
            const bVal = sortBy === "date" ? new Date(b.transactionDateFormatted) : b.amount;
            return sortOrder === "ascending" ? aVal - bVal : bVal - aVal;
        });

        return data;
    }, [transactions, searchQuery, sortBy, sortOrder, filterType]);

    const totalPages = Math.ceil(filteredTransactions.length / showLimit);
    const paginatedTransactions = useMemo(() => {
        const start = (currentPage - 1) * showLimit;
        return filteredTransactions.slice(start, start + showLimit);
    }, [filteredTransactions, currentPage, showLimit]);


    if (loading) return <p>Loading transaction history...</p>;


    return (
        <div className="p-4">
            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative flex items-center w-full md:w-1/3">
                    <div className="absolute left-4">
                        <Search size={16} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-12 flex-1 shadow-md p-2 rounded-md dark:bg-black w-full"
                    />
                </div>


                <div className="flex flex-wrap gap-4 items-center justify-center">
                    <div className="flex items-center space-x-2">
                        <label className="text-gray-400">Show</label>
                        <select
                            value={showLimit}
                            onChange={(e) => {
                                setShowLimit(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="rounded-md px-3 py-2 shadow-md text-gray-400 dark:bg-black"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label className="text-gray-400">Type</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="rounded-md px-3 py-2 shadow-md text-gray-400 dark:bg-black"
                        >
                            <option value="all">All</option>
                            <option value="income">Income</option>
                            <option value="outcome">Outcome</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label className="text-gray-400">Sort By</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="rounded-md px-3 py-2 shadow-md text-gray-400 dark:bg-black"
                        >
                            <option value="date">Date</option>
                            <option value="amount">Amount</option>
                        </select>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="rounded-md px-3 py-2 shadow-md text-gray-400 dark:bg-black"
                        >
                            <option value="ascending">Ascending</option>
                            <option value="descending">Descending</option>
                        </select>
                    </div>
                </div>
            </div>

            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-left shadow-md dark:shadow-lg">
                <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left dark:text-gray-200">Date & Time</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left dark:text-gray-200">Transaction Type</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left dark:text-gray-200">From/To</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left dark:text-gray-200">Description</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left dark:text-gray-200">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedTransactions.map((tx, index) => (
                        <tr
                            key={tx.transactionId}
                            className={`${index % 2 === 0
                                    ? "bg-white dark:bg-gray-900"
                                    : "bg-gray-100 dark:bg-gray-800"
                                } dark:text-gray-200`}
                        >
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{tx.transactionDateFormatted}</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{tx.transactionType}</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{tx.direction === "Income" ? tx.sender : tx.recipient}</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{tx.description || "-"}</td>
                            <td className={`border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold ${tx.direction === "Income"
                                    ? "text-green-500 dark:text-green-400"
                                    : "text-red-500 dark:text-red-400"
                                }`}>
                                {tx.direction === "Income" ? "+" : "-"} Rp {tx.amount.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />
            )}

        </div>
    );
};

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    if (totalPages <= 1) return null;

    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    return (
        <div className="flex justify-center mt-4 font-semibold gap-1 flex-wrap">
            <button
                onClick={() => changePage(1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white dark:bg-black text-primary rounded-l-md disabled:opacity-50 disabled:text-gray-700 dark:disabled:text-gray-300 border border-gray-400"
            >
                First
            </button>

            {startPage > 1 && (
                <button
                    onClick={() => changePage(startPage - 1)}
                    className="px-4 py-2 bg-white dark:bg-black text-primary border border-gray-400"
                >
                    ...
                </button>
            )}

            {[...Array(endPage - startPage + 1)].map((_, index) => {
                const page = startPage + index;
                return (
                    <button
                        key={page}
                        onClick={() => changePage(page)}
                        className={`px-4 py-2 border border-gray-400 ${currentPage === page
                            ? "bg-primary text-white dark:text-black"
                            : "bg-white dark:bg-black text-primary"
                            }`}
                    >
                        {page}
                    </button>
                );
            })}

            {endPage < totalPages && (
                <button
                    onClick={() => changePage(endPage + 1)}
                    className="px-4 py-2 bg-white dark:bg-black text-primary border border-gray-400"
                >
                    ...
                </button>
            )}

            <button
                onClick={() => changePage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white dark:bg-black text-primary rounded-r-md disabled:opacity-50 disabled:text-gray-700 dark:disabled:text-gray-300 border border-gray-400"
            >
                Last
            </button>
        </div>
    );
};


export default History;