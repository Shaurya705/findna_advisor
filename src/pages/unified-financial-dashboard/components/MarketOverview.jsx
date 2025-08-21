import React from 'react';
import Icon from '../../../components/AppIcon';

const MarketOverview = ({ marketData, language = 'en' }) => {
  const content = {
    en: {
      title: 'Market Overview',
      subtitle: 'Indian Markets Today',
      impact: 'Portfolio Impact',
      positive: 'Positive',
      negative: 'Negative',
      neutral: 'Neutral'
    },
    hi: {
      title: 'बाजार अवलोकन',
      subtitle: 'आज के भारतीय बाजार',
      impact: 'पोर्टफोलियो प्रभाव',
      positive: 'सकारात्मक',
      negative: 'नकारात्मक',
      neutral: 'तटस्थ'
    }
  };

  const getImpactColor = (impact) => {
    if (impact === 'positive') return 'text-success bg-success/10';
    if (impact === 'negative') return 'text-error bg-error/10';
    return 'text-text-secondary bg-muted';
  };

  const getImpactIcon = (impact) => {
    if (impact === 'positive') return 'TrendingUp';
    if (impact === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {content?.[language]?.title}
          </h3>
          <p className="text-sm text-text-secondary">
            {content?.[language]?.subtitle}
          </p>
        </div>
        <div className="w-12 h-12 bg-gradient-prosperity rounded-lg flex items-center justify-center">
          <Icon name="BarChart3" size={24} color="white" strokeWidth={2} />
        </div>
      </div>
      <div className="space-y-4">
        {marketData?.indices?.map((index, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Activity" size={16} color="var(--color-primary)" />
              </div>
              <div>
                <div className="font-semibold text-text-primary">
                  {index?.name}
                </div>
                <div className="text-sm text-text-secondary">
                  {index?.value?.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`flex items-center space-x-1 ${
                index?.change >= 0 ? 'text-success' : 'text-error'
              }`}>
                <Icon 
                  name={index?.change >= 0 ? "ArrowUp" : "ArrowDown"} 
                  size={14} 
                />
                <span className="font-medium">
                  {Math.abs(index?.change)?.toFixed(2)}
                </span>
              </div>
              <div className={`text-sm ${
                index?.changePercent >= 0 ? 'text-success' : 'text-error'
              }`}>
                ({index?.changePercent >= 0 ? '+' : ''}{index?.changePercent?.toFixed(2)}%)
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-surface-muted rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-text-primary">
              {content?.[language]?.impact}
            </div>
            <div className="text-xs text-text-secondary">
              {language === 'hi' ? 'आपके निवेश पर' : 'On your investments'}
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getImpactColor(marketData?.portfolioImpact)}`}>
            <div className="flex items-center space-x-1">
              <Icon name={getImpactIcon(marketData?.portfolioImpact)} size={12} />
              <span>
                {content?.[language]?.[marketData?.portfolioImpact]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;