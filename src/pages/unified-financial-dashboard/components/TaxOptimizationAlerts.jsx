import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaxOptimizationAlerts = ({ alerts, language = 'en' }) => {
  const content = {
    en: {
      title: 'Tax Optimization Alerts',
      subtitle: 'GSTN-integrated insights',
      deadline: 'Deadline',
      action: 'Take Action',
      viewAll: 'View All Alerts',
      days: 'days left',
      urgent: 'Urgent',
      important: 'Important',
      reminder: 'Reminder'
    },
    hi: {
      title: 'कर अनुकूलन अलर्ट',
      subtitle: 'GSTN-एकीकृत अंतर्दृष्टि',
      deadline: 'समय सीमा',
      action: 'कार्रवाई करें',
      viewAll: 'सभी अलर्ट देखें',
      days: 'दिन बचे',
      urgent: 'तत्काल',
      important: 'महत्वपूर्ण',
      reminder: 'अनुस्मारक'
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'urgent': return 'text-error bg-error/10 border-error/20';
      case 'important': return 'text-warning bg-warning/10 border-warning/20';
      case 'reminder': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-text-secondary bg-muted border-border';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'urgent': return 'AlertCircle';
      case 'important': return 'Clock';
      case 'reminder': return 'Bell';
      default: return 'Info';
    }
  };

  const handleTakeAction = (alertId) => {
    console.log(`Taking action for alert: ${alertId}`);
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
          <Icon name="Calculator" size={24} color="white" strokeWidth={2} />
        </div>
      </div>
      <div className="space-y-4">
        {alerts?.map((alert, index) => (
          <div key={index} className="p-4 bg-surface-secondary rounded-lg border border-border/50">
            <div className="flex items-start justify-between mb-3">
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getAlertColor(alert?.type)}`}>
                <div className="flex items-center space-x-1">
                  <Icon name={getAlertIcon(alert?.type)} size={12} />
                  <span>{content?.[language]?.[alert?.type]}</span>
                </div>
              </div>
              <div className="text-xs text-text-muted">
                {alert?.daysLeft} {content?.[language]?.days}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-text-primary mb-2">
                {alert?.title}
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                {alert?.description}
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={14} color="var(--color-text-secondary)" />
                <span className="text-sm text-text-secondary">
                  {content?.[language]?.deadline}: {alert?.deadline}
                </span>
              </div>
              {alert?.potentialSaving && (
                <div className="flex items-center space-x-1 text-success">
                  <Icon name="IndianRupee" size={14} />
                  <span className="text-sm font-medium">
                    {alert?.potentialSaving?.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={14} color="var(--color-primary)" />
                <span className="text-xs text-text-secondary">
                  {language === 'hi' ? 'GSTN एकीकृत' : 'GSTN Integrated'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="ArrowRight"
                iconPosition="right"
                iconSize={14}
                onClick={() => handleTakeAction(alert?.id)}
                className="text-primary border-primary/20 hover:bg-primary/5"
              >
                {content?.[language]?.action}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Button
          variant="ghost"
          fullWidth
          iconName="ExternalLink"
          iconPosition="right"
          iconSize={16}
          className="text-primary hover:bg-primary/5"
        >
          {content?.[language]?.viewAll}
        </Button>
      </div>
    </div>
  );
};

export default TaxOptimizationAlerts;