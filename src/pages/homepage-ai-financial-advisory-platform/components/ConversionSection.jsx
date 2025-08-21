import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';

const ConversionSection = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState({
    age: '',
    income: '',
    goals: '',
    riskTolerance: '',
    experience: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const sectionContent = {
    en: {
      title: "Discover Your Financial DNA in 30 Seconds",
      subtitle: "Get personalized insights immediately and see how AI can transform your financial future",
      startButton: "Start Free Assessment",
      steps: [
        {
          title: "Basic Info",
          description: "Tell us about yourself",
          fields: ["age", "income"]
        },
        {
          title: "Goals",
          description: "What are your priorities?",
          fields: ["goals", "riskTolerance"]
        },
        {
          title: "Experience",
          description: "Your investment background",
          fields: ["experience"]
        }
      ],
      results: {
        title: "Your Financial DNA Analysis",
        insights: [
          "You could save ₹35,000 annually with optimized tax planning",
          "Your retirement corpus can grow 25% faster with strategic allocation",
          "3 immediate opportunities identified for portfolio improvement"
        ]
      }
    },
    hi: {
      title: "30 सेकंड में अपना वित्तीय DNA खोजें",
      subtitle: "तुरंत व्यक्तिगत अंतर्दृष्टि प्राप्त करें और देखें कि AI आपके वित्तीय भविष्य को कैसे बदल सकती है",
      startButton: "मुफ्त मूल्यांकन शुरू करें",
      steps: [
        {
          title: "बुनियादी जानकारी",
          description: "अपने बारे में बताएं",
          fields: ["age", "income"]
        },
        {
          title: "लक्ष्य",
          description: "आपकी प्राथमिकताएं क्या हैं?",
          fields: ["goals", "riskTolerance"]
        },
        {
          title: "अनुभव",
          description: "आपकी निवेश पृष्ठभूमि",
          fields: ["experience"]
        }
      ],
      results: {
        title: "आपका वित्तीय DNA विश्लेषण",
        insights: [
          "अनुकूलित कर योजना के साथ आप सालाना ₹35,000 बचा सकते हैं",
          "रणनीतिक आवंटन के साथ आपका रिटायरमेंट कॉर्पस 25% तेजी से बढ़ सकता है",
          "पोर्टफोलियो सुधार के लिए 3 तत्काल अवसर पहचाने गए"
        ]
      }
    }
  };

  const formFields = {
    en: {
      age: {
        label: "Age Group",
        options: [
          { value: "20-30", label: "20-30 years" },
          { value: "30-40", label: "30-40 years" },
          { value: "40-50", label: "40-50 years" },
          { value: "50+", label: "50+ years" }
        ]
      },
      income: {
        label: "Annual Income",
        options: [
          { value: "5-10", label: "₹5-10 Lakhs" },
          { value: "10-25", label: "₹10-25 Lakhs" },
          { value: "25-50", label: "₹25-50 Lakhs" },
          { value: "50+", label: "₹50+ Lakhs" }
        ]
      },
      goals: {
        label: "Primary Financial Goal",
        options: [
          { value: "retirement", label: "Retirement Planning" },
          { value: "children", label: "Children\'s Education" },
          { value: "house", label: "Home Purchase" },
          { value: "wealth", label: "Wealth Creation" }
        ]
      },
      riskTolerance: {
        label: "Risk Tolerance",
        options: [
          { value: "conservative", label: "Conservative (Low Risk)" },
          { value: "moderate", label: "Moderate (Medium Risk)" },
          { value: "aggressive", label: "Aggressive (High Risk)" }
        ]
      },
      experience: {
        label: "Investment Experience",
        options: [
          { value: "beginner", label: "Beginner (0-2 years)" },
          { value: "intermediate", label: "Intermediate (2-5 years)" },
          { value: "experienced", label: "Experienced (5+ years)" }
        ]
      }
    },
    hi: {
      age: {
        label: "आयु समूह",
        options: [
          { value: "20-30", label: "20-30 वर्ष" },
          { value: "30-40", label: "30-40 वर्ष" },
          { value: "40-50", label: "40-50 वर्ष" },
          { value: "50+", label: "50+ वर्ष" }
        ]
      },
      income: {
        label: "वार्षिक आय",
        options: [
          { value: "5-10", label: "₹5-10 लाख" },
          { value: "10-25", label: "₹10-25 लाख" },
          { value: "25-50", label: "₹25-50 लाख" },
          { value: "50+", label: "₹50+ लाख" }
        ]
      },
      goals: {
        label: "प्राथमिक वित्तीय लक्ष्य",
        options: [
          { value: "retirement", label: "सेवानिवृत्ति योजना" },
          { value: "children", label: "बच्चों की शिक्षा" },
          { value: "house", label: "घर खरीदना" },
          { value: "wealth", label: "धन सृजन" }
        ]
      },
      riskTolerance: {
        label: "जोखिम सहनशीलता",
        options: [
          { value: "conservative", label: "रूढ़िवादी (कम जोखिम)" },
          { value: "moderate", label: "मध्यम (मध्यम जोखिम)" },
          { value: "aggressive", label: "आक्रामक (उच्च जोखिम)" }
        ]
      },
      experience: {
        label: "निवेश अनुभव",
        options: [
          { value: "beginner", label: "शुरुआती (0-2 वर्ष)" },
          { value: "intermediate", label: "मध्यवर्ती (2-5 वर्ष)" },
          { value: "experienced", label: "अनुभवी (5+ वर्ष)" }
        ]
      }
    }
  };

  const handleInputChange = (field, value) => {
    setAssessmentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < sectionContent?.[currentLanguage]?.steps?.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleAnalyze();
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 3000);
  };

  const isStepComplete = () => {
    const currentStepFields = sectionContent?.[currentLanguage]?.steps?.[currentStep]?.fields;
    return currentStepFields?.every(field => assessmentData?.[field]);
  };

  if (showResults) {
    return (
      <section className="py-20 bg-gradient-to-br from-primary/5 to-prosperity/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12 border border-border">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-cultural rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-soft">
                <Icon name="Dna" size={32} color="white" />
              </div>
              <h2 className="text-3xl font-bold text-text-primary mb-4">
                {sectionContent?.[currentLanguage]?.results?.title}
              </h2>
            </div>

            <div className="space-y-6 mb-8">
              {sectionContent?.[currentLanguage]?.results?.insights?.map((insight, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-success/5 rounded-lg border border-success/20">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Check" size={16} color="white" />
                  </div>
                  <p className="text-text-primary font-medium">{insight}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link to="/unified-financial-dashboard">
                <Button
                  variant="default"
                  size="lg"
                  iconName="ArrowRight"
                  iconPosition="right"
                  className="bg-gradient-cultural hover:opacity-90 shadow-lg"
                >
                  {currentLanguage === 'en' ? 'Get Full Analysis' : 'पूर्ण विश्लेषण प्राप्त करें'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-prosperity/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            {sectionContent?.[currentLanguage]?.title}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {sectionContent?.[currentLanguage]?.subtitle}
          </p>
        </div>

        {/* Assessment Form */}
        <div className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-muted p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-text-primary">
                {currentLanguage === 'en' ? 'Progress' : 'प्रगति'}: {currentStep + 1}/{sectionContent?.[currentLanguage]?.steps?.length}
              </span>
              <span className="text-sm text-text-secondary">
                {Math.round(((currentStep + 1) / sectionContent?.[currentLanguage]?.steps?.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div 
                className="bg-gradient-cultural h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / sectionContent?.[currentLanguage]?.steps?.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {isAnalyzing ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-cultural rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
                  <Icon name="Loader2" size={24} color="white" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {currentLanguage === 'en' ? 'Analyzing Your Financial DNA...' : 'आपके वित्तीय DNA का विश्लेषण...'}
                </h3>
                <p className="text-text-secondary">
                  {currentLanguage === 'en' ? 'This will take just a moment' : 'इसमें बस एक पल लगेगा'}
                </p>
              </div>
            ) : (
              <>
                {/* Step Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-text-primary mb-2">
                    {sectionContent?.[currentLanguage]?.steps?.[currentStep]?.title}
                  </h3>
                  <p className="text-text-secondary">
                    {sectionContent?.[currentLanguage]?.steps?.[currentStep]?.description}
                  </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-6 mb-8">
                  {sectionContent?.[currentLanguage]?.steps?.[currentStep]?.fields?.map((field) => (
                    <Select
                      key={field}
                      label={formFields?.[currentLanguage]?.[field]?.label}
                      options={formFields?.[currentLanguage]?.[field]?.options}
                      value={assessmentData?.[field]}
                      onChange={(value) => handleInputChange(field, value)}
                      placeholder={currentLanguage === 'en' ? 'Select an option' : 'एक विकल्प चुनें'}
                      required
                    />
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    iconName="ChevronLeft"
                    iconPosition="left"
                  >
                    {currentLanguage === 'en' ? 'Previous' : 'पिछला'}
                  </Button>

                  <Button
                    variant="default"
                    onClick={handleNext}
                    disabled={!isStepComplete()}
                    iconName={currentStep === sectionContent?.[currentLanguage]?.steps?.length - 1 ? "Sparkles" : "ChevronRight"}
                    iconPosition="right"
                    className="bg-gradient-cultural hover:opacity-90"
                  >
                    {currentStep === sectionContent?.[currentLanguage]?.steps?.length - 1 
                      ? (currentLanguage === 'en' ? 'Analyze DNA' : 'DNA विश्लेषण करें')
                      : (currentLanguage === 'en' ? 'Next' : 'अगला')
                    }
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-text-secondary">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-success" />
              <span>{currentLanguage === 'en' ? 'Secure & Private' : 'सुरक्षित और निजी'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-primary" />
              <span>{currentLanguage === 'en' ? '30 Second Assessment' : '30 सेकंड मूल्यांकन'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Gift" size={16} className="text-prosperity" />
              <span>{currentLanguage === 'en' ? 'Completely Free' : 'पूर्णतः मुफ्त'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConversionSection;