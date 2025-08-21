import React from 'react';
import { Shield, Lock, Eye, FileText, Users, Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: 8/8/2025</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 p-6 rounded-xl mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                1. Information We Collect
              </h2>
              <p className="text-gray-700 mb-4">
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Name, email address, and contact information</li>
                <li>Business information and GST details</li>
                <li>Payment information (processed securely through Razorpay)</li>
                <li>Product and inventory data</li>
                <li>Sales and transaction records</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-xl mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                2. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Generate analytics and reports for your business</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                3. Information Sharing
              </h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Service providers who assist in our operations</li>
                <li>Payment processors for transaction processing</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-6 rounded-xl mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                4. Data Security
              </h2>
              <p className="text-gray-700">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is stored securely and encrypted both in transit and at rest.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Retention</h2>
              <p className="text-gray-700">
                We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your account and data at any time.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Access and update your personal information</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                7. Contact Us
              </h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
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

export default PrivacyPage;