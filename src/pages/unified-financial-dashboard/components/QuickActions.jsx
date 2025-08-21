import React from 'react';
import Icon from '../../../components/AppIcon';


const QuickActions = ({ language = 'en' }) => {
  const content = {
    en: {
      title: 'Quick Actions',
      subtitle: 'Frequently used tools',
      actions: [
        {
          id: 'portfolio-analysis',
          name: 'Portfolio Analysis',
          description: 'Analyze your investments',
          icon: 'PieChart',
          color: 'bg-primary/10 text-primary'
        },
        {
          id: 'tax-calculator',
          name: 'Tax Calculator',
          description: 'Calculate tax savings',
          icon: 'Calculator',
          color: 'bg-prosperity/10 text-prosperity'
        },
        {
          id: 'goal-planner',
          name: 'Goal Planner',
          description: 'Plan financial goals',
          icon: 'Target',
          color: 'bg-success/10 text-success'
        },
        {
          id: 'market-alerts',
          name: 'Market Alerts',
          description: 'Set price alerts',
          icon: 'Bell',
          color: 'bg-warning/10 text-warning'
        },
        {
          id: 'expense-tracker',
          name: 'Expense Tracker',
          description: 'Track your spending',
          icon: 'Receipt',
          color: 'bg-secondary/10 text-secondary'
        },
        {
          id: 'investment-ideas',
          name: 'Investment Ideas',
          description: 'AI-powered suggestions',
          icon: 'Lightbulb',
          color: 'bg-growth/10 text-growth'
        }
      ]
    },
    hi: {
      title: 'त्वरित कार्य',
      subtitle: 'अक्सर उपयोग किए जाने वाले उपकरण',
      actions: [
        {
          id: 'portfolio-analysis',
          name: 'पोर्टफोलियो विश्लेषण',
          description: 'अपने निवेश का विश्लेषण करें',
          icon: 'PieChart',
          color: 'bg-primary/10 text-primary'
        },
        {
          id: 'tax-calculator',
          name: 'कर कैलकुलेटर',
          description: 'कर बचत की गणना करें',
          icon: 'Calculator',
          color: 'bg-prosperity/10 text-prosperity'
        },
        {
          id: 'goal-planner',
          name: 'लक्ष्य योजनाकार',
          description: 'वित्तीय लक्ष्यों की योजना बनाएं',
          icon: 'Target',
          color: 'bg-success/10 text-success'
        },
        {
          id: 'market-alerts',
          name: 'बाजार अलर्ट',
          description: 'मूल्य अलर्ट सेट करें',
          icon: 'Bell',
          color: 'bg-warning/10 text-warning'
        },
        {
          id: 'expense-tracker',
          name: 'व्यय ट्रैकर',
          description: 'अपने खर्च को ट्रैक करें',
          icon: 'Receipt',
          color: 'bg-secondary/10 text-secondary'
        },
        {
          id: 'investment-ideas',
          name: 'निवेश विचार',
          description: 'AI-संचालित सुझाव',
          icon: 'Lightbulb',
          color: 'bg-growth/10 text-growth'
        }
      ]
    }
  };

  const handleQuickAction = (actionId) => {
    console.log(`Quick action clicked: ${actionId}`);
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
        <div className="w-12 h-12 bg-gradient-cultural rounded-lg flex items-center justify-center">
          <Icon name="Zap" size={24} color="white" strokeWidth={2} />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {content?.[language]?.actions?.map((action) => (
          <button
            key={action?.id}
            onClick={() => handleQuickAction(action?.id)}
            className="p-4 bg-surface-secondary hover:bg-surface-muted rounded-lg border border-border/50 transition-all duration-200 hover:shadow-sm group"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto ${action?.color} group-hover:scale-110 transition-transform duration-200`}>
              <Icon name={action?.icon} size={20} strokeWidth={2} />
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-text-primary text-sm mb-1">
                {action?.name}
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                {action?.description}
              </p>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-center space-x-2 text-text-secondary">
          <Icon name="Sparkles" size={16} color="var(--color-prosperity)" />
          <span className="text-sm">
            {language === 'hi' ?'AI द्वारा आपके लिए व्यक्तिगत रूप से तैयार किया गया' :'Personalized for you by AI'
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;