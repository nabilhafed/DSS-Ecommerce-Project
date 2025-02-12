import React, { useState, useEffect } from 'react'; // Importation des hooks React
import LineChart from '../../charts/LineChart01'; // Composant graphique
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

function DashboardCard11() {
  const [consumptionByCategory, setConsumptionByCategory] = useState([]); // État pour stocker les données
  const [loading, setLoading] = useState(true); // État pour gérer le chargement

  // Récupération des données de consommation par catégorie depuis l'API
  useEffect(() => {
    async function fetchConsumptionByCategory() {
      try {
        const response = await fetch("http://localhost:5059/api/Products/GetProductDetailsConsumptionByRegion"); // URL de l'API
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Vérification que la structure des données est correcte
        if (data.consumptionByCategory && Array.isArray(data.consumptionByCategory)) {
          setConsumptionByCategory(data.consumptionByCategory); // Mise à jour des données
        } else {
          console.error("Invalid data structure.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Fin du chargement
      }
    }

    fetchConsumptionByCategory();
  }, []); // Exécution au chargement du composant

  // Vérification de la présence de données avant de mapper
  if (loading) {
    return (
      <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
        <p className="text-center text-gray-500">Chargement des données...</p>
      </div>
    );
  }

  if (consumptionByCategory.length === 0) {
    return (
      <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
        <p className="text-center text-gray-500">Aucune donnée disponible.</p>
      </div>
    );
  }

  // Préparation des labels et des données pour le graphique
  const labels = consumptionByCategory.map((_, index) => `Catégorie ${index + 1}`); // Labels pour les indices
  const totalConsumptionRates = consumptionByCategory.map((category) => category.totalConsumptionRate); // Taux de consommation
  const totalProductsInCategory = consumptionByCategory.map((category) => category.totalProductsInCategory); // Nombre de produits
  const regionNames = consumptionByCategory.map((category) => category.category); // Noms des régions

  // Configuration des données pour le graphique
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Consommation totale par catégorie',
        data: totalConsumptionRates,
        fill: true,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null; // Protection contre les cas où chartArea n'est pas disponible
          }
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: `rgba(${hexToRGB(tailwindConfig().theme.colors.green[500])}, 0.2)` },
            { stop: 1, color: `rgba(${hexToRGB(tailwindConfig().theme.colors.green[500])}, 0)` },
          ]);
        },
        borderColor: tailwindConfig().theme.colors.green[500],
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: tailwindConfig().theme.colors.green[500],
        tension: 0.4, // Courbure de la ligne
      },
      {
        label: 'Nombre de produits par catégorie',
        data: totalProductsInCategory,
        fill: true,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null;
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
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Consommation par Catégorie</h2>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">
          Total Catégories
        </div>
        <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          {consumptionByCategory.length}
        </div>
      </div>
      <div className="grow max-h-[200px]">
        <LineChart data={chartData} width={389} height={200} />
      </div>

      {/* Affichage des noms des régions sous le graphique */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Régions</h3>
        <div className="flex flex-wrap gap-2">
          {regionNames && regionNames.length > 0 ? (
            regionNames.map((region, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
                {region}
              </span>
            ))
          ) : (
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Aucune région disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard11;
