import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatMessage = ({ message, currentLanguage, onQuickAction }) => {
  const isUser = message?.sender === 'user';
  const isTyping = message?.type === 'typing';

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isTyping) {
    return (
      <div className="flex items-start space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-cultural rounded-full flex items-center justify-center flex-shrink-0">
          <Icon name="Bot" size={16} color="white" />
        </div>
        <div className="bg-muted rounded-lg px-4 py-3 max-w-xs">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start space-x-3 mb-6 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-primary text-white' :'bg-gradient-cultural'
      }`}>
        <Icon name={isUser ? "User" : "Bot"} size={16} color="white" />
      </div>
      {/* Message Content */}
      <div className={`max-w-md ${isUser ? 'text-right' : ''}`}>
        <div className={`rounded-lg px-4 py-3 ${
          isUser 
            ? 'bg-primary text-white ml-auto' :'bg-muted text-text-primary'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {message?.content}
          </p>

          {/* FinBERT sentiment badge */}
          {!isUser && message?.insights?.sentiment && (
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-white/60 border border-white/40">
                <Icon name="Activity" size={12} className="text-gray-600" />
                <span className="uppercase tracking-wide text-gray-700 font-semibold">
                  {String(message.insights.sentiment.label || message.insights.sentiment.sentiment || 'neutral')}
                </span>
                {typeof message.insights.sentiment.score === 'number' && (
                  <span className="text-gray-500">{(message.insights.sentiment.score * 100).toFixed(0)}%</span>
                )}
              </span>
            </div>
          )}
          
          {/* Quick Actions for AI messages */}
          {!isUser && message?.quickActions && (
            <div className="flex flex-wrap gap-2 mt-3">
              {message?.quickActions?.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="xs"
                  onClick={() => onQuickAction(action)}
                  className="text-xs bg-white/50 hover:bg-white/80 border-white/30"
                >
                  {action?.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <p className={`text-xs text-text-muted mt-1 ${isUser ? 'text-right' : ''}`}>
          {formatTimestamp(message?.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;