import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useCart } from "../context/CartContext";

// Helper for pretty error check
function isApiError(obj) {
  return obj && typeof obj === "object"
    && Array.isArray(obj?.loc)
    && typeof obj.msg === "string"
    && (obj.hasOwnProperty("type") || obj.hasOwnProperty("msg"));
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.getProduct(id)
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setProduct(err); // Could be an error object or null
        setLoading(false);
      });
  }, [id]);

  // Product not found or error
  if (loading) {
    return (
      <div style={{ margin: "3.5rem auto", color: "#ababab" }}>Loading...</div>
    );
  }

  // Check for error object from backend (including FastAPI validation errors)
  if (
    product === null ||
    isApiError(product) ||
    (product && product.detail && typeof product.detail === "string"))
  {
    const message =
      (product && product.detail)
        || (product && product.msg)
        || "Product not found or there was a problem loading the product.";
    return (
      <div style={{
        margin: "3.5rem auto",
        color: "red",
        fontWeight: 500,
        maxWidth: 550,
        background: "#fff7f8",
        border: "1.5px solid #efc7c7",
        padding: "2rem 1.3rem",
        borderRadius: 10,
        textAlign: "center"
      }}>{message}</div>
    );
  }

  const sizes = product.sizes || [];

  async function handleAdd() {
    setError(null);
    if (sizes.length > 0 && !size) {
      setError("Please select a size.");
      return;
    }
    try {
      await addToCart(product.id, Number(qty), size || undefined);
      navigate("/cart");
    } catch (err) {
      setError(err.detail || "Error adding to cart");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 50,
        alignItems: "start",
        background: "#fff",
        borderRadius: 12,
        padding: "2.5rem 2.5rem 2rem",
        boxShadow: "0 2px 16px 0 rgba(0,0,0,0.05)",
        maxWidth: 900,
        margin: "2.2rem auto"
      }}
    >
      <img
        src={product.image_url}
        alt={product.name}
        style={{
          width: 320,
          height: 260,
          objectFit: "cover",
          borderRadius: 11,
          background: "#f5f5f5",
          boxShadow: "0 0 1px #ddd"
        }}
      />
      <div style={{ minWidth: 270, flex: 1 }}>
        <h2 style={{
          fontWeight: 700,
          fontSize: "2rem",
          color: "var(--primary)",
          margin: 0,
          marginBottom: 10
        }}>{product.name}</h2>
        <div style={{
          color: "#898d99",
          fontSize: "1.04rem",
          marginBottom: 3
        }}>{product.category_name}</div>
        <div style={{
          margin: "1.1em 0",
          color: "var(--primary)",
          fontSize: "1.4rem",
          fontWeight: 700
        }}>
          ₹{Number(product.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </div>
        <p
          style={{
            color: "#444",
            fontSize: "1.07rem",
            margin: "9px 0 21px"
          }}
        >
          {product.description}
        </p>
        <form
          onSubmit={e => { e.preventDefault(); handleAdd(); }}
          style={{ marginBottom: 0 }}
        >
          {sizes.length > 0 && (
            <div style={{ margin: "0 0 1.2em" }}>
              <label style={{ fontWeight: 500, marginRight: 5 }}>
                Size:
              </label>
              <select
                value={size}
                onChange={e => setSize(e.target.value)}
                style={{
                  border: "1.5px solid #ddd",
                  borderRadius: 6,
                  padding: "0.45em 1.1em 0.45em 0.75em",
                  marginRight: 8,
                  fontSize: "1rem",
                  color: size ? "#202822" : "#7c7c7c"
                }}
                required={sizes.length > 0}
              >
                <option value="">Select size</option>
                {sizes.map(sz => (
                  <option value={sz} key={sz}>{sz}</option>
                ))}
              </select>
            </div>
          )}
          <div style={{ marginBottom: 15 }}>
            <label style={{ fontWeight: 500 }}>Qty:&nbsp;</label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={e => setQty(e.target.value)}
              style={{
                width: 70,
                border: "1.3px solid #ccc",
                borderRadius: 5,
                padding: "0.39em 0.7em",
                fontSize: "1rem"
              }}
              required
            />
          </div>
          <button className="sg-btn" style={{
            fontWeight: 600,
            fontSize: "1.1rem",
            borderRadius: 6,
            minWidth: 150
          }} type="submit">
            Add to Cart
          </button>
          {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
        </form>
      </div>
    </div>
  );
}
