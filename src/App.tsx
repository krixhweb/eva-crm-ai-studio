import React, { useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { store } from "./store/store";
import type { RootState } from "./store/store";

import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { Toaster } from "./components/ui/Toaster";

// Pages
import DashboardPage from "./pages/overview/DashboardPage";
import SalesPipelinePage from "./pages/sales/Leads/SalesPipelinePage";

const AppWrapper: React.FC = () => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <HashRouter>
      <Layout>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Overview Pages */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Sales Pages */}
          <Route path="/dashboard" element={<SalesPipelinePage />} />
          

          {/* TEMP: REMOVE THIS LATER WHEN YOU ADD MORE MODULES */}
          <Route
            path="*"
            element={
              <div className="p-6">
                <h2 className="text-lg font-semibold">Page Not Found</h2>
                <p className="text-sm text-gray-500 mt-1">No route matched.</p>
              </div>
            }
          />
        </Routes>

        <Toaster />
      </Layout>
    </HashRouter>
  );
};

const App = () => (
  <Provider store={store}>
    <AppWrapper />
  </Provider>
);

export default App;
