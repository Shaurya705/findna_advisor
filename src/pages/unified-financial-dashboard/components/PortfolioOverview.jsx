import React from 'react';
import Icon from '../../../components/AppIcon';

const PortfolioOverview = ({ portfolioData, language = 'en' }) => {
  const content = {
    en: {
      title: 'Portfolio Overview',
      totalValue: 'Total Value',
      todayChange: "Today\'s Change",
      allocation: 'Asset Allocation',
      viewDetails: 'View Details'
    },
    hi: {
      title: 'पोर्टफोलियो अवलोकन',
      totalValue: 'कुल मूल्य',
      todayChange: 'आज का बदलाव',
      allocation: 'संपत्ति आवंटन',
      viewDetails: 'विवरण देखें'
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(amount);
  };

  const allocationColors = {
    'Equity': 'bg-primary',
    'Debt': 'bg-success',
    'Gold': 'bg-prosperity',
    'Real Estate': 'bg-secondary'
  };

  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {content?.[language]?.title}
          </h3>
          <p className="text-sm text-text-secondary">
            {content?.[language]?.totalValue}
          </p>
        </div>
        <div className="w-12 h-12 bg-gradient-trust rounded-lg flex items-center justify-center">
          <Icon name="TrendingUp" size={24} color="white" strokeWidth={2} />
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <div className="text-3xl font-bold text-text-primary mb-2">
            {formatCurrency(portfolioData?.totalValue)}
          </div>
          <div className="flex items-center space-x-2">
            <Icon 
              name={portfolioData?.todayChange >= 0 ? "ArrowUp" : "ArrowDown"} 
              size={16} 
              color={portfolioData?.todayChange >= 0 ? "var(--color-success)" : "var(--color-error)"} 
            />
            <span className={`text-sm font-medium ${
              portfolioData?.todayChange >= 0 ? 'text-success' : 'text-error'
            }`}>
              {formatCurrency(Math.abs(portfolioData?.todayChange))} ({Math.abs(portfolioData?.todayChangePercent)}%)
            </span>
            <span className="text-sm text-text-secondary">
              {content?.[language]?.todayChange}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3">
            {content?.[language]?.allocation}
          </h4>
          <div className="space-y-3">
            {portfolioData?.allocation?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${allocationColors?.[item?.category] || 'bg-muted'}`} />
                  <span className="text-sm font-medium text-text-primary">
                    {item?.category}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-text-secondary">
                    {item?.percentage}%
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {formatCurrency(item?.value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
          <Icon name="ExternalLink" size={16} />
          <span>{content?.[language]?.viewDetails}</span>
        </button>
      </div>
    </div>
  );
};

export default PortfolioOverview;