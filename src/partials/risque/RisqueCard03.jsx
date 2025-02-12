import React, { useEffect, useState } from 'react';

function RisqueCard03() {
  const [data, setData] = useState([]);
  const [topCategory, setTopCategory] = useState(null);  // Nouvelle variable d'état pour la catégorie avec la plus grande espérance
  const [esperanceTable, setEsperanceTable] = useState({});  // Ajouter esperanceTable ici

  useEffect(() => {
    fetch('http://localhost:5059/api/Products/GetProductCategoriesByRegionAndOtherCriteria') // Remplacez par l'URL réelle de votre API
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        processTableData(data);
      });
  }, []);

  const processTableData = (apiData) => {
    const regions = [...new Set(apiData.map((item) => item.regionName))];
    const categories = [...new Set(apiData.map((item) => item.productCategory))];

    const table = {};
    const probabilities = {};

    // Calculer les probabilités normalisées
    let totalProbability = 0;

    // Calcul des probabilités normalisées pour chaque région
    regions.forEach((region) => {
      let regionTotalConsumptionRate = apiData
        .filter((item) => item.regionName === region)
        .reduce((sum, item) => sum + item.totalConsumptionRate, 0);

      let regionPopulationDensity = apiData
        .filter((item) => item.regionName === region)
        .reduce((sum, item) => sum + item.populationDensity, 0);

      const probability = regionTotalConsumptionRate / regionPopulationDensity;
      probabilities[region] = probability;
      totalProbability += probability;
    });

    // Normaliser les probabilités
    regions.forEach((region) => {
      probabilities[region] = probabilities[region] / totalProbability;
    });

    // Initialisation du tableau avec les données des produits
    categories.forEach((category) => {
      table[category] = {};
      regions.forEach((region) => {
        table[category][region] = 0;
      });
    });

    apiData.forEach((item) => {
      table[item.productCategory][item.regionName] = item.totalProducts;
    });

    // Calcul des espérances mathématiques pour chaque catégorie
    const esperance = {};
    categories.forEach((category) => {
      let esperanceValue = 0;
      regions.forEach((region) => {
        esperanceValue += table[category][region] * probabilities[region];
      });
      esperance[category] = esperanceValue;
    });

    // Mettre à jour l'état de l'espérance
    setEsperanceTable(esperance);

    // Trouver la catégorie avec la plus grande espérance
    const maxEsperanceCategory = Object.keys(esperance).reduce((maxCategory, category) => 
      esperance[category] > esperance[maxCategory] ? category : maxCategory
    );

    setTopCategory(maxEsperanceCategory); // Mettre à jour la catégorie avec la plus grande espérance
  };

  return (
    <div className="col-span-full xl:col-span-12 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Catégorie avec la plus grande espérance
        </h2>
      </header>
      <div className="p-3">
        {/* Afficher la catégorie avec la plus grande espérance */}
        {topCategory && (
          <div className="mt-4 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
            La catégorie avec la plus grande espérance est: {topCategory}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Cette catégorie a une espérance mathématique de:{" "}
            {esperanceTable[topCategory].toFixed(2)}
          </p>
        </div>
        
        )}
      </div>
    </div>
  );
}

export default RisqueCard03;
