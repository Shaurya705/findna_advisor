import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IncidentResponse = () => {
  const [selectedIncidentType, setSelectedIncidentType] = useState('data-breach');

  const incidentTypes = {
    'data-breach': {
      title: 'Data Breach Response',
      icon: 'ShieldAlert',
      color: 'text-destructive',
      timeline: [
        {
          time: '0-15 minutes',
          action: 'Immediate Detection & Isolation',
          description: 'Automated systems detect anomaly and isolate affected systems',
          status: 'automated'
        },
        {
          time: '15-30 minutes',
          action: 'Security Team Activation',
          description: 'On-call security team is alerted and begins investigation',
          status: 'manual'
        },
        {
          time: '30-60 minutes',
          action: 'Impact Assessment',
          description: 'Determine scope of breach and affected user accounts',
          status: 'manual'
        },
        {
          time: '1-2 hours',
          action: 'Containment Measures',
          description: 'Implement additional security controls and patch vulnerabilities',
          status: 'manual'
        },
        {
          time: '2-4 hours',
          action: 'User Notification',
          description: 'Notify affected users via email, SMS, and in-app notifications',
          status: 'automated'
        },
        {
          time: '4-24 hours',
          action: 'Regulatory Reporting',
          description: 'Report incident to SEBI, RBI, and other relevant authorities',
          status: 'manual'
        },
        {
          time: '24-72 hours',
          action: 'Public Disclosure',
          description: 'Publish detailed incident report and remediation steps',
          status: 'manual'
        }
      ]
    },
    'system-outage': {
      title: 'System Outage Response',
      icon: 'Server',
      color: 'text-warning',
      timeline: [
        {
          time: '0-5 minutes',
          action: 'Outage Detection',
          description: 'Monitoring systems detect service disruption',
          status: 'automated'
        },
        {
          time: '5-10 minutes',
          action: 'Team Notification',
          description: 'Engineering team receives automated alerts',
          status: 'automated'
        },
        {
          time: '10-15 minutes',
          action: 'Initial Assessment',
          description: 'Engineers assess scope and root cause of outage',
          status: 'manual'
        },
        {
          time: '15-30 minutes',
          action: 'User Communication',
          description: 'Status page updated and users notified of ongoing issue',
          status: 'manual'
        },
        {
          time: '30-120 minutes',
          action: 'Resolution Implementation',
          description: 'Apply fixes and restore service functionality',
          status: 'manual'
        },
        {
          time: '2-4 hours',
          action: 'Service Verification',
          description: 'Comprehensive testing to ensure full service restoration',
          status: 'manual'
        },
        {
          time: '4-24 hours',
          action: 'Post-Incident Review',
          description: 'Analyze incident and implement preventive measures',
          status: 'manual'
        }
      ]
    },
    'fraud-detection': {
      title: 'Fraud Detection Response',
      icon: 'AlertTriangle',
      color: 'text-growth',
      timeline: [
        {
          time: '0-1 minute',
          action: 'AI Fraud Detection',
          description: 'Machine learning algorithms identify suspicious activity',
          status: 'automated'
        },
        {
          time: '1-5 minutes',
          action: 'Account Protection',
          description: 'Automatically freeze affected accounts and transactions',
          status: 'automated'
        },
        {
          time: '5-15 minutes',
          action: 'User Verification',
          description: 'Send verification requests to account holders',
          status: 'automated'
        },
        {
          time: '15-30 minutes',
          action: 'Manual Review',
          description: 'Security analysts review flagged transactions',
          status: 'manual'
        },
        {
          time: '30-60 minutes',
          action: 'Investigation',
          description: 'Detailed analysis of fraud patterns and methods',
          status: 'manual'
        },
        {
          time: '1-2 hours',
          action: 'Account Recovery',
          description: 'Restore legitimate access and reverse fraudulent transactions',
          status: 'manual'
        },
        {
          time: '2-24 hours',
          action: 'Prevention Updates',
          description: 'Update fraud detection algorithms and security measures',
          status: 'manual'
        }
      ]
    }
  };

  const communicationChannels = [
    {
      channel: 'In-App Notifications',
      description: 'Real-time alerts within the FinDNA Advisor app',
      icon: 'Bell',
      priority: 'High'
    },
    {
      channel: 'Email Alerts',
      description: 'Detailed incident reports sent to registered email addresses',
      icon: 'Mail',
      priority: 'High'
    },
    {
      channel: 'SMS Notifications',
      description: 'Critical security alerts sent via text message',
      icon: 'MessageSquare',
      priority: 'Critical'
    },
    {
      channel: 'Status Page',
      description: 'Real-time service status at status.findna.com',
      icon: 'Monitor',
      priority: 'Medium'
    },
    {
      channel: 'Social Media',
      description: 'Updates on official Twitter and LinkedIn accounts',
      icon: 'Share2',
      priority: 'Low'
    },
    {
      channel: 'Press Release',
      description: 'Official statements for major incidents',
      icon: 'FileText',
      priority: 'Low'
    }
  ];

  const currentIncident = incidentTypes?.[selectedIncidentType];

  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-destructive to-warning rounded-lg flex items-center justify-center">
          <Icon name="Siren" size={20} color="white" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Incident Response</h2>
          <p className="text-sm text-text-secondary">Our comprehensive approach to handling security incidents</p>
        </div>
      </div>
      {/* Incident Type Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(incidentTypes)?.map(([key, incident]) => (
          <Button
            key={key}
            variant={selectedIncidentType === key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedIncidentType(key)}
            iconName={incident?.icon}
            iconPosition="left"
            iconSize={16}
            className={selectedIncidentType === key ? "bg-primary text-white" : ""}
          >
            {incident?.title?.split(' ')?.[0]} {incident?.title?.split(' ')?.[1]}
          </Button>
        ))}
      </div>
      {/* Response Timeline */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name={currentIncident?.icon} size={20} className={currentIncident?.color} />
          <h3 className="text-lg font-semibold text-text-primary">{currentIncident?.title}</h3>
        </div>

        <div className="space-y-4">
          {currentIncident?.timeline?.map((step, index) => (
            <div key={index} className="relative flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step?.status === 'automated' ?'bg-success/20 text-success' :'bg-primary/20 text-primary'
                }`}>
                  <Icon 
                    name={step?.status === 'automated' ? 'Zap' : 'User'} 
                    size={16} 
                    strokeWidth={2}
                  />
                </div>
                {index < currentIncident?.timeline?.length - 1 && (
                  <div className="w-0.5 h-8 bg-border mt-2"></div>
                )}
              </div>
              
              <div className="flex-1 pb-4">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium text-prosperity bg-prosperity/10 px-2 py-1 rounded-full">
                    {step?.time}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    step?.status === 'automated' ?'bg-success/10 text-success' :'bg-primary/10 text-primary'
                  }`}>
                    {step?.status === 'automated' ? 'Automated' : 'Manual'}
                  </span>
                </div>
                <h4 className="font-medium text-text-primary mb-1">{step?.action}</h4>
                <p className="text-sm text-text-secondary">{step?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Communication Channels */}
      <div className="mb-6">
        <h3 className="font-medium text-text-primary mb-4">Communication Channels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {communicationChannels?.map((channel, index) => (
            <div key={index} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name={channel?.icon} size={16} className="text-primary" />
                <h4 className="font-medium text-text-primary">{channel?.channel}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  channel?.priority === 'Critical' ?'bg-destructive/10 text-destructive'
                    : channel?.priority === 'High' ?'bg-warning/10 text-warning'
                    : channel?.priority === 'Medium' ?'bg-primary/10 text-primary' :'bg-gray-100 text-text-secondary'
                }`}>
                  {channel?.priority}
                </span>
              </div>
              <p className="text-sm text-text-secondary">{channel?.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Emergency Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="Phone" size={16} className="text-destructive" />
            <h4 className="font-medium text-destructive">Emergency Security Hotline</h4>
          </div>
          <p className="text-sm text-text-secondary mb-2">
            24/7 immediate assistance for security incidents
          </p>
          <p className="text-lg font-bold text-destructive">1800-FINDNA-911</p>
          <p className="text-xs text-text-secondary mt-1">Available in Hindi and English</p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="Mail" size={16} className="text-primary" />
            <h4 className="font-medium text-primary">Security Team Email</h4>
          </div>
          <p className="text-sm text-text-secondary mb-2">
            Report security concerns or incidents
          </p>
          <p className="text-lg font-bold text-primary">security@findna.com</p>
          <p className="text-xs text-text-secondary mt-1">Response within 2 hours</p>
        </div>
      </div>
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={16} className="text-success mt-0.5" />
          <div>
            <h4 className="font-medium text-success mb-1">Proactive Security Monitoring</h4>
            <p className="text-sm text-text-secondary">
              Our security operations center monitors threats 24/7 using advanced AI and machine learning. 
              We maintain partnerships with leading cybersecurity firms and government agencies to stay 
              ahead of emerging threats and protect your financial data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentResponse;