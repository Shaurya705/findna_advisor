import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const TrustSection = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [animatedNumbers, setAnimatedNumbers] = useState({
    users: 0,
    optimized: 0,
    savings: 0
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    const targets = {
      users: 50000,
      optimized: 1000000,
      savings: 500000
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedNumbers({
        users: Math.floor(targets?.users * progress),
        optimized: Math.floor(targets?.optimized * progress),
        savings: Math.floor(targets?.savings * progress)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedNumbers(targets);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    if (num >= 100000) {
      return `${(num / 100000)?.toFixed(1)}L`;
    } else if (num >= 1000) {
      return `${(num / 1000)?.toFixed(1)}K`;
    }
    return num?.toString();
  };

  const trustContent = {
    en: {
      title: "Trusted by Indians Nationwide",
      subtitle: "Join thousands who\'ve transformed their financial future with AI-powered guidance",
      metrics: [
        { label: "Active Users", value: formatNumber(animatedNumbers?.users), suffix: "+" },
        { label: "Money Optimized", value: `₹${formatNumber(animatedNumbers?.optimized)}`, suffix: "+" },
        { label: "Tax Savings", value: `₹${formatNumber(animatedNumbers?.savings)}`, suffix: "+" }
      ]
    },
    hi: {
      title: "देशभर के भारतीयों का भरोसा",
      subtitle: "हजारों लोगों के साथ जुड़ें जिन्होंने AI-संचालित मार्गदर्शन से अपना वित्तीय भविष्य बदला है",
      metrics: [
        { label: "सक्रिय उपयोगकर्ता", value: formatNumber(animatedNumbers?.users), suffix: "+" },
        { label: "धन अनुकूलित", value: `₹${formatNumber(animatedNumbers?.optimized)}`, suffix: "+" },
        { label: "कर बचत", value: `₹${formatNumber(animatedNumbers?.savings)}`, suffix: "+" }
      ]
    }
  };

  const complianceBadges = [
    { name: "SEBI", icon: "Shield", color: "text-success" },
    { name: "RBI Guidelines", icon: "CheckCircle", color: "text-primary" },
    { name: "ISO 27001", icon: "Lock", color: "text-prosperity" },
    { name: "256-bit SSL", icon: "Key", color: "text-growth" }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            {trustContent?.[currentLanguage]?.title}
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            {trustContent?.[currentLanguage]?.subtitle}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {trustContent?.[currentLanguage]?.metrics?.map((metric, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-border group hover:scale-105"
            >
              <div className="w-16 h-16 bg-gradient-cultural rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse-soft">
                <Icon 
                  name={index === 0 ? "Users" : index === 1 ? "TrendingUp" : "PiggyBank"} 
                  size={24} 
                  color="white" 
                />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
                {metric?.value}
                <span className="text-prosperity">{metric?.suffix}</span>
              </div>
              <p className="text-text-secondary font-medium">{metric?.label}</p>
            </div>
          ))}
        </div>

        {/* Compliance Badges */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-border">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {currentLanguage === 'en' ? 'Regulatory Compliance & Security' : 'नियामक अनुपालन और सुरक्षा'}
            </h3>
            <p className="text-text-secondary">
              {currentLanguage === 'en' ?'Your financial data is protected by industry-leading security standards' :'आपका वित्तीय डेटा उद्योग-अग्रणी सुरक्षा मानकों द्वारा सुरक्षित है'
              }
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {complianceBadges?.map((badge, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className={`w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow ${badge?.color}`}>
                  <Icon name={badge?.icon} size={20} />
                </div>
                <span className="text-sm font-medium text-text-primary text-center">
                  {badge?.name}
                </span>
              </div>
            ))}
          </div>

          {/* Additional Trust Elements */}
          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-text-secondary">
              <div className="flex items-center space-x-2">
                <Icon name="Award" size={16} className="text-prosperity" />
                <span>{currentLanguage === 'en' ? 'Best Fintech App 2024' : 'बेस्ट फिनटेक ऐप 2024'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Star" size={16} className="text-prosperity" />
                <span>4.8/5 {currentLanguage === 'en' ? 'User Rating' : 'उपयोगकर्ता रेटिंग'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Globe" size={16} className="text-primary" />
                <span>{currentLanguage === 'en' ? '15+ Languages' : '15+ भाषाएं'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;