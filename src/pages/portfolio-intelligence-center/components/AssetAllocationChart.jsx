import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';

const AssetAllocationChart = ({ allocationData, language }) => {
  const [viewType, setViewType] = useState('category');

  const categoryData = [
    { 
      name: language === 'hi' ? 'इक्विटी' : 'Equity', 
      value: 45, 
      amount: 4500000,
      color: '#1E40AF',
      description: language === 'hi' ? 'शेयर और इक्विटी फंड' : 'Stocks and Equity Funds'
    },
    { 
      name: language === 'hi' ? 'डेट' : 'Debt', 
      value: 25, 
      amount: 2500000,
      color: '#F97316',
      description: language === 'hi' ? 'बॉन्ड और डेट फंड' : 'Bonds and Debt Funds'
    },
    { 
      name: language === 'hi' ? 'ELSS' : 'ELSS', 
      value: 15, 
      amount: 1500000,
      color: '#059669',
      description: language === 'hi' ? 'टैक्स सेविंग फंड' : 'Tax Saving Funds'
    },
    { 
      name: language === 'hi' ? 'PPF/EPF' : 'PPF/EPF', 
      value: 10, 
      amount: 1000000,
      color: '#D97706',
      description: language === 'hi' ? 'सरकारी बचत योजना' : 'Government Savings Schemes'
    },
    { 
      name: language === 'hi' ? 'गोल्ड' : 'Gold', 
      value: 5, 
      amount: 500000,
      color: '#F59E0B',
      description: language === 'hi' ? 'सोना और गोल्ड ETF' : 'Gold and Gold ETFs'
    }
  ];

  const sectorData = [
    { 
      name: language === 'hi' ? 'IT' : 'IT', 
      value: 20, 
      amount: 2000000,
      color: '#1E40AF',
      description: language === 'hi' ? 'सूचना प्रौद्योगिकी' : 'Information Technology'
    },
    { 
      name: language === 'hi' ? 'बैंकिंग' : 'Banking', 
      value: 18, 
      amount: 1800000,
      color: '#F97316',
      description: language === 'hi' ? 'बैंक और वित्तीय सेवाएं' : 'Banks and Financial Services'
    },
    { 
      name: language === 'hi' ? 'फार्मा' : 'Pharma', 
      value: 12, 
      amount: 1200000,
      color: '#059669',
      description: language === 'hi' ? 'दवा और स्वास्थ्य सेवा' : 'Pharmaceuticals and Healthcare'
    },
    { 
      name: language === 'hi' ? 'FMCG' : 'FMCG', 
      value: 10, 
      amount: 1000000,
      color: '#D97706',
      description: language === 'hi' ? 'उपभोक्ता वस्तुएं' : 'Fast Moving Consumer Goods'
    },
    { 
      name: language === 'hi' ? 'अन्य' : 'Others', 
      value: 40, 
      amount: 4000000,
      color: '#6B7280',
      description: language === 'hi' ? 'अन्य सेक्टर और डेट' : 'Other Sectors and Debt'
    }
  ];

  const currentData = viewType === 'category' ? categoryData : sectorData;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-border">
          <p className="font-medium text-text-primary">{data?.name}</p>
          <p className="text-sm text-text-secondary">{data?.description}</p>
          <p className="text-sm font-medium text-primary">
            ₹{data?.amount?.toLocaleString('en-IN')} ({data?.value}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload?.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry?.color }}
            />
            <span className="text-sm text-text-secondary">{entry?.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {language === 'hi' ? 'एसेट एलोकेशन' : 'Asset Allocation'}
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            {language === 'hi' ? 'आपके निवेश का वितरण' : 'Distribution of your investments'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewType('category')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              viewType === 'category' ?'bg-primary text-white' :'text-text-secondary hover:text-primary hover:bg-primary/5'
            }`}
          >
            {language === 'hi' ? 'श्रेणी' : 'Category'}
          </button>
          <button
            onClick={() => setViewType('sector')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              viewType === 'sector' ?'bg-primary text-white' :'text-text-secondary hover:text-primary hover:bg-primary/5'
            }`}
          >
            {language === 'hi' ? 'सेक्टर' : 'Sector'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={currentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {currentData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Allocation Details */}
        <div className="space-y-4">
          {currentData?.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: item?.color }}
                />
                <div>
                  <div className="font-medium text-text-primary">{item?.name}</div>
                  <div className="text-xs text-text-secondary">{item?.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-text-primary">{item?.value}%</div>
                <div className="text-sm text-text-secondary">
                  ₹{item?.amount?.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Allocation Insights */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
          <Icon name="Lightbulb" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-text-primary mb-1">
              {language === 'hi' ? 'AI सुझाव' : 'AI Recommendation'}
            </h4>
            <p className="text-sm text-text-secondary">
              {language === 'hi' ?'आपका IT सेक्टर एक्सपोज़र 20% है जो अधिक है। फार्मा सेक्टर में 5% बढ़ाने और IT में 5% कम करने पर विचार करें।' :'Your IT sector exposure is 20% which is high. Consider increasing pharma allocation by 5% and reducing IT by 5% for better diversification.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocationChart;