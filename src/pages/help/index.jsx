import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { helpSupportService } from '../../services/helpSupportService';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const HelpPage = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [faqCategories, setFaqCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [serviceStatus, setServiceStatus] = useState(null);
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const navigate = useNavigate();

  // Fetch FAQ categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await helpSupportService.getFaqCategories();
        setFaqCategories(response.data || []);
        if (response.data?.length > 0) {
          setSelectedCategory(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching FAQ categories:', error);
        // Fallback to mock data
        const mockData = await helpSupportService.getFallbackData('categories');
        setFaqCategories(mockData.data || []);
        if (mockData.data?.length > 0) {
          setSelectedCategory(mockData.data[0].id);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch FAQs when category changes
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchFaqs = async () => {
      setLoading(true);
      try {
        const response = await helpSupportService.getFaqsByCategory(selectedCategory);
        setFaqs(response.data || []);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        // Fallback to mock data
        const mockData = await helpSupportService.getFallbackData(`faq/categories/${selectedCategory}`);
        setFaqs(mockData.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [selectedCategory]);

  // Fetch contact information and service status
  useEffect(() => {
    const fetchHelpData = async () => {
      try {
        // Fetch contact info
        const contactResponse = await helpSupportService.getContactInfo();
        setContactInfo(contactResponse.data);
      } catch (error) {
        console.error('Error fetching contact info:', error);
        // Fallback to mock data
        const mockData = await helpSupportService.getFallbackData('contact');
        setContactInfo(mockData.data);
      }

      try {
        // Fetch service status
        const statusResponse = await helpSupportService.getServiceStatus();
        setServiceStatus(statusResponse.data);
      } catch (error) {
        console.error('Error fetching service status:', error);
        // Fallback to mock data
        const mockData = await helpSupportService.getFallbackData('status');
        setServiceStatus(mockData.data);
      }
    };

    fetchHelpData();
  }, []);

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await helpSupportService.searchFaqs(searchQuery);
      setFaqs(response.data || []);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error searching FAQs:', error);
      // For demo, just filter mock data
      const allFaqs = [];
      for (const categoryId in helpSupportService.mockHelpData.faqs) {
        allFaqs.push(...helpSupportService.mockHelpData.faqs[categoryId]);
      }
      
      const filteredFaqs = allFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setFaqs(filteredFaqs);
    } finally {
      setLoading(false);
    }
  };

  // Toggle FAQ expansion
  const toggleFaq = (faqId) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [faqId]: !prev[faqId]
    }));
  };

  // Create support ticket
  const handleCreateTicket = () => {
    navigate('/help/support/new-ticket');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Help & Support</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'faq' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('faq')}
        >
          Frequently Asked Questions
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'support' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('support')}
        >
          Contact Support
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'status' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('status')}
        >
          Service Status
        </button>
      </div>
      
      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Categories */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-4">
            <h2 className="font-medium text-lg mb-4">Categories</h2>
            <ul className="space-y-2">
              {faqCategories.map(category => (
                <li key={category.id}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedCategory === category.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-accent'}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
            
            {/* Search */}
            <div className="mt-6">
              <h3 className="font-medium text-sm mb-2">Search</h3>
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search FAQs..."
                  className="flex-1 px-3 py-2 text-sm rounded-l-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-3 py-2 rounded-r-lg"
                >
                  <Icon name="Search" size={16} />
                </button>
              </form>
            </div>
          </div>
          
          {/* FAQ List */}
          <div className="md:col-span-2">
            <h2 className="font-medium text-xl mb-4">
              {selectedCategory ? faqCategories.find(c => c.id === selectedCategory)?.name || 'FAQs' : 'Search Results'}
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <Icon name="Loader2" size={24} className="animate-spin text-primary" />
              </div>
            ) : faqs.length === 0 ? (
              <div className="bg-muted rounded-xl p-8 text-center">
                <Icon name="HelpCircle" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No FAQs Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'No results match your search query.' : 'No FAQs available for this category.'}
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {faqs.map(faq => (
                  <li key={faq.id} className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-4 text-left"
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <span className="font-medium">{faq.question}</span>
                      <Icon 
                        name={expandedFaqs[faq.id] ? "ChevronUp" : "ChevronDown"} 
                        size={18} 
                        className="text-muted-foreground"
                      />
                    </button>
                    
                    {expandedFaqs[faq.id] && (
                      <div className="p-4 pt-0 border-t border-border bg-accent/30">
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      
      {/* Support Tab */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="font-medium text-xl mb-4">Contact Information</h2>
            
            {contactInfo ? (
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon name="Mail" size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Email</p>
                    <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">
                      {contactInfo.email}
                    </a>
                  </div>
                </li>
                
                <li className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon name="Phone" size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Phone</p>
                    <a href={`tel:${contactInfo.phone}`} className="text-foreground">
                      {contactInfo.phone}
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">{contactInfo.hours}</p>
                  </div>
                </li>
                
                <li className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon name="MapPin" size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Address</p>
                    <p className="text-foreground">{contactInfo.address}</p>
                  </div>
                </li>
                
                {contactInfo.socialMedia && (
                  <li className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon name="AtSign" size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Social Media</p>
                      <div className="flex space-x-3 mt-1">
                        {contactInfo.socialMedia.twitter && (
                          <a href={`https://twitter.com/${contactInfo.socialMedia.twitter.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                            {contactInfo.socialMedia.twitter}
                          </a>
                        )}
                        {contactInfo.socialMedia.linkedin && (
                          <a href={`https://linkedin.com/${contactInfo.socialMedia.linkedin}`} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            ) : (
              <div className="flex justify-center py-8">
                <Icon name="Loader2" size={24} className="animate-spin text-primary" />
              </div>
            )}
          </div>
          
          {/* Support Ticket */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="font-medium text-xl mb-4">Submit a Support Ticket</h2>
            <p className="text-muted-foreground mb-6">
              Need personalized help? Our support team is ready to assist you. Submit a ticket and we'll get back to you within 24 hours.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-accent rounded-lg">
                <Icon name="MessageCircle" size={24} className="text-primary mr-4" />
                <div>
                  <h3 className="font-medium">Create a new support ticket</h3>
                  <p className="text-sm text-muted-foreground">Describe your issue in detail for faster resolution</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-accent rounded-lg">
                <Icon name="Clock" size={24} className="text-primary mr-4" />
                <div>
                  <h3 className="font-medium">View your existing tickets</h3>
                  <p className="text-sm text-muted-foreground">Check the status of your support requests</p>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  primary 
                  onClick={handleCreateTicket}
                  className="w-full justify-center"
                >
                  <Icon name="TicketPlus" size={18} className="mr-2" />
                  Create New Ticket
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Service Status Tab */}
      {activeTab === 'status' && (
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <h2 className="font-medium text-xl mb-4">Service Status</h2>
          
          {serviceStatus ? (
            <>
              <div className={`flex items-center p-4 rounded-lg ${
                serviceStatus.overall === 'operational' ? 'bg-green-100 text-green-800' : 
                serviceStatus.overall === 'partial_outage' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                <Icon 
                  name={
                    serviceStatus.overall === 'operational' ? 'CheckCircle' : 
                    serviceStatus.overall === 'partial_outage' ? 'AlertTriangle' : 
                    'XCircle'
                  } 
                  size={24} 
                  className="mr-4" 
                />
                <div>
                  <h3 className="font-medium">
                    {serviceStatus.overall === 'operational' ? 'All Systems Operational' : 
                     serviceStatus.overall === 'partial_outage' ? 'Partial System Outage' : 
                     'System Outage Detected'}
                  </h3>
                  <p className="text-sm">
                    Last updated: {new Date(serviceStatus.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <h3 className="font-medium text-lg mt-6 mb-3">Component Status</h3>
              <ul className="space-y-2">
                {serviceStatus.components.map((component, index) => (
                  <li key={index} className="flex items-center justify-between p-3 border-b border-border last:border-0">
                    <span>{component.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      component.status === 'operational' ? 'bg-green-100 text-green-800' : 
                      component.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {component.status === 'operational' ? 'Operational' : 
                       component.status === 'degraded' ? 'Degraded' : 
                       'Outage'}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="flex justify-center py-8">
              <Icon name="Loader2" size={24} className="animate-spin text-primary" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HelpPage;
