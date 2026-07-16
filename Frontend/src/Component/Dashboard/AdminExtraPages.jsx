import { useEffect, useState } from "react";
import { Trash2, Loader2, Users, RefreshCw } from "lucide-react";
import { API_URL } from "../../utils/api";

export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/api/admin/users/list`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg || "Failed to load users");
      }
      setUsers(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (user) => {
    const ok = window.confirm(
      `Delete ${user.name} (${user.email})?\n\nThis also removes their progress, recommendations, and project submissions.`
    );
    if (!ok) return;

    try {
      setDeletingId(user._id);
      const res = await fetch(`${API_URL}/api/admin/users/delete/${user._id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.msg || "Delete failed");
      }
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
    } catch (err) {
      alert(err.message || "Could not delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (value) => {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return "—";
    }
  };

  return (
    <div className="max-w-6xl space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">
            Admin
          </p>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">
            User Management
          </h1>
          <p className="text-slate-500 mt-2">
            Registered students who can log in to the system.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <Users size={18} className="text-indigo-500" />
            All Users
          </div>
          <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 rounded-full text-slate-600">
            {users.length} {users.length === 1 ? "user" : "users"}
          </span>
        </div>

        {error && (
          <p className="m-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
            {error}
          </p>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
            <Loader2 className="animate-spin" size={20} />
            Loading users...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">Email</th>
                  <th className="px-6 py-3 font-semibold">Education</th>
                  <th className="px-6 py-3 font-semibold">Joined</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-sm text-slate-400"
                    >
                      No users found yet.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/70">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {user.name || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {user.education || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          disabled={deletingId === user._id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                          title="Delete user"
                        >
                          {deletingId === user._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
