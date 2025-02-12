import React, { useEffect, useState } from 'react';
import { tailwindConfig } from '../../utils/Utils'; // Tailwind config for colors
import LineChart from '../../charts/LineChart02'; // Ensure this component exists and is correctly set up

const DashboardCard12 = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching the data from the API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("http://localhost:5059/api/Products/GetProductDetailsConsumptionByRegion");
        const data = await response.json();
        console.log("Fetched data:", data); // Log to check the data format

        if (Array.isArray(data.consumptionByCategory)) {
          const formattedCategories = data.consumptionByCategory.map((item) => ({
            category: item.category,
            totalProductsInCategory: item.totalProductsInCategory,
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

  // Preparing the chart data
  const chartData = {
    labels: categories.map((category) => category.category),
    datasets: [
      {
        label: 'Products in Category',
        data: categories.map((category) => category.totalProductsInCategory),
        borderColor: tailwindConfig().theme.colors.green[500],
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.green[500],
        pointHoverBackgroundColor: tailwindConfig().theme.colors.green[500],
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Product Categories Distribution</h2>
      </header>
      
      {/* Show loading message or the chart */}
      {loading ? (
        <p className="text-center text-gray-500">Loading data...</p>
      ) : categories.length > 0 ? (
        <LineChart data={chartData} width={595} height={248} />
      ) : (
        <p className="text-center text-gray-500">No data available</p>
      )}
    </div>
  );
};

export default DashboardCard12;
