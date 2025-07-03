import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      await register(email, password, name);
      navigate("/");
    } catch (err) {
      setError(err.detail || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Name<br/>
          <input type="text" value={name} onChange={e=>setName(e.target.value)} required />
        </label><br /><br />
        <label>Email<br/>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </label><br /><br />
        <label>Password<br/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </label><br /><br />
        <button type="submit" className="sg-btn">Register</button>
        {error && <div style={{ color: "red", marginTop: "0.5em" }}>{error}</div>}
      </form>
    </div>
  );
}
