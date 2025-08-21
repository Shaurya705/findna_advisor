import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceAnalytics = ({ performanceData, language }) => {
  const [selectedMetric, setSelectedMetric] = useState('returns');
  const [comparisonView, setComparisonView] = useState(false);

  const performanceChartData = [
    { month: language === 'hi' ? 'जन' : 'Jan', portfolio: 8.5, sensex: 7.2, nifty: 7.8, fd: 6.5 },
    { month: language === 'hi' ? 'फर' : 'Feb', portfolio: 12.3, sensex: 9.1, nifty: 9.5, fd: 6.5 },
    { month: language === 'hi' ? 'मार' : 'Mar', portfolio: 15.7, sensex: 11.4, nifty: 12.1, fd: 6.5 },
    { month: language === 'hi' ? 'अप्र' : 'Apr', portfolio: 18.2, sensex: 13.8, nifty: 14.2, fd: 6.5 },
    { month: language === 'hi' ? 'मई' : 'May', portfolio: 22.1, sensex: 16.5, nifty: 17.3, fd: 6.5 },
    { month: language === 'hi' ? 'जून' : 'Jun', portfolio: 19.8, sensex: 14.2, nifty: 15.1, fd: 6.5 },
    { month: language === 'hi' ? 'जुल' : 'Jul', portfolio: 24.5, sensex: 18.7, nifty: 19.4, fd: 6.5 },
    { month: language === 'hi' ? 'अग' : 'Aug', portfolio: 26.3, sensex: 20.1, nifty: 21.2, fd: 6.5 }
  ];

  const riskMetrics = [
    {
      title: language === 'hi' ? 'शार्प रेशियो' : 'Sharpe Ratio',
      value: '1.42',
      benchmark: '1.18',
      status: 'good',
      description: language === 'hi' ? 'जोखिम-समायोजित रिटर्न' : 'Risk-adjusted returns'
    },
    {
      title: language === 'hi' ? 'वोलैटिलिटी' : 'Volatility',
      value: '14.2%',
      benchmark: '16.8%',
      status: 'good',
      description: language === 'hi' ? 'पोर्टफोलियो की अस्थिरता' : 'Portfolio volatility'
    },
    {
      title: language === 'hi' ? 'मैक्स ड्रॉडाउन' : 'Max Drawdown',
      value: '-8.5%',
      benchmark: '-12.3%',
      status: 'good',
      description: language === 'hi' ? 'अधिकतम गिरावट' : 'Maximum decline'
    },
    {
      title: language === 'hi' ? 'बीटा' : 'Beta',
      value: '0.85',
      benchmark: '1.00',
      status: 'neutral',
      description: language === 'hi' ? 'मार्केट के साथ संबंध' : 'Market correlation'
    }
  ];

  const sectorPerformance = [
    { sector: language === 'hi' ? 'IT' : 'IT', returns: 28.5, allocation: 20 },
    { sector: language === 'hi' ? 'बैंकिंग' : 'Banking', returns: 15.2, allocation: 18 },
    { sector: language === 'hi' ? 'फार्मा' : 'Pharma', returns: 32.1, allocation: 12 },
    { sector: language === 'hi' ? 'FMCG' : 'FMCG', returns: 18.7, allocation: 10 },
    { sector: language === 'hi' ? 'ऑटो' : 'Auto', returns: 22.3, allocation: 8 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-border">
          <p className="font-medium text-text-primary mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Performance Chart */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {language === 'hi' ? 'प्रदर्शन विश्लेषण' : 'Performance Analysis'}
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              {language === 'hi' ? 'बेंचमार्क के साथ तुलना' : 'Comparison with benchmarks'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={comparisonView ? "default" : "outline"}
              size="sm"
              onClick={() => setComparisonView(!comparisonView)}
            >
              {language === 'hi' ? 'तुलना दृश्य' : 'Comparison View'}
            </Button>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="portfolio" 
                stroke="#1E40AF" 
                strokeWidth={3}
                name={language === 'hi' ? 'आपका पोर्टफोलियो' : 'Your Portfolio'}
              />
              {comparisonView && (
                <>
                  <Line 
                    type="monotone" 
                    dataKey="sensex" 
                    stroke="#F97316" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Sensex"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="nifty" 
                    stroke="#059669" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Nifty"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fd" 
                    stroke="#6B7280" 
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    name={language === 'hi' ? 'FD' : 'Fixed Deposit'}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">+26.3%</div>
            <div className="text-sm text-text-secondary">
              {language === 'hi' ? 'कुल रिटर्न' : 'Total Returns'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">+6.2%</div>
            <div className="text-sm text-text-secondary">
              {language === 'hi' ? 'अल्फा' : 'Alpha Generated'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-prosperity">₹2.63L</div>
            <div className="text-sm text-text-secondary">
              {language === 'hi' ? 'कुल लाभ' : 'Total Gains'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-growth">32.1%</div>
            <div className="text-sm text-text-secondary">
              {language === 'hi' ? 'सर्वश्रेष्ठ सेक्टर' : 'Best Sector'}
            </div>
          </div>
        </div>
      </div>
      {/* Risk Metrics */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {language === 'hi' ? 'जोखिम मेट्रिक्स' : 'Risk Metrics'}
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              {language === 'hi' ? 'पोर्टफोलियो जोखिम विश्लेषण' : 'Portfolio risk analysis'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {riskMetrics?.map((metric, index) => (
            <div key={index} className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-secondary">{metric?.title}</span>
                <Icon 
                  name={metric?.status === 'good' ? 'TrendingUp' : metric?.status === 'bad' ? 'TrendingDown' : 'Minus'} 
                  size={16} 
                  className={`${
                    metric?.status === 'good' ? 'text-success' : 
                    metric?.status === 'bad' ? 'text-error' : 'text-text-secondary'
                  }`}
                />
              </div>
              <div className="text-xl font-bold text-text-primary mb-1">{metric?.value}</div>
              <div className="text-xs text-text-secondary">
                {language === 'hi' ? 'बेंचमार्क' : 'Benchmark'}: {metric?.benchmark}
              </div>
              <div className="text-xs text-text-muted mt-1">{metric?.description}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Sector Performance */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {language === 'hi' ? 'सेक्टर प्रदर्शन' : 'Sector Performance'}
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              {language === 'hi' ? 'सेक्टरवार रिटर्न विश्लेषण' : 'Sector-wise returns analysis'}
            </p>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="sector" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                formatter={(value, name) => [
                  `${value}%`, 
                  name === 'returns' ? (language === 'hi' ? 'रिटर्न' : 'Returns') : (language === 'hi' ? 'एलोकेशन' : 'Allocation')
                ]}
              />
              <Bar dataKey="returns" fill="#1E40AF" name="returns" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
            <Icon name="TrendingUp" size={20} className="text-success mt-0.5" />
            <div>
              <h4 className="font-medium text-text-primary mb-1">
                {language === 'hi' ? 'सर्वश्रेष्ठ प्रदर्शन' : 'Best Performer'}
              </h4>
              <p className="text-sm text-text-secondary">
                {language === 'hi' ?'फार्मा सेक्टर ने 32.1% रिटर्न दिया है। आपका 12% एलोकेशन अच्छा है, लेकिन 15% तक बढ़ाने पर विचार करें।' :'Pharma sector delivered 32.1% returns. Your 12% allocation is good, but consider increasing to 15% for better gains.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;