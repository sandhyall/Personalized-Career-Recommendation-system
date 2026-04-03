import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Api = import.meta.env.VITE_SERVERS;

const AdminLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${Api}/login`, {
        email: form.email,
        password: form.password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setMessage(res.data.message);
        navigate("/admin");
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
    } finally {
      setForm({ email: "", password: "" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-2">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded-md">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
