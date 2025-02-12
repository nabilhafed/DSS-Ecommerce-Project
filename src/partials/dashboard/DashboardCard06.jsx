import React, { forwardRef, useState, useEffect } from 'react';
import DoughnutChart from '../../charts/DoughnutChart';

// Import utilities
import { tailwindConfig } from '../../utils/Utils';

const DashboardCard06 = forwardRef((props, ref) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer les catégories depuis l'API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("http://localhost:5059/api/Products/categories"); // Remplacez par l'URL de votre API
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Catégories récupérées:", data);

        // Vérifiez que les données sont valides
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Structure des données invalide.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Fonction pour générer des couleurs dynamiques
  const generateColors = (count) => {
    const colors = [];
    const step = Math.floor(360 / count); // Répartition uniforme dans le spectre de couleurs
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${i * step}, 70%, 50%)`); // Couleurs en HSL
    }
    return colors;
  };

  // Préparer les données pour le graphique
  const backgroundColors = generateColors(categories.length);
  const hoverColors = backgroundColors.map(color => color.replace('50%', '60%')); // Version plus lumineuse pour hover

  const chartData = {
    labels: categories.map((category) => category.category || "Inconnu"),
    datasets: [
      {
        label: 'Nombre de produits :  ',
        data: categories.map((category) => category.productCount || 0),
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverColors,
        borderWidth: 0,
      },
    ],
  };

  return (
    <div
      ref={ref} // Attach ref to enable scrolling focus
      className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl"
    >
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Répartition des Catégories</h2>
      </header>
      {/* Afficher un message de chargement ou le graphique */}
      {loading ? (
        <p className="text-center text-gray-500">Chargement des données...</p>
      ) : categories.length > 0 ? (
        <DoughnutChart data={chartData} width={389} height={260} />
      ) : (
        <p className="text-center text-gray-500">Aucune donnée disponible</p>
      )}
    </div>
  );
});

export default DashboardCard06;
