import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  CreditCard, 
  Settings, 
  FileText, 
  Shield, 
  HelpCircle, 
  Phone, 
  RefreshCw, 
  Truck, 
  Cookie,
  Bell,
  LogOut
} from 'lucide-react';
import { useUser } from '../context/UserContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useUser();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/pos', icon: ShoppingCart, label: 'Point of Sale' },
    { path: '/reports', icon: BarChart3, label: 'Sales & Reports' },
    { path: '/subscription', icon: CreditCard, label: 'Subscription' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  const legalItems = [
    { path: '/terms', icon: FileText, label: 'Terms of Service' },
    { path: '/privacy', icon: Shield, label: 'Privacy Policy' },
    { path: '/about', icon: HelpCircle, label: 'About' },
    { path: '/contact', icon: Phone, label: 'Contact Us' },
    { path: '/returns', icon: RefreshCw, label: 'Returns' },
    { path: '/shipping', icon: Truck, label: 'Shipping Policy' },
    { path: '/cookies', icon: Cookie, label: 'Cookies' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">InvenEase</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}

        {/* Legal & Support Section */}
        <div className="pt-6">
          <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Legal & Support
          </h3>
          {legalItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      {user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.fullName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.businessName}
              </p>
              <p className="text-xs text-green-600 font-medium">
                {user.subscription.type === 'trial' ? 'Free Trial' : 
                 user.subscription.type === 'monthly' ? 'Monthly Plan' : 
                 user.subscription.type === 'yearly' ? 'Yearly Plan' : user.subscription.type}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;