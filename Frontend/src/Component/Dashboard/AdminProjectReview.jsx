import { useCallback, useEffect, useState } from "react";
import {
  API_URL,
  adminApproveProjectApi,
  adminListProjectsApi,
  adminRejectProjectApi,
  projectStatusLabel,
} from "../../utils/api";

function toHref(url) {
  if (!url) return "#";
  const trimmed = String(url).trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

const AdminProjectReview = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("pending_review");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [feedbackMap, setFeedbackMap] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async (status = filter) => {
    setLoading(true);
    setError("");
    try {
      const rows = await adminListProjectsApi(
        status === "all" ? "" : status
      );
      setProjects(Array.isArray(rows) ? rows : []);
    } catch (err) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load(filter);
  }, [filter, load]);

  const approve = async (id) => {
    setBusyId(id);
    setError("");
    setSuccess("");
    try {
      const result = await adminApproveProjectApi(id, {
        adminName: localStorage.getItem("adminName") || "Admin",
        feedback: feedbackMap[id] || "Approved — next career path unlocked.",
      });
      setSuccess(
        result.nextUnlocked
          ? result.message ||
              "Approved. Next career path unlocked."
          : result.message ||
              "Approved. Next path unlocks only after ALL practice challenges AND the final project are approved."
      );
      await load(filter);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  };

  const reject = async (id) => {
    setBusyId(id);
    setError("");
    setSuccess("");
    try {
      await adminRejectProjectApi(id, {
        adminName: localStorage.getItem("adminName") || "Admin",
        feedback:
          feedbackMap[id] ||
          "Please revise your submission and try again.",
      });
      setSuccess("Project rejected. Student can edit and resubmit.");
      await load(filter);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">
            Projects
          </p>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">
            Project Review
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Approve submissions to unlock the student’s next career path.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="pending_review">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All</option>
          </select>
          <button
            type="button"
            onClick={() => load(filter)}
            className="px-3 py-2 text-sm font-semibold border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
          {success}
        </p>
      )}

      {loading ? (
        <p className="text-slate-500">Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500 shadow-sm">
          No projects found for this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((p) => (
            <div
              key={p._id}
              className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {p.projectTitle}
                  </h2>
                  <p className="text-xs font-bold uppercase text-indigo-600 mt-1">
                    {p.submissionType === "challenge"
                      ? `Practice challenge${p.challengeId ? `: ${p.challengeId}` : ""}`
                      : "Final project"}
                  </p>
                  <p className="text-sm text-slate-600">
                    Student: <strong>{p.studentName}</strong>
                    {p.studentEmail ? ` · ${p.studentEmail}` : ""}
                  </p>
                  <p className="text-sm text-slate-600">
                    Recommended Career: <strong>{p.careerName}</strong>
                  </p>
                </div>
                <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                  {projectStatusLabel(p.status)}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm mb-3">
                <a
                  href={toHref(p.githubUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline break-all font-medium"
                >
                  Open GitHub →
                </a>
                <a
                  href={toHref(p.liveDemoUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline break-all font-medium"
                >
                  Open Live Demo →
                </a>
              </div>

              {p.screenshot && (
                <img
                  src={
                    p.screenshot.startsWith("http")
                      ? p.screenshot
                      : `${API_URL}${p.screenshot}`
                  }
                  alt="Screenshot"
                  className="max-h-40 rounded-xl border border-slate-200 mb-3"
                />
              )}

              <p className="text-xs text-slate-400 mb-3">
                Submitted:{" "}
                {p.submittedAt
                  ? new Date(p.submittedAt).toLocaleString()
                  : "—"}
              </p>

              {p.status === "pending_review" && (
                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <textarea
                    placeholder="Feedback (shown to student on reject)"
                    value={feedbackMap[p._id] || ""}
                    onChange={(e) =>
                      setFeedbackMap((m) => ({ ...m, [p._id]: e.target.value }))
                    }
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                    rows={2}
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busyId === p._id}
                      onClick={() => approve(p._id)}
                      className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {busyId === p._id
                        ? "Working..."
                        : "Approve & Unlock Next Career"}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === p._id}
                      onClick={() => reject(p._id)}
                      className="px-5 py-2.5 bg-rose-600 text-white text-sm font-bold rounded-xl hover:bg-rose-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {p.feedback && p.status !== "pending_review" && (
                <p className="text-sm text-slate-600 mt-2">
                  Feedback: {p.feedback}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProjectReview;
