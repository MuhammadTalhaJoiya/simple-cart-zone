
import { useState, useMemo } from 'react';
import { useCartContext } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import ProductsFilter from '@/components/ProductsFilter';
import ProductsHeader from '@/components/ProductsHeader';
import ProductsList from '@/components/ProductsList';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setPriceRange([0, 1000]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">Discover our amazing collection of products</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <ProductsFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
          />

          <div className="flex-1">
            <ProductsHeader
              productsCount={filteredAndSortedProducts.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortOptions={sortOptions}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            <ProductsList
              products={filteredAndSortedProducts}
              viewMode={viewMode}
              onAddToCart={handleAddToCart}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
