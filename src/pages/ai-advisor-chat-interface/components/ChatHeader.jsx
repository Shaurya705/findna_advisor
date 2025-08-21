import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatHeader = ({ 
  currentLanguage, 
  onLanguageToggle, 
  isOnline, 
  aiPersonality,
  onSettingsClick 
}) => {
  return (
    <div className="bg-white border-b border-border p-4 flex items-center justify-between">
      {/* AI Avatar & Status */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-cultural rounded-full flex items-center justify-center shadow-md">
            <Icon name="Bot" size={24} color="white" strokeWidth={2.5} />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            isOnline ? 'bg-success' : 'bg-gray-400'
          }`} />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            {currentLanguage === 'hi' ? 'फिनडीएनए सलाहकार' : 'FinDNA Advisor'}
          </h2>
          <p className="text-sm text-text-secondary">
            {isOnline 
              ? (currentLanguage === 'hi' ? 'ऑनलाइन • आपकी मदद के लिए तैयार' : 'Online • Ready to help')
              : (currentLanguage === 'hi' ? 'ऑफलाइन' : 'Offline')
            }
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2">
        {/* Language Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onLanguageToggle}
          className="text-text-secondary hover:text-primary"
        >
          <span className="text-sm font-medium">
            {currentLanguage === 'hi' ? 'EN' : 'हिं'}
          </span>
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          iconName="Settings"
          iconSize={18}
          onClick={onSettingsClick}
          className="text-text-secondary hover:text-primary"
        />

        {/* Voice Toggle */}
        <Button
          variant="ghost"
          size="sm"
          iconName="Mic"
          iconSize={18}
          className="text-text-secondary hover:text-primary"
        />
      </div>
    </div>
  );
};

export default ChatHeader;