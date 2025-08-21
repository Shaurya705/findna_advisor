import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ChatHeader from './components/ChatHeader';
import ConversationHistory from './components/ConversationHistory';
import ChatInput from './components/ChatInput';
import QuickActionButtons from './components/QuickActionButtons';
import AIInsightPanel from './components/AIInsightPanel';
import Icon from '../../components/AppIcon';

const AIAdvisorChatInterface = () => {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [showInsightPanel, setShowInsightPanel] = useState(true);

  // Mock conversation data
  const sampleConversations = {
    hi: [
      {
        id: 1,
        sender: 'ai',
        content: `नमस्ते! मैं आपका व्यक्तिगत वित्तीय सलाहकार हूँ। मैं आपकी निवेश रणनीति, टैक्स प्लानिंग, और रिटायरमेंट की योजना में मदद कर सकता हूँ।\n\nआज मैं आपकी कैसे सहायता कर सकता हूँ?`,
        timestamp: new Date(Date.now() - 300000),
        quickActions: [
          { id: 'portfolio', label: 'पोर्टफोलियो देखें' },
          { id: 'goals', label: 'लक्ष्य सेट करें' }
        ]
      },
      {
        id: 2,
        sender: 'user',
        content: 'मेरी retirement planning के लिए क्या strategy suggest करेंगे?',
        timestamp: new Date(Date.now() - 240000)
      },
      {
        id: 3,
        sender: 'ai',
        content: `बहुत अच्छा सवाल! आपकी रिटायरमेंट प्लानिंग के लिए मैं निम्नलिखित रणनीति सुझाता हूँ:\n\n🎯 **EPF अनुकूलन**: आपका EPF योगदान अधिकतम करें\n💰 **ELSS निवेश**: टैक्स बचत के साथ इक्विटी एक्सपोज़र\n🏠 **PPF खाता**: 15 साल का लॉक-इन पीरियड, टैक्स फ्री रिटर्न\n📈 **SIP रणनीति**: मासिक ₹15,000 का SIP शुरू करें\n\nआपकी वर्तमान आयु और आय के आधार पर, आप 60 साल की उम्र तक ₹2.5 करोड़ का कॉर्पस बना सकते हैं।`,
        timestamp: new Date(Date.now() - 180000),
        quickActions: [
          { id: 'sip_calculator', label: 'SIP कैलकुलेटर' },
          { id: 'goal_tracker', label: 'लक्ष्य ट्रैकर' }
        ]
      }
    ],
    en: [
      {
        id: 1,
        sender: 'ai',
        content: `Hello! I'm your personal financial advisor powered by AI. I can help you with investment strategies, tax planning, retirement planning, and much more.\n\nHow can I assist you today?`,
        timestamp: new Date(Date.now() - 300000),
        quickActions: [
          { id: 'portfolio', label: 'View Portfolio' },
          { id: 'goals', label: 'Set Goals' }
        ]
      },
      {
        id: 2,
        sender: 'user',
        content: 'What\'s the best retirement strategy for someone in their 30s?',
        timestamp: new Date(Date.now() - 240000)
      },
      {
        id: 3,
        sender: 'ai',
        content: `Excellent question! For someone in their 30s, here's a comprehensive retirement strategy:\n\n🎯 **Maximize EPF**: Ensure maximum employer contribution\n💰 **ELSS Investments**: Tax-saving equity exposure\n🏠 **PPF Account**: 15-year lock-in with tax-free returns\n📈 **SIP Strategy**: Start with ₹15,000 monthly SIP\n🏥 **Health Insurance**: Adequate coverage for medical emergencies\n\nWith your current age and income profile, you can build a corpus of ₹2.5 crores by age 60 with disciplined investing.`,
        timestamp: new Date(Date.now() - 180000),
        quickActions: [
          { id: 'sip_calculator', label: 'SIP Calculator' },
          { id: 'goal_tracker', label: 'Goal Tracker' }
        ]
      }
    ]
  };

  // Initialize with sample conversation
  useEffect(() => {
    setMessages(sampleConversations?.[currentLanguage] || []);
  }, [currentLanguage]);

  const handleLanguageToggle = () => {
    const newLanguage = currentLanguage === 'hi' ? 'en' : 'hi';
    setCurrentLanguage(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
  };

  const handleSendMessage = (content) => {
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(content);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000 + Math.random() * 2000);
  };

  const generateAIResponse = (userMessage) => {
    const responses = {
      hi: {
        portfolio: `आपका पोर्टफोलियो विश्लेषण:\n\n📊 **कुल निवेश**: ₹8,50,000\n📈 **वर्तमान मूल्य**: ₹9,75,000 (+14.7%)\n🎯 **एसेट एलोकेशन**: 70% इक्विटी, 30% डेट\n\n**सुझाव**: आपका पोर्टफोलियो अच्छा प्रदर्शन कर रहा है। मिड-कैप एक्सपोज़र बढ़ाने पर विचार करें।`,
        tax: `टैक्स बचत के अवसर:\n\n💰 **80C**: ₹1,50,000 की सीमा में से ₹45,000 बचा है\n🏥 **80D**: हेल्थ इंश्योरेंस प्रीमियम के लिए ₹25,000\n🏠 **होम लोन**: ब्याज पर ₹2,00,000 तक की छूट\n\n**कुल बचत संभावना**: ₹31,200`,
        goals: `आइए आपके वित्तीय लक्ष्य निर्धारित करते हैं:\n\n🏠 **घर खरीदना**: 5 साल में ₹50 लाख\n🎓 **बच्चों की शिक्षा**: 15 साल में ₹25 लाख\n✈️ **रिटायरमेंट**: 25 साल में ₹2 करोड़\n\nक्या आप इन लक्ष्यों के लिए SIP शुरू करना चाहेंगे?`,
        market: `आज के मुख्य बाजार अपडेट:\n\n📈 **सेंसेक्स**: +245 पॉइंट्स (0.42%)\n📊 **निफ्टी**: +78 पॉइंट्स (0.45%)\n💼 **सेक्टर**: IT और फार्मा में तेजी\n🌍 **ग्लोबल**: US मार्केट में सकारात्मक रुझान\n\n**सुझाव**: IT स्टॉक्स में निवेश का अच्छा समय है।`
      },
      en: {
        portfolio: `Your Portfolio Analysis:\n\n📊 **Total Investment**: ₹8,50,000\n📈 **Current Value**: ₹9,75,000 (+14.7%)\n🎯 **Asset Allocation**: 70% Equity, 30% Debt\n\n**Recommendation**: Your portfolio is performing well. Consider increasing mid-cap exposure for better growth potential.`,
        tax: `Tax Saving Opportunities:\n\n💰 **80C**: ₹45,000 remaining out of ₹1,50,000 limit\n🏥 **80D**: ₹25,000 for health insurance premium\n🏠 **Home Loan**: Up to ₹2,00,000 interest deduction\n\n**Total Potential Savings**: ₹31,200`,
        goals: `Let's set your financial goals:\n\n🏠 **Home Purchase**: ₹50 lakhs in 5 years\n🎓 **Children's Education**: ₹25 lakhs in 15 years\n✈️ **Retirement**: ₹2 crores in 25 years\n\nWould you like to start SIPs for these goals?`,
        market: `Today's Key Market Updates:\n\n📈 **Sensex**: +245 points (0.42%)\n📊 **Nifty**: +78 points (0.45%)\n💼 **Sectors**: IT and Pharma leading gains\n🌍 **Global**: Positive sentiment from US markets\n\n**Suggestion**: Good time to invest in IT stocks.`
      }
    };

    const lang = currentLanguage;
    let responseContent = '';

    if (userMessage?.toLowerCase()?.includes('portfolio') || userMessage?.includes('पोर्टफोलियो')) {
      responseContent = responses?.[lang]?.portfolio;
    } else if (userMessage?.toLowerCase()?.includes('tax') || userMessage?.includes('टैक्स')) {
      responseContent = responses?.[lang]?.tax;
    } else if (userMessage?.toLowerCase()?.includes('goal') || userMessage?.includes('लक्ष्य')) {
      responseContent = responses?.[lang]?.goals;
    } else if (userMessage?.toLowerCase()?.includes('market') || userMessage?.includes('मार्केट')) {
      responseContent = responses?.[lang]?.market;
    } else {
      responseContent = lang === 'hi' 
        ? `मैं आपके सवाल को समझ गया हूँ। आपकी वित्तीय स्थिति के आधार पर, मैं निम्नलिखित सुझाव देता हूँ:\n\n• अपने निवेश को diversify करें\n• Emergency fund बनाए रखें\n• Regular SIP जारी रखें\n\nक्या आप किसी विशिष्ट विषय पर और जानकारी चाहते हैं?`
        : `I understand your question. Based on your financial profile, here are my recommendations:\n\n• Diversify your investments\n• Maintain an emergency fund\n• Continue regular SIPs\n\nWould you like more information on any specific topic?`;
    }

    return {
      id: Date.now() + 1,
      sender: 'ai',
      content: responseContent,
      timestamp: new Date(),
      quickActions: [
        { id: 'details', label: lang === 'hi' ? 'और जानकारी' : 'More Details' },
        { id: 'implement', label: lang === 'hi' ? 'लागू करें' : 'Implement' }
      ]
    };
  };

  const handleQuickAction = (action) => {
    if (typeof action === 'string') {
      // Handle string actions from quick action buttons
      const actionMessages = {
        portfolio: currentLanguage === 'hi' ? 'मेरा पोर्टफोलियो दिखाएं' : 'Show my portfolio',
        tax: currentLanguage === 'hi' ? 'टैक्स बचत के तरीके बताएं' : 'Tell me about tax saving options',
        goals: currentLanguage === 'hi' ? 'वित्तीय लक्ष्य सेट करना चाहता हूँ' : 'I want to set financial goals',
        market: currentLanguage === 'hi' ? 'आज के मार्केट अपडेट दें' : 'Give me today\'s market updates'
      };
      
      if (actionMessages?.[action]) {
        handleSendMessage(actionMessages?.[action]);
      }
    } else if (action?.id) {
      // Handle action objects from chat messages
      const actionMessages = {
        portfolio: currentLanguage === 'hi' ? 'पोर्टफोलियो विस्तार से दिखाएं' : 'Show detailed portfolio',
        goals: currentLanguage === 'hi' ? 'लक्ष्य निर्धारण शुरू करें' : 'Start goal setting',
        sip_calculator: currentLanguage === 'hi' ? 'SIP कैलकुलेटर खोलें' : 'Open SIP calculator',
        goal_tracker: currentLanguage === 'hi' ? 'लक्ष्य ट्रैकर दिखाएं' : 'Show goal tracker',
        details: currentLanguage === 'hi' ? 'इसके बारे में और बताएं' : 'Tell me more about this',
        implement: currentLanguage === 'hi' ? 'इसे कैसे लागू करूं?' : 'How do I implement this?'
      };

      if (actionMessages?.[action?.id]) {
        handleSendMessage(actionMessages?.[action?.id]);
      }
    }
  };

  const handleVoiceInput = (isRecording) => {
    setIsListening(isRecording);
    if (isRecording) {
      // Simulate voice recognition
      setTimeout(() => {
        const voiceMessages = currentLanguage === 'hi' 
          ? ['मेरा पोर्टफोलियो कैसा चल रहा है?', 'टैक्स बचाने के तरीके बताएं', 'SIP कितना करना चाहिए?']
          : ['How is my portfolio performing?', 'Tell me about tax saving options', 'What should be my SIP amount?'];
        
        const randomMessage = voiceMessages?.[Math.floor(Math.random() * voiceMessages?.length)];
        handleSendMessage(randomMessage);
        setIsListening(false);
      }, 3000);
    }
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  const handleViewDetails = (insightId) => {
    const detailMessages = {
      portfolio_health: currentLanguage === 'hi' ? 'पोर्टफोलियो स्वास्थ्य की विस्तृत रिपोर्ट दें' : 'Give detailed portfolio health report',
      tax_optimization: currentLanguage === 'hi' ? 'टैक्स अनुकूलन की रणनीति बताएं' : 'Explain tax optimization strategy',
      goal_progress: currentLanguage === 'hi' ? 'लक्ष्य प्रगति का विश्लेषण करें' : 'Analyze goal progress'
    };

    if (detailMessages?.[insightId]) {
      handleSendMessage(detailMessages?.[insightId]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16 h-screen flex">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <ChatHeader
            currentLanguage={currentLanguage}
            onLanguageToggle={handleLanguageToggle}
            isOnline={isOnline}
            onSettingsClick={handleSettingsClick}
            aiPersonality={{
              name: currentLanguage === 'hi' ? 'वित्तीय सलाहकार' : 'Financial Advisor',
              type: 'expert',
              expertise: ['investment', 'tax-planning', 'retirement']
            }}
          />
          
          <ConversationHistory
            messages={messages}
            currentLanguage={currentLanguage}
            onQuickAction={handleQuickAction}
            isTyping={isTyping}
          />
          
          <QuickActionButtons
            currentLanguage={currentLanguage}
            onQuickAction={handleQuickAction}
          />
          
          <ChatInput
            currentLanguage={currentLanguage}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
            onVoiceInput={handleVoiceInput}
            isListening={isListening}
          />
        </div>

        {/* AI Insight Panel */}
        {showInsightPanel && (
          <AIInsightPanel
            currentLanguage={currentLanguage}
            onViewDetails={handleViewDetails}
            userProfile={{
              age: 32,
              income: 850000,
              riskTolerance: 'moderate',
              investmentGoals: ['retirement', 'home-purchase', 'education']
            }}
          />
        )}

        {/* Toggle Insight Panel Button */}
        <button
          onClick={() => setShowInsightPanel(!showInsightPanel)}
          className="fixed right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
        >
          <Icon 
            name={showInsightPanel ? "ChevronRight" : "ChevronLeft"} 
            size={20} 
          />
        </button>
      </div>
    </div>
  );
};

export default AIAdvisorChatInterface;