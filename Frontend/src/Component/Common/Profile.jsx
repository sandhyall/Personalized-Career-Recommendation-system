import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Mail,
  ShieldCheck,
  LogOut,
  Fingerprint,
  Calendar,
  Save,
  Briefcase,
  GraduationCap,
  Sparkles,
  Heart,
} from "lucide-react";

const API_URL = "http://localhost:8000";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    strength: "",
    education: "",
    skills: "",
    interests: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || userId === "undefined") {
        setError("Invalid Session. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/profile/${userId}`);
        if (res.data) {
          setUser(res.data);
          setForm({
            name: res.data.name || "",
            strength: res.data.strength || "",
            education: res.data.education || "",
            skills: res.data.skills || "",
            interests: res.data.interests || "",
          });
        }
      } catch (err) {
        console.error("Fetch Error:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Server connection failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setSaving(true);
    try {
      const res = await axios.put(`${API_URL}/api/profile/${userId}`, form);
      setUser(res.data.user);
      if (form.name.trim()) localStorage.setItem("name", form.name.trim());
      setMessage("Profile updated.");
    } catch (err) {
      setMessage(err.response?.data?.error || "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const userInitial = (form.name || user?.email || "U").charAt(0).toUpperCase();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <p className="text-red-500 font-bold mb-4">{error}</p>
        <button
          onClick={handleLogout}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl"
        >
          Back to Login
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-lg mx-auto bg-white shadow-2xl rounded-[2.5rem] overflow-hidden">
        <div className="h-32 bg-indigo-600"></div>

        <div className="px-8 pb-10">
          <div className="relative -mt-16 mb-6 flex justify-center">
            <div className="h-32 w-32 bg-white p-2 rounded-full shadow-xl">
              <div className="h-full w-full bg-indigo-50 rounded-full flex items-center justify-center text-5xl font-black text-indigo-600">
                {userInitial}
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">
              {form.name || user?.name}
            </h1>
            <p className="text-indigo-500 text-xs font-bold uppercase tracking-widest mt-1 flex items-center justify-center gap-1">
              <ShieldCheck size={14} /> Verified Account
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <Mail size={20} className="text-indigo-600" />
              <div className="flex-1 truncate">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Email</p>
                <p className="text-sm font-semibold text-gray-700">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <Fingerprint size={20} className="text-indigo-600" />
              <div className="flex-1 truncate">
                <p className="text-[10px] font-bold text-gray-400 uppercase">System ID</p>
                <p className="text-[10px] font-mono text-gray-500">{user?._id}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <Calendar size={20} className="text-indigo-600" />
              <div className="flex-1 truncate">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Joined On</p>
                <p className="text-sm font-semibold text-gray-700">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-3 border-t border-slate-100 pt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
              Career details
            </p>

            <label className="block text-xs font-semibold text-slate-600">
              <span className="inline-flex items-center gap-1 mb-1">
                <Briefcase size={12} /> Full Name
              </span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full mt-1 p-3 border border-slate-200 rounded-xl text-sm"
                required
              />
            </label>

            <label className="block text-xs font-semibold text-slate-600">
              <span className="inline-flex items-center gap-1 mb-1">
                <Sparkles size={12} /> Strength
              </span>
              <input
                name="strength"
                value={form.strength}
                onChange={handleChange}
                placeholder="e.g. Problem solving"
                className="w-full mt-1 p-3 border border-slate-200 rounded-xl text-sm"
              />
            </label>

            <label className="block text-xs font-semibold text-slate-600">
              <span className="inline-flex items-center gap-1 mb-1">
                <GraduationCap size={12} /> Education
              </span>
              <input
                name="education"
                value={form.education}
                onChange={handleChange}
                placeholder="e.g. BS Computer Science"
                className="w-full mt-1 p-3 border border-slate-200 rounded-xl text-sm"
              />
            </label>

            <label className="block text-xs font-semibold text-slate-600">
              Skills
              <textarea
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="HTML, CSS, JavaScript, React"
                rows={2}
                className="w-full mt-1 p-3 border border-slate-200 rounded-xl text-sm"
              />
            </label>

            <label className="block text-xs font-semibold text-slate-600">
              <span className="inline-flex items-center gap-1 mb-1">
                <Heart size={12} /> Interests
              </span>
              <textarea
                name="interests"
                value={form.interests}
                onChange={handleChange}
                placeholder="Web Development, UI Design"
                rows={2}
                className="w-full mt-1 p-3 border border-slate-200 rounded-xl text-sm"
              />
            </label>

            {message && (
              <p className="text-sm text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Save size={18} /> {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>

          <button
            onClick={handleLogout}
            className="mt-4 w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Logout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
