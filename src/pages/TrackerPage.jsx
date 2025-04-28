import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import History from '../components/History';
import BarChart from '../components/BarChart';

const TrackerPage = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalOutcome, setTotalOutcome] = useState(0);

  const [activeTab, setActiveTab] = useState('Weekly');
  const [selectedWeek, setSelectedWeek] = useState('1-7');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem('authToken');  
  
          if (!token) {
            console.error('No authentication token found');
            return;
          }
  
          const response = await fetch('http://localhost:8080/api/transactions', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,  
              'Content-Type': 'application/json'
            }
          });
  
          if (response.ok) {
            const data = await response.json();
            
            if (data.status) {
              setTotalIncome(data.totalIncome);
              setTotalOutcome(data.totalOutcome);
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
        }
      };
  
      fetchData();
    }, []);

  return (
    <Layout>
      <div>
        <Navbar />
        <div className='mx-8'>
          <div>
            <h2 className="text-4xl text-left font-semibold">Monthly Tracker</h2>
          </div>

          <div className="flex justify-center my-6">
            {['Weekly', 'Monthly', 'Quarterly'].map(tab => (
              <button
                key={tab}
                className={`px-6 py-2 mx-2 rounded-full ${activeTab === tab ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-700'}`}
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
                {['1-7', '8-14', '15-21', '22-28', '29-31'].map(week => (
                  <option key={week} value={week}>{week}</option>
                ))}
              </select>
            )}
            <select
              className="p-2 border rounded-lg"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
            <select
              className="p-2 border rounded-lg"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
          </div>

          <BarChart 
            activeTab={activeTab}
            selectedWeek={selectedWeek}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />

          <div className="flex justify-between gap-8 px-36 mt-4 mb-16 text-left">
            <div className="w-full md:w-1/2">
              <h2 className="text-xl font-semibold text-gray-900">Total Income</h2>
              <p className="text-2xl font-bold text-[#057268]">
                Rp {totalIncome.toLocaleString()}
              </p>
            </div>

            <div className="w-full md:w-1/2 text-right">
              <h2 className="text-xl font-semibold text-gray-900">Total Outcome</h2>
              <p className="text-2xl font-bold text-[#674729]">
                Rp {totalOutcome.toLocaleString()}
              </p>
            </div>
          </div>

          <History />
        </div>
      </div>
    </Layout>
  );
};

export default TrackerPage;

