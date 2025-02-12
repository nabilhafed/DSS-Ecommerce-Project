import React, { useEffect, useState } from "react";

function DashboardCard13() {
  // Local state to store category data
  const [categories, setCategories] = useState([]);

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("http://localhost:5059/api/Products/GetProductsByCategory");
        const data = await response.json();

        console.log("Received data: ", data);
        setCategories(data); // Store data in state
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Catégories</h2>
      </header>
      <div className="p-3">
        {/* Card content */}
        <div>
          <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">
            Catégories
          </header>
          <ul className="my-1">
            {categories.map((category, index) => (
              <li key={index} className="flex px-2">
                <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                  <div className="grow flex justify-between">
                    <div className="self-center">
                      <span className="font-medium text-gray-800 dark:text-gray-100">
                        {category.category}
                      </span>
                    </div>
                    <div className="shrink-0 self-start ml-2">
                      <span className="font-medium text-gray-800 dark:text-gray-100">
                        {Math.round(category.productCount)} produits
                      </span>
                    </div>
                    <div className="shrink-0 self-start ml-2">
                      <span className="font-medium text-gray-800 dark:text-gray-100">
                        Note moyenne: {category.avgRating ? category.avgRating.toFixed(2) : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard13;
