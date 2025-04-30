import { Search } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { currencyFormatter } from "../helper/helper";

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("ascending");
  const [showLimit, setShowLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("https://kelompok2.serverku.org/api/transactions", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Data tidak ditemukan");

        const data = await response.json();
        setTransactions(data.data);
      } catch (err) {
        alert(err.message);
      }
    };

    if (token) {
      fetchTransactions();
    } else {
      alert("Token tidak ditemukan! Anda perlu login.");
    }
  }, [token]);

  const filteredTransactions = useMemo(() => {
    let data = [...transactions];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter((t) =>
        (t.description && t.description.toLowerCase().includes(query)) ||
        (t.transactionType && t.transactionType.toLowerCase().includes(query)) ||
        (t.recipient && t.recipient.toLowerCase().includes(query)) ||
        (t.sender && t.sender.toLowerCase().includes(query))
      );
    }

    // Sort
    data.sort((a, b) => {
      const aVal = sortBy === "date" ? new Date(a.transactionDateFormatted) : a.amount;
      const bVal = sortBy === "date" ? new Date(b.transactionDateFormatted) : b.amount;
      return sortOrder === "ascending" ? aVal - bVal : bVal - aVal;
    });

    return data;
  }, [transactions, searchQuery, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredTransactions.length / showLimit);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * showLimit;
    return filteredTransactions.slice(start, start + showLimit);
  }, [filteredTransactions, currentPage, showLimit]);

  return (
    <div className="px-6 sm:px-4 lg:px-8 pb-9 dark:text-white">
      <SearchAndFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        showLimit={showLimit}
        setShowLimit={setShowLimit}
        setCurrentPage={setCurrentPage}
      />
      <TransactionList transactions={paginatedTransactions} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

const SearchAndFilter = ({
  searchQuery, setSearchQuery,
  sortBy, setSortBy,
  sortOrder, setSortOrder,
  showLimit, setShowLimit,
  setCurrentPage
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 my-6">
      {/* Search */}
      <div className="relative flex items-center w-full md:w-1/3">
        <div className="absolute left-4">
          <Search size={16} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset ke halaman 1 setelah search
          }}
          className="pl-12 flex-1 shadow-md p-2 rounded-md dark:bg-black w-full"
        />
      </div>

      

      {/* Filter and Sort */}
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
  );
};

const TransactionList = ({ transactions }) => {
  if (!transactions.length) {
    return <div className="text-center py-6">No transactions found.</div>;
  }

  return (
    <div className="container py-6 min-w-full overflow-x-auto">
      <table className="text-left min-w-full table-auto border-collapse border border-gray-100 dark:border-gray-900">
        <thead>
          <tr className="bg-white dark:bg-black">
            <th className="px-4 py-2 text-left border-b dark:border-black">Date & Time</th>
            <th className="px-4 py-2 text-left border-b dark:border-black">Type</th>
            <th className="px-4 py-2 text-left border-b dark:border-black">From/To</th>
            <th className="px-4 py-2 text-left border-b dark:border-black">Description</th>
            <th className="px-4 py-2 text-left border-b dark:border-black">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.transactionId}
              className="odd:bg-gray-100 dark:odd:bg-gray-900 even:bg-white dark:even:bg-black"
            >
              <td className="px-4 py-2 border-b dark:border-black">
                {transaction.transactionDateFormatted}
              </td>
              <td className="px-4 py-2 border-b dark:border-black">
                {transaction.transactionType}
              </td>
              <td className="px-4 py-2 border-b dark:border-black">
                {transaction.recipient || transaction.sender}
              </td>
              <td className="px-4 py-2 border-b dark:border-black">
                {transaction.description}
              </td>
              <td
                className={`px-4 py-2 border-b dark:border-black font-semibold ${
                  transaction.transactionType.toLowerCase().includes("top up")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {transaction.transactionType.toLowerCase().includes("top up") ? "+" : "-"}{" "}
                {currencyFormatter.format(Math.abs(transaction.amount))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-4 font-semibold gap-1 flex-wrap">
      <button
        onClick={() => changePage(1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white dark:bg-black text-primary rounded-l-md disabled:opacity-50 disabled:text-gray-700 dark:disabled:text-gray-300 border border-gray-400"
      >
        First
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => changePage(index + 1)}
          className={`px-4 py-2 border border-gray-400 ${
            currentPage === index + 1
              ? "bg-primary text-white dark:text-black"
              : "bg-white dark:bg-black text-primary"
          }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-white dark:bg-black text-primary rounded-r-md disabled:opacity-50 disabled:text-gray-700 dark:disabled:text-gray-300 border border-gray-400"
      >
        Next
      </button>
    </div>
  );
};

export default History;
