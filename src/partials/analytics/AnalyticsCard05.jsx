import React, { useEffect, useState } from 'react';

function AnalyticsCard05() {
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState({});

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
    const esperanceTable = {};
    categories.forEach((category) => {
      let esperance = 0;
      regions.forEach((region) => {
        esperance += table[category][region] * probabilities[region];
      });
      esperanceTable[category] = esperance;
    });

    setTableData({ regions, categories, table, esperanceTable });
  };

  return (
    <div className="col-span-full xl:col-span-12 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
      <header className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
          Analyse des Consommations par Région et Catégorie
        </h2>
      </header>
      <div className="p-6">
        <div className="overflow-x-auto rounded-lg shadow-md bg-white dark:bg-gray-800">
          <table className="table-auto w-full text-sm dark:text-gray-300">
            <thead className="text-xs uppercase text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 rounded-sm">
              <tr>
                <th className="p-3 text-left text-gray-700 dark:text-gray-200">
                  <div className="font-semibold">Catégorie de produit</div>
                </th>
                {tableData.regions &&
                  tableData.regions.map((region) => (
                    <th key={region} className="p-3 text-center text-gray-700 dark:text-gray-200">
                      <div className="font-semibold">{region}</div>
                    </th>
                  ))}
                <th className="p-3 text-center text-gray-700 dark:text-gray-200">
                  <div className="font-semibold">Espérance mathématique</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700">
              {tableData.categories &&
                tableData.categories.map((category) => (
                  <tr key={category} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 text-gray-800 dark:text-gray-100">{category}</td>
                    {tableData.regions.map((region) => (
                      <td key={region} className="p-3 text-center text-gray-800 dark:text-gray-100">
                        {tableData.table[category][region]}
                      </td>
                    ))}
                    <td className="p-3 text-center text-gray-800 dark:text-gray-100">
                      {tableData.esperanceTable[category].toFixed(2)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsCard05;
