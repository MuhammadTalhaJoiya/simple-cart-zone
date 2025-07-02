
import { Grid, List } from 'lucide-react';

interface ProductsHeaderProps {
  totalProducts: number;
  sortBy: string;
  onSortChange: (value: string) => void;
}

const ProductsHeader = ({
  totalProducts,
  sortBy,
  onSortChange,
}: ProductsHeaderProps) => {
  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'created_at', label: 'Newest First' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-gray-600">
          Showing {totalProducts} products
        </p>
        
        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductsHeader;
