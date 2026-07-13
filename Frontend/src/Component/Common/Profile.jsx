import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  ShieldCheck,
  LogOut,
  Fingerprint,
  Calendar,
} from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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

        const res = await axios.get(
          `http://localhost:8000/api/profile/${userId}`,
        );

        if (res.data) {
          setUser(res.data);
          console.log("Logged in as:", res.data.name);
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

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const userInitial = (user?.name || user?.email || "U")
    .charAt(0)
    .toUpperCase();

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
      <div className="max-w-md mx-auto bg-white shadow-2xl rounded-[2.5rem] overflow-hidden">
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
              {user?.name}
            </h1>
            <p className="text-indigo-500 text-xs font-bold uppercase tracking-widest mt-1 flex items-center justify-center gap-1">
              <ShieldCheck size={14} /> Verified Account
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="text-indigo-600">
                <Mail size={20} />
              </div>
              <div className="flex-1 truncate">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  Email
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="text-indigo-600">
                <Fingerprint size={20} />
              </div>
              <div className="flex-1 truncate">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  System ID
                </p>
                <p className="text-[10px] font-mono text-gray-500">
                  {user?._id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="text-indigo-600">
                <Calendar size={20} />
              </div>
              <div className="flex-1 truncate">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  Joined On
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-10 w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Logout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
