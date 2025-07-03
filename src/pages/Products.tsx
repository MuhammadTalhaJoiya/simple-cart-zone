
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ProductsHeader from "@/components/ProductsHeader";
import ProductsFilter from "@/components/ProductsFilter";
import ProductsList from "@/components/ProductsList";
import { apiClient } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const Products = () => {
  const [filters, setFilters] = useState({
    category: "All",
    priceRange: [0, 1000] as [number, number],
    search: "",
  });
  const [sortBy, setSortBy] = useState("name");

  const { data, isLoading, error, refetch } = useQuery({
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
    retry: 1,
  });

  const { data: categories, error: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.getCategories(),
    retry: 1,
  });

  const products = data?.products || [];

  if (error || categoriesError) {
    const errorMessage = error instanceof Error ? error.message : 
                        categoriesError instanceof Error ? categoriesError.message : 
                        "Failed to load products. Please try again.";
    
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            <div className="space-y-4">
              <p><strong>Connection Error:</strong> {errorMessage}</p>
              {errorMessage.includes('Unable to connect to server') && (
                <div className="text-sm">
                  <p>Possible solutions:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Make sure your backend server is running on http://localhost:5000</li>
                    <li>Check if the server is accepting connections</li>
                    <li>Verify your database connection is working</li>
                  </ul>
                </div>
              )}
              <Button onClick={() => refetch()} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
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
