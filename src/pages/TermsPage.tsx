import React from 'react';
import { FileText, CreditCard, Shield, AlertTriangle, Users, Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
            <p className="text-gray-600">Last updated: 8/8/2025</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using InvenEase, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                2. Service Description
              </h2>
              <p className="text-gray-700">
                InvenEase is a cloud-based Point of Sale (POS) and inventory management system designed for businesses. Our service includes inventory tracking, sales processing, reporting, and GST compliance features.
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                3. Subscription and Payment
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Monthly subscription: ₹199 per month</li>
                <li>Yearly subscription: ₹1,499 per year</li>
                <li>Payments are processed securely through Razorpay</li>
                <li>Subscriptions auto-renew unless cancelled</li>
                <li>No refunds for partial months or unused features</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                4. User Responsibilities
              </h2>
              <p className="text-gray-700 mb-4">You agree to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the service in compliance with applicable laws</li>
                <li>Not share your account with unauthorized users</li>
                <li>Backup your data regularly</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Ownership</h2>
              <p className="text-gray-700">
                You retain ownership of all data you input into the system. We provide tools to export your data at any time. Upon account termination, your data will be retained for 30 days before permanent deletion.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Service Availability</h2>
              <p className="text-gray-700">
                We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. Scheduled maintenance will be announced in advance when possible.
              </p>
            </div>

            <div className="bg-red-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                7. Limitation of Liability
              </h2>
              <p className="text-gray-700">
                InvenEase shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
              </p>
            </div>

            <div className="bg-yellow-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Termination</h2>
              <p className="text-gray-700">
                Either party may terminate this agreement at any time. Upon termination, your access to the service will cease, and your data will be available for export for 30 days.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or through the application.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                10. Contact Information
              </h2>
              <div className="space-y-2">
                <p><strong>Email:</strong> support@invenease.in</p>
                <p><strong>Address:</strong> N0047, sonarudra, Chakbamongoria, nadanghat, West Bengal, Barddhaman, India, 713513</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsPage;