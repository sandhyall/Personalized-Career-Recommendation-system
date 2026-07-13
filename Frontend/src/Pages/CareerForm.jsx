import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ML_URL = "http://localhost:5002";
const API_URL = "http://localhost:8000";

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
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        const res = await axios.get(`${API_URL}/api/profile/${userId}`);
        const p = res.data || {};
        setForm({
          name: p.name || localStorage.getItem("name") || "",
          strength: p.strength || "",
          education: p.education || "",
          skills: p.skills || "",
          interests: p.interests || "",
        });
      } catch (err) {
        console.error("Profile load failed:", err);
        setForm((prev) => ({
          ...prev,
          name: localStorage.getItem("name") || "",
        }));
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.skills.trim().length < 3) {
      setError("Please enter at least one skill (e.g. Python, HTML).");
      return;
    }
    if (form.interests.trim().length < 3) {
      setError(
        "Please enter at least one interest (e.g. AI, Web Development).",
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("You must be logged in to get recommendations.");
        setLoading(false);
        return;
      }

      // Save profile for next login
      await axios.put(`${API_URL}/api/profile/${userId}`, {
        name: form.name.trim(),
        strength: form.strength.trim(),
        education: form.education.trim(),
        skills: form.skills.trim(),
        interests: form.interests.trim(),
      });
      if (form.name.trim()) {
        localStorage.setItem("name", form.name.trim());
      }

      const mlResponse = await fetch(`${ML_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: form.skills.trim(),
          interests: form.interests.trim(),
        }),
      });

      const data = await mlResponse.json();

      if (!mlResponse.ok) {
        throw new Error(data.error || `ML Server error: ${mlResponse.status}`);
      }

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error(
          "No career matches found. Try different skills or interests.",
        );
      }

      await fetch(`${API_URL}/api/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: form.name.trim(),
          strength: form.strength.trim(),
          education: form.education.trim(),
          skills: form.skills.trim(),
          interests: form.interests.trim(),
          recommendations: data,
        }),
      });

      navigate("/result", {
        state: {
          recommendations: data,
          userName: form.name.trim() || "User",
        },
      });
    } catch (err) {
      setError(err.message || "Server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-slate-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg">
        <div className="bg-slate-800 text-white text-center p-6 rounded-t-2xl">
          <h1 className="text-2xl font-bold">Career Navigator</h1>
          <p className="text-sm text-gray-300">
            Get career recommendations
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
            placeholder="Skills (e.g. HTML, CSS, Python)"
            className="w-full p-3 border rounded-md"
            rows="3"
            required
          />

          <textarea
            name="interests"
            value={form.interests}
            onChange={handleChange}
            placeholder="Interests (e.g. AI, Web Development)"
            className="w-full p-3 border rounded-md"
            rows="3"
            required
          />

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-semibold transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
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
