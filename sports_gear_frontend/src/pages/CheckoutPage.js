import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

const STRIPE_PUBLIC_KEY = "pk_test_51NcfjVIGLWI6xyzZZZZ..."; // TODO: Place actual Stripe publishable key here

function CheckoutForm() {
  const { cart, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);
    if (!stripe || !elements) {
      setError("Stripe is not loaded");
      setProcessing(false);
      return;
    }
    try {
      const card = elements.getElement(CardElement);
      const {error: stripeErr, token} = await stripe.createToken(card);
      if (stripeErr) throw { detail: stripeErr.message };
      await api.checkout({ stripe_token: token.id });
      await clearCart();
      navigate("/orders");
    } catch (err) {
      setError(err.detail || "Checkout error");
    } finally {
      setProcessing(false);
    }
  };

  if (!cart || !cart.items || cart.items.length === 0)
    return <div>Cart is empty.</div>;

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" className="sg-btn" disabled={processing}>Pay</button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </form>
  );
}

export default function CheckoutPage() {
  const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Checkout</h2>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
