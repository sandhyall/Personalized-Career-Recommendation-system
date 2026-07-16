import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PlayCircle,
  FileText,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Wrench,
  ChevronRight,
  Map,
  Loader2,
} from "lucide-react";
import JobReadinessPanel from "../Component/Common/JobReadinessPanel";
import {
  fetchLatestRecommendations,
  fetchProgress,
  getSession,
  isLoggedIn,
  toCareerSlug,
  updateResourceApi,
  updateSkillsApi,
} from "../utils/api";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, name: storedName } = getSession();

  const [recommendations, setRecommendations] = useState(
    location.state?.recommendations || null
  );
  const [userName, setUserName] = useState(
    location.state?.userName || storedName || "User"
  );
  const [loading, setLoading] = useState(!location.state?.recommendations);
  const [error, setError] = useState("");
  const [progressPayload, setProgressPayload] = useState(null);
  const [savingSlug, setSavingSlug] = useState("");

  const reloadProgress = useCallback(async () => {
    if (!isLoggedIn() || !userId) return null;
    try {
      const data = await fetchProgress(userId);
      setProgressPayload(data);
      return data;
    } catch {
      return null;
    }
  }, [userId]);

  useEffect(() => {
    const boot = async () => {
      if (location.state?.recommendations) {
        setRecommendations(location.state.recommendations);
        setUserName(location.state.userName || storedName || "User");
        setLoading(false);
        await reloadProgress();
        return;
      }

      if (!isLoggedIn()) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        setLoading(true);
        setError("");
        const latest = await fetchLatestRecommendations(userId);
        if (!latest) {
          navigate("/get-started", { replace: true });
          return;
        }
        setRecommendations(latest.recommendations);
        setUserName(storedName || "User");
        await reloadProgress();
      } catch (err) {
        console.error(err);
        setError("Could not load your saved recommendations.");
      } finally {
        setLoading(false);
      }
    };

    boot();
  }, [location.state, navigate, userId, storedName, reloadProgress]);

  const getEntry = (careerName) =>
    progressPayload?.progress?.careerPath?.find(
      (c) => c.slug === toCareerSlug(careerName)
    );

  const markResource = async (careerName, resource, completed) => {
    const entry = getEntry(careerName);
    if (!entry || entry.status === "locked") {
      navigate(`/career/${toCareerSlug(careerName)}`);
      return;
    }
    setSavingSlug(entry.slug);
    try {
      await updateResourceApi(userId, entry.slug, resource, completed);
      await reloadProgress();
    } finally {
      setSavingSlug("");
    }
  };

  const onSkillsChange = async (careerName, skills) => {
    const entry = getEntry(careerName);
    if (!entry || entry.status === "locked") return;
    setSavingSlug(entry.slug);
    try {
      await updateSkillsApi(userId, entry.slug, skills);
      await reloadProgress();
    } finally {
      setSavingSlug("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading your results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-rose-600">{error}</p>
          <button
            onClick={() => navigate("/get-started")}
            className="text-indigo-600 font-medium hover:underline"
          >
            Retake assessment
          </button>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">
            No career matches found
          </h2>
          <button
            onClick={() => navigate("/get-started")}
            className="inline-flex items-center gap-2 text-indigo-600 hover:underline text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back and try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-slate-600 hover:text-indigo-600 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <header className="text-center mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
            Your matches
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Top Careers for <span className="text-indigo-600">{userName}</span>
          </h1>
          <p className="text-slate-500 mt-3 text-base md:text-lg">
            Based on your unique skills and interests.
          </p>
          <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
            Open a resource, then use <strong>Mark Done</strong> to track progress.
            Tap <strong>Explore full path</strong> for challenges and your project.
          </p>
        </header>

        <main className="space-y-8">
          {recommendations.map((item, idx) => {
            const entry = getEntry(item.career);
            const slug = toCareerSlug(item.career);
            const isLocked = entry?.status === "locked";
            const canTrack = Boolean(entry && !isLocked);
            const nextUnlocked = entry?.status === "completed";
            const showJobs = Boolean(progressPayload?.progress?.journeyComplete);
            const learnDone =
              Boolean(entry?.completedResources?.watch) &&
              Boolean(entry?.completedResources?.documentation);
            const statusLabel = !entry
              ? null
              : entry.status === "completed"
                ? "Completed"
                : entry.isRecommendation || !entry.parentSlug
                  ? "Top recommendation · Unlocked"
                  : entry.status === "active"
                    ? "Next path · Unlocked"
                    : "Next path · Locked until requirements + admin approval";

            return (
              <section
                key={`${item.career}-${idx}`}
                className={`bg-white rounded-3xl shadow-sm border overflow-hidden transition-all ${
                  isLocked
                    ? "border-slate-200 opacity-90"
                    : "border-indigo-100 hover:shadow-md"
                }`}
              >
                {/* Same hero style as career detail page */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 md:px-8 py-7 text-white">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-indigo-100 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {idx === 0 ? "Best match" : `Match #${idx + 1}`}
                        {statusLabel ? ` · ${statusLabel}` : ""}
                      </p>
                      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                        {item.career}
                      </h2>
                    </div>
                    <div className="bg-white/15 border border-white/20 rounded-2xl px-4 py-3 text-center min-w-[84px]">
                      <p className="text-3xl font-black">{item.match_percentage}%</p>
                      <p className="text-[10px] uppercase font-semibold text-indigo-100">
                        Match
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-slate-200 text-base leading-relaxed max-w-2xl">
                    {item.description || "No description available."}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(`/career/${slug}`)}
                    disabled={isLocked}
                    className={`mt-5 w-full sm:w-auto px-5 py-2.5 text-sm font-bold rounded-xl transition-colors ${
                      isLocked
                        ? "bg-white/20 text-white/50 cursor-not-allowed"
                        : "bg-white text-indigo-700 hover:bg-indigo-50"
                    }`}
                  >
                    {isLocked
                      ? "Locked — finish previous career requirements first"
                      : "Explore full career path"}
                  </button>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  {/* Mini step strip so results feel like the detail page */}
                  {!isLocked && (
                    <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-4">
                      <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">
                        Follow these 3 easy steps
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div
                          className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 ${
                            learnDone
                              ? "bg-indigo-700 text-white border-indigo-700"
                              : "bg-[#2563EB] text-white border-[#2563EB]"
                          }`}
                        >
                          <span className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center text-xs font-bold">
                            1
                          </span>
                          <div>
                            <p className="text-sm font-bold">Learn</p>
                            <p className="text-[10px] opacity-80">Guides below</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border px-3 py-2.5 bg-white text-slate-500 border-slate-200">
                          <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">
                            2
                          </span>
                          <div>
                            <p className="text-sm font-bold">Practice</p>
                            <p className="text-[10px] opacity-80">On full path</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border px-3 py-2.5 bg-white text-slate-500 border-slate-200">
                          <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">
                            3
                          </span>
                          <div>
                            <p className="text-sm font-bold">Project</p>
                            <p className="text-[10px] opacity-80">On full path</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                      <div className="flex items-center gap-2 mb-3 text-indigo-600">
                        <GraduationCap className="w-4 h-4" />
                        <span className="font-bold text-xs uppercase tracking-widest">
                          Next career step
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="px-3 py-1.5 bg-white border border-indigo-100 rounded-md text-[11px] font-medium text-slate-600 shadow-sm truncate max-w-[110px]">
                          {item.career}
                        </div>
                        <div className="flex-1 flex items-center mx-1 min-w-[24px]">
                          <div className="flex-1 border-t border-dashed border-indigo-200" />
                          <ChevronRight className="w-3 h-3 text-indigo-400 shrink-0" />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (item.path_data?.next_slug && nextUnlocked) {
                              navigate(`/career/${item.path_data.next_slug}`);
                            } else if (item.path_data?.next_slug) {
                              navigate(`/career/${slug}`);
                            }
                          }}
                          disabled={!item.path_data?.next_slug}
                          className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all shadow-sm whitespace-nowrap ${
                            item.path_data?.next_slug
                              ? "bg-slate-700 text-white hover:bg-[#2563EB]"
                              : "bg-slate-200 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          {item.path_data?.next || "Senior Level"}
                        </button>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                      <div className="flex items-center gap-2 mb-2 text-blue-600">
                        <Wrench className="w-4 h-4" />
                        <span className="font-bold text-xs uppercase tracking-widest">
                          Tools you will use
                        </span>
                      </div>
                      {(item.tools || []).length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">No tools listed.</p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {item.tools.map((tool, i) => (
                            <span
                              key={i}
                              className="bg-white border border-blue-100 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-blue-700"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Step 1 · Start learning
                      {savingSlug === slug ? " · Saving..." : ""}
                    </p>

                    {item.video_url && (
                      <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <a
                            href={item.video_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-rose-700 border border-rose-100 rounded-xl font-bold hover:bg-rose-50 transition-colors"
                          >
                            <PlayCircle className="w-5 h-5" />
                            Watch Guide
                          </a>
                          {isLoggedIn() && canTrack && (
                            <button
                              type="button"
                              onClick={() =>
                                markResource(
                                  item.career,
                                  "watch",
                                  !entry?.completedResources?.watch
                                )
                              }
                              className={`sm:w-40 px-4 py-3 rounded-xl text-xs font-bold ${
                                entry?.completedResources?.watch
                                  ? "bg-indigo-600 text-white"
                                  : "bg-white text-slate-700 border border-slate-200"
                              }`}
                            >
                              {entry?.completedResources?.watch
                                ? "✓ Done"
                                : "Mark Done"}
                            </button>
                          )}
                          {isLoggedIn() && isLocked && (
                            <span className="sm:w-40 px-4 py-3 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 text-center">
                              Locked
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {item.pdf_url && (
                      <div className="rounded-2xl border border-indigo-100 bg-blue-50 p-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <a
                            href={item.pdf_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-700 border border-indigo-100 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
                          >
                            <FileText className="w-5 h-5" />
                            Documentation
                          </a>
                          {isLoggedIn() && canTrack && (
                            <button
                              type="button"
                              onClick={() =>
                                markResource(
                                  item.career,
                                  "documentation",
                                  !entry?.completedResources?.documentation
                                )
                              }
                              className={`sm:w-40 px-4 py-3 rounded-xl text-xs font-bold ${
                                entry?.completedResources?.documentation
                                  ? "bg-indigo-600 text-white"
                                  : "bg-white text-slate-700 border border-slate-200"
                              }`}
                            >
                              {entry?.completedResources?.documentation
                                ? "✓ Done"
                                : "Mark Done"}
                            </button>
                          )}
                          {isLoggedIn() && isLocked && (
                            <span className="sm:w-40 px-4 py-3 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 text-center">
                              Locked
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {item.roadmap_url && (
                      <a
                        href={item.roadmap_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
                      >
                        <Map className="w-5 h-5" />
                        Practice Path / Certificate
                      </a>
                    )}

                    {!item.video_url && !item.pdf_url && !item.roadmap_url && (
                      <p className="text-sm text-slate-400 italic">
                        No learning resources available for this career yet.
                      </p>
                    )}

                    {item.video_title && (
                      <p className="text-[11px] text-slate-400">{item.video_title}</p>
                    )}

                    {isLocked && (
                      <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                        This is a <strong>next career path</strong> step. Unlock it only after
                        you complete Watch Guide, Documentation, skills, practice challenges,
                        submit your GitHub project on the previous career, and an admin
                        approves it.
                      </p>
                    )}

                    {canTrack && (
                      <p className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
                        Your <strong>top 3 recommendations</strong> are always open. Use
                        Explore full career path for challenges + GitHub project. Completing
                        them unlocks that career’s next path only.
                      </p>
                    )}

                    {!entry && isLoggedIn() && (
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                        Refreshing your path… open Dashboard once, then return here.
                      </p>
                    )}
                  </div>

                  <JobReadinessPanel
                    career={item.career}
                    jobs={item.jobs || []}
                    requiredSkills={item.required_skills || []}
                    pathData={item.path_data}
                    showJobs={showJobs}
                    nextUnlocked={nextUnlocked}
                    initialSkills={entry?.completedSkills || []}
                    onSkillsChange={
                      canTrack
                        ? (skills) => onSkillsChange(item.career, skills)
                        : undefined
                    }
                  />
                </div>
              </section>
            );
          })}
        </main>
      </div>
    </div>
  );
};

export default ResultPage;
