import React, { useState } from "react";
import { useProducts } from "../context/ProductContext";
import { Link } from "react-router-dom";

export default function ProductCatalogPage() {
  const { products, loading, filters, setFilters } = useProducts();

  return (
    <div>
      <h2>Product Catalog</h2>
      <input
        style={{ padding: "0.4rem", minWidth: 220, marginBottom: 12 }}
        placeholder="Search products..."
        value={filters?.search ?? ""}
        onChange={e => setFilters({ search: e.target.value })}
      />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
          gap: "1.6rem"
        }}>
          {products.map(p =>
            <div key={p.id} style={{
              border: "1px solid #ececec", borderRadius: 6, background: "#fff", padding: 16,
              display: "flex", flexDirection: "column", alignItems: "center"
            }}>
              <img src={p.image_url} alt={p.name}
                style={{ width: "100%", height: "130px", objectFit: "cover", marginBottom: 5, borderRadius: 4 }} />
              <div style={{ fontWeight: "bold" }}>{p.name}</div>
              <div style={{ color: "#666" }}>{p.category_name}</div>
              <div style={{ color: "#0066CC", fontWeight: 500, margin: "0.5em 0" }}>${Number(p.price).toFixed(2)}</div>
              <Link to={`/products/${p.id}`} className="sg-btn" style={{ marginTop: 4 }}>
                View Details
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
