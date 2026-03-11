import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Database,
  MessageSquare,
  LogOut,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/adminlogin");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold  text-blue-400">AdminPanel</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavLink to="/admin/overview" className={navLinkClass}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/users" className={navLinkClass}>
            <Users size={20} />
            <span>User Management</span>
          </NavLink>

          <NavLink to="/admin/careers" className={navLinkClass}>
            <Database size={20} />
            <span>Career Data</span>
          </NavLink>

          <NavLink to="/admin/feedback" className={navLinkClass}>
            <MessageSquare size={20} />
            <span>Feedback</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
