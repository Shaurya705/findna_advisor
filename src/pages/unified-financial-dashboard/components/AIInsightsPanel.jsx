import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIInsightsPanel = ({ insights, language = 'en' }) => {
  const navigate = useNavigate();

  const content = {
    en: {
      title: 'AI Insights & Recommendations',
      subtitle: 'Personalized financial guidance',
      priority: 'Priority',
      implement: 'Implement',
      viewAll: 'View All Insights',
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    },
    hi: {
      title: 'AI अंतर्दृष्टि और सुझाव',
      subtitle: 'व्यक्तिगत वित्तीय मार्गदर्शन',
      priority: 'प्राथमिकता',
      implement: 'लागू करें',
      viewAll: 'सभी अंतर्दृष्टि देखें',
      high: 'उच्च',
      medium: 'मध्यम',
      low: 'कम'
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error bg-error/10 border-error/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-text-secondary bg-muted border-border';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'Clock';
      case 'low': return 'Info';
      default: return 'Bell';
    }
  };

  const handleImplement = (insightId) => {
    try {
      navigate('/ai-advisor-chat-interface');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleViewAll = () => {
    try {
      navigate('/ai-advisor-chat-interface');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-surface dark:bg-opacity-90 rounded-xl border border-border dark:border-border dark:border-opacity-30 p-6 shadow-sm hover:shadow-md dark:shadow-black dark:shadow-opacity-20 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-1">
            {content?.[language]?.title}
          </h3>
          <p className="text-sm text-text-secondary dark:text-text-secondary/80">
            {content?.[language]?.subtitle}
          </p>
        </div>
        <div className="w-12 h-12 bg-gradient-cultural rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon name="Brain" size={24} color="white" strokeWidth={2} />
        </div>
      </div>
      <div className="space-y-5">
        {insights?.map((insight, index) => (
          <div key={index} className="p-5 bg-surface-secondary rounded-xl border border-border/50 hover:shadow-sm transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(insight?.priority)}`}>
                  <div className="flex items-center space-x-1">
                    <Icon name={getPriorityIcon(insight?.priority)} size={12} />
                    <span>{content?.[language]?.[insight?.priority]}</span>
                  </div>
                </div>
                <span className="text-xs text-text-secondary">
                  {content?.[language]?.priority}
                </span>
              </div>
              <div className="text-xs text-text-muted">
                {insight?.timestamp}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-text-primary mb-3 leading-tight">
                {insight?.title}
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                {insight?.description}
              </p>
            </div>

            {insight?.potentialSaving && (
              <div className="flex items-center space-x-2 mb-4 p-3 bg-success/5 rounded-lg border border-success/20">
                <Icon name="TrendingUp" size={16} color="var(--color-success)" />
                <span className="text-sm font-medium text-success">
                  {language === 'hi' ? 'संभावित बचत: ' : 'Potential Saving: '}
                  ₹{insight?.potentialSaving?.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Sparkles" size={14} color="var(--color-prosperity)" />
                <span className="text-xs text-text-secondary">
                  {language === 'hi' ? 'AI द्वारा सुझाया गया' : 'AI Recommended'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="ArrowRight"
                iconPosition="right"
                iconSize={14}
                onClick={() => handleImplement(insight?.id)}
                className="text-primary border-primary/20 hover:bg-primary/5"
              >
                {content?.[language]?.implement}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Button
          variant="ghost"
          fullWidth
          iconName="ExternalLink"
          iconPosition="right"
          iconSize={16}
          className="text-primary hover:bg-primary/5"
          onClick={handleViewAll}
        >
          {content?.[language]?.viewAll}
        </Button>
      </div>
    </div>
  );
};

export default AIInsightsPanel;