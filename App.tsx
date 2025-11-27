
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './store/store';
import type { RootState } from './store/store';
import Layout from './components/layout/Layout';
import DashboardPage from './modules/dashboard/DashboardPage';
import CustomerDirectoryPage from './modules/customers/CustomerDirectoryPage';
import CustomerProfilePage from './modules/customers/CustomerProfilePage';
import AbandonedCartsPage from './modules/marketing/AbandonedCartsPage';
import CampaignsManagementPage from './modules/marketing/CampaignsManagementPage';
import EmailMarketingPage from './modules/marketing/EmailMarketingPage';
import SocialContentPage from './modules/marketing/SocialContentPage';
import AbTestingPage from './modules/marketing/AbTestingPage';
import CouponManagementPage from './modules/marketing/CouponManagementPage';
import PlaceholderPage from './components/ui/PlaceholderPage';
import SalesPipelinePage from './modules/sales/SalesPipelinePage';
import SalesAnalyticsPage from './modules/sales/SalesAnalyticsPage';
import SalesPersonDetailsPage from './modules/sales/SalesPersonDetailsPage';
import ProductsInventoryPage from './modules/commerce/inventory/ProductsInventoryPage';
import ProductProfilePage from './modules/commerce/inventory/ProductProfilePage';
import OrdersManagementPage from './modules/commerce/orders/OrdersManagementPage';
import FinancialHubPage from './modules/commerce/financials/FinancialHubPage';
import QuoteDetailsPage from './modules/commerce/financials/QuoteDetailsPage';
import InvoiceDetailsPage from './modules/commerce/financials/InvoiceDetailsPage';
import TicketManagementPage from './modules/support/TicketManagementPage';
import ReturnsRefundsPage from './modules/support/ReturnsRefundsPage';
import MultiChannelPage from './modules/support/MultiChannelPage';
import MarketingAutomationPage from './modules/automation/MarketingAutomationPage';
import WorkflowListPage from './modules/automation/WorkflowListPage';
import WorkflowBuilderPage from './modules/automation/WorkflowBuilderPage';
import ServiceAutomationPage from './modules/automation/ServiceAutomationPage';
import { Toaster } from './components/ui/Toaster';

const AppWrapper: React.FC = () => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/customers" element={<CustomerDirectoryPage />} />
          <Route path="/customers/:id" element={<CustomerProfilePage />} />
          <Route path="/abandoned-carts" element={<AbandonedCartsPage />} />
          
          {/* Marketing Module */}
          <Route path="/marketing/campaigns" element={<CampaignsManagementPage />} />
          <Route path="/marketing/email" element={<EmailMarketingPage />} />
          <Route path="/marketing/social" element={<SocialContentPage />} />
          <Route path="/marketing/ab-testing" element={<AbTestingPage />} />
          <Route path="/marketing/coupons" element={<CouponManagementPage />} />

          {/* Sales Module */}
          <Route path="/sales/pipeline" element={<SalesPipelinePage />} />
          <Route path="/sales/analytics" element={<SalesAnalyticsPage />} />
          <Route path="/sales/rep/:id" element={<SalesPersonDetailsPage />} />

          {/* Commerce Module */}
          <Route path="/commerce/products" element={<ProductsInventoryPage />} />
          <Route path="/commerce/products/:id" element={<ProductProfilePage />} />
          <Route path="/commerce/orders" element={<OrdersManagementPage />} />
          <Route path="/commerce/financials" element={<FinancialHubPage />} />
          <Route path="/commerce/financials/quotes/:id" element={<QuoteDetailsPage />} />
          <Route path="/commerce/financials/invoices/:id" element={<InvoiceDetailsPage />} />

          {/* Support Module */}
          <Route path="/support/tickets" element={<TicketManagementPage />} />
          <Route path="/support/returns" element={<ReturnsRefundsPage />} />
          <Route path="/support/multi-channel" element={<MultiChannelPage />} />
          
          {/* Automation Module */}
          <Route path="/automation/workflows" element={<WorkflowListPage />} />
          <Route path="/automation/workflows/builder" element={<WorkflowBuilderPage />} />
          <Route path="/automation/marketing" element={<MarketingAutomationPage />} />
          <Route path="/automation/service" element={<ServiceAutomationPage />} />

          <Route path="/settings" element={<Navigate to="/settings/integrations" replace />} />
          <Route path="/settings/integrations" element={<PlaceholderPage title="Integrations" />} />
          <Route path="/settings/admin" element={<PlaceholderPage title="Admin & Security" />} />
          <Route path="/settings/api" element={<PlaceholderPage title="APIs & Webhooks" />} />

          <Route path="*" element={<PlaceholderPage title="404 - Not Found" />} />
        </Routes>
        <Toaster />
      </Layout>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}

export default App;
