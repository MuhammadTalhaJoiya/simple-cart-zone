
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ProductsHeader from "@/components/ProductsHeader";
import ProductsFilter from "@/components/ProductsFilter";
import ProductsList from "@/components/ProductsList";
import { apiClient } from "@/lib/api";

const Products = () => {
  const [filters, setFilters] = useState({
    category: "All",
    priceRange: [0, 1000] as [number, number],
    search: "",
  });
  const [sortBy, setSortBy] = useState("name");

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", filters, sortBy],
    queryFn: () =>
      apiClient.getProducts({
        category: filters.category !== "All" ? filters.category : undefined,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        search: filters.search || undefined,
        sortBy,
        order: "ASC",
      }),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.getCategories(),
  });

  const products = data?.products || [];

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h2>
          <p className="text-gray-600">
            {error instanceof Error ? error.message : "Failed to load products. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductsHeader 
        totalProducts={data?.pagination?.total || 0}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProductsFilter
            categories={categories || []}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
        
        <div className="lg:col-span-3">
          <ProductsList products={products} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Products;
