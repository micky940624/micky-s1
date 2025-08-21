import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, TrendingUp, Award, Filter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ReviewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const stats = [
    { icon: Users, label: '1,000,000+', description: 'Happy Customers' },
    { icon: Star, label: '4.9/5', description: 'Average Rating' },
    { icon: TrendingUp, label: '40%', description: 'Average Revenue Growth' },
    { icon: Award, label: '99.9%', description: 'Customer Satisfaction' }
  ];

  const categories = ['All', 'Electronics Store', 'Restaurant', 'Fashion Retail', 'Pharmacy', 'Grocery'];

  const reviews = [
    {
      name: 'Rajesh Kumar',
      business: 'Retail Store Owner',
      location: 'Mumbai, Maharashtra',
      review: 'InvenEase revolutionized our store operations. Sales tracking, inventory management, and GST compliance - everything in one place. Our revenue increased by 40% in just 3 months!',
      category: 'Electronics Store',
      metric: '+40% Revenue Growth',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      business: 'Restaurant Owner',
      location: 'Delhi, NCR',
      review: 'The barcode scanning feature is amazing! We can process orders 3x faster now. The GST reports save us hours during tax filing. Customer service is excellent too.',
      category: 'Restaurant',
      metric: '3x Faster Processing',
      rating: 5
    },
    {
      name: 'Amit Patel',
      business: 'Electronics Shop Owner',
      location: 'Bangalore, Karnataka',
      review: 'Best investment for our business. The inventory alerts prevent stockouts and the sales analytics help us make better decisions. ROI was visible within the first month.',
      category: 'Electronics Store',
      metric: 'Zero Stockouts',
      rating: 5
    },
    {
      name: 'Sunita Reddy',
      business: 'Fashion Boutique Owner',
      location: 'Hyderabad, Telangana',
      review: 'Managing multiple product variants was a nightmare before InvenEase. Now everything is organized and we can track which styles sell best. The mobile app is fantastic!',
      category: 'Fashion Retail',
      metric: 'Better Organization',
      rating: 5
    },
    {
      name: 'Vikram Singh',
      business: 'Pharmacy Owner',
      location: 'Pune, Maharashtra',
      review: 'The expiry date tracking and batch management features are perfect for our pharmacy. GST compliance is automatic and the reports are exactly what we need for audits.',
      category: 'Pharmacy',
      metric: 'Full Compliance',
      rating: 5
    },
    {
      name: 'Meera Joshi',
      business: 'Grocery Store Owner',
      location: 'Jaipur, Rajasthan',
      review: 'InvenEase made our grocery store completely digital. The barcode system works perfectly and customers love the quick checkout. Our daily sales reports help us plan better.',
      category: 'Grocery',
      metric: 'Digital Transformation',
      rating: 5
    }
  ];

  const filteredReviews = selectedCategory === 'All' 
    ? reviews 
    : reviews.filter(review => review.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What Our Customers Say
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Real stories from businesses that transformed their operations with InvenEase
          </p>
          <div className="flex items-center justify-center space-x-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
            ))}
            <span className="text-2xl font-bold text-gray-900 ml-4">4.9/5 from 50,000+ reviews</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.label}</div>
                <div className="text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredReviews.map((review, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{review.review}"
                </p>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-600">{review.business}</p>
                    <p className="text-sm text-gray-500">{review.location}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {review.category}
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    {review.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Thousands of Successful Businesses
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start your journey with InvenEase today and see the difference it can make for your business.
          </p>
          <Link 
            to="/signup" 
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg"
          >
            <span>Start Your Free Trial</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReviewsPage;