import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrders().then(setOrders).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>Order History</h2>
      {loading ? <div>Loading...</div> : (
        orders.length === 0 ?
          <div>No orders yet.</div> :
          <table style={{ width: "100%", marginTop: 12 }}>
            <thead>
              <tr><th>ID</th><th>Date</th><th>Status</th><th>Total</th></tr>
            </thead>
            <tbody>
              {orders.map(o =>
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.date}</td>
                  <td>{o.status}</td>
                  <td>${Number(o.total).toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
      )}
    </div>
  );
}
