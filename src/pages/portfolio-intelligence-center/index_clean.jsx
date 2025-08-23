import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { portfolioAPI } from '../../services/portfolioAPI';

// Import all components
import PortfolioOverview from './components/PortfolioOverview';
import AssetAllocationChart from './components/AssetAllocationChart';
import PerformanceAnalytics from './components/PerformanceAnalytics';
import AIRecommendations from './components/AIRecommendations';
import TaxOptimization from './components/TaxOptimization';
import MarketInsights from './components/MarketInsights';

const PortfolioIntelligenceCenter = () => {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [showExportOptions, setShowExportOptions] = useState(false);
  
  // Data states
  const [portfolioData, setPortfolioData] = useState(null);
  const [allocationData, setAllocationData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  
  // Time period state
  const [selectedPeriod, setSelectedPeriod] = useState('1Y');

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);
  
  // Load portfolio data on initial render and when period changes
  useEffect(() => {
    loadPortfolioData();
  }, [selectedPeriod]);

  // Save language preference to localStorage
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };
  
  // Load all portfolio data
  const loadPortfolioData = async () => {
    try {
      setRefreshing(true);
      
      // Load portfolio summary
      const summary = await portfolioAPI.getPortfolioSummary(selectedPeriod);
      setPortfolioData(summary);
      
      // Load asset allocation
      const allocation = await portfolioAPI.getAssetAllocation();
      setAllocationData(allocation);
      
      // Load performance metrics
      const performance = await portfolioAPI.getPerformanceMetrics(selectedPeriod);
      setPerformanceData(performance);
      
      // Load recommendations
      const recs = await portfolioAPI.getRecommendations();
      setRecommendations(recs.recommendations || []);
      
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      // Show an error toast or notification here
    } finally {
      setRefreshing(false);
    }
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    loadPortfolioData();
  };

  // Handle export functionality
  const handleExport = async (format) => {
    setExportFormat(format);
    setShowExportOptions(false);
    setExportLoading(true);
    try {
      await portfolioAPI.exportPortfolioReport(format, selectedPeriod);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExportLoading(false);
    }
  };

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
          {language === 'hi' ? 'पोर्टफोलियो इंटेलिजेंस सेंटर - FinDNA Advisor' : 'Portfolio Intelligence Center - FinDNA Advisor'}
        </title>
        <meta 
          name="description" 
          content={language === 'hi' ? 'उन्नत पोर्टफोलियो प्रबंधन और AI-संचालित निवेश अंतर्दृष्टि के साथ अपने निवेश को अनुकूलित करें।' : 'Optimize your investments with advanced portfolio management and AI-powered investment insights.'}
        />
      </Helmet>
      <Header />
      <main className="pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">
                  {language === 'hi' ? 'पोर्टफोलियो इंटेलिजेंस सेंटर' : 'Portfolio Intelligence Center'}
                </h1>
                <p className="text-text-secondary mt-2">
                  {language === 'hi' ? 'AI-संचालित विश्लेषण और व्यक्तिगत निवेश अंतर्दृष्टि के साथ अपने पोर्टफोलियो को अनुकूलित करें' : 'Optimize your portfolio with AI-powered analytics and personalized investment insights'}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {/* Language Toggle */}
                <div className="flex items-center space-x-1 bg-white rounded-lg border border-border p-1">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      language === 'en' ? 'bg-primary text-white' : 'text-text-secondary hover:text-primary'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => handleLanguageChange('hi')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      language === 'hi' ? 'bg-primary text-white' : 'text-text-secondary hover:text-primary'
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
                <div className="relative">
                  <Button
                    variant="default"
                    size="sm"
                    iconName="Download"
                    iconPosition="left"
                    className="bg-gradient-cultural hover:opacity-90"
                    loading={exportLoading}
                    onClick={() => setShowExportOptions(!showExportOptions)}
                  >
                    {language === 'hi' ? 'रिपोर्ट निर्यात करें' : 'Export Report'}
                  </Button>

                  {/* Export Options Dropdown */}
                  {showExportOptions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border overflow-hidden z-50">
                      <div className="p-2 border-b border-border">
                        <span className="text-sm font-medium text-text-primary">
                          {language === 'hi' ? 'फॉर्मेट चुनें' : 'Choose Format'}
                        </span>
                      </div>
                      <div className="p-1">
                        {['pdf', 'excel', 'csv'].map((format) => (
                          <button
                            key={format}
                            className={`w-full flex items-center space-x-2 px-3 py-2 text-sm text-left rounded-md ${
                              exportFormat === format ? 'bg-primary/10 text-primary' : 'hover:bg-background'
                            }`}
                            onClick={() => handleExport(format)}
                          >
                            <Icon name={format === 'pdf' ? 'FileText' : format === 'excel' ? 'Table' : 'FileSpreadsheet'} size={16} />
                            <span>
                              {format.toUpperCase()}
                              {format === 'pdf' && (language === 'hi' ? ' (अनुशंसित)' : ' (Recommended)')}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Time Period Selector */}
            <div className="flex items-center justify-end mb-4">
              <div className="bg-white rounded-lg border border-border p-1 flex">
                {['1M', '3M', '6M', '1Y', '3Y', '5Y', 'MAX'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      selectedPeriod === period 
                        ? 'bg-primary text-white' 
                        : 'text-text-secondary hover:text-primary hover:bg-background'
                    }`}
                  >
                    {period}
                  </button>
                ))}
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

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-1 bg-white rounded-lg border border-border p-1 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.key
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text-secondary hover:text-primary hover:bg-background'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-8">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortfolioIntelligenceCenter;
