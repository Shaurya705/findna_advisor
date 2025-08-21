import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIRecommendations = ({ recommendations, language }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedCard, setExpandedCard] = useState(null);

  const categories = [
    { key: 'all', label: language === 'hi' ? 'सभी' : 'All' },
    { key: 'rebalance', label: language === 'hi' ? 'रीबैलेंसिंग' : 'Rebalancing' },
    { key: 'tax', label: language === 'hi' ? 'टैक्स' : 'Tax Optimization' },
    { key: 'risk', label: language === 'hi' ? 'जोखिम' : 'Risk Management' },
    { key: 'opportunity', label: language === 'hi' ? 'अवसर' : 'Opportunities' }
  ];

  const aiRecommendations = [
    {
      id: 1,
      category: 'rebalance',
      priority: 'high',
      title: language === 'hi' ? 'IT सेक्टर एक्सपोज़र कम करें' : 'Reduce IT Sector Exposure',
      description: language === 'hi' ?'आपका IT सेक्टर एक्सपोज़र 20% है जो अधिक है। 5% कम करके फार्मा में निवेश करें।' :'Your IT sector exposure is 20% which is high. Reduce by 5% and invest in pharma sector.',
      impact: language === 'hi' ? 'जोखिम में 15% कमी' : '15% risk reduction',
      potentialGain: '₹45,000',
      timeframe: language === 'hi' ? '2-3 महीने' : '2-3 months',
      reasoning: language === 'hi' ?'IT सेक्टर में हाल की अस्थिरता और वैश्विक मंदी के कारण जोखिम बढ़ा है। फार्मा सेक्टर में बेहतर ग्रोथ की संभावना है।' :'Recent volatility in IT sector and global slowdown has increased risk. Pharma sector shows better growth potential.',
      actionSteps: [
        language === 'hi' ? 'TCS और Infosys के 50% शेयर बेचें' : 'Sell 50% of TCS and Infosys holdings',
        language === 'hi' ? 'Sun Pharma और Dr. Reddy\'s में निवेश करें' : 'Invest in Sun Pharma and Dr. Reddy\'s',
        language === 'hi' ? 'SIP को फार्मा फंड में रीडायरेक्ट करें' : 'Redirect SIP to pharma funds'
      ]
    },
    {
      id: 2,
      category: 'tax',
      priority: 'high',
      title: language === 'hi' ? 'कैपिटल गेन्स हार्वेस्टिंग' : 'Capital Gains Harvesting',
      description: language === 'hi' ?'मार्च से पहले ₹1.2L के लॉसेस को बुक करके टैक्स बचाएं।' :'Book losses of ₹1.2L before March to save on capital gains tax.',
      impact: language === 'hi' ? '₹36,000 टैक्स बचत' : '₹36,000 tax savings',
      potentialGain: '₹36,000',
      timeframe: language === 'hi' ? '1 महीना' : '1 month',
      reasoning: language === 'hi' ?'आपके पास कुछ स्टॉक्स में अनरियलाइज़्ड लॉसेस हैं। इन्हें बुक करके टैक्स बचा सकते हैं।' :'You have unrealized losses in some stocks. Book them to offset capital gains and save tax.',
      actionSteps: [
        language === 'hi' ? 'Vodafone Idea के शेयर बेचें (₹80K लॉस)' : 'Sell Vodafone Idea shares (₹80K loss)',
        language === 'hi' ? 'Yes Bank के शेयर बेचें (₹40K लॉस)' : 'Sell Yes Bank shares (₹40K loss)',
        language === 'hi' ? '31 दिन बाद वापस खरीद सकते हैं' : 'Can repurchase after 31 days'
      ]
    },
    {
      id: 3,
      category: 'opportunity',
      priority: 'medium',
      title: language === 'hi' ? 'रियल एस्टेट REITs में निवेश' : 'Invest in Real Estate REITs',
      description: language === 'hi' ?'रियल एस्टेट REITs में 5% एलोकेशन से पोर्टफोलियो डाइवर्सिफाई करें।' :'Diversify portfolio with 5% allocation to Real Estate REITs.',
      impact: language === 'hi' ? 'डाइवर्सिफिकेशन में सुधार' : 'Improved diversification',
      potentialGain: '₹25,000',
      timeframe: language === 'hi' ? '6-12 महीने' : '6-12 months',
      reasoning: language === 'hi' ?'REITs से नियमित आय और इन्फ्लेशन हेज मिलता है। वर्तमान में अच्छी वैल्यूएशन पर उपलब्ध हैं।' :'REITs provide regular income and inflation hedge. Currently available at attractive valuations.',
      actionSteps: [
        language === 'hi' ? 'Embassy Office Parks REIT खरीदें' : 'Buy Embassy Office Parks REIT',
        language === 'hi' ? 'Mindspace Business Parks REIT में निवेश करें' : 'Invest in Mindspace Business Parks REIT',
        language === 'hi' ? 'मासिक SIP शुरू करें' : 'Start monthly SIP'
      ]
    },
    {
      id: 4,
      category: 'risk',
      priority: 'low',
      title: language === 'hi' ? 'इमर्जेंसी फंड बढ़ाएं' : 'Increase Emergency Fund',
      description: language === 'hi' ?'आपका इमर्जेंसी फंड 4 महीने का है। 6 महीने तक बढ़ाएं।' :'Your emergency fund covers 4 months. Increase it to 6 months.',
      impact: language === 'hi' ? 'वित्तीय सुरक्षा में वृद्धि' : 'Enhanced financial security',
      potentialGain: language === 'hi' ? 'सुरक्षा' : 'Security',
      timeframe: language === 'hi' ? '3-4 महीने' : '3-4 months',
      reasoning: language === 'hi' ?'आर्थिक अनिश्चितता के समय में 6 महीने का इमर्जेंसी फंड आवश्यक है।' :'In times of economic uncertainty, 6 months emergency fund is essential.',
      actionSteps: [
        language === 'hi' ? 'हर महीने ₹15,000 अलग रखें' : 'Set aside ₹15,000 monthly',
        language === 'hi' ? 'लिक्विड फंड में निवेश करें' : 'Invest in liquid funds',
        language === 'hi' ? 'अलग बैंक अकाउंट खोलें' : 'Open separate bank account'
      ]
    }
  ];

  const filteredRecommendations = selectedCategory === 'all' 
    ? aiRecommendations 
    : aiRecommendations?.filter(rec => rec?.category === selectedCategory);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error bg-error/10 border-error/20';
      case 'medium': return 'text-prosperity bg-prosperity/10 border-prosperity/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-text-secondary bg-gray-100 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'Clock';
      case 'low': return 'Info';
      default: return 'Info';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {language === 'hi' ? 'AI सुझाव' : 'AI Recommendations'}
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            {language === 'hi' ? 'व्यक्तिगत निवेश सुझाव' : 'Personalized investment suggestions'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Sparkles" size={20} className="text-prosperity" />
          <span className="text-sm font-medium text-prosperity">
            {language === 'hi' ? 'AI द्वारा संचालित' : 'AI Powered'}
          </span>
        </div>
      </div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories?.map((category) => (
          <button
            key={category?.key}
            onClick={() => setSelectedCategory(category?.key)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              selectedCategory === category?.key
                ? 'bg-primary text-white' :'text-text-secondary hover:text-primary hover:bg-primary/5'
            }`}
          >
            {category?.label}
          </button>
        ))}
      </div>
      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredRecommendations?.map((recommendation) => (
          <div key={recommendation?.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getPriorityColor(recommendation?.priority)}`}>
                  <Icon name={getPriorityIcon(recommendation?.priority)} size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-text-primary">{recommendation?.title}</h4>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(recommendation?.priority)}`}>
                      {language === 'hi' 
                        ? (recommendation?.priority === 'high' ? 'उच्च' : recommendation?.priority === 'medium' ? 'मध्यम' : 'कम')
                        : recommendation?.priority
                      }
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mb-2">{recommendation?.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                    <span>
                      <Icon name="Target" size={12} className="inline mr-1" />
                      {recommendation?.impact}
                    </span>
                    <span>
                      <Icon name="TrendingUp" size={12} className="inline mr-1" />
                      {recommendation?.potentialGain}
                    </span>
                    <span>
                      <Icon name="Clock" size={12} className="inline mr-1" />
                      {recommendation?.timeframe}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName={expandedCard === recommendation?.id ? "ChevronUp" : "ChevronDown"}
                onClick={() => setExpandedCard(expandedCard === recommendation?.id ? null : recommendation?.id)}
              />
            </div>

            {expandedCard === recommendation?.id && (
              <div className="mt-4 pt-4 border-t border-border space-y-4">
                <div>
                  <h5 className="font-medium text-text-primary mb-2">
                    {language === 'hi' ? 'विस्तृत विश्लेषण' : 'Detailed Analysis'}
                  </h5>
                  <p className="text-sm text-text-secondary">{recommendation?.reasoning}</p>
                </div>

                <div>
                  <h5 className="font-medium text-text-primary mb-2">
                    {language === 'hi' ? 'कार्य योजना' : 'Action Steps'}
                  </h5>
                  <ul className="space-y-2">
                    {recommendation?.actionSteps?.map((step, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-text-secondary">
                        <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="default"
                      size="sm"
                      iconName="CheckCircle"
                      iconPosition="left"
                    >
                      {language === 'hi' ? 'स्वीकार करें' : 'Accept'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Clock"
                      iconPosition="left"
                    >
                      {language === 'hi' ? 'बाद में' : 'Later'}
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="X"
                    iconPosition="left"
                    className="text-text-muted hover:text-error"
                  >
                    {language === 'hi' ? 'खारिज करें' : 'Dismiss'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {filteredRecommendations?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
          <h4 className="font-medium text-text-primary mb-2">
            {language === 'hi' ? 'कोई सुझाव नहीं' : 'No Recommendations'}
          </h4>
          <p className="text-sm text-text-secondary">
            {language === 'hi' ?'इस श्रेणी में कोई सुझाव उपलब्ध नहीं है।' :'No recommendations available in this category.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;