import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComplianceSection = () => {
  const [selectedCompliance, setSelectedCompliance] = useState('sebi');

  const complianceData = {
    sebi: {
      title: "SEBI Compliance",
      authority: "Securities and Exchange Board of India",
      status: "Fully Compliant",
      lastAudit: "July 2025",
      nextAudit: "January 2026",
      certifications: [
        "Investment Advisor Registration",
        "Client Asset Protection",
        "Risk Disclosure Compliance",
        "Investor Grievance Mechanism"
      ],
      description: "We adhere to all SEBI guidelines for investment advisory services, ensuring transparent fee structures, proper risk disclosure, and investor protection mechanisms."
    },
    rbi: {
      title: "RBI Guidelines",
      authority: "Reserve Bank of India",
      status: "Compliant",
      lastAudit: "June 2025",
      nextAudit: "December 2025",
      certifications: [
        "Digital Payment Security",
        "KYC/AML Compliance",
        "Data Localization",
        "Cybersecurity Framework"
      ],
      description: "Our platform follows RBI's digital payment guidelines, maintains strict KYC/AML procedures, and ensures all customer data is stored within India."
    },
    pdp: {
      title: "Personal Data Protection",
      authority: "Digital Personal Data Protection Act, 2023",
      status: "Ready for Implementation",
      lastAudit: "August 2025",
      nextAudit: "February 2026",
      certifications: [
        "Consent Management",
        "Data Minimization",
        "Purpose Limitation",
        "User Rights Implementation"
      ],
      description: "We've proactively implemented measures to comply with India's upcoming data protection regulations, ensuring user privacy and data rights."
    },
    iso: {
      title: "ISO 27001:2022",
      authority: "International Organization for Standardization",
      status: "Certified",
      lastAudit: "May 2025",
      nextAudit: "May 2026",
      certifications: [
        "Information Security Management",
        "Risk Assessment Framework",
        "Incident Response Procedures",
        "Continuous Monitoring"
      ],
      description: "Our information security management system is certified to international standards, ensuring comprehensive protection of customer data."
    }
  };

  const complianceOptions = [
    { key: 'sebi', label: 'SEBI', icon: 'TrendingUp' },
    { key: 'rbi', label: 'RBI', icon: 'Banknote' },
    { key: 'pdp', label: 'Data Protection', icon: 'Shield' },
    { key: 'iso', label: 'ISO 27001', icon: 'Award' }
  ];

  const currentCompliance = complianceData?.[selectedCompliance];

  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-success to-trust rounded-lg flex items-center justify-center">
          <Icon name="FileCheck" size={20} color="white" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Regulatory Compliance</h2>
          <p className="text-sm text-text-secondary">Certified adherence to Indian financial regulations</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {complianceOptions?.map((option) => (
          <Button
            key={option?.key}
            variant={selectedCompliance === option?.key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCompliance(option?.key)}
            iconName={option?.icon}
            iconPosition="left"
            iconSize={16}
            className={selectedCompliance === option?.key ? "bg-primary text-white" : ""}
          >
            {option?.label}
          </Button>
        ))}
      </div>
      <div className="border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{currentCompliance?.title}</h3>
            <p className="text-sm text-text-secondary">{currentCompliance?.authority}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">{currentCompliance?.status}</span>
            </div>
            <p className="text-xs text-text-secondary">Last audit: {currentCompliance?.lastAudit}</p>
          </div>
        </div>

        <p className="text-sm text-text-secondary mb-4">{currentCompliance?.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {currentCompliance?.certifications?.map((cert, index) => (
            <div key={index} className="flex items-center space-x-2 p-3 bg-success/5 border border-success/20 rounded-lg">
              <Icon name="Badge" size={16} className="text-success" />
              <span className="text-sm font-medium text-text-primary">{cert}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">Next audit scheduled</span>
          </div>
          <span className="text-sm font-medium text-text-primary">{currentCompliance?.nextAudit}</span>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="FileText" size={16} className="text-primary" />
          </div>
          <h4 className="font-medium text-text-primary mb-1">Audit Reports</h4>
          <p className="text-xs text-text-secondary">Available on request</p>
        </div>
        
        <div className="text-center p-4 bg-prosperity/5 border border-prosperity/20 rounded-lg">
          <div className="w-8 h-8 bg-prosperity/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="Users" size={16} className="text-prosperity" />
          </div>
          <h4 className="font-medium text-text-primary mb-1">Compliance Team</h4>
          <p className="text-xs text-text-secondary">24/7 monitoring</p>
        </div>
        
        <div className="text-center p-4 bg-trust/5 border border-trust/20 rounded-lg">
          <div className="w-8 h-8 bg-trust/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="Phone" size={16} className="text-trust" />
          </div>
          <h4 className="font-medium text-text-primary mb-1">Compliance Helpline</h4>
          <p className="text-xs text-text-secondary">1800-123-4567</p>
        </div>
      </div>
    </div>
  );
};

export default ComplianceSection;