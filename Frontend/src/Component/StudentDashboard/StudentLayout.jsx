import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  ClipboardList,
  FolderGit2,
  Gauge,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { clearSession } from "../../utils/api";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
    isActive
      ? "bg-indigo-600 text-white shadow-md"
      : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;

const StudentLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-indigo-400">Student Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Career Recommendation</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <NavLink to="/dashboard" end className={linkClass}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/dashboard/career" className={linkClass}>
            <Briefcase size={18} />
            <span>Career Recommendation</span>
          </NavLink>
          <NavLink to="/dashboard/learning" className={linkClass}>
            <BookOpen size={18} />
            <span>Learning Resources</span>
          </NavLink>
          <NavLink to="/dashboard/challenges" className={linkClass}>
            <ClipboardList size={18} />
            <span>Practice Challenges</span>
          </NavLink>
          <NavLink to="/dashboard/projects" className={linkClass}>
            <FolderGit2 size={18} />
            <span>Projects</span>
          </NavLink>
          <NavLink to="/dashboard/progress" className={linkClass}>
            <Gauge size={18} />
            <span>Progress</span>
          </NavLink>
          <NavLink to="/dashboard/profile" className={linkClass}>
            <User size={18} />
            <span>Profile</span>
          </NavLink>
          <NavLink to="/dashboard/settings" className={linkClass}>
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
