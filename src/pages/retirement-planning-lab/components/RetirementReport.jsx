import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const RetirementReport = ({ goalData, scenarioData }) => {
  const [reportType, setReportType] = useState('comprehensive');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { value: 'comprehensive', label: 'Comprehensive Report' },
    { value: 'summary', label: 'Executive Summary' },
    { value: 'family', label: 'Family Discussion Guide' },
    { value: 'advisor', label: 'Advisor Consultation' }
  ];

  const currentAge = parseInt(goalData?.currentAge || 30);
  const retirementAge = parseInt(goalData?.retirementAge || 60);
  const monthlyExpenses = parseInt(goalData?.monthlyExpenses || 50000);
  const yearsToRetirement = retirementAge - currentAge;

  // Mock calculations
  const calculations = {
    monthlyInvestment: 25000,
    totalInvestment: 25000 * 12 * yearsToRetirement,
    expectedCorpus: 25000 * 12 * yearsToRetirement * 2.5,
    inflationAdjustedExpenses: monthlyExpenses * Math.pow(1.06, yearsToRetirement),
    postRetirementIncome: 45000,
    corpusShortfall: 0,
    taxSavings: 78000
  };

  const assumptions = [
    { parameter: 'Average Annual Return', value: '10%', note: 'Based on historical equity fund performance' },
    { parameter: 'Inflation Rate', value: '6%', note: 'Long-term average inflation in India' },
    { parameter: 'Post-Retirement Life', value: '25 years', note: 'Based on current life expectancy' },
    { parameter: 'Healthcare Inflation', value: '8%', note: 'Medical cost inflation consideration' },
    { parameter: 'Tax Rate', value: '20%', note: 'Assumed tax bracket during retirement' }
  ];

  const recommendations = [
    {
      priority: 'High',
      category: 'Investment Strategy',
      title: 'Increase Equity Allocation',
      description: 'Consider increasing equity allocation to 60% for better long-term returns given your age and risk profile.',
      impact: 'Could increase final corpus by ₹15-20 lakhs',
      timeline: 'Implement within 3 months'
    },
    {
      priority: 'High',
      category: 'Tax Optimization',
      title: 'Maximize ELSS Investments',
      description: 'Utilize full ₹1.5L limit under Section 80C through ELSS funds for dual benefit of tax saving and equity exposure.',
      impact: 'Annual tax savings of ₹46,800',
      timeline: 'Start from next financial year'
    },
    {
      priority: 'Medium',
      category: 'Risk Management',
      title: 'Health Insurance Coverage',
      description: 'Increase health insurance coverage to ₹10L family floater to protect retirement corpus from medical emergencies.',
      impact: 'Protects ₹5-10L potential medical costs',
      timeline: 'Review and upgrade within 6 months'
    },
    {
      priority: 'Medium',
      category: 'Diversification',
      title: 'International Exposure',
      description: 'Add 10-15% international equity funds for better diversification and currency hedge.',
      impact: 'Reduced portfolio volatility',
      timeline: 'Gradual implementation over 1 year'
    }
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    
    // In real app, this would trigger download
    console.log('Report generated for type:', reportType);
  };

  const handleShareReport = () => {
    // Mock share functionality
    if (navigator.share) {
      navigator.share({
        title: 'My Retirement Plan Report',
        text: 'Check out my personalized retirement planning report from FinDNA Advisor',
        url: window.location?.href
      });
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard?.writeText(window.location?.href);
      alert('Report link copied to clipboard!');
    }
  };

  const formatCurrency = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000)?.toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000)?.toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000)?.toFixed(0)}K`;
    return `₹${value}`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-error bg-error/10 border-error/20';
      case 'Medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'Low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-text-secondary bg-muted border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="bg-white rounded-xl shadow-lg border border-border p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-text-primary mb-1">
              Retirement Planning Report
            </h3>
            <p className="text-sm text-text-secondary">
              Generated on {new Date()?.toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Select
              options={reportTypes}
              value={reportType}
              onChange={setReportType}
              placeholder="Select report type"
              className="w-48"
            />
            
            <Button
              variant="outline"
              size="sm"
              iconName="Share"
              iconPosition="left"
              onClick={handleShareReport}
            >
              Share
            </Button>
            
            <Button
              variant="default"
              size="sm"
              iconName="Download"
              iconPosition="left"
              loading={isGenerating}
              onClick={handleGenerateReport}
              className="bg-gradient-cultural"
            >
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
        </div>

        {/* Key Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Target" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Monthly SIP</span>
            </div>
            <p className="text-xl font-bold text-text-primary">
              {formatCurrency(calculations?.monthlyInvestment)}
            </p>
          </div>
          
          <div className="p-4 bg-prosperity/5 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="TrendingUp" size={16} className="text-prosperity" />
              <span className="text-sm font-medium text-prosperity">Expected Corpus</span>
            </div>
            <p className="text-xl font-bold text-text-primary">
              {formatCurrency(calculations?.expectedCorpus)}
            </p>
          </div>
          
          <div className="p-4 bg-success/5 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Shield" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">Goal Achievement</span>
            </div>
            <p className="text-xl font-bold text-text-primary">105%</p>
          </div>
          
          <div className="p-4 bg-growth/5 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Receipt" size={16} className="text-growth" />
              <span className="text-sm font-medium text-growth">Annual Tax Savings</span>
            </div>
            <p className="text-xl font-bold text-text-primary">
              {formatCurrency(calculations?.taxSavings)}
            </p>
          </div>
        </div>
      </div>
      {/* Financial Summary */}
      <div className="bg-white rounded-xl shadow-lg border border-border p-6">
        <h4 className="text-lg font-semibold text-text-primary mb-4">
          Financial Summary
        </h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-text-primary mb-3">Investment Details</h5>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-text-secondary">Monthly Investment Required:</span>
                <span className="font-semibold">{formatCurrency(calculations?.monthlyInvestment)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-text-secondary">Total Investment ({yearsToRetirement} years):</span>
                <span className="font-semibold">{formatCurrency(calculations?.totalInvestment)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-text-secondary">Expected Corpus at Retirement:</span>
                <span className="font-semibold text-prosperity">{formatCurrency(calculations?.expectedCorpus)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-text-secondary">Wealth Multiplication:</span>
                <span className="font-semibold text-success">
                  {(calculations?.expectedCorpus / calculations?.totalInvestment)?.toFixed(1)}x
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold text-text-primary mb-3">Retirement Income</h5>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-text-secondary">Current Monthly Expenses:</span>
                <span className="font-semibold">{formatCurrency(monthlyExpenses)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-text-secondary">Inflation-Adjusted Expenses:</span>
                <span className="font-semibold">{formatCurrency(calculations?.inflationAdjustedExpenses)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-text-secondary">Expected Monthly Income:</span>
                <span className="font-semibold text-prosperity">{formatCurrency(calculations?.postRetirementIncome)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-text-secondary">Income Coverage:</span>
                <span className="font-semibold text-success">
                  {((calculations?.postRetirementIncome / calculations?.inflationAdjustedExpenses) * 100)?.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Assumptions */}
      <div className="bg-white rounded-xl shadow-lg border border-border p-6">
        <h4 className="text-lg font-semibold text-text-primary mb-4">
          Key Assumptions
        </h4>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Parameter</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Value</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Note</th>
              </tr>
            </thead>
            <tbody>
              {assumptions?.map((assumption, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium text-text-primary">{assumption?.parameter}</td>
                  <td className="py-3 px-4 font-semibold text-prosperity">{assumption?.value}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{assumption?.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 p-4 bg-warning/5 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning mb-1">Important Disclaimer</p>
              <p className="text-xs text-text-secondary">
                These projections are based on historical data and assumptions. Actual returns may vary due to market conditions, 
                economic factors, and policy changes. Please review and adjust your plan periodically.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-lg border border-border p-6">
        <h4 className="text-lg font-semibold text-text-primary mb-4">
          Personalized Recommendations
        </h4>
        
        <div className="space-y-4">
          {recommendations?.map((rec, index) => (
            <div key={index} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec?.priority)}`}>
                    {rec?.priority} Priority
                  </span>
                  <span className="text-sm text-text-secondary">{rec?.category}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="ExternalLink"
                  className="text-primary hover:bg-primary/5"
                >
                  Learn More
                </Button>
              </div>
              
              <h5 className="font-semibold text-text-primary mb-2">{rec?.title}</h5>
              <p className="text-sm text-text-secondary mb-3">{rec?.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-text-secondary">Expected Impact: </span>
                  <span className="font-semibold text-success">{rec?.impact}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Timeline: </span>
                  <span className="font-semibold text-prosperity">{rec?.timeline}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Family Discussion Guide */}
      {reportType === 'family' && (
        <div className="bg-white rounded-xl shadow-lg border border-border p-6">
          <h4 className="text-lg font-semibold text-text-primary mb-4">
            Family Discussion Guide
          </h4>
          
          <div className="space-y-6">
            <div>
              <h5 className="font-semibold text-text-primary mb-2">Key Points to Discuss</h5>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <Icon name="ArrowRight" size={12} className="mt-1 text-prosperity" />
                  <span className="text-sm text-text-secondary">
                    Monthly investment commitment of {formatCurrency(calculations?.monthlyInvestment)} and its impact on current lifestyle
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="ArrowRight" size={12} className="mt-1 text-prosperity" />
                  <span className="text-sm text-text-secondary">
                    Expected retirement lifestyle and whether the projected corpus aligns with family expectations
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="ArrowRight" size={12} className="mt-1 text-prosperity" />
                  <span className="text-sm text-text-secondary">
                    Healthcare planning and potential medical expenses during retirement years
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="ArrowRight" size={12} className="mt-1 text-prosperity" />
                  <span className="text-sm text-text-secondary">
                    Legacy planning and wealth transfer to next generation
                  </span>
                </li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-text-primary mb-2">Questions to Consider</h5>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-text-primary">
                    Are we comfortable with the current investment amount and can we increase it if needed?
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-text-primary">
                    What kind of retirement lifestyle do we envision and is our plan aligned with it?
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-text-primary">
                    How will we handle healthcare costs and long-term care needs?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Report Footer */}
      <div className="bg-gradient-cultural rounded-xl shadow-lg p-6 text-white text-center">
        <div className="mb-4">
          <Icon name="Shield" size={32} color="white" className="mx-auto mb-2" />
          <h4 className="text-lg font-bold mb-1">Your Financial Future is Secure</h4>
          <p className="text-white/80 text-sm">
            This plan is designed to help you achieve your retirement goals with confidence
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="secondary"
            size="sm"
            iconName="MessageCircle"
            iconPosition="left"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            Discuss with Advisor
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            iconName="Calendar"
            iconPosition="left"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            Schedule Review
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RetirementReport;