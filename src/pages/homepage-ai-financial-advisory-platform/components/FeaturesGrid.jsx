import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeaturesGrid = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [hoveredFeature, setHoveredFeature] = useState(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const featuresContent = {
    en: {
      title: "Three Core Differentiators",
      subtitle: "Experience the future of financial advisory with AI that understands Indian culture and speaks your language",
      features: [
        {
          id: 'vernacular',
          title: "Vernacular AI Guidance",
          description: "Chat with our AI advisor in Hindi or English. Get personalized financial advice that understands your cultural context and family values.",
          icon: "MessageSquare",
          color: "primary",
          route: "/ai-advisor-chat-interface",
          highlights: ["Hindi & English Support", "Cultural Context Aware", "Voice Commands", "24/7 Availability"],
          demo: "Ask: \'Mere bacchon ki education ke liye kya invest karu?'"
        },
        {
          id: 'tax',
          title: "GSTN-Integrated Tax Optimization",
          description: "Automatically optimize your taxes with GSTN integration. Smart capital gains harvesting and real-time tax-saving recommendations.",
          icon: "Calculator",
          color: "prosperity",
          route: "/unified-financial-dashboard",
          highlights: ["GSTN Integration", "Auto Tax Harvesting", "Capital Gains Offset", "Real-time Alerts"],
          demo: "Save ₹45,000+ annually with smart tax strategies"
        },
        {
          id: 'retirement',
          title: "Cultural Retirement Planning",
          description: "Plan retirement considering Indian family structures, festivals, and cultural expenses. Factor in joint family responsibilities.",
          icon: "PiggyBank",
          color: "growth",
          route: "/retirement-planning-lab",
          highlights: ["Joint Family Planning", "Festival Budgeting", "Healthcare Inflation", "Cultural Expenses"],
          demo: "Plan for ₹5 crore retirement corpus with cultural considerations"
        }
      ]
    },
    hi: {
      title: "तीन मुख्य विशेषताएं",
      subtitle: "भारतीय संस्कृति को समझने वाली AI के साथ वित्तीय सलाह का भविष्य अनुभव करें",
      features: [
        {
          id: 'vernacular',
          title: "देशी भाषा AI मार्गदर्शन",
          description: "हिंदी या अंग्रेजी में हमारे AI सलाहकार से बात करें। व्यक्तिगत वित्तीय सलाह पाएं जो आपके सांस्कृतिक संदर्भ को समझती है।",
          icon: "MessageSquare",
          color: "primary",
          route: "/ai-advisor-chat-interface",
          highlights: ["हिंदी और अंग्रेजी समर्थन", "सांस्कृतिक संदर्भ जागरूक", "आवाज कमांड", "24/7 उपलब्धता"],
          demo: "पूछें: \'मेरे बच्चों की शिक्षा के लिए क्या निवेश करूं?'"
        },
        {
          id: 'tax',
          title: "GSTN-एकीकृत कर अनुकूलन",
          description: "GSTN एकीकरण के साथ अपने करों को स्वचालित रूप से अनुकूलित करें। स्मार्ट कैपिटल गेन्स हार्वेस्टिंग और रियल-टाइम कर-बचत सुझाव।",
          icon: "Calculator",
          color: "prosperity",
          route: "/unified-financial-dashboard",
          highlights: ["GSTN एकीकरण", "ऑटो टैक्स हार्वेस्टिंग", "कैपिटल गेन्स ऑफसेट", "रियल-टाइम अलर्ट"],
          demo: "स्मार्ट टैक्स रणनीतियों से सालाना ₹45,000+ बचाएं"
        },
        {
          id: 'retirement',
          title: "सांस्कृतिक सेवानिवृत्ति योजना",
          description: "भारतीय पारिवारिक संरचना, त्योहारों और सांस्कृतिक खर्चों को ध्यान में रखते हुए सेवानिवृत्ति की योजना बनाएं।",
          icon: "PiggyBank",
          color: "growth",
          route: "/retirement-planning-lab",
          highlights: ["संयुक्त परिवार योजना", "त्योहार बजटिंग", "स्वास्थ्य मुद्रास्फीति", "सांस्कृतिक खर्च"],
          demo: "सांस्कृतिक विचारों के साथ ₹5 करोड़ रिटायरमेंट कॉर्पस की योजना"
        }
      ]
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      primary: {
        bg: 'bg-primary/10',
        text: 'text-primary',
        border: 'border-primary/20',
        gradient: 'from-primary/20 to-primary/5'
      },
      prosperity: {
        bg: 'bg-prosperity/10',
        text: 'text-prosperity',
        border: 'border-prosperity/20',
        gradient: 'from-prosperity/20 to-prosperity/5'
      },
      growth: {
        bg: 'bg-growth/10',
        text: 'text-growth',
        border: 'border-growth/20',
        gradient: 'from-growth/20 to-growth/5'
      }
    };
    return colorMap?.[color];
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            {featuresContent?.[currentLanguage]?.title}
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            {featuresContent?.[currentLanguage]?.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {featuresContent?.[currentLanguage]?.features?.map((feature, index) => {
            const colors = getColorClasses(feature?.color);
            const isHovered = hoveredFeature === feature?.id;
            
            return (
              <div
                key={feature?.id}
                onMouseEnter={() => setHoveredFeature(feature?.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-500 hover:shadow-2xl group ${
                  isHovered ? colors?.border : 'border-border'
                } ${isHovered ? 'transform scale-105' : ''}`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors?.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl ${colors?.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon name={feature?.icon} size={28} className={colors?.text} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-text-primary mb-4 group-hover:text-gradient">
                    {feature?.title}
                  </h3>

                  {/* Description */}
                  <p className="text-text-secondary mb-6 leading-relaxed">
                    {feature?.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2 mb-6">
                    {feature?.highlights?.map((highlight, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Icon name="Check" size={14} className={`${colors?.text} flex-shrink-0`} />
                        <span className="text-sm text-text-secondary">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Demo Text */}
                  <div className={`p-4 rounded-lg ${colors?.bg} mb-6 border ${colors?.border} opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0`}>
                    <p className="text-sm font-medium text-text-primary">
                      💡 {feature?.demo}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Link to={feature?.route}>
                    <Button
                      variant="outline"
                      fullWidth
                      iconName="ArrowRight"
                      iconPosition="right"
                      className={`border-2 ${colors?.border} ${colors?.text} hover:bg-${feature?.color}/5 group-hover:shadow-lg transition-all duration-300`}
                    >
                      {currentLanguage === 'en' ? 'Explore Feature' : 'सुविधा देखें'}
                    </Button>
                  </Link>
                </div>
                {/* Floating Elements */}
                <div className={`absolute -top-2 -right-2 w-6 h-6 ${colors?.bg} rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100`}>
                  <Icon name="Sparkles" size={12} className={colors?.text} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Optimization Note */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-muted rounded-full">
            <Icon name="Smartphone" size={16} className="text-primary" />
            <span className="text-sm font-medium text-text-primary">
              {currentLanguage === 'en' ?'Optimized for Indian smartphone usage patterns' :'भारतीय स्मार्टफोन उपयोग पैटर्न के लिए अनुकूलित'
              }
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;