import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api";
import { useAuth } from "./AuthContext";

// PUBLIC_INTERFACE
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load cart when user logs in
  useEffect(() => {
    if (!user) {
      setCart(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    api.getCart().then((data) => setCart(data)).catch(() => setCart(null)).finally(() => setLoading(false));
  }, [user]);

  // PUBLIC_INTERFACE
  const refreshCart = async () => {
    if (!user) return setCart(null);
    setLoading(true);
    try {
      const data = await api.getCart();
      setCart(data);
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const addToCart = async (product_id, quantity, size) => {
    await api.addToCart({ product_id, quantity, size });
    await refreshCart();
  };

  // PUBLIC_INTERFACE
  const updateCartItem = async (cart_item_id, quantity, size) => {
    await api.updateCartItem({ cart_item_id, quantity, size });
    await refreshCart();
  };

  // PUBLIC_INTERFACE
  const removeCartItem = async (cart_item_id) => {
    await api.removeCartItem(cart_item_id);
    await refreshCart();
  };

  // PUBLIC_INTERFACE
  const clearCart = async () => {
    await api.clearCart();
    await refreshCart();
  };

  return (
    <CartContext.Provider value={{
      cart, loading,
      addToCart, updateCartItem, removeCartItem, clearCart, refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useCart() {
  return useContext(CartContext);
}
