import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cart, loading, updateCartItem, removeCartItem, clearCart } = useCart();
  const navigate = useNavigate();

  // Dev tool: expose cart to window for debugging
  if (typeof window !== "undefined") {
    window.__currentCart = cart;
  }

  if (loading) return <div>Loading cart...</div>;
  if (!cart || !cart.items || cart.items.length === 0)
    return (
      <div style={{ margin: "2rem" }}>
        Cart is empty.
        {typeof window !== "undefined" &&
          window.__cartDebug && window.__cartDebug.length > 0 && (
            <details style={{ marginTop: 16, color: "#888" }}>
              <summary>Debug Info (cart)</summary>
              <pre style={{ fontSize: "0.98em" }}>
                {JSON.stringify(window.__cartDebug, null, 2)}
              </pre>
            </details>
          )}
      </div>
    );

  let total = 0;
  return (
    <div>
      <h2>Your Cart</h2>
      <table style={{ width: "100%", borderSpacing: 0, marginBottom: "1rem" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th>Product</th><th>Size</th><th>Price</th><th>Qty</th><th>Total</th><th></th>
          </tr>
        </thead>
        <tbody>
          {cart.items.map(item => {
            const itemTotal = Number(item.price) * item.quantity;
            total += itemTotal;
            return (
              <tr key={item.id}>
                <td>{item.product_name}</td>
                <td>{item.size || "-"}</td>
                <td>${Number(item.price).toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    onChange={e => updateCartItem(item.id, Number(e.target.value), item.size)}
                    style={{ width: 50 }}
                  />
                </td>
                <td>${itemTotal.toFixed(2)}</td>
                <td>
                  <button className="sg-btn small" onClick={() => removeCartItem(item.id)}>Remove</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <strong>Total: ${total.toFixed(2)}</strong>
      <div style={{ marginTop: "1em" }}>
        <button className="sg-btn" onClick={() => navigate("/checkout")}>Checkout</button>
        <button className="sg-btn small" style={{ marginLeft: 8, background: "#eee", color: "#333" }}
          onClick={clearCart}>Clear Cart</button>
      </div>
      {/* Extra debug info display */}
      {typeof window !== "undefined" &&
        window.__cartDebug && window.__cartDebug.length > 0 && (
          <details style={{ marginTop: 30, color: "#555" }}>
            <summary>Debug Log</summary>
            <pre style={{ fontSize: "0.92em", maxHeight: 300, overflow: "auto" }}>
              {JSON.stringify(window.__cartDebug, null, 2)}
            </pre>
          </details>
        )}
    </div>
  );
}
