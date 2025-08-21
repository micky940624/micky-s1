import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  DollarSign,
  FileText,
  Users,
  Calendar,
  Download,
  Upload
} from 'lucide-react';
import ResponsiveSidebar from '../components/ResponsiveSidebar';
import { useUser } from '../context/UserContext';
import { useProducts } from '../context/ProductContext';
import { useSales } from '../context/SalesContext';
import SubscriptionCard from '../components/SubscriptionCard';
import { storage } from '../utils/localStorage';

const Dashboard = () => {
  const { user, isTrialExpired, hasActiveSubscription } = useUser();
  const { products, getLowStockProducts } = useProducts();
  const { getTotalRevenue, getTodayRevenue, getSalesCount, getTodaySalesCount, sales } = useSales();

  // Calculate net profit
  const getTotalNetProfit = () => {
    return sales.reduce((total, sale) => {
      const saleProfit = sale.items.reduce((profit, item) => {
        return profit + ((item.product.price - item.product.cost) * item.quantity);
      }, 0);
      return total + saleProfit;
    }, 0);
  };

  const getTodayNetProfit = () => {
    const today = new Date().toDateString();
    const todaySales = sales.filter(sale => new Date(sale.date).toDateString() === today);
    return todaySales.reduce((total, sale) => {
      const saleProfit = sale.items.reduce((profit, item) => {
        return profit + ((item.product.price - item.product.cost) * item.quantity);
      }, 0);
      return total + saleProfit;
    }, 0);
  };

  // Export all data
  const handleExportData = () => {
    try {
      const data = storage.exportAllData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invenease-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('Data exported successfully!');
    } catch (error) {
      alert('Error exporting data. Please try again.');
    }
  };

  // Import data
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = event.target?.result as string;
          const success = storage.importAllData(jsonData);
          if (success) {
            alert('Data imported successfully! Please refresh the page to see changes.');
            window.location.reload();
          } else {
            alert('Error importing data. Please check the file format.');
          }
        } catch (error) {
          alert('Error reading file. Please ensure it\'s a valid JSON backup file.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Get storage info
  const storageInfo = storage.getStorageInfo();

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Sales',
      value: getSalesCount(),
      icon: ShoppingCart,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Revenue',
      value: `₹${getTotalRevenue().toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Net Profit',
      value: `₹${getTotalNetProfit().toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: "Today's Net Profit",
      value: `₹${getTodayNetProfit().toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Low Stock Items',
      value: getLowStockProducts().length,
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50'
    }
  ];

  const todayStats = [
    {
      title: "Today's Sales",
      value: getTodaySalesCount(),
      icon: ShoppingCart
    },
    {
      title: "Today's Revenue",
      value: `₹${getTodayRevenue().toLocaleString()}`,
      icon: TrendingUp
    },
    {
      title: "Today's Net Profit",
      value: `₹${getTodayNetProfit().toLocaleString()}`,
      icon: DollarSign
    }
  ];

  const quickActions = [
    {
      title: 'Add Product',
      description: 'Add new products to inventory',
      icon: Package,
      link: '/products',
      color: 'bg-blue-500'
    },
    {
      title: 'New Sale',
      description: 'Process a new sale',
      icon: ShoppingCart,
      link: '/pos',
      color: 'bg-green-500'
    },
    {
      title: 'View Reports',
      description: 'Analyze sales data',
      icon: BarChart3,
      link: '/reports',
      color: 'bg-purple-500'
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to continue</h1>
          <Link to="/signin" className="text-blue-600 hover:text-blue-500">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Check access for trial users
  const hasAccess = !isTrialExpired() || hasActiveSubscription();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ResponsiveSidebar />
      
      <div className="flex-1 p-4 pt-20 lg:pt-8 lg:p-8 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          {/* Header with Business Info */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2">Welcome back, {user.fullName}!</h1>
                  <div className="space-y-1 opacity-90">
                    <p className="text-lg font-medium">{user.businessName}</p>
                    {user.businessAddress && <p className="text-sm">{user.businessAddress}</p>}
                    {user.gstNumber && <p className="text-sm">GST: {user.gstNumber}</p>}
                    {user.upiId && <p className="text-sm">UPI: {user.upiId}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <Calendar className="w-8 h-8 mb-2" />
                    <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Overview of your business performance</p>
              <div className="text-sm text-gray-500">
                Real-time data • Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Subscription Card */}
          <SubscriptionCard />

          {!hasAccess && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <h2 className="text-xl font-bold text-red-900">Access Restricted</h2>
                  <p className="text-red-700">Your trial has expired. Upgrade to continue using InvenEase.</p>
                </div>
              </div>
              <Link 
                to="/subscription"
                className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300"
              >
                <span>Upgrade Now</span>
              </Link>
            </div>
          )}

          {/* Data Management Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {storageInfo.available === Infinity ? 'Unlimited' : `${(storageInfo.used / 1024).toFixed(1)} KB`}
                </div>
                <p className="text-sm text-gray-600">Storage Used</p>
                {storageInfo.available !== Infinity && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <button
                  onClick={handleExportData}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors mb-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Export Data</span>
                </button>
                <p className="text-xs text-gray-500">Backup all your data</p>
              </div>
              
              <div className="text-center">
                <label className="w-full flex items-center justify-center space-x-2 bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer mb-2">
                  <Upload className="w-5 h-5" />
                  <span>Import Data</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500">Restore from backup</p>
              </div>
            </div>
          </div>

          {/* Welcome Message for New Users */}
          {hasAccess && products.length === 0 && user.subscription.type === 'trial' && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Welcome to Your 7-Day Free Trial!
              </h2>
              <p className="text-gray-700 mb-4">
                You have 7 days to explore all features of InvenEase. Get started by adding your first product to begin managing your inventory and processing sales.
              </p>
              <p className="text-gray-700 mb-4 font-medium">Next steps:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                <li>Add your products to inventory</li>
                <li>Configure your business settings</li>
                <li>Start processing sales</li>
              </ul>
              <Link 
                to="/products"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Product</span>
              </Link>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Performance */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h2>
                <div className="space-y-4">
                  {todayStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <stat.icon className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="text-gray-700">{stat.title}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              {hasAccess && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    {quickActions.map((action, index) => (
                      <Link
                        key={index}
                        to={action.link}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className={`${action.color} p-2 rounded-lg`}>
                          <action.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 group-hover:text-blue-600">
                            {action.title}
                          </p>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Business Overview */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <Package className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Inventory Management</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Track your products, manage stock levels, and get low stock alerts
                    </p>
                    <div className="mt-4 text-2xl font-bold text-blue-600">
                      {products.length} Products
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <ShoppingCart className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Point of Sale</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Process sales quickly with barcode scanning and multiple payment options
                    </p>
                    <div className="mt-4 text-2xl font-bold text-green-600">
                      {getSalesCount()} Sales
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Get insights into your sales performance and business trends
                    </p>
                    <div className="mt-4 text-2xl font-bold text-purple-600">
                      ₹{getTotalRevenue().toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                    <FileText className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900">GST Compliance</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Generate GST-compliant invoices and manage tax reports
                    </p>
                    <div className="mt-4 text-2xl font-bold text-orange-600">
                      Auto GST
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;