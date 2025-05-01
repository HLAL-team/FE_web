import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const BarChart = ({ activeTab, selectedWeek, selectedMonth, selectedYear, userFullname }) => {
    const [categories, setCategories] = useState([]);
    const [series, setSeries] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalOutcome, setTotalOutcome] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    console.error('No authentication token found');
                    setError('Authentication required. Please log in again.');
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
                        console.log('Transactions received:', data.data);
                        setTransactions(data.data || []);
                        
                        const { income, outcome } = calculateTotals(data.data || []);
                        setTotalIncome(income);
                        setTotalOutcome(outcome);
                    } else {
                        console.error('Failed to fetch data:', data.message);
                        setError('Failed to load data: ' + data.message);
                    }
                } else {
                    if (response.status === 403) {
                        setError('Access denied. You may need to log in again.');
                    } else {
                        setError(`Failed to load data: HTTP error! Status: ${response.status}`);
                    }
                    console.error('Error fetching data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(`Failed to load data: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const calculateTotals = (transactions) => {
        let income = 0;
        let outcome = 0;

        if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
            return { income, outcome };
        }

        transactions.forEach((transaction) => {
            try {
                if (!transaction) return;

                const amount = parseFloat(transaction.amount) || 0;

                if (transaction.transactionType === "Transfer") {
                    const isIncomingTransfer =
                        userFullname &&
                        transaction.recipient &&
                        transaction.recipient.toLowerCase() === userFullname.toLowerCase();

                    if (isIncomingTransfer) {
                        income += amount;
                    } else {
                        outcome += amount;
                    }
                } else if (transaction.transactionType === "Top Up") {
                    income += amount;
                } else {
                    outcome += amount;
                }
            } catch (error) {
                console.error("Error processing transaction for totals:", error);
            }
        });

        return { income, outcome };
    };

    useEffect(() => {
        if (!transactions || transactions.length === 0) {
            console.log('No transactions available');
            setCategories([]);
            setSeries([
                { name: 'Income', data: [], color: '#057268' },
                { name: 'Outcome', data: [], color: '#674729' },
            ]);
            return;
        }

        try {
            let tempCategories = [];
            let incomeData = [];
            let outcomeData = [];

            if (activeTab === 'Weekly') {
                const aggregatedData = aggregateByWeek(transactions);
                
                const weeks = Object.keys(aggregatedData);
                tempCategories = weeks;
                
                incomeData = weeks.map(week => aggregatedData[week].income);
                outcomeData = weeks.map(week => aggregatedData[week].outcome);
            } 
            else if (activeTab === 'Monthly') {
                const aggregatedData = aggregateByMonth(transactions);
                
                const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
                const ranges = [
                    '1-7', '8-14', '15-21', `22-${daysInMonth}`
                ];
                
                tempCategories = ranges;
                
                incomeData = ranges.map((range) => {
                    const [start, end] = range.split('-').map(Number);
                    let income = 0;
                    
                    for (let day = start; day <= end; day++) {
                        transactions.forEach(transaction => {
                            const transactionDate = new Date(transaction.transactionDate);
                            
                            if (transactionDate.getFullYear() === selectedYear &&
                                transactionDate.getMonth() === selectedMonth &&
                                transactionDate.getDate() === day) {
                                
                                const amount = parseFloat(transaction.amount) || 0;
                                
                                if (transaction.transactionType === "Top Up") {
                                    income += amount;
                                } else if (transaction.transactionType === "Transfer") {
                                    const isIncomingTransfer =
                                        userFullname &&
                                        transaction.recipient &&
                                        transaction.recipient.toLowerCase() === userFullname.toLowerCase();
                                        
                                    if (isIncomingTransfer) {
                                        income += amount;
                                    }
                                }
                            }
                        });
                    }
                    
                    return income;
                });
                
                outcomeData = ranges.map((range) => {
                    const [start, end] = range.split('-').map(Number);
                    let outcome = 0;
                    
                    for (let day = start; day <= end; day++) {
                        transactions.forEach(transaction => {
                            const transactionDate = new Date(transaction.transactionDate);
                            
                            if (transactionDate.getFullYear() === selectedYear &&
                                transactionDate.getMonth() === selectedMonth &&
                                transactionDate.getDate() === day) {
                                
                                const amount = parseFloat(transaction.amount) || 0;
                                
                                if (transaction.transactionType !== "Top Up") {
                                    if (transaction.transactionType === "Transfer") {
                                        const isIncomingTransfer =
                                            userFullname &&
                                            transaction.recipient &&
                                            transaction.recipient.toLowerCase() === userFullname.toLowerCase();
                                            
                                        if (!isIncomingTransfer) {
                                            outcome += amount;
                                        }
                                    } else {
                                        outcome += amount;
                                    }
                                }
                            }
                        });
                    }
                    
                    return outcome;
                });
            } 
            else if (activeTab === 'Quarterly') {
                const aggregatedData = aggregateByQuarter(transactions);
                
                const quarters = Object.keys(aggregatedData);
                tempCategories = quarters;
                
                incomeData = quarters.map(quarter => aggregatedData[quarter].income);
                outcomeData = quarters.map(quarter => aggregatedData[quarter].outcome);
            }

            setCategories(tempCategories);
            setSeries([
                { name: 'Income', data: incomeData, color: '#057268' },
                { name: 'Outcome', data: outcomeData, color: '#674729' },
            ]);
            
        } catch (error) {
            console.error('Error processing chart data:', error);
            setError('Failed to process chart data');
        }
    }, [activeTab, selectedWeek, selectedMonth, selectedYear, transactions, userFullname]);

    const aggregateByWeek = (transactions) => {
        const result = {
            "Week 1": { income: 0, outcome: 0 },
            "Week 2": { income: 0, outcome: 0 },
            "Week 3": { income: 0, outcome: 0 },
            "Week 4": { income: 0, outcome: 0 },
        };

        if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
            return result;
        }

        transactions.forEach((transaction) => {
            try {
                if (!transaction || !transaction.transactionDate) {
                    console.log("Invalid transaction data:", transaction);
                    return;
                }

                const date = new Date(transaction.transactionDate);

                // Check if date is valid
                if (isNaN(date.getTime())) {
                    console.log("Invalid date:", transaction.transactionDate);
                    return;
                }

                const day = date.getDate();
                const weekNumber = Math.min(4, Math.max(1, Math.ceil(day / 7)));
                const weekKey = `Week ${weekNumber}`;

                if (!result[weekKey]) {
                    result[weekKey] = { income: 0, outcome: 0 };
                }

                const amount = parseFloat(transaction.amount) || 0;

                if (transaction.transactionType === "Transfer") {
                    const isIncomingTransfer =
                        userFullname &&
                        transaction.recipient &&
                        transaction.recipient.toLowerCase() === userFullname.toLowerCase();

                    if (isIncomingTransfer) {
                        result[weekKey].income += amount;
                    } else {
                        result[weekKey].outcome += amount;
                    }
                } else if (transaction.transactionType === "Top Up") {
                    result[weekKey].income += amount;
                } else {
                    result[weekKey].outcome += amount;
                }
            } catch (error) {
                console.error(
                    "Error processing weekly transaction:",
                    error,
                    transaction
                );
            }
        });

        return result;
    };

    const aggregateByMonth = (transactions) => {
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const result = {};
        for (let i = 0; i < 12; i++) {
            result[monthNames[i]] = { income: 0, outcome: 0 };
        }

        if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
            return result;
        }

        transactions.forEach((transaction) => {
            try {
                if (!transaction || !transaction.transactionDate) {
                    console.log("Invalid transaction data:", transaction);
                    return;
                }

                const date = new Date(transaction.transactionDate);

                if (isNaN(date.getTime())) {
                    console.log("Invalid date:", transaction.transactionDate);
                    return;
                }

                const monthIndex = date.getMonth();
                if (monthIndex < 0 || monthIndex >= 12) {
                    console.log("Invalid month index:", monthIndex);
                    return;
                }

                const monthName = monthNames[monthIndex];

                if (!result[monthName]) {
                    result[monthName] = { income: 0, outcome: 0 };
                }

                const amount = parseFloat(transaction.amount) || 0;

                if (transaction.transactionType === "Transfer") {
                    const isIncomingTransfer =
                        userFullname &&
                        transaction.recipient &&
                        transaction.recipient.toLowerCase() === userFullname.toLowerCase();

                    if (isIncomingTransfer) {
                        result[monthName].income += amount;
                    } else {
                        result[monthName].outcome += amount;
                    }
                } else if (transaction.transactionType === "Top Up") {
                    result[monthName].income += amount;
                } else {
                    result[monthName].outcome += amount;
                }
            } catch (error) {
                console.error(
                    "Error processing monthly transaction:",
                    error,
                    transaction
                );
            }
        });

        return result;
    };

    const aggregateByQuarter = (transactions) => {
        const result = {
            "Q1": { income: 0, outcome: 0 },
            "Q2": { income: 0, outcome: 0 },
            "Q3": { income: 0, outcome: 0 },
            "Q4": { income: 0, outcome: 0 },
        };

        if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
            return result;
        }

        transactions.forEach((transaction) => {
            try {
                if (!transaction || !transaction.transactionDate) {
                    console.log("Invalid transaction data:", transaction);
                    return;
                }

                const date = new Date(transaction.transactionDate);

                if (isNaN(date.getTime())) {
                    console.log("Invalid date:", transaction.transactionDate);
                    return;
                }

                const month = date.getMonth();
                let quarter;

                if (month >= 0 && month <= 2) {
                    quarter = "Q1";
                } else if (month >= 3 && month <= 5) {
                    quarter = "Q2";
                } else if (month >= 6 && month <= 8) {
                    quarter = "Q3";
                } else {
                    quarter = "Q4";
                }

                if (!result[quarter]) {
                    result[quarter] = { income: 0, outcome: 0 };
                }

                const amount = parseFloat(transaction.amount) || 0;

                if (transaction.transactionType === "Transfer") {
                    const isIncomingTransfer =
                        userFullname &&
                        transaction.recipient &&
                        transaction.recipient.toLowerCase() === userFullname.toLowerCase();

                    if (isIncomingTransfer) {
                        result[quarter].income += amount;
                    } else {
                        result[quarter].outcome += amount;
                    }
                } else if (transaction.transactionType === "Top Up") {
                    result[quarter].income += amount;
                } else {
                    result[quarter].outcome += amount;
                }
            } catch (error) {
                console.error(
                    "Error processing quarterly transaction:",
                    error,
                    transaction
                );
            }
        });

        return result;
    };

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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-4">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="px-24">
            <Chart options={options} series={series} type="bar" height={400} />
            
            <div className="flex justify-between mt-6">
                <div className="w-1/2 mr-2 bg-white rounded-lg shadow p-4 border-l-4 border-l-emerald-600">
                    <h3 className="text-gray-500 text-sm mb-1">Total Income</h3>
                    <p className="text-emerald-700 font-bold text-lg">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="w-1/2 ml-2 bg-white rounded-lg shadow p-4 border-l-4 border-l-amber-600">
                    <h3 className="text-gray-500 text-sm mb-1">Total Outcome</h3>
                    <p className="text-amber-700 font-bold text-lg">{formatCurrency(totalOutcome)}</p>
                </div>
            </div>
            
            <div className="flex justify-center mt-4">
                <div className="flex items-center mx-3">
                    <div className="w-4 h-4 rounded bg-emerald-700 mr-2"></div>
                    <span className="text-sm">Income</span>
                </div>
                <div className="flex items-center mx-3">
                    <div className="w-4 h-4 rounded bg-amber-800 mr-2"></div>
                    <span className="text-sm">Outcome</span>
                </div>
            </div>
        </div>
    );
};

export default BarChart;