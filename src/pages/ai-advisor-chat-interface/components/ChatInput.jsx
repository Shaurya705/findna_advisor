import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatInput = ({ 
  currentLanguage, 
  onSendMessage, 
  isTyping, 
  onVoiceInput,
  isListening 
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message?.trim() && !isTyping) {
      onSendMessage(message?.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    onVoiceInput(!isRecording);
  };

  const suggestedQueries = currentLanguage === 'hi' ? [
    "मेरी retirement planning के लिए क्या strategy suggest करेंगे?",
    "Tax saving के लिए कौन से options हैं?",
    "SIP amount कितना रखना चाहिए?",
    "Emergency fund कैसे बनाएं?"
  ] : [
    "What's the best retirement strategy for me?",
    "How can I optimize my tax savings?",
    "What should be my ideal SIP amount?",
    "How to build an emergency fund?"
  ];

  return (
    <div className="bg-white border-t border-border p-4">
      {/* Suggested Queries */}
      {message === '' && (
        <div className="mb-4">
          <p className="text-xs text-text-secondary mb-2">
            {currentLanguage === 'hi' ? 'सुझावित प्रश्न:' : 'Suggested queries:'}
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries?.slice(0, 2)?.map((query, index) => (
              <button
                key={index}
                onClick={() => setMessage(query)}
                className="text-xs bg-muted hover:bg-border text-text-secondary hover:text-text-primary px-3 py-1 rounded-full transition-colors"
              >
                {query?.length > 40 ? `${query?.substring(0, 40)}...` : query}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e?.target?.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              currentLanguage === 'hi' ?'अपना सवाल यहाँ लिखें...' :'Type your question here...'
            }
            className="w-full px-4 py-3 pr-12 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all-smooth resize-none"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px' }}
            disabled={isTyping}
          />
          
          {/* Character count */}
          {message?.length > 0 && (
            <div className="absolute bottom-1 right-12 text-xs text-text-muted">
              {message?.length}/500
            </div>
          )}
        </div>

        {/* Voice Input Button */}
        <Button
          type="button"
          variant={isRecording ? "default" : "ghost"}
          size="sm"
          iconName={isRecording ? "MicOff" : "Mic"}
          iconSize={18}
          onClick={handleVoiceToggle}
          className={`${isRecording ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'text-text-secondary hover:text-primary'}`}
          disabled={isTyping}
        />

        {/* Send Button */}
        <Button
          type="submit"
          variant="default"
          size="sm"
          iconName="Send"
          iconSize={18}
          disabled={!message?.trim() || isTyping}
          className="bg-gradient-cultural hover:opacity-90"
        />
      </form>
      {/* Voice Recording Indicator */}
      {isRecording && (
        <div className="flex items-center justify-center mt-3 p-2 bg-red-50 rounded-lg">
          <div className="flex items-center space-x-2 text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">
              {currentLanguage === 'hi' ? 'सुन रहा हूँ...' : 'Listening...'}
            </span>
          </div>
        </div>
      )}
      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-center justify-center mt-3 p-2 bg-muted rounded-lg">
          <div className="flex items-center space-x-2 text-text-secondary">
            <Icon name="Bot" size={16} />
            <span className="text-sm">
              {currentLanguage === 'hi' ? 'जवाब तैयार कर रहा हूँ...' : 'Preparing response...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInput;