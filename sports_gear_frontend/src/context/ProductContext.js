import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

// PUBLIC_INTERFACE
const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: null, name: "All" }]);
  const [filters, setFilters] = useState({ search: "", category: null, size: "" });
  const [loading, setLoading] = useState(false);

  // Fetch categories from backend on mount
  useEffect(() => {
    api.getCategories().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setCategories([{ id: null, name: "All" }, ...data]);
      }
    }).catch(() => {});
  }, []);

  // Fetch products from backend, whenever filters change
  useEffect(() => {
    setLoading(true);
    // Build API filter params
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.search?.trim()) params.search = filters.search.trim();
    if (filters.size) params.size = filters.size;
    api.getProducts(params)
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [filters]);

  // PUBLIC_INTERFACE
  const updateFilter = (updates) => setFilters(f => ({ ...f, ...updates }));

  return (
    <ProductContext.Provider value={{
      products, categories, filters, loading, setFilters: updateFilter
    }}>
      {children}
    </ProductContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useProducts() {
  return useContext(ProductContext);
}
