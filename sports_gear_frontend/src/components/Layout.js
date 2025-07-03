import React from "react";
import { Link } from "react-router-dom";
import "./Layout.css";
import { useProducts } from "../context/ProductContext";

export function Header({ user, onLogout }) {
  return (
    <header className="sg-header">
      <nav className="sg-navbar">
        <Link to="/" className="sg-brand">ManStyle Hub</Link>
        <div className="sg-navlinks">
          <Link to="/products">Shop</Link>
          <Link to="/cart">Cart</Link>
          {user ? (
            <>
              <Link to="/orders">My Orders</Link>
              <Link to="/profile">Profile</Link>
              <button onClick={onLogout} className="sg-btn small">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

/* Duplicate import removed */

export function Sidebar({ categories: propCategories, onSelect, selected }) {
  // Accept propCategories for legacy but prefer context for error/loading
  const { categoryLoading, categoryError, categories } = useProducts();
  // Only allow whitelisted categories (UI-level double check)
  const allowed = ["Shirt", "Trouser", "Watches", "Shoes"];
  const cats = (Array.isArray(categories) && categories.length > 0
    ? categories
    : (Array.isArray(propCategories) ? propCategories : [])
  ).filter(cat =>
    typeof cat.name === "string" && allowed.includes(cat.name.trim())
  );

  return (
    <aside className="sg-sidebar">
      <div className="sg-sidebar-title">Categories</div>
      {categoryLoading ? (
        <div style={{ color: "#888", margin: "1em 0" }}>Loading...</div>
      ) : categoryError ? (
        <div style={{ color: "red", margin: "1em 0", fontWeight: 500 }}>
          {categoryError}
        </div>
      ) : (
        <ul className="sg-category-list">
          {cats.length > 0 ? (
            cats.map(cat =>
              <li key={cat.id}>
                <button
                  className={`sg-category-btn${selected === cat.id ? " active" : ""}`}
                  onClick={() => onSelect(cat.id)}
                >{cat.name}</button>
              </li>
            )
          ) : (
            <li>
              <span style={{ color: "#888" }}>No categories</span>
            </li>
          )}
        </ul>
      )}
    </aside>
  );
}

export function Footer() {
  return (
    <footer className="sg-footer">
      <p>&copy; {new Date().getFullYear()} ManStyle Hub – Exclusive Men's Apparel & Accessories. All rights reserved.</p>
    </footer>
  );
}
