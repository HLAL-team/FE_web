import React, { useState, useEffect } from 'react';
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';
import { space } from 'postcss/lib/list';

const BarChart = () => {
    const months = [
        { name: "January", value: 0 },
        { name: "February", value: 1 },
        { name: "March", value: 2 },
        { name: "April", value: 3 },
        { name: "May", value: 4 },
        { name: "June", value: 5 },
        { name: "July", value: 6 },
        { name: "August", value: 7 },
        { name: "September", value: 8 },
        { name: "October", value: 9 },
        { name: "November", value: 10 },
        { name: "December", value: 11 }
    ];

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Default to current month
    const [daysInMonth, setDaysInMonth] = useState([]);
    const [ranges, setRanges] = useState([]);

    // Function to calculate days in month
    const getDaysInMonth = (month, year) => {
        const date = new Date(year, month + 1, 0); // Get the last date of the selected month
        return date.getDate(); // Return the number of days in that month
    };

    // Function to group days into ranges (1-7, 8-14, etc.)
    const getDateRanges = (numDays) => {
        const ranges = [];
        for (let i = 1; i <= numDays; i += 7) {
            const end = Math.min(i + 6, numDays); // Ensure the last range doesn't exceed the days in the month
            ranges.push(`${i}-${end}`);
        }
        return ranges;
    };

    // Handle change in month selection
    const handleMonthChange = (e) => {
        const monthIndex = e.target.value;
        setSelectedMonth(monthIndex);
    };

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const days = getDaysInMonth(selectedMonth, currentYear);
        setDaysInMonth(days);
        const dateRanges = getDateRanges(days); // Generate date ranges (1-7, 8-14, etc.)
        setRanges(dateRanges);
    }, [selectedMonth]);

    // Sample data for income and expense
    const options = {
        series: [
            {
                name: "Income",
                color: "#057268",
                data: [2000, 3000, 2500, 3500, 4000, 4500].slice(0, ranges.length),
                // data: Array.from({ length: ranges.length }, () => Math.floor(Math.random() * 5000) + 1000),
            },
            {
                name: "Outcome",
                // data: Array.from({ length: ranges.length }, () => Math.floor(Math.random() * 3000) + 500),
                color: "#674729",
                data: [1000, 1500, 1200, 1600, 2000, 1800].slice(0, ranges.length),
            }
        ],
        chart: {
            type: "bar",
            width: "100%",
            height: 400,
            toolbar: {
                show: false,
            },
            animations: {
                enabled: true,
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150,
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350,
                }
            },
        },
        xaxis: {
            categories: ranges, // Ranges of dates (1-7, 8-14, etc.)
        },

        tooltip: {
            shared: true,
            intersect: false,
            formatter: function (value) {
                return "Rp " + value;
            }
        },
        fill: {
            opacity: 1,
        },
        plotOptions: {
            bar: {
                horizontal: false, 
                columnWidth: "20%",
                borderRadius: 6,
            },
        },
        dataLabels: { enabled: false },
        grid: {
            show: true,
            padding: {
                left: 0,
                right: 0,
                top: 10,
            },
        },
    };

    return (

        <div className="px-24 ">

            {/* Dropdown for selecting month */}
            <div className="mb-4 text-right">
                <select
                    id="month"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="p-2 border rounded-lg bg-primary text-white"
                >
                    {months.map((month) => (
                        <option key={month.value} value={month.value}>
                            {month.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* ApexCharts Bar Chart */}
            <div id="chart">
                <Chart
                    options={options}
                    series={options.series}
                    type="bar"
                    width="100%"
                    height={400}
                />
            </div>
        </div>
    );
};
export default BarChart;
