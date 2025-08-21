import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RetirementProgress = ({ retirementData, language = 'en' }) => {
  const content = {
    en: {
      title: 'Retirement Progress',
      subtitle: 'Your future financial security',
      currentCorpus: 'Current Corpus',
      targetCorpus: 'Target Corpus',
      monthlyContribution: 'Monthly Contribution',
      yearsToRetirement: 'Years to Retirement',
      onTrack: 'On Track',
      needsAttention: 'Needs Attention',
      excellent: 'Excellent',
      viewPlan: 'View Retirement Plan',
      optimize: 'Optimize Plan'
    },
    hi: {
      title: 'सेवानिवृत्ति प्रगति',
      subtitle: 'आपकी भविष्य की वित्तीय सुरक्षा',
      currentCorpus: 'वर्तमान कॉर्पस',
      targetCorpus: 'लक्ष्य कॉर्पस',
      monthlyContribution: 'मासिक योगदान',
      yearsToRetirement: 'सेवानिवृत्ति तक वर्ष',
      onTrack: 'सही राह पर',
      needsAttention: 'ध्यान की आवश्यकता',
      excellent: 'उत्कृष्ट',
      viewPlan: 'सेवानिवृत्ति योजना देखें',
      optimize: 'योजना अनुकूलित करें'
    }
  };

  const getProgressStatus = (percentage) => {
    if (percentage >= 80) return 'excellent';
    if (percentage >= 60) return 'onTrack';
    return 'needsAttention';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-success bg-success/10';
      case 'onTrack': return 'text-primary bg-primary/10';
      case 'needsAttention': return 'text-warning bg-warning/10';
      default: return 'text-text-secondary bg-muted';
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

  const progressPercentage = (retirementData?.currentCorpus / retirementData?.targetCorpus) * 100;
  const status = getProgressStatus(progressPercentage);

  const handleViewPlan = () => {
    console.log('Viewing retirement plan');
  };

  const handleOptimize = () => {
    console.log('Optimizing retirement plan');
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
        <div className="w-12 h-12 bg-gradient-trust rounded-lg flex items-center justify-center">
          <Icon name="PiggyBank" size={24} color="white" strokeWidth={2} />
        </div>
      </div>
      <div className="space-y-6">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="var(--color-muted)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke={status === 'excellent' ? 'var(--color-success)' : 
                       status === 'onTrack' ? 'var(--color-primary)' : 'var(--color-warning)'}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${progressPercentage * 3.14} 314`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">
                  {Math.round(progressPercentage)}%
                </div>
                <div className="text-xs text-text-secondary">
                  {language === 'hi' ? 'पूर्ण' : 'Complete'}
                </div>
              </div>
            </div>
          </div>
          
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
            <Icon name={status === 'excellent' ? 'CheckCircle' : status === 'onTrack' ? 'TrendingUp' : 'AlertTriangle'} size={14} />
            <span>{content?.[language]?.[status]}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-surface-secondary rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Wallet" size={16} color="var(--color-primary)" />
              <span className="text-xs text-text-secondary">
                {content?.[language]?.currentCorpus}
              </span>
            </div>
            <div className="text-lg font-bold text-text-primary">
              {formatCurrency(retirementData?.currentCorpus)}
            </div>
          </div>

          <div className="p-4 bg-surface-secondary rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Target" size={16} color="var(--color-prosperity)" />
              <span className="text-xs text-text-secondary">
                {content?.[language]?.targetCorpus}
              </span>
            </div>
            <div className="text-lg font-bold text-text-primary">
              {formatCurrency(retirementData?.targetCorpus)}
            </div>
          </div>

          <div className="p-4 bg-surface-secondary rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Calendar" size={16} color="var(--color-success)" />
              <span className="text-xs text-text-secondary">
                {content?.[language]?.monthlyContribution}
              </span>
            </div>
            <div className="text-lg font-bold text-text-primary">
              {formatCurrency(retirementData?.monthlyContribution)}
            </div>
          </div>

          <div className="p-4 bg-surface-secondary rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Clock" size={16} color="var(--color-warning)" />
              <span className="text-xs text-text-secondary">
                {content?.[language]?.yearsToRetirement}
              </span>
            </div>
            <div className="text-lg font-bold text-text-primary">
              {retirementData?.yearsToRetirement}
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            fullWidth
            iconName="Eye"
            iconPosition="left"
            iconSize={16}
            onClick={handleViewPlan}
            className="text-primary border-primary/20 hover:bg-primary/5"
          >
            {content?.[language]?.viewPlan}
          </Button>
          <Button
            variant="default"
            fullWidth
            iconName="Settings"
            iconPosition="left"
            iconSize={16}
            onClick={handleOptimize}
            className="bg-gradient-cultural hover:opacity-90"
          >
            {content?.[language]?.optimize}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RetirementProgress;