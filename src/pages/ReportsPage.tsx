import React, { useState } from 'react';
import { BarChart3, TrendingUp, Package, ShoppingCart, Calendar, Download, Filter, DollarSign } from 'lucide-react';
import ResponsiveSidebar from '../components/ResponsiveSidebar';
import { useSales } from '../context/SalesContext';
import { useProducts } from '../context/ProductContext';
import { useUser } from '../context/UserContext';
import SubscriptionCard from '../components/SubscriptionCard';

const ReportsPage = () => {
  const { sales, getTodaySales, getTotalRevenue, getTodayRevenue, getTopProducts } = useSales();
  const { products, getLowStockProducts } = useProducts();
  const { user, isTrialExpired, hasActiveSubscription } = useUser();
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const periods = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  const getSalesForPeriod = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    switch (selectedPeriod) {
      case 'today':
        return sales.filter(sale => new Date(sale.date) >= today);
      case 'week':
        return sales.filter(sale => new Date(sale.date) >= startOfWeek);
      case 'month':
        return sales.filter(sale => new Date(sale.date) >= startOfMonth);
      case 'year':
        return sales.filter(sale => new Date(sale.date) >= startOfYear);
      default:
        return sales;
    }
  };

  const periodSales = getSalesForPeriod();
  const periodRevenue = periodSales.reduce((sum, sale) => sum + sale.total, 0);
  
  // Calculate net profit for the period
  const periodNetProfit = periodSales.reduce((total, sale) => {
    const saleProfit = sale.items.reduce((profit, item) => {
      return profit + ((item.product.price - item.product.cost) * item.quantity);
    }, 0);
    return total + saleProfit;
  }, 0);

  const downloadPDF = () => {
    const printWindow = window.open('', '_blank');
    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sales Report - ${selectedPeriod}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
          .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Sales Report</h1>
          <p>Period: ${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}</p>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="stats">
          <div class="stat-card">
            <h3>Total Sales</h3>
            <p style="font-size: 24px; font-weight: bold;">${periodSales.length}</p>
          </div>
          <div class="stat-card">
            <h3>Revenue</h3>
            <p style="font-size: 24px; font-weight: bold;">₹${periodRevenue.toLocaleString()}</p>
          </div>
          <div class="stat-card">
            <h3>Net Profit</h3>
            <p style="font-size: 24px; font-weight: bold;">₹${periodNetProfit.toLocaleString()}</p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Net Profit</th>
            </tr>
          </thead>
          <tbody>
            ${periodSales.map(sale => {
              const saleProfit = sale.items.reduce((profit, item) => {
                return profit + ((item.product.price - item.product.cost) * item.quantity);
              }, 0);
              return `
                <tr>
                  <td>${sale.invoiceNumber}</td>
                  <td>${new Date(sale.date).toLocaleDateString()}</td>
                  <td>${sale.customerName || 'Walk-in Customer'}</td>
                  <td>${sale.items.reduce((sum, item) => sum + item.quantity, 0)} items</td>
                  <td>${sale.paymentMethod.toUpperCase()}</td>
                  <td>₹${sale.total.toLocaleString()}</td>
                  <td>₹${saleProfit.toLocaleString()}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Generated by InvenEase POS System</p>
        </div>
      </body>
      </html>
    `;
    
    if (printWindow) {
      printWindow.document.write(reportHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };
  // Calculate total net profit
  const totalNetProfit = sales.reduce((total, sale) => {
    const saleProfit = sale.items.reduce((profit, item) => {
      return profit + ((item.product.price - item.product.cost) * item.quantity);
    }, 0);
    return total + saleProfit;
  }, 0);

  const topProducts = getTopProducts();
  const lowStockProducts = getLowStockProducts();

  const stats = [
    {
      title: 'Total Sales',
      value: periodSales.length,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Revenue',
      value: `₹${periodRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Net Profit',
      value: `₹${periodNetProfit.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Products Sold',
      value: periodSales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0),
      icon: Package,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Avg. Order Value',
      value: periodSales.length > 0 ? `₹${(periodRevenue / periodSales.length).toFixed(0)}` : '₹0',
      icon: BarChart3,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  const hasAccess = !isTrialExpired() || hasActiveSubscription();

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <ResponsiveSidebar />
        <div className="flex-1 p-4 lg:p-8 lg:ml-0">
          <div className="max-w-7xl mx-auto">
            <SubscriptionCard />
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports Unavailable</h3>
              <p className="text-gray-600">Upgrade your plan to access detailed sales reports and analytics.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ResponsiveSidebar />
      
      <div className="flex-1 p-4 pt-20 lg:pt-8 lg:p-8 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Sales & Reports</h1>
              <p className="text-gray-600">Analyze your business performance</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>{period.label}</option>
                ))}
              </select>
              <button 
                onClick={downloadPDF}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <SubscriptionCard />

          {/* Overall Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Performance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">₹{getTotalRevenue().toLocaleString()}</p>
                <p className="text-gray-600">Total Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">₹{totalNetProfit.toLocaleString()}</p>
                <p className="text-gray-600">Total Net Profit</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{sales.length}</p>
                <p className="text-gray-600">Total Sales</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Products */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Selling Products</h2>
              {topProducts.length > 0 ? (
                <div className="space-y-4">
                  {topProducts.map((item, index) => (
                    <div key={item.product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.product.name}</p>
                          <p className="text-sm text-gray-600">{item.quantity} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{item.revenue.toLocaleString()}</p>
                        <p className="text-sm text-green-600">
                          Profit: ₹{((item.product.price - item.product.cost) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No sales data available</p>
                </div>
              )}
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Low Stock Alert</h2>
              {lowStockProducts.length > 0 ? (
                <div className="space-y-4">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">{product.stock} left</p>
                        <p className="text-sm text-gray-600">Min: {product.minStock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-green-300 mx-auto mb-4" />
                  <p className="text-green-600">All products are well stocked!</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Sales */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Sales</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Profit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {periodSales.slice(0, 10).map((sale) => {
                    const saleProfit = sale.items.reduce((profit, item) => {
                      return profit + ((item.product.price - item.product.cost) * item.quantity);
                    }, 0);
                    
                    return (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {sale.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(sale.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {sale.customerName || 'Walk-in Customer'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {sale.items.reduce((sum, item) => sum + item.quantity, 0)} items
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            sale.paymentMethod === 'cash' ? 'bg-green-100 text-green-800' :
                            sale.paymentMethod === 'upi' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {sale.paymentMethod.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ₹{sale.total.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          ₹{saleProfit.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {periodSales.length === 0 && (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No sales found for the selected period</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;