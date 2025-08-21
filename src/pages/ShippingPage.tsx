import React from 'react';
import { Truck, Package, Clock, MapPin, Shield, Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ShippingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Policy</h1>
            <p className="text-gray-600">Last updated: 8/8/2025</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Digital Service Delivery</h2>
              <p className="text-gray-700">
                InvenEase is a cloud-based software service. There are no physical products to ship. 
                All services are delivered digitally through our web platform, providing instant access upon subscription activation.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Service Activation Timeline
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Instant Activation</h3>
                    <p className="text-gray-700">Your account is activated immediately upon successful payment</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Welcome Email</h3>
                    <p className="text-gray-700">You'll receive a welcome email with login credentials and setup instructions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Full Access</h3>
                    <p className="text-gray-700">Start using all features immediately - no waiting period</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                What You Receive
              </h2>
              <p className="text-gray-700 mb-4">Upon subscription, you get instant access to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Complete POS system with barcode scanning</li>
                <li>Inventory management tools</li>
                <li>GST-compliant invoicing</li>
                <li>Sales reports and analytics</li>
                <li>Cloud data storage and backup</li>
                <li>Customer support via email</li>
                <li>Regular software updates</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Service Availability
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Geographic Coverage</h3>
                  <p className="text-gray-700">
                    InvenEase is available worldwide. However, our primary focus and compliance features 
                    are designed for Indian businesses, including GST calculations and local payment methods.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">System Requirements</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                    <li>Stable internet connection</li>
                    <li>No software installation required</li>
                    <li>Works on desktop, tablet, and mobile devices</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Account Setup & Onboarding</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Our onboarding process is designed to get you up and running quickly:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Step 1: Account Creation</h4>
                    <p className="text-gray-700 text-sm">Sign up with your business details and verify your email</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Step 2: Business Setup</h4>
                    <p className="text-gray-700 text-sm">Configure your business information, GST details, and preferences</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Step 3: Product Import</h4>
                    <p className="text-gray-700 text-sm">Add your products manually or import via CSV file</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Step 4: Start Selling</h4>
                    <p className="text-gray-700 text-sm">Begin processing sales and managing your inventory</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Service Interruptions</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  While we strive for 99.9% uptime, service interruptions may occasionally occur due to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Scheduled maintenance (announced in advance)</li>
                  <li>Emergency security updates</li>
                  <li>Infrastructure upgrades</li>
                  <li>Unforeseen technical issues</li>
                </ul>
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Our Commitment:</h4>
                  <p className="text-gray-700 text-sm">
                    We will notify users of planned maintenance at least 24 hours in advance and work to minimize any service disruptions.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Data Security & Backup
              </h2>
              <p className="text-gray-700 mb-4">Your data security is our priority:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>All data is encrypted in transit and at rest</li>
                <li>Daily automated backups</li>
                <li>99.9% uptime guarantee</li>
                <li>Secure cloud infrastructure</li>
                <li>Regular security audits</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Customer Support</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Our support team is available to help you with setup, training, and any technical issues:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Email Support</h4>
                    <p className="text-gray-700 text-sm">support@invenease.in</p>
                    <p className="text-gray-600 text-xs">Response within 24 hours</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Help Documentation</h4>
                    <p className="text-gray-700 text-sm">Comprehensive guides and tutorials</p>
                    <p className="text-gray-600 text-xs">Available 24/7</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Questions About Service Delivery?
              </h2>
              <div className="space-y-2">
                <p><strong>Email:</strong> support@invenease.in</p>
                <p><strong>Address:</strong> N0047, sonarudra, Chakbamongoria, nadanghat, West Bengal, Barddhaman, India, 713513</p>
                <p className="text-sm opacity-90 mt-4">
                  Contact us if you have any questions about accessing or using our service.
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

export default ShippingPage;