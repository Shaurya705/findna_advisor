import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const PrivacyControls = () => {
  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: false,
    marketingEmails: true,
    analyticsTracking: true,
    thirdPartyIntegration: false,
    biometricAuth: true,
    locationTracking: false,
    personalizedAds: false,
    dataRetention: true
  });

  const [showDataExport, setShowDataExport] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleSettingChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleDataExport = () => {
    setShowDataExport(true);
    setExportProgress(0);
    
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const privacyOptions = [
    {
      key: 'dataSharing',
      title: 'Data Sharing with Partners',
      description: 'Allow sharing anonymized data with trusted financial partners for better services',
      icon: 'Share2',
      category: 'sharing'
    },
    {
      key: 'marketingEmails',
      title: 'Marketing Communications',
      description: 'Receive emails about new features, market insights, and financial tips',
      icon: 'Mail',
      category: 'communication'
    },
    {
      key: 'analyticsTracking',
      title: 'Analytics & Performance',
      description: 'Help us improve our services by sharing usage analytics',
      icon: 'BarChart3',
      category: 'analytics'
    },
    {
      key: 'thirdPartyIntegration',
      title: 'Third-party Integrations',
      description: 'Allow connections with external financial services and tools',
      icon: 'Link',
      category: 'integration'
    },
    {
      key: 'biometricAuth',
      title: 'Biometric Authentication',
      description: 'Use fingerprint or face recognition for secure app access',
      icon: 'Fingerprint',
      category: 'security'
    },
    {
      key: 'locationTracking',
      title: 'Location Services',
      description: 'Use location data for fraud prevention and local financial insights',
      icon: 'MapPin',
      category: 'location'
    },
    {
      key: 'personalizedAds',
      title: 'Personalized Advertisements',
      description: 'Show relevant financial product advertisements based on your profile',
      icon: 'Target',
      category: 'advertising'
    },
    {
      key: 'dataRetention',
      title: 'Extended Data Retention',
      description: 'Keep historical data longer for better long-term financial insights',
      icon: 'Archive',
      category: 'retention'
    }
  ];

  const dataCategories = [
    {
      category: 'Personal Information',
      items: ['Name, email, phone number', 'Date of birth', 'Address details', 'Identity documents'],
      icon: 'User'
    },
    {
      category: 'Financial Data',
      items: ['Account balances', 'Transaction history', 'Investment portfolio', 'Credit information'],
      icon: 'CreditCard'
    },
    {
      category: 'Usage Analytics',
      items: ['App usage patterns', 'Feature interactions', 'Performance metrics', 'Error logs'],
      icon: 'Activity'
    },
    {
      category: 'Preferences',
      items: ['Risk tolerance', 'Investment goals', 'Communication preferences', 'App settings'],
      icon: 'Settings'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-trust to-prosperity rounded-lg flex items-center justify-center">
          <Icon name="UserCheck" size={20} color="white" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Privacy Controls</h2>
          <p className="text-sm text-text-secondary">Manage your data and privacy preferences</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Privacy Settings */}
        <div className="space-y-4">
          <h3 className="font-medium text-text-primary mb-4">Privacy Settings</h3>
          
          {privacyOptions?.map((option) => (
            <div key={option?.key} className="p-4 border border-border rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name={option?.icon} size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-text-primary">{option?.title}</h4>
                    <Checkbox
                      checked={privacySettings?.[option?.key]}
                      onChange={(e) => handleSettingChange(option?.key, e?.target?.checked)}
                    />
                  </div>
                  <p className="text-sm text-text-secondary">{option?.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data Management */}
        <div className="space-y-4">
          <h3 className="font-medium text-text-primary mb-4">Data Management</h3>
          
          {/* Data Categories */}
          <div className="space-y-3">
            {dataCategories?.map((category, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name={category?.icon} size={16} className="text-prosperity" />
                  <h4 className="font-medium text-text-primary">{category?.category}</h4>
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {category?.items?.map((item, itemIndex) => (
                    <div key={itemIndex} className="text-sm text-text-secondary flex items-center space-x-2">
                      <div className="w-1 h-1 bg-text-secondary rounded-full"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Data Actions */}
          <div className="space-y-3">
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-medium text-text-primary mb-2">Export Your Data</h4>
              <p className="text-sm text-text-secondary mb-3">
                Download a complete copy of your data in JSON format
              </p>
              {!showDataExport ? (
                <Button
                  variant="outline"
                  onClick={handleDataExport}
                  iconName="Download"
                  iconPosition="left"
                  iconSize={16}
                >
                  Request Data Export
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Preparing export...</span>
                    <span className="text-primary font-medium">{exportProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    ></div>
                  </div>
                  {exportProgress === 100 && (
                    <Button
                      variant="default"
                      size="sm"
                      iconName="Download"
                      iconPosition="left"
                      iconSize={16}
                      className="mt-2"
                    >
                      Download Ready
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
              <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
              <p className="text-sm text-text-secondary mb-3">
                Permanently delete your account and all associated data
              </p>
              <Button
                variant="destructive"
                size="sm"
                iconName="Trash2"
                iconPosition="left"
                iconSize={16}
              >
                Request Account Deletion
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-primary mb-1">Your Rights Under Indian Law</h4>
            <p className="text-sm text-text-secondary">
              Under the Digital Personal Data Protection Act, 2023, you have the right to access, 
              correct, erase, and port your personal data. You can also withdraw consent and 
              lodge complaints with the Data Protection Board of India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyControls;