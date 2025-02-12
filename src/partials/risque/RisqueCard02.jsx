import React, { useEffect, useState } from 'react';

function RisqueCard02() {
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

    const probabilities = {};
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

    setTableData({ regions, probabilities });
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
           Probabilité des état de Nature
        </h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 rounded-sm">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Région</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Probabilité</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700">
              {tableData.regions &&
                tableData.regions.map((region) => (
                  <tr key={region}>
                    <td className="p-2">
                      <div className="text-gray-800 dark:text-gray-100">{region}</div>
                    </td>
                    <td className="p-2 text-center">
                      <div className="text-gray-800 dark:text-gray-100">
                        {tableData.probabilities[region].toFixed(2)}
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

export default RisqueCard02;
