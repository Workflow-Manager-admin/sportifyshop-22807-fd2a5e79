# ManStyle Hub Frontend

This is the React frontend for **ManStyle Hub**, a stylish ecommerce site dedicated to men's apparel & fashion accessories.

## Features

- **Modern UI**: Minimalist, fashion-centric browsing experience
- **Men's Wardrobe**: Catalog of shirts, trousers, jackets, shoes, belts, wallets, watches, ties, sunglasses, hats and more (no sports gear)
- **INR Pricing**: Showcases Indian Rupee pricing, easy size selection
- **Cart & Orders**: Seamless shopping cart, order review, order history
- **User Accounts**: Secure register, login, and profile management

## Running the Project

See included scripts for running in development (`npm start`) or production (`npm run build`).

## Brand Palette

Main colors are defined in `src/App.css` using CSS variables:

```css
:root {
  --primary: #0066CC;
  --secondary: #FF6600;
  --accent: #009966;
  --bg-primary: #fff;
  --text-primary: #1F2833;
}
```

## Customization

Update categories, homepage banners, or hero sections for fashion seasons or men's style trends!

---

## ⚠️ Troubleshooting API/Product Connectivity

If product data does not load or shows "No products found":
- Ensure your backend (FastAPI) is running and accessible.
- Check that `REACT_APP_API_BASE` in `.env` points to the correct backend URL (see live backend above).
- Confirm that the `/products` API returns a non-empty list via browser or `curl "<backend-url>/products"`.
- Check DevTools → Network for CORS/404/500 errors.
- After changing `.env`, restart frontend dev server.

---
