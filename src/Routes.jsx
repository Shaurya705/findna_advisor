import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import UnifiedFinancialDashboard from './pages/unified-financial-dashboard';
import PortfolioIntelligenceCenter from './pages/portfolio-intelligence-center';
import HomepageAIFinancialAdvisoryPlatform from './pages/homepage-ai-financial-advisory-platform';
import SecurityTrustCenter from './pages/security-trust-center';
import AIAdvisorChatInterface from './pages/ai-advisor-chat-interface';
import RetirementPlanningLab from './pages/retirement-planning-lab';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AIAdvisorChatInterface />} />
        <Route path="/unified-financial-dashboard" element={<UnifiedFinancialDashboard />} />
        <Route path="/portfolio-intelligence-center" element={<PortfolioIntelligenceCenter />} />
        <Route path="/homepage-ai-financial-advisory-platform" element={<HomepageAIFinancialAdvisoryPlatform />} />
        <Route path="/security-trust-center" element={<SecurityTrustCenter />} />
        <Route path="/ai-advisor-chat-interface" element={<AIAdvisorChatInterface />} />
        <Route path="/retirement-planning-lab" element={<RetirementPlanningLab />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
