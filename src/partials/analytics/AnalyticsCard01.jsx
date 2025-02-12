import React, { useEffect, useState } from 'react';

function AnalyticsCard01() {
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

    categories.forEach((category) => {
      table[category] = {};
      regions.forEach((region) => {
        table[category][region] = 0;
      });
    });

    apiData.forEach((item) => {
      table[item.productCategory][item.regionName] = item.totalProducts;
    });

    setTableData({ regions, categories, table });
    calculateCriteria(categories, table, regions);
  };

  const calculateCriteria = (categories, table, regions) => {
    // Maximax
    const maximaxValues = categories.map((category) => {
      const maxForCategory = Math.max(...Object.values(table[category]));
      return { category, max: maxForCategory };
    });
    const globalMaximax = Math.max(...maximaxValues.map((item) => item.max));
    const maximaxResults = maximaxValues.filter((item) => item.max === globalMaximax);

    // Maximin
    const maximinValues = categories.map((category) => {
      const minForCategory = Math.min(...Object.values(table[category]));
      return { category, min: minForCategory };
    });
    const globalMaximin = Math.max(...maximinValues.map((item) => item.min));
    const maximinResults = maximinValues.filter((item) => item.min === globalMaximin);

    // Minimax
    const minimaxValues = categories.map((category) => {
      const maxLossForCategory = Math.max(...Object.values(table[category]));
      return { category, maxLoss: maxLossForCategory };
    });
    const globalMinimax = Math.min(...minimaxValues.map((item) => item.maxLoss));
    const minimaxResults = minimaxValues.filter((item) => item.maxLoss === globalMinimax);

    // Savage (Minimax Regret)
    const regretMatrix = {};
    regions.forEach((region) => {
      const maxInRegion = Math.max(
        ...categories.map((category) => table[category][region])
      );
      categories.forEach((category) => {
        if (!regretMatrix[category]) regretMatrix[category] = {};
        regretMatrix[category][region] =
          maxInRegion - table[category][region];
      });
    });

    const savageValues = categories.map((category) => {
      const maxRegretForCategory = Math.max(
        ...Object.values(regretMatrix[category])
      );
      return { category, maxRegret: maxRegretForCategory };
    });
    const globalSavage = Math.min(...savageValues.map((item) => item.maxRegret));
    const savageResults = savageValues.filter(
      (item) => item.maxRegret === globalSavage
    );

    // Critère de Laplace
    const laplaceValues = categories.map((category) => ({
      category,
      average: regions.reduce((sum, region) => sum + table[category][region], 0) / regions.length,
    }));

    // Trouver la catégorie avec la valeur maximale pour Laplace
    const maxLaplace = laplaceValues.reduce((max, curr) =>
      curr.average > max.average ? curr : max
    );

    // Critère de Hurwicz
    const hurwiczValues = categories.map((category) => {
      const max = Math.max(...regions.map((region) => table[category][region]));
      const min = Math.min(...regions.map((region) => table[category][region]));
      const value = 0.2 * max + (1 - 0.2) * min; // Alpha = 0.7

      return { category, hurwiczValue: value };
    });

    // Trouver la catégorie avec la valeur maximale pour Hurwicz
    const maxHurwicz = hurwiczValues.reduce((max, curr) =>
      curr.hurwiczValue > max.hurwiczValue ? curr : max
    );

    // Critère de Bernouilli
    const bernoulliValues = categories.map((category) => {
      const logSum = regions.reduce((sum, region) => {
        const value = table[category][region];
        return sum + Math.log(value > 0 ? value : 1); // éviter log(0)
      }, 0);

      const B = logSum / regions.length; // Moyenne des logarithmes
      return { category, BValue: B };
    });

    // Trouver la catégorie avec la valeur maximale pour Bernouilli
    const maxBernoulli = bernoulliValues.reduce((max, curr) =>
      curr.BValue > max.BValue ? curr : max
    );

    // Mettre à jour les états avec les résultats calculés
    setMaximaxResults(maximaxResults);
    setMaximinResults(maximinResults);
    setMinimaxResults(minimaxResults);
    setSavageResults(savageResults);
    setLaplaceResults(maxLaplace); // Afficher la catégorie avec la valeur maximale de Laplace
    setHurwiczResults(maxHurwicz); // Afficher la catégorie avec la valeur maximale de Hurwicz
    setBernoulliResults(maxBernoulli); // Afficher la catégorie avec la plus grande valeur B
  };

  return (
    <div className="col-span-full xl:col-span-12 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Matrice de décision
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
                {tableData.regions &&
                  tableData.regions.map((region) => (
                    <th key={region} className="p-2">
                      <div className="font-semibold text-center">{region}</div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700">
              {tableData.categories &&
                tableData.categories.map((category) => (
                  <tr key={category}>
                    <td className="p-2">
                      <div className="text-gray-800 dark:text-gray-100">{category}</div>
                    </td>
                    {tableData.regions.map((region) => (
                      <td key={region} className="p-2 text-center">
                        <div className="text-gray-800 dark:text-gray-100">
                          {tableData.table[category][region]}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default AnalyticsCard01;
