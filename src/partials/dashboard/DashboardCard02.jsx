import React, { useState, useEffect } from 'react'; // Importation des hooks React
import LineChart from '../../charts/LineChart01';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

function DashboardCard02() {
  const [categories, setCategories] = useState([]); // Initialisation du state
  const [loading, setLoading] = useState(true); // Gestion du chargement

  // Récupération des données des catégories depuis l'API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("http://localhost:5059/api/Products/GetProductsByCategory"); // URL de l'API
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          setCategories(data); // Mise à jour des catégories
        } else {
          console.error("Invalid data structure.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Fin du chargement
      }
    }

    fetchCategories();
  }, []); // Exécuter une seule fois au chargement du composant

  // Vérification que les catégories existent
  const labels = categories.map((_, index) => `Catégorie ${index + 1}`); // Labels pour les indices
  const productCounts = categories.map((category) => category.productCount || 0); // Comptes des produits
  const categoriesminPrice = categories.map((category) => category.minPrice || 0); // Valeur des prix minimum
  const categoriesmaxPrice = categories.map((category) => category.maxPrice || 0); // Valeur des prix maximum

  // Configuration des données pour le graphique
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: categoriesminPrice,
        fill: true,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null; // Protection contre les cas où chartArea n'est pas disponible
          }
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: `rgba(${hexToRGB(tailwindConfig().theme.colors.blue[500])}, 0.2)` },
            { stop: 1, color: `rgba(${hexToRGB(tailwindConfig().theme.colors.blue[500])}, 0)` },
          ]);
        },
        borderColor: tailwindConfig().theme.colors.green[500],
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: tailwindConfig().theme.colors.blue[500],
        tension: 0.4, // Courbure de la ligne
      },
      {
        data: categoriesmaxPrice,
        fill: true,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null; // Protection contre les cas où chartArea n'est pas disponible
          }
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: `rgba(${hexToRGB(tailwindConfig().theme.colors.blue[500])}, 0.2)` },
            { stop: 1, color: `rgba(${hexToRGB(tailwindConfig().theme.colors.blue[500])}, 0)` },
          ]);
        },
        borderColor: tailwindConfig().theme.colors.blue[500],
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: tailwindConfig().theme.colors.blue[500],
        tension: 0.4, // Courbure de la ligne
      },
    ],
  };

  // Configuration des échelles (axes) pour forcer les deux datasets à partager la même échelle Y
  const chartOptions = {
    scales: {
      y: {
        min: Math.min(...categoriesminPrice, ...categoriesmaxPrice), // Valeur minimale pour l'axe Y
        max: Math.max(...categoriesminPrice, ...categoriesmaxPrice), // Valeur maximale pour l'axe Y
        beginAtZero: false, // Empêche de commencer à zéro
      },
    },
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Catégories</h2>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">
          Total Catégories
        </div>
        <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          {categories.length}
        </div>
      </div>
      <div className="grow max-h-[200px]">
        {loading ? (
          <p className="text-center text-gray-500">Chargement des données...</p>
        ) : categories.length > 0 ? (
          <LineChart data={chartData} options={chartOptions} width={389} height={200} />
        ) : (
          <p className="text-center text-gray-500">Aucune donnée disponible.</p>
        )}
      </div>
      {/* Affichage des noms des catégories sous le graphique */}
      {categories.length > 0 && (
        <div className="px-5 py-4 mt-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Noms des Catégories</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map((category, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold"
              >
                {category.category}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardCard02;
