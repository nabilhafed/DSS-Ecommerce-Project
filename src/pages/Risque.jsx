import React, { useState } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
 
import AnalyticsCard01 from '../partials/analytics/AnalyticsCard01';
  
import RisqueCard01  from '../partials/risque/RisqueCard01';
import RisqueCard02  from '../partials/risque/RisqueCard02';
import RisqueCard03  from '../partials/risque/RisqueCard03';




function Risque() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
   // Create a ref for DashboardCard06
 
  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">

              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Décision dans Le Risque</h1>
              </div>

              

            </div>

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">

              {/* Line chart (Acme Plus) */}
              <AnalyticsCard01 />

              <RisqueCard02 />
              
              <RisqueCard01 />
           
              <RisqueCard03 />

             

            </div>

          </div>
        </main>

 
      </div>
    </div>
  );
}

export default Risque;