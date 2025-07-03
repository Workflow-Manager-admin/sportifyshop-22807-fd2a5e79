import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

// PUBLIC_INTERFACE
const ProductContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * Utility to forcibly clear any possible legacy product/category info
 * from localStorage and sessionStorage. This guarantees there is no persistence
 * across reloads or sessions, eliminating stale product/category risk.
 */
function purgeLegacyProductCache() {
  // These keys may have been used in historical or 3rd-party boilerplate.
  // We remove them on every app load to ensure a clean slate.
  [
    "products",
    "categories",
    "productList",
    "cachedProducts",
    "cachedCategories",
    // Also clear possible variations you may want to futureproof for:
    "PRODUCTS",
    "CATEGORIES",
    "PROD_CACHE",
    "_productCache",
    "_categoryCache",
    "ms_products",
    "ms_categories"
  ].forEach((key) => {
    try {
      window.localStorage.removeItem(key);
    } catch (_) {}
    try {
      window.sessionStorage.removeItem(key);
    } catch (_) {}
  });
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(null);
  // Always reset filters on app/page load to prevent product staleness
  const [filters, setFilters] = useState({ search: "", category: null, size: "" });
  const [loading, setLoading] = useState(false);
  const [productError, setProductError] = useState(null);

  /**
   * On initial mount, forcibly clear any possible persisted/cached product
   * or category data from both storages. This guarantees stateless context.
   */
  useEffect(() => {
    purgeLegacyProductCache();
  }, []);

  /**
   * Fetch categories straight from backend on *every* provider mount.
   * Never cache, never re-use. This ensures you always see up-to-date backend data.
   */
  useEffect(() => {
    setCategoryLoading(true);
    setCategoryError(null);

    // Add cache-busting param to avoid browser cache just in case.
    const bustParam = `_ts=${Date.now()}`;

    api.getCategories(`${bustParam ? "?" + bustParam : ""}`)
      .then((data) => {
        // Allowed: Shirt, Trouser, Watches, Shoes
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
  }, []); // Always re-fetch categories from backend on mount

  /**
   * Always fetch latest products from backend whenever *filters* change.
   * No local state or persistence/caching is kept, so each filter change is guaranteed fresh.
   */
  useEffect(() => {
    setLoading(true);
    setProductError(null);

    // Build API filter params and add cache-busting param
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.search?.trim()) params.search = filters.search.trim();
    if (filters.size) params.size = filters.size;
    params._ts = Date.now(); // cache-busting query param for safety

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
    // eslint-disable-next-line
  }, [filters]); // Triggers new fetch EVERY TIME filters change

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

  // Products and categories will *always* be memory-only, never cached anywhere.
  // No localStorage/sessionStorage use is permitted for any product/category state.

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
