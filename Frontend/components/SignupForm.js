import { useState } from "react";
import axios from "axios";

export default function SignupForm() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "guest",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5003/api/auth/register", form);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mx-auto">
      <input
        type="text"
        placeholder="Full Name"
        value={form.full_name}
        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <select
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="guest">Guest (User)</option>
        <option value="property">Property Owner</option>
        <option value="admin">Super Admin</option>
      </select>

      <button type="submit">Register</button>
      <p>{message}</p>
    </form>
  );
}
