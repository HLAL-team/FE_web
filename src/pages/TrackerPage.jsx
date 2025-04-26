import React, { useState } from 'react';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import History from '../components/History';
import BarChart from '../components/BarChart';

const TrackerPage = () => {
  const [viewMode, setViewMode] = useState('Daily');
  const [selectedDateRange, setSelectedDateRange] = useState('1-7');
  const [selectedMonth, setSelectedMonth] = useState('Jun');
  const [selectedYear, setSelectedYear] = useState('2022');

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const years = ['2022', '2023', '2024', '2025']; // Add more years as needed

  const renderDynamicButtons = () => {
    return (
      <div className="flex flex-wrap space-x-4 mb-8 items-center justify-end">
        {viewMode === 'Daily' && (
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="px-4 py-1 rounded-full border-transparent bg-[#188B8B] text-white"
          >
            {['1-7', '8-14', '15-21', '22-28'].map(range => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        )}

        {(viewMode === 'Daily' || viewMode === 'Weekly') && (
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-1 rounded-full border-transparent bg-[#188B8B] text-white"
          >
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        )}

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-1 rounded-full border-transparent bg-[#188B8B] text-white"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <Layout>
      <div>
        <Navbar />
        <div className="mx-8">
          <div>
            <h2 className="text-4xl text-left font-semibold">My Tracker</h2>
          </div>

          <div className="flex space-x-4 mt-6 mb-4">
            {['Daily', 'Weekly', 'Monthly', 'Quarterly'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-6 py-2 rounded-full border ${
                  viewMode === mode
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {renderDynamicButtons()}

          <BarChart viewMode={viewMode} />

          <div className="flex justify-between gap-8 px-36 mt-4 mb-16 text-left">
            <div className="w-full md:w-1/2">
              <h2 className="text-xl font-semibold text-gray-900">Total Income</h2>
              <p className="text-2xl font-bold text-[#057268]">Rp 8,566,684</p>
            </div>

            <div className="w-full md:w-1/2 text-right">
              <h2 className="text-xl font-semibold text-gray-900">Total Outcome</h2>
              <p className="text-2xl font-bold text-[#674729]">Rp 5,566,684</p>
            </div>
          </div>
        </div>

        <div>
          <History />
        </div>
      </div>
    </Layout>
  );
};

export default TrackerPage;
