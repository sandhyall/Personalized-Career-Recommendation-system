import { useState } from "react";

function CareerForm() {
  const [name, setName] = useState("");
  const [strength, setStrength] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
  };

  const handleClear = () => {
    setName("");
    setEducation("");
    setSkills("");
    setInterests("");
    setRecommendations([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Career Navigator
          </h1>
          <p className="text-slate-500 mt-2">
            Map your future based on your current expertise.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Alex Rivera"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Strength
            </label>
            <input
              type="text"
              placeholder="e.g. Logic,Coding..."
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Highest Education
            </label>
            <select
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all bg-white appearance-none cursor-pointer"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              required
            >
              <option value="">Choose your level...</option>
              <option value="High School">High School</option>
              <option value="Bachelor's">Bachelor's Degree</option>
              <option value="Master's">Master's Degree</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Skills
              </label>
              <input
                type="text"
                placeholder="Python, React, Logic"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Interests
              </label>
              <input
                type="text"
                placeholder="AI, Design, Stocks"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 px-6 rounded-lg font-bold text-white transition-all transform active:scale-[0.98] ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Get Recommendations"
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-3 border border-slate-200 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CareerForm;
