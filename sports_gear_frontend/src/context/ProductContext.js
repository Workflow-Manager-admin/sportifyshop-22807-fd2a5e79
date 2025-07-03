import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

// Sample sports gear products - hardcoded
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: "Nike Air Zoom Pegasus 40",
    description: "Versatile running shoe for road training. Breathable mesh, responsive cushioning.",
    category: "Running Shoes",
    category_name: "Footwear",
    price: 129.99,
    image_url: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
    sizes: ["7", "8", "9", "10", "11", "12"]
  },
  {
    id: 2,
    name: "Adidas Predator Soccer Ball",
    description: "FIFA-certified, textured surface and premium bladder for superior touch.",
    category: "Soccer Balls",
    category_name: "Balls",
    price: 44.95,
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    sizes: ["4", "5"]
  },
  {
    id: 3,
    name: "Wilson US Open Tennis Racket",
    description: "Lightweight graphite racket for all levels. Offers control and power.",
    category: "Tennis Rackets",
    category_name: "Rackets",
    price: 89.00,
    image_url: "https://images.unsplash.com/photo-1434828927397-62ea053f7a35?auto=format&fit=crop&w=400&q=80",
    sizes: ["Regular","XL"]
  },
  {
    id: 4,
    name: "Puma Form Stripe Training Tee",
    description: "Moisture-wicking training shirt for high performance workouts.",
    category: "Apparel",
    category_name: "Clothing",
    price: 32.99,
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 5,
    name: "Under Armour Hustle Backpack",
    description: "Durable and water-resistant backpack ideal for sports and school.",
    category: "Bags",
    category_name: "Equipment",
    price: 54.95,
    image_url: "https://images.unsplash.com/photo-1469398715555-76331a4d8323?auto=format&fit=crop&w=400&q=80",
    sizes: []
  }
];

// Sample categories
const SAMPLE_CATEGORIES = [
  { id: null, name: "All" },
  { id: "Running Shoes", name: "Footwear" },
  { id: "Soccer Balls", name: "Balls" },
  { id: "Tennis Rackets", name: "Rackets" },
  { id: "Apparel", name: "Clothing" },
  { id: "Bags", name: "Equipment" }
];

// PUBLIC_INTERFACE
const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [categories, setCategories] = useState(SAMPLE_CATEGORIES);
  const [filters, setFilters] = useState({ search: "", category: null, size: "" });
  const [loading, setLoading] = useState(false);

  // Loading categories (from backend, but fallback to static if fails)
  useEffect(() => {
    api.getCategories().then((data) => {
      if (Array.isArray(data) && data.length > 0) setCategories([{id: null, name:"All"}, ...data]);
    }).catch(() => {});
  }, []);

  // Filter and fetch products emulation (would normally be from backend API)
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Filter logic
      let filtered = SAMPLE_PRODUCTS;
      if (filters.category) filtered = filtered.filter(p => p.category === filters.category);
      if (filters.search?.trim())
        filtered = filtered.filter(p => p.name.toLowerCase().includes(filters.search.toLowerCase()));
      if (filters.size && filters.size !== "") 
        filtered = filtered.filter(p => (p.sizes || []).includes(filters.size));
      setProducts(filtered);
      setLoading(false);
    }, 200); // slight delay for UI loading state
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
