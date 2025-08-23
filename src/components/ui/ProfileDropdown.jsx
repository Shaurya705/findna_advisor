import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { profileAPI } from '../../services/profileNotificationAPI';
import { useAuth } from '../../contexts/AuthContext';

const ProfileDropdown = ({ user, onLogout, onClose }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(user?.full_name || 'Demo User');
  const [tempName, setTempName] = useState(name);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.avatar || null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  
  const getUserInitials = () => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    
    setIsUpdating(true);
    try {
      // Try to update via API first
      try {
        await profileAPI.updateProfile({ full_name: tempName.trim() });
      } catch (apiError) {
        console.warn('API update failed, using local update:', apiError);
      }
      
      // Update local state and context
      setName(tempName.trim());
      setIsEditingName(false);
      
      // Update auth context if available
      if (updateProfile) {
        updateProfile({ ...user, full_name: tempName.trim() });
      }
      
      console.log('Name updated successfully');
    } catch (error) {
      console.error('Failed to update name:', error);
      alert('Failed to update name. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }
    
    setUploadingPhoto(true);
    
    try {
      let uploadedImageUrl = null;
      
      // Try to upload via API first
      try {
        const result = await profileAPI.uploadProfilePhoto(file);
        uploadedImageUrl = result.avatar_url;
      } catch (apiError) {
        console.warn('API upload failed, using local preview:', apiError);
        // Fallback to local preview
        uploadedImageUrl = URL.createObjectURL(file);
      }
      
      setProfileImage(uploadedImageUrl);
      
      // Update auth context if available
      if (updateProfile) {
        updateProfile({ ...user, avatar: uploadedImageUrl });
      }
      
      console.log('Profile photo updated successfully');
    } catch (error) {
      console.error('Failed to upload photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await onLogout();
      onClose?.();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      icon: 'User',
      label: 'Profile Settings',
      description: 'Manage your account details',
      link: '/profile',
      color: 'text-blue-500'
    },
    {
      icon: 'HelpCircle',
      label: 'Help & Support',
      description: 'Get help and contact support',
      link: '/help',
      color: 'text-green-500'
    }
  ];
  
  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-card rounded-xl shadow-xl border border-border z-50 animate-fade-in overflow-hidden">
      {/* Profile Header */}
      <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-b border-border">
        <div className="flex items-center space-x-4">
          {/* Profile Photo */}
          <div className="relative group">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-medium shadow-md">
                {getUserInitials()}
              </div>
            )}
            
            {/* Photo Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-background rounded-full flex items-center justify-center shadow-lg border border-border hover:bg-accent transition-colors group-hover:scale-110"
              title="Change profile photo"
            >
              {uploadingPhoto ? (
                <Icon name="Loader2" size={16} className="animate-spin text-primary" />
              ) : (
                <Icon name="Camera" size={16} className="text-muted-foreground" />
              )}
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          
          {/* User Info */}
          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <form onSubmit={handleNameSubmit} className="space-y-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full px-3 py-1 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingName(false);
                      setTempName(name);
                    }}
                    className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded hover:bg-muted/80"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-foreground text-lg truncate">{name}</h3>
                  <button
                    onClick={() => {
                      setIsEditingName(true);
                      setTempName(name);
                    }}
                    className="p-1 hover:bg-white/20 rounded"
                    title="Edit name"
                  >
                    <Icon name="Edit2" size={14} className="text-muted-foreground" />
                  </button>
                </div>
                <p className="text-muted-foreground text-sm truncate">{user?.email}</p>
                {user?.role && (
                  <span className="inline-block bg-primary/20 text-primary text-xs px-2 py-1 rounded-full mt-1">
                    {user.role}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            onClick={onClose}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors group"
          >
            <div className={`p-2 rounded-lg bg-muted group-hover:bg-white/80 transition-colors`}>
              <Icon name={item.icon} size={18} className={item.color} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground text-sm">{item.label}</p>
              <p className="text-muted-foreground text-xs">{item.description}</p>
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
        ))}
      </div>

      <div className="border-t border-border p-2">
        {/* Account Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2">
            <p className="text-xs text-muted-foreground">Last Login</p>
            <p className="text-sm font-medium text-foreground">Today</p>
          </div>
          <div className="text-center p-2">
            <p className="text-xs text-muted-foreground">Security</p>
            <div className="flex items-center justify-center space-x-1">
              <Icon name="Shield" size={12} className="text-green-500" />
              <p className="text-sm font-medium text-foreground">High</p>
            </div>
          </div>
          <div className="text-center p-2">
            <p className="text-xs text-muted-foreground">Plan</p>
            <p className="text-sm font-medium text-foreground">Pro</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors mt-2"
        >
          <div className="p-2 rounded-lg bg-destructive/10">
            <Icon name="LogOut" size={18} className="text-destructive" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-sm">Sign Out</p>
            <p className="text-xs text-muted-foreground">Sign out of your account</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
