import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, Filter, Grid, List, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartContext } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

// Mock products data
const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    rating: 4.8,
    reviews: 124,
    category: "Electronics",
    inStock: true,
    description: "High-quality wireless headphones with noise cancellation"
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    rating: 4.6,
    reviews: 89,
    category: "Electronics",
    inStock: true,
    description: "Track your fitness goals with this advanced smartwatch"
  },
  {
    id: 3,
    name: "Professional Camera Lens",
    price: 849.99,
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop",
    rating: 4.9,
    reviews: 67,
    category: "Photography",
    inStock: true,
    description: "Professional grade camera lens for stunning photography"
  },
  {
    id: 4,
    name: "Ergonomic Office Chair",
    price: 449.99,
    originalPrice: 599.99,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 156,
    category: "Furniture",
    inStock: true,
    description: "Comfortable ergonomic office chair for long work sessions"
  },
  {
    id: 5,
    name: "Wireless Gaming Mouse",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
    rating: 4.5,
    reviews: 203,
    category: "Electronics",
    inStock: true,
    description: "High-precision wireless gaming mouse with RGB lighting"
  },
  {
    id: 6,
    name: "Minimalist Desk Lamp",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
    rating: 4.4,
    reviews: 78,
    category: "Home",
    inStock: false,
    description: "Modern minimalist LED desk lamp with adjustable brightness"
  }
];

const categories = ["All", "Electronics", "Photography", "Furniture", "Home"];
const sortOptions = [
  { value: "name", label: "Name A-Z" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" }
];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const { addToCart } = useCartContext();
  const { toast } = useToast();

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      return categoryMatch && priceMatch;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCategory, sortBy, priceRange]);

  const handleAddToCart = (product: any) => {
    if (!product.inStock) {
      toast({
        title: "Item Unavailable",
        description: "This item is currently out of stock.",
        variant: "destructive"
      });
      return;
    }

    try {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
      
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
      
      console.log(`Added to cart: ${product.name} (ID: ${product.id})`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">Discover our amazing collection of products</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </h3>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <p className="text-gray-600">
                  Showing {filteredAndSortedProducts.length} products
                </p>
                
                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <div className="flex border border-gray-300 rounded-md">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
              {filteredAndSortedProducts.map((product) => (
                <Card key={product.id} className={`group hover:shadow-lg transition-all duration-300 bg-white ${viewMode === 'list' ? 'flex flex-row' : 'hover:-translate-y-1'}`}>
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'rounded-t-lg'}`}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className={`object-cover group-hover:scale-110 transition-transform duration-300 ${viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'}`}
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className={`${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''} p-4`}>
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">({product.reviews})</span>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">
                        <Link to={`/product/${product.id}`} className="hover:text-blue-600 transition-colors">
                          {product.name}
                        </Link>
                      </h3>
                      
                      {viewMode === 'list' && (
                        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                      )}
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className={`flex gap-2 ${viewMode === 'list' ? 'mt-4' : ''}`}>
                      <Button asChild variant="outline" className="flex-1">
                        <Link to={`/product/${product.id}`}>View Details</Link>
                      </Button>
                      <Button 
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        className="flex-1"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <Button onClick={() => {
                  setSelectedCategory("All");
                  setPriceRange([0, 1000]);
                }} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
