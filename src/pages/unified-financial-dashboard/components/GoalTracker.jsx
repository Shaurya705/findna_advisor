import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GoalTracker = ({ goals, language = 'en' }) => {
  const content = {
    en: {
      title: 'Goal Achievement Tracker',
      subtitle: 'Track your financial milestones',
      progress: 'Progress',
      target: 'Target',
      achieved: 'Achieved',
      onTrack: 'On Track',
      behindSchedule: 'Behind Schedule',
      completed: 'Completed',
      viewAll: 'View All Goals',
      addGoal: 'Add New Goal'
    },
    hi: {
      title: 'लक्ष्य उपलब्धि ट्रैकर',
      subtitle: 'अपने वित्तीय मील के पत्थर ट्रैक करें',
      progress: 'प्रगति',
      target: 'लक्ष्य',
      achieved: 'प्राप्त',
      onTrack: 'सही राह पर',
      behindSchedule: 'समय से पीछे',
      completed: 'पूर्ण',
      viewAll: 'सभी लक्ष्य देखें',
      addGoal: 'नया लक्ष्य जोड़ें'
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10';
      case 'onTrack': return 'text-primary bg-primary/10';
      case 'behindSchedule': return 'text-warning bg-warning/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'onTrack': return 'TrendingUp';
      case 'behindSchedule': return 'Clock';
      default: return 'Target';
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

  const handleAddGoal = () => {
    console.log('Adding new goal');
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
        <div className="w-12 h-12 bg-gradient-growth rounded-lg flex items-center justify-center">
          <Icon name="Target" size={24} color="white" strokeWidth={2} />
        </div>
      </div>
      <div className="space-y-4">
        {goals?.map((goal, index) => (
          <div key={index} className="p-4 bg-surface-secondary rounded-lg border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={goal?.icon} size={16} color="var(--color-primary)" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">
                    {goal?.name}
                  </h4>
                  <p className="text-xs text-text-secondary">
                    {goal?.category}
                  </p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal?.status)}`}>
                <div className="flex items-center space-x-1">
                  <Icon name={getStatusIcon(goal?.status)} size={10} />
                  <span>{content?.[language]?.[goal?.status]}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">
                  {content?.[language]?.progress}
                </span>
                <span className="text-sm font-medium text-text-primary">
                  {goal?.progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    goal?.status === 'completed' ? 'bg-success' : 
                    goal?.status === 'onTrack' ? 'bg-primary' : 'bg-warning'
                  }`}
                  style={{ width: `${goal?.progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <div className="text-xs text-text-secondary">
                    {content?.[language]?.achieved}
                  </div>
                  <div className="text-sm font-semibold text-text-primary">
                    {formatCurrency(goal?.currentAmount)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary">
                    {content?.[language]?.target}
                  </div>
                  <div className="text-sm font-semibold text-text-primary">
                    {formatCurrency(goal?.targetAmount)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-text-secondary">
                  {language === 'hi' ? 'समय सीमा' : 'Target Date'}
                </div>
                <div className="text-sm font-medium text-text-primary">
                  {goal?.targetDate}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex space-x-3">
        <Button
          variant="outline"
          fullWidth
          iconName="Plus"
          iconPosition="left"
          iconSize={16}
          onClick={handleAddGoal}
          className="text-primary border-primary/20 hover:bg-primary/5"
        >
          {content?.[language]?.addGoal}
        </Button>
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

export default GoalTracker;