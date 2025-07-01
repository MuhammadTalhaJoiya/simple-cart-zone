
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  inStock: boolean;
  description: string;
}

interface ProductsListProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  onAddToCart: (product: Product) => void;
  onClearFilters: () => void;
}

const ProductsList = ({ products, viewMode, onAddToCart, onClearFilters }: ProductsListProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        <Button onClick={onClearFilters} className="mt-4">
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductsList;
