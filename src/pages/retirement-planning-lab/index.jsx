import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RetirementGoalWizard from './components/RetirementGoalWizard';
import ScenarioModeling from './components/ScenarioModeling';
import InvestmentAllocation from './components/InvestmentAllocation';
import MilestoneTracker from './components/MilestoneTracker';
import RetirementReport from './components/RetirementReport';

const RetirementPlanningLab = () => {
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [activeTab, setActiveTab] = useState('wizard');
  const [goalData, setGoalData] = useState(null);
  const [wizardStep, setWizardStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('selectedLanguage', language);
  };

  const tabs = [
    { 
      id: 'wizard', 
      label: currentLanguage === 'hindi' ? 'लक्ष्य निर्धारण' : 'Goal Setting', 
      icon: 'Target',
      description: currentLanguage === 'hindi' ? 'अपने सेवानिवृत्ति लक्ष्य निर्धारित करें' : 'Define your retirement goals'
    },
    { 
      id: 'scenarios', 
      label: currentLanguage === 'hindi' ? 'परिदृश्य मॉडलिंग' : 'Scenario Modeling', 
      icon: 'TrendingUp',
      description: currentLanguage === 'hindi' ? 'विभिन्न निवेश रणनीतियों की तुलना करें' : 'Compare different investment strategies'
    },
    { 
      id: 'allocation', 
      label: currentLanguage === 'hindi' ? 'निवेश आवंटन' : 'Investment Allocation', 
      icon: 'PieChart',
      description: currentLanguage === 'hindi' ? 'अनुकूलित पोर्टफोलियो आवंटन' : 'Optimized portfolio allocation'
    },
    { 
      id: 'milestones', 
      label: currentLanguage === 'hindi' ? 'मील के पत्थर' : 'Milestones', 
      icon: 'Flag',
      description: currentLanguage === 'hindi' ? 'अपनी प्रगति को ट्रैक करें' : 'Track your progress'
    },
    { 
      id: 'report', 
      label: currentLanguage === 'hindi' ? 'रिपोर्ट' : 'Report', 
      icon: 'FileText',
      description: currentLanguage === 'hindi' ? 'विस्तृत सेवानिवृत्ति रिपोर्ट' : 'Detailed retirement report'
    }
  ];

  const handleGoalComplete = async (data) => {
    setIsLoading(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setGoalData(data);
    setActiveTab('scenarios');
    setIsLoading(false);
  };

  const handleWizardStepChange = (step) => {
    setWizardStep(step);
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'wizard':
        return (
          <RetirementGoalWizard
            onComplete={handleGoalComplete}
            currentStep={wizardStep}
            onStepChange={handleWizardStepChange}
          />
        );
      case 'scenarios':
        return goalData ? (
          <ScenarioModeling goalData={goalData} />
        ) : (
          <div className="text-center py-12">
            <Icon name="AlertCircle" size={48} className="text-warning mx-auto mb-4" />
            <p className="text-text-secondary">Please complete the goal setting wizard first</p>
            <Button
              variant="outline"
              onClick={() => setActiveTab('wizard')}
              className="mt-4"
            >
              Go to Goal Setting
            </Button>
          </div>
        );
      case 'allocation':
        return goalData ? (
          <InvestmentAllocation 
            riskProfile={goalData?.riskTolerance} 
            goalData={goalData}
          />
        ) : (
          <div className="text-center py-12">
            <Icon name="AlertCircle" size={48} className="text-warning mx-auto mb-4" />
            <p className="text-text-secondary">Please complete the goal setting wizard first</p>
            <Button
              variant="outline"
              onClick={() => setActiveTab('wizard')}
              className="mt-4"
            >
              Go to Goal Setting
            </Button>
          </div>
        );
      case 'milestones':
        return goalData ? (
          <MilestoneTracker goalData={goalData} />
        ) : (
          <div className="text-center py-12">
            <Icon name="AlertCircle" size={48} className="text-warning mx-auto mb-4" />
            <p className="text-text-secondary">Please complete the goal setting wizard first</p>
            <Button
              variant="outline"
              onClick={() => setActiveTab('wizard')}
              className="mt-4"
            >
              Go to Goal Setting
            </Button>
          </div>
        );
      case 'report':
        return goalData ? (
          <RetirementReport goalData={goalData} scenarioData={goalData} />
        ) : (
          <div className="text-center py-12">
            <Icon name="AlertCircle" size={48} className="text-warning mx-auto mb-4" />
            <p className="text-text-secondary">Please complete the goal setting wizard first</p>
            <Button
              variant="outline"
              onClick={() => setActiveTab('wizard')}
              className="mt-4"
            >
              Go to Goal Setting
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Retirement Planning Lab - FinDNA Advisor</title>
        <meta name="description" content="Interactive retirement scenario modeling platform with advanced financial projections and cultural retirement expectations for Indian investors." />
        <meta name="keywords" content="retirement planning, financial planning, investment calculator, retirement corpus, EPF, PPF, NPS, India" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          {/* Hero Section */}
          <section className="bg-gradient-cultural text-white py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32" />
            
            <div className="container mx-auto px-4 relative">
              <div className="max-w-4xl mx-auto text-center">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <Icon name="PiggyBank" size={32} color="white" strokeWidth={2} />
                  </div>
                  <div className="text-left">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">
                      {currentLanguage === 'hindi' ? 'सेवानिवृत्ति योजना प्रयोगशाला' : 'Retirement Planning Lab'}
                    </h1>
                    <p className="text-white/80 text-lg">
                      {currentLanguage === 'hindi' 
                        ? 'भारतीय संस्कृति के अनुकूल इंटरैक्टिव सेवानिवृत्ति मॉडलिंग' 
                        : 'Interactive retirement scenario modeling with Indian cultural insights'
                      }
                    </p>
                  </div>
                </div>
                
                <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                  {currentLanguage === 'hindi' 
                    ? 'अपने सेवानिवृत्ति के सपनों को वित्तीय लक्ष्यों में बदलें। EPF, PPF, NPS और आधुनिक निवेश विकल्पों के साथ व्यापक योजना बनाएं।' 
                    : 'Transform your retirement dreams into financial targets. Plan comprehensively with EPF, PPF, NPS, and modern investment options tailored for Indian investors.'
                  }
                </p>

                {/* Language Toggle */}
                <div className="flex items-center justify-center space-x-2 mb-8">
                  <Button
                    variant={currentLanguage === 'english' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => handleLanguageChange('english')}
                    className={currentLanguage === 'english' 
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  >
                    English
                  </Button>
                  <div className="w-px h-4 bg-white/30" />
                  <Button
                    variant={currentLanguage === 'hindi' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => handleLanguageChange('hindi')}
                    className={currentLanguage === 'hindi' 
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  >
                    हिंदी
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">25+</div>
                    <div className="text-white/80 text-sm">
                      {currentLanguage === 'hindi' ? 'वर्षों का अनुभव' : 'Years Experience'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">₹50L+</div>
                    <div className="text-white/80 text-sm">
                      {currentLanguage === 'hindi' ? 'औसत कॉर्पस' : 'Average Corpus'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">10K+</div>
                    <div className="text-white/80 text-sm">
                      {currentLanguage === 'hindi' ? 'सफल योजनाएं' : 'Successful Plans'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Navigation Tabs */}
          <section className="bg-white border-b border-border sticky top-16 z-30">
            <div className="container mx-auto px-4">
              <div className="flex items-center space-x-1 overflow-x-auto py-4">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    disabled={tab?.id !== 'wizard' && !goalData}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab?.id
                        ? 'bg-primary text-white shadow-md'
                        : tab?.id !== 'wizard' && !goalData 
                          ? 'text-text-muted bg-muted cursor-not-allowed' 
                          : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <div className="text-left">
                      <div>{tab?.label}</div>
                      <div className="text-xs opacity-75">{tab?.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
                      <Icon name="Calculator" size={32} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {currentLanguage === 'hindi' ? 'आपकी योजना तैयार की जा रही है...' : 'Preparing Your Plan...'}
                    </h3>
                    <p className="text-text-secondary">
                      {currentLanguage === 'hindi' 
                        ? 'कृपया प्रतीक्षा करें जबकि हम आपके लिए व्यक्तिगत सेवानिवृत्ति रणनीति तैयार करते हैं' 
                        : 'Please wait while we create your personalized retirement strategy'
                      }
                    </p>
                  </div>
                </div>
              ) : (
                getTabContent()
              )}
            </div>
          </section>

          {/* Features Section */}
          {activeTab === 'wizard' && (
            <section className="py-16 bg-muted">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-text-primary mb-4">
                    {currentLanguage === 'hindi' ? 'क्यों चुनें हमारी प्रयोगशाला?' : 'Why Choose Our Lab?'}
                  </h2>
                  <p className="text-text-secondary max-w-2xl mx-auto">
                    {currentLanguage === 'hindi' 
                      ? 'भारतीय निवेशकों के लिए विशेष रूप से डिज़ाइन की गई उन्नत सुविधाएं' 
                      : 'Advanced features specifically designed for Indian investors'
                    }
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-lg border border-border p-6 text-center hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon name="Globe" size={24} className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-text-primary mb-2">
                      {currentLanguage === 'hindi' ? 'द्विभाषी समर्थन' : 'Bilingual Support'}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {currentLanguage === 'hindi' 
                        ? 'हिंदी और अंग्रेजी में पूर्ण समर्थन' 
                        : 'Complete support in Hindi and English'
                      }
                    </p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg border border-border p-6 text-center hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-prosperity/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon name="Shield" size={24} className="text-prosperity" />
                    </div>
                    <h3 className="font-semibold text-text-primary mb-2">
                      {currentLanguage === 'hindi' ? 'भारतीय साधन' : 'Indian Instruments'}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {currentLanguage === 'hindi' 
                        ? 'EPF, PPF, NPS और अन्य भारतीय निवेश विकल्प' 
                        : 'EPF, PPF, NPS and other Indian investment options'
                      }
                    </p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg border border-border p-6 text-center hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon name="TrendingUp" size={24} className="text-success" />
                    </div>
                    <h3 className="font-semibold text-text-primary mb-2">
                      {currentLanguage === 'hindi' ? 'AI संचालित' : 'AI Powered'}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {currentLanguage === 'hindi' 
                        ? 'बुद्धिमान सुझाव और व्यक्तिगत रणनीति' 
                        : 'Intelligent recommendations and personalized strategy'
                      }
                    </p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg border border-border p-6 text-center hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-growth/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon name="Users" size={24} className="text-growth" />
                    </div>
                    <h3 className="font-semibold text-text-primary mb-2">
                      {currentLanguage === 'hindi' ? 'पारिवारिक योजना' : 'Family Planning'}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {currentLanguage === 'hindi' 
                        ? 'संयुक्त परिवार की जिम्मेदारियों को ध्यान में रखते हुए' 
                        : 'Considering joint family responsibilities'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-text-primary text-white py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-cultural rounded-lg flex items-center justify-center">
                  <Icon name="Dna" size={16} color="white" strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold">FinDNA Advisor</span>
              </div>
              <p className="text-white/70 text-sm mb-4">
                {currentLanguage === 'hindi' 
                  ? 'आपका विश्वसनीय वित्तीय सलाहकार - भविष्य की सुरक्षा के लिए' 
                  : 'Your trusted financial advisor - securing your future'
                }
              </p>
              <p className="text-white/50 text-xs">
                © {new Date()?.getFullYear()} FinDNA Advisor. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default RetirementPlanningLab;