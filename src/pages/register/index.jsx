import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: '',
    occupation: '',
    annualIncome: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [step, setStep] = useState(1); // Multi-step form
  const [demoMode, setDemoMode] = useState(false); // Track if using demo signup

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/ai-advisor-chat-interface');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear errors when user starts typing
    if (localError) setLocalError('');
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      setLocalError('Full name is required');
      return false;
    }
    
    if (!formData.email) {
      setLocalError('Email is required');
      return false;
    }
    
    if (!formData.email.includes('@')) {
      setLocalError('Please enter a valid email address');
      return false;
    }
    
    if (!formData.password) {
      setLocalError('Password is required');
      return false;
    }
    
    if (formData.password.length < 8) {
      setLocalError('Password must be at least 8 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (!formData.phoneNumber) {
      setLocalError('Phone number is required');
      return false;
    }
    
    if (!formData.dateOfBirth) {
      setLocalError('Date of birth is required');
      return false;
    }
    
    if (!formData.occupation) {
      setLocalError('Occupation is required');
      return false;
    }
    
    if (!formData.annualIncome) {
      setLocalError('Annual income is required');
      return false;
    }
    
    if (!formData.agreeToTerms) {
      setLocalError('You must agree to the terms and conditions');
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      handleNextStep();
      return;
    }
    
    if (!validateStep2()) return;
    
    try {
      const userData = {
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phoneNumber,
        date_of_birth: formData.dateOfBirth,
        occupation: formData.occupation,
        annual_income: parseInt(formData.annualIncome)
      };
      
      const result = await register(userData);
      
      if (!result.success) {
        setLocalError(result.error?.message || 'Registration failed. Please try again.');
      }
      // Navigation will be handled by the useEffect hook after successful registration
    } catch (err) {
      console.error('Registration error:', err);
      setLocalError(err.message || 'Registration failed. Please check your network connection.');
    }
  };
  
  const handleDemoSignup = async () => {
    // Clear any previous errors
    setLocalError('');
    setDemoMode(true);
    
    // Set demo user data
    const demoData = {
      fullName: 'Demo User',
      email: 'demo.user@finvoice.ai',
      password: 'Demo@123',
      confirmPassword: 'Demo@123',
      phoneNumber: '+91 9876543210',
      dateOfBirth: '1990-01-01',
      occupation: 'Business Analyst',
      annualIncome: '1200000',
      agreeToTerms: true
    };
    
    // Update form state
    setFormData(demoData);
    
    // Prepare user data for registration
    const userData = {
      full_name: demoData.fullName,
      email: demoData.email,
      password: demoData.password,
      phone_number: demoData.phoneNumber,
      date_of_birth: demoData.dateOfBirth,
      occupation: demoData.occupation,
      annual_income: parseInt(demoData.annualIncome)
    };
    
    try {
      // Register the demo user directly
      const result = await register(userData);
      
      if (!result.success) {
        setLocalError(result.error?.message || 'Demo registration failed. Please try again.');
        setStep(2); // Keep on step 2 to show errors
      }
      // Successful registration will navigate via useEffect
    } catch (err) {
      console.error('Demo signup error:', err);
      setLocalError('Demo signup failed. Please check your network connection.');
      setStep(2); // Keep on step 2 to show errors
    }
  };

  const displayError = localError || error;

  const occupationOptions = [
    'Software Engineer',
    'Business Analyst',
    'Product Manager',
    'Sales Executive',
    'Marketing Manager',
    'Consultant',
    'Doctor',
    'Lawyer',
    'Teacher',
    'Government Employee',
    'Entrepreneur',
    'Student',
    'Retired',
    'Other'
  ];

  const incomeRanges = [
    { value: '300000', label: 'Up to ₹3 LPA' },
    { value: '500000', label: '₹3-5 LPA' },
    { value: '800000', label: '₹5-8 LPA' },
    { value: '1200000', label: '₹8-12 LPA' },
    { value: '1800000', label: '₹12-18 LPA' },
    { value: '2500000', label: '₹18-25 LPA' },
    { value: '3500000', label: '₹25-35 LPA' },
    { value: '5000000', label: '₹35+ LPA' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-lg shadow-lg border p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="UserPlus" size={24} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
              <p className="text-muted-foreground mt-2">
                Join FinVoice and start your financial journey
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Step {step} of 2</span>
                <span className="text-sm text-muted-foreground">{step === 1 ? 'Account Info' : 'Personal Details'}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 2) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Error Display */}
            {displayError && (
              <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center">
                  <Icon name="AlertCircle" size={16} className="text-destructive mr-2" />
                  <p className="text-sm text-destructive">{displayError}</p>
                </div>
              </div>
            )}
            
            {/* Demo Signup Banner */}
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Icon name="Info" size={16} className="text-green-600 mr-2" />
                  <p className="text-sm text-green-700">Quick demo account signup</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDemoSignup}
                  disabled={loading}
                  className="border-green-300 text-green-700 hover:bg-green-100"
                >
                  Demo Signup
                </Button>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 ? (
                // Step 1: Account Information
                <>
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      disabled={loading}
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      disabled={loading}
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a strong password"
                        disabled={loading}
                        className="w-full pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                      >
                        <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum 8 characters with letters and numbers
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        disabled={loading}
                        className="w-full pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                      >
                        <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={16} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // Step 2: Personal Information
                <>
                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground mb-2">
                      Phone Number *
                    </label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                      disabled={loading}
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-foreground mb-2">
                      Date of Birth *
                    </label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Occupation */}
                  <div>
                    <label htmlFor="occupation" className="block text-sm font-medium text-foreground mb-2">
                      Occupation *
                    </label>
                    <select
                      id="occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    >
                      <option value="">Select your occupation</option>
                      {occupationOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  {/* Annual Income */}
                  <div>
                    <label htmlFor="annualIncome" className="block text-sm font-medium text-foreground mb-2">
                      Annual Income *
                    </label>
                    <select
                      id="annualIncome"
                      name="annualIncome"
                      value={formData.annualIncome}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    >
                      <option value="">Select your income range</option>
                      {incomeRanges.map(range => (
                        <option key={range.value} value={range.value}>{range.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
                      required
                    />
                    <label htmlFor="agreeToTerms" className="ml-3 text-sm text-foreground">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={loading}
                    className="flex-1"
                  >
                    Previous
                  </Button>
                )}
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                      {step === 1 ? 'Processing...' : demoMode ? 'Creating Demo Account...' : 'Creating Account...'}
                    </div>
                  ) : (
                    step === 1 ? 'Next Step' : demoMode ? 'Complete Demo Signup' : 'Create Account'
                  )}
                </Button>
              </div>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center text-xs text-muted-foreground">
              <Icon name="Shield" size={14} className="mr-1" />
              Your data is protected with bank-level security
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
