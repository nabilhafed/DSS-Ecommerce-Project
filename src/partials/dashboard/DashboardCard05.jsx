import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto"; // Chart.js nécessaire
import Tooltip from "../../components/Tooltip"; // Replacez avec votre composant Tooltip

function DashboardCard05() {
  // État pour les données des catégories
  const [categoriesData, setCategoriesData] = useState([]);

  // Récupération des données depuis l'API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5059/api/Products/categories"); // Remplacez par votre URL d'API
        const data = await response.json();
        setCategoriesData(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchCategories();
  }, []);

  // Préparation des données pour le graphique
  const categories = categoriesData.map((item) => item.category);
  const productCounts = categoriesData.map((item) => item.productCount);

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: "Nombre de produits par catégorie",
        data: productCounts,
        backgroundColor: categories.map((_, idx) =>
          `rgba(${50 + idx * 30}, ${100 + idx * 30}, 200, 0.5)`
        ),
        borderColor: categories.map((_, idx) =>
          `rgba(${50 + idx * 30}, ${100 + idx * 30}, 200, 1)`
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Catégories",
        },
      },
      y: {
        title: {
          display: true,
          text: "Nombre de produits",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Nombre de Produits par Catégorie
        </h2>
        <Tooltip className="ml-2">
          <div className="text-xs text-center whitespace-nowrap">
            Graphique réalisé avec{" "}
            <a
              className="underline"
              href="https://www.chartjs.org/"
              target="_blank"
              rel="noreferrer"
            >
              Chart.js
            </a>
          </div>
        </Tooltip>
      </header>
      {categoriesData.length > 0 ? (
        <Bar data={chartData} options={chartOptions} width={595} height={248} />
      ) : (
        <div className="px-5 py-4">Chargement des données...</div>
      )}
    </div>
  );
}

export default DashboardCard05;
