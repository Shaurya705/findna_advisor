import React from 'react';

import Icon from '../../../components/AppIcon';

const QuickActionButtons = ({ currentLanguage, onQuickAction }) => {
  const quickActions = [
    {
      id: 'portfolio',
      icon: 'TrendingUp',
      label: currentLanguage === 'hi' ? 'पोर्टफोलियो समीक्षा' : 'Portfolio Review',
      description: currentLanguage === 'hi' ? 'निवेश प्रदर्शन देखें' : 'Check investment performance',
      color: 'text-blue-600 bg-blue-50 hover:bg-blue-100'
    },
    {
      id: 'tax',
      icon: 'Calculator',
      label: currentLanguage === 'hi' ? 'टैक्स प्लानिंग' : 'Tax Planning',
      description: currentLanguage === 'hi' ? 'कर बचत के तरीके' : 'Tax saving strategies',
      color: 'text-green-600 bg-green-50 hover:bg-green-100'
    },
    {
      id: 'goals',
      icon: 'Target',
      label: currentLanguage === 'hi' ? 'लक्ष्य निर्धारण' : 'Goal Setting',
      description: currentLanguage === 'hi' ? 'वित्तीय लक्ष्य बनाएं' : 'Create financial goals',
      color: 'text-purple-600 bg-purple-50 hover:bg-purple-100'
    },
    {
      id: 'market',
      icon: 'BarChart3',
      label: currentLanguage === 'hi' ? 'मार्केट अपडेट' : 'Market Updates',
      description: currentLanguage === 'hi' ? 'आज के बाजार की खबर' : "Today\'s market news",
      color: 'text-orange-600 bg-orange-50 hover:bg-orange-100'
    }
  ];

  return (
    <div className="p-4 border-t border-border bg-surface">
      <h3 className="text-sm font-semibold text-text-secondary mb-3">
        {currentLanguage === 'hi' ? 'त्वरित सहायता' : 'Quick Actions'}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {quickActions?.map((action) => (
          <button
            key={action?.id}
            onClick={() => onQuickAction(action)}
            className={`p-3 rounded-lg border border-border transition-all duration-200 hover:shadow-sm ${action?.color}`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Icon name={action?.icon} size={16} />
              <span className="text-sm font-medium">{action?.label}</span>
            </div>
            <p className="text-xs opacity-75 text-left">{action?.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionButtons;