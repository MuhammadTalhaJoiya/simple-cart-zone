
import { Filter } from 'lucide-react';

interface ProductsFilterProps {
  categories: string[];
  filters: {
    category: string;
    priceRange: [number, number];
    search: string;
  };
  onFiltersChange: (filters: {
    category: string;
    priceRange: [number, number];
    search: string;
  }) => void;
}

const ProductsFilter = ({
  categories,
  filters,
  onFiltersChange
}: ProductsFilterProps) => {
  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category
    });
  };

  const handlePriceRangeChange = (maxPrice: number) => {
    onFiltersChange({
      ...filters,
      priceRange: [0, maxPrice]
    });
  };

  return (
    <div className="lg:w-64 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </h3>
        
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
          <div className="space-y-2">
            <button
              onClick={() => handleCategoryChange("All")}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                filters.category === "All"
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  filters.category === category
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
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceRangeChange(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>$0</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsFilter;
