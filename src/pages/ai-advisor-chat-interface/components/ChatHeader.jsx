import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatHeader = ({ 
  currentLanguage, 
  onLanguageChange, 
  isOnline, 
  onToggleInsightPanel,
  showInsightPanel
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
      {/* AI Avatar & Status */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30">
            <Icon name="Bot" size={28} className="text-white" strokeWidth={2.5} />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-white ${
            isOnline ? 'bg-green-400' : 'bg-gray-400'
          } shadow-lg`} />
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-white">
            {currentLanguage === 'hi' ? 'फिनडीएनए सलाहकार' : 'FinDNA Advisor'}
          </h2>
          <p className="text-blue-100 text-sm font-medium">
            {isOnline 
              ? (currentLanguage === 'hi' ? 'ऑनलाइन • आपकी मदद के लिए तैयार' : 'Online • Ready to help you')
              : (currentLanguage === 'hi' ? 'ऑफलाइन' : 'Offline')
            }
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-3">
        {/* Language Toggle */}
        <button
          onClick={() => onLanguageChange(currentLanguage === 'hi' ? 'en' : 'hi')}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 px-4 py-2 rounded-lg border border-white/30 text-white font-semibold text-sm"
        >
          {currentLanguage === 'hi' ? 'EN' : 'हिं'}
        </button>

        {/* Insight Panel Toggle */}
        <button
          onClick={onToggleInsightPanel}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 p-2.5 rounded-lg border border-white/30 text-white"
          title={showInsightPanel ? "Hide Insights" : "Show Insights"}
        >
          <Icon 
            name={showInsightPanel ? "SidebarClose" : "SidebarOpen"} 
            size={18} 
            className="text-white"
          />
        </button>

        {/* AI Status Indicator */}
        <div className="flex items-center space-x-2 px-3 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold">
            {currentLanguage === 'hi' ? 'AI सक्रिय' : 'AI Active'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;