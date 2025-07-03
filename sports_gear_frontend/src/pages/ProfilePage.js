import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { profile, updateProfile } = useAuth();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(profile || {});
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  if (!profile) return <div>Loading...</div>;

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setError(null); setMessage(null);
    try {
      await updateProfile(form);
      setEdit(false);
      setMessage("Profile updated");
    } catch (err) {
      setError(err.detail || "Update failed");
    }
  }

  return (
    <div style={{ maxWidth: 450 }}>
      <h2>Your Profile</h2>
      <form onSubmit={handleSave}>
        <label>Name<br/>
          <input name="name" value={form.name || ""} disabled={!edit} onChange={handleChange} />
        </label><br /><br/>
        <label>Email<br/>
          <input name="email" value={form.email || ""} disabled />
        </label><br /><br />
        {edit ? (
          <button className="sg-btn" type="submit">Save</button>
        ) : (
          <button className="sg-btn" type="button" onClick={()=>setEdit(true)}>Edit Profile</button>
        )}
        {error && (
          <span style={{ color:"red", marginLeft: 15 }}>
            {typeof error === "string"
              ? error
              : Array.isArray(error)
              ? error.map((e, i) =>
                  typeof e === "string"
                    ? e
                    : e?.msg || e?.message || JSON.stringify(e)
                ).join(", ")
              : error?.msg || error?.message || JSON.stringify(error)}
          </span>
        )}
        {message && <span style={{ color:"green", marginLeft: 15 }}>{message}</span>}
      </form>
    </div>
  );
}
