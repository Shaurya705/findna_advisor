import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { computeRetirementProjections, formatCurrencyINR } from '../utils/calculations';

const ScenarioModeling = ({ goalData }) => {
  const [selectedScenario, setSelectedScenario] = useState('moderate');
  const [viewType, setViewType] = useState('growth');

  const scenarios = [
    { value: 'conservative', label: 'Conservative (6% returns)' },
    { value: 'moderate', label: 'Moderate (10% returns)' },
    { value: 'aggressive', label: 'Aggressive (14% returns)' }
  ];

  const viewTypes = [
    { value: 'growth', label: 'Corpus Growth' },
    { value: 'monthly', label: 'Monthly Investment' },
    { value: 'comparison', label: 'Scenario Comparison' }
  ];

  const conservativeData = useMemo(() => computeRetirementProjections(goalData, 'conservative'), [goalData]);
  const moderateData = useMemo(() => computeRetirementProjections(goalData, 'moderate'), [goalData]);
  const aggressiveData = useMemo(() => computeRetirementProjections(goalData, 'aggressive'), [goalData]);

  const currentData = selectedScenario === 'conservative' ? conservativeData : 
                     selectedScenario === 'moderate' ? moderateData : aggressiveData;

  const comparisonData = conservativeData?.data?.map((item, index) => ({
    age: item?.age,
    Conservative: item?.corpusLakhs,
    Moderate: moderateData?.data?.[index]?.corpusLakhs || 0,
    Aggressive: aggressiveData?.data?.[index]?.corpusLakhs || 0
  }));

  const formatCurrency = formatCurrencyINR;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-white p-3 border border-border rounded-lg shadow-lg">
          <p className="font-semibold">{`Age: ${label}`}</p>
          {payload?.map((entry, index) => (
            <p key={index} style={{ color: entry?.color }}>
              {`${entry?.dataKey}: ${formatCurrency(entry?.value * 100000)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg border border-border p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Retirement Scenario Modeling
            </h3>
            <p className="text-sm text-text-secondary">
              Compare different investment strategies and their outcomes
            </p>
          </div>
          
          <div className="flex gap-3">
            <Select
              options={scenarios}
              value={selectedScenario}
              onChange={setSelectedScenario}
              placeholder="Select scenario"
              className="w-48"
            />
            
            <Select
              options={viewTypes}
              value={viewType}
              onChange={setViewType}
              placeholder="Select view"
              className="w-48"
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Target" size={20} className="text-primary" />
              <span className="text-sm font-medium text-text-secondary">Monthly Investment</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(currentData?.monthlyInvestment)}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-prosperity/10 to-prosperity/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="TrendingUp" size={20} className="text-prosperity" />
              <span className="text-sm font-medium text-text-secondary">Final Corpus</span>
            </div>
            <p className="text-2xl font-bold text-prosperity">
              {formatCurrency(currentData?.finalCorpusRupees)}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-growth/10 to-growth/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Calendar" size={20} className="text-growth" />
              <span className="text-sm font-medium text-text-secondary">Years to Retire</span>
            </div>
            <p className="text-2xl font-bold text-growth">
              {(goalData?.retirementAge || 60) - (goalData?.currentAge || 30)} years
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-success/10 to-success/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Shield" size={20} className="text-success" />
              <span className="text-sm font-medium text-text-secondary">Safety Score</span>
            </div>
            <p className="text-2xl font-bold text-success">
              {selectedScenario === 'conservative' ? '95%' : 
               selectedScenario === 'moderate' ? '80%' : '65%'}
            </p>
          </div>
        </div>
      </div>
      {/* Charts */}
      <div className="bg-white rounded-xl shadow-lg border border-border p-6">
        <div className="h-80">
          {viewType === 'growth' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData?.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="age" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `₹${value}L`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="corpusLakhs" 
                  stroke="#1e40af" 
                  strokeWidth={3}
                  dot={{ fill: '#1e40af', strokeWidth: 2, r: 4 }}
                  name="Retirement Corpus (₹ Lakhs)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          {viewType === 'monthly' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData?.data?.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="age" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `₹${value/1000}K`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Monthly Investment']}
                  labelFormatter={(label) => `Age: ${label}`}
                />
                <Legend />
                <Bar 
                  dataKey="monthlyInvestment" 
                  fill="#f97316" 
                  name="Monthly Investment Required"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}

          {viewType === 'comparison' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="age" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `₹${value}L`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Conservative" 
                  stroke="#059669" 
                  strokeWidth={2}
                  dot={{ fill: '#059669', strokeWidth: 2, r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Moderate" 
                  stroke="#1e40af" 
                  strokeWidth={2}
                  dot={{ fill: '#1e40af', strokeWidth: 2, r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Aggressive" 
                  stroke="#dc2626" 
                  strokeWidth={2}
                  dot={{ fill: '#dc2626', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      {/* Scenario Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {['conservative', 'moderate', 'aggressive']?.map((scenario) => {
          const data = scenario === 'conservative' ? conservativeData : 
                      scenario === 'moderate' ? moderateData : aggressiveData;
          
          return (
            <div key={scenario} className={`bg-white rounded-xl shadow-lg border border-border p-6 ${
              selectedScenario === scenario ? 'ring-2 ring-primary' : ''
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-text-primary capitalize">
                  {scenario} Strategy
                </h4>
                <Button
                  variant={selectedScenario === scenario ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedScenario(scenario)}
                >
                  {selectedScenario === scenario ? 'Selected' : 'Select'}
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Monthly SIP:</span>
                  <span className="font-semibold">{formatCurrency(data?.monthlyInvestment)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Final Corpus:</span>
                  <span className="font-semibold">{formatCurrency(data?.corpus)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Risk Level:</span>
                  <span className={`font-semibold ${
                    scenario === 'conservative' ? 'text-success' :
                    scenario === 'moderate' ? 'text-prosperity' : 'text-error'
                  }`}>
                    {scenario === 'conservative' ? 'Low' :
                     scenario === 'moderate' ? 'Medium' : 'High'}
                  </span>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-text-muted">
                    {scenario === 'conservative' && 'Focus on capital preservation with steady returns from FDs, PPF, and debt funds.'}
                    {scenario === 'moderate' && 'Balanced mix of equity and debt for optimal risk-return balance.'}
                    {scenario === 'aggressive' && 'Equity-heavy portfolio for maximum growth potential over long term.'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScenarioModeling;