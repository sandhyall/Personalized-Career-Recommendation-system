import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, ChevronRight, Lock } from "lucide-react";
import {
  fetchProgress,
  getSession,
  isLoggedIn,
  projectStatusLabel,
  toCareerSlug,
} from "../../utils/api";

const DashboardHome = () => {
  const navigate = useNavigate();
  const { userId, name } = getSession();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    fetchProgress(userId)
      .then((data) => {
        if (!data?.progress) {
          navigate("/get-started");
          return;
        }
        setPayload(data);
      })
      .catch(() => navigate("/get-started"))
      .finally(() => setLoading(false));
  }, [userId, navigate]);

  if (loading) {
    return <p className="text-slate-500 font-medium">Loading dashboard...</p>;
  }

  const progress = payload?.progress;
  const current = payload?.currentCareer;
  const studentName = payload?.user?.name || name;
  const projectStatus = current?.project?.status || "not_started";
  const nextPath = (progress.careerPath || []).find(
    (c) =>
      c.parentSlug === current?.slug &&
      (c.status === "active" || c.status === "completed")
  );
  const nextLocked = (progress.careerPath || []).find(
    (c) => c.parentSlug === current?.slug && c.status === "locked"
  );

  return (
    <div className="max-w-5xl space-y-6">
      <header>
        <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">
          Dashboard
        </p>
        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Welcome, {studentName}
        </h1>
        <p className="text-slate-500 mt-2">
          Your personalized career journey based on your assessment.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm md:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Recommended Career
            </p>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {progress.recommendedCareer}
          </h2>
          <p className="text-indigo-600 font-bold mt-1">
            {progress.matchPercentage}% match
          </p>
          <p className="text-slate-600 text-sm mt-3 line-clamp-3">
            {current?.description}
          </p>
          <Link
            to={`/career/${current?.slug || toCareerSlug(progress.recommendedCareer)}`}
            className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-indigo-600 hover:underline"
          >
            Open Career Recommendation <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Learning Progress
          </p>
          <p className="text-4xl font-black text-indigo-600 mt-3">
            {progress.overallProgress}%
          </p>
          <div className="h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${Math.min(progress.overallProgress || 0, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Job readiness: {current?.jobReadiness || 0}%
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            Current Project
          </p>
          <h3 className="font-bold text-slate-900">
            {current?.project?.title ||
              current?.projectAssignment?.title ||
              "Not started"}
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            Status: <strong>{projectStatusLabel(projectStatus)}</strong>
          </p>
          {projectStatus === "pending_review" && (
            <p className="text-sm text-amber-700 mt-3 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
              Your project is waiting for admin review.
            </p>
          )}
          {projectStatus === "rejected" && (
            <p className="text-sm text-rose-700 mt-3 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
              {current?.project?.feedback || "Please revise and resubmit."}
            </p>
          )}
          {projectStatus === "approved" && (
            <p className="text-sm text-emerald-700 mt-3 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
              Project Approved
            </p>
          )}
          <Link
            to="/dashboard/projects"
            className="inline-block mt-4 text-sm font-bold text-indigo-600 hover:underline"
          >
            View projects →
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            Next Career Path
          </p>
          {nextPath ? (
            <>
              <h3 className="font-bold text-slate-900">{nextPath.career}</h3>
              <p className="text-sm text-emerald-700 mt-2">
                Unlocked after requirements + admin approval
              </p>
              <Link
                to={`/career/${nextPath.slug}`}
                className="inline-flex items-center gap-1 mt-4 text-sm font-bold text-indigo-600 hover:underline"
              >
                Open next career <ChevronRight className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <>
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400" />{" "}
                {nextLocked?.career || "Locked"}
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Your top 3 recommendations are open anytime. This next path
                unlocks after Watch Guide, Documentation, skills, challenges,
                GitHub project, and admin approval.
              </p>
            </>
          )}
        </div>
      </div>

      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4">Career Path Journey</h3>
        <div className="flex flex-wrap gap-3">
          {(progress.careerPath || []).map((step) => (
            <button
              key={step.slug}
              type="button"
              disabled={step.status === "locked"}
              onClick={() => {
                if (step.status !== "locked") navigate(`/career/${step.slug}`);
              }}
              className={`px-4 py-3 rounded-2xl border text-left min-w-[140px] ${
                step.status === "completed"
                  ? "bg-emerald-50 border-emerald-200"
                  : step.status === "active"
                    ? "bg-indigo-50 border-indigo-300"
                    : "bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-500 mb-1">
                {step.status === "locked" && <Lock className="w-3 h-3" />}
                {step.isRecommendation || !step.parentSlug
                  ? step.status === "completed"
                    ? "done"
                    : "top pick"
                  : step.status}
              </div>
              <p className="text-sm font-bold text-slate-800">{step.career}</p>
            </button>
          ))}
        </div>
      </section>

      {progress.journeyComplete && (
        <section className="bg-slate-900 text-white rounded-3xl p-6">
          <h3 className="font-bold mb-2">Internship / Job Recommendations</h3>
          <p className="text-slate-300 text-sm mb-4">
            Unlocked after completing your full career journey.
          </p>
          <ul className="grid md:grid-cols-3 gap-3">
            {(progress.careerPath?.[progress.careerPath.length - 1]?.jobs || [])
              .slice(0, 3)
              .map((job, i) => (
                <li key={i} className="bg-white/10 rounded-2xl p-4">
                  <p className="font-semibold text-sm">{job.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{job.company_type}</p>
                </li>
              ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default DashboardHome;
