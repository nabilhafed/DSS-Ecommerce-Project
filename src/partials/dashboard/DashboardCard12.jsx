import React, { forwardRef, useState, useEffect } from 'react';
import DoughnutChart from '../../charts/DoughnutChart'; // Ensure this component exists

// Import utilities
import { tailwindConfig } from '../../utils/Utils';

const DashboardCard12 = forwardRef((props, ref) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data from the API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("http://localhost:5059/api/Products/GetProductDetailsConsumptionByRegion"); // Replace with your API URL
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Data fetched:", data);

        // Validate and map the data to the required format
        if (Array.isArray(data.consumptionByCategory)) {
          const formattedCategories = data.consumptionByCategory.map((item) => ({
            category: item.category,
            productCount: item.totalProductsInCategory,
          }));
          setCategories(formattedCategories);
        } else {
          console.error("Invalid data structure.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Function to generate dynamic colors for the chart
  const generateColors = (count) => {
    const colors = [];
    const step = Math.floor(360 / count); // Spread evenly across the color spectrum
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${i * step}, 70%, 50%)`); // Colors in HSL
    }
    return colors;
  };

  // Prepare data for the chart
  const backgroundColors = generateColors(categories.length);
  const hoverColors = backgroundColors.map((color) =>
    color.replace('50%', '60%')
  ); // Slightly lighter colors for hover effect

  const chartData = {
    labels: categories.map((category) => category.category || "Unknown"),
    datasets: [
      {
        label: 'Product Categories Distribution',
        data: categories.map((category) => category.productCount || 0),
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverColors,
        borderWidth: 0,
      },
    ],
  };

  // Chart options to hide the legend
  const chartOptions = {
    plugins: {
      legend: {
        display: false, // Hides the legend below the chart
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div
      ref={ref} // Attach ref for scrolling
      className="flex flex-col col-span-full sm:col-span-6 lg:col-span-8 xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl"
    >
      <header className="px-12 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Product Categories Distribution
        </h2>
      </header>
      {/* Show loading message or the chart */}
      {loading ? (
        <p className="text-center text-gray-500">Loading data...</p>
      ) : categories.length > 0 ? (
        <DoughnutChart data={chartData} options={chartOptions} width={389} height={260} />
      ) : (
        <p className="text-center text-gray-500">No data available</p>
      )}
    </div>
  );
});

export default DashboardCard12;
