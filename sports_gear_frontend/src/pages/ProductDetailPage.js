import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useCart } from "../context/CartContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.getProduct(id).then(setProduct).catch(() => setProduct(null));
  }, [id]);

  if (!product) return <div>Loading...</div>;

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
    <div>
      <h2>{product.name}</h2>
      <img src={product.image_url} alt={product.name} style={{ width: "270px", height: "220px", objectFit: "cover", borderRadius: 8 }} />
      <div>{product.description}</div>
      <div style={{ margin: "1em 0", color: "#0066CC" }}>${Number(product.price).toFixed(2)}</div>
      <div>
        {sizes.length > 0 && (
          <>
            <label>
              Size:&nbsp;
              <select value={size} onChange={e => setSize(e.target.value)}>
                <option value="">Select</option>
                {sizes.map(sz => <option value={sz} key={sz}>{sz}</option>)}
              </select>
            </label>
            <br />
          </>
        )}
        <label>
          Qty:&nbsp;
          <input type="number" min={1} value={qty} onChange={e=>setQty(e.target.value)} style={{ width: 60 }} />
        </label>
        <br /><br />
        <button className="sg-btn" onClick={handleAdd}>Add to Cart</button>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      </div>
    </div>
  );
}
