import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  API_URL,
  fetchProgress,
  getSession,
  isLoggedIn,
  listStudentProjectsApi,
  projectStatusLabel,
} from "../../utils/api";

function toHref(url) {
  if (!url) return "#";
  const trimmed = String(url).trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { userId } = getSession();
  const [payload, setPayload] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    Promise.all([fetchProgress(userId), listStudentProjectsApi(userId)])
      .then(([prog, list]) => {
        if (!prog?.currentCareer) navigate("/get-started");
        else {
          setPayload(prog);
          setProjects(Array.isArray(list) ? list : []);
        }
      })
      .finally(() => setLoading(false));
  }, [userId, navigate]);

  if (loading || !payload?.currentCareer) {
    return <p className="text-slate-500">Loading projects...</p>;
  }

  const current = payload.currentCareer;
  const assignment = current.projectAssignment || {};
  const status = current.project?.status || "not_started";

  return (
    <div className="max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
        <p className="text-slate-500 text-sm mt-1">
          Current career: <strong>{current.career}</strong>
        </p>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900">
            {assignment.title || "Capstone Project"}
          </h2>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
            {projectStatusLabel(status)}
          </span>
        </div>
        <p className="text-slate-600 text-sm">{assignment.description}</p>

        {status === "pending_review" && (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
            Your project is waiting for admin review. An admin must Approve it
            (Admin Panel → Project Review) before the next career path unlocks.
          </p>
        )}
        {status === "rejected" && (
          <p className="text-sm text-rose-800 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
            Rejected: {current.project?.feedback || "Please revise and resubmit."}
          </p>
        )}
        {status === "approved" && (
          <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
            Project Approved — Next Career Path unlocked.
          </p>
        )}

        <Link
          to={`/career/${current.slug}`}
          className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800"
        >
          Open Project Workspace
        </Link>
      </div>

      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4">All submissions</h3>
        {projects.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No projects submitted yet.</p>
        ) : (
          <ul className="space-y-3">
            {projects.map((p) => (
              <li
                key={p._id}
                className="border border-slate-100 rounded-2xl p-4 bg-slate-50"
              >
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800">{p.projectTitle}</p>
                    <p className="text-xs text-slate-500">{p.careerName}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-500">
                    {projectStatusLabel(p.status)}
                  </span>
                </div>
                {p.githubUrl && (
                  <a
                    href={toHref(p.githubUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-indigo-600 hover:underline mt-2 break-all"
                  >
                    GitHub: {p.githubUrl}
                  </a>
                )}
                {p.liveDemoUrl && (
                  <a
                    href={toHref(p.liveDemoUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-indigo-600 hover:underline break-all"
                  >
                    Demo: {p.liveDemoUrl}
                  </a>
                )}
                {p.screenshot && (
                  <img
                    src={
                      p.screenshot.startsWith("http")
                        ? p.screenshot
                        : `${API_URL}${p.screenshot}`
                    }
                    alt=""
                    className="mt-2 max-h-28 rounded-lg border"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ProjectsPage;
