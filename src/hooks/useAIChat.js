import { useState, useEffect, useCallback } from 'react';
import { advisoryAPI, dashboardAPI, apiUtils } from '../services/api';

export const useAIChat = () => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);

  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
    loadInsights();
  }, []);

  // Load conversation history when conversation changes
  useEffect(() => {
    if (currentConversationId) {
      loadConversationHistory(currentConversationId);
    }
  }, [currentConversationId]);

  const loadConversations = async () => {
    try {
      const response = await advisoryAPI.getConversations();
      setConversations(response.conversations || []);
      
      // Set current conversation to the most recent one
      if (response.conversations && response.conversations.length > 0) {
        setCurrentConversationId(response.conversations[0].id);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
      const apiError = apiUtils.handleApiError(error);
      setError(apiError.message);
    }
  };

  const loadConversationHistory = async (conversationId) => {
    try {
      setLoading(true);
      const response = await advisoryAPI.getConversationHistory(conversationId);
      setMessages(response.messages || []);
    } catch (error) {
      console.error('Failed to load conversation history:', error);
      const apiError = apiUtils.handleApiError(error);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const loadInsights = async () => {
    try {
      const response = await advisoryAPI.getFinancialInsights();
      setInsights(response);
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
  };

  const createNewConversation = async (title = 'New Conversation') => {
    try {
  // Defer to backend on first message; keep helper for demo mode
  const response = await advisoryAPI.createConversation(title);
  const newConversation = response.conversation;
  setConversations(prev => [newConversation, ...prev]);
  setCurrentConversationId(newConversation.id);
  setMessages([]);
  return newConversation;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      const apiError = apiUtils.handleApiError(error);
      setError(apiError.message);
      return null;
    }
  };

  const sendMessage = async (messageContent) => {
    if (!messageContent.trim()) return;

    try {
      setIsTyping(true);
      setError(null);

      // Add user message to the UI immediately
      const userMessage = {
        id: Date.now(),
        sender: 'user',
        content: messageContent,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, userMessage]);

      // Send message to backend (backend will create conversation if id is null)
      const response = await advisoryAPI.sendMessage(messageContent, currentConversationId || null);
      
      // Add AI response to messages
      const aiMessage = {
        id: response.message.id || Date.now() + 1,
        sender: 'ai',
        content: response.message.content,
        timestamp: response.message.timestamp,
        quickActions: response.message.quick_actions || [],
        insights: response.insights || null,
        recommendations: response.recommendations || [],
      };

      setMessages(prev => [...prev, aiMessage]);

      // If this was the first message, set the server conversation id
      if (!currentConversationId && response.conversation_id) {
        setCurrentConversationId(response.conversation_id);
        // Prepend to conversations list with a basic title
        setConversations(prev => [
          {
            id: response.conversation_id,
            title: messageContent.slice(0, 50),
            created_at: new Date().toISOString(),
            last_message: aiMessage.content
          },
          ...prev
        ]);
      } else if (response.conversation_id) {
        // Update last message for existing conversation
        setConversations(prev => prev.map(c => c.id === response.conversation_id ? { ...c, last_message: aiMessage.content } : c));
      }

      // Update insights if provided
      if (response.insights) {
        setInsights(response.insights);
      }

      return response;
    } catch (error) {
      console.error('Failed to send message:', error);
      const apiError = apiUtils.handleApiError(error);
      
      // Only show error for non-network issues
      if (apiError.message.includes('Network error')) {
        // For network errors, we'll use mock data automatically but show a notification
        setError(apiError.message);
        
        // Auto-clear network errors after 5 seconds
        setTimeout(() => {
          if (setError) {
            setError(null);
          }
        }, 5000);
        
        // Try to use mock data
        try {
          // Generate a mock response using our function directly
          const mockResponse = {
            message: {
              id: `mock-${Date.now()}`,
              sender: 'ai',
              content: "I'm having trouble connecting to the server, but I can still help you with basic financial questions in demo mode.",
              timestamp: new Date().toISOString(),
              quick_actions: [
                { id: 'portfolio', label: 'Portfolio Analysis' },
                { id: 'tax', label: 'Tax Planning' }
              ]
            }
          };
          
          const aiMessage = {
            id: mockResponse.message.id,
            sender: 'ai',
            content: mockResponse.message.content,
            timestamp: mockResponse.message.timestamp,
            quickActions: mockResponse.message.quick_actions,
            insights: null,
            recommendations: [],
            isDemo: true
          };
          
          setMessages(prev => [...prev, aiMessage]);
          
        } catch (mockError) {
          console.error('Failed to generate mock response:', mockError);
        }
      } else {
        setError(apiError.message);
        
        // Add error message to chat
        const errorMessage = {
          id: Date.now() + 2,
          sender: 'ai',
          content: `Sorry, I encountered an error: ${apiError.message}. Please try again.`,
          timestamp: new Date().toISOString(),
          isError: true,
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
      return null;
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (actionId, messageId) => {
    try {
      let actionMessage = '';
      
      switch (actionId) {
        case 'portfolio':
          actionMessage = 'Show me my portfolio analysis';
          break;
        case 'goals':
          actionMessage = 'Help me set financial goals';
          break;
        case 'tax':
          actionMessage = 'What are my tax saving options?';
          break;
        case 'market':
          actionMessage = 'Give me market updates';
          break;
        case 'sip_calculator':
          actionMessage = 'Help me calculate SIP amount';
          break;
        case 'goal_tracker':
          actionMessage = 'Show me goal tracking options';
          break;
        case 'details':
          actionMessage = 'Give me more details on this';
          break;
        case 'implement':
          actionMessage = 'How can I implement this advice?';
          break;
        default:
          actionMessage = `Execute action: ${actionId}`;
      }
      
      await sendMessage(actionMessage);
    } catch (error) {
      console.error('Failed to handle quick action:', error);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const resetChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setError(null);
  };

  // Get financial context for better AI responses
  const getFinancialContext = useCallback(async () => {
    try {
      const [overview, health, forecast] = await Promise.all([
        dashboardAPI.getOverview('30d'),
        dashboardAPI.getFinancialHealth(),
        dashboardAPI.getForecast(30),
      ]);

      return {
        overview,
        health,
        forecast,
      };
    } catch (error) {
      console.error('Failed to get financial context:', error);
      return null;
    }
  }, []);

  // Enhanced send message with financial context
  const sendMessageWithContext = async (messageContent) => {
    try {
      const context = await getFinancialContext();
      
      // You can modify this to send context with the message if your backend supports it
      return await sendMessage(messageContent);
    } catch (error) {
      return await sendMessage(messageContent);
    }
  };

  const generateSuggestedQueries = (language = 'en') => {
    const queries = {
      en: [
        "What's my current financial health score?",
        "How should I optimize my investment portfolio?",
        "What are the best tax saving strategies for me?",
        "Help me plan for retirement",
        "Analyze my spending patterns",
        "What's my cash flow forecast?",
        "How can I improve my savings rate?",
        "Show me market insights and opportunities",
      ],
      hi: [
        "मेरा वर्तमान वित्तीय स्वास्थ्य स्कोर क्या है?",
        "मुझे अपने निवेश पोर्टफोलियो को कैसे अनुकूलित करना चाहिए?",
        "मेरे लिए सबसे अच्छी टैक्स बचत रणनीति क्या है?",
        "रिटायरमेंट की योजना बनाने में मदद करें",
        "मेरे खर्च के पैटर्न का विश्लेषण करें",
        "मेरा कैश फ्लो पूर्वानुमान क्या है?",
        "मैं अपनी बचत दर कैसे सुधार सकता हूं?",
        "मुझे बाजार की जानकारी और अवसर दिखाएं",
      ],
    };

    return queries[language] || queries.en;
  };

  return {
    // State
    messages,
    conversations,
    currentConversationId,
    isTyping,
    loading,
    error,
    insights,

    // Actions
    sendMessage,
    sendMessageWithContext,
    handleQuickAction,
    createNewConversation,
    loadConversations,
    loadConversationHistory,
    setCurrentConversationId,
    clearError,
    resetChat,
    loadInsights,

    // Utilities
    generateSuggestedQueries,
    getFinancialContext,
  };
};
