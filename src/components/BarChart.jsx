import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const BarChart = ({ activeTab, selectedWeek, selectedMonth, selectedYear }) => {
    const [categories, setCategories] = useState([]);
    const [series, setSeries] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    console.error('No authentication token found');
                    return;
                }

                const response = await fetch('https://kelompok2.serverku.org/api/transactions', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.status) {
                        console.log('Transaksi diterima:', data.data);
                        setTransactions(data.data || []);
                    } else {
                        console.error('Failed to fetch data:', data.message);
                    }
                } else {
                    console.error('Error fetching data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

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

        // Proses transaksi untuk setiap hari
        transactions.forEach((transaction) => {
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

        // Menangani tab Monthly
        if (activeTab === 'Monthly') {
            // Menentukan rentang 4 kolom untuk Monthly (7 hari per kolom)
            const ranges = [
                '1-7', '8-14', '15-21', `22-${daysInMonth}`  // Kolom 4 menggunakan daysInMonth yang benar
            ];

            tempCategories = ranges;

            // Hitung total income dan outcome untuk setiap rentang
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

        // Menangani tab Weekly
        else if (activeTab === 'Weekly') {
            const [start, end] = selectedWeek.split('-').map(Number);
            const adjustedEnd = Math.min(end, daysInMonth);
            tempCategories = Array.from({ length: adjustedEnd - start + 1 }, (_, i) => (start + i).toString());

            incomeData = tempCategories.map((day) => incomeMap[parseInt(day)] || 0);
            outcomeData = tempCategories.map((day) => outcomeMap[parseInt(day)] || 0);
        } 

        // Menangani tab Quarterly
        else if (activeTab === 'Quarterly') {
            tempCategories = ['Q1', 'Q2', 'Q3', 'Q4'];
            incomeData = [];
            outcomeData = [];
        }

        // Memperbarui kategori dan data di state
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
        <div className="px-24">
            <Chart options={options} series={series} type="bar" height={400} />
        </div>
    );
};

export default BarChart;
