//
// API utility for talking to sports_gear_backend.
// Handles auth token management, error processing, and endpoint mapping.
//
/**
 * API endpoint base, configurable via .env (REACT_APP_API_BASE for frontend).
 * For local/dev: fallback is set to the current backend base URL.
 */
const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://vscode-internal-9355-beta.beta01.cloud.kavia.ai:3001";
const JSON_HEADERS = { "Content-Type": "application/json" };

// Utility for managing JWT token in storage
export function getAuthToken() {
  return window.localStorage.getItem("auth_token") || null;
}
export function setAuthToken(token) {
  window.localStorage.setItem("auth_token", token);
}
export function clearAuthToken() {
  window.localStorage.removeItem("auth_token");
}

// For generic API calls with/without auth
async function apiFetch(path, options = {}, requireAuth = false) {
  let headers = { ...(options.headers || {}) };
  if (requireAuth) {
    const token = getAuthToken();
    if (token) headers["Authorization"] = "Bearer " + token;
  }
  const resp = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...JSON_HEADERS, ...headers },
    credentials: "include"
  });
  if (!resp.ok) {
    let detail = "Unknown error";
    try {
      const data = await resp.json();
      detail = data.detail || detail;
    } catch (_) {}
    throw {
      status: resp.status,
      statusText: resp.statusText,
      detail
    };
  }
  if (resp.status === 204) return null; // No Content
  return resp.json();
}

// API WRAPPERS
// PUBLIC_INTERFACE
export const api = {
  // User Auth & Profile
  async register({ email, password, name }) {
    return apiFetch(`/auth/register`, {
      method: "POST",
      body: JSON.stringify({ email, password, name })
    });
  },
  async login({ email, password }) {
    return apiFetch(`/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
  },
  async getProfile() {
    return apiFetch(`/users/me`, {}, true);
  },
  async updateProfile(data) {
    return apiFetch(`/users/me`, {
      method: "PUT",
      body: JSON.stringify(data)
    }, true);
  },

  // Products
  async getProducts(params = {}) {
    // Add cache-buster timestamp to params for every call
    const paramsWithTs = { ...params, _ts: Date.now() };
    let qs = Object.entries(paramsWithTs)
      .filter(([,v]) => v !== undefined && v !== "")
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");
    return apiFetch(`/products${qs ? "?" + qs : ""}`);
  },
  async getProduct(id) {
    // Always refetch, never cache
    return apiFetch(`/products/${id}?_ts=${Date.now()}`);
  },
  // Accepts optional query, otherwise fetches with cache-buster param
  async getCategories(extra = null) {
    // Either override query or use cache-buster
    let path = "/categories";
    if (extra && typeof extra === "string") {
      path += extra.startsWith("?") ? extra : ("?" + extra);
    } else {
      path += `?_ts=${Date.now()}`;
    }
    return apiFetch(path);
  },

  // Cart
  async getCart() {
    return apiFetch(`/cart`, {}, true);
  },
  async addToCart({ product_id, quantity, size }) {
    return apiFetch(`/cart`, {
      method: "POST",
      body: JSON.stringify({ product_id, quantity, size })
    }, true);
  },
  async updateCartItem({ cart_item_id, quantity, size }) {
    return apiFetch(`/cart/${cart_item_id}`, {
      method: "PUT",
      body: JSON.stringify({ quantity, size }),
    }, true);
  },
  async removeCartItem(cart_item_id) {
    return apiFetch(`/cart/${cart_item_id}`, { method: "DELETE" }, true);
  },
  async clearCart() {
    return apiFetch(`/cart/clear`, { method: "POST" }, true);
  },
  // Order & Payment (Stripe)
  async checkout({ stripe_token }) {
    return apiFetch(`/orders/checkout`, {
      method: "POST",
      body: JSON.stringify({ stripe_token })
    }, true);
  },
  async getOrders() {
    return apiFetch(`/orders`, {}, true);
  },
  async getOrder(order_id) {
    return apiFetch(`/orders/${order_id}`, {}, true);
  },
  // For real-time prices and stock (if supported, would use web sockets or polling)
};
