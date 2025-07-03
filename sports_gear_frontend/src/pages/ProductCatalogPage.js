import React from "react";
import { useProducts } from "../context/ProductContext";
import { Link } from "react-router-dom";

export default function ProductCatalogPage() {
  const { products, loading, filters, setFilters } = useProducts();

  return (
    <div style={{ maxWidth: '1260px', margin: "0 auto" }}>
      <h2 style={{
        fontSize: "2rem", fontWeight: 700, marginBottom: "1.2rem",
        color: "var(--primary)"
      }}>
        Explore Sports Gear
      </h2>
      <input
        style={{
          padding: "0.65rem 1rem",
          border: "1.5px solid var(--border-color)",
          borderRadius: 7,
          minWidth: 270,
          background: "#f6f8fa",
          fontSize: "1rem",
          color: "#222",
          outline: "none",
          marginBottom: 18,
          marginRight: 16,
          boxShadow: "none"
        }}
        placeholder="Search products..."
        value={filters?.search ?? ""}
        onChange={e => setFilters({ search: e.target.value })}
      />
      {loading ? (
        <div style={{ marginTop: "2rem" }}>Loading...</div>
      ) : products.length === 0 ? (
        <div style={{ marginTop: "2rem", color: "gray" }}>No products found.</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
            gap: "2rem"
          }}
        >
          {products.map(p => (
            <div
              key={p.id}
              style={{
                border: "1.5px solid #ececec",
                borderRadius: 10,
                background: "#fff",
                padding: 18,
                boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: 335,
                transition: "box-shadow .18s, border-color .18s"
              }}
            >
              <img
                src={p.image_url}
                alt={p.name}
                style={{
                  width: "95%",
                  height: "145px",
                  objectFit: "cover",
                  marginBottom: 10,
                  borderRadius: 6,
                  background: "#f5f7fa"
                }}
              />
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "1.07rem",
                  textAlign: "center",
                  marginBottom: 3,
                  color: "#232d38"
                }}
              >
                {p.name}
              </div>
              <div style={{
                color: "#757d87",
                fontSize: ".96rem",
                marginBottom: 4
              }}>
                {p.category_name}
              </div>
              {Array.isArray(p.sizes) && p.sizes.length > 0 &&
                <div
                  style={{
                    fontSize: ".9rem",
                    color: "#888", margin: "5px 0 5px"
                  }}
                >
                  Sizes:&nbsp;
                  <span style={{ color: "var(--primary)", fontWeight: 500 }}>
                    {p.sizes.join(", ")}
                  </span>
                </div>
              }
              <div style={{
                color: "var(--primary)",
                fontWeight: 600,
                fontSize: "1.2rem",
                margin: "0.2em 0 0.6em"
              }}>
                ₹{Number(p.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <Link
                to={`/products/${p.id}`}
                className="sg-btn"
                style={{
                  marginTop: "auto",
                  minWidth: 100,
                  fontWeight: 500,
                  fontSize: ".98rem",
                  borderRadius: 5
                }}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
