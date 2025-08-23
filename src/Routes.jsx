import React, { Suspense } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import FloatingChatButton from "./components/ui/FloatingChatButton";
import NotFound from "./pages/NotFound";
import UnifiedFinancialDashboard from './pages/unified-financial-dashboard';
import PortfolioIntelligenceCenter from './pages/portfolio-intelligence-center';
import HomepageAIFinancialAdvisoryPlatform from './pages/homepage-ai-financial-advisory-platform';
import SecurityTrustCenter from './pages/security-trust-center';
import AIAdvisorChatInterface from './pages/ai-advisor-chat-interface';
import RetirementPlanningLab from './pages/retirement-planning-lab';
import Invoices from './pages/invoices';
import Transactions from './pages/transactions';
import Expenses from './pages/expenses';
import AnalyticsReports from './pages/analytics-reports';
import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';
import Help from './pages/help';
import NewTicket from './pages/help/support/NewTicket';
import TestComponent from './components/TestComponent';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Main Application Routes */}
        <Route path="/" element={<HomepageAIFinancialAdvisoryPlatform />} />
        <Route path="/test" element={<TestComponent />} />
        <Route path="/ai-advisor-chat-interface" element={<AIAdvisorChatInterface />} />
        <Route path="/unified-financial-dashboard" element={<UnifiedFinancialDashboard />} />
        <Route path="/portfolio-intelligence-center" element={<PortfolioIntelligenceCenter />} />
        <Route path="/security-trust-center" element={<SecurityTrustCenter />} />
        <Route path="/retirement-planning-lab" element={<RetirementPlanningLab />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/analytics-reports" element={<AnalyticsReports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/help" element={<Help />} />
        <Route path="/help/support/new-ticket" element={<NewTicket />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      <FloatingChatButton />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
