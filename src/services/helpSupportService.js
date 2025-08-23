// helpSupportService.js - API service for help and support
import { apiRequest } from './api';

export const helpSupportService = {
  // Get FAQ categories
  async getFaqCategories() {
    try {
      return await apiRequest('/api/help/faq/categories', 'GET');
    } catch (error) {
      console.error('Failed to fetch FAQ categories:', error);
      throw error;
    }
  },

  // Get FAQs by category
  async getFaqsByCategory(categoryId) {
    try {
      return await apiRequest(`/api/help/faq/categories/${categoryId}`, 'GET');
    } catch (error) {
      console.error('Failed to fetch FAQs by category:', error);
      throw error;
    }
  },

  // Search FAQs
  async searchFaqs(query) {
    try {
      return await apiRequest(`/api/help/faq/search?query=${encodeURIComponent(query)}`, 'GET');
    } catch (error) {
      console.error('Failed to search FAQs:', error);
      throw error;
    }
  },

  // Submit support ticket
  async submitSupportTicket(ticketData) {
    try {
      return await apiRequest('/api/help/support/tickets', 'POST', ticketData);
    } catch (error) {
      console.error('Failed to submit support ticket:', error);
      throw error;
    }
  },

  // Get user's support tickets
  async getUserTickets(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 20,
        status: params.status || '', // open, closed, all
      }).toString();

      return await apiRequest(`/api/help/support/tickets?${queryParams}`, 'GET');
    } catch (error) {
      console.error('Failed to fetch user tickets:', error);
      throw error;
    }
  },

  // Get ticket details
  async getTicketDetails(ticketId) {
    try {
      return await apiRequest(`/api/help/support/tickets/${ticketId}`, 'GET');
    } catch (error) {
      console.error('Failed to fetch ticket details:', error);
      throw error;
    }
  },

  // Add reply to support ticket
  async addTicketReply(ticketId, replyData) {
    try {
      return await apiRequest(`/api/help/support/tickets/${ticketId}/replies`, 'POST', replyData);
    } catch (error) {
      console.error('Failed to add ticket reply:', error);
      throw error;
    }
  },

  // Get contact information
  async getContactInfo() {
    try {
      return await apiRequest('/api/help/contact', 'GET');
    } catch (error) {
      console.error('Failed to fetch contact information:', error);
      throw error;
    }
  },
  
  // Get tutorials and guides
  async getTutorials(category = '') {
    try {
      const queryParams = category ? `?category=${encodeURIComponent(category)}` : '';
      return await apiRequest(`/api/help/tutorials${queryParams}`, 'GET');
    } catch (error) {
      console.error('Failed to fetch tutorials:', error);
      throw error;
    }
  },
  
  // Get tutorial details
  async getTutorialDetails(tutorialId) {
    try {
      return await apiRequest(`/api/help/tutorials/${tutorialId}`, 'GET');
    } catch (error) {
      console.error('Failed to fetch tutorial details:', error);
      throw error;
    }
  },
  
  // Get service status
  async getServiceStatus() {
    try {
      return await apiRequest('/api/help/status', 'GET');
    } catch (error) {
      console.error('Failed to fetch service status:', error);
      throw error;
    }
  },
  
  // Mock implementation for development when API is not available
  mockHelpData: {
    faqCategories: [
      { id: 'general', name: 'General Questions' },
      { id: 'account', name: 'Account Management' },
      { id: 'financial', name: 'Financial Planning' },
      { id: 'investment', name: 'Investment Advice' },
      { id: 'technical', name: 'Technical Support' }
    ],
    
    faqs: {
      general: [
        { 
          id: 'g1', 
          question: 'What is FinDNA Advisor?', 
          answer: 'FinDNA Advisor is an AI-powered financial advisory platform that helps you manage your finances, plan investments, and achieve your financial goals.'
        },
        {
          id: 'g2',
          question: 'How secure is my financial data?',
          answer: 'Your data security is our top priority. We use bank-level 256-bit encryption for all data storage and transmission. Your sensitive information is never shared with third parties without your explicit consent.'
        }
      ],
      account: [
        {
          id: 'a1',
          question: 'How do I change my password?',
          answer: 'To change your password, go to Profile Settings, select the Security tab, and click on "Change Password". You will need to enter your current password and then create a new one.'
        },
        {
          id: 'a2',
          question: 'How do I update my contact information?',
          answer: 'You can update your contact information in Profile Settings. Click on the Personal Details tab to edit your email, phone number, and address.'
        }
      ],
      financial: [
        {
          id: 'f1',
          question: 'How can I create a retirement plan?',
          answer: 'Visit the Retirement Planning Lab where you can create scenarios, adjust investment allocations, set milestones, and generate detailed retirement reports tailored to your financial situation.'
        }
      ]
    },
    
    contactInfo: {
      email: 'support@findna-advisor.com',
      phone: '+91 1800-123-4567',
      hours: 'Monday to Friday, 9:00 AM to 6:00 PM IST',
      address: '123 Financial District, Mumbai, Maharashtra 400001, India',
      socialMedia: {
        twitter: '@FinDNAAdvisor',
        linkedin: 'company/findna-advisor'
      }
    },
    
    serviceStatus: {
      overall: 'operational',
      components: [
        { name: 'Web Application', status: 'operational' },
        { name: 'Mobile App', status: 'operational' },
        { name: 'API Services', status: 'operational' },
        { name: 'Payment Processing', status: 'operational' },
        { name: 'Data Sync', status: 'operational' }
      ],
      lastUpdated: new Date().toISOString()
    }
  },
  
  // Method to use mock data when API is not available
  async getFallbackData(endpoint) {
    console.warn('Using mock data for endpoint:', endpoint);
    
    // Map endpoint to mock data
    if (endpoint.includes('categories')) {
      return { data: this.mockHelpData.faqCategories };
    } else if (endpoint.includes('faq/categories/')) {
      const category = endpoint.split('/').pop();
      return { data: this.mockHelpData.faqs[category] || [] };
    } else if (endpoint.includes('contact')) {
      return { data: this.mockHelpData.contactInfo };
    } else if (endpoint.includes('status')) {
      return { data: this.mockHelpData.serviceStatus };
    }
    
    // Default fallback
    return { data: [] };
  }
};
