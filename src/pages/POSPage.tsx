import React, { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart, Search, Trash2, CreditCard, Smartphone, Banknote, X, Printer, Camera } from 'lucide-react';
import ResponsiveSidebar from '../components/ResponsiveSidebar';
import BarcodeScanner from '../components/BarcodeScanner';
import UPIQRCode from '../components/UPIQRCode';
import { useProducts, Product } from '../context/ProductContext';
import { useSales, CartItem } from '../context/SalesContext';
import { useUser } from '../context/UserContext';
import SubscriptionCard from '../components/SubscriptionCard';
import { storage } from '../utils/localStorage';

const POSPage = () => {
  const { products, searchProducts, updateStock } = useProducts();
  const { addSale } = useSales();
  const { user, isTrialExpired, hasActiveSubscription } = useUser();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPayment, setShowPayment] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannerMode, setScannerMode] = useState<'search' | 'add'>('search');
  const [showUPIQR, setShowUPIQR] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: ''
  });

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = storage.getCart();
    setCart(savedCart);
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    storage.saveCart(cart);
  }, [cart]);

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filteredProducts = searchQuery 
    ? searchProducts(searchQuery)
    : selectedCategory === 'All' 
      ? products 
      : products.filter(p => p.category === selectedCategory);

  // Check if user has access
  const hasAccess = !isTrialExpired() || hasActiveSubscription();

  const handleBarcodeScanned = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode || p.sku === barcode || p.name.toLowerCase().includes(barcode.toLowerCase()));
    if (product) {
      addToCart(product);
      setShowScanner(false);
    } else {
      alert('Product not found with this barcode');
    }
  };

  const addToCart = (product: Product) => {
    if (!hasAccess) {
      alert('Your trial has expired. Please upgrade to continue using POS.');
      return;
    }

    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert('Not enough stock available');
        return;
      }
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * product.price }
          : item
      ));
    } else {
      if (product.stock <= 0) {
        alert('Product out of stock');
        return;
      }
      setCart([...cart, { 
        product, 
        quantity: 1, 
        total: product.price 
      }]);
    }
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product && newQuantity > product.stock) {
      alert('Not enough stock available');
      return;
    }

    setCart(cart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: newQuantity, total: newQuantity * item.product.price }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const getCartSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const getCartTax = () => {
    return cart.reduce((sum, item) => {
      if (item.product.taxInclusive) {
        // Tax is already included in the price
        return sum + (item.total * item.product.taxRate / (100 + item.product.taxRate));
      } else {
        // Tax is additional
        return sum + (item.total * item.product.taxRate / 100);
      }
    }, 0);
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    const tax = getCartTax();
    
    // If all items are tax inclusive, total = subtotal (tax is already included)
    const allTaxInclusive = cart.every(item => item.product.taxInclusive);
    if (allTaxInclusive) {
      return subtotal;
    }
    
    return subtotal + tax;
  };

  const getNetProfit = () => {
    return cart.reduce((sum, item) => sum + ((item.product.price - item.product.cost) * item.quantity), 0);
  };

  const handlePayment = (paymentMethod: 'cash' | 'upi' | 'card') => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    if (paymentMethod === 'upi') {
      if (!user?.upiId) {
        alert('Please add your UPI ID in settings first');
        return;
      }
      setShowUPIQR(true);
      return;
    }

    completePayment(paymentMethod);
  };

  const completePayment = (paymentMethod: 'cash' | 'upi' | 'card') => {
    const sale = addSale({
      items: cart,
      subtotal: getCartSubtotal(),
      tax: getCartTax(),
      total: getCartTotal(),
      paymentMethod,
      customerName: customerInfo.name || undefined,
      customerPhone: customerInfo.phone || undefined
    });

    // Update stock for all items
    cart.forEach(item => {
      updateStock(item.product.id, item.quantity);
    });

    // Clear cart and customer info
    setCart([]);
    setCustomerInfo({ name: '', phone: '' });
    setShowPayment(false);
    setShowUPIQR(false);

    // Generate and show invoice
    generateInvoice(sale);
  };

  const generateInvoice = (sale: any) => {
    const printWindow = window.open('', '_blank');
    const invoice = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${sale.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .invoice-details { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .totals { text-align: right; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${user?.businessName || 'InvenEase'}</h1>
          <p>${user?.businessAddress || ''}</p>
          ${user?.gstNumber ? `<p>GSTIN: ${user.gstNumber}</p>` : ''}
          ${user?.phone ? `<p>Phone: ${user.phone}</p>` : ''}
        </div>
        
        <div class="invoice-details">
          <p><strong>Invoice Number:</strong> ${sale.invoiceNumber}</p>
          <p><strong>Date:</strong> ${new Date(sale.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${new Date(sale.date).toLocaleTimeString()}</p>
          ${sale.customerName ? `<p><strong>Customer:</strong> ${sale.customerName}</p>` : ''}
          ${sale.customerPhone ? `<p><strong>Phone:</strong> ${sale.customerPhone}</p>` : ''}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Tax Rate</th>
              <th>Tax</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${sale.items.map((item: any) => `
              <tr>
                <td>${item.product.name}</td>
                <td>${item.quantity}</td>
                <td>₹${(item.product.taxInclusive ? (item.product.price / (1 + item.product.taxRate/100)) : item.product.price).toFixed(2)}</td>
                <td>${item.product.taxRate}%</td>
                <td>₹${(item.product.taxInclusive ? (item.total * item.product.taxRate / (100 + item.product.taxRate)) : (item.total * item.product.taxRate / 100)).toFixed(2)}</td>
                <td>₹${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <p><strong>Subtotal: ₹${(sale.subtotal - (sale.items.every((item: any) => item.product.taxInclusive) ? sale.tax : 0)).toFixed(2)}</strong></p>
          <p><strong>Tax: ₹${sale.tax.toFixed(2)}</strong></p>
          <p><strong>Total: ₹${sale.total.toFixed(2)}</strong></p>
          <p><strong>Payment Method: ${sale.paymentMethod.toUpperCase()}</strong></p>
        </div>
        
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>Generated by InvenEase POS System</p>
        </div>
      </body>
      </html>
    `;
    
    if (printWindow) {
      printWindow.document.write(invoice);
      printWindow.document.close();
      printWindow.print();
    }

    alert(`Sale completed! Invoice: ${sale.invoiceNumber}`);
  };

  const clearCart = () => {
    setCart([]);
    storage.clearCart();
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <ResponsiveSidebar />
        
        <div className="flex-1 p-4 lg:p-8 lg:ml-0">
          <div className="max-w-7xl mx-auto">
            <SubscriptionCard />
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">POS Access Restricted</h3>
              <p className="text-gray-600">Upgrade your plan to access the Point of Sale system.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ResponsiveSidebar />
      
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Products Section */}
        <div className="flex-1 p-4 pt-20 lg:pt-6 lg:p-6 lg:ml-0">
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Point of Sale</h1>
            <p className="text-gray-600">Process sales and manage transactions</p>
          </div>

          <SubscriptionCard />

          {/* Search and Filter */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products by name, SKU, or barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setScannerMode('search');
                    setShowScanner(true);
                  }}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Camera className="w-5 h-5" />
                  <span className="hidden sm:inline">Scan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="font-semibold text-gray-900 mb-2 truncate">{product.name}</h3>
                <p className="text-lg font-bold text-blue-600 mb-2">₹{product.price}</p>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                  <span>Stock: {product.stock}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        {/* Cart Section */}
        <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col max-h-screen lg:relative fixed bottom-0 lg:bottom-auto z-10">
          <div className="p-4 lg:p-6 border-b border-gray-200 lg:block hidden">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Cart</h2>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Mobile Cart Header */}
          <div className="p-4 border-b border-gray-200 lg:hidden flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">
              Cart ({cart.length})
            </h2>
            {cart.length > 0 && (
              <span className="font-semibold text-blue-600">₹{getCartTotal().toFixed(2)}</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 lg:p-6 max-h-40 lg:max-h-none">
            {cart.length === 0 ? (
              <div className="text-center py-8 lg:py-12">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-gray-900 flex-1 text-sm">{item.product.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-600 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-medium text-gray-900 text-sm">₹{item.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-gray-200 p-4 lg:p-6 bg-white">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Subtotal:</span>
                  <span className="font-medium text-sm">₹{(getCartSubtotal() - (cart.every(item => item.product.taxInclusive) ? getCartTax() : 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Tax:</span>
                  <span className="font-medium text-sm">₹{getCartTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Net Profit:</span>
                  <span className="font-medium text-green-600 text-sm">₹{getNetProfit().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>₹{getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowPayment(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 lg:py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Proceed to Payment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Barcode Scanner */}
      <BarcodeScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleBarcodeScanned}
        mode={scannerMode}
      />

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
                <button
                  onClick={() => setShowPayment(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Customer Information (Optional)</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{(getCartSubtotal() - (cart.every(item => item.product.taxInclusive) ? getCartTax() : 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{getCartTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Net Profit:</span>
                    <span>₹{getNetProfit().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Payment Method</h3>
                
                <button
                  onClick={() => handlePayment('cash')}
                  className="w-full flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Banknote className="w-6 h-6 text-green-600" />
                  <span className="font-medium">Cash Payment</span>
                </button>

                <button
                  onClick={() => handlePayment('upi')}
                  className="w-full flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Smartphone className="w-6 h-6 text-blue-600" />
                  <span className="font-medium">UPI Payment</span>
                </button>

                <button
                  onClick={() => handlePayment('card')}
                  className="w-full flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <CreditCard className="w-6 h-6 text-purple-600" />
                  <span className="font-medium">Card Payment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPI QR Code Modal */}
      {showUPIQR && user?.upiId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">UPI Payment</h2>
                <button
                  onClick={() => setShowUPIQR(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <UPIQRCode
                upiId={user.upiId}
                amount={getCartTotal()}
                businessName={user.businessName}
                merchantName={user.fullName}
              />
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowUPIQR(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => completePayment('upi')}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Payment Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSPage;