import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import BarChart from '../components/BarChart';

const TrackerPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('Weekly');
  const [selectedWeek, setSelectedWeek] = useState('1-7');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('No authentication token found');
          return;
        }

        const params = new URLSearchParams();
        params.append('filterType', activeTab.toLowerCase());

        if (activeTab === 'Weekly') {
          params.append('week', selectedWeek);
        }

        params.append('month', selectedMonth + 1); // Bulan 1-indexed
        params.append('year', selectedYear);

        const response = await fetch(`http://localhost:8080/api/transactions?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status) {
            setTransactions(data.data);
          } else {
            console.error('Failed to fetch data:', data.message);
          }
        } else {
          if (response.status === 403) {
            console.error('Unauthorized access - token may be invalid or expired.');
          } else {
            console.error('Error fetching data:', response.statusText);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, selectedWeek, selectedMonth, selectedYear]);

  // Helper function to get days in month considering leap year for February
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate(); // Get last day of the month
  };

  // Helper function to generate weekly options based on month and year
  // Helper function to generate weekly options based on month and year
const generateWeeklyOptions = (month, year) => {
  const daysInMonth = getDaysInMonth(month, year);
  const weeks = [];

  // Week 1: 1-7
  weeks.push({ label: 'Week 1', value: '1-7' });
  // Week 2: 8-14
  weeks.push({ label: 'Week 2', value: '8-14' });
  // Week 3: 15-21
  weeks.push({ label: 'Week 3', value: '15-21' });
  // Week 4: 22-30 or 22-31 depending on month
  const lastWeekEnd = daysInMonth === 28 ? '22-28' : daysInMonth === 29 ? '22-29' : '22-31';
  weeks.push({ label: 'Week 4', value: lastWeekEnd });

  return weeks;
};

const weeklyOptions = generateWeeklyOptions(selectedMonth, selectedYear);


  // Function to filter transactions sesuai tab dan filter
  const filterTransactions = () => {
    return transactions.filter((item) => {
      const date = new Date(item.transactionDate);
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      if (year !== selectedYear) {
        return false; // Filter hanya berdasarkan tahun
      }

      if (activeTab === 'Weekly') {
        const [startDay, endDay] = selectedWeek.split('-').map(Number);
        return day >= startDay && day <= endDay;
      }

      if (activeTab === 'Quarterly') {
        // Group by quarter
        const quarter = Math.floor(month / 3); // Q1: 0, Q2: 1, Q3: 2, Q4: 3
        const selectedQuarter = Math.floor(selectedMonth / 3);
        return month >= selectedQuarter * 3 && month < (selectedQuarter + 1) * 3;
      }

      // Monthly default, sudah dicek bulan & tahun di atas
      return month === selectedMonth;
    });
  };

  const filteredTransactions = filterTransactions();

  const calculatedIncome = filteredTransactions
    .filter((item) => item.transactionType === 'Top Up')
    .reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);

  const calculatedOutcome = filteredTransactions
    .filter((item) => item.transactionType === 'Transfer')
    .reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);

  return (
    <Layout>
      <div>
        <Navbar />
        <div className="mx-8">
          <div>
            <h2 className="text-4xl text-left font-semibold">Monthly Tracker</h2>
          </div>

          {/* Tabs */}
          <div className="flex justify-center my-6">
            {['Weekly', 'Monthly', 'Quarterly'].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-2 mx-2 rounded-full ${
                  activeTab === tab ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-700'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Filter Dropdown */}
          <div className="flex justify-center gap-4 mb-8">
          {activeTab === 'Weekly' && (
  <select
    className="p-2 border rounded-lg"
    value={selectedWeek}
    onChange={(e) => setSelectedWeek(e.target.value)}
  >
    {weeklyOptions.map((week) => (
      <option key={week.value} value={week.value}>
        {week.label}
      </option>
    ))}
  </select>
)}

            {activeTab !== 'Quarterly' && (
              <>
                <select
                  className="p-2 border rounded-lg"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </>
            )}
            <select
              className="p-2 border rounded-lg"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Chart */}
          <BarChart
            activeTab={activeTab}
            selectedWeek={selectedWeek}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />

          {/* Total Income and Outcome */}
          <div className="flex justify-between gap-8 px-36 mt-4 mb-16 text-left">
            <div className="w-full md:w-1/2">
              <h2 className="text-xl font-semibold text-gray-900">Total Income</h2>
              <p className="text-2xl font-bold text-[#057268]">
                Rp {calculatedIncome.toLocaleString()}
              </p>
            </div>

            <div className="w-full md:w-1/2 text-right">
              <h2 className="text-xl font-semibold text-gray-900">Total Outcome</h2>
              <p className="text-2xl font-bold text-[#674729]">
                Rp {calculatedOutcome.toLocaleString()}
              </p>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default TrackerPage;
