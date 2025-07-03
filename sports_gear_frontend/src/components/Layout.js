import React from "react";
import { Link } from "react-router-dom";
import "./Layout.css";

export function Header({ user, onLogout }) {
  return (
    <header className="sg-header">
      <nav className="sg-navbar">
        <Link to="/" className="sg-brand">Sportify Shop</Link>
        <div className="sg-navlinks">
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
          {user ? (
            <>
              <Link to="/orders">Orders</Link>
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

export function Sidebar({ categories, onSelect, selected }) {
  return (
    <aside className="sg-sidebar">
      <div className="sg-sidebar-title">Categories</div>
      <ul className="sg-category-list">
        <li>
          <button
            className={`sg-category-btn${!selected ? " active" : ""}`}
            onClick={() => onSelect(null)}
          >All</button>
        </li>
        {categories.map(cat =>
          <li key={cat.id}>
            <button
              className={`sg-category-btn${selected === cat.id ? " active" : ""}`}
              onClick={() => onSelect(cat.id)}
            >{cat.name}</button>
          </li>
        )}
      </ul>
    </aside>
  );
}

export function Footer() {
  return (
    <footer className="sg-footer">
      <p>&copy; {new Date().getFullYear()} Sportify Shop. All rights reserved.</p>
    </footer>
  );
}
