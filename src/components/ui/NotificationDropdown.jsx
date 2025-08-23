import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { notificationAPI } from '../../services/profileNotificationAPI';

const NotificationDropdown = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const dropdownRef = useRef(null);

  // Professional notification system with better data structure
  const mockNotifications = [
    {
      id: 1,
      title: 'Portfolio Performance Alert',
      message: 'Your investment portfolio has gained ₹12,450 (+2.3%) today. Review your holdings for optimization opportunities.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      type: 'success',
      category: 'investment',
      priority: 'high',
      isRead: false,
      actionable: true,
      link: '/portfolio-intelligence-center',
      metadata: { amount: '+₹12,450', percentage: '+2.3%' }
    },
    {
      id: 2,
      title: 'Payment Confirmation',
      message: 'Payment of ₹24,500 received from Acme Corp. Transaction ID: TXN123456789',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: 'success',
      category: 'transaction',
      priority: 'medium',
      isRead: false,
      actionable: true,
      link: '/transactions',
      metadata: { amount: '₹24,500', source: 'Acme Corp' }
    },
    {
      id: 3,
      title: 'Tax Compliance Alert',
      message: 'Quarterly tax filing deadline approaching in 5 days. Estimated liability: ₹45,000',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      type: 'warning',
      category: 'compliance',
      priority: 'high',
      isRead: false,
      actionable: true,
      link: '/expenses',
      metadata: { deadline: '5 days', amount: '₹45,000' }
    },
    {
      id: 4,
      title: 'AI Financial Insights',
      message: 'New spending pattern detected. Consider reducing dining expenses by 15% to optimize your budget.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      type: 'info',
      category: 'insight',
      priority: 'medium',
      isRead: true,
      actionable: true,
      link: '/ai-advisor-chat-interface'
    },
    {
      id: 5,
      title: 'Goal Milestone Achieved',
      message: 'Congratulations! You have reached 75% of your retirement savings goal. Keep up the excellent progress!',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'success',
      category: 'goal',
      priority: 'medium',
      isRead: true,
      actionable: false,
      link: '/retirement-planning-lab'
    },
    {
      id: 6,
      title: 'Security Alert',
      message: 'New device login detected from Mumbai, India. If this was not you, please secure your account immediately.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'error',
      category: 'security',
      priority: 'critical',
      isRead: false,
      actionable: true,
      link: '/security-trust-center'
    }
  ];

  useEffect(() => {
    // Fetch notifications from API
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // Try to fetch from API first
        try {
          const response = await notificationAPI.getNotifications({ 
            filter, 
            limit: 50 
          });
          setNotifications(response.notifications || response.data || []);
        } catch (apiError) {
          console.warn('API fetch failed, using mock data:', apiError);
          // Fallback to mock data
          await new Promise(resolve => setTimeout(resolve, 800));
          setNotifications(mockNotifications);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        // Use mock data as fallback
        setNotifications(mockNotifications);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    
    // Set up real-time subscription if available
    let ws = null;
    try {
      ws = notificationAPI.subscribeToNotifications((newNotification) => {
        setNotifications(prev => [newNotification, ...prev]);
      });
    } catch (error) {
      console.warn('Real-time notifications not available:', error);
    }
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [filter]);

  const getTypeIcon = (type) => {
    const iconMap = {
      success: { name: 'CheckCircle', color: 'text-green-500' },
      warning: { name: 'AlertTriangle', color: 'text-orange-500' },
      error: { name: 'AlertCircle', color: 'text-red-500' },
      info: { name: 'Info', color: 'text-blue-500' }
    };
    return iconMap[type] || iconMap.info;
  };

  const getCategoryIcon = (category) => {
    const categoryMap = {
      investment: 'TrendingUp',
      transaction: 'Receipt',
      compliance: 'FileText',
      insight: 'Brain',
      goal: 'Target',
      security: 'Shield'
    };
    return categoryMap[category] || 'Bell';
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      critical: 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20',
      high: 'border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20',
      medium: 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20',
      low: 'border-l-gray-500 bg-gray-50/50 dark:bg-gray-950/20'
    };
    return colorMap[priority] || colorMap.medium;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return time.toLocaleDateString();
  };

  const markAsRead = async (notificationId) => {
    try {
      // Try API call first
      try {
        await notificationAPI.markAsRead(notificationId);
      } catch (apiError) {
        console.warn('API mark as read failed, updating locally:', apiError);
      }
      
      // Update local state regardless
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Try API call first
      try {
        await notificationAPI.markAllAsRead();
      } catch (apiError) {
        console.warn('API mark all as read failed, updating locally:', apiError);
      }
      
      // Update local state regardless
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // Try API call first
      try {
        await notificationAPI.deleteNotification(notificationId);
      } catch (apiError) {
        console.warn('API delete failed, updating locally:', apiError);
      }
      
      // Update local state regardless
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-card rounded-xl shadow-xl border border-border z-50 animate-fade-in">
        <div className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-card rounded-xl shadow-xl border border-border z-50 animate-fade-in max-h-[70vh] flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex space-x-1">
          {['all', 'unread', 'read'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === filterType
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              {filterType === 'unread' && unreadCount > 0 && (
                <span className="ml-1 text-xs">({unreadCount})</span>
              )}
            </button>
          ))}
        </div>
        
        {/* Actions */}
        {unreadCount > 0 && (
          <div className="mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all as read
            </Button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="BellOff" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredNotifications.map((notification) => {
              const typeIcon = getTypeIcon(notification.type);
              const priorityColor = getPriorityColor(notification.priority);
              
              return (
                <div
                  key={notification.id}
                  className={`group relative mb-2 border-l-4 rounded-r-lg transition-all duration-200 hover:shadow-md ${priorityColor} ${
                    !notification.isRead ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start space-x-3">
                      {/* Category Icon */}
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Icon 
                            name={getCategoryIcon(notification.category)} 
                            size={16} 
                            className="text-muted-foreground"
                          />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-foreground text-sm">
                              {notification.title}
                            </h4>
                            <Icon 
                              name={typeIcon.name} 
                              size={14} 
                              className={typeIcon.color}
                            />
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.isRead && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  markAsRead(notification.id);
                                }}
                                className="p-1 rounded hover:bg-muted"
                                title="Mark as read"
                              >
                                <Icon name="Check" size={12} className="text-muted-foreground" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                deleteNotification(notification.id);
                              }}
                              className="p-1 rounded hover:bg-destructive/10"
                              title="Delete"
                            >
                              <Icon name="Trash2" size={12} className="text-destructive" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        {/* Metadata */}
                        {notification.metadata && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {Object.entries(notification.metadata).map(([key, value]) => (
                              <span 
                                key={key}
                                className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded"
                              >
                                {value}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          
                          {notification.actionable && notification.link && (
                            <Link
                              to={notification.link}
                              onClick={() => {
                                if (!notification.isRead) {
                                  markAsRead(notification.id);
                                }
                                onClose?.();
                              }}
                              className="text-xs text-primary hover:text-primary/80 font-medium"
                            >
                              View Details →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Link
          to="/notifications"
          onClick={onClose}
          className="block w-full text-center text-sm text-primary hover:text-primary/80 font-medium py-2"
        >
          View All Notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
