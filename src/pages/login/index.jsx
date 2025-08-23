import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/ai-advisor-chat-interface');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (localError) setLocalError('');
  };

  const validateForm = () => {
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
    
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setLocalError(result.error?.message || 'Login failed. Please try again.');
      }
      // Navigation will be handled by the useEffect hook after successful login
    } catch (err) {
      console.error('Login error:', err);
      setLocalError(err.message || 'Login failed. Please check your network connection.');
    }
  };

  const handleDemoLogin = async () => {
    // Set the form fields for UI display
    setFormData({
      email: 'demo@finvoice.ai',
      password: 'demo123'
    });
    
    try {
      // Clear any previous errors
      setLocalError('');
      
      // Direct login with demo credentials
      const result = await login('demo@finvoice.ai', 'demo123');
      
      if (!result.success) {
        setLocalError('Demo login failed. Please try again later.');
      }
      
      // Navigation will be handled by the useEffect hook after successful login
    } catch (err) {
      console.error('Demo login error:', err);
      setLocalError('Demo login failed. Please try manual login or check your network connection.');
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-lg shadow-lg border p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="User" size={24} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
              <p className="text-muted-foreground mt-2">
                Sign in to your FinVoice account
              </p>
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

            {/* Demo Login Banner */}
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Icon name="Info" size={16} className="text-blue-600 mr-2" />
                  <p className="text-sm text-blue-700">Try our demo account</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  Demo Login
                </Button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
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

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
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
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-muted-foreground">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Social Login Options */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => console.log('Google login')}
                disabled={loading}
                className="w-full"
              >
                <Icon name="Chrome" size={16} className="mr-2" />
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => console.log('Microsoft login')}
                disabled={loading}
                className="w-full"
              >
                <Icon name="Users" size={16} className="mr-2" />
                Microsoft
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
