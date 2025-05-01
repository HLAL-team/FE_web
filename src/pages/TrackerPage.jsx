import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import Chart from 'react-apexcharts';

const TrackerPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('Weekly');
  const [selectedWeek, setSelectedWeek] = useState('1-7');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]);

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

        params.append('month', selectedMonth + 1);
        params.append('year', selectedYear);

        const response = await fetch(`https://kelompok2.serverku.org/api/transactions?${params.toString()}`, {
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

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateWeeklyOptions = (month, year) => {
    const daysInMonth = getDaysInMonth(month, year);
    const weeks = [];

    weeks.push({ label: 'Week 1', value: '1-7' });
    weeks.push({ label: 'Week 2', value: '8-14' });
    weeks.push({ label: 'Week 3', value: '15-21' });
    const lastWeekEnd = daysInMonth === 28 ? '22-28' : daysInMonth === 29 ? '22-29' : '22-31';
    weeks.push({ label: 'Week 4', value: lastWeekEnd });

    return weeks;
  };

  const weeklyOptions = generateWeeklyOptions(selectedMonth, selectedYear);

  const filterTransactions = () => {
    return transactions.filter((item) => {
      const date = new Date(item.transactionDate);
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      if (year !== selectedYear) return false;

      if ((activeTab === 'Weekly' || activeTab === 'Monthly') && month !== selectedMonth) {
        return false;
      }

      if (activeTab === 'Weekly') {
        const [startDay, endDay] = selectedWeek.split('-').map(Number);
        return day >= startDay && day <= endDay;
      }

      if (activeTab === 'Quarterly') {
        const quarter = Math.floor(month / 3);
        const selectedQuarter = Math.floor(selectedMonth / 3);
        return quarter === selectedQuarter;
      }

      return month === selectedMonth;
    });
  };


  const filteredTransactions = filterTransactions().filter((item) => {
    if (transactionTypeFilter === 'All') return true;
    if (transactionTypeFilter === 'Income') return item.transactionType === 'Top Up';
    if (transactionTypeFilter === 'Outcome') return item.transactionType === 'Transfer';
    return true;
  });

  const calculatedIncome = filteredTransactions
    .filter((item) => item.transactionType === 'Top Up')
    .reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);

  const calculatedOutcome = filteredTransactions
    .filter((item) => item.transactionType === 'Transfer')
    .reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);

  useEffect(() => {
    let tempCategories = [];
    let incomeData = [];
    let outcomeData = [];

    const incomeMap = {};
    const outcomeMap = {};

    if (!transactions || transactions.length === 0) {
      console.log('Tidak ada transaksi');
      return;
    }

    filteredTransactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.transactionDate);
      const day = transactionDate.getDate();

      if (transaction.transactionType === 'Top Up') {
        if (!incomeMap[day]) incomeMap[day] = 0;
        incomeMap[day] += transaction.amount;
      } else if (transaction.transactionType === 'Transfer') {
        if (!outcomeMap[day]) outcomeMap[day] = 0;
        outcomeMap[day] += transaction.amount;
      }
    });

    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    if (activeTab === 'Monthly') {
      const ranges = [
        '1-7', '8-14', '15-21', `22-${daysInMonth}`
      ];

      tempCategories = ranges;

      incomeData = ranges.map((range) => {
        const [start, end] = range.split('-').map(Number);
        let income = 0;
        for (let i = start; i <= end; i++) {
          income += incomeMap[i] || 0;
        }
        return income;
      });

      outcomeData = ranges.map((range) => {
        const [start, end] = range.split('-').map(Number);
        let outcome = 0;
        for (let i = start; i <= end; i++) {
          outcome += outcomeMap[i] || 0;
        }
        return outcome;
      });
    }

    else if (activeTab === 'Weekly') {
      const [start, end] = selectedWeek.split('-').map(Number);
      const adjustedEnd = Math.min(end, daysInMonth);
      tempCategories = Array.from({ length: adjustedEnd - start + 1 }, (_, i) => (start + i).toString());

      incomeData = tempCategories.map((day) => incomeMap[parseInt(day)] || 0);
      outcomeData = tempCategories.map((day) => outcomeMap[parseInt(day)] || 0);
    }

    else if (activeTab === 'Quarterly') {
      tempCategories = ['Q1', 'Q2', 'Q3', 'Q4'];

      const incomeQuarter = [0, 0, 0, 0];
      const outcomeQuarter = [0, 0, 0, 0];

      filteredTransactions.forEach((transaction) => {
        const transactionDate = new Date(transaction.transactionDate);
        const month = transactionDate.getMonth();
        const quarterIndex = Math.floor(month / 3);

        if (transaction.transactionType === 'Top Up') {
          incomeQuarter[quarterIndex] += transaction.amount;
        } else if (transaction.transactionType === 'Transfer') {
          outcomeQuarter[quarterIndex] += transaction.amount;
        }
      });

      incomeData = incomeQuarter;
      outcomeData = outcomeQuarter;
    }


    setCategories(tempCategories);
    setSeries([
      { name: 'Income', data: incomeData, color: '#057268' },
      { name: 'Outcome', data: outcomeData, color: '#674729' },
    ]);
  }, [activeTab, selectedWeek, selectedMonth, selectedYear, transactions]);

  const options = {
    chart: {
      type: 'bar',
      height: 400,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '30%',
        borderRadius: 6,
      },
    },
    xaxis: {
      categories: categories,
    },
    tooltip: {
      y: {
        formatter: (val) => `Rp ${val.toLocaleString()}`,
      },
    },
    dataLabels: { enabled: false },
    grid: { show: true },
  };


  return (
    <Layout>
      <div>
        <Navbar />
        <div className="mx-8 dark:text-white">
          <div>
            <h2 className="text-4xl text-left font-bold">My Tracker</h2>
          </div>

          <div className="flex justify-center my-6">
            {['Weekly', 'Monthly', 'Quarterly'].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-2 mx-2 rounded-full ${activeTab === tab ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-700'
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

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

          <div className="px-24">
            <Chart options={options} series={series} type="bar" height={400} />
          </div>

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

          <div className="px-24 pb-16">
            {filteredTransactions.length === 0 ? (
              <p className="text-gray-500">No transactions found for the selected period.</p>
            ) : (
              <div className="overflow-x-auto">
                <div className="flex justify-center mb-4 gap-4">
                  {['All', 'Income', 'Outcome'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setTransactionTypeFilter(type)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${transactionTypeFilter === type
                          ? 'bg-teal-600 text-white'
                          : 'bg-white text-teal-700 border-teal-500'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <table className="text-left min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-teal-600 text-white">
                      <th className="py-2 px-4 border-b">Date</th>
                      <th className="py-2 px-4 border-b">Type</th>
                      <th className="py-2 px-4 border-b">Amount</th>
                      <th className="py-2 px-4 border-b">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction, index) => (
                      <tr key={index} className="text-gray-800 text-sm">
                        <td className="py-2 px-4 border-b">
                          {new Date(transaction.transactionDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-2 px-4 border-b">{transaction.transactionType}</td>
                        <td className="py-2 px-4 border-b">Rp {parseFloat(transaction.amount).toLocaleString()}</td>
                        <td className="py-2 px-4 border-b">{transaction.description || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrackerPage;