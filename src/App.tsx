import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ReviewsPage from './pages/ReviewsPage';
import HelpPage from './pages/HelpPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CookiePage from './pages/CookiePage';
import ReturnsPage from './pages/ReturnsPage';
import ShippingPage from './pages/ShippingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import POSPage from './pages/POSPage';
import ReportsPage from './pages/ReportsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SettingsPage from './pages/SettingsPage';
import NotificationPage from './pages/NotificationPage';
import AdminPage from './pages/AdminPage';
import { UserProvider } from './context/UserContext';
import { ProductProvider } from './context/ProductContext';
import { SalesProvider } from './context/SalesContext';

// Component to handle dynamic page titles
function PageTitle() {
  const location = useLocation();
  
  useEffect(() => {
    const titles: { [key: string]: string } = {
      '/': 'InvenEase - Complete POS & Inventory Management System',
      '/reviews': 'Customer Reviews - InvenEase',
      '/help': 'Help Center - InvenEase',
      '/about': 'About Us - InvenEase',
      '/contact': 'Contact Us - InvenEase',
      '/privacy': 'Privacy Policy - InvenEase',
      '/terms': 'Terms & Conditions - InvenEase',
      '/cookies': 'Cookie Policy - InvenEase',
      '/signin': 'Sign In - InvenEase',
      '/signup': 'Sign Up - InvenEase',
      '/dashboard': 'Dashboard - InvenEase',
      '/products': 'Products & Inventory - InvenEase',
      '/pos': 'Point of Sale - InvenEase',
      '/reports': 'Sales Reports & Analytics - InvenEase',
      '/subscription': 'Subscription Plans - InvenEase',
      '/settings': 'Account Settings - InvenEase',
      '/notifications': 'Notifications - InvenEase'
    };
    
    document.title = titles[location.pathname] || 'InvenEase - Complete POS & Inventory Management System';
  }, [location]);
  
  return null;
}

function App() {
  return (
    <UserProvider>
      <ProductProvider>
        <SalesProvider>
          <Router>
            <PageTitle />
            <div className="App">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/cookies" element={<CookiePage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/returns" element={<ReturnsPage />} />
                <Route path="/shipping" element={<ShippingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/pos" element={<POSPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/notifications" element={<NotificationPage />} />
                <Route path="/admin-support" element={<AdminPage />} />
              </Routes>
            </div>
          </Router>
        </SalesProvider>
      </ProductProvider>
    </UserProvider>
  );
}

export default App;