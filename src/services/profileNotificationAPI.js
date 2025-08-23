// Notification API service for backend integration
export const notificationAPI = {
  // Fetch notifications with filtering
  async getNotifications(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 20,
        filter: params.filter || 'all', // all, unread, read
        category: params.category || '', // investment, transaction, compliance, etc.
        priority: params.priority || '', // critical, high, medium, low
      }).toString();

      const response = await fetch(`/api/notifications?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw error;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  },

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  },

  // Get unread count
  async getUnreadCount() {
    try {
      const response = await fetch('/api/notifications/unread-count', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get unread count:', error);
      throw error;
    }
  },

  // Update notification preferences
  async updatePreferences(preferences) {
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      throw error;
    }
  },

  // Subscribe to real-time notifications (WebSocket)
  subscribeToNotifications(callback) {
    try {
      const token = localStorage.getItem('authToken');
      const ws = new WebSocket(`ws://localhost:8000/ws/notifications?token=${token}`);
      
      ws.onopen = () => {
        console.log('Connected to notification service');
      };
      
      ws.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data);
          callback(notification);
        } catch (error) {
          console.error('Failed to parse notification:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      ws.onclose = () => {
        console.log('Disconnected from notification service');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          this.subscribeToNotifications(callback);
        }, 5000);
      };
      
      return ws;
    } catch (error) {
      console.error('Failed to connect to notification service:', error);
      throw error;
    }
  },
};

// Profile API service for backend integration
export const profileAPI = {
  // Get user profile
  async getProfile() {
    try {
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },

  // Upload profile photo
  async uploadProfilePhoto(file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to upload profile photo:', error);
      throw error;
    }
  },

  // Delete profile photo
  async deleteProfilePhoto() {
    try {
      const response = await fetch('/api/profile/avatar', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to delete profile photo:', error);
      throw error;
    }
  },

  // Update password
  async updatePassword(passwordData) {
    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update password:', error);
      throw error;
    }
  },

  // Update user preferences
  async updatePreferences(preferences) {
    try {
      const response = await fetch('/api/profile/preferences', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  },

  // Get user activity log
  async getActivityLog(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 20,
        type: params.type || '', // login, profile_update, password_change, etc.
        from_date: params.from_date || '',
        to_date: params.to_date || '',
      }).toString();

      const response = await fetch(`/api/profile/activity?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch activity log:', error);
      throw error;
    }
  },
};
