import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SecurityOverview from './components/SecurityOverview';
import DataFlowDemo from './components/DataFlowDemo';
import ComplianceSection from './components/ComplianceSection';
import AITransparency from './components/AITransparency';
import PrivacyControls from './components/PrivacyControls';
import TrustSignals from './components/TrustSignals';
import SecurityEducation from './components/SecurityEducation';
import IncidentResponse from './components/IncidentResponse';

const SecurityTrustCenter = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const navigationSections = [
    { id: 'overview', label: 'Security Overview', icon: 'Shield' },
    { id: 'dataflow', label: 'Data Flow', icon: 'GitBranch' },
    { id: 'compliance', label: 'Compliance', icon: 'FileCheck' },
    { id: 'ai-transparency', label: 'AI Transparency', icon: 'Brain' },
    { id: 'privacy', label: 'Privacy Controls', icon: 'UserCheck' },
    { id: 'trust', label: 'Trust Signals', icon: 'Heart' },
    { id: 'education', label: 'Security Education', icon: 'GraduationCap' },
    { id: 'incident', label: 'Incident Response', icon: 'Siren' }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <SecurityOverview />;
      case 'dataflow':
        return <DataFlowDemo />;
      case 'compliance':
        return <ComplianceSection />;
      case 'ai-transparency':
        return <AITransparency />;
      case 'privacy':
        return <PrivacyControls />;
      case 'trust':
        return <TrustSignals />;
      case 'education':
        return <SecurityEducation />;
      case 'incident':
        return <IncidentResponse />;
      default:
        return <SecurityOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-cultural text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Icon name="Shield" size={32} color="white" strokeWidth={2} />
                </div>
                <div className="text-left">
                  <h1 className="text-4xl font-bold mb-2">Security & Trust Center</h1>
                  <p className="text-xl opacity-90">Your financial data protection is our top priority</p>
                </div>
              </div>
              
              <p className="text-lg opacity-80 max-w-3xl mx-auto mb-8">
                Discover how FinDNA Advisor protects your financial information with bank-grade security, 
                regulatory compliance, and transparent AI practices. Built for the Indian market with 
                global security standards.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <Icon name="Lock" size={16} color="white" />
                  <span className="text-sm font-medium">AES-256 Encryption</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <Icon name="Award" size={16} color="white" />
                  <span className="text-sm font-medium">ISO 27001 Certified</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <Icon name="FileCheck" size={16} color="white" />
                  <span className="text-sm font-medium">SEBI Compliant</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <Icon name="Users" size={16} color="white" />
                  <span className="text-sm font-medium">2.5M+ Trusted Users</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-border sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto scrollbar-hide py-4 space-x-2">
              {navigationSections?.map((section) => (
                <Button
                  key={section?.id}
                  variant={activeSection === section?.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveSection(section?.id)}
                  iconName={section?.icon}
                  iconPosition="left"
                  iconSize={16}
                  className={`whitespace-nowrap ${
                    activeSection === section?.id 
                      ? "bg-primary text-white shadow-sm" 
                      : "text-text-secondary hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {section?.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-fade-in">
            {renderActiveSection()}
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="bg-gray-50 border-t border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-2">Need Immediate Assistance?</h2>
              <p className="text-text-secondary">Our security team is available 24/7 to help with any concerns</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-xl border border-border shadow-sm">
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name="Phone" size={24} className="text-destructive" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Emergency Hotline</h3>
                <p className="text-sm text-text-secondary mb-3">24/7 immediate security assistance</p>
                <p className="text-lg font-bold text-destructive">1800-FINDNA-911</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl border border-border shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name="Mail" size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Security Team</h3>
                <p className="text-sm text-text-secondary mb-3">Report security concerns via email</p>
                <p className="text-lg font-bold text-primary">security@findna.com</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl border border-border shadow-sm">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name="MessageCircle" size={24} className="text-success" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Live Chat Support</h3>
                <p className="text-sm text-text-secondary mb-3">Get instant help from our experts</p>
                <Button variant="outline" size="sm">Start Chat</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badge Footer */}
        <div className="bg-white py-8 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center space-x-8 opacity-60">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-success" />
                <span className="text-sm font-medium text-text-secondary">Bank-Grade Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Award" size={16} className="text-primary" />
                <span className="text-sm font-medium text-text-secondary">ISO 27001 Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="FileCheck" size={16} className="text-prosperity" />
                <span className="text-sm font-medium text-text-secondary">Regulatory Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} className="text-trust" />
                <span className="text-sm font-medium text-text-secondary">Trusted by Millions</span>
              </div>
            </div>
            
            <div className="text-center mt-6 pt-6 border-t border-border">
              <p className="text-sm text-text-secondary">
                © {new Date()?.getFullYear()} FinDNA Advisor. Your financial security is our commitment. 
                All data is encrypted and stored in compliance with Indian data protection regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTrustCenter;