import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CareerForm() {
  const [name, setName] = useState("");
  const [strength, setStrength] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skills: skills,
        interests: interests,
        strengths: strength,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      navigate("/result", {
        state: { recommendations: data, userName: name },
      });
    } else {
      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Server error occurred.");
      }
    }
  } catch (err) {
    console.error(err);
    alert("Failed to get recommendation. Please try again.");
  } finally {
    setLoading(false);
  }

  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 antialiased text-slate-900">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        <div className="bg-slate-700 p-8 text-white text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Career Navigator
          </h1>
          <p className="text-indigo-100 mt-1 opacity-90">
            Discover your path based on your unique skills and passion.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Main Strength
              </label>
              <input
                type="text"
                placeholder="e.g. Problem Solving"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Education
              </label>
              <input
                type="text"
                placeholder="e.g. Bachelor in IT"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Technical Skills
              </label>
              <textarea
                rows="3"
                placeholder="React, Python, SQL..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Interests
              </label>
              <textarea
                rows="3"
                placeholder="Design, AI, Management..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg 
              ${
                loading
                  ? "bg-slate-700 cursor-not-allowed"
                  : "bg-slate-700 hover:bg-indigo-700 text-white hover:shadow-indigo-200 active:scale-[0.98]"
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing Profile...
              </span>
            ) : (
              "Get Career Insights"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CareerForm;
