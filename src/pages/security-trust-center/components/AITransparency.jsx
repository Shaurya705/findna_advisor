import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AITransparency = () => {
  const [selectedProcess, setSelectedProcess] = useState('recommendation');

  const aiProcesses = {
    recommendation: {
      title: "Investment Recommendations",
      description: "How we generate personalized investment advice",
      steps: [
        {
          step: "Data Analysis",
          description: "We analyze your financial profile, risk tolerance, and investment goals",
          inputs: ["Portfolio balance", "Risk assessment", "Investment timeline", "Financial goals"],
          icon: "BarChart3"
        },
        {
          step: "Market Research",
          description: "Our AI processes real-time market data and economic indicators",
          inputs: ["Market trends", "Economic indicators", "Sector performance", "Global events"],
          icon: "TrendingUp"
        },
        {
          step: "Risk Modeling",
          description: "Advanced algorithms calculate optimal risk-return scenarios",
          inputs: ["Volatility metrics", "Correlation analysis", "Historical performance", "Stress testing"],
          icon: "Target"
        },
        {
          step: "Recommendation Generation",
          description: "AI generates personalized recommendations based on your unique profile",
          inputs: ["Optimized portfolio", "Rebalancing suggestions", "Tax implications", "Timeline alignment"],
          icon: "Lightbulb"
        }
      ]
    },
    riskAssessment: {
      title: "Risk Assessment",
      description: "How we evaluate and monitor investment risks",
      steps: [
        {
          step: "Profile Building",
          description: "Creating your comprehensive risk profile",
          inputs: ["Age and income", "Investment experience", "Financial obligations", "Risk questionnaire"],
          icon: "User"
        },
        {
          step: "Behavioral Analysis",
          description: "Understanding your investment behavior patterns",
          inputs: ["Transaction history", "Market reaction", "Decision patterns", "Emotional indicators"],
          icon: "Brain"
        },
        {
          step: "Dynamic Monitoring",
          description: "Continuous risk assessment based on market changes",
          inputs: ["Portfolio volatility", "Market conditions", "Life changes", "Goal adjustments"],
          icon: "Activity"
        },
        {
          step: "Alert Generation",
          description: "Proactive alerts for risk management",
          inputs: ["Risk threshold breaches", "Market warnings", "Rebalancing needs", "Opportunity alerts"],
          icon: "Bell"
        }
      ]
    },
    taxOptimization: {
      title: "Tax Optimization",
      description: "How we help minimize your tax liability",
      steps: [
        {
          step: "Tax Profile Analysis",
          description: "Understanding your tax situation and obligations",
          inputs: ["Income sources", "Tax bracket", "Deductions available", "Investment timeline"],
          icon: "Calculator"
        },
        {
          step: "Gain/Loss Harvesting",
          description: "Identifying opportunities for tax-efficient investing",
          inputs: ["Capital gains", "Unrealized losses", "Holding periods", "Tax implications"],
          icon: "Scissors"
        },
        {
          step: "Strategy Optimization",
          description: "Creating tax-efficient investment strategies",
          inputs: ["Asset allocation", "Account types", "Timing strategies", "Tax-loss harvesting"],
          icon: "Settings"
        },
        {
          step: "Implementation",
          description: "Executing tax-optimized investment decisions",
          inputs: ["Trade execution", "Tax reporting", "Documentation", "Compliance tracking"],
          icon: "CheckCircle"
        }
      ]
    }
  };

  const processOptions = [
    { key: 'recommendation', label: 'Investment Advice', icon: 'TrendingUp' },
    { key: 'riskAssessment', label: 'Risk Assessment', icon: 'Shield' },
    { key: 'taxOptimization', label: 'Tax Optimization', icon: 'Calculator' }
  ];

  const currentProcess = aiProcesses?.[selectedProcess];

  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-prosperity to-growth rounded-lg flex items-center justify-center">
          <Icon name="Brain" size={20} color="white" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">AI Transparency</h2>
          <p className="text-sm text-text-secondary">Understanding how our AI makes financial recommendations</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {processOptions?.map((option) => (
          <Button
            key={option?.key}
            variant={selectedProcess === option?.key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedProcess(option?.key)}
            iconName={option?.icon}
            iconPosition="left"
            iconSize={16}
            className={selectedProcess === option?.key ? "bg-prosperity text-white" : ""}
          >
            {option?.label}
          </Button>
        ))}
      </div>
      <div className="border border-border rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">{currentProcess?.title}</h3>
          <p className="text-sm text-text-secondary">{currentProcess?.description}</p>
        </div>

        <div className="space-y-6">
          {currentProcess?.steps?.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-prosperity/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={step?.icon} size={20} className="text-prosperity" strokeWidth={2} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-medium text-prosperity bg-prosperity/10 px-2 py-1 rounded-full">
                      Step {index + 1}
                    </span>
                    <h4 className="font-medium text-text-primary">{step?.step}</h4>
                  </div>
                  
                  <p className="text-sm text-text-secondary mb-3">{step?.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {step?.inputs?.map((input, inputIndex) => (
                      <div key={inputIndex} className="text-xs bg-gray-50 border border-border rounded px-2 py-1">
                        {input}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {index < currentProcess?.steps?.length - 1 && (
                <div className="absolute left-5 top-12 w-0.5 h-8 bg-border"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Eye" size={16} className="text-primary" />
            <h4 className="font-medium text-primary">Transparent Process</h4>
          </div>
          <p className="text-sm text-text-secondary">
            Every recommendation comes with clear reasoning and data sources
          </p>
        </div>
        
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="UserCheck" size={16} className="text-success" />
            <h4 className="font-medium text-success">Human Oversight</h4>
          </div>
          <p className="text-sm text-text-secondary">
            All AI recommendations are reviewed by certified financial experts
          </p>
        </div>
        
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="RefreshCw" size={16} className="text-prosperity" />
            <h4 className="font-medium text-prosperity">Continuous Learning</h4>
          </div>
          <p className="text-sm text-text-secondary">
            Our AI improves through market feedback and regulatory updates
          </p>
        </div>
      </div>
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
          <div>
            <h4 className="font-medium text-warning mb-1">Important Disclosure</h4>
            <p className="text-sm text-text-secondary">
              While our AI provides sophisticated analysis, all investment decisions remain yours. 
              Past performance doesn't guarantee future results. Please consider your financial 
              situation and consult with a financial advisor when needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITransparency;