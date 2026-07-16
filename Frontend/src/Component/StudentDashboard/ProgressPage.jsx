import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProgress, getSession, isLoggedIn } from "../../utils/api";

const ProgressPage = () => {
  const navigate = useNavigate();
  const { userId } = getSession();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    fetchProgress(userId)
      .then((data) => {
        if (!data?.progress) navigate("/get-started");
        else setPayload(data);
      })
      .finally(() => setLoading(false));
  }, [userId, navigate]);

  const stats = useMemo(() => {
    const current = payload?.currentCareer;
    if (!current) return null;
    const challenges = current.practiceChallenges || [];
    return {
      skillsDone: (current.completedSkills || []).length,
      skillsTotal: (current.requiredSkills || []).length,
      resourcesDone:
        (current.completedResources?.watch ? 1 : 0) +
        (current.completedResources?.documentation ? 1 : 0),
      challengesDone: (current.completedChallenges || []).length,
      challengesTotal: challenges.length,
      projectsDone: current.project?.status === "completed" ? 1 : 0,
      overall: current.progressPercent || 0,
      readiness: current.jobReadiness || 0,
      journeyOverall: payload?.progress?.overallProgress || 0,
    };
  }, [payload]);

  if (loading || !stats) {
    return <p className="text-slate-500">Loading progress...</p>;
  }

  const rows = [
    {
      label: "Skills Completed",
      value: `${stats.skillsDone} / ${stats.skillsTotal}`,
    },
    { label: "Learning Resources Completed", value: `${stats.resourcesDone} / 2` },
    {
      label: "Practice Challenges Completed",
      value: `${stats.challengesDone} / ${stats.challengesTotal}`,
    },
    { label: "Projects Completed", value: `${stats.projectsDone} / 1` },
    { label: "Overall Career Progress", value: `${stats.overall}%` },
    { label: "Job Readiness Percentage", value: `${stats.readiness}%` },
    {
      label: "Full Journey Progress",
      value: `${stats.journeyOverall}%`,
    },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Progress</h1>
        <p className="text-slate-500 text-sm mt-1">
          Tracking for <strong>{payload.currentCareer.career}</strong>
        </p>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <ul className="divide-y divide-slate-100">
          {rows.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between px-6 py-4 text-sm"
            >
              <span className="text-slate-600">{row.label}</span>
              <span className="font-bold text-slate-900">{row.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
          Career completion
        </p>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full"
            style={{ width: `${Math.min(stats.overall, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
