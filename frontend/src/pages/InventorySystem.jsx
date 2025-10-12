import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Package, FileText, Activity, Plus, X, Trash2, Search } from 'lucide-react';

const InventorySystem = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [products, setProducts] = useState([
    { id: 1, name: 'Heart Keychain', category: 'Keychains', originalPrice: 50, markupPrice: 100, quantity: 25 },
    { id: 2, name: 'Star Bracelet', category: 'Bracelets', originalPrice: 80, markupPrice: 150, quantity: 15 },
    { id: 3, name: 'Cute Cat Pin', category: 'Button Pins', originalPrice: 30, markupPrice: 60, quantity: 40 },
  ]);
  
  const [categories, setCategories] = useState(['Keychains', 'Bracelets', 'Button Pins']);
  const [cart, setCart] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [logs, setLogs] = useState([
    { timestamp: new Date().toISOString(), action: 'SYSTEM_START', details: 'Inventory system initialized' }
  ]);
  
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const addLog = (action, details) => {
    const log = {
      timestamp: new Date().toISOString(),
      action,
      details
    };
    setLogs(prev => [log, ...prev]);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      setIsLoggedIn(true);
      addLog('USER_LOGIN', `User: ${username}`);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, qty: item.qty + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    addLog('CART_ADD', `Added ${product.name} to cart`);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    addLog('CART_REMOVE', `Removed product ID: ${productId}`);
  };

  const updateCartQty = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item => 
      item.id === productId ? { ...item, qty } : item
    ));
  };

  const checkout = () => {
    if (cart.length === 0) return;
    
    const invoice = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: cart,
      total: cart.reduce((sum, item) => sum + (item.markupPrice * item.qty), 0)
    };
    
    setInvoices([invoice, ...invoices]);
    
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      if (cartItem) {
        return { ...product, quantity: product.quantity - cartItem.qty };
      }
      return product;
    });
    setProducts(updatedProducts);
    
    addLog('CHECKOUT', `Invoice #${invoice.id} - Total: ₱${invoice.total}`);
    setCart([]);
    alert('Sale completed successfully!');
  };

  const addProduct = (productData) => {
    const newProduct = {
      id: Date.now(),
      ...productData
    };
    setProducts([...products, newProduct]);
    addLog('PRODUCT_ADD', `Added ${productData.name}`);
    setShowAddProduct(false);
  };

  const deleteProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    setProducts(products.filter(p => p.id !== productId));
    addLog('PRODUCT_DELETE', `Deleted ${product.name}`);
  };

  const addCategory = (categoryName) => {
    if (categoryName && !categories.includes(categoryName)) {
      setCategories([...categories, categoryName]);
      addLog('CATEGORY_ADD', `Added category: ${categoryName}`);
    }
    setShowAddCategory(false);
  };

  const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const todaySales = invoices.filter(inv => {
    const invDate = new Date(inv.date);
    const today = new Date();
    return invDate.toDateString() === today.toDateString();
  }).reduce((sum, inv) => sum + inv.total, 0);

  const getWeeklySales = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return invoices.filter(inv => new Date(inv.date) >= weekAgo)
      .reduce((sum, inv) => sum + inv.total, 0);
  };

  const getMonthlySales = () => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return invoices.filter(inv => new Date(inv.date) >= monthAgo)
      .reduce((sum, inv) => sum + inv.total, 0);
  };

  const getBestSelling = () => {
    const sales = {};
    invoices.forEach(inv => {
      inv.items.forEach(item => {
        sales[item.name] = (sales[item.name] || 0) + item.qty;
      });
    });
    const sorted = Object.entries(sales).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, 3);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-200 rounded-full -ml-12 -mb-12 opacity-50"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-pink-400 to-rose-400 p-4 rounded-full">
                <Heart className="w-12 h-12 text-white fill-white" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Cute Booth</h1>
            <p className="text-center text-gray-500 mb-8">Inventory System</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white py-3 rounded-2xl font-semibold hover:from-pink-500 hover:to-rose-500 transition-all transform hover:scale-105"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const Sidebar = () => (
    <div className="w-64 bg-gradient-to-b from-pink-50 to-rose-50 h-screen p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-8">
        <Heart className="w-8 h-8 text-pink-400 fill-pink-400" />
        <h1 className="text-2xl font-bold text-gray-800">Cute Booth</h1>
      </div>
      
      <nav className="space-y-2">
        {[
          { id: 'dashboard', icon: Activity, label: 'Dashboard' },
          { id: 'pos', icon: ShoppingCart, label: 'POS' },
          { id: 'inventory', icon: Package, label: 'Inventory' },
          { id: 'invoices', icon: FileText, label: 'Invoices' },
          { id: 'logs', icon: Activity, label: 'Logs' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
              currentPage === item.id
                ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md'
                : 'text-gray-600 hover:bg-white hover:shadow-sm'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );

  const Dashboard = () => {
    const bestSelling = getBestSelling();
    
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-3xl p-6 shadow-lg">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Today's Sales</h3>
            <p className="text-3xl font-bold text-pink-600">₱{todaySales}</p>
          </div>
          
          <div className="bg-gradient-to-br from-rose-100 to-rose-50 rounded-3xl p-6 shadow-lg">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Weekly Sales</h3>
            <p className="text-3xl font-bold text-rose-600">₱{getWeeklySales()}</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-3xl p-6 shadow-lg">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Monthly Sales</h3>
            <p className="text-3xl font-bold text-purple-600">₱{getMonthlySales()}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Total Sales</h3>
            <p className="text-4xl font-bold text-gray-800">₱{totalSales}</p>
            <p className="text-gray-500 mt-2">{invoices.length} transactions</p>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Best Selling Products</h3>
            <div className="space-y-3">
              {bestSelling.length > 0 ? (
                bestSelling.map(([name, qty], idx) => (
                  <div key={name} className="flex justify-between items-center">
                    <span className="text-gray-700">{idx + 1}. {name}</span>
                    <span className="font-semibold text-pink-600">{qty} sold</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No sales yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const POS = () => {
    const filteredProducts = selectedCategory === 'All' 
      ? products 
      : products.filter(p => p.category === selectedCategory);
    
    const cartTotal = cart.reduce((sum, item) => sum + (item.markupPrice * item.qty), 0);
    
    return (
      <div className="p-8 flex gap-6">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Point of Sale</h2>
          
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => product.quantity > 0 && addToCart(product)}
                className={`bg-white rounded-3xl p-4 shadow-md hover:shadow-xl transition-all ${
                  product.quantity > 0 ? 'cursor-pointer hover:scale-105' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl mb-3 flex items-center justify-center">
                  <Package className="w-12 h-12 text-pink-400" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-pink-600">₱{product.markupPrice}</span>
                  <span className="text-sm text-gray-500">Stock: {product.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-96 bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Cart</h3>
          
          <div className="space-y-3 mb-4 max-h-[calc(100vh-350px)] overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Cart is empty</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="bg-pink-50 rounded-2xl p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-500">₱{item.markupPrice} each</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCartQty(item.id, item.qty - 1)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-semibold">{item.qty}</span>
                    <button
                      onClick={() => updateCartQty(item.id, item.qty + 1)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                    <span className="font-bold text-pink-600 ml-2">₱{item.markupPrice * item.qty}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="border-t-2 border-pink-200 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-pink-600">₱{cartTotal}</span>
            </div>
            <button
              onClick={checkout}
              disabled={cart.length === 0}
              className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white py-3 rounded-2xl font-semibold hover:from-pink-500 hover:to-rose-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Inventory = () => {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Inventory</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddCategory(true)}
              className="px-6 py-3 bg-purple-400 text-white rounded-2xl font-semibold hover:bg-purple-500 transition-all"
            >
              Add Category
            </button>
            <button
              onClick={() => setShowAddProduct(true)}
              className="px-6 py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-2xl font-semibold hover:from-pink-500 hover:to-rose-500 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="aspect-square w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center">
                  <Package className="w-10 h-10 text-pink-400" />
                </div>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{product.category}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Original Price:</span>
                  <span className="font-semibold">₱{product.originalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Selling Price:</span>
                  <span className="font-semibold text-pink-600">₱{product.markupPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock:</span>
                  <span className={`font-semibold ${product.quantity < 10 ? 'text-red-500' : 'text-green-600'}`}>
                    {product.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {showAddProduct && (
          <AddProductModal
            categories={categories}
            onClose={() => setShowAddProduct(false)}
            onAdd={addProduct}
          />
        )}
        
        {showAddCategory && (
          <AddCategoryModal
            onClose={() => setShowAddCategory(false)}
            onAdd={addCategory}
          />
        )}
      </div>
    );
  };

  const AddProductModal = ({ categories, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
      name: '',
      category: categories[0],
      originalPrice: '',
      markupPrice: '',
      quantity: ''
    });
    
    const handleSubmit = (e) => {
      e.preventDefault();
      onAdd({
        ...formData,
        originalPrice: parseFloat(formData.originalPrice),
        markupPrice: parseFloat(formData.markupPrice),
        quantity: parseInt(formData.quantity)
      });
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none"
            />
            
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <input
              type="number"
              placeholder="Original Price"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none"
            />
            
            <input
              type="number"
              placeholder="Selling Price"
              value={formData.markupPrice}
              onChange={(e) => setFormData({ ...formData, markupPrice: e.target.value })}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none"
            />
            
            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              min="0"
              className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none"
            />
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-2xl font-semibold hover:from-pink-500 hover:to-rose-500 transition-all"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const AddCategoryModal = ({ onClose, onAdd }) => {
    const [categoryName, setCategoryName] = useState('');
    
    const handleSubmit = (e) => {
      e.preventDefault();
      onAdd(categoryName);
      setCategoryName('');
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New Category</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none"
            />
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-2xl font-semibold hover:from-pink-500 hover:to-rose-500 transition-all"
              >
                Add Category
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const Invoices = () => {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Invoices</h2>
        
        <div className="space-y-4">
          {invoices.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center text-gray-500">
              No invoices yet
            </div>
          ) : (
            invoices.map(invoice => (
              <div key={invoice.id} className="bg-white rounded-3xl p-6 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Invoice #{invoice.id}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(invoice.date).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-pink-600">₱{invoice.total}</span>
                </div>
                
                <div className="space-y-2">
                  {invoice.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-pink-50 rounded-2xl p-3">
                      <div>
                        <span className="font-semibold text-gray-800">{item.name}</span>
                        <span className="text-gray-500 text-sm ml-2">x{item.qty}</span>
                      </div>
                      <span className="font-semibold text-pink-600">₱{item.markupPrice * item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const Logs = () => {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">System Logs</h2>
        
        <div className="bg-gray-900 rounded-3xl p-6 shadow-lg">
          <div className="font-mono text-sm space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
            {logs.map((log, idx) => (
              <div key={idx} className="text-green-400">
                <span className="text-gray-500">[{new Date(log.timestamp).toLocaleString()}]</span>
                <span className="text-yellow-400 mx-2">{log.action}</span>
                <span className="text-white">{log.details}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'pos' && <POS />}
        {currentPage === 'inventory' && <Inventory />}
        {currentPage === 'invoices' && <Invoices />}
        {currentPage === 'logs' && <Logs />}
      </div>
    </div>
  );
};

export default InventorySystem;