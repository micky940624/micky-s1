import React, { useState } from 'react';
import { CheckCircle, CreditCard, Clock, Star, Calendar, AlertTriangle } from 'lucide-react';
import ResponsiveSidebar from '../components/ResponsiveSidebar';
import { useUser } from '../context/UserContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface AutoRenewalSettings {
  enabled: boolean;
  planId: string;
  nextBillingDate: string;
}
const SubscriptionPage = () => {
  const { user, updateUser, getTrialDaysLeft } = useUser();
  const [loading, setLoading] = useState(false);
  const [autoRenewal, setAutoRenewal] = useState<AutoRenewalSettings>({
    enabled: false,
    planId: '',
    nextBillingDate: ''
  });

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: 199,
      period: 'month',
      features: [
        'Unlimited Products',
        'Barcode Scanning',
        'GST Compliant Invoicing',
        'Sales Reports',
        'Email Support',
        'Cloud Storage'
      ]
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: 1499,
      period: 'year',
      originalPrice: 2388,
      savings: 889,
      popular: true,
      features: [
        'Everything in Monthly',
        'Priority Support',
        'Advanced Analytics',
        'Data Export',
        'API Access',
        'Custom Reports'
      ]
    }
  ];

  const handlePayment = async (plan: typeof plans[0]) => {
    setLoading(true);
    
    try {
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_KJxPSaEKHvrSSr',
          amount: plan.price * 100, // Amount in paise
          currency: 'INR',
          name: import.meta.env.VITE_BUSINESS_NAME || 'InvenEase',
          description: `${plan.name} Subscription`,
          image: '/logo.png',
          handler: function (response: any) {
            // Payment successful
            const endDate = new Date();
            if (plan.id === 'monthly') {
              endDate.setMonth(endDate.getMonth() + 1);
            } else {
              endDate.setFullYear(endDate.getFullYear() + 1);
            }

            updateUser({
              subscription: {
                ...user?.subscription,
                type: plan.id as 'monthly' | 'yearly',
                startDate: new Date().toISOString(),
                endDate: endDate.toISOString(),
                isActive: true
              }
            });

            // Set up auto-renewal if enabled
            if (autoRenewal.enabled) {
              setAutoRenewal({
                enabled: true,
                planId: plan.id,
                nextBillingDate: endDate.toISOString()
              });
              localStorage.setItem('invenease_auto_renewal', JSON.stringify({
                enabled: true,
                planId: plan.id,
                nextBillingDate: endDate.toISOString(),
                userId: user?.id
              }));
            }

            alert('Payment successful! Your subscription is now active.');
          },
          prefill: {
            name: user?.fullName,
            email: user?.email,
            contact: user?.phone
          },
          theme: {
            color: '#3B82F6'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isSubscriptionExpired = () => {
    if (!user || user.subscription.type === 'trial') return false;
    const endDate = new Date(user.subscription.endDate);
    return new Date() > endDate;
  };

  const getSubscriptionStatus = () => {
    if (!user) return { status: 'inactive', message: '' };
    
    if (user.subscription.type === 'trial') {
      const daysLeft = getTrialDaysLeft();
      return {
        status: daysLeft > 0 ? 'trial' : 'expired',
        message: daysLeft > 0 ? `${daysLeft} days left` : 'Trial expired'
      };
    }
    
    if (isSubscriptionExpired()) {
      return { status: 'expired', message: 'Subscription expired' };
    }
    
    return { 
      status: 'active', 
      message: `Active until ${new Date(user.subscription.endDate).toLocaleDateString()}` 
    };
  };

  const subscriptionStatus = getSubscriptionStatus();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ResponsiveSidebar />
      
      <div className="flex-1 p-4 pt-20 lg:pt-8 lg:p-8 lg:ml-0">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Subscription Plans</h1>
            <p className="text-gray-600">Choose the plan that works best for your business</p>
          </div>

          {/* Current Plan Status */}
          {user && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Plan</h2>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {user.subscription.type === 'trial' ? 'Free Trial' : 
                     user.subscription.type === 'monthly' ? 'Monthly Plan' : 
                     user.subscription.type === 'yearly' ? 'Yearly Plan' : 'Unknown Plan'}
                  </p>
                  <p className="text-gray-600">{subscriptionStatus.message}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {subscriptionStatus.status === 'trial' && <Clock className="w-5 h-5 text-orange-500" />}
                  {subscriptionStatus.status === 'active' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {subscriptionStatus.status === 'expired' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    subscriptionStatus.status === 'active' ? 'bg-green-100 text-green-800' : 
                    subscriptionStatus.status === 'trial' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {subscriptionStatus.status === 'active' ? 'Active' : 
                     subscriptionStatus.status === 'trial' ? 'Trial' : 'Expired'}
                  </span>
                </div>
              </div>
              
              {/* Show current plan details for active subscriptions */}
              {(user.subscription.type === 'monthly' || user.subscription.type === 'yearly') && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        ₹{user.subscription.type === 'monthly' ? '199/month' : '1,499/year'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Started on {new Date(user.subscription.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    {user.subscription.type === 'yearly' && (
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        Saving ₹889/year
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Auto-Renewal Settings */}
          {user && (user.subscription.type === 'monthly' || user.subscription.type === 'yearly') && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Auto-Renewal Settings</h2>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Automatic Subscription Renewal</h3>
                  <p className="text-gray-600 text-sm">
                    Your subscription will automatically renew 30 days before expiry
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={autoRenewal.enabled}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      setAutoRenewal(prev => ({ ...prev, enabled }));
                      
                      if (enabled) {
                        const renewalDate = new Date(user.subscription.endDate);
                        renewalDate.setDate(renewalDate.getDate() - 30);
                        
                        localStorage.setItem('invenease_auto_renewal', JSON.stringify({
                          enabled: true,
                          planId: user.subscription.type,
                          nextBillingDate: renewalDate.toISOString(),
                          userId: user.id
                        }));
                      } else {
                        localStorage.removeItem('invenease_auto_renewal');
                      }
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              {autoRenewal.enabled && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Auto-renewal enabled:</strong> Your {user.subscription.type} subscription will automatically renew 30 days before expiry. 
                    You can cancel anytime from your account settings.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Expired Subscription Alert */}
          {subscriptionStatus.status === 'expired' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <h2 className="text-xl font-bold text-red-900">Subscription Expired</h2>
                  <p className="text-red-700">Your subscription has expired. Please renew to continue using InvenEase.</p>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-blue-500 relative' : ''
                } ${
                  user?.subscription.type === plan.id && subscriptionStatus.status === 'active' ? 'ring-2 ring-green-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}
                
                {user?.subscription.type === plan.id && subscriptionStatus.status === 'active' && (
                  <div className="absolute -top-4 right-4">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Current Plan
                    </div>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    {plan.originalPrice && (
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-lg text-gray-400 line-through">₹{plan.originalPrice}</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                          Save ₹{plan.savings}
                        </span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePayment(plan)}
                    disabled={loading || (user?.subscription.type === plan.id && subscriptionStatus.status === 'active')}
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                      user?.subscription.type === plan.id && subscriptionStatus.status === 'active'
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <CreditCard className="w-5 h-5" />
                      <span>
                        {user?.subscription.type === plan.id && subscriptionStatus.status === 'active' 
                          ? 'Current Plan' 
                          : loading ? 'Processing...' : 'Subscribe Now'}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Features Comparison */}
          <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose InvenEase?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">GST Compliant</h3>
                <p className="text-gray-600">Automated GST calculations and compliant invoicing for Indian businesses</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payments</h3>
                <p className="text-gray-600">Bank-grade security with encrypted data and secure payment processing</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-gray-600">Dedicated customer support to help you succeed with your business</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;