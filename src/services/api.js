// API service for FinVoice backend integration
import axios from 'axios';
import { notificationAPI, profileAPI } from './profileNotificationAPI.js';
import { helpSupportService } from './helpSupportService.js';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

const removeAuthToken = () => {
  localStorage.removeItem('authToken');
  delete apiClient.defaults.headers.common['Authorization'];
};

// Initialize token on app start
const token = getAuthToken();
if (token) {
  setAuthToken(token);
}

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      removeAuthToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: async (userData) => {
    // For demo users, return mock successful registration
    if (userData.email === 'demo.user@finvoice.ai' || userData.email === 'demo@finvoice.ai') {
      return {
        user_id: 'demo-user-id',
        email: userData.email,
        full_name: userData.full_name || 'Demo User',
        message: 'Demo user registered successfully'
      };
    }
    
    const response = await apiClient.post('/api/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    // Always try backend login first (even for demo), fallback to mock only if network fails
    try {
      const response = await apiClient.post('/api/auth/token', credentials, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const { access_token } = response.data;
      setAuthToken(access_token);
      return response.data;
    } catch (err) {
      // If network error only, allow mock demo login as fallback
      const isNetworkError = !!err.request && !err.response;
      const username = credentials.get ? credentials.get('username') : 
                       (credentials.username || credentials.email);
      const password = credentials.get ? credentials.get('password') : credentials.password;
      const isDemoCred = (
        (username === 'demo@finvoice.ai' && password === 'demo123') ||
        (username === 'demo.user@finvoice.ai' && password === 'Demo@123') ||
        (username === 'demo@findna.ai' && password === 'demo123')
      );
      if (isNetworkError && isDemoCred) {
        const mockToken = 'demo-jwt-token-' + Date.now();
        setAuthToken(mockToken);
        return {
          access_token: mockToken,
          token_type: 'bearer',
          user: {
            id: 'demo-user-id',
            email: username,
            full_name: 'Demo User',
            role: 'user'
          }
        };
      }
      throw err;
    }
  },

  logout: () => {
    removeAuthToken();
  },

  getCurrentUser: async () => {
    // Prefer backend user profile; fallback to demo profile only on network error
    try {
      const response = await apiClient.get('/api/auth/me');
      return response.data;
    } catch (err) {
      const token = getAuthToken();
      if (token && token.startsWith('demo-jwt-token-') && err.request && !err.response) {
        return {
          id: 'demo-user-id',
          email: 'demo@finvoice.ai',
          full_name: 'Demo User',
          role: 'user',
          is_demo: true,
          created_at: new Date().toISOString()
        };
      }
      throw err;
    }
  },
};

// AI Advisory API
export const advisoryAPI = {
  sendMessage: async (message, conversationId = null) => {
    // Check if using demo account
    const token = getAuthToken();
    if (token && token.startsWith('demo-jwt-token-')) {
      // Generate a mock AI response based on the message
      return generateMockAIResponse(message, conversationId);
    }
    
    try {
      // Backend expects POST /api/advice with { message, conversation_id }
      const response = await apiClient.post('/api/advice', {
        message,
        conversation_id: conversationId,
      });
      // Map backend AdviceResponse -> frontend expected shape
      const data = response.data;
      const now = new Date().toISOString();
      const quickActions = Array.isArray(data.suggestions)
        ? data.suggestions.map((s) => ({ id: String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_'), label: s }))
        : [];
      return {
        message: {
          id: `srv-msg-${Date.now()}`,
          sender: 'ai',
          content: data.reply,
          timestamp: now,
          quick_actions: quickActions,
        },
        conversation_id: data.conversation_id,
        insights: data.relevant_data || null,
        recommendations: [],
      };
    } catch (error) {
      if (error.request) {
        // No response was received, fallback to mock response for all users
        console.warn('Network issue detected, using mock AI response');
        return generateMockAIResponse(message, conversationId);
      }
      throw error;
    }
  },

  getConversationHistory: async (conversationId) => {
    // Check if using demo account
    const token = getAuthToken();
    if (token && token.startsWith('demo-jwt-token-')) {
      return {
        messages: [
          {
            id: 'welcome-msg',
            sender: 'ai',
            content: 'Welcome to FinDNA Advisor! How can I help with your finances today?',
            timestamp: new Date().toISOString(),
            quickActions: [
              { id: 'portfolio', label: 'Portfolio Analysis' },
              { id: 'goals', label: 'Set Financial Goals' },
              { id: 'tax', label: 'Tax Saving Options' }
            ]
          }
        ]
      };
    }
    
    try {
      // Backend: GET /api/conversations/{id} returns ChatConversation with messages
      const response = await apiClient.get(`/api/conversations/${conversationId}`);
      const conv = response.data;
      const mapped = (conv.messages || []).map((m) => ({
        id: m.id,
        sender: m.role === 'assistant' ? 'ai' : 'user',
        content: m.content,
        timestamp: m.timestamp,
        quickActions: (m.metadata && Array.isArray(m.metadata.suggestions))
          ? m.metadata.suggestions.map((s) => ({ id: String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_'), label: s }))
          : [],
        insights: (m.metadata && m.metadata.relevant_data) ? m.metadata.relevant_data : null,
      }));
      return { messages: mapped };
    } catch (error) {
      if (error.request) {
        console.warn('Network issue detected, using mock conversation history');
        return {
          messages: [
            {
              id: 'welcome-msg',
              sender: 'ai',
              content: 'Welcome! How can I help with your finances today?',
              timestamp: new Date().toISOString(),
              quickActions: [
                { id: 'portfolio', label: 'Portfolio Analysis' },
                { id: 'goals', label: 'Set Financial Goals' }
              ]
            }
          ]
        };
      }
      throw error;
    }
  },

  createConversation: async (title = 'New Conversation') => {
    // Check if using demo account
    const token = getAuthToken();
    if (token && token.startsWith('demo-jwt-token-')) {
      return {
        conversation: {
          id: 'demo-conv-' + Date.now(),
          title,
          created_at: new Date().toISOString(),
          last_message: 'New conversation started'
        }
      };
    }
    
    try {
      // Backend auto-creates a conversation on first /api/advice call.
      // Keep this for demo/offline compatibility by returning a local object.
      return {
        conversation: {
          id: 'local-conv-' + Date.now(),
          title,
          created_at: new Date().toISOString(),
          last_message: 'New conversation (local)'
        }
      };
    } catch (error) {
      if (error.request) {
        console.warn('Network issue detected, using mock conversation');
        return {
          conversation: {
            id: 'offline-conv-' + Date.now(),
            title,
            created_at: new Date().toISOString(),
            last_message: 'New conversation started'
          }
        };
      }
      throw error;
    }
  },

  getConversations: async () => {
    // Check if using demo account
    const token = getAuthToken();
    if (token && token.startsWith('demo-jwt-token-')) {
      return {
        conversations: [
          {
            id: 'demo-conv-1',
            title: 'Financial Planning',
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            last_message: 'Here are your investment options'
          },
          {
            id: 'demo-conv-2',
            title: 'Tax Advice',
            created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            last_message: 'You can save ₹45,000 in taxes this year'
          }
        ]
      };
    }
    
    try {
      // Backend: GET /api/conversations returns list[ChatConversation]
      const response = await apiClient.get('/api/conversations');
      const list = Array.isArray(response.data) ? response.data : [];
      const conversations = list.map((c) => ({
        id: c.id,
        title: c.title || `Conversation ${c.id}`,
        created_at: c.created_at,
        last_message: (Array.isArray(c.messages) && c.messages.length > 0)
          ? c.messages[c.messages.length - 1].content
          : ''
      }));
      return { conversations };
    } catch (error) {
      if (error.request) {
        console.warn('Network issue detected, using mock conversations');
        return {
          conversations: [
            {
              id: 'offline-conv-1',
              title: 'My Financial Plan',
              created_at: new Date().toISOString(),
              last_message: 'Welcome to FinDNA Advisor'
            }
          ]
        };
      }
      throw error;
    }
  },

  getFinancialInsights: async () => {
    // Check if using demo account
    const token = getAuthToken();
    if (token && token.startsWith('demo-jwt-token-')) {
      return {
        portfolio_health: 87,
        goal_progress: 73,
        tax_savings: 45000,
        market_sentiment: 'positive',
        recommendations: [
          { id: 1, title: 'Increase retirement contributions by 5%' },
          { id: 2, title: 'Consider tax-saving ELSS funds' },
          { id: 3, title: 'Rebalance portfolio to reduce risk' }
        ]
      };
    }
    
    try {
      // Map to dashboard insights endpoint exposed by backend
      const response = await apiClient.get('/api/dashboard/insights');
      return response.data;
    } catch (error) {
      if (error.request) {
        console.warn('Network issue detected, using mock insights');
        return {
          portfolio_health: 82,
          goal_progress: 68,
          tax_savings: 32000,
          market_sentiment: 'neutral',
          recommendations: [
            { id: 1, title: 'Review your investment allocations' },
            { id: 2, title: 'Consider increasing emergency fund' }
          ]
        };
      }
      throw error;
    }
  },
};

// Dashboard API
export const dashboardAPI = {
  getOverview: async (period = '30d') => {
    const response = await apiClient.get(`/api/dashboard/overview?period=${period}`);
    return response.data;
  },

  getFinancialHealth: async () => {
    const response = await apiClient.get('/api/dashboard/financial-health');
    return response.data;
  },

  getAnomalies: async (days = 30) => {
    const response = await apiClient.get(`/api/dashboard/anomalies?days=${days}`);
    return response.data;
  },

  getForecast: async (forecastDays = 30) => {
    const response = await apiClient.get(`/api/dashboard/forecast?forecast_days=${forecastDays}`);
    return response.data;
  },

  getInsights: async () => {
    const response = await apiClient.get('/api/dashboard/insights');
    return response.data;
  },
};

// Transactions API
export const transactionsAPI = {
  getTransactions: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await apiClient.get(`/api/transactions?${queryParams}`);
    return response.data;
  },

  createTransaction: async (transactionData) => {
    const response = await apiClient.post('/api/transactions', transactionData);
    return response.data;
  },

  updateTransaction: async (id, transactionData) => {
    const response = await apiClient.put(`/api/transactions/${id}`, transactionData);
    return response.data;
  },

  deleteTransaction: async (id) => {
    const response = await apiClient.delete(`/api/transactions/${id}`);
    return response.data;
  },

  getCategories: async (type = null) => {
    const params = type ? `?type=${type}` : '';
    const response = await apiClient.get(`/api/transactions/categories/list${params}`);
    return response.data;
  },

  getMonthlySummary: async (months = 12) => {
    const response = await apiClient.get(`/api/transactions/summary/monthly?months=${months}`);
    return response.data;
  },

  getCategorySummary: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await apiClient.get(`/api/transactions/summary/category?${queryParams}`);
    return response.data;
  },

  bulkImport: async (transactionsData) => {
    const response = await apiClient.post('/api/transactions/bulk/import', transactionsData);
    return response.data;
  },
};

// Expenses API
export const expensesAPI = {
  getExpenses: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await apiClient.get(`/api/expenses?${queryParams}`);
    return response.data;
  },

  createExpense: async (expenseData) => {
    const response = await apiClient.post('/api/expenses', expenseData);
    return response.data;
  },

  updateExpense: async (id, expenseData) => {
    const response = await apiClient.put(`/api/expenses/${id}`, expenseData);
    return response.data;
  },

  deleteExpense: async (id) => {
    const response = await apiClient.delete(`/api/expenses/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await apiClient.get('/api/expenses/categories/list');
    return response.data;
  },

  getMonthlySummary: async (months = 12) => {
    const response = await apiClient.get(`/api/expenses/summary/monthly?months=${months}`);
    return response.data;
  },

  getCategorySummary: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await apiClient.get(`/api/expenses/summary/category?${queryParams}`);
    return response.data;
  },

  getPendingReimbursements: async () => {
    const response = await apiClient.get('/api/expenses/reimbursements/pending');
    return response.data;
  },

  bulkImport: async (expensesData) => {
    const response = await apiClient.post('/api/expenses/bulk/import', expensesData);
    return response.data;
  },
};

// Upload & Invoices API (aligned with backend routes)
export const uploadAPI = {
  // Single invoice upload -> /api/upload
  uploadInvoice: async (file, metadata = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(metadata || {}).forEach((key) => formData.append(key, metadata[key]));
    const response = await apiClient.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data; // { job_id, message, preview_text, confidence }
  },

  // Bulk upload -> /api/upload/bulk
  uploadBulk: async (files = []) => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    const response = await apiClient.post('/api/upload/bulk', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Processing status -> /api/upload/status/{job_id}
  getProcessingStatus: async (jobId) => {
    const response = await apiClient.get(`/api/upload/status/${jobId}`);
    return response.data; // { job_id, invoice_id, status, confidence, extracted_data, processed_at }
  },

  // Invoices listing
  listInvoices: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await apiClient.get(`/api/invoices${query ? `?${query}` : ''}`);
    return response.data;
  },

  getInvoice: async (invoiceId) => {
    const response = await apiClient.get(`/api/invoices/${invoiceId}`);
    return response.data;
  },

  deleteInvoice: async (invoiceId) => {
    const response = await apiClient.delete(`/api/invoices/${invoiceId}`);
    return response.data;
  },
};

// Mock response generator for AI chat functionality
const generateMockAIResponse = (message, conversationId) => {
  // Lowercase message for easier pattern matching
  const lowerMessage = message.toLowerCase();
  
  // Default response if no patterns match
  let responseContent = "I'm here to help with your financial questions. What would you like to know about your investments, savings, or financial goals?";
  let quickActions = [
    { id: 'portfolio', label: 'Portfolio Analysis' },
    { id: 'goals', label: 'Set Financial Goals' }
  ];
  let insights = null;
  let recommendations = [];
  
  // Pattern matching for different types of queries
  if (lowerMessage.includes('portfolio') || lowerMessage.includes('investment')) {
    responseContent = "Your portfolio is performing well with an 87% health score. Your stocks have gained 12% this year, outperforming the market by 3%. Would you like to see a detailed breakdown or get rebalancing recommendations?";
    quickActions = [
      { id: 'details', label: 'Portfolio Details' },
      { id: 'rebalance', label: 'Rebalancing Options' }
    ];
    insights = {
      portfolio_health: 87,
      ytd_return: 12.3,
      market_comparison: '+3.2%'
    };
    recommendations = [
      { id: 1, title: 'Increase allocation to tech sector by 5%' },
      { id: 2, title: 'Consider reducing exposure to financial sector' }
    ];
  } 
  else if (lowerMessage.includes('tax') || lowerMessage.includes('saving')) {
    responseContent = "Based on your current financial profile, you have the potential to save ₹45,000 in taxes this year. The main opportunities are through ELSS investments, health insurance premiums, and home loan interest deductions. Would you like a detailed tax-saving strategy?";
    quickActions = [
      { id: 'tax_strategy', label: 'Tax Strategy' },
      { id: 'elss', label: 'ELSS Options' }
    ];
    insights = {
      potential_savings: 45000,
      utilized_deductions: '68%',
      tax_bracket: '30%'
    };
  }
  else if (lowerMessage.includes('goal') || lowerMessage.includes('retire') || lowerMessage.includes('future')) {
    responseContent = "You're currently on track to meet 73% of your retirement goal by your target date. To improve this, consider increasing your monthly SIP by ₹5,000 or extending your target date by 2 years. Would you like to explore other strategies?";
    quickActions = [
      { id: 'increase_sip', label: 'SIP Increase Options' },
      { id: 'adjust_timeline', label: 'Adjust Timeline' }
    ];
    insights = {
      goal_progress: 73,
      monthly_contribution: 15000,
      projected_shortfall: 1200000
    };
  }
  else if (lowerMessage.includes('market') || lowerMessage.includes('news') || lowerMessage.includes('trend')) {
    responseContent = "The market is currently showing a positive trend with the Sensex up 1.2% today. IT and pharmaceutical sectors are outperforming, while banking stocks are under pressure due to policy concerns. This aligns well with your current portfolio allocation.";
    quickActions = [
      { id: 'market_details', label: 'Market Details' },
      { id: 'portfolio_impact', label: 'Impact on Portfolio' }
    ];
    insights = {
      market_sentiment: 'positive',
      trending_sectors: ['IT', 'Pharma'],
      underperforming_sectors: ['Banking', 'Auto']
    };
  }
  
  // Generic response for help queries
  else if (lowerMessage.includes('help') || lowerMessage.includes('what can you') || lowerMessage.includes('how to')) {
    responseContent = "I'm your financial advisor assistant. I can help with portfolio analysis, tax planning, retirement goals, market insights, and personalized financial advice. What would you like to focus on today?";
    quickActions = [
      { id: 'portfolio', label: 'Portfolio Analysis' },
      { id: 'tax', label: 'Tax Planning' },
      { id: 'goals', label: 'Financial Goals' },
      { id: 'market', label: 'Market Insights' }
    ];
  }
  
  return {
    message: {
      id: `mock-msg-${Date.now()}`,
      sender: 'ai',
      content: responseContent,
      timestamp: new Date().toISOString(),
      quick_actions: quickActions
    },
    conversation_id: conversationId || `mock-conv-${Date.now()}`,
    insights,
    recommendations
  };
};

// Analysis API
export const analysisAPI = {
  analyzeTransactions: async (params = {}) => {
    const response = await apiClient.post('/api/analyze/transactions', params);
    return response.data;
  },

  detectAnomalies: async (params = {}) => {
    const response = await apiClient.post('/api/analyze/anomalies', params);
    return response.data;
  },

  generateReport: async (reportType, params = {}) => {
    const response = await apiClient.post('/api/analyze/report', {
      report_type: reportType,
      ...params,
    });
    return response.data;
  },

  reconcileTransactions: async (params = {}) => {
    const response = await apiClient.post('/api/analyze/reconcile', params);
    return response.data;
  },
};

// Forecast API
export const forecastAPI = {
  getCashflowForecast: async (params = {}) => {
    const response = await apiClient.get('/api/forecast/cashflow', { params });
    return response.data;
  },

  getExpenseForecast: async (params = {}) => {
    const response = await apiClient.get('/api/forecast/expenses', { params });
    return response.data;
  },

  getRevenueForecast: async (params = {}) => {
    const response = await apiClient.get('/api/forecast/revenue', { params });
    return response.data;
  },

  predictCategory: async (transactionData) => {
    const response = await apiClient.post('/api/forecast/predict-category', transactionData);
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  handleApiError: (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      return {
        status,
        message: data.detail || data.message || 'An error occurred',
        errors: data.errors || null,
      };
    } else if (error.request) {
      // Request was made but no response
      return {
        status: 0,
        message: 'Network error. Please check your connection.',
        errors: null,
      };
    } else {
      // Something else happened
      return {
        status: 0,
        message: error.message || 'An unexpected error occurred',
        errors: null,
      };
    }
  },

  formatCurrency: (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  },

  formatDate: (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },

  formatDateTime: (date) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },
};

// Generic API request function for services
export const apiRequest = async (endpoint, method = 'GET', data = null, options = {}) => {
  try {
    const config = {
      url: endpoint,
      method,
      ...options
    };
    
    if (data) {
      if (method.toUpperCase() === 'GET') {
        config.params = data;
      } else {
        config.data = data;
      }
    }
    
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    console.error(`API request error (${method} ${endpoint}):`, error);
    throw error;
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Export notification and profile APIs
export { notificationAPI, profileAPI, helpSupportService };

// Import and export portfolio API
import { portfolioAPI } from './portfolioAPI';
export { portfolioAPI };

// Export the configured client for custom requests
export default apiClient;
