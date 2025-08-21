import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';

// Import all dashboard components
import FinancialHealthScore from './components/FinancialHealthScore';
import PortfolioOverview from './components/PortfolioOverview';
import MarketOverview from './components/MarketOverview';
import AIInsightsPanel from './components/AIInsightsPanel';
import TaxOptimizationAlerts from './components/TaxOptimizationAlerts';
import GoalTracker from './components/GoalTracker';
import RetirementProgress from './components/RetirementProgress';
import QuickActions from './components/QuickActions';

const UnifiedFinancialDashboard = () => {
  const [language, setLanguage] = useState('en');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Mock data for dashboard components
  const mockFinancialHealthData = {
    score: 78,
    trend: 5.2
  };

  const mockPortfolioData = {
    totalValue: 2850000,
    todayChange: 12500,
    todayChangePercent: 0.44,
    allocation: [
      { category: 'Equity', percentage: 65, value: 1852500 },
      { category: 'Debt', percentage: 25, value: 712500 },
      { category: 'Gold', percentage: 7, value: 199500 },
      { category: 'Real Estate', percentage: 3, value: 85500 }
    ]
  };

  const mockMarketData = {
    indices: [
      { name: 'SENSEX', value: 73825, change: 245.67, changePercent: 0.33 },
      { name: 'NIFTY 50', value: 22356, change: 78.45, changePercent: 0.35 },
      { name: 'BANK NIFTY', value: 48567, change: -123.45, changePercent: -0.25 }
    ],
    portfolioImpact: 'positive'
  };

  const mockAIInsights = [
    {
      id: 'insight-1',
      title: language === 'hi' ?'कर अनुकूलन अवसर' :'Tax Optimization Opportunity',
      description: language === 'hi' ?'मार्च 31 से पहले लार्ज-कैप फंड में मुनाफा बुक करने पर विचार करें। इससे आपको ₹45,000 तक की कर बचत हो सकती है।' :'Consider booking profits in large-cap funds before March 31st for tax optimization. This could save you up to ₹45,000 in taxes.',
      priority: 'high',
      potentialSaving: 45000,
      timestamp: '2 hours ago'
    },
    {
      id: 'insight-2',
      title: language === 'hi' ?'पोर्टफोलियो रीबैलेंसिंग' :'Portfolio Rebalancing',
      description: language === 'hi' ?'आपका इक्विटी एक्सपोजर लक्ष्य से 5% अधिक है। कुछ इक्विटी होल्डिंग्स को डेट में शिफ्ट करने पर विचार करें।' :'Your equity exposure is 5% above target allocation. Consider shifting some equity holdings to debt instruments.',
      priority: 'medium',
      timestamp: '1 day ago'
    },
    {
      id: 'insight-3',
      title: language === 'hi' ?'SIP वृद्धि सुझाव' :'SIP Enhancement Suggestion',
      description: language === 'hi' ?'आपकी आय में वृद्धि के आधार पर, मासिक SIP को ₹5,000 बढ़ाने से रिटायरमेंट लक्ष्य 2 साल जल्दी पूरा हो सकता है।' :'Based on your income growth, increasing monthly SIP by ₹5,000 could help achieve retirement goals 2 years earlier.',
      priority: 'low',
      timestamp: '3 days ago'
    }
  ];

  const mockTaxAlerts = [
    {
      id: 'tax-1',
      title: language === 'hi' ?'ELSS निवेश की समय सीमा' :'ELSS Investment Deadline',
      description: language === 'hi' ?'80C के तहत कर बचत के लिए ELSS में निवेश करने की अंतिम तारीख नजदीक आ रही है।' :'Last date to invest in ELSS for tax saving under 80C is approaching.',
      type: 'urgent',
      deadline: 'March 31, 2025',
      daysLeft: 38,
      potentialSaving: 46800
    },
    {
      id: 'tax-2',
      title: language === 'hi' ?'कैपिटल गेन हार्वेस्टिंग' :'Capital Gain Harvesting',
      description: language === 'hi' ?'लॉन्ग टर्म कैपिटल गेन्स को ₹1 लाख की सीमा के अंदर बुक करने का अवसर।' :'Opportunity to book long-term capital gains within ₹1 lakh exemption limit.',
      type: 'important',
      deadline: 'March 31, 2025',
      daysLeft: 38,
      potentialSaving: 15600
    }
  ];

  const mockGoals = [
    {
      name: language === 'hi' ? 'घर खरीदना' : 'Home Purchase',
      category: language === 'hi' ? 'संपत्ति' : 'Property',
      icon: 'Home',
      currentAmount: 1200000,
      targetAmount: 3500000,
      progressPercentage: 34,
      status: 'onTrack',
      targetDate: 'Dec 2027'
    },
    {
      name: language === 'hi' ? 'बच्चों की शिक्षा' : "Children\'s Education",
      category: language === 'hi' ? 'शिक्षा' : 'Education',
      icon: 'GraduationCap',
      currentAmount: 850000,
      targetAmount: 2500000,
      progressPercentage: 34,
      status: 'behindSchedule',
      targetDate: 'Jun 2030'
    },
    {
      name: language === 'hi' ? 'आपातकालीन फंड' : 'Emergency Fund',
      category: language === 'hi' ? 'सुरक्षा' : 'Security',
      icon: 'Shield',
      currentAmount: 600000,
      targetAmount: 600000,
      progressPercentage: 100,
      status: 'completed',
      targetDate: 'Completed'
    }
  ];

  const mockRetirementData = {
    currentCorpus: 1850000,
    targetCorpus: 8500000,
    monthlyContribution: 25000,
    yearsToRetirement: 22
  };

  const content = {
    en: {
      greeting: 'Good morning',
      welcomeBack: 'Welcome back to your financial command center',
      lastUpdated: 'Last updated',
      language: 'Language',
      notifications: 'Notifications',
      settings: 'Settings'
    },
    hi: {
      greeting: 'सुप्रभात',
      welcomeBack: 'अपने वित्तीय कमांड सेंटर में वापस स्वागत है',
      lastUpdated: 'अंतिम अपडेट',
      language: 'भाषा',
      notifications: 'सूचनाएं',
      settings: 'सेटिंग्स'
    }
  };

  const getGreeting = () => {
    const hour = currentTime?.getHours();
    if (language === 'hi') {
      if (hour < 12) return 'सुप्रभात';
      if (hour < 17) return 'नमस्कार';
      return 'शुभ संध्या';
    }
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={toggleSidebar}
      />
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  {getGreeting()}, Rajesh! 👋
                </h1>
                <p className="text-text-secondary">
                  {content?.[language]?.welcomeBack}
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                {/* Language Toggle */}
                <div className="flex items-center space-x-2 bg-white rounded-lg border border-border p-1">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      language === 'en' ?'bg-primary text-white' :'text-text-secondary hover:text-primary'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => handleLanguageChange('hi')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      language === 'hi' ?'bg-primary text-white' :'text-text-secondary hover:text-primary'
                    }`}
                  >
                    हिं
                  </button>
                </div>

                {/* Action Buttons */}
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Bell"
                  iconSize={18}
                  className="relative"
                >
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-growth rounded-full"></span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Settings"
                  iconSize={18}
                />
              </div>
            </div>

            {/* Last Updated Info */}
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <Icon name="Clock" size={16} />
              <span>
                {content?.[language]?.lastUpdated}: {currentTime?.toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </span>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Main Widgets */}
            <div className="lg:col-span-8 space-y-6">
              {/* Top Row - Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FinancialHealthScore 
                  score={mockFinancialHealthData?.score}
                  trend={mockFinancialHealthData?.trend}
                  language={language}
                />
                <PortfolioOverview 
                  portfolioData={mockPortfolioData}
                  language={language}
                />
              </div>

              {/* Market Overview */}
              <MarketOverview 
                marketData={mockMarketData}
                language={language}
              />

              {/* Goals and Retirement */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <GoalTracker 
                  goals={mockGoals}
                  language={language}
                />
                <RetirementProgress 
                  retirementData={mockRetirementData}
                  language={language}
                />
              </div>
            </div>

            {/* Right Column - Insights and Actions */}
            <div className="lg:col-span-4 space-y-6">
              <AIInsightsPanel 
                insights={mockAIInsights}
                language={language}
              />
              <TaxOptimizationAlerts 
                alerts={mockTaxAlerts}
                language={language}
              />
              <QuickActions language={language} />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-12 p-6 bg-white rounded-xl border border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              {language === 'hi' ? 'अन्य सेवाएं' : 'Explore More'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { name: language === 'hi' ? 'होम' : 'Home', path: '/homepage-ai-financial-advisory-platform', icon: 'Home' },
                { name: language === 'hi' ? 'AI सलाहकार' : 'AI Advisor', path: '/ai-advisor-chat-interface', icon: 'Bot' },
                { name: language === 'hi' ? 'पोर्टफोलियो' : 'Portfolio', path: '/portfolio-intelligence-center', icon: 'TrendingUp' },
                { name: language === 'hi' ? 'रिटायरमेंट' : 'Retirement', path: '/retirement-planning-lab', icon: 'PiggyBank' },
                { name: language === 'hi' ? 'सुरक्षा' : 'Security', path: '/security-trust-center', icon: 'Shield' }
              ]?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className="flex flex-col items-center p-4 bg-surface-secondary hover:bg-surface-muted rounded-lg border border-border/50 transition-all duration-200 hover:shadow-sm group"
                >
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                    <Icon name={item?.icon} size={20} />
                  </div>
                  <span className="text-sm font-medium text-text-primary text-center">
                    {item?.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UnifiedFinancialDashboard;