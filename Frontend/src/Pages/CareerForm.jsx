import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CareerForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const [name, setName] = useState("");
  const [strength, setStrength] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, strength, education, skills, interests }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/result", {
          state: { recommendations: data, userName: name },
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
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-800 p-8 text-white text-center">
          <h1 className="text-3xl font-bold italic">Career Navigator</h1>
          <p className="text-slate-400 mt-2">
            Please fill your details to get AI recommendations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border rounded-xl outline-none focus:border-slate-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Strength"
              className="w-full p-3 border rounded-xl outline-none focus:border-slate-500"
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              required
            />
          </div>

          <input
            type="text"
            placeholder="Education (e.g. BE Computer)"
            className="w-full p-3 border rounded-xl outline-none focus:border-slate-500"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            required
          />

          <textarea
            placeholder="Skills (e.g. React, Python, Data Analysis)"
            className="w-full p-3 border rounded-xl outline-none focus:border-slate-500"
            rows="3"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />

          <textarea
            placeholder="Interests (e.g. AI, Web Development, Design)"
            className="w-full p-3 border rounded-xl outline-none focus:border-slate-500"
            rows="3"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold transition-all ${
              loading
                ? "bg-slate-400"
                : "bg-slate-800 hover:bg-slate-900 text-white shadow-lg"
            }`}
          >
            {loading ? "Analyzing Profile..." : "Get Recommendations"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CareerForm;
