import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', path: '/unified-financial-dashboard', icon: 'LayoutDashboard' },
    { name: 'AI Advisor', path: '/ai-advisor-chat-interface', icon: 'Bot' },
    { name: 'Portfolio', path: '/portfolio-intelligence-center', icon: 'TrendingUp' },
    { name: 'Retirement', path: '/retirement-planning-lab', icon: 'PiggyBank' },
  ];

  const moreItems = [
    { name: 'Security Center', path: '/security-trust-center', icon: 'Shield' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-border' 
          : 'bg-white border-b border-border'
      } ${className}`}
    >
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link 
            to="/homepage-ai-financial-advisory-platform" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            onClick={closeMobileMenu}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-cultural rounded-lg flex items-center justify-center shadow-md">
                <Icon name="Dna" size={24} color="white" strokeWidth={2.5} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-prosperity rounded-full flex items-center justify-center">
                <Icon name="Sparkles" size={10} color="white" strokeWidth={3} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gradient">FinDNA</span>
              <span className="text-xs text-text-secondary -mt-1">Advisor</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActivePath(item?.path)
                    ? 'bg-primary/10 text-primary border border-primary/20' :'text-text-secondary hover:text-primary hover:bg-primary/5'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.name}</span>
              </Link>
            ))}
            
            {/* More Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-primary hover:bg-primary/5 transition-all duration-200">
                <Icon name="MoreHorizontal" size={18} />
                <span>More</span>
                <Icon name="ChevronDown" size={14} />
              </button>
              
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {moreItems?.map((item) => (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      className={`flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
                        isActivePath(item?.path)
                          ? 'text-primary bg-primary/5' :'text-text-secondary hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              iconName="Bell"
              iconSize={18}
              className="relative"
            >
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-growth rounded-full"></span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              iconName="User"
              iconSize={18}
            />
            
            <Button
              variant="default"
              size="sm"
              iconName="Sparkles"
              iconPosition="left"
              iconSize={16}
              className="bg-gradient-cultural hover:opacity-90"
            >
              Upgrade
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-border animate-slide-up">
            <div className="px-4 py-4 space-y-2">
              {[...navigationItems, ...moreItems]?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePath(item?.path)
                      ? 'bg-primary/10 text-primary border border-primary/20' :'text-text-secondary hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span>{item?.name}</span>
                </Link>
              ))}
              
              <div className="pt-4 mt-4 border-t border-border">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Bell"
                    iconSize={18}
                    className="relative flex-1"
                  >
                    Notifications
                    <span className="absolute top-2 right-2 w-2 h-2 bg-growth rounded-full"></span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="User"
                    iconSize={18}
                    className="flex-1"
                  >
                    Profile
                  </Button>
                </div>
                
                <Button
                  variant="default"
                  size="sm"
                  iconName="Sparkles"
                  iconPosition="left"
                  iconSize={16}
                  fullWidth
                  className="mt-3 bg-gradient-cultural hover:opacity-90"
                >
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;