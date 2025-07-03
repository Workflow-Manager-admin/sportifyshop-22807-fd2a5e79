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
      // Improve error feedback if fields are missing (FastAPI returns a list of error objects)
      if (Array.isArray(err?.detail)) {
        // Compose 'field: msg' per error for known fields
        const msgs = err.detail
          .filter(e => typeof e.msg === "string")
          .map(e => {
            let field = "";
            if (Array.isArray(e.loc) && e.loc.length > 0) {
              field = e.loc[e.loc.length - 1];
            }
            return `${field ? `${field}: ` : ""}${e.msg}`;
          });
        setError(msgs.length ? msgs : "Field required");
      } else {
        setError(err?.detail || "Login failed");
      }
    }
  };

  // Utility: render error string or multiple errors as list
  function renderError(error) {
    if (typeof error === "string") return error;
    if (Array.isArray(error))
      return (
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          {error.map((e, idx) =>
            <li key={idx}>{typeof e === "string" ? e : e?.msg || e?.message || JSON.stringify(e)}</li>
          )}
        </ul>
      );
    return error?.msg || error?.message || JSON.stringify(error);
  }

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label>Email<br/>
          <input
            type="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
            aria-required="true"
            aria-label="Email"
          />
        </label>
        {error && typeof error !== "string" && Array.isArray(error) && error.some(e => (e+"").toLowerCase().includes("email")) &&
          <span style={{ color: "red", fontSize: 13 }}>{error.find(e => (e+"").toLowerCase().includes("email"))}</span>
        }
        <br /><br />
        <label>Password<br/>
          <input
            type="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            required
            aria-required="true"
            aria-label="Password"
          />
        </label>
        {error && typeof error !== "string" && Array.isArray(error) && error.some(e => (e+"").toLowerCase().includes("password")) &&
          <span style={{ color: "red", fontSize: 13 }}>{error.find(e => (e+"").toLowerCase().includes("password"))}</span>
        }
        <br /><br />
        <button type="submit" className="sg-btn">Login</button>
        {error && !(Array.isArray(error) && error.some(e =>
           ["email", "password"].some(fld => (e+"").toLowerCase().includes(fld)))
         ) &&
          <div style={{ color: "red", marginTop: "0.5em" }}>{renderError(error)}</div>
        }
      </form>
    </div>
  );
}
