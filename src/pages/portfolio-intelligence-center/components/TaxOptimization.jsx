import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaxOptimization = ({ taxData, language }) => {
  const [selectedTab, setSelectedTab] = useState('overview');

  const tabs = [
    { key: 'overview', label: language === 'hi' ? 'अवलोकन' : 'Overview' },
    { key: 'harvesting', label: language === 'hi' ? 'हार्वेस्टिंग' : 'Harvesting' },
    { key: 'planning', label: language === 'hi' ? 'योजना' : 'Planning' }
  ];

  const capitalGainsData = [
    {
      type: language === 'hi' ? 'शॉर्ट टर्म' : 'Short Term',
      realized: 125000,
      unrealized: 85000,
      tax: 37500,
      color: '#DC2626'
    },
    {
      type: language === 'hi' ? 'लॉन्ग टर्म' : 'Long Term',
      realized: 280000,
      unrealized: 150000,
      tax: 28000,
      color: '#059669'
    }
  ];

  const taxSavingOpportunities = [
    {
      opportunity: language === 'hi' ? 'लॉस हार्वेस्टिंग' : 'Loss Harvesting',
      amount: 45000,
      savings: 13500,
      deadline: language === 'hi' ? '31 मार्च' : '31st March',
      priority: 'high',
      description: language === 'hi' ?'अनरियलाइज़्ड लॉसेस को बुक करके टैक्स बचाएं' :'Book unrealized losses to offset capital gains'
    },
    {
      opportunity: language === 'hi' ? 'ELSS निवेश' : 'ELSS Investment',
      amount: 150000,
      savings: 46500,
      deadline: language === 'hi' ? '31 मार्च' : '31st March',
      priority: 'high',
      description: language === 'hi' ?'80C के तहत अधिक निवेश करके टैक्स बचाएं' :'Invest more under 80C to save tax'
    },
    {
      opportunity: language === 'hi' ? 'NPS निवेश' : 'NPS Investment',
      amount: 50000,
      savings: 15500,
      deadline: language === 'hi' ? '31 मार्च' : '31st March',
      priority: 'medium',
      description: language === 'hi' ?'80CCD(1B) के तहत अतिरिक्त कटौती' :'Additional deduction under 80CCD(1B)'
    }
  ];

  const harvestingCandidates = [
    {
      stock: 'Vodafone Idea',
      quantity: 5000,
      buyPrice: 18.50,
      currentPrice: 8.20,
      unrealizedLoss: -51500,
      taxSaving: 15450,
      recommendation: language === 'hi' ? 'तुरंत बेचें' : 'Sell Immediately'
    },
    {
      stock: 'Yes Bank',
      quantity: 2000,
      buyPrice: 45.80,
      currentPrice: 18.30,
      unrealizedLoss: -55000,
      taxSaving: 16500,
      recommendation: language === 'hi' ? 'तुरंत बेचें' : 'Sell Immediately'
    },
    {
      stock: 'Suzlon Energy',
      quantity: 8000,
      buyPrice: 12.40,
      currentPrice: 9.80,
      unrealizedLoss: -20800,
      taxSaving: 6240,
      recommendation: language === 'hi' ? 'विचार करें' : 'Consider'
    }
  ];

  const taxPlanningData = [
    { month: language === 'hi' ? 'अप्र' : 'Apr', investment: 12500, taxSaved: 3875 },
    { month: language === 'hi' ? 'मई' : 'May', investment: 12500, taxSaved: 3875 },
    { month: language === 'hi' ? 'जून' : 'Jun', investment: 12500, taxSaved: 3875 },
    { month: language === 'hi' ? 'जुल' : 'Jul', investment: 12500, taxSaved: 3875 },
    { month: language === 'hi' ? 'अग' : 'Aug', investment: 12500, taxSaved: 3875 },
    { month: language === 'hi' ? 'सित' : 'Sep', investment: 12500, taxSaved: 3875 },
    { month: language === 'hi' ? 'अक्ट' : 'Oct', investment: 12500, taxSaved: 3875 },
    { month: language === 'hi' ? 'नव' : 'Nov', investment: 12500, taxSaved: 3875 },
    { month: language === 'hi' ? 'दिस' : 'Dec', investment: 12500, taxSaved: 3875 },
    { month: language === 'hi' ? 'जन' : 'Jan', investment: 12500, taxSaved: 3875 },
    { month: language === 'hi' ? 'फर' : 'Feb', investment: 12500, taxSaved: 3875 },
    { month: language === 'hi' ? 'मार' : 'Mar', investment: 12500, taxSaved: 3875 }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error bg-error/10 border-error/20';
      case 'medium': return 'text-prosperity bg-prosperity/10 border-prosperity/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-text-secondary bg-gray-100 border-gray-200';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-border">
          <p className="font-medium text-text-primary mb-1">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: ₹{entry?.value?.toLocaleString('en-IN')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {language === 'hi' ? 'टैक्स ऑप्टिमाइज़ेशन' : 'Tax Optimization'}
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            {language === 'hi' ? 'स्मार्ट टैक्स प्लानिंग और बचत' : 'Smart tax planning and savings'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Calculator" size={20} className="text-prosperity" />
          <span className="text-sm font-medium text-prosperity">
            {language === 'hi' ? 'FY 2024-25' : 'FY 2024-25'}
          </span>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs?.map((tab) => (
          <button
            key={tab?.key}
            onClick={() => setSelectedTab(tab?.key)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedTab === tab?.key
                ? 'bg-white text-primary shadow-sm'
                : 'text-text-secondary hover:text-primary'
            }`}
          >
            {tab?.label}
          </button>
        ))}
      </div>
      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Tax Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-error/5 to-error/10 rounded-lg p-4 border border-error/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">
                  {language === 'hi' ? 'कुल टैक्स देयता' : 'Total Tax Liability'}
                </span>
                <Icon name="AlertTriangle" size={16} className="text-error" />
              </div>
              <div className="text-2xl font-bold text-text-primary">₹65,500</div>
              <div className="text-xs text-text-secondary mt-1">
                {language === 'hi' ? 'कैपिटल गेन्स टैक्स' : 'Capital gains tax'}
              </div>
            </div>

            <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-lg p-4 border border-success/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">
                  {language === 'hi' ? 'संभावित बचत' : 'Potential Savings'}
                </span>
                <Icon name="TrendingDown" size={16} className="text-success" />
              </div>
              <div className="text-2xl font-bold text-text-primary">₹75,450</div>
              <div className="text-xs text-text-secondary mt-1">
                {language === 'hi' ? 'ऑप्टिमाइज़ेशन के बाद' : 'After optimization'}
              </div>
            </div>

            <div className="bg-gradient-to-br from-prosperity/5 to-prosperity/10 rounded-lg p-4 border border-prosperity/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">
                  {language === 'hi' ? 'समय सीमा' : 'Time Remaining'}
                </span>
                <Icon name="Clock" size={16} className="text-prosperity" />
              </div>
              <div className="text-2xl font-bold text-text-primary">45</div>
              <div className="text-xs text-text-secondary mt-1">
                {language === 'hi' ? 'दिन बचे हैं' : 'days remaining'}
              </div>
            </div>
          </div>

          {/* Capital Gains Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-text-primary mb-4">
                {language === 'hi' ? 'कैपिटल गेन्स ब्रेकडाउन' : 'Capital Gains Breakdown'}
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={capitalGainsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="type" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="realized" fill="#1E40AF" name={language === 'hi' ? 'रियलाइज़्ड' : 'Realized'} />
                    <Bar dataKey="unrealized" fill="#F97316" name={language === 'hi' ? 'अनरियलाइज़्ड' : 'Unrealized'} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-4">
                {language === 'hi' ? 'टैक्स सेविंग अवसर' : 'Tax Saving Opportunities'}
              </h4>
              <div className="space-y-3">
                {taxSavingOpportunities?.map((opportunity, index) => (
                  <div key={index} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-text-primary">{opportunity?.opportunity}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(opportunity?.priority)}`}>
                        {language === 'hi' 
                          ? (opportunity?.priority === 'high' ? 'उच्च' : 'मध्यम')
                          : opportunity?.priority
                        }
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mb-2">{opportunity?.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">
                        {language === 'hi' ? 'राशि' : 'Amount'}: ₹{opportunity?.amount?.toLocaleString('en-IN')}
                      </span>
                      <span className="text-success font-medium">
                        {language === 'hi' ? 'बचत' : 'Savings'}: ₹{opportunity?.savings?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Harvesting Tab */}
      {selectedTab === 'harvesting' && (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-text-primary mb-1">
                  {language === 'hi' ? 'लॉस हार्वेस्टिंग क्या है?' : 'What is Loss Harvesting?'}
                </h4>
                <p className="text-sm text-text-secondary">
                  {language === 'hi' ?'अनरियलाइज़्ड लॉसेस को बुक करके कैपिटल गेन्स को ऑफसेट करना और टैक्स बचाना।' :'Booking unrealized losses to offset capital gains and reduce tax liability.'
                  }
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-4">
              {language === 'hi' ? 'हार्वेस्टिंग के लिए उम्मीदवार' : 'Harvesting Candidates'}
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">
                      {language === 'hi' ? 'स्टॉक' : 'Stock'}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">
                      {language === 'hi' ? 'मात्रा' : 'Quantity'}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">
                      {language === 'hi' ? 'खरीद मूल्य' : 'Buy Price'}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">
                      {language === 'hi' ? 'वर्तमान मूल्य' : 'Current Price'}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">
                      {language === 'hi' ? 'अनरियलाइज़्ड लॉस' : 'Unrealized Loss'}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">
                      {language === 'hi' ? 'टैक्स बचत' : 'Tax Savings'}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">
                      {language === 'hi' ? 'कार्रवाई' : 'Action'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {harvestingCandidates?.map((candidate, index) => (
                    <tr key={index} className="border-b border-border hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-text-primary">{candidate?.stock}</td>
                      <td className="py-3 px-4 text-text-secondary">{candidate?.quantity}</td>
                      <td className="py-3 px-4 text-text-secondary">₹{candidate?.buyPrice}</td>
                      <td className="py-3 px-4 text-text-secondary">₹{candidate?.currentPrice}</td>
                      <td className="py-3 px-4 text-error font-medium">₹{candidate?.unrealizedLoss?.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-success font-medium">₹{candidate?.taxSaving?.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4">
                        <Button
                          variant={candidate?.recommendation === (language === 'hi' ? 'तुरंत बेचें' : 'Sell Immediately') ? "default" : "outline"}
                          size="sm"
                        >
                          {candidate?.recommendation}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="CheckCircle" size={20} className="text-success mt-0.5" />
              <div>
                <h4 className="font-medium text-text-primary mb-1">
                  {language === 'hi' ? 'कुल हार्वेस्टिंग पोटेंशियल' : 'Total Harvesting Potential'}
                </h4>
                <p className="text-sm text-text-secondary mb-2">
                  {language === 'hi' ?'ऊपर दिए गए स्टॉक्स को बेचकर आप ₹38,190 टैक्स बचा सकते हैं।' :'By selling the above stocks, you can save ₹38,190 in taxes.'
                  }
                </p>
                <Button variant="default" size="sm" iconName="Download" iconPosition="left">
                  {language === 'hi' ? 'हार्वेस्टिंग रिपोर्ट डाउनलोड करें' : 'Download Harvesting Report'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Planning Tab */}
      {selectedTab === 'planning' && (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-text-primary mb-4">
              {language === 'hi' ? 'मासिक टैक्स प्लानिंग' : 'Monthly Tax Planning'}
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taxPlanningData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="investment" fill="#1E40AF" name={language === 'hi' ? 'निवेश' : 'Investment'} />
                  <Bar dataKey="taxSaved" fill="#059669" name={language === 'hi' ? 'टैक्स बचत' : 'Tax Saved'} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-text-primary mb-3">
                {language === 'hi' ? 'अगले महीने की योजना' : 'Next Month Plan'}
              </h5>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">ELSS SIP</span>
                  <span className="font-medium text-text-primary">₹12,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">NPS</span>
                  <span className="font-medium text-text-primary">₹4,167</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">PPF</span>
                  <span className="font-medium text-text-primary">₹12,500</span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-text-primary">
                      {language === 'hi' ? 'कुल बचत' : 'Total Savings'}
                    </span>
                    <span className="text-success">₹9,042</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-text-primary mb-3">
                {language === 'hi' ? 'वार्षिक लक्ष्य प्रगति' : 'Annual Goal Progress'}
              </h5>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-text-secondary">80C (₹1.5L)</span>
                    <span className="text-sm font-medium">73%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '73%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-text-secondary">80CCD(1B) (₹50K)</span>
                    <span className="text-sm font-medium">40%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-prosperity h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-text-secondary">80D (₹25K)</span>
                    <span className="text-sm font-medium">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxOptimization;