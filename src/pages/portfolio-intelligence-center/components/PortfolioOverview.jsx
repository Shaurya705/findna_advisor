import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PortfolioOverview = ({ portfolioData, language }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('1Y');

  const periods = [
    { key: '1M', label: language === 'hi' ? '1 महीना' : '1 Month' },
    { key: '3M', label: language === 'hi' ? '3 महीने' : '3 Months' },
    { key: '6M', label: language === 'hi' ? '6 महीने' : '6 Months' },
    { key: '1Y', label: language === 'hi' ? '1 साल' : '1 Year' },
    { key: '3Y', label: language === 'hi' ? '3 साल' : '3 Years' },
    { key: '5Y', label: language === 'hi' ? '5 साल' : '5 Years' }
  ];

  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            {language === 'hi' ? 'पोर्टफोलियो अवलोकन' : 'Portfolio Overview'}
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            {language === 'hi' ? 'आपके निवेश का समग्र दृश्य' : 'Comprehensive view of your investments'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {periods?.map((period) => (
            <button
              key={period?.key}
              onClick={() => setSelectedPeriod(period?.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                selectedPeriod === period?.key
                  ? 'bg-primary text-white' :'text-text-secondary hover:text-primary hover:bg-primary/5'
              }`}
            >
              {period?.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Portfolio Value */}
        <div className="bg-gradient-to-br from-primary/5 to-prosperity/5 rounded-lg p-4 border border-primary/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">
              {language === 'hi' ? 'कुल पोर्टफोलियो मूल्य' : 'Total Portfolio Value'}
            </span>
            <Icon name="TrendingUp" size={16} className="text-primary" />
          </div>
          <div className="text-2xl font-bold text-text-primary">₹{portfolioData?.totalValue?.toLocaleString('en-IN')}</div>
          <div className="flex items-center mt-2">
            <Icon name="ArrowUp" size={14} className="text-success mr-1" />
            <span className="text-sm text-success font-medium">+{portfolioData?.totalGain}%</span>
            <span className="text-xs text-text-secondary ml-2">
              {language === 'hi' ? 'इस महीने' : 'This month'}
            </span>
          </div>
        </div>

        {/* Today's Change */}
        <div className="bg-gradient-to-br from-success/5 to-prosperity/5 rounded-lg p-4 border border-success/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">
              {language === 'hi' ? 'आज का बदलाव' : "Today's Change"}
            </span>
            <Icon name="Activity" size={16} className="text-success" />
          </div>
          <div className="text-2xl font-bold text-text-primary">₹{portfolioData?.todayChange?.toLocaleString('en-IN')}</div>
          <div className="flex items-center mt-2">
            <Icon name="ArrowUp" size={14} className="text-success mr-1" />
            <span className="text-sm text-success font-medium">+{portfolioData?.todayChangePercent}%</span>
            <span className="text-xs text-text-secondary ml-2">
              {language === 'hi' ? 'आज तक' : 'As of today'}
            </span>
          </div>
        </div>

        {/* Invested Amount */}
        <div className="bg-gradient-to-br from-prosperity/5 to-growth/5 rounded-lg p-4 border border-prosperity/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">
              {language === 'hi' ? 'निवेशित राशि' : 'Invested Amount'}
            </span>
            <Icon name="PiggyBank" size={16} className="text-prosperity" />
          </div>
          <div className="text-2xl font-bold text-text-primary">₹{portfolioData?.investedAmount?.toLocaleString('en-IN')}</div>
          <div className="flex items-center mt-2">
            <Icon name="Plus" size={14} className="text-prosperity mr-1" />
            <span className="text-sm text-prosperity font-medium">₹{portfolioData?.monthlyInvestment?.toLocaleString('en-IN')}</span>
            <span className="text-xs text-text-secondary ml-2">
              {language === 'hi' ? 'मासिक SIP' : 'Monthly SIP'}
            </span>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          className="hover:bg-primary/5"
        >
          {language === 'hi' ? 'निवेश जोड़ें' : 'Add Investment'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="RefreshCw"
          iconPosition="left"
          className="hover:bg-prosperity/5"
        >
          {language === 'hi' ? 'रीबैलेंस करें' : 'Rebalance'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          iconPosition="left"
          className="hover:bg-success/5"
        >
          {language === 'hi' ? 'रिपोर्ट डाउनलोड करें' : 'Download Report'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="Calculator"
          iconPosition="left"
          className="hover:bg-growth/5"
        >
          {language === 'hi' ? 'टैक्स ऑप्टिमाइज़ करें' : 'Tax Optimize'}
        </Button>
      </div>
    </div>
  );
};

export default PortfolioOverview;