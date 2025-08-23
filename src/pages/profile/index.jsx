import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    avatar: user?.avatar || null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        avatar: file
      });
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you would typically call an API to update the profile
    // For now, we'll just simulate the update
    console.log('Updating profile with:', formData);
    
    // Update the user context (this would typically be done after a successful API call)
    if (typeof updateProfile === 'function') {
      updateProfile({
        ...user,
        full_name: formData.full_name,
        // Other fields would be updated as well
      });
    }
    
    setIsEditing(false);
  };

  const getUserInitials = () => {
    if (!formData.full_name) return 'U';
    return formData.full_name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <div className="bg-card rounded-xl shadow-md p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          {!isEditing ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
              iconName="Edit"
              iconPosition="left"
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    full_name: user?.full_name || '',
                    email: user?.email || '',
                    avatar: user?.avatar || null
                  });
                  setPreviewUrl(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleSubmit}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {previewUrl || user?.avatarUrl ? (
                <img 
                  src={previewUrl || user?.avatarUrl} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                />
              ) : (
                <div className="w-32 h-32 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-4xl font-bold">
                  {getUserInitials()}
                </div>
              )}
              
              {isEditing && (
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer shadow-md">
                  <Icon name="Camera" size={18} />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold">{user?.full_name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              {user?.role && <p className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full mt-2">{user.role}</p>}
            </div>
          </div>
          
          <div className="flex-1">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                {isEditing ? (
                  <Input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="py-2 px-3 bg-muted rounded-lg">{formData.full_name || 'Not provided'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                {isEditing ? (
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    disabled
                  />
                ) : (
                  <p className="py-2 px-3 bg-muted rounded-lg">{formData.email || 'Not provided'}</p>
                )}
                {isEditing && <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>}
              </div>
              
              {/* Additional profile fields could be added here */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
