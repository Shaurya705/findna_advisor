import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import all components
import PortfolioOverview from './components/PortfolioOverview';
import AssetAllocationChart from './components/AssetAllocationChart';
import PerformanceAnalytics from './components/PerformanceAnalytics';
import AIRecommendations from './components/AIRecommendations';
import TaxOptimization from './components/TaxOptimization';
import MarketInsights from './components/MarketInsights';

const PortfolioIntelligenceCenter = () => {
  const [language, setLanguage] = useState('en');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  // Save language preference to localStorage
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Mock portfolio data
  const portfolioData = {
    totalValue: 10000000,
    totalGain: 26.3,
    todayChange: 45000,
    todayChangePercent: 0.45,
    investedAmount: 7500000,
    monthlyInvestment: 25000
  };

  const allocationData = {
    categories: [
      { name: language === 'hi' ? 'इक्विटी' : 'Equity', value: 45, amount: 4500000 },
      { name: language === 'hi' ? 'डेट' : 'Debt', value: 25, amount: 2500000 },
      { name: language === 'hi' ? 'ELSS' : 'ELSS', value: 15, amount: 1500000 },
      { name: language === 'hi' ? 'PPF/EPF' : 'PPF/EPF', value: 10, amount: 1000000 },
      { name: language === 'hi' ? 'गोल्ड' : 'Gold', value: 5, amount: 500000 }
    ]
  };

  const performanceData = {
    returns: 26.3,
    alpha: 6.2,
    sharpeRatio: 1.42,
    volatility: 14.2
  };

  const recommendations = [
    {
      id: 1,
      type: 'rebalance',
      priority: 'high',
      title: language === 'hi' ? 'IT सेक्टर एक्सपोज़र कम करें' : 'Reduce IT Sector Exposure',
      description: language === 'hi' ?'आपका IT सेक्टर एक्सपोज़र 20% है जो अधिक है।' :'Your IT sector exposure is 20% which is high.',
      impact: '15% risk reduction',
      potentialGain: '₹45,000'
    }
  ];

  const taxData = {
    totalLiability: 65500,
    potentialSavings: 75450,
    daysRemaining: 45
  };

  const marketData = {
    sensex: { value: 65432.10, change: 1.24 },
    nifty: { value: 19567.85, change: 1.18 },
    bankNifty: { value: 45123.60, change: -0.85 }
  };

  const tabs = [
    { 
      key: 'overview', 
      label: language === 'hi' ? 'अवलोकन' : 'Overview',
      icon: 'LayoutDashboard'
    },
    { 
      key: 'allocation', 
      label: language === 'hi' ? 'एलोकेशन' : 'Allocation',
      icon: 'PieChart'
    },
    { 
      key: 'performance', 
      label: language === 'hi' ? 'प्रदर्शन' : 'Performance',
      icon: 'TrendingUp'
    },
    { 
      key: 'recommendations', 
      label: language === 'hi' ? 'सुझाव' : 'AI Insights',
      icon: 'Sparkles'
    },
    { 
      key: 'tax', 
      label: language === 'hi' ? 'टैक्स' : 'Tax Optimization',
      icon: 'Calculator'
    },
    { 
      key: 'market', 
      label: language === 'hi' ? 'बाजार' : 'Market Insights',
      icon: 'Activity'
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <PortfolioOverview portfolioData={portfolioData} language={language} />;
      case 'allocation':
        return <AssetAllocationChart allocationData={allocationData} language={language} />;
      case 'performance':
        return <PerformanceAnalytics performanceData={performanceData} language={language} />;
      case 'recommendations':
        return <AIRecommendations recommendations={recommendations} language={language} />;
      case 'tax':
        return <TaxOptimization taxData={taxData} language={language} />;
      case 'market':
        return <MarketInsights marketData={marketData} language={language} />;
      default:
        return <PortfolioOverview portfolioData={portfolioData} language={language} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>
          {language === 'hi' ?'पोर्टफोलियो इंटेलिजेंस सेंटर - FinDNA Advisor' :'Portfolio Intelligence Center - FinDNA Advisor'
          }
        </title>
        <meta 
          name="description" 
          content={language === 'hi' ?'उन्नत पोर्टफोलियो प्रबंधन और AI-संचालित निवेश अंतर्दृष्टि के साथ अपने निवेश को अनुकूलित करें।' :'Optimize your investments with advanced portfolio management and AI-powered investment insights.'
          }
        />
      </Helmet>
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} pt-16`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">
                  {language === 'hi' ? 'पोर्टफोलियो इंटेलिजेंस सेंटर' : 'Portfolio Intelligence Center'}
                </h1>
                <p className="text-text-secondary mt-2">
                  {language === 'hi' ?'AI-संचालित विश्लेषण और व्यक्तिगत निवेश अंतर्दृष्टि के साथ अपने पोर्टफोलियो को अनुकूलित करें' :'Optimize your portfolio with AI-powered analytics and personalized investment insights'
                  }
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {/* Language Toggle */}
                <div className="flex items-center space-x-1 bg-white rounded-lg border border-border p-1">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      language === 'en' ?'bg-primary text-white' :'text-text-secondary hover:text-primary'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => handleLanguageChange('hi')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      language === 'hi' ?'bg-primary text-white' :'text-text-secondary hover:text-primary'
                    }`}
                  >
                    हिं
                  </button>
                </div>

                {/* Refresh Button */}
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RefreshCw"
                  iconPosition="left"
                  loading={refreshing}
                  onClick={handleRefresh}
                  className="hover:bg-primary/5"
                >
                  {language === 'hi' ? 'रिफ्रेश' : 'Refresh'}
                </Button>

                {/* Export Button */}
                <Button
                  variant="default"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                  className="bg-gradient-cultural hover:opacity-90"
                >
                  {language === 'hi' ? 'रिपोर्ट निर्यात करें' : 'Export Report'}
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-border p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="TrendingUp" size={16} className="text-success" />
                  <span className="text-sm text-text-secondary">
                    {language === 'hi' ? 'कुल रिटर्न' : 'Total Returns'}
                  </span>
                </div>
                <div className="text-xl font-bold text-success mt-1">+26.3%</div>
              </div>
              <div className="bg-white rounded-lg border border-border p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Target" size={16} className="text-primary" />
                  <span className="text-sm text-text-secondary">
                    {language === 'hi' ? 'अल्फा जेनेरेटेड' : 'Alpha Generated'}
                  </span>
                </div>
                <div className="text-xl font-bold text-primary mt-1">+6.2%</div>
              </div>
              <div className="bg-white rounded-lg border border-border p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={16} className="text-prosperity" />
                  <span className="text-sm text-text-secondary">
                    {language === 'hi' ? 'रिस्क स्कोर' : 'Risk Score'}
                  </span>
                </div>
                <div className="text-xl font-bold text-prosperity mt-1">7.2/10</div>
              </div>
              <div className="bg-white rounded-lg border border-border p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Sparkles" size={16} className="text-growth" />
                  <span className="text-sm text-text-secondary">
                    {language === 'hi' ? 'AI स्कोर' : 'AI Score'}
                  </span>
                </div>
                <div className="text-xl font-bold text-growth mt-1">92/100</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 bg-white rounded-lg border border-border p-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.key}
                  onClick={() => setActiveTab(tab?.key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab?.key
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {renderTabContent()}
          </div>

          {/* AI Assistant Floating Button */}
          <div className="fixed bottom-6 right-6 z-50">
            <Button
              variant="default"
              size="lg"
              iconName="MessageCircle"
              className="bg-gradient-cultural hover:opacity-90 shadow-lg rounded-full w-14 h-14 p-0"
              onClick={() => console.log('Open AI chat')}
            >
              <span className="sr-only">
                {language === 'hi' ? 'AI सहायक से चैट करें' : 'Chat with AI Assistant'}
              </span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortfolioIntelligenceCenter;