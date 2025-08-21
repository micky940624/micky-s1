import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, EyeOff, ArrowLeft, RefreshCw } from 'lucide-react';
import { sendOTP, verifyOTP, getOTPStatus, resendOTP } from '../utils/smsApi';
import { useUser } from '../context/UserContext';
import { storage } from '../utils/localStorage';

const SignInPage = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otp, setOtp] = useState('');
  const [userToLogin, setUserToLogin] = useState<any>(null);
  const [otpStatus, setOtpStatus] = useState<{ exists: boolean; expiresIn?: number; attemptsLeft?: number }>({ exists: false });
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      alert('Please fill in all fields');
      return;
    }
    
    // Check if user exists in localStorage
    const users = storage.getUsersList();
    
    const existingUser = users.find((user: any) => user.email === formData.email);
    
    if (existingUser) {
      // User exists, verify phone with OTP
      if (existingUser.phone) {
        setLoading(true);
        try {
          const result = await sendOTP(existingUser.phone);
          if (result.success) {
            setUserToLogin(existingUser);
            setShowOTPVerification(true);
            
            // Update OTP status
            const status = getOTPStatus(existingUser.phone);
            setOtpStatus(status);
            
            // Show success message with development OTP if available
            let message = `OTP sent to ${existingUser.phone}. Please check your phone.`;
            if (result.devOTP) {
              message += `\n\nDevelopment OTP: ${result.devOTP}`;
            }
            alert(message);
            
            // Start resend countdown
            startResendCountdown();
          } else {
            alert(result.message || 'Failed to send OTP. Please try again.');
          }
        } catch (error) {
          alert('Error sending OTP. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        // No phone number, direct login
        login(existingUser);
        navigate('/dashboard');
      }
    } else {
      // User doesn't exist, redirect to signup
      alert('Account not found. Please sign up first.');
      navigate('/signup');
    }
  };

  const verifyOTPCode = () => {
    if (!userToLogin?.phone) {
      alert('Phone number not found');
      return;
    }

    if (!otp.trim()) {
      alert('Please enter the OTP');
      return;
    }

    const result = verifyOTP(userToLogin.phone, otp.trim());
    
    if (result.success) {
      login(userToLogin);
      navigate('/dashboard');
    } else {
      alert(result.message);
      
      // Update OTP status after failed attempt
      const status = getOTPStatus(userToLogin.phone);
      setOtpStatus(status);
      
      // Clear OTP input
      setOtp('');
    }
  };

  const handleResendOTP = async () => {
    if (!userToLogin?.phone || resendDisabled) return;
    
    setResendDisabled(true);
    setLoading(true);
    
    try {
      const result = await resendOTP(userToLogin.phone);
      if (result.success) {
        alert('New OTP sent successfully. Please check your phone.');
        
        // Update OTP status
        const status = getOTPStatus(userToLogin.phone);
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
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to access your dashboard</p>
          </div>

          {showOTPVerification ? (
            <div className="space-y-6">
              <div className="text-center">
                <button
                  onClick={() => setShowOTPVerification(false)}
                  className="flex items-center justify-center mx-auto mb-4 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </button>
                
                <h2 className="text-xl font-bold text-gray-900 mb-2">Verify Phone Number</h2>
                <p className="text-gray-600 mb-4">Enter the 6-digit code sent to {userToLogin?.phone}</p>
                
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
                  {loading ? 'Verifying...' : 'Verify OTP'}
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
                  placeholder="Enter your email"
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
                    placeholder="Enter your password"
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
              
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              
              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign up
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
              Streamline Your Business
            </h2>
            <p className="text-xl text-gray-600 max-w-md">
              Manage inventory, process sales, and grow your business with our powerful POS system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;