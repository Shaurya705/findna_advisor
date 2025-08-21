import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIInsightPanel = ({ currentLanguage, userProfile, onViewDetails }) => {
  const insights = [
    {
      id: 'portfolio_health',
      icon: 'TrendingUp',
      title: currentLanguage === 'hi' ? 'पोर्टफोलियो स्वास्थ्य' : 'Portfolio Health',
      value: '87%',
      status: 'good',
      description: currentLanguage === 'hi' ?'आपका पोर्टफोलियो अच्छा प्रदर्शन कर रहा है' :'Your portfolio is performing well',
      action: currentLanguage === 'hi' ? 'विस्तार देखें' : 'View Details'
    },
    {
      id: 'tax_optimization',
      icon: 'Calculator',
      title: currentLanguage === 'hi' ? 'टैक्स बचत' : 'Tax Savings',
      value: '₹45,000',
      status: 'opportunity',
      description: currentLanguage === 'hi' ?'अतिरिक्त टैक्स बचत संभव है' :'Additional tax savings possible',
      action: currentLanguage === 'hi' ? 'अनुकूलित करें' : 'Optimize'
    },
    {
      id: 'goal_progress',
      icon: 'Target',
      title: currentLanguage === 'hi' ? 'लक्ष्य प्रगति' : 'Goal Progress',
      value: '73%',
      status: 'on_track',
      description: currentLanguage === 'hi' ?'रिटायरमेंट लक्ष्य की दिशा में' :'On track for retirement goal',
      action: currentLanguage === 'hi' ? 'समायोजित करें' : 'Adjust'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return 'text-success bg-green-50 border-green-200';
      case 'opportunity':
        return 'text-warning bg-amber-50 border-amber-200';
      case 'on_track':
        return 'text-primary bg-blue-50 border-blue-200';
      default:
        return 'text-text-secondary bg-muted border-border';
    }
  };

  return (
    <div className="bg-white border-l border-border w-80 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Brain" size={20} className="text-primary" />
          <h3 className="font-semibold text-text-primary">
            {currentLanguage === 'hi' ? 'AI अंतर्दृष्टि' : 'AI Insights'}
          </h3>
        </div>
        <p className="text-sm text-text-secondary">
          {currentLanguage === 'hi' ?'आपकी वित्तीय स्थिति का विश्लेषण' :'Analysis of your financial status'
          }
        </p>
      </div>
      {/* Insights */}
      <div className="flex-1 p-4 space-y-4">
        {insights?.map((insight) => (
          <div
            key={insight?.id}
            className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-sm ${getStatusColor(insight?.status)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Icon name={insight?.icon} size={16} />
                <span className="text-sm font-medium">{insight?.title}</span>
              </div>
              <span className="text-lg font-bold">{insight?.value}</span>
            </div>
            
            <p className="text-xs opacity-75 mb-3">{insight?.description}</p>
            
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onViewDetails(insight?.id)}
              className="text-xs hover:bg-white/50"
            >
              {insight?.action}
            </Button>
          </div>
        ))}
      </div>
      {/* AI Reasoning */}
      <div className="p-4 border-t border-border bg-surface">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Lightbulb" size={16} className="text-prosperity" />
          <span className="text-sm font-medium text-text-primary">
            {currentLanguage === 'hi' ? 'AI तर्क' : 'AI Reasoning'}
          </span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          {currentLanguage === 'hi' ?'ये सुझाव आपके वित्तीय डेटा, जोखिम प्रोफाइल, और बाजार की स्थिति के आधार पर दिए गए हैं।' :'These recommendations are based on your financial data, risk profile, and current market conditions.'
          }
        </p>
      </div>
    </div>
  );
};

export default AIInsightPanel;