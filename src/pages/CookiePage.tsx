import React from 'react';
import { Cookie, Settings, BarChart3, Shield, Clock, Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CookiePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Cookie className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
            <p className="text-gray-600">Last updated: 8/8/2025</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">What are Cookies?</h2>
              <p className="text-gray-700">
                Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and improving our service functionality.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">How We Use Cookies</h2>
              <p className="text-gray-700 mb-4">We use cookies for the following purposes:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong>Authentication:</strong> To keep you logged in to your account</li>
                <li><strong>Preferences:</strong> To remember your settings and preferences</li>
                <li><strong>Analytics:</strong> To understand how you use our service</li>
                <li><strong>Security:</strong> To protect against fraud and unauthorized access</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Essential Cookies
                  </h3>
                  <p className="text-gray-700 mb-2">These cookies are necessary for the website to function and cannot be switched off.</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Session management</li>
                    <li>Authentication tokens</li>
                    <li>Security features</li>
                    <li>Load balancing</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Functional Cookies
                  </h3>
                  <p className="text-gray-700 mb-2">These cookies enable enhanced functionality and personalization.</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>User preferences</li>
                    <li>Language settings</li>
                    <li>Theme preferences</li>
                    <li>Dashboard customization</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Analytics Cookies
                  </h3>
                  <p className="text-gray-700 mb-2">These cookies help us understand how visitors interact with our website.</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Page views and navigation</li>
                    <li>Feature usage statistics</li>
                    <li>Performance monitoring</li>
                    <li>Error tracking</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Cookies</h2>
              <p className="text-gray-700 mb-4">We may use third-party services that set cookies:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Razorpay:</strong> For payment processing and fraud prevention</li>
                <li><strong>Google Analytics:</strong> For website analytics (if enabled)</li>
                <li><strong>Support Chat:</strong> For customer support functionality</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Managing Cookies</h2>
              <p className="text-gray-700 mb-4">You can control cookies through:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Browser Settings</h3>
                  <p className="text-gray-700 mb-2">Most browsers allow you to control cookies through their settings:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Block all cookies</li>
                    <li>Block third-party cookies</li>
                    <li>Delete existing cookies</li>
                    <li>Set cookie preferences</li>
                  </ul>
                </div>

                <div className="bg-red-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Important Note</h4>
                  <p className="text-gray-700">
                    Disabling essential cookies may affect the functionality of InvenEase. Some features may not work properly if cookies are blocked.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Cookie Retention
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Cookie Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Session</td>
                      <td className="border border-gray-300 px-4 py-2">Until browser closes</td>
                      <td className="border border-gray-300 px-4 py-2">Authentication</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Persistent</td>
                      <td className="border border-gray-300 px-4 py-2">30 days</td>
                      <td className="border border-gray-300 px-4 py-2">Preferences</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Analytics</td>
                      <td className="border border-gray-300 px-4 py-2">2 years</td>
                      <td className="border border-gray-300 px-4 py-2">Usage statistics</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Updates to This Policy</h2>
              <p className="text-gray-700">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Contact Us
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

export default CookiePage;