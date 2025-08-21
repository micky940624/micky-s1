import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, ShoppingCart, Package, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of InvenEase',
      icon: BookOpen,
      color: 'bg-blue-500',
      topics: [
        'How to set up your account',
        'Adding your first product',
        'Processing your first sale',
        'Understanding the dashboard'
      ]
    },
    {
      title: 'Product Management',
      description: 'Manage your inventory effectively',
      icon: Package,
      color: 'bg-green-500',
      topics: [
        'Adding products in bulk',
        'Setting up categories',
        'Managing stock levels',
        'Using barcode scanning'
      ]
    },
    {
      title: 'Sales & POS',
      description: 'Process sales and manage transactions',
      icon: ShoppingCart,
      color: 'bg-purple-500',
      topics: [
        'Using the POS system',
        'Processing different payment methods',
        'Generating invoices',
        'Managing customer information'
      ]
    },
    {
      title: 'Reports & Analytics',
      description: 'Understand your business performance',
      icon: BarChart3,
      color: 'bg-orange-500',
      topics: [
        'Reading sales reports',
        'Inventory analytics',
        'Customer insights',
        'Exporting data'
      ]
    }
  ];

  const faqs = [
    {
      question: 'How do I start my free trial?',
      answer: 'Simply click on "Start Free Trial" and create your account. No credit card required for the 7-day trial.'
    },
    {
      question: 'Can I import my existing product data?',
      answer: 'Yes, you can import products using our CSV import feature. We also provide a sample template to help you format your data correctly.'
    },
    {
      question: 'Is InvenEase GST compliant?',
      answer: 'Absolutely! InvenEase automatically calculates GST, generates compliant invoices, and helps with tax reporting.'
    },
    {
      question: 'Can I use InvenEase on mobile devices?',
      answer: 'Yes, InvenEase is fully responsive and works perfectly on tablets and smartphones through your web browser.'
    },
    {
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription anytime from your account settings. Your access will continue until the end of your billing period.'
    },
    {
      question: 'Do you offer customer support?',
      answer: 'Yes, we provide email support for all users and priority support for yearly subscribers. Our typical response time is within 24 hours.'
    }
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers to your questions and learn how to get the most out of InvenEase
          </p>
          
          {/* Search Box */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Browse by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className={`${category.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="text-sm text-gray-500 hover:text-blue-600 cursor-pointer transition-colors">
                      • {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still need help?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Our support team is here to help you succeed with InvenEase.
          </p>
          <Link 
            to="/contact"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
          >
            <span>Contact Support</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HelpPage;