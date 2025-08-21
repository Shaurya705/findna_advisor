import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const RetirementGoalWizard = ({ onComplete, currentStep, onStepChange }) => {
  const [formData, setFormData] = useState({
    retirementAge: '',
    currentAge: '',
    monthlyExpenses: '',
    retirementGoal: '',
    riskTolerance: '',
    language: 'english'
  });

  const [errors, setErrors] = useState({});

  const retirementGoalOptions = [
    { value: 'comfortable', label: 'Comfortable Retirement (घर में आरामदायक सेवानिवृत्ति)' },
    { value: 'travel', label: 'Travel & Family Time (यात्रा और पारिवारिक समय)' },
    { value: 'luxury', label: 'Luxury Lifestyle (विलासिता की जीवनशैली)' },
    { value: 'basic', label: 'Basic Needs Coverage (बुनियादी जरूरतों की पूर्ति)' }
  ];

  const riskToleranceOptions = [
    { value: 'conservative', label: 'Conservative (FD/PPF Focus)' },
    { value: 'moderate', label: 'Moderate (Balanced Portfolio)' },
    { value: 'aggressive', label: 'Aggressive (Equity Heavy)' }
  ];

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'हिंदी' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.currentAge || formData?.currentAge < 18 || formData?.currentAge > 65) {
      newErrors.currentAge = 'Please enter a valid current age (18-65)';
    }
    
    if (!formData?.retirementAge || formData?.retirementAge <= formData?.currentAge) {
      newErrors.retirementAge = 'Retirement age must be greater than current age';
    }
    
    if (!formData?.monthlyExpenses || formData?.monthlyExpenses < 10000) {
      newErrors.monthlyExpenses = 'Please enter valid monthly expenses (min ₹10,000)';
    }
    
    if (!formData?.retirementGoal) {
      newErrors.retirementGoal = 'Please select your retirement goal';
    }
    
    if (!formData?.riskTolerance) {
      newErrors.riskTolerance = 'Please select your risk tolerance';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onComplete(formData);
    }
  };

  const steps = [
    {
      title: 'Personal Details',
      description: 'Tell us about yourself'
    },
    {
      title: 'Retirement Goals',
      description: 'Define your retirement vision'
    },
    {
      title: 'Risk Profile',
      description: 'Understand your investment style'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-border p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps?.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                index <= currentStep 
                  ? 'bg-primary text-white' :'bg-muted text-text-secondary'
              }`}>
                {index + 1}
              </div>
              {index < steps?.length - 1 && (
                <div className={`w-16 h-1 mx-2 ${
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-text-primary">
            {steps?.[currentStep]?.title}
          </h3>
          <p className="text-sm text-text-secondary">
            {steps?.[currentStep]?.description}
          </p>
        </div>
      </div>
      {/* Form Content */}
      <div className="space-y-6">
        {currentStep === 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Current Age"
                type="number"
                placeholder="Enter your current age"
                value={formData?.currentAge}
                onChange={(e) => handleInputChange('currentAge', e?.target?.value)}
                error={errors?.currentAge}
                required
              />
              
              <Input
                label="Desired Retirement Age"
                type="number"
                placeholder="When do you want to retire?"
                value={formData?.retirementAge}
                onChange={(e) => handleInputChange('retirementAge', e?.target?.value)}
                error={errors?.retirementAge}
                required
              />
            </div>

            <Input
              label="Current Monthly Expenses (₹)"
              type="number"
              placeholder="Enter your monthly expenses"
              value={formData?.monthlyExpenses}
              onChange={(e) => handleInputChange('monthlyExpenses', e?.target?.value)}
              error={errors?.monthlyExpenses}
              description="This helps us calculate your retirement corpus requirement"
              required
            />

            <Select
              label="Preferred Language"
              options={languageOptions}
              value={formData?.language}
              onChange={(value) => handleInputChange('language', value)}
              placeholder="Choose your preferred language"
            />
          </>
        )}

        {currentStep === 1 && (
          <>
            <Select
              label="Retirement Goal"
              options={retirementGoalOptions}
              value={formData?.retirementGoal}
              onChange={(value) => handleInputChange('retirementGoal', value)}
              error={errors?.retirementGoal}
              placeholder="What kind of retirement do you envision?"
              description="Choose the lifestyle you want to maintain after retirement"
              required
            />

            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-semibold text-text-primary mb-2">
                Goal Explanation
              </h4>
              {formData?.retirementGoal === 'comfortable' && (
                <p className="text-sm text-text-secondary">
                  Comfortable retirement means maintaining your current lifestyle with some additional leisure activities. 
                  Typically requires 70-80% of your current income.
                </p>
              )}
              {formData?.retirementGoal === 'travel' && (
                <p className="text-sm text-text-secondary">
                  Travel-focused retirement includes regular domestic and international trips, family gatherings, 
                  and active lifestyle. Requires 80-100% of current income.
                </p>
              )}
              {formData?.retirementGoal === 'luxury' && (
                <p className="text-sm text-text-secondary">
                  Luxury retirement with premium healthcare, frequent travel, and enhanced lifestyle. 
                  Requires 100-120% of current income.
                </p>
              )}
              {formData?.retirementGoal === 'basic' && (
                <p className="text-sm text-text-secondary">
                  Basic retirement covering essential needs like food, healthcare, and housing. 
                  Requires 50-60% of current income.
                </p>
              )}
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <Select
              label="Risk Tolerance"
              options={riskToleranceOptions}
              value={formData?.riskTolerance}
              onChange={(value) => handleInputChange('riskTolerance', value)}
              error={errors?.riskTolerance}
              placeholder="How comfortable are you with investment risk?"
              description="This determines your investment strategy mix"
              required
            />

            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-semibold text-text-primary mb-2">
                Risk Profile Details
              </h4>
              {formData?.riskTolerance === 'conservative' && (
                <div className="space-y-2">
                  <p className="text-sm text-text-secondary">
                    Conservative approach focuses on capital preservation with steady returns.
                  </p>
                  <div className="text-xs text-text-muted">
                    • 70% Fixed Deposits, PPF, EPF
                    • 20% Debt Mutual Funds
                    • 10% Large Cap Equity
                  </div>
                </div>
              )}
              {formData?.riskTolerance === 'moderate' && (
                <div className="space-y-2">
                  <p className="text-sm text-text-secondary">
                    Balanced approach with mix of safety and growth potential.
                  </p>
                  <div className="text-xs text-text-muted">
                    • 40% Fixed Income (PPF, Debt Funds)
                    • 40% Equity (Large & Mid Cap)
                    • 20% Alternative Investments
                  </div>
                </div>
              )}
              {formData?.riskTolerance === 'aggressive' && (
                <div className="space-y-2">
                  <p className="text-sm text-text-secondary">
                    Growth-focused approach for higher long-term returns.
                  </p>
                  <div className="text-xs text-text-muted">
                    • 70% Equity (Large, Mid, Small Cap)
                    • 20% International Funds
                    • 10% Fixed Income
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          iconName="ChevronLeft"
          iconPosition="left"
        >
          Previous
        </Button>

        {currentStep < 2 ? (
          <Button
            variant="default"
            onClick={() => onStepChange(currentStep + 1)}
            iconName="ChevronRight"
            iconPosition="right"
          >
            Next
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={handleNext}
            iconName="Calculator"
            iconPosition="left"
            className="bg-gradient-cultural"
          >
            Calculate Plan
          </Button>
        )}
      </div>
    </div>
  );
};

export default RetirementGoalWizard;