import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const BarChart = ({ viewMode }) => {
  const [categories, setCategories] = useState([]);
  const [seriesData, setSeriesData] = useState({ income: [], outcome: [] });

  useEffect(() => {
    generateChartData();
  }, [viewMode]);

  const generateChartData = () => {
    let newCategories = [];
    let incomeData = [];
    let outcomeData = [];

    if (viewMode === 'Daily') {
      newCategories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      incomeData = [500, 700, 800, 600, 900, 300, 400];
      outcomeData = [300, 400, 500, 300, 700, 200, 300];
    } else if (viewMode === 'Weekly') {
      newCategories = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      incomeData = [2000, 2500, 3000, 1500];
      outcomeData = [1200, 1500, 2000, 1000];
    } else if (viewMode === 'Monthly') {
      newCategories = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      incomeData = [2000, 2500, 2200, 2700, 3000, 3500, 4000, 3800, 3600, 3900, 4100, 4300];
      outcomeData = [1500, 1800, 1600, 1900, 2100, 2500, 2700, 2600, 2500, 2700, 2800, 3000];
    } else if (viewMode === 'Quarterly') {
      newCategories = ['Q1', 'Q2', 'Q3', 'Q4'];
      incomeData = [7000, 9000, 11000, 13000];
      outcomeData = [5000, 6000, 8000, 9000];
    }

    setCategories(newCategories);
    setSeriesData({
      income: incomeData,
      outcome: outcomeData,
    });
  };

  const options = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
    },
    xaxis: {
      categories: categories,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '35%',
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    fill: { opacity: 1 },
    colors: ['#057268', '#674729'],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `Rp ${val.toLocaleString()}`,
      },
    },
  };

  const series = [
    { name: 'Income', data: seriesData.income },
    { name: 'Outcome', data: seriesData.outcome },
  ];

  return (
    <div className="px-24">
      <Chart options={options} series={series} type="bar" height={400} />
    </div>
  );
};

export default BarChart;
