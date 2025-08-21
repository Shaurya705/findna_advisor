import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';

import Select from '../../../components/ui/Select';

const InvestmentAllocation = ({ riskProfile, goalData }) => {
  const [selectedView, setSelectedView] = useState('allocation');
  const [selectedInstrument, setSelectedInstrument] = useState('all');

  const viewOptions = [
    { value: 'allocation', label: 'Asset Allocation' },
    { value: 'instruments', label: 'Investment Instruments' },
    { value: 'timeline', label: 'Investment Timeline' }
  ];

  const instrumentOptions = [
    { value: 'all', label: 'All Instruments' },
    { value: 'traditional', label: 'Traditional (EPF/PPF/FD)' },
    { value: 'mutual_funds', label: 'Mutual Funds' },
    { value: 'equity', label: 'Direct Equity' }
  ];

  // Asset allocation based on risk profile
  const getAllocationData = () => {
    const allocations = {
      conservative: [
        { name: 'Fixed Deposits', value: 35, color: '#059669', description: 'Bank FDs, Corporate FDs' },
        { name: 'PPF/EPF', value: 25, color: '#0891b2', description: 'Provident Fund schemes' },
        { name: 'Debt Funds', value: 20, color: '#7c3aed', description: 'Government & Corporate bonds' },
        { name: 'Large Cap Equity', value: 15, color: '#dc2626', description: 'Blue-chip stocks' },
        { name: 'Gold/REITs', value: 5, color: '#f59e0b', description: 'Alternative investments' }
      ],
      moderate: [
        { name: 'Equity Funds', value: 40, color: '#dc2626', description: 'Large & Mid cap funds' },
        { name: 'Debt Instruments', value: 30, color: '#059669', description: 'PPF, FDs, Debt funds' },
        { name: 'Hybrid Funds', value: 15, color: '#7c3aed', description: 'Balanced advantage funds' },
        { name: 'International Funds', value: 10, color: '#0891b2', description: 'Global diversification' },
        { name: 'Alternative Assets', value: 5, color: '#f59e0b', description: 'Gold, REITs, Commodities' }
      ],
      aggressive: [
        { name: 'Large Cap Equity', value: 35, color: '#dc2626', description: 'Blue-chip equity funds' },
        { name: 'Mid & Small Cap', value: 25, color: '#ea580c', description: 'Growth-oriented funds' },
        { name: 'International Equity', value: 15, color: '#0891b2', description: 'Global equity exposure' },
        { name: 'Sectoral/Thematic', value: 10, color: '#7c3aed', description: 'Sector-specific funds' },
        { name: 'Debt Component', value: 10, color: '#059669', description: 'Stability component' },
        { name: 'Alternative Assets', value: 5, color: '#f59e0b', description: 'REITs, Gold, Crypto' }
      ]
    };
    
    return allocations?.[riskProfile] || allocations?.moderate;
  };

  // Investment instruments with Indian context
  const getInstrumentData = () => {
    const instruments = [
      {
        category: 'Traditional Instruments',
        items: [
          { name: 'Employee Provident Fund (EPF)', returns: '8.1%', risk: 'Very Low', liquidity: 'Low', taxBenefit: 'Yes' },
          { name: 'Public Provident Fund (PPF)', returns: '7.1%', risk: 'Very Low', liquidity: 'Low', taxBenefit: 'Yes' },
          { name: 'National Savings Certificate', returns: '6.8%', risk: 'Very Low', liquidity: 'Low', taxBenefit: 'Yes' },
          { name: 'Fixed Deposits', returns: '5.5-7%', risk: 'Very Low', liquidity: 'Medium', taxBenefit: 'No' }
        ]
      },
      {
        category: 'Mutual Funds',
        items: [
          { name: 'Large Cap Equity Funds', returns: '10-12%', risk: 'Medium', liquidity: 'High', taxBenefit: 'ELSS' },
          { name: 'Mid Cap Equity Funds', returns: '12-15%', risk: 'High', liquidity: 'High', taxBenefit: 'ELSS' },
          { name: 'Debt Funds', returns: '6-8%', risk: 'Low', liquidity: 'High', taxBenefit: 'No' },
          { name: 'Hybrid Funds', returns: '8-10%', risk: 'Medium', liquidity: 'High', taxBenefit: 'ELSS' }
        ]
      },
      {
        category: 'Market Instruments',
        items: [
          { name: 'Direct Equity', returns: '12-18%', risk: 'Very High', liquidity: 'High', taxBenefit: 'LTCG' },
          { name: 'Corporate Bonds', returns: '7-9%', risk: 'Medium', liquidity: 'Medium', taxBenefit: 'No' },
          { name: 'REITs', returns: '8-12%', risk: 'Medium', liquidity: 'Medium', taxBenefit: 'No' },
          { name: 'Gold ETFs', returns: '8-10%', risk: 'Medium', liquidity: 'High', taxBenefit: 'LTCG' }
        ]
      }
    ];

    if (selectedInstrument === 'all') return instruments;
    if (selectedInstrument === 'traditional') return [instruments?.[0]];
    if (selectedInstrument === 'mutual_funds') return [instruments?.[1]];
    if (selectedInstrument === 'equity') return [instruments?.[2]];
    return instruments;
  };

  // Timeline-based allocation strategy
  const getTimelineData = () => {
    const currentAge = parseInt(goalData?.currentAge || 30);
    const retirementAge = parseInt(goalData?.retirementAge || 60);
    const yearsToRetirement = retirementAge - currentAge;
    
    const timeline = [];
    const phases = [
      { phase: 'Accumulation (Now)', equity: 70, debt: 25, alternatives: 5 },
      { phase: 'Mid-Career (+10 years)', equity: 60, debt: 35, alternatives: 5 },
      { phase: 'Pre-Retirement (+20 years)', equity: 40, debt: 55, alternatives: 5 },
      { phase: 'Retirement', equity: 20, debt: 75, alternatives: 5 }
    ];
    
    return phases?.map((phase, index) => ({
      ...phase,
      age: currentAge + (index * Math.floor(yearsToRetirement / 3))
    }));
  };

  const allocationData = getAllocationData();
  const instrumentData = getInstrumentData();
  const timelineData = getTimelineData();

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100)?.toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-xl shadow-lg border border-border p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Investment Allocation Strategy
            </h3>
            <p className="text-sm text-text-secondary">
              Optimized portfolio allocation for {riskProfile} risk profile
            </p>
          </div>
          
          <div className="flex gap-3">
            <Select
              options={viewOptions}
              value={selectedView}
              onChange={setSelectedView}
              placeholder="Select view"
              className="w-48"
            />
            
            {selectedView === 'instruments' && (
              <Select
                options={instrumentOptions}
                value={selectedInstrument}
                onChange={setSelectedInstrument}
                placeholder="Filter instruments"
                className="w-48"
              />
            )}
          </div>
        </div>
      </div>
      {/* Asset Allocation View */}
      {selectedView === 'allocation' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-border p-6">
            <h4 className="text-lg font-semibold text-text-primary mb-4">
              Recommended Asset Allocation
            </h4>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {allocationData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Allocation']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-border p-6">
            <h4 className="text-lg font-semibold text-text-primary mb-4">
              Allocation Breakdown
            </h4>
            
            <div className="space-y-4">
              {allocationData?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item?.color }}
                    />
                    <div>
                      <p className="font-medium text-text-primary">{item?.name}</p>
                      <p className="text-xs text-text-secondary">{item?.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-text-primary">{item?.value}%</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Info" size={16} className="text-primary" />
                <span className="text-sm font-medium text-primary">Strategy Note</span>
              </div>
              <p className="text-xs text-text-secondary">
                {riskProfile === 'conservative' && 'This allocation prioritizes capital preservation with steady returns, suitable for risk-averse investors nearing retirement.'}
                {riskProfile === 'moderate' && 'Balanced allocation providing growth potential while managing downside risk through diversification.'}
                {riskProfile === 'aggressive' && 'Growth-focused allocation maximizing long-term wealth creation through equity exposure.'}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Investment Instruments View */}
      {selectedView === 'instruments' && (
        <div className="space-y-6">
          {instrumentData?.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl shadow-lg border border-border p-6">
              <h4 className="text-lg font-semibold text-text-primary mb-4">
                {category?.category}
              </h4>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-text-primary">Instrument</th>
                      <th className="text-left py-3 px-4 font-semibold text-text-primary">Expected Returns</th>
                      <th className="text-left py-3 px-4 font-semibold text-text-primary">Risk Level</th>
                      <th className="text-left py-3 px-4 font-semibold text-text-primary">Liquidity</th>
                      <th className="text-left py-3 px-4 font-semibold text-text-primary">Tax Benefit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category?.items?.map((instrument, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium text-text-primary">{instrument?.name}</td>
                        <td className="py-3 px-4 text-prosperity font-semibold">{instrument?.returns}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            instrument?.risk === 'Very Low' ? 'bg-success/10 text-success' :
                            instrument?.risk === 'Low' ? 'bg-prosperity/10 text-prosperity' :
                            instrument?.risk === 'Medium' ? 'bg-warning/10 text-warning' :
                            instrument?.risk === 'High'? 'bg-error/10 text-error' : 'bg-destructive/10 text-destructive'
                          }`}>
                            {instrument?.risk}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-text-secondary">{instrument?.liquidity}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            instrument?.taxBenefit === 'Yes' || instrument?.taxBenefit === 'ELSS' || instrument?.taxBenefit === 'LTCG' ?'bg-success/10 text-success' :'bg-muted text-text-secondary'
                          }`}>
                            {instrument?.taxBenefit}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Timeline View */}
      {selectedView === 'timeline' && (
        <div className="bg-white rounded-xl shadow-lg border border-border p-6">
          <h4 className="text-lg font-semibold text-text-primary mb-4">
            Life-Stage Investment Timeline
          </h4>
          
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="phase" 
                  stroke="#6b7280"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name]}
                />
                <Legend />
                <Bar dataKey="equity" stackId="a" fill="#dc2626" name="Equity" />
                <Bar dataKey="debt" stackId="a" fill="#059669" name="Debt" />
                <Bar dataKey="alternatives" stackId="a" fill="#f59e0b" name="Alternatives" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {timelineData?.map((phase, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <h5 className="font-semibold text-text-primary mb-2">{phase?.phase}</h5>
                <p className="text-sm text-text-secondary mb-3">Age: {phase?.age}</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Equity:</span>
                    <span className="font-semibold text-error">{phase?.equity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Debt:</span>
                    <span className="font-semibold text-success">{phase?.debt}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Others:</span>
                    <span className="font-semibold text-prosperity">{phase?.alternatives}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentAllocation;