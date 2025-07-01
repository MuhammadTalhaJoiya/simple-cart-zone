
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Zap, Shield, Truck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/Footer';

// Mock featured products data
const featuredProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    rating: 4.8,
    reviews: 124,
    badge: "Best Seller"
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    rating: 4.6,
    reviews: 89,
    badge: "New"
  },
  {
    id: 3,
    name: "Professional Camera Lens",
    price: 849.99,
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop",
    rating: 4.9,
    reviews: 67,
    badge: "Pro Choice"
  },
  {
    id: 4,
    name: "Ergonomic Office Chair",
    price: 449.99,
    originalPrice: 599.99,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 156,
    badge: "Sale"
  }
];

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"a\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"%3E%3Ccircle cx=\"10\" cy=\"10\" r=\"1\" fill=\"white\" opacity=\"0.1\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100%25\" height=\"100%25\" fill=\"url(%23a)\"/%3E%3C/svg%3E')]"></div>
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 animate-fade-in leading-tight">
              Discover Amazing Products
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100 animate-fade-in leading-relaxed">
              Shop the latest trends with unbeatable prices and fast delivery. Your perfect purchase is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
              <Button asChild size="lg" className="group">
                <Link to="/products">
                  Shop Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-blue-600 backdrop-blur-sm">
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">Why Choose Us</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Experience the difference with our premium service</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group hover-lift">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 shadow-lg">
                <Truck className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Free Shipping</h3>
              <p className="text-gray-600 leading-relaxed">Free delivery on orders over $50 with our express shipping network</p>
            </div>
            <div className="text-center group hover-lift">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300 shadow-lg">
                <Shield className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Secure Payment</h3>
              <p className="text-gray-600 leading-relaxed">Your payment information is protected with bank-level security</p>
            </div>
            <div className="text-center group hover-lift">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300 shadow-lg">
                <Zap className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">Get your orders in 2-3 business days anywhere in the country</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">Featured Products</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our hand-picked selection of premium products that our customers love most
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover-lift bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <div className="relative overflow-hidden">
                  {product.badge && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-lg ${
                        product.badge === 'Sale' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                        product.badge === 'New' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
                        product.badge === 'Best Seller' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                        'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                      }`}>
                        {product.badge}
                      </span>
                    </div>
                  )}
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2 font-medium">({product.reviews})</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-lg group-hover:text-blue-600 transition-colors duration-300">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <Button asChild className="w-full group/btn shadow-md">
                    <Link to={`/product/${product.id}`}>
                      <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Button asChild size="lg" variant="outline" className="shadow-lg hover:shadow-xl">
              <Link to="/products">
                View All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"grid\" width=\"60\" height=\"60\" patternUnits=\"userSpaceOnUse\"%3E%3Cpath d=\"m60 0h-60v60\" fill=\"none\" stroke=\"white\" stroke-width=\"1\" opacity=\"0.1\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100%25\" height=\"100%25\" fill=\"url(%23grid)\"/%3E%3C/svg%3E')]"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            Subscribe to our newsletter and be the first to know about new products, exclusive deals, and special offers.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300/50 shadow-lg"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 shadow-lg">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
