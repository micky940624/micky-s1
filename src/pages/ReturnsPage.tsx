import React from 'react';
import { RefreshCw, ArrowLeft, CheckCircle, XCircle, Clock, Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ReturnsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Refunds Policy</h1>
            <p className="text-gray-600">Last updated: 8/8/2025</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Commitment</h2>
              <p className="text-gray-700">
                At InvenEase, we are committed to your satisfaction. If you're not completely satisfied with our service, 
                we offer a comprehensive returns and refunds policy to ensure your peace of mind.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Refund Eligibility
              </h2>
              <p className="text-gray-700 mb-4">You are eligible for a full refund if:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>You cancel within the first 7 days of your subscription</li>
                <li>Our service experiences significant downtime (more than 24 hours)</li>
                <li>You experience technical issues that we cannot resolve within 48 hours</li>
                <li>You are not satisfied with the service quality within the first 30 days</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Refund Process & Timeline
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Submit Request</h3>
                    <p className="text-gray-700">Contact our support team with your refund request and reason</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Review Process</h3>
                    <p className="text-gray-700">We review your request within 24-48 hours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Refund Processing</h3>
                    <p className="text-gray-700">Approved refunds are processed within 5-7 business days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <XCircle className="w-5 h-5 mr-2" />
                Non-Refundable Items
              </h2>
              <p className="text-gray-700 mb-4">The following are not eligible for refunds:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Subscriptions used for more than 30 days (partial refunds may apply)</li>
                <li>Custom development or integration services</li>
                <li>Third-party service fees (payment processing, SMS charges)</li>
                <li>Subscriptions cancelled after the billing cycle has completed</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Subscription Cancellation</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Monthly Subscriptions</h3>
                  <p className="text-gray-700">
                    You can cancel your monthly subscription at any time. Your access will continue until the end of your current billing period.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Yearly Subscriptions</h3>
                  <p className="text-gray-700">
                    Yearly subscriptions can be cancelled with a pro-rated refund if cancelled within the first 30 days. 
                    After 30 days, no refund is available, but you retain access until the subscription expires.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Request a Refund</h2>
              <div className="space-y-4">
                <p className="text-gray-700">To request a refund, please contact our support team with the following information:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Your account email address</li>
                  <li>Subscription details (plan type, billing date)</li>
                  <li>Reason for refund request</li>
                  <li>Any relevant screenshots or documentation</li>
                </ul>
                <div className="bg-white p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Contact Information:</h4>
                  <p className="text-gray-700">Email: support@invenease.in</p>
                  <p className="text-gray-700">Response Time: Within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Refund Methods</h2>
              <p className="text-gray-700 mb-4">Refunds will be processed using the same payment method used for the original purchase:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Credit/Debit Cards:</strong> 5-7 business days</li>
                <li><strong>UPI/Digital Wallets:</strong> 2-3 business days</li>
                <li><strong>Net Banking:</strong> 3-5 business days</li>
              </ul>
              <p className="text-gray-600 text-sm mt-4">
                Note: Refund processing times may vary depending on your bank or payment provider.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Dispute Resolution</h2>
              <p className="text-gray-700">
                If you're not satisfied with our refund decision, you can escalate your case to our management team. 
                We are committed to finding a fair resolution for all parties involved.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Need Help?
              </h2>
              <div className="space-y-2">
                <p><strong>Email:</strong> support@invenease.in</p>
                <p><strong>Address:</strong> N0047, sonarudra, Chakbamongoria, nadanghat, West Bengal, Barddhaman, India, 713513</p>
                <p className="text-sm opacity-90 mt-4">
                  Our customer support team is here to help you with any questions about returns and refunds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReturnsPage;