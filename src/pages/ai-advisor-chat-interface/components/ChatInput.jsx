import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatInput = ({ 
  currentLanguage, 
  onSendMessage, 
  isTyping, 
  onVoiceInput,
  isListening,
  initialText
}) => {
  const [message, setMessage] = useState(initialText || '');
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef(null);

  // Keep textarea in sync with live transcript when provided and user hasn't typed
  useEffect(() => {
    if (typeof initialText === 'string') {
      setMessage((prev) => (prev ? prev : initialText));
    }
  }, [initialText]);

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
    const next = !isListening;
    setIsRecording(next);
    onVoiceInput(next);
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
    <div className="bg-white border-t border-gray-200 p-6">
      {/* Suggested Queries */}
      {message === '' && (
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">
            {currentLanguage === 'hi' ? 'सुझावित प्रश्न:' : 'Suggested queries:'}
          </p>
          <div className="flex flex-wrap gap-3">
            {suggestedQueries?.slice(0, 2)?.map((query, index) => (
              <button
                key={index}
                onClick={() => setMessage(query)}
                className="text-sm bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-blue-700 hover:text-blue-800 px-4 py-2 rounded-xl border border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {query?.length > 40 ? `${query?.substring(0, 40)}...` : query}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-4">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e?.target?.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              currentLanguage === 'hi' ? 'अपना सवाल यहाँ लिखें...' : 'Type your question here...'
            }
            className="w-full px-4 py-4 pr-16 border border-gray-300 rounded-2xl bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none text-sm leading-relaxed shadow-sm"
            rows={1}
            style={{ minHeight: '56px', maxHeight: '120px' }}
            disabled={isTyping}
          />
          
          {/* Character count */}
          {message?.length > 0 && (
            <div className="absolute bottom-2 right-16 text-xs text-gray-400 font-medium">
              {message?.length}/500
            </div>
          )}
        </div>

        {/* Voice Input Button */}
        <button
          type="button"
          onClick={handleVoiceToggle}
          className={`p-3 rounded-xl border transition-all duration-200 ${
            (isListening || isRecording) 
              ? 'bg-red-500 hover:bg-red-600 text-white border-red-500 shadow-lg' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-300 shadow-sm hover:shadow-md'
          }`}
          disabled={isTyping}
          title={isRecording ? 'Stop recording' : 'Start voice input'}
        >
          <Icon 
            name={(isListening || isRecording) ? "MicOff" : "Mic"} 
            size={20} 
            className={(isListening || isRecording) ? 'text-white' : 'text-gray-600'}
          />
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message?.trim() || isTyping}
          className={`p-3 rounded-xl transition-all duration-200 ${
            message?.trim() && !isTyping
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Icon 
            name="Send" 
            size={20} 
            className={message?.trim() && !isTyping ? 'text-white' : 'text-gray-400'}
          />
        </button>
      </form>
      
      {/* Voice Recording Indicator */}
  {(isListening || isRecording) && (
        <div className="flex items-center justify-center mt-4 p-3 bg-red-50 rounded-xl border border-red-200">
          <div className="flex items-center space-x-3 text-red-600">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold">
              {currentLanguage === 'hi' ? 'सुन रहा हूँ...' : 'Listening...'}
            </span>
          </div>
        </div>
      )}
      
      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-center justify-center mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-3 text-blue-600">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm font-semibold">
              {currentLanguage === 'hi' ? 'AI टाइप कर रहा है...' : 'AI is typing...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInput;