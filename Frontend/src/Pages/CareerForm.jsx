import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const CareerForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    strength: "",
    education: "",
    skills: "",
    interests: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (response.ok) {
        navigate("/result", {
          state: {
            recommendations: data,
            userName: form.name,
          },
        });
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg">
        <div className="bg-slate-800 text-white text-center p-6 rounded-t-2xl">
          <h1 className="text-2xl font-bold">Career Navigator</h1>
          <p className="text-sm text-gray-300">
            Fill your details for AI recommendation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-3 border rounded-md"
            required
          />

          <input
            name="strength"
            value={form.strength}
            onChange={handleChange}
            placeholder="Strength"
            className="w-full p-3 border rounded-md"
            required
          />

          <input
            name="education"
            value={form.education}
            onChange={handleChange}
            placeholder="Education"
            className="w-full p-3 border rounded-md"
            required
          />

          <textarea
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="Skills"
            className="w-full p-3 border rounded-md"
            rows="3"
            required
          />

          <textarea
            name="interests"
            value={form.interests}
            onChange={handleChange}
            placeholder="Interests"
            className="w-full p-3 border rounded-md"
            rows="3"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-semibold ${
              loading
                ? "bg-gray-400"
                : "bg-slate-800 text-white hover:bg-slate-900"
            }`}
          >
            {loading ? "Analyzing..." : "Get Recommendation"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CareerForm;
