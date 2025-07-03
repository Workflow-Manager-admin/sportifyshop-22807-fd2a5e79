import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

// PUBLIC_INTERFACE
const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: null, size: "" });
  const [loading, setLoading] = useState(true);

  // Load categories initially
  useEffect(() => {
    api.getCategories().then((data) => setCategories(data)).catch(() => setCategories([]));
  }, []);

  // Load & refresh products based on filters, refetch every 30 seconds
  useEffect(() => {
    let running = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts({
          q: filters.search, category: filters.category, size: filters.size
        });
        if (running) setProducts(data);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    const interval = setInterval(fetchProducts, 30000); // Real-time price/stock polling
    return () => {
      running = false;
      clearInterval(interval);
    };
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
