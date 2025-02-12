import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import EditMenu from '../../components/DropdownEditMenu';

// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

function DashboardCard01() {
  const [categories, setCategories] = useState([]);
  const [totalNumber, settotalNumber] = useState([]);

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("http://localhost:5059/api/Products/getProductDetails");
        const data = await response.json();

        console.log("Received data:", data);

        if (data && Array.isArray(data.products)) {
          setCategories(data.products);
          settotalNumber(data.totalProducts || data.products.length);
        } else {
          console.error("Invalid data structure or no products found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchCategories();
  }, []);

  // Normalisation des catégories pour garantir 26 emplacements
  const normalizeData = (data, slots = data.length) => {
    if (data.length === slots) return data;

    if (data.length > slots) {
      const step = Math.ceil(data.length / slots);
      return data.filter((_, index) => index % step === 0).slice(0, slots);
    } else {
      const fillCount = slots - data.length;
      const filler = Array(fillCount).fill({ discountedPrice: 0, actualPrice: 0 });
      return [...data, ...filler];
    }
  };

  // Normaliser les catégories
  const normalizedCategories = normalizeData(categories);

  // Génération des indices pour l'axe X
  const labels = normalizedCategories.map((_, index) => index + 1); // Indices de 1 à 26
  const discountedPrices = normalizedCategories.map((product) => product.discountedPrice || 0);
  const actualPrices = normalizedCategories.map((product) => product.actualPrice || 0);

  const chartData = {
    labels: labels, // Utilisation des indices comme labels
    datasets: [
      {
        data: discountedPrices,
        fill: true,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: `rgba(${hexToRGB(tailwindConfig().theme.colors.violet[500])}, 0)` },
            { stop: 1, color: `rgba(${hexToRGB(tailwindConfig().theme.colors.violet[500])}, 0.2)` },
          ]);
        },
        borderColor: tailwindConfig().theme.colors.violet[500],
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.violet[500],
        tension: 0.2,
      },
      {
        data: actualPrices,
        borderColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.gray[500])}, 0.25)`,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.gray[500])}, 0.25)`,
        tension: 0.2,
      },
    ],
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              // Récupérer l'index du produit
              const productIndex = tooltipItem.dataIndex;
              const product = normalizedCategories[productIndex];

              // Retourner le nom du produit et la valeur de prix
              const label = tooltipItem.datasetIndex === 0 ? 'Discounted Price' : 'Actual Price';
              return `${product.productName}: ${label} - ${tooltipItem.raw}`;
            }
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-12 xl:col-span-12 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Products</h2>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Total Products</div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">{totalNumber}</div>
        </div>
      </div>
      <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
        {categories.length > 0 ? (
          <LineChart data={chartData} width={600} height={200} />
        ) : (
          <p className="text-center text-gray-500">Loading chart data...</p>
        )}
      </div>
    </div>
  );
}

export default DashboardCard01;
