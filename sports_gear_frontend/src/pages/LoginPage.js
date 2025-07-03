import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.detail || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email<br/>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </label><br /><br />
        <label>Password<br/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </label><br /><br />
        <button type="submit" className="sg-btn">Login</button>
        {error && <div style={{ color: "red", marginTop: "0.5em" }}>{error}</div>}
      </form>
    </div>
  );
}
