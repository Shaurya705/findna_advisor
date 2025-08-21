import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggleCollapse, className = '' }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();

  const navigationItems = [
    { 
      name: 'Dashboard', 
      path: '/unified-financial-dashboard', 
      icon: 'LayoutDashboard',
      description: 'Overview & insights'
    },
    { 
      name: 'AI Advisor', 
      path: '/ai-advisor-chat-interface', 
      icon: 'Bot',
      description: 'Chat with AI advisor'
    },
    { 
      name: 'Portfolio', 
      path: '/portfolio-intelligence-center', 
      icon: 'TrendingUp',
      description: 'Investment analysis'
    },
    { 
      name: 'Retirement', 
      path: '/retirement-planning-lab', 
      icon: 'PiggyBank',
      description: 'Plan your future'
    },
    { 
      name: 'Security', 
      path: '/security-trust-center', 
      icon: 'Shield',
      description: 'Trust & security'
    },
  ];

  const quickActions = [
    { name: 'Quick Analysis', icon: 'Zap', action: 'analysis' },
    { name: 'Goal Tracker', icon: 'Target', action: 'goals' },
    { name: 'Tax Optimizer', icon: 'Calculator', action: 'tax' },
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const handleQuickAction = (action) => {
    console.log(`Quick action: ${action}`);
  };

  return (
    <aside 
      className={`fixed left-0 top-16 bottom-0 z-40 bg-white border-r border-border transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${className}`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-cultural rounded-lg flex items-center justify-center">
                  <Icon name="Compass" size={16} color="white" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">Navigation</h3>
                  <p className="text-xs text-text-secondary">Financial tools</p>
                </div>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
              iconSize={16}
              onClick={onToggleCollapse}
              className="hover:bg-primary/5"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              onMouseEnter={() => setHoveredItem(item?.path)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`relative flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActivePath(item?.path)
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                  : 'text-text-secondary hover:text-primary hover:bg-primary/5'
              }`}
            >
              <div className={`flex-shrink-0 ${isActivePath(item?.path) ? 'text-primary' : ''}`}>
                <Icon name={item?.icon} size={20} />
              </div>
              
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item?.name}</div>
                  <div className="text-xs text-text-muted truncate">{item?.description}</div>
                </div>
              )}
              
              {isActivePath(item?.path) && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && hoveredItem === item?.path && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                  <div className="font-medium">{item?.name}</div>
                  <div className="text-xs opacity-75">{item?.description}</div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Quick Actions
            </h4>
            <div className="space-y-2">
              {quickActions?.map((action) => (
                <button
                  key={action?.action}
                  onClick={() => handleQuickAction(action?.action)}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  <Icon name={action?.icon} size={16} />
                  <span>{action?.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Upgrade Prompt */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border">
            <div className="bg-gradient-cultural rounded-lg p-4 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full translate-y-6 -translate-x-6" />
              
              <div className="relative">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Crown" size={16} color="white" />
                  <span className="text-sm font-semibold">Premium</span>
                </div>
                <p className="text-xs opacity-90 mb-3">
                  Unlock advanced AI insights and personalized strategies
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed Upgrade Button */}
        {isCollapsed && (
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              iconName="Crown"
              iconSize={16}
              className="w-full text-prosperity hover:bg-prosperity/10"
              onClick={() => console.log('Upgrade clicked')}
            />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;