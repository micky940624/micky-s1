import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, EyeOff, ArrowLeft, RefreshCw } from 'lucide-react';
import { sendOTP, verifyOTP, getOTPStatus, resendOTP } from '../utils/smsApi';
import { useUser } from '../context/UserContext';
import { storage } from '../utils/localStorage';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    gstNumber: '',
    upiId: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpStatus, setOtpStatus] = useState<{ exists: boolean; expiresIn?: number; attemptsLeft?: number }>({ exists: false });
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.businessName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    // Check if user already exists
    const users = storage.getUsersList();
    const existingUser = users.find((user: any) => user.email === formData.email);
    
    if (existingUser) {
      alert('User with this email already exists. Please sign in instead.');
      navigate('/signin');
      return;
    }
    
    setLoading(true);
    try {
      const result = await sendOTP(formData.phone);
      if (result.success) {
        setShowOTPVerification(true);
        
        // Update OTP status
        const status = getOTPStatus(formData.phone);
        setOtpStatus(status);
        
        // Show success message with development OTP if available
        let message = `OTP sent to ${formData.phone}. Please check your phone.`;
        if (result.devOTP) {
          message += `\n\nDevelopment OTP: ${result.devOTP}`;
        }
        alert(message);
        
        // Start resend countdown
        startResendCountdown();
      } else {
        alert(result.message || 'Failed to send OTP. Please check your internet connection and try again.');
      }
    } catch (error) {
      alert('Error sending OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPCode = () => {
    if (!formData.phone) {
      alert('Phone number not found');
      return;
    }

    if (!otp.trim()) {
      alert('Please enter the OTP');
      return;
    }

    const result = verifyOTP(formData.phone, otp.trim());
    
    if (result.success) {
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        businessName: formData.businessName,
        email: formData.email,
        phone: formData.phone,
        gstNumber: formData.gstNumber,
        businessAddress: '',
        upiId: formData.upiId,
        isLoggedIn: true,
        subscription: {
          type: 'trial' as const,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true
        },
        trialDaysLeft: 7,
        isSpecialAccount: false
      };
      
      // Save user to localStorage
      const users = storage.getUsersList();
      users.push(newUser);
      storage.saveUsersList(users);
      
      // Login user
      login(newUser);
      navigate('/dashboard');
    } else {
      alert(result.message);
      
      // Update OTP status after failed attempt
      const status = getOTPStatus(formData.phone);
      setOtpStatus(status);
      
      // Clear OTP input
      setOtp('');
    }
  };

  const handleResendOTP = async () => {
    if (!formData.phone || resendDisabled) return;
    
    setResendDisabled(true);
    setLoading(true);
    
    try {
      const result = await resendOTP(formData.phone);
      if (result.success) {
        alert('New OTP sent successfully. Please check your phone.');
        
        // Update OTP status
        const status = getOTPStatus(formData.phone);
        setOtpStatus(status);
        
        // Start resend countdown
        startResendCountdown();
      } else {
        alert(result.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      alert('Error resending OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startResendCountdown = () => {
    setResendCountdown(60); // 60 seconds
    setResendDisabled(true);
    
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    setOtp(value);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">InvenEase</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join thousands of businesses using InvenEase</p>
          </div>

          {showOTPVerification ? (
            <div className="space-y-6">
              <div className="text-center">
                <button
                  onClick={() => setShowOTPVerification(false)}
                  className="flex items-center justify-center mx-auto mb-4 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign Up
                </button>
                
                <h2 className="text-xl font-bold text-gray-900 mb-2">Verify Phone Number</h2>
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
                  value={otp}
                  onChange={handleOTPChange}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                />
              </div>
              
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={verifyOTPCode}
                  disabled={loading || !otp.trim()}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify OTP & Create Account'}
                </button>
                
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendDisabled || loading}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {resendDisabled ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Resend in {resendCountdown}s
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Resend OTP
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your business name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (For OTP Verification)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  GST Number (Optional)
                </label>
                <input
                  type="text"
                  id="gstNumber"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter GST number (optional)"
                />
              </div>
              
              <div>
                <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID (Optional)
                </label>
                <input
                  type="text"
                  id="upiId"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter UPI ID (optional)"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending OTP...' : 'Create Account'}
              </button>
              
              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <ShoppingCart className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Start Your Business Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-md">
              Join thousands of businesses that trust InvenEase for their POS and inventory management needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;