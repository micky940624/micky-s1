import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { sendOTP, verifyOTP, getOTPStatus } from '../utils/smsApi';
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Shield, 
  Bell, 
  Globe, 
  Palette,
  Save,
  Edit,
  Lock,
  Smartphone,
  Trash2
} from 'lucide-react';
import ResponsiveSidebar from '../components/ResponsiveSidebar';
import SubscriptionCard from '../components/SubscriptionCard';
import { storage } from '../utils/localStorage';

const SettingsPage = () => {
  const { user, updateUser, logout } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    businessName: user?.businessName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gstNumber: user?.gstNumber || '',
    businessAddress: user?.businessAddress || '',
    upiId: user?.upiId || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [sentOTP, setSentOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpStatus, setOtpStatus] = useState({
    exists: false,
    expiresIn: undefined,
    attemptsLeft: undefined
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'business', label: 'Business', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const handleSave = () => {
    if (!user) return;
    
    const updatedUserData = { ...user, ...formData };
    
    // Update user context and localStorage
    updateUser(formData);
    
    // Also update the users list in localStorage for future logins
    const allUsers = storage.getUsersList();
    const updatedUsers = allUsers.map(u => 
      u.id === user.id ? updatedUserData : u
    );
    storage.setItem('invenease_users', updatedUsers);
    storage.saveUser(updatedUserData);
    
    setIsEditing(false);
    alert('Settings saved successfully!');
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      businessName: user?.businessName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      gstNumber: user?.gstNumber || '',
      businessAddress: user?.businessAddress || '',
      upiId: user?.upiId || ''
    });
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    
    // In a real app, you would verify the current password with the backend
    // For demo purposes, we'll just show a success message
    alert('Password changed successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleTwoFactorToggle = async () => {
    if (!twoFactorEnabled) {
      // Enable 2FA
      const phoneNumber = user?.phone;
      if (!phoneNumber) {
        alert('Please add a phone number first to enable 2FA.');
        setActiveTab('profile');
        return;
      }
      
      try {
        const result = await sendOTP(phoneNumber);
        if (result.success) {
          setShowOTPInput(true);
          alert('OTP sent successfully!');
        } else {
          alert('Failed to send verification code. Please try again.');
        }
      } catch (error) {
        alert('Error sending verification code. Please try again.');
      }
    } else {
      // Disable 2FA
      if (confirm('Are you sure you want to disable two-factor authentication?')) {
        setTwoFactorEnabled(false);
        alert('2FA disabled successfully.');
      }
    }
  };

  const handleSendOTP = async () => {
    if (!formData.phone) {
      alert('Please enter a phone number first');
      return;
    }
    
    setLoading(true);
    try {
      const result = await sendOTP(formData.phone);
      if (result.success) {
        setShowOTPInput(true);
        
        // Update OTP status
        const status = getOTPStatus(formData.phone);
        setOtpStatus(status);
        
        // Show success message with development OTP if available
        let message = 'OTP sent successfully. Please check your phone.';
        if (result.devOTP) {
          message += `\n\nDevelopment OTP: ${result.devOTP}`;
        }
        alert(message);
      } else {
        alert(result.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      alert('Error sending OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPFor2FA = () => {
    if (!formData.phone) {
      alert('Phone number not found');
      return;
    }

    if (!otpCode.trim()) {
      alert('Please enter the OTP');
      return;
    }

    const result = verifyOTP(formData.phone, otpCode.trim());
    
    if (result.success) {
      // Update user with new phone number
      updateUser({ phone: formData.phone });
      setShowOTPInput(false);
      setOtpCode('');
      setSentOTP('');
      alert('Phone number updated successfully!');
    } else {
      alert(result.message);
      
      // Update OTP status after failed attempt
      const status = getOTPStatus(formData.phone);
      setOtpStatus(status);
      
      // Clear OTP input
      setOtpCode('');
    }
  };

  const handleDeleteAccount = () => {
    const confirmation = prompt('Type "DELETE" to permanently delete your account:');
    if (confirmation === 'DELETE') {
      if (confirm('This action cannot be undone. Are you absolutely sure?')) {
        // In a real app, you would call an API to delete the account
        alert('Account deletion initiated. You will receive a confirmation email.');
        logout();
      }
    } else if (confirmation !== null) {
      alert('Account deletion cancelled. Please type "DELETE" exactly to confirm.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ResponsiveSidebar />
      
      <div className="flex-1 p-4 pt-20 lg:pt-8 lg:p-8 lg:ml-0">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account and business preferences</p>
          </div>

          <SubscriptionCard />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Tabs */}
            <div className="border-b border-gray-200 overflow-x-auto">
              <nav className="flex space-x-8 px-6 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'profile' && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <div className="flex space-x-3">
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        value={formData.upiId}
                        onChange={(e) => setFormData({...formData, upiId: e.target.value})}
                        disabled={!isEditing}
                        placeholder="your-upi@paytm"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'business' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GST Number
                      </label>
                      <input
                        type="text"
                        value={formData.gstNumber}
                        onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                        disabled={!isEditing}
                        placeholder="27AABCU9603R1ZX"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Address
                      </label>
                      <textarea
                        value={formData.businessAddress}
                        onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Low Stock Alerts</h3>
                        <p className="text-sm text-gray-600">Get notified when products are running low</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Sales Notifications</h3>
                        <p className="text-sm text-gray-600">Get notified about daily sales summary</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive important updates via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Change Password */}
                    <div className="p-6 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Lock className="w-5 h-5 mr-2" />
                        Change Password
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">Update your password to keep your account secure</p>
                      
                      <div className="space-y-4">
                        <div>
                          <input
                            type="password"
                            placeholder="Current Password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <input
                            type="password"
                            placeholder="New Password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <button 
                          onClick={handlePasswordChange}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="p-6 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Smartphone className="w-5 h-5 mr-2" />
                        Two-Factor Authentication
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Add an extra layer of security to your account using SMS verification
                      </p>
                      
                      {showOTPInput ? (
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Phone Number</h3>
                            <p className="text-gray-600 mb-4">Enter the 6-digit code sent to {formData.phone}</p>
                            
                            {otpStatus.exists && (
                              <div className="text-sm text-gray-500">
                                {otpStatus.expiresIn && (
                                  <p>Expires in {otpStatus.expiresIn} minute(s)</p>
                                )}
                                {otpStatus.attemptsLeft !== undefined && (
                                  <p>{otpStatus.attemptsLeft} attempt(s) remaining</p>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <input
                              type="text"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                              placeholder="Enter 6-digit OTP"
                              maxLength={6}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                            />
                          </div>
                          
                          <div className="flex space-x-3">
                            <button
                              type="button"
                              onClick={() => {
                                setShowOTPInput(false);
                                setOtpCode('');
                                setSentOTP('');
                              }}
                              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={verifyOTPFor2FA}
                              disabled={!otpCode.trim()}
                              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Verify OTP
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOTP}
                          disabled={loading || !formData.phone}
                          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                      )}
                    </div>

                    {/* Delete Account */}
                    <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                      <h3 className="font-medium text-red-900 mb-2 flex items-center">
                        <Trash2 className="w-5 h-5 mr-2" />
                        Delete Account
                      </h3>
                      <p className="text-sm text-red-700 mb-4">
                        Permanently delete your account and all data. This action cannot be undone.
                      </p>
                      <button 
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;