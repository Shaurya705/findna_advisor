import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityOverview = () => {
  const securityFeatures = [
    {
      icon: "Shield",
      title: "AES-256 Encryption",
      description: "Bank-grade encryption protects all your financial data in transit and at rest",
      status: "Active",
      color: "text-success"
    },
    {
      icon: "Lock",
      title: "Multi-Factor Authentication",
      description: "Multiple layers of security including biometric and OTP verification",
      status: "Enabled",
      color: "text-primary"
    },
    {
      icon: "Eye",
      title: "Zero-Knowledge Architecture",
      description: "We can't see your sensitive data even if we wanted to",
      status: "Implemented",
      color: "text-prosperity"
    },
    {
      icon: "Server",
      title: "Secure Cloud Infrastructure",
      description: "ISO 27001 certified data centers with 99.9% uptime guarantee",
      status: "Certified",
      color: "text-trust"
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-primary to-trust rounded-lg flex items-center justify-center">
          <Icon name="Shield" size={20} color="white" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Security Overview</h2>
          <p className="text-sm text-text-secondary">Your data protection at a glance</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityFeatures?.map((feature, index) => (
          <div key={index} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${feature?.color === 'text-success' ? 'bg-success/10' : feature?.color === 'text-primary' ? 'bg-primary/10' : feature?.color === 'text-prosperity' ? 'bg-prosperity/10' : 'bg-trust/10'}`}>
                <Icon name={feature?.icon} size={16} className={feature?.color} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-text-primary">{feature?.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${feature?.color === 'text-success' ? 'bg-success/10 text-success' : feature?.color === 'text-primary' ? 'bg-primary/10 text-primary' : feature?.color === 'text-prosperity' ? 'bg-prosperity/10 text-prosperity' : 'bg-trust/10 text-trust'}`}>
                    {feature?.status}
                  </span>
                </div>
                <p className="text-sm text-text-secondary">{feature?.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-success/5 border border-success/20 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <span className="text-sm font-medium text-success">All Systems Secure</span>
        </div>
        <p className="text-sm text-text-secondary">
          Last security audit completed on August 15, 2025. Next audit scheduled for November 2025.
        </p>
      </div>
    </div>
  );
};

export default SecurityOverview;