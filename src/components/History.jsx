import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { currencyFormatter, datetimeFormatter } from "../helper/helper";

const History = () => {
  return (
    <div className="px-6 sm:px-4 lg:px-8 pb-9 dark:text-white">
      <SearchAndFilter />
      <TransactionList />
      <Pagination />
    </div>
  );
};

const SearchAndFilter = () => {
  return (
    <div className="flex justify-between items-center">
      {/* Search */}
      <div className="relative flex items-center rounded-lg max-w-xs w-full">
        <div className="absolute left-4">
          <Search size={16} className="text-gray-400" />
        </div>

        <input
          type="text"
          placeholder="Search"
          className="pl-12 flex-1 shadow-md p-2 rounded-md dark:bg-black"
        />
      </div>

      {/* Filter */}
      <div className="flex justify-between gap-14">
        <div className="flex items-center space-x-4">
          <label className="text-gray-400">Show</label>
          <select className="rounded-md px-3 py-2 shadow-md text-gray-400 dark:bg-black">
            <option value="Last 10 transactions">Last 10 transactions</option>
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <label className="text-gray-400">Sort By</label>
          <select className="rounded-md px-3 py-2 shadow-md text-gray-400 dark:bg-black">
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>

          <select className="rounded-md px-3 py-2 shadow-md text-gray-400 dark:bg-black">
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetch("")

        
        if (!response.ok) throw new Error("Data tidak ditemukan");
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        alert(err.message);
      }
    };

    fetchAccount();
  }, []);

  return (
    <div className="container py-6 min-w-full">
      <table className="min-w-full table-auto border-collapse border border-gray-100 dark:border-gray-900">
        <thead>
          <tr className="bg-white dark:bg-black">
            <th className="px-4 py-2 text-left border-b dark:border-black">
              Date & Time
            </th>
            <th className="px-4 py-2 text-left border-b dark:border-black">
              Type
            </th>
            <th className="px-4 py-2 text-left border-b dark:border-black">
              From/To
            </th>
            <th className="px-4 py-2 text-left border-b dark:border-black">
              Description
            </th>
            <th className="px-4 py-2 text-left border-b dark:border-black">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr
              key={index}
              className="odd:bg-gray-100 dark:odd:bg-gray-900 even:bg-white dark:even:bg-black"
            >
              <td className="px-4 py-2 border-b dark:border-black text-left">
                {datetimeFormatter(transaction.id)}
              </td>
              <td className="px-4 py-2 border-b dark:border-black text-left">
                {transaction.name}
              </td>
              <td className="px-4 py-2 border-b dark:border-black text-left">
                {transaction.from}
              </td>
              <td className="px-4 py-2 border-b dark:border-black text-left">
                {transaction.description}
              </td>
              {transaction.type === "DEBIT" ? (
                <td
                  className={`px-4 py-2 border-b dark:border-black text-left text-red-500`}
                >
                  - {currencyFormatter.format(Math.abs(transaction.amount))}
                </td>
              ) : transaction.type === "CREDIT" ? (
                <td
                  className={`px-4 py-2 border-b dark:border-black text-left text-green-500`}
                >
                  + {currencyFormatter.format(Math.abs(transaction.amount))}
                </td>
              ) : (
                <td
                  className={`px-4 py-2 border-b border-black text-left`}
                ></td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Pagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const changePage = (page) => setCurrentPage(page);

  return (
    <div className="flex justify-start mt-4 font-semibold">
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
