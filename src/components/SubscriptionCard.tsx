import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Clock, AlertTriangle } from 'lucide-react';
import { useUser } from '../context/UserContext';

const SubscriptionCard = () => {
  const { user, isTrialExpired, hasActiveSubscription } = useUser();

  if (!user || hasActiveSubscription()) {
    return null;
  }

  const trialEndDate = new Date(user.subscription.startDate);
  trialEndDate.setDate(trialEndDate.getDate() + 7);
  const daysLeft = Math.max(0, Math.ceil((trialEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  if (isTrialExpired()) {
    return (
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-8 h-8" />
          <div>
            <h2 className="text-xl font-bold">Trial Expired</h2>
            <p className="opacity-90">Your 7-day free trial has ended</p>
          </div>
        </div>
        <p className="mb-4 opacity-90">
          Upgrade to a paid plan to continue using InvenEase and access all features.
        </p>
        <Link 
          to="/subscription"
          className="inline-flex items-center space-x-2 bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
        >
          <CreditCard className="w-5 h-5" />
          <span>Upgrade Now</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <Clock className="w-8 h-8" />
        <div>
          <h2 className="text-xl font-bold">Free Trial</h2>
          <p className="opacity-90">{daysLeft} days remaining</p>
        </div>
      </div>
      <p className="mb-4 opacity-90">
        You're currently on a 7-day free trial. Upgrade to continue using InvenEase after your trial ends.
      </p>
      <Link 
        to="/subscription"
        className="inline-flex items-center space-x-2 bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
      >
        <CreditCard className="w-5 h-5" />
        <span>Upgrade Plan</span>
      </Link>
    </div>
  );
};

export default SubscriptionCard;