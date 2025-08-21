import React from 'react';
import { ShoppingCart, Target, Users, Shield, CheckCircle, BarChart3, Package, FileText } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage = () => {
  const missions = [
    {
      icon: Target,
      title: 'Simplify Business',
      description: 'Make business management simple and intuitive for everyone'
    },
    {
      icon: Users,
      title: 'Empower Growth',
      description: 'Provide tools that help businesses grow and scale efficiently'
    },
    {
      icon: Shield,
      title: 'Ensure Compliance',
      description: 'Keep businesses compliant with GST and tax regulations'
    }
  ];

  const features = [
    {
      title: 'Point of Sale System',
      items: [
        'Fast and intuitive checkout process',
        'Barcode scanning support',
        'Multiple payment methods',
        'Real-time inventory updates'
      ]
    },
    {
      title: 'Inventory Management',
      items: [
        'Real-time stock tracking',
        'Low stock alerts',
        'Product categorization',
        'Bulk import/export'
      ]
    },
    {
      title: 'Sales Analytics',
      items: [
        'Detailed sales reports',
        'Revenue tracking',
        'Customer insights',
        'Performance metrics'
      ]
    },
    {
      title: 'GST Compliance',
      items: [
        'Automated tax calculations',
        'GST-compliant invoicing',
        'Tax reports generation',
        'CGST, SGST, IGST support'
      ]
    }
  ];

  const benefits = [
    {
      title: 'Affordable Pricing',
      description: 'Starting at just ₹199/month with no setup fees'
    },
    {
      title: 'Easy to Use',
      description: 'Intuitive interface designed for non-technical users'
    },
    {
      title: 'Cloud-Based',
      description: 'Access your data anywhere, anytime from any device'
    },
    {
      title: 'Secure & Reliable',
      description: 'Bank-grade security with 99.9% uptime guarantee'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">InvenEase</h1>
          <p className="text-xl text-gray-600">Complete POS & Inventory Management Solution</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Story</h2>
          <p className="text-lg text-gray-600 leading-relaxed text-center">
            InvenEase was founded in 2024 with a simple mission: to make business management accessible and affordable for every entrepreneur in India. We recognized that small and medium businesses needed powerful tools to compete in today's digital marketplace, but existing solutions were either too expensive or too complex.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Mission</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {missions.map((mission, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <mission.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{mission.title}</h3>
                <p className="text-gray-600">{mission.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Offer</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">{feature.title}</h3>
                <ul className="space-y-3">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose InvenEase */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose InvenEase?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Commitment</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-12">
            We are committed to providing exceptional service and continuous innovation. Our team works tirelessly to add new features, improve performance, and ensure that InvenEase remains the best choice for businesses of all sizes.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Contact Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Business Address</h3>
              <p className="text-gray-600 leading-relaxed">
                N0047, sonarudra, Chakbamongoria<br />
                nadanghat, West Bengal<br />
                Barddhaman, India, 713513
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h3>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> support@invenease.in
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> +91 8016056126
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Support:</span> support@invenease.in
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl">
            Join thousands of businesses already using InvenEase to streamline their operations and grow their revenue.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;