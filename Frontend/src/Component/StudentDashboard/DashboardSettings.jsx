import { Link, useNavigate } from "react-router-dom";
import { clearSession, getSession } from "../../utils/api";
import Profile from "../Common/Profile";

export const DashboardSettings = () => {
  const navigate = useNavigate();
  const { name } = getSession();

  const logout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      <p className="text-slate-500 text-sm">Account options for {name}</p>
      <Link
        to="/get-started"
        className="block bg-white border border-slate-200 rounded-2xl p-4 font-semibold text-slate-800 hover:border-indigo-200"
      >
        Retake Career Assessment
      </Link>
      <Link
        to="/result"
        className="block bg-white border border-slate-200 rounded-2xl p-4 font-semibold text-slate-800 hover:border-indigo-200"
      >
        View My Results
      </Link>
      <button
        type="button"
        onClick={logout}
        className="w-full text-left bg-white border border-rose-100 rounded-2xl p-4 font-semibold text-rose-700 hover:bg-rose-50"
      >
        Log out
      </button>
    </div>
  );
};

export const DashboardProfile = () => (
  <div className="-m-2">
    <Profile />
  </div>
);
