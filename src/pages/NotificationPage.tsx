import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, X, Trash2 } from 'lucide-react';
import ResponsiveSidebar from '../components/ResponsiveSidebar';
import { useProducts } from '../context/ProductContext';
import { useSales } from '../context/SalesContext';
import SubscriptionCard from '../components/SubscriptionCard';

const NotificationPage = () => {
  const { getLowStockProducts } = useProducts();
  const { getTodaySales } = useSales();
  const [notifications, setNotifications] = useState(() => {
    const lowStockProducts = getLowStockProducts();
    const todaySales = getTodaySales();
    
    const notifs = [];
    
    // Low stock notifications
    lowStockProducts.forEach(product => {
      notifs.push({
        id: `low-stock-${product.id}`,
        type: 'warning',
        title: 'Low Stock Alert',
        message: `${product.name} is running low (${product.stock} left)`,
        time: new Date().toISOString(),
        read: false
      });
    });

    // Daily sales summary
    if (todaySales.length > 0) {
      const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
      notifs.push({
        id: 'daily-sales',
        type: 'success',
        title: 'Daily Sales Summary',
        message: `You made ${todaySales.length} sales today with total revenue of ₹${todayRevenue.toLocaleString()}`,
        time: new Date().toISOString(),
        read: false
      });
    }

    // Welcome notification for new users
    notifs.push({
      id: 'welcome',
      type: 'info',
      title: 'Welcome to InvenEase!',
      message: 'Start by adding your products and processing your first sale.',
      time: new Date().toISOString(),
      read: false
    });

    return notifs;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-orange-500" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ResponsiveSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    {unreadCount} unread
                  </span>
                )}
              </h1>
              <p className="text-gray-600">Stay updated with your business alerts</p>
            </div>
            
            {notifications.length > 0 && (
              <div className="flex space-x-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          <SubscriptionCard />

          {notifications.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up! Check back later for updates.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl p-6 shadow-sm border transition-all duration-300 ${
                    notification.read ? 'border-gray-200' : getBgColor(notification.type)
                  } ${!notification.read ? 'shadow-md' : ''}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold ${
                            notification.read ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                            )}
                          </h3>
                          <p className={`mt-1 ${
                            notification.read ? 'text-gray-500' : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="mt-2 text-sm text-gray-400">
                            {new Date(notification.time).toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Mark as read"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete notification"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;