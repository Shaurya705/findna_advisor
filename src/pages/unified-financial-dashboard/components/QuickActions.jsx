import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const QuickActions = ({ language = 'en' }) => {
  const navigate = useNavigate();

  const handleQuickAction = (path) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback: open in new tab if navigation fails
      window.open(path, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            {language === 'hi' ? 'त्वरित कार्य' : 'Quick Actions'}
          </h3>
          <p className="text-sm text-text-secondary">
            {language === 'hi' ? 'आवश्यक उपकरण एक स्थान पर' : 'Essential tools in one place'}
          </p>
        </div>
        <div className="w-12 h-12 bg-gradient-cultural rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon name="Zap" size={24} color="white" strokeWidth={2} />
        </div>
      </div>
      <div className="space-y-3">
        {[
          { name: language === 'hi' ? 'पोर्टफोलियो विश्लेषण' : 'Portfolio Analysis', icon: 'PieChart', path: '/portfolio-intelligence-center' },
          { name: language === 'hi' ? 'कर कैलकुलेटर' : 'Tax Calculator', icon: 'Calculator', path: '/analytics-reports' },
          { name: language === 'hi' ? 'लक्ष्य योजनाकार' : 'Goal Planner', icon: 'Target', path: '/retirement-planning-lab' },
          { name: language === 'hi' ? 'बाजार अलर्ट' : 'Market Alerts', icon: 'Bell', path: '/ai-advisor-chat-interface' },
        ]?.map((action, index) => (
          <button
            key={index}
            onClick={() => handleQuickAction(action?.path)}
            className="w-full flex items-center justify-between p-4 bg-surface-secondary hover:bg-primary/5 rounded-lg border border-border/50 transition-all duration-200 hover:border-primary/30 group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Icon name={action?.icon} size={18} strokeWidth={2} />
              </div>
              <span className="font-medium text-text-primary group-hover:text-primary transition-colors duration-200">
                {action?.name}
              </span>
            </div>
            <Icon 
              name="ArrowRight" 
              size={16} 
              className="text-text-secondary group-hover:text-primary transition-colors duration-200" 
            />
          </button>
        ))}
      </div>
      <div className="mt-6 pt-5 border-t border-border">
        <div className="flex items-center justify-center space-x-2 text-text-secondary">
          <Icon name="Sparkles" size={16} color="var(--color-prosperity)" />
          <span className="text-sm">
            {language === 'hi' ? 'AI द्वारा व्यक्तिगत रूप से तैयार' : 'Personalized by AI'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;