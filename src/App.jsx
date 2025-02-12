import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Import pages
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Risque from './pages/Risque';


// Import styles and configurations
import './css/style.css';
import './charts/ChartjsConfig';

function App() {
  const location = useLocation();

  // Scroll to the top on route change
  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]);

  return (
    <Routes>
      <Route exact path="/" element={<Dashboard />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/Risque" element={<Risque />} />

    </Routes>
  );
}

export default App;
