
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { getTotalItems } = useCart();
  const { user, logout, loading } = useAuth();
  
  const cartItemsCount = getTotalItems();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              ECommerce
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-all duration-300 hover:text-blue-600 relative ${
                  isActive(item.href) 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                } after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full ${
                  isActive(item.href) ? 'after:w-full' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-600 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {!loading && (
              <>
                {user ? (
                  <div className="hidden md:flex items-center space-x-3">
                    <span className="text-sm text-gray-600 font-medium">
                      Welcome, {user.firstName || user.email}
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleSignOut} className="hover:bg-red-50 hover:text-red-600 transition-colors duration-300">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" asChild className="hidden md:flex hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300">
                    <Link to="/login">
                      <User className="w-4 h-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                )}
              </>
            )}
            
            <Button variant="ghost" size="sm" asChild className="relative hover:bg-blue-50 transition-colors duration-300">
              <Link to="/cart">
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-gray-100 transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-md animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300"
                />
              </div>
              
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2.5 text-base font-medium rounded-xl transition-all duration-300 ${
                    isActive(item.href) 
                      ? 'text-blue-600 bg-blue-50 font-semibold' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {!loading && (
                <>
                  {user ? (
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2.5 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Logout
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="block px-3 py-2.5 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      Login
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
