import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const FloatingChatButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show the floating button on the chat interface page itself
  const isOnChatPage = location.pathname === '/ai-advisor-chat-interface';
  
  if (isOnChatPage) {
    return null;
  }

  const handleChatClick = () => {
    navigate('/ai-advisor-chat-interface');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Button */}
      <div 
        className="relative"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Tooltip */}
        {isExpanded && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap shadow-lg">
            Ask AI Advisor
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
        
        {/* Chat Button */}
        <button
          onClick={handleChatClick}
          className={`
            group relative overflow-hidden
            w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 
            hover:from-blue-600 hover:to-purple-700
            rounded-full shadow-lg hover:shadow-xl
            flex items-center justify-center
            transition-all duration-300 ease-in-out
            hover:scale-110 active:scale-95
            ring-0 hover:ring-4 ring-blue-500/20
          `}
        >
          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse opacity-75"></div>
          
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          
          {/* Chat Icon */}
          <div className="relative z-10 flex items-center justify-center">
            <Icon 
              name="MessageCircle" 
              size={24} 
              color="white" 
              strokeWidth={2}
              className="group-hover:scale-110 transition-transform duration-200"
            />
          </div>
          
          {/* Notification Dot (optional - can be used for unread messages) */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </button>
        
        {/* Ripple Effect on Click */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 scale-0 group-active:opacity-30 group-active:scale-150 transition-all duration-300"></div>
      </div>
    </div>
  );
};

export default FloatingChatButton;
