import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

// PUBLIC_INTERFACE
const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(null);
  const [filters, setFilters] = useState({ search: "", category: null, size: "" });
  const [loading, setLoading] = useState(false);
  const [productError, setProductError] = useState(null);

  // Fetch categories from backend on mount
  useEffect(() => {
    setCategoryLoading(true);
    setCategoryError(null);
    api.getCategories()
      .then((data) => {
        // Only keep Shirt, Trouser, Watches, Shoes
        const allowed = ["Shirt", "Trouser", "Watches", "Shoes"];
        let filtered = [];
        if (Array.isArray(data)) {
          filtered = data.filter(
            (cat) =>
              typeof cat.name === "string" &&
              allowed.includes(cat.name.trim())
          );
          setCategories(filtered);
          setCategoryError(null);
        } else {
          setCategories([]);
          setCategoryError("Could not fetch categories.");
        }
      })
      .catch((err) => {
        setCategories([]);
        setCategoryError(
          err?.detail
            || (typeof err === "string" ? err : "Could not fetch categories.")
        );
      })
      .finally(() => setCategoryLoading(false));
  }, []);

  // Fetch products from backend, whenever filters change
  useEffect(() => {
    setLoading(true);
    setProductError(null);
    // Build API filter params
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.search?.trim()) params.search = filters.search.trim();
    if (filters.size) params.size = filters.size;
    api.getProducts(params)
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
          setProductError(null);
        } else {
          setProducts([]);
          setProductError("Could not fetch products.");
        }
      })
      .catch(err => {
        setProducts([]);
        setProductError(
          err?.detail
            || (typeof err === "string" ? err : "Could not fetch products.")
        );
      })
      .finally(() => setLoading(false));
  }, [filters]);

  // PUBLIC_INTERFACE
  const updateFilter = (updates) => {
    // Only permit a supported category or null.
    const allowed = ["Shirt", "Trouser", "Watches", "Shoes"];
    let next = { ...filters, ...updates };
    if (
      next.category &&
      (!categories || !categories.find(cat => cat.id === next.category))
    ) {
      // If category not in allowed UI categories, reset
      next.category = null;
    }
    setFilters(next);
  };

  return (
    <ProductContext.Provider value={{
      products,
      categories,
      filters,
      loading,
      categoryLoading,
      categoryError,
      productError,
      setFilters: updateFilter
    }}>
      {children}
    </ProductContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useProducts() {
  return useContext(ProductContext);
}
