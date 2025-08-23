import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import { useAuth } from '../../contexts/AuthContext';

// Import all dashboard components
import FinancialHealthScore from './components/FinancialHealthScore';
import PortfolioOverview from './components/PortfolioOverview';
import MarketOverview from './components/MarketOverview';
import AIInsightsPanel from './components/AIInsightsPanel';
import TaxOptimizationAlerts from './components/TaxOptimizationAlerts';
import RetirementProgress from './components/RetirementProgress';

const UnifiedFinancialDashboard = () => {
  const [language, setLanguage] = useState('en');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Get user's first name for greeting
  const getUserFirstName = () => {
    if (!user?.full_name) return 'User';
    return user.full_name.split(' ')[0];
  };

  // Load language preference from localStorage
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('language') || 'en';
      setLanguage(savedLanguage);
    } catch (error) {
      console.error('Error loading language preference:', error);
      setLanguage('en');
    }
  }, []);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate loading data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (error) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    try {
      setLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-text-secondary">
                  {language === 'hi' ? 'डैशबोर्ड लोड हो रहा है...' : 'Loading dashboard...'}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="AlertCircle" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {language === 'hi' ? 'कुछ गलत हुआ' : 'Something went wrong'}
                </h3>
                <p className="text-text-secondary mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {language === 'hi' ? 'पुनः प्रयास करें' : 'Try Again'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#07091c]">
      <Header />
      <main className="pt-16">
        <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  {getGreeting()}, {getUserFirstName()}! 👋
                </h1>
                <p className="text-text-secondary">
                  {content?.[language]?.welcomeBack}
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                {/* Language Toggle */}
                <div className="flex items-center space-x-2 bg-white dark:bg-surface rounded-lg border border-border dark:border-border/40 p-1">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      language === 'en' ? 'bg-primary text-white dark:bg-primary/80' : 'text-text-secondary dark:text-text-secondary/90 hover:text-primary dark:hover:text-primary/90'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => handleLanguageChange('hi')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      language === 'hi' ? 'bg-primary text-white dark:bg-primary/80' : 'text-text-secondary dark:text-text-secondary/90 hover:text-primary dark:hover:text-primary/90'
                    }`}
                  >
                    हिं
                  </button>
                </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Main Widgets */}
            <div className="lg:col-span-8 space-y-8">
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
              <div className="w-full">
                <MarketOverview 
                  marketData={mockMarketData}
                  language={language}
                />
              </div>

              {/* Retirement */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-16 p-8 bg-white dark:bg-surface dark:bg-opacity-80 rounded-xl border border-border dark:border-border dark:border-opacity-30 shadow-sm dark:shadow-black dark:shadow-opacity-20">
            <h3 className="text-xl font-semibold text-text-primary dark:text-white mb-6">
              {language === 'hi' ? 'अन्य सेवाएं' : 'Explore More'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
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
                  className="flex flex-col items-center p-6 bg-surface-secondary dark:bg-surface dark:hover:bg-primary dark:hover:bg-opacity-10 hover:bg-surface-muted rounded-xl border border-border border-opacity-50 dark:border-border dark:border-opacity-20 transition-all duration-200 hover:shadow-md dark:hover:shadow-black dark:hover:shadow-opacity-30 hover:-translate-y-1 group"
                >
                  <div className="w-14 h-14 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/90 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                    <Icon name={item?.icon} size={22} />
                  </div>
                  <span className="text-sm font-medium text-text-primary dark:text-white text-center leading-tight">
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