import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  ChevronRight,
  FolderGit2,
  Lock,
} from "lucide-react";
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

/**
 * Combined admin home — same card layout as the student dashboard,
 * plus inline Approve / Reject so admins unlock next career from one place.
 */
const DashboardOverview = () => {
  const [pending, setPending] = useState([]);
  const [allCount, setAllCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [feedbackMap, setFeedbackMap] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [pendingRows, allRows, approvedRows] = await Promise.all([
        adminListProjectsApi("pending_review"),
        adminListProjectsApi(""),
        adminListProjectsApi("approved"),
      ]);
      setPending(Array.isArray(pendingRows) ? pendingRows : []);
      setAllCount(Array.isArray(allRows) ? allRows.length : 0);
      setApprovedCount(Array.isArray(approvedRows) ? approvedRows.length : 0);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const approve = async (id) => {
    setBusyId(id);
    setError("");
    setSuccess("");
    try {
      await adminApproveProjectApi(id, {
        adminName: "Admin",
        feedback:
          feedbackMap[id] || "Approved — next career path unlocked.",
      });
      setSuccess("Project approved. Next career path unlocked for that student.");
      await load();
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
        adminName: "Admin",
        feedback:
          feedbackMap[id] || "Please revise your submission and try again.",
      });
      setSuccess("Project rejected. Student can edit and resubmit.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  };

  if (loading) {
    return <p className="text-slate-500 font-medium">Loading dashboard...</p>;
  }

  return (
    <div className="max-w-5xl space-y-6">
      <header>
        <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">
          Dashboard
        </p>
        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Welcome, Admin
        </h1>
        <p className="text-slate-500 mt-2">
          Review student projects and unlock the next career path from this
          portal.
        </p>
      </header>

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

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm md:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Admin Overview
            </p>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Personalized Career Platform
          </h2>
          <p className="text-slate-600 text-sm mt-3">
            Students complete learning, challenges, and projects. Your approval
            unlocks their next career path.
          </p>
          <Link
            to="/admin/careers"
            className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-indigo-600 hover:underline"
          >
            Manage Career Data <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Pending Review
          </p>
          <p className="text-4xl font-black text-indigo-600 mt-3">
            {pending.length}
          </p>
          <p className="text-xs text-slate-500 mt-3">
            {approvedCount} approved · {allCount} total submissions
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            Current Focus
          </p>
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-indigo-600" />
            Project Approvals
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            {pending.length === 0
              ? "No projects waiting for review."
              : `${pending.length} student project(s) waiting below.`}
          </p>
          <Link
            to="/admin/projects"
            className="inline-block mt-4 text-sm font-bold text-indigo-600 hover:underline"
          >
            Open full Projects page →
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            Next Career Path
          </p>
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" /> Controlled by you
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            Student next paths stay locked until you Approve a project.
          </p>
        </div>
      </div>

      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-bold text-slate-900">Projects awaiting approval</h3>
          <button
            type="button"
            onClick={load}
            className="text-sm font-semibold text-indigo-600 hover:underline"
          >
            Refresh
          </button>
        </div>

        {pending.length === 0 ? (
          <p className="text-sm text-slate-400 italic">
            All caught up — no pending submissions.
          </p>
        ) : (
          pending.map((p) => (
            <div
              key={p._id}
              className="border border-slate-100 rounded-2xl p-4 bg-slate-50 space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                      <p className="font-semibold text-slate-900">{p.projectTitle}</p>
                      <p className="text-xs font-bold uppercase text-indigo-600">
                        {p.submissionType === "challenge"
                          ? "Practice challenge"
                          : "Final project"}
                      </p>
                  <p className="text-sm text-slate-600">
                    Student: <strong>{p.studentName}</strong>
                    {p.studentEmail ? ` · ${p.studentEmail}` : ""}
                  </p>
                  <p className="text-sm text-slate-600">
                    Career: <strong>{p.careerName}</strong>
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800">
                  {projectStatusLabel(p.status)}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                {p.githubUrl && (
                  <a
                    href={toHref(p.githubUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    Open GitHub →
                  </a>
                )}
                {p.liveDemoUrl && (
                  <a
                    href={toHref(p.liveDemoUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    Open Live Demo →
                  </a>
                )}
              </div>

              {p.screenshot && (
                <img
                  src={
                    p.screenshot.startsWith("http")
                      ? p.screenshot
                      : `${API_URL}${p.screenshot}`
                  }
                  alt=""
                  className="max-h-28 rounded-lg border border-slate-200"
                />
              )}

              <textarea
                placeholder="Feedback (optional for approve, used on reject)"
                value={feedbackMap[p._id] || ""}
                onChange={(e) =>
                  setFeedbackMap((m) => ({ ...m, [p._id]: e.target.value }))
                }
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
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
          ))
        )}
      </section>
    </div>
  );
};

export default DashboardOverview;
