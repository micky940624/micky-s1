import React, { useState } from 'react';
import { Plus, Search, Package, Edit, Trash2, AlertTriangle, Camera, X, Upload, FileSpreadsheet, ShoppingCart } from 'lucide-react';
import ResponsiveSidebar from '../components/ResponsiveSidebar';
import BarcodeScanner from '../components/BarcodeScanner';
import { useProducts, Product } from '../context/ProductContext';
import { useUser } from '../context/UserContext';
import SubscriptionCard from '../components/SubscriptionCard';
import { storage } from '../utils/localStorage';

const ProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct, searchProducts, getLowStockProducts } = useProducts();
  const { user, isTrialExpired, hasActiveSubscription } = useUser();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showScanner, setShowScanner] = useState(false);
  const [scannerMode, setScannerMode] = useState<'search' | 'add' | 'stock'>('search');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    barcode: '',
    sku: '',
    price: 0,
    cost: 0,
    stock: 0,
    minStock: 10,
    category: '',
    taxRate: 18,
    image: '',
    taxInclusive: true
  });

  const [stockUpdateData, setStockUpdateData] = useState({
    productId: '',
    quantity: 0,
    type: 'add' as 'add' | 'remove'
  });

  const categories = ['All', 'Electronics', 'Clothing', 'Food & Beverages', 'Books', 'Home & Garden', 'Sports', 'Other'];
  const hasAccess = !isTrialExpired() || hasActiveSubscription();

  const handleBarcodeScanned = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode || p.sku === barcode || p.name.toLowerCase().includes(barcode.toLowerCase()));
    
    if (scannerMode === 'search') {
      if (product) {
        setSearchQuery(barcode);
      } else {
        alert('Product not found with this barcode/SKU');
      }
      setShowScanner(false);
    } else if (scannerMode === 'add') {
      setFormData(prev => ({ ...prev, barcode }));
      setShowAddForm(true);
      setShowScanner(false);
    } else if (scannerMode === 'stock') {
      if (product) {
        setStockUpdateData(prev => ({ ...prev, productId: product.id }));
        setShowStockUpdateModal(true);
        setShowScanner(false);
      } else {
        alert('Product not found with this barcode/SKU');
      }
    }
  };

  const [showStockUpdateModal, setShowStockUpdateModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasAccess) {
      alert('Your trial has expired. Please upgrade to continue adding products.');
      return;
    }

    // Calculate MRP with GST included
    const basePrice = formData.taxInclusive ? formData.price : formData.price * (1 + formData.taxRate / 100);
    
    const productData = {
      ...formData,
      price: basePrice,
      barcode: formData.barcode || `${Date.now()}${Math.floor(Math.random() * 1000)}`,
      sku: formData.sku || `SKU-${Date.now()}`
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
    } else {
      addProduct(productData);
    }

    resetForm();
    setShowAddForm(false);
  };

  const handleStockUpdate = () => {
    const product = products.find(p => p.id === stockUpdateData.productId);
    if (product) {
      const newStock = stockUpdateData.type === 'add' 
        ? product.stock + stockUpdateData.quantity
        : Math.max(0, product.stock - stockUpdateData.quantity);
      
      updateProduct(product.id, { stock: newStock });
      setShowStockUpdateModal(false);
      setStockUpdateData({ productId: '', quantity: 0, type: 'add' });
      alert('Stock updated successfully!');
    }
  };

  const addToCart = (product: Product) => {
    if (!hasAccess) {
      alert('Your trial has expired. Please upgrade to continue using POS.');
      return;
    }

    // Get existing cart from localStorage
    let cart = storage.getCart();
    
    const existingItem = cart.find((item: any) => item.product.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert('Not enough stock available');
        return;
      }
      existingItem.quantity += 1;
      existingItem.total = existingItem.quantity * product.price;
    } else {
      if (product.stock <= 0) {
        alert('Product out of stock');
        return;
      }
      cart.push({ 
        product, 
        quantity: 1, 
        total: product.price 
      });
    }
    
    storage.saveCart(cart);
    alert(`${product.name} added to cart!`);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      barcode: '',
      sku: '',
      price: 0,
      cost: 0,
      stock: 0,
      minStock: 10,
      category: '',
      taxRate: 18,
      image: '',
      taxInclusive: true
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      barcode: product.barcode || '',
      sku: product.sku || '',
      price: product.price,
      cost: product.cost,
      stock: product.stock,
      minStock: product.minStock,
      category: product.category,
      taxRate: product.taxRate,
      image: product.image || '',
      taxInclusive: product.taxInclusive || true
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleBulkImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csv = event.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          alert('CSV file must contain at least a header row and one data row');
          return;
        }
        
        const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
        
        // Validate required headers
        const requiredHeaders = ['name', 'price'];
        const missingHeaders = requiredHeaders.filter(header => 
          !headers.some(h => h.includes(header))
        );
        
        if (missingHeaders.length > 0) {
          alert(`Missing required columns: ${missingHeaders.join(', ')}`);
          return;
        }
        
        let importedCount = 0;
        let errorCount = 0;
        const errors: string[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          try {
            const values = lines[i].split(',').map(val => val.trim().replace(/"/g, ''));
            
            if (values.length < headers.length) {
              errors.push(`Row ${i + 1}: Insufficient columns`);
              errorCount++;
              continue;
            }
            
            // Map values to product data based on headers
            const getValueByHeader = (headerName: string) => {
              const index = headers.findIndex(h => h.includes(headerName));
              return index !== -1 ? values[index] : '';
            };
            
            const productData = {
              name: getValueByHeader('name')?.trim() || '',
              description: getValueByHeader('description')?.trim() || '',
              barcode: getValueByHeader('barcode')?.trim() || `${Date.now()}-${i}`,
              sku: getValueByHeader('sku')?.trim() || `SKU-${Date.now()}-${i}`,
              price: parseFloat(getValueByHeader('price')) || 0,
              cost: parseFloat(getValueByHeader('cost')) || 0,
              stock: parseInt(getValueByHeader('stock')) || 0,
              minStock: parseInt(getValueByHeader('minstock') || getValueByHeader('min_stock')) || 10,
              category: getValueByHeader('category')?.trim() || 'Other',
              taxRate: parseFloat(getValueByHeader('taxrate') || getValueByHeader('tax_rate')) || 18,
              image: '',
              taxInclusive: true
            };
            
            if (productData.name && productData.price > 0) {
              addProduct(productData);
              importedCount++;
            } else {
              errors.push(`Row ${i + 1}: Missing name or invalid price`);
              errorCount++;
            }
          } catch (error) {
            errors.push(`Row ${i + 1}: ${error}`);
            errorCount++;
          }
        }
        
        let message = `Import completed!\n${importedCount} products imported successfully.`;
        if (errorCount > 0) {
          message += `\n${errorCount} rows had errors.`;
          if (errors.length > 0) {
            message += `\n\nFirst few errors:\n${errors.slice(0, 5).join('\n')}`;
          }
        }
        
        alert(message);
        setShowBulkImport(false);
      };
      reader.readAsText(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const filteredProducts = searchQuery 
    ? searchProducts(searchQuery)
    : selectedCategory === 'All' 
      ? products 
      : products.filter(p => p.category === selectedCategory);

  const lowStockProducts = getLowStockProducts();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ResponsiveSidebar />
      
      <div className="flex-1 p-4 pt-20 lg:pt-8 lg:p-8 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Products</h1>
              <p className="text-gray-600">Manage your inventory and product catalog</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setScannerMode('search');
                  setShowScanner(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Scan Search</span>
              </button>
              <button
                onClick={() => {
                  setScannerMode('stock');
                  setShowScanner(true);
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center space-x-2"
              >
                <Package className="w-4 h-4" />
                <span>Scan Stock</span>
              </button>
              <button
                onClick={() => setShowBulkImport(true)}
                disabled={!hasAccess}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>Bulk Import</span>
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                disabled={!hasAccess}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          <SubscriptionCard />

          {!hasAccess && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <h2 className="text-xl font-bold text-red-900">Products Access Restricted</h2>
                  <p className="text-red-700">Your trial has expired. Upgrade to continue managing products.</p>
                </div>
              </div>
            </div>
          )}

          {lowStockProducts.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-orange-800">Low Stock Alert</h3>
              </div>
              <p className="text-orange-700">
                {lowStockProducts.length} product(s) are running low on stock: {' '}
                {lowStockProducts.map(p => p.name).join(', ')}
              </p>
            </div>
          )}

          {/* Enhanced Search and Filter */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products by name, SKU, barcode, or category..."
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
                    setScannerMode('add');
                    setShowScanner(true);
                  }}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Camera className="w-5 h-5" />
                  <span className="hidden sm:inline">Scan Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  {/* Product Image */}
                  {product.image ? (
                    <div className="w-full h-32 mb-4 rounded-lg overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full h-32 mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">MRP (Inc. GST):</span>
                      <span className="font-semibold text-gray-900">₹{product.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cost Price:</span>
                      <span className="font-semibold text-gray-700">₹{product.cost}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Profit/Unit:</span>
                      <span className="font-semibold text-green-600">₹{(product.price - product.cost).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Stock:</span>
                      <span className={`font-semibold ${product.stock <= product.minStock ? 'text-red-600' : 'text-green-600'}`}>
                        {product.stock}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Category:</span>
                      <span className="text-gray-900">{product.category}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {product.barcode && (
                      <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        Barcode: {product.barcode}
                      </div>
                    )}
                    {product.sku && (
                      <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        SKU: {product.sku}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">
                {searchQuery ? 'Try adjusting your search criteria' : 'Start by adding your first product'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FileSpreadsheet className="w-6 h-6 mr-2" />
                  Bulk Import Products
                </h2>
                <button
                  onClick={() => setShowBulkImport(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-600 mb-4">
                  Upload a CSV file with the following columns:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <p className="font-medium mb-2">CSV Format:</p>
                  <p>Name, Description, Barcode, SKU, Price, Cost, Stock, MinStock, Category, TaxRate</p>
                </div>
              </div>
              
              <input
                type="file"
                accept=".csv"
                onChange={handleBulkImport}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <div className="mt-4">
                <a
                  href="data:text/csv;charset=utf-8,Name,Description,Barcode,SKU,Price,Cost,Stock,MinStock,Category,TaxRate%0ASample Product,Sample Description,123456789,SKU001,100,80,50,10,Electronics,18"
                  download="sample_products.csv"
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Download Sample CSV Template
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock Update Modal */}
      {showStockUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Update Stock</h2>
                <button
                  onClick={() => setShowStockUpdateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Type
                  </label>
                  <select
                    value={stockUpdateData.type}
                    onChange={(e) => setStockUpdateData(prev => ({ ...prev, type: e.target.value as 'add' | 'remove' }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="add">Add Stock</option>
                    <option value="remove">Remove Stock</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stockUpdateData.quantity}
                    onChange={(e) => setStockUpdateData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowStockUpdateModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStockUpdate}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update Stock
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter product name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter product description (optional)"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Barcode
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                      placeholder="Enter barcode"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setScannerMode('add');
                        setShowScanner(true);
                      }}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    placeholder="Enter SKU"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MRP (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Price includes GST</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Stock Level
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minStock}
                    onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setFormData({...formData, image: event.target?.result as string});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img src={formData.image} alt="Product preview" className="w-20 h-20 object-cover rounded-lg" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({...formData, taxRate: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Profit Preview */}
                {formData.price > 0 && formData.cost > 0 && (
                  <div className="md:col-span-2">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">Profit Analysis</h4>
                      <div className="text-sm space-y-1">
                        <p className="text-green-700">
                          Profit per unit: <span className="font-semibold">₹{(formData.price - formData.cost).toFixed(2)}</span>
                        </p>
                        <p className="text-green-700">
                          Profit margin: <span className="font-semibold">{((formData.price - formData.cost) / formData.price * 100).toFixed(1)}%</span>
                        </p>
                        <p className="text-blue-700">
                          MRP includes {formData.taxRate}% GST
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Scanner */}
      <BarcodeScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleBarcodeScanned}
        mode={scannerMode}
      />
    </div>
  );
};

export default ProductsPage;