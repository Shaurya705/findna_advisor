import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { ThemeContext } from '../../App';
import { useAuth } from '../../contexts/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';

const Header = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggle } = useContext(ThemeContext);
  const { user, isAuthenticated, logout } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', path: '/unified-financial-dashboard', icon: 'LayoutDashboard' },
    { name: 'AI Advisor', path: '/ai-advisor-chat-interface', icon: 'Bot' },
    { name: 'Portfolio', path: '/portfolio-intelligence-center', icon: 'TrendingUp' },
    { name: 'Retirement', path: '/retirement-planning-lab', icon: 'PiggyBank' },
    { name: 'Invoices', path: '/invoices', icon: 'FileText' },
    { name: 'Transactions', path: '/transactions', icon: 'Receipt' },
    { name: 'Expenses', path: '/expenses', icon: 'Wallet' },
  ];

  const moreItems = [
    { name: 'Security Center', path: '/security-trust-center', icon: 'Shield' },
    { name: 'Analytics & Reports', path: '/analytics-reports', icon: 'BarChart3' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && profileRef.current && !profileRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      
      if (showNotifications && notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu, showNotifications]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    if (showNotifications) setShowNotifications(false);
  };
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showUserMenu) setShowUserMenu(false);
  };

  const getUserInitials = () => {
    if (!user?.full_name) return 'U';
    return user.full_name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-background/95 backdrop-blur-md shadow-md border-b border-border' 
          : 'bg-white dark:bg-background border-b border-border'
      } ${className}`}
    >
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            onClick={closeMobileMenu}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-cultural rounded-lg flex items-center justify-center shadow-md ring-1 ring-white/20 dark:ring-white/30">
                <Icon name="Dna" size={24} color="white" strokeWidth={2.5} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-prosperity rounded-full flex items-center justify-center">
                <Icon name="Sparkles" size={10} color="white" strokeWidth={3} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gradient dark:text-white">FinDNA</span>
              <span className="text-xs text-text-secondary dark:text-text-secondary/80 -mt-1">Advisor</span>
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
                    ? 'bg-primary/10 text-primary border border-primary/20 dark:border-primary/30 dark:bg-primary/20' :'text-text-secondary hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.name}</span>
              </Link>
            ))}
            
            {/* More Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200">
                <Icon name="MoreHorizontal" size={18} />
                <span>More</span>
                <Icon name="ChevronDown" size={14} />
              </button>
              
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-surface rounded-lg shadow-lg dark:shadow-slate-900/60 border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {moreItems?.map((item) => (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      className={`flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
                        isActivePath(item?.path)
                          ? 'text-primary bg-primary/5 dark:bg-primary/10' :'text-text-secondary hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10'
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
              iconName={theme === 'dark' ? 'Sun' : 'Moon'}
              iconSize={18}
              onClick={toggle}
              title="Toggle theme"
            />
            
            {isAuthenticated && (
              <div className="relative" ref={notificationRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Bell"
                  iconSize={18}
                  className="relative"
                  onClick={toggleNotifications}
                >
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-growth rounded-full"></span>
                </Button>
                
                {showNotifications && <NotificationDropdown />}
              </div>
            )}
            
            {isAuthenticated ? (
              // Authenticated User Menu
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary dark:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {getUserInitials()}
                  </div>
                  <span className="text-sm font-medium text-foreground max-w-24 truncate">
                    {user?.full_name || 'User'}
                  </span>
                  <Icon name="ChevronDown" size={14} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showUserMenu && <ProfileDropdown user={user} onClose={() => setShowUserMenu(false)} onLogout={handleLogout} />}
              </div>
            ) : (
              // Non-authenticated Actions
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate('/register')}
                  iconName="Sparkles"
                  iconPosition="left"
                  iconSize={16}
                  className="bg-gradient-cultural hover:opacity-90 dark:ring-1 dark:ring-white/20"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-surface border-t border-border dark:border-border/50 animate-slide-up max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-4 space-y-2">
              {isAuthenticated && (
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border dark:border-border/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary dark:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {getUserInitials()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user?.full_name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Bell"
                    iconSize={18}
                    className="relative"
                    onClick={toggleNotifications}
                  >
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-growth rounded-full"></span>
                  </Button>
                </div>
              )}
              
              {[...navigationItems, ...moreItems]?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePath(item?.path)
                      ? 'bg-primary/10 text-primary border border-primary/20 dark:border-primary/30 dark:bg-primary/20' :'text-text-secondary hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span>{item?.name}</span>
                </Link>
              ))}
              
              <div className="pt-4 mt-4 border-t border-border dark:border-border/50">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-4 py-2">
                      <div className="w-10 h-10 bg-primary dark:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {getUserInitials()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{user?.full_name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={closeMobileMenu}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-foreground hover:bg-accent dark:hover:bg-primary/10 transition-colors rounded-lg mx-2"
                    >
                      <Icon name="User" size={18} />
                      <span>Profile</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMobileMenu();
                      }}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-colors rounded-lg mx-2 w-full text-left"
                    >
                      <Icon name="LogOut" size={18} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigate('/login');
                        closeMobileMenu();
                      }}
                      fullWidth
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        navigate('/register');
                        closeMobileMenu();
                      }}
                      iconName="Sparkles"
                      iconPosition="left"
                      iconSize={16}
                      fullWidth
                      className="bg-gradient-cultural hover:opacity-90 dark:ring-1 dark:ring-white/20"
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;