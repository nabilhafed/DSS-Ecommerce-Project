import React, { useEffect, useState } from 'react';

function RisqueCard01() {
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState({});
  const [maximaxResults, setMaximaxResults] = useState([]);
  const [maximinResults, setMaximinResults] = useState([]);
  const [minimaxResults, setMinimaxResults] = useState([]);
  const [savageResults, setSavageResults] = useState([]);
  const [laplaceResults, setLaplaceResults] = useState([]);
  const [hurwiczResults, setHurwiczResults] = useState([]);
  const [bernoulliResults, setBernoulliResults] = useState([]);

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
    calculateCriteria(categories, table, regions);
  };

  const calculateCriteria = (categories, table, regions) => {
    // Maximax, Maximin, Minimax, etc. (Les autres calculs de critères restent inchangés)
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
         Espérance des décision
        </h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 rounded-sm">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Catégorie de produit</div>
                </th>
                 
                <th className="p-2">
                  <div className="font-semibold text-center">Espérance mathématique</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700">
              {tableData.categories &&
                tableData.categories.map((category) => (
                  <tr key={category}>
                    <td className="p-2">
                      <div className="text-gray-800 dark:text-gray-100">{category}</div>
                    </td>
                    
                    <td className="p-2 text-center">
                      <div className="text-gray-800 dark:text-gray-100">
                        {tableData.esperanceTable[category].toFixed(2)}
                      </div>
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

export default RisqueCard01;
