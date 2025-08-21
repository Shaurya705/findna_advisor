import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import Icon from '../../../components/AppIcon';


const ConversationHistory = ({ 
  messages, 
  currentLanguage, 
  onQuickAction,
  isTyping 
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (messages?.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-cultural rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="MessageCircle" size={32} color="white" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {currentLanguage === 'hi' ?'नमस्ते! मैं आपका वित्तीय सलाहकार हूँ' :'Hello! I\'m your financial advisor'
            }
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            {currentLanguage === 'hi' ?'मैं आपकी निवेश, टैक्स प्लानिंग, और रिटायरमेंट की योजना में मदद कर सकता हूँ। कोई भी सवाल पूछें!' :'I can help you with investments, tax planning, and retirement strategies. Ask me anything!'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages?.map((message) => (
        <ChatMessage
          key={message?.id}
          message={message}
          currentLanguage={currentLanguage}
          onQuickAction={onQuickAction}
        />
      ))}
      {isTyping && (
        <ChatMessage
          message={{ type: 'typing', sender: 'ai' }}
          currentLanguage={currentLanguage}
          onQuickAction={onQuickAction}
        />
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ConversationHistory;