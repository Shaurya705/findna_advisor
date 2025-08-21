import React, { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MarketInsights = ({ marketData, language }) => {
  const [selectedIndex, setSelectedIndex] = useState('sensex');
  const [timeframe, setTimeframe] = useState('1M');

  const indices = [
    { key: 'sensex', name: 'Sensex', value: 65432.10, change: 1.24, color: '#1E40AF' },
    { key: 'nifty', name: 'Nifty 50', value: 19567.85, change: 1.18, color: '#F97316' },
    { key: 'banknifty', name: 'Bank Nifty', value: 45123.60, change: -0.85, color: '#059669' },
    { key: 'niftynext50', name: 'Nifty Next 50', value: 42890.30, change: 2.15, color: '#D97706' }
  ];

  const timeframes = [
    { key: '1D', label: language === 'hi' ? '1 दिन' : '1 Day' },
    { key: '1W', label: language === 'hi' ? '1 सप्ताह' : '1 Week' },
    { key: '1M', label: language === 'hi' ? '1 महीना' : '1 Month' },
    { key: '3M', label: language === 'hi' ? '3 महीने' : '3 Months' },
    { key: '6M', label: language === 'hi' ? '6 महीने' : '6 Months' },
    { key: '1Y', label: language === 'hi' ? '1 साल' : '1 Year' }
  ];

  const marketChartData = [
    { date: '01 Aug', sensex: 64200, nifty: 19200, banknifty: 44800, niftynext50: 41900 },
    { date: '05 Aug', sensex: 64800, nifty: 19350, banknifty: 45200, niftynext50: 42100 },
    { date: '10 Aug', sensex: 65100, nifty: 19450, banknifty: 45000, niftynext50: 42300 },
    { date: '15 Aug', sensex: 64900, nifty: 19380, banknifty: 44900, niftynext50: 42200 },
    { date: '20 Aug', sensex: 65432, nifty: 19568, banknifty: 45124, niftynext50: 42890 }
  ];

  const sectorPerformance = [
    { sector: language === 'hi' ? 'IT' : 'IT', change: 2.45, trend: 'up' },
    { sector: language === 'hi' ? 'फार्मा' : 'Pharma', change: 1.87, trend: 'up' },
    { sector: language === 'hi' ? 'FMCG' : 'FMCG', change: 0.92, trend: 'up' },
    { sector: language === 'hi' ? 'बैंकिंग' : 'Banking', change: -0.65, trend: 'down' },
    { sector: language === 'hi' ? 'ऑटो' : 'Auto', change: -1.23, trend: 'down' },
    { sector: language === 'hi' ? 'मेटल' : 'Metal', change: -2.15, trend: 'down' }
  ];

  const marketNews = [
    {
      title: language === 'hi' ?'RBI ने रेपो रेट 6.5% पर बरकरार रखा' :'RBI keeps repo rate unchanged at 6.5%',
      time: '2 hours ago',
      impact: 'positive',
      description: language === 'hi' ?'केंद्रीय बैंक ने मुद्रास्फीति चिंताओं के बावजूद दरों को स्थिर रखा' :'Central bank maintains rates despite inflation concerns'
    },
    {
      title: language === 'hi' ?'FII ने अगस्त में ₹15,000 करोड़ का निवेश किया' :'FIIs invest ₹15,000 crores in August',
      time: '4 hours ago',
      impact: 'positive',
      description: language === 'hi' ?'विदेशी संस्थागत निवेशकों का भारतीय बाजारों में भरोसा' :'Foreign institutional investors show confidence in Indian markets'
    },
    {
      title: language === 'hi' ?'कच्चे तेल की कीमतों में गिरावट' :'Crude oil prices decline',
      time: '6 hours ago',
      impact: 'mixed',
      description: language === 'hi' ?'वैश्विक मांग की चिंताओं के कारण कीमतों में कमी' :'Prices drop due to global demand concerns'
    }
  ];

  const geopoliticalEvents = [
    {
      event: language === 'hi' ? 'US-चीन व्यापार वार्ता' : 'US-China Trade Talks',
      impact: language === 'hi' ? 'मध्यम सकारात्मक' : 'Moderately Positive',
      portfolioEffect: '+0.8%',
      description: language === 'hi' ?'व्यापार संबंधों में सुधार से निर्यात कंपनियों को फायदा' :'Improved trade relations benefit export companies'
    },
    {
      event: language === 'hi' ? 'यूरोप में ऊर्जा संकट' : 'Europe Energy Crisis',
      impact: language === 'hi' ? 'नकारात्मक' : 'Negative',
      portfolioEffect: '-0.5%',
      description: language === 'hi' ?'वैश्विक ऊर्जा कीमतों में वृद्धि का प्रभाव' :'Impact of rising global energy prices'
    }
  ];

  const selectedIndexData = indices?.find(index => index?.key === selectedIndex);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-border">
          <p className="font-medium text-text-primary mb-1">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value?.toLocaleString('en-IN')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {language === 'hi' ? 'बाजार अवलोकन' : 'Market Overview'}
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              {language === 'hi' ? 'प्रमुख सूचकांकों का प्रदर्शन' : 'Performance of major indices'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={20} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              {language === 'hi' ? 'लाइव' : 'Live'}
            </span>
          </div>
        </div>

        {/* Index Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {indices?.map((index) => (
            <div
              key={index?.key}
              onClick={() => setSelectedIndex(index?.key)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedIndex === index?.key
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-primary/2'
              }`}
            >
              <div className="text-sm font-medium text-text-secondary mb-1">{index?.name}</div>
              <div className="text-lg font-bold text-text-primary mb-1">
                {index?.value?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className={`flex items-center text-sm ${
                index?.change >= 0 ? 'text-success' : 'text-error'
              }`}>
                <Icon 
                  name={index?.change >= 0 ? 'ArrowUp' : 'ArrowDown'} 
                  size={14} 
                  className="mr-1" 
                />
                {Math.abs(index?.change)}%
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-text-primary">
              {selectedIndexData?.name} {language === 'hi' ? 'चार्ट' : 'Chart'}
            </h4>
            <div className="flex items-center space-x-1">
              {timeframes?.map((tf) => (
                <button
                  key={tf?.key}
                  onClick={() => setTimeframe(tf?.key)}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                    timeframe === tf?.key
                      ? 'bg-primary text-white' :'text-text-secondary hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {tf?.label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey={selectedIndex}
                  stroke={selectedIndexData?.color}
                  fill={selectedIndexData?.color}
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Sector Performance & Market News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Performance */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-text-primary">
              {language === 'hi' ? 'सेक्टर प्रदर्शन' : 'Sector Performance'}
            </h4>
            <Icon name="TrendingUp" size={18} className="text-primary" />
          </div>
          <div className="space-y-3">
            {sectorPerformance?.map((sector, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="font-medium text-text-primary">{sector?.sector}</span>
                <div className={`flex items-center ${
                  sector?.change >= 0 ? 'text-success' : 'text-error'
                }`}>
                  <Icon 
                    name={sector?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                    size={16} 
                    className="mr-1" 
                  />
                  <span className="font-medium">{Math.abs(sector?.change)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market News */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-text-primary">
              {language === 'hi' ? 'बाजार समाचार' : 'Market News'}
            </h4>
            <Icon name="Newspaper" size={18} className="text-primary" />
          </div>
          <div className="space-y-4">
            {marketNews?.map((news, index) => (
              <div key={index} className="border-l-4 border-primary/20 pl-4">
                <div className="flex items-start justify-between mb-1">
                  <h5 className="font-medium text-text-primary text-sm leading-tight">{news?.title}</h5>
                  <span className={`w-2 h-2 rounded-full mt-2 ${
                    news?.impact === 'positive' ? 'bg-success' : 
                    news?.impact === 'negative' ? 'bg-error' : 'bg-prosperity'
                  }`}></span>
                </div>
                <p className="text-xs text-text-secondary mb-1">{news?.description}</p>
                <span className="text-xs text-text-muted">{news?.time}</span>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            className="mt-4"
            iconName="ExternalLink"
            iconPosition="right"
          >
            {language === 'hi' ? 'सभी समाचार देखें' : 'View All News'}
          </Button>
        </div>
      </div>
      {/* Geopolitical Impact */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="font-semibold text-text-primary">
              {language === 'hi' ? 'भू-राजनीतिक प्रभाव' : 'Geopolitical Impact'}
            </h4>
            <p className="text-sm text-text-secondary mt-1">
              {language === 'hi' ? 'आपके पोर्टफोलियो पर वैश्विक घटनाओं का प्रभाव' : 'Impact of global events on your portfolio'}
            </p>
          </div>
          <Icon name="Globe" size={20} className="text-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {geopoliticalEvents?.map((event, index) => (
            <div key={index} className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-text-primary">{event?.event}</h5>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  event?.portfolioEffect?.startsWith('+') 
                    ? 'bg-success/10 text-success' :'bg-error/10 text-error'
                }`}>
                  {event?.portfolioEffect}
                </span>
              </div>
              <p className="text-sm text-text-secondary mb-2">{event?.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">
                  {language === 'hi' ? 'प्रभाव' : 'Impact'}: {event?.impact}
                </span>
                <Button variant="ghost" size="sm" iconName="ArrowRight" iconSize={14}>
                  {language === 'hi' ? 'विवरण' : 'Details'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
            <Icon name="Info" size={20} className="text-primary mt-0.5" />
            <div>
              <h5 className="font-medium text-text-primary mb-1">
                {language === 'hi' ? 'AI पूर्वानुमान' : 'AI Forecast'}
              </h5>
              <p className="text-sm text-text-secondary">
                {language === 'hi' ?'वर्तमान भू-राजनीतिक स्थिति के आधार पर, अगले 3 महीनों में आपके पोर्टफोलियो में 2-4% की वृद्धि की संभावना है।' :'Based on current geopolitical situation, your portfolio is likely to see 2-4% growth in the next 3 months.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketInsights;