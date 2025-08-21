import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DataFlowDemo = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const dataFlowSteps = [
    {
      id: 1,
      title: "Data Collection",
      description: "Only essential financial information is collected with your explicit consent",
      details: "We collect account balances, transaction history, and investment preferences. Personal identifiers are immediately encrypted.",
      icon: "Database",
      color: "bg-primary/10 text-primary"
    },
    {
      id: 2,
      title: "Encryption",
      description: "All data is encrypted using AES-256 before transmission",
      details: "Your data is encrypted both in transit and at rest. Even our engineers cannot access your raw financial information.",
      icon: "Lock",
      color: "bg-prosperity/10 text-prosperity"
    },
    {
      id: 3,
      title: "AI Processing",
      description: "Encrypted data is analyzed by our AI without exposing sensitive information",
      details: "Our AI works with anonymized, encrypted data patterns. Personal details remain protected throughout analysis.",
      icon: "Brain",
      color: "bg-trust/10 text-trust"
    },
    {
      id: 4,
      title: "Secure Storage",
      description: "Processed insights are stored in ISO 27001 certified data centers",
      details: "Data is distributed across multiple secure locations in India with regular backups and disaster recovery protocols.",
      icon: "Server",
      color: "bg-success/10 text-success"
    },
    {
      id: 5,
      title: "User Access",
      description: "You access your insights through secure, authenticated channels",
      details: "Multi-factor authentication ensures only you can access your financial insights and recommendations.",
      icon: "User",
      color: "bg-growth/10 text-growth"
    }
  ];

  const handlePlayDemo = () => {
    setIsPlaying(true);
    setActiveStep(0);
    
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= dataFlowSteps?.length - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-trust to-primary rounded-lg flex items-center justify-center">
            <Icon name="GitBranch" size={20} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Data Flow Demonstration</h2>
            <p className="text-sm text-text-secondary">See how your data travels securely through our system</p>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={handlePlayDemo}
          disabled={isPlaying}
          iconName="Play"
          iconPosition="left"
          iconSize={16}
        >
          {isPlaying ? 'Playing...' : 'Play Demo'}
        </Button>
      </div>
      <div className="space-y-4">
        {dataFlowSteps?.map((step, index) => (
          <div
            key={step?.id}
            className={`relative p-4 border rounded-lg transition-all duration-500 ${
              activeStep === index
                ? 'border-primary bg-primary/5 shadow-md'
                : activeStep > index
                ? 'border-success bg-success/5' :'border-border bg-gray-50'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                activeStep === index
                  ? 'bg-primary text-white'
                  : activeStep > index
                  ? 'bg-success text-white'
                  : step?.color
              }`}>
                <Icon 
                  name={activeStep > index ? "Check" : step?.icon} 
                  size={20} 
                  strokeWidth={2.5}
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-medium text-text-primary">
                    Step {step?.id}: {step?.title}
                  </h3>
                  {activeStep === index && (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-text-secondary mb-2">{step?.description}</p>
                {(activeStep === index || activeStep > index) && (
                  <p className="text-sm text-text-primary bg-white/50 p-3 rounded border-l-4 border-primary">
                    {step?.details}
                  </p>
                )}
              </div>
            </div>
            
            {index < dataFlowSteps?.length - 1 && (
              <div className={`absolute left-9 top-16 w-0.5 h-6 transition-colors duration-300 ${
                activeStep > index ? 'bg-success' : 'bg-border'
              }`}></div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-primary mb-1">Your Data, Your Control</h4>
            <p className="text-sm text-text-secondary">
              You can request data deletion, export your information, or modify privacy settings at any time. 
              We believe in complete transparency and user control over personal financial data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataFlowDemo;