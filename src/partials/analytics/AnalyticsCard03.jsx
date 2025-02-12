import React, { useEffect, useState } from 'react';

function AnalyticsCard03() {
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState({});
  const [results, setResults] = useState({
    maximax: [],
    maximin: [],
    savage: [],
    laplace: [],
    hurwicz: [],
    bernoulli: [],
    finalDecisions: {}, // Décisions finales pour chaque critère
  });

  useEffect(() => {
    fetch('http://localhost:5059/api/Products/GetProductCategoriesByRegionAndOtherCriteria')
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
    const calculateFinalDecision = (criteriaResults) => {
      const maxResult = Math.max(...criteriaResults.map((item) => parseFloat(item.result)));
      const optimalCategory = criteriaResults.find(
        (item) => parseFloat(item.result) === maxResult
      )?.category;
      return { optimalCategory, maxResult: maxResult.toFixed(2) };
    };

    // Maximax
    const maximaxResults = categories.map((category) => {
      const maxForCategory = Math.max(...Object.values(table[category]));
      return { category, result: maxForCategory.toFixed(2) };
    });

    // Maximin
    const maximinResults = categories.map((category) => {
      const minForCategory = Math.min(...Object.values(table[category]));
      return { category, result: minForCategory.toFixed(2) };
    });

    // Savage
    const savageResults = categories.map((category) => {
      const regrets = regions.map((region) => {
        const maxInRegion = Math.max(...categories.map((cat) => table[cat][region] || 0));
        return maxInRegion - table[category][region];
      });
      const maxRegret = Math.max(...regrets);
      return { category, result: maxRegret.toFixed(2) };
    });

    // Laplace
    const laplaceResults = categories.map((category) => ({
      category,
      result: (
        regions.reduce((sum, region) => sum + table[category][region], 0) / regions.length
      ).toFixed(2),
    }));

    // Hurwicz
    const hurwiczResults = categories.map((category) => {
      const max = Math.max(...regions.map((region) => table[category][region]));
      const min = Math.min(...regions.map((region) => table[category][region]));
      const value = (0.7 * max + (1 - 0.7) * min).toFixed(2);
      return { category, result: value };
    });

    // Bernoulli
    const bernoulliResults = categories.map((category) => {
      const logSum = regions.reduce((sum, region) => {
        const value = table[category][region];
        return sum + Math.log(value > 0 ? value : 1); // Eviter log(0)
      }, 0);
      const B = (logSum / regions.length).toFixed(2);
      return { category, result: B };
    });

    // Calcul des décisions finales pour chaque critère
    const finalDecisions = {
      Maximax: calculateFinalDecision(maximaxResults),
      Maximin: calculateFinalDecision(maximinResults),
      Savage: calculateFinalDecision(savageResults),
      Laplace: calculateFinalDecision(laplaceResults),
      Hurwicz: calculateFinalDecision(hurwiczResults),
      Bernoulli: calculateFinalDecision(bernoulliResults),
    };

    // Mise à jour des résultats
    setResults({
      maximax: maximaxResults,
      maximin: maximinResults,
      savage: savageResults,
      laplace: laplaceResults,
      hurwicz: hurwiczResults,
      bernoulli: bernoulliResults,
      finalDecisions,
    });
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Resultat de chaque critère
        </h2>
      </header>
      <div className="p-3">
        <div className="overflow-x-auto">
          {/* Tableau principal */}
          
          {/* Tableau des décisions finales */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
              Décisions Finales par Critère
            </h3>
            <table className="table-auto w-full dark:text-gray-300 mt-3">
              <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 rounded-sm">
                <tr>
                  <th className="p-2">Critère</th>
                  <th className="p-2">Catégorie Choisie</th>
                  <th className="p-2">Valeur Maximale</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700">
                {Object.entries(results.finalDecisions).map(([criterion, decision]) => (
                  <tr key={criterion}>
                    <td className="p-2">{criterion}</td>
                    <td className="p-2 text-center">{decision.optimalCategory}</td>
                    <td className="p-2 text-center">{decision.maxResult}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsCard03;
