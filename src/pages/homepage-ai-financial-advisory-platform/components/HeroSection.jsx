import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTyping, setIsTyping] = useState(false);
  const [currentDemo, setCurrentDemo] = useState(0);

  const demoMessages = [
    {
      en: "Analyzing your portfolio... Found 3 tax-saving opportunities worth ₹45,000",
      hi: "आपके पोर्टफोलियो का विश्लेषण... ₹45,000 की 3 टैक्स बचत के अवसर मिले"
    },
    {
      en: "Your retirement goal needs ₹2,500 monthly SIP increase for target achievement",
      hi: "आपके रिटायरमेंट लक्ष्य के लिए ₹2,500 मासिक SIP बढ़ाना आवश्यक है"
    },
    {
      en: "Market volatility alert: Consider rebalancing your equity allocation by 5%",
      hi: "बाजार में उतार-चढ़ाव: अपने इक्विटी आवंटन को 5% पुनर्संतुलित करें"
    }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(true);
      setTimeout(() => {
        setCurrentDemo((prev) => (prev + 1) % demoMessages?.length);
        setIsTyping(false);
      }, 1000);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleLanguageToggle = () => {
    const newLanguage = currentLanguage === 'en' ? 'hi' : 'en';
    setCurrentLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const heroContent = {
    en: {
      headline: "Your Financial DNA, Decoded",
      subheadline: "AI-powered financial advisory that speaks your language and understands your culture",
      cta: "Start Free Analysis",
      demo: "Try Demo",
      trustText: "Trusted by 50,000+ Indians"
    },
    hi: {
      headline: "आपका वित्तीय DNA, डिकोड किया गया",
      subheadline: "AI-संचालित वित्तीय सलाह जो आपकी भाषा बोलती है और आपकी संस्कृति को समझती है",
      cta: "मुफ्त विश्लेषण शुरू करें",
      demo: "डेमो आज़माएं",
      trustText: "50,000+ भारतीयों का भरोसा"
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-amber-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Language Toggle */}
            <div className="flex justify-center lg:justify-start mb-8">
              <button
                onClick={handleLanguageToggle}
                className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-border hover:bg-white transition-all duration-300 shadow-sm"
              >
                <Icon name="Globe" size={16} className="text-primary" />
                <span className="text-sm font-medium text-text-primary">
                  {currentLanguage === 'en' ? 'हिंदी' : 'English'}
                </span>
                <Icon name="ChevronDown" size={14} className="text-text-secondary" />
              </button>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
              <span className="text-gradient animate-gradient bg-gradient-to-r from-primary via-prosperity to-growth bg-clip-text text-transparent">
                {heroContent?.[currentLanguage]?.headline}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-text-secondary mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {heroContent?.[currentLanguage]?.subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link to="/unified-financial-dashboard">
                <Button
                  variant="default"
                  size="lg"
                  iconName="Sparkles"
                  iconPosition="left"
                  className="bg-gradient-cultural hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {heroContent?.[currentLanguage]?.cta}
                </Button>
              </Link>
              
              <Button
                variant="outline"
                size="lg"
                iconName="Play"
                iconPosition="left"
                className="border-primary text-primary hover:bg-primary/5"
              >
                {heroContent?.[currentLanguage]?.demo}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-text-secondary">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-success" />
                <span>SEBI Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} className="text-primary" />
                <span>{heroContent?.[currentLanguage]?.trustText}</span>
              </div>
            </div>
          </div>

          {/* Right Content - AI Demo */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-border p-6 max-w-md mx-auto">
              {/* Chat Header */}
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-border">
                <div className="w-10 h-10 bg-gradient-cultural rounded-full flex items-center justify-center">
                  <Icon name="Bot" size={20} color="white" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">FinDNA AI</h3>
                  <p className="text-xs text-success flex items-center">
                    <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
                    {currentLanguage === 'en' ? 'Online' : 'ऑनलाइन'}
                  </p>
                </div>
                <div className="ml-auto">
                  <Icon name="Mic" size={16} className="text-text-secondary" />
                </div>
              </div>

              {/* Demo Messages */}
              <div className="space-y-4 mb-6">
                <div className="bg-primary/5 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Icon name="Zap" size={12} color="white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-text-primary">
                        {isTyping ? (
                          <span className="flex items-center">
                            <span className="animate-pulse">Analyzing...</span>
                            <span className="ml-2 flex space-x-1">
                              <span className="w-1 h-1 bg-primary rounded-full animate-bounce"></span>
                              <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                              <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                            </span>
                          </span>
                        ) : (
                          demoMessages?.[currentDemo]?.[currentLanguage]
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="p-3 bg-prosperity/10 rounded-lg text-left hover:bg-prosperity/20 transition-colors">
                    <Icon name="TrendingUp" size={16} className="text-prosperity mb-1" />
                    <p className="text-xs font-medium text-text-primary">
                      {currentLanguage === 'en' ? 'Portfolio' : 'पोर्टफोलियो'}
                    </p>
                  </button>
                  <button className="p-3 bg-growth/10 rounded-lg text-left hover:bg-growth/20 transition-colors">
                    <Icon name="Calculator" size={16} className="text-growth mb-1" />
                    <p className="text-xs font-medium text-text-primary">
                      {currentLanguage === 'en' ? 'Tax Save' : 'टैक्स बचत'}
                    </p>
                  </button>
                </div>
              </div>

              {/* Input Area */}
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <input
                  type="text"
                  placeholder={currentLanguage === 'en' ? 'Ask about your finances...' : 'अपने वित्त के बारे में पूछें...'}
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                />
                <Button variant="ghost" size="sm" iconName="Send" iconSize={16} />
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-prosperity/20 rounded-full flex items-center justify-center animate-pulse-soft">
              <Icon name="Sparkles" size={24} className="text-prosperity" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-success/20 rounded-full flex items-center justify-center animate-float">
              <Icon name="TrendingUp" size={20} className="text-success" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;