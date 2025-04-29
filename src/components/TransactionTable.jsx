import React from 'react';

const TransactionTable = ({ transactions }) => {
  return (
    <table className="min-w-full table-auto border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-300 px-4 py-2">Date</th>
          <th className="border border-gray-300 px-4 py-2">Description</th>
          <th className="border border-gray-300 px-4 py-2">Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? transactions.map((tx, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">{tx.date}</td>
            <td className="border border-gray-300 px-4 py-2">{tx.description}</td>
            <td className="border border-gray-300 px-4 py-2">{tx.amount.toLocaleString()}</td>
          </tr>
        )) : (
          <tr>
            <td colSpan="3" className="border border-gray-300 px-4 py-2 text-center">
              No transactions found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TransactionTable;
