import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Play,
  FileText,
  Map,
  CheckCircle2,
  XCircle,
  Briefcase,
  Wrench,
  Loader2,
  Lock,
  Upload,
  ClipboardList,
  FolderGit2,
} from "lucide-react";
import JobReadinessPanel from "../Component/Common/JobReadinessPanel";
import {
  API_URL,
  ML_URL,
  activateCareerApi,
  ensureCareerApi,
  fetchProgress,
  getSession,
  isLoggedIn,
  listCareerProjectsApi,
  projectStatusLabel,
  resubmitProjectApi,
  startProjectApi,
  submitProjectApi,
  updateResourceApi,
  updateSkillsApi,
} from "../utils/api";

const CareerPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { userId } = getSession();

  const [data, setData] = useState(null);
  const [payload, setPayload] = useState(null);
  const [careerProjects, setCareerProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [resubmitId, setResubmitId] = useState(null);
  const [form, setForm] = useState({
    projectTitle: "",
    githubUrl: "",
    demoUrl: "",
    screenshot: null,
  });

  const [challengeGithub, setChallengeGithub] = useState({});
  const [challengeDemo, setChallengeDemo] = useState({});
  const [challengeBusy, setChallengeBusy] = useState("");

  const entry = useMemo(
    () => payload?.progress?.careerPath?.find((c) => c.slug === slug),
    [payload, slug]
  );

  const challengeSubsById = useMemo(() => {
    const map = {};
    (careerProjects || [])
      .filter((p) => p.submissionType === "challenge")
      .forEach((p) => {
        const id = String(p.challengeId);
        if (!map[id] || new Date(p.submittedAt) > new Date(map[id].submittedAt)) {
          map[id] = p;
        }
      });
    return map;
  }, [careerProjects]);

  const allChallengesSubmitted = useMemo(() => {
    const list =
      entry?.practiceChallenges?.length > 0
        ? entry.practiceChallenges
        : data?.practice_challenges || [];
    if (!list.length) return true;
    return list.every((ch) => {
      const id = ch.id || ch.title;
      const sub = challengeSubsById[id];
      return sub && ["pending_review", "approved"].includes(sub.status);
    });
  }, [entry, data, challengeSubsById]);

  const projectUnlocked = useMemo(() => {
    if (!entry) return false;
    return Boolean(
      entry.completedResources?.watch &&
        entry.completedResources?.documentation &&
        allChallengesSubmitted
    );
  }, [entry, allChallengesSubmitted]);

  const allChallengesApproved = useMemo(() => {
    const list =
      entry?.practiceChallenges?.length > 0
        ? entry.practiceChallenges
        : data?.practice_challenges || [];
    if (!list.length) return true;
    return list.every((ch) => {
      const id = ch.id || ch.title;
      return challengeSubsById[id]?.status === "approved";
    });
  }, [entry, data, challengeSubsById]);

  const nextUnlocked = entry?.status === "completed";
  const showJobs = Boolean(payload?.progress?.journeyComplete);
  const projectStatus = entry?.project?.status || "not_started";
  const capstoneApproved = projectStatus === "approved";
  const waitingForAllApprovals =
    (capstoneApproved || allChallengesApproved) &&
    !(allChallengesApproved && capstoneApproved) &&
    entry?.status !== "completed";

  const reloadProgress = useCallback(async () => {
    if (!userId || !isLoggedIn()) return null;
    const dataProgress = await fetchProgress(userId);
    setPayload(dataProgress);
    try {
      const list = await listCareerProjectsApi(userId, slug);
      setCareerProjects(Array.isArray(list) ? list : []);
    } catch {
      setCareerProjects([]);
    }
    return dataProgress;
  }, [userId, slug]);

  useEffect(() => {
    if (!slug) {
      setFetchError(true);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setFetchError(false);
      setData(null);
      try {
        const res = await axios.get(`${ML_URL}/career/${slug}`);
        if (!res.data || typeof res.data !== "object" || res.data.error) {
          throw new Error("Invalid response");
        }
        setData(res.data);

        if (isLoggedIn()) {
          // Register this career on the journey (including path-next careers)
          // so Mark Done / challenges / GitHub project work the same everywhere.
          try {
            await ensureCareerApi(userId, slug);
          } catch (err) {
            const msg = err?.message || "";
            if (/locked|approval|previous/i.test(msg)) {
              setFetchError(true);
              return;
            }
          }

          const prog = await reloadProgress();
          const pathEntry = prog?.progress?.careerPath?.find((c) => c.slug === slug);
          if (pathEntry?.status === "locked") {
            setFetchError(true);
            return;
          }
          if (pathEntry && pathEntry.status !== "locked") {
            try {
              await activateCareerApi(userId, slug);
              await reloadProgress();
            } catch {
              /* ignore */
            }
            setForm({
              projectTitle: pathEntry.projectAssignment?.title || "",
              githubUrl: pathEntry.project?.githubUrl || "",
              demoUrl: pathEntry.project?.demoUrl || "",
              screenshot: null,
            });
          } else if (!pathEntry) {
            // Still no entry — show read-only ML view without tracking
            setFetchError(false);
          }
        }
      } catch (error) {
        console.error("CareerPage fetch error:", error);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug, userId, reloadProgress]);

  const display = {
    career: entry?.career || data?.career,
    match: entry?.matchPercentage || data?.match_percentage,
    description: entry?.description || data?.description,
    tools: entry?.tools?.length ? entry.tools : data?.tools || [],
    advantages: entry?.advantages?.length ? entry.advantages : data?.advantages || [],
    challenges: entry?.challenges?.length ? entry.challenges : data?.challenges || [],
    requiredSkills:
      entry?.requiredSkills?.length
        ? entry.requiredSkills
        : data?.required_skills || [],
    videoUrl: entry?.videoUrl || data?.video_url,
    videoTitle: entry?.videoTitle || data?.video_title,
    pdfUrl: entry?.pdfUrl || data?.pdf_url,
    roadmapUrl: entry?.roadmapUrl || data?.roadmap_url,
    practiceChallenges:
      entry?.practiceChallenges?.length
        ? entry.practiceChallenges
        : data?.practice_challenges || [],
    projectAssignment:
      Object.keys(entry?.projectAssignment || {}).length
        ? entry.projectAssignment
        : data?.project_assignment || {},
    pathData: data?.path_data,
    jobs: entry?.jobs?.length ? entry.jobs : data?.jobs || [],
  };

  const onSkillsChange = async (skills) => {
    if (!entry || !isLoggedIn()) return;
    setSaving(true);
    try {
      await updateSkillsApi(userId, entry.slug, skills);
      await reloadProgress();
    } finally {
      setSaving(false);
    }
  };

  const markResource = async (resource, completed) => {
    if (!entry || !isLoggedIn()) return;
    setSaving(true);
    try {
      await updateResourceApi(userId, entry.slug, resource, completed);
      await reloadProgress();
    } finally {
      setSaving(false);
    }
  };

  const normalizeUrl = (raw) => {
    if (!raw) return "";
    let u = String(raw).trim().toLowerCase();
    u = u.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
    return u;
  };

  const submitChallengeGithub = async (ch) => {
    if (!entry || !isLoggedIn()) return;
    const id = ch.id || ch.title;
    const url = (challengeGithub[id] || "").trim();
    const demo = (challengeDemo[id] || "").trim();
    if (!url) {
      setSubmitMsg("Enter a GitHub repository URL for this challenge.");
      return;
    }

    const ghNorm = normalizeUrl(url);
    const demoNorm = normalizeUrl(demo);
    if (demoNorm && ghNorm === demoNorm) {
      setSubmitMsg("GitHub and live demo must be different URLs for this challenge.");
      return;
    }

    // Block reusing the same GitHub / live demo across other practice challenges
    const otherSubs = Object.entries(challengeSubsById).filter(
      ([otherId]) => String(otherId) !== String(id)
    );
    for (const [, sub] of otherSubs) {
      if (!sub) continue;
      if (ghNorm && normalizeUrl(sub.githubUrl) === ghNorm) {
        setSubmitMsg(
          "Do not reuse the same GitHub link for multiple practice challenges. Each challenge needs its own unique GitHub repository."
        );
        return;
      }
      if (demoNorm && normalizeUrl(sub.liveDemoUrl) === demoNorm) {
        setSubmitMsg(
          "Do not reuse the same live demo link for multiple practice challenges. Each challenge needs its own unique live demo URL."
        );
        return;
      }
      if (ghNorm && normalizeUrl(sub.liveDemoUrl) === ghNorm) {
        setSubmitMsg(
          "This GitHub link was already used as a live demo on another practice challenge. Use a different unique URL."
        );
        return;
      }
      if (demoNorm && normalizeUrl(sub.githubUrl) === demoNorm) {
        setSubmitMsg(
          "This live demo link was already used as a GitHub link on another practice challenge. Use a different unique URL."
        );
        return;
      }
    }

    setChallengeBusy(id);
    setSubmitMsg("");
    try {
      const fd = new FormData();
      fd.append("userId", userId);
      fd.append("slug", entry.slug);
      fd.append("submissionType", "challenge");
      fd.append("challengeId", id);
      fd.append("projectTitle", ch.title || id);
      fd.append("githubUrl", url);
      if (demo) fd.append("liveDemoUrl", demo);
      await submitProjectApi(fd);
      setSubmitMsg("Challenge submitted for admin review.");
      setChallengeGithub((m) => ({ ...m, [id]: "" }));
      setChallengeDemo((m) => ({ ...m, [id]: "" }));
      await reloadProgress();
    } catch (err) {
      setSubmitMsg(err.message || "Challenge submit failed");
    } finally {
      setChallengeBusy("");
    }
  };

  const handleStartProject = async () => {
    if (!entry) return;
    setSaving(true);
    try {
      await startProjectApi(userId, entry.slug);
      await reloadProgress();
      setShowForm(true);
      setForm({
        projectTitle: entry.projectAssignment?.title || "",
        githubUrl: "",
        demoUrl: "",
        screenshot: null,
      });
    } finally {
      setSaving(false);
    }
  };

  const openAddProject = () => {
    setResubmitId(null);
    setShowForm(true);
    setSubmitMsg("");
    setForm({
      projectTitle: entry?.projectAssignment?.title || "",
      githubUrl: "",
      demoUrl: "",
      screenshot: null,
    });
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setSubmitMsg("");
    if (!form.githubUrl.trim() || !form.demoUrl.trim()) {
      setSubmitMsg("GitHub and Live Demo URLs are required.");
      return;
    }
    const fd = new FormData();
    fd.append("userId", userId);
    fd.append("slug", entry.slug);
    fd.append(
      "projectTitle",
      form.projectTitle.trim() ||
        entry.projectAssignment?.title ||
        `${entry.career} Project`
    );
    fd.append("githubUrl", form.githubUrl.trim());
    fd.append("liveDemoUrl", form.demoUrl.trim());
    if (form.screenshot) fd.append("screenshot", form.screenshot);

    setSaving(true);
    try {
      if (resubmitId) {
        await resubmitProjectApi(resubmitId, fd);
        setSubmitMsg("Project resubmitted for admin review.");
      } else {
        await submitProjectApi(fd);
        setSubmitMsg("Project submitted for admin review.");
      }
      setShowForm(false);
      setResubmitId(null);
      await reloadProgress();
    } catch (err) {
      setSubmitMsg(err.message || "Submission failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading career details...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="p-4 bg-rose-50 rounded-2xl inline-block">
            <XCircle className="w-10 h-10 text-rose-400 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">
            Career path not found or locked
          </h2>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            Complete the previous career project to unlock this path, or check that the server is running.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-2 inline-flex items-center gap-2 text-indigo-600 hover:underline text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const assignment = display.projectAssignment || {};

  const learnDone =
    Boolean(entry?.completedResources?.watch) &&
    Boolean(entry?.completedResources?.documentation);
  const practiceDone = allChallengesSubmitted;
  const projectDone = nextUnlocked || capstoneApproved;

  const stepTone = (done, active) => {
    if (done) return "bg-indigo-700 text-white border-indigo-700";
    if (active) return "bg-[#2563EB] text-white border-[#2563EB]";
    return "bg-white text-slate-500 border-slate-200";
  };

  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/result")}
            className="group flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-all"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to My Results
          </button>
          {saving && (
            <span className="text-xs text-slate-500 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
            </span>
          )}
        </div>

        {/* Hero — what this career is */}
        <section className="bg-white rounded-3xl border border-indigo-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 md:px-10 py-8 text-white">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-indigo-100 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Your career match
                </p>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {display.career}
                </h1>
              </div>
              {display.match != null && (
                <div className="bg-white/15 border border-white/20 rounded-2xl px-4 py-3 text-center min-w-[88px]">
                  <p className="text-3xl font-black">{display.match}%</p>
                  <p className="text-[10px] uppercase font-semibold text-indigo-100">
                    Match
                  </p>
                </div>
              )}
            </div>
            <p className="mt-4 text-slate-200 text-base md:text-lg leading-relaxed max-w-2xl">
              {display.description}
            </p>
          </div>

          {/* Simple 3-step roadmap for laymen */}
          <div className="px-6 md:px-10 py-5 border-b border-slate-100 bg-slate-50/80">
            <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">
              Follow these 3 easy steps
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                className={`flex items-center gap-3 rounded-2xl border px-3 py-3 ${stepTone(learnDone, !learnDone)}`}
              >
                <span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <div>
                  <p className="text-sm font-bold">Learn</p>
                  <p className="text-[11px] opacity-80">Watch &amp; read guides</p>
                </div>
              </div>
              <div
                className={`flex items-center gap-3 rounded-2xl border px-3 py-3 ${stepTone(practiceDone, learnDone && !practiceDone)}`}
              >
                <span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <div>
                  <p className="text-sm font-bold">Practice</p>
                  <p className="text-[11px] opacity-80">Do challenges</p>
                </div>
              </div>
              <div
                className={`flex items-center gap-3 rounded-2xl border px-3 py-3 ${stepTone(projectDone, practiceDone && !projectDone)}`}
              >
                <span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <div>
                  <p className="text-sm font-bold">Project</p>
                  <p className="text-[11px] opacity-80">Submit final work</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-5">
                <h3 className="flex items-center gap-2 font-semibold text-indigo-900 text-base mb-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  Why this career fits
                </h3>
                {(display.advantages || []).length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No benefits listed yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {display.advantages.map((item, i) => (
                      <li
                        key={i}
                        className="text-sm text-slate-700 bg-white/80 p-3 rounded-xl border border-indigo-100/80"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rounded-2xl bg-amber-50/80 border border-amber-100 p-5">
                <h3 className="flex items-center gap-2 font-semibold text-amber-900 text-base mb-3">
                  <XCircle className="w-5 h-5 text-amber-600" />
                  Things to expect
                </h3>
                {(display.challenges || []).length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No challenges listed yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {display.challenges.map((item, i) => (
                      <li
                        key={i}
                        className="text-sm text-slate-700 bg-white/80 p-3 rounded-xl border border-amber-100/80"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <JobReadinessPanel
              career={display.career}
              jobs={display.jobs}
              requiredSkills={display.requiredSkills}
              pathData={display.pathData}
              showJobs={showJobs}
              nextUnlocked={nextUnlocked}
              initialSkills={entry?.completedSkills || []}
              onSkillsChange={isLoggedIn() ? onSkillsChange : undefined}
            />
          </div>
        </section>

        {/* Tools + Progress — light supporting cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <Wrench className="w-5 h-5" />
              <h3 className="font-bold text-slate-800">Tools you will use</h3>
            </div>
            {(display.tools || []).length === 0 ? (
              <p className="text-sm text-slate-400 italic">No tools listed yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {display.tools.map((tool, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </div>
          {entry ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-3">Your progress</h3>
              <p className="text-sm text-slate-600 mb-2">
                Overall:{" "}
                <strong className="text-indigo-600">{entry.progressPercent || 0}%</strong>
              </p>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${Math.min(entry.progressPercent || 0, 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-5 text-sm text-slate-400">
              Log in to track your progress on this path.
            </div>
          )}
        </div>

        {/* STEP 1 — Learning Resources (moved up for natural order) */}
        <section className="bg-white rounded-3xl border border-indigo-100 shadow-sm p-6 md:p-8">
          <div className="flex items-start gap-3 mb-2">
            <span className="shrink-0 w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
              1
            </span>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Start learning</h3>
              <p className="text-sm text-slate-500 mt-1">
                Open each resource, then tap <strong>Mark Done</strong> when you finish.
              </p>
              {display.videoTitle && (
                <p className="text-xs text-slate-400 mt-1">{display.videoTitle}</p>
              )}
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {display.videoUrl && (
              <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 space-y-2">
                <a
                  href={display.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 w-full p-3 text-sm font-bold bg-white text-rose-700 rounded-xl border border-rose-100 hover:bg-rose-50 transition-colors"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Watch Guide
                </a>
                {isLoggedIn() && entry && (
                  <button
                    type="button"
                    onClick={() =>
                      markResource("watch", !entry.completedResources?.watch)
                    }
                    className={`w-full text-sm font-bold py-2.5 rounded-xl ${
                      entry.completedResources?.watch
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-slate-700 border border-slate-200"
                    }`}
                  >
                    {entry.completedResources?.watch
                      ? "✓ Watch Guide completed"
                      : "Mark Watch Guide Done"}
                  </button>
                )}
              </div>
            )}
            {display.pdfUrl && (
              <div className="rounded-2xl border border-indigo-100 bg-blue-50 p-4 space-y-2">
                <a
                  href={display.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 w-full p-3 text-sm font-bold bg-white text-blue-700 rounded-xl border border-indigo-100 hover:bg-blue-50 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Documentation
                </a>
                {isLoggedIn() && entry && (
                  <button
                    type="button"
                    onClick={() =>
                      markResource(
                        "documentation",
                        !entry.completedResources?.documentation
                      )
                    }
                    className={`w-full text-sm font-bold py-2.5 rounded-xl ${
                      entry.completedResources?.documentation
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-slate-700 border border-slate-200"
                    }`}
                  >
                    {entry.completedResources?.documentation
                      ? "✓ Documentation completed"
                      : "Mark Documentation Done"}
                  </button>
                )}
              </div>
            )}
            {display.roadmapUrl && (
              <a
                href={display.roadmapUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 w-full p-4 text-sm font-bold bg-indigo-50 text-indigo-700 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-colors"
              >
                <Map className="w-4 h-4" />
                Practice Path / Certificate
              </a>
            )}
            {!display.videoUrl && !display.pdfUrl && !display.roadmapUrl && (
              <p className="text-sm text-slate-400 italic">No resources available yet.</p>
            )}
          </div>
        </section>

        {/* STEP 2 — Practice Challenges */}
        <section className="bg-white rounded-3xl border border-indigo-100 shadow-sm p-6 md:p-8">
          <div className="flex items-start gap-3 mb-2">
            <span className="shrink-0 w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
              2
            </span>
            <div>
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-bold text-slate-800">Practice Challenges</h3>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Submit a <strong>unique</strong> GitHub link (and live demo if any) for{" "}
                <strong>every</strong> challenge — do not reuse the same repository or demo
                URL across challenges. The next career path unlocks only after{" "}
                <strong>all</strong> challenges and the final project are approved by an admin.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
                {(display.practiceChallenges || []).map((ch) => {
                  const id = ch.id || ch.title;
                  const sub = challengeSubsById[id];
                  const status = sub?.status;
                  return (
                    <div
                      key={id}
                      className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-700">{ch.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{ch.description}</p>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md shrink-0 ${
                            status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : status === "pending_review"
                                ? "bg-amber-100 text-amber-800"
                                : status === "rejected"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {status ? projectStatusLabel(status) : "Not submitted"}
                        </span>
                      </div>

                      {sub?.githubUrl && (
                        <a
                          href={
                            /^https?:\/\//i.test(sub.githubUrl)
                              ? sub.githubUrl
                              : `https://${sub.githubUrl}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-indigo-600 hover:underline break-all"
                        >
                          GitHub: {sub.githubUrl}
                        </a>
                      )}
                      {sub?.liveDemoUrl &&
                        sub.liveDemoUrl !== sub.githubUrl && (
                          <a
                            href={
                              /^https?:\/\//i.test(sub.liveDemoUrl)
                                ? sub.liveDemoUrl
                                : `https://${sub.liveDemoUrl}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-xs text-indigo-600 hover:underline break-all"
                          >
                            Live Demo: {sub.liveDemoUrl}
                          </a>
                        )}

                      {status === "rejected" && (
                        <p className="text-xs text-rose-700">
                          {sub?.feedback || "Please revise and resubmit."}
                        </p>
                      )}

                      {isLoggedIn() &&
                        entry &&
                        entry.completedResources?.watch &&
                        entry.completedResources?.documentation &&
                        status !== "approved" &&
                        status !== "pending_review" && (
                          <div className="space-y-2">
                            <div>
                              <label className="text-[10px] font-bold uppercase text-slate-500">
                                GitHub Repository URL *
                              </label>
                              <input
                                type="url"
                                required
                                placeholder="https://github.com/you/challenge-repo"
                                value={challengeGithub[id] || ""}
                                onChange={(e) =>
                                  setChallengeGithub((m) => ({
                                    ...m,
                                    [id]: e.target.value,
                                  }))
                                }
                                className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold uppercase text-slate-500">
                                Live Demo URL (optional)
                              </label>
                              <input
                                type="url"
                                placeholder="https://your-demo.app"
                                value={challengeDemo[id] || ""}
                                onChange={(e) =>
                                  setChallengeDemo((m) => ({
                                    ...m,
                                    [id]: e.target.value,
                                  }))
                                }
                                className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
                              />
                            </div>
                            <button
                              type="button"
                              disabled={challengeBusy === id}
                              onClick={() => submitChallengeGithub(ch)}
                              className="px-4 py-2 bg-slate-700 text-white text-xs font-bold rounded-xl hover:bg-[#2563EB] disabled:opacity-50"
                            >
                              {challengeBusy === id
                                ? "Submitting..."
                                : "Submit Challenge"}
                            </button>
                          </div>
                        )}

                      {isLoggedIn() &&
                        entry &&
                        !(
                          entry.completedResources?.watch &&
                          entry.completedResources?.documentation
                        ) && (
                          <p className="text-xs text-slate-400">
                            Mark Watch Guide and Documentation done first.
                          </p>
                        )}

                      {status === "pending_review" && (
                        <p className="text-xs text-amber-700">
                          Waiting for admin approval of this challenge.
                        </p>
                      )}
                    </div>
                  );
                })}
                {!display.practiceChallenges?.length && (
                  <p className="text-sm text-slate-400 italic">No challenges listed yet.</p>
                )}
          </div>
        </section>

        {/* STEP 3 — Project Assignment */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="w-5 h-5 text-slate-700" />
                      <h3 className="text-xl font-bold text-slate-800">Final Project</h3>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      Unlock this after finishing Steps 1 and 2.
                    </p>
                  </div>
                </div>
                {entry && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-indigo-100">
                    {projectStatusLabel(projectStatus)}
                  </span>
                )}
              </div>

              {!isLoggedIn() ? (
                <p className="text-sm text-slate-500">Login to track project progress.</p>
              ) : !projectUnlocked && entry?.status !== "completed" ? (
                <div className="flex items-start gap-3 bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-5 text-sm text-slate-500">
                  <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>
                    Complete Watch Guide, Documentation, and submit GitHub for{" "}
                    <strong>all</strong> Practice Challenges to unlock this final project.
                  </p>
                </div>
              ) : (
                <>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">
                    {assignment.title || "Capstone Project"}
                  </h4>
                  <p className="text-slate-600 text-sm mb-4">{assignment.description}</p>
                  <div className="grid sm:grid-cols-3 gap-3 mb-4 text-sm">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Difficulty</p>
                      <p className="font-medium text-slate-700">
                        {assignment.difficulty || "Intermediate"}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Duration</p>
                      <p className="font-medium text-slate-700">
                        {assignment.duration || "2-4 weeks"}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Skills</p>
                      <p className="font-medium text-slate-700 truncate">
                        {(assignment.required_skills || []).slice(0, 3).join(", ") || "—"}
                      </p>
                    </div>
                  </div>

                  {projectStatus === "pending_review" && (
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-4 text-sm text-amber-800">
                      Your final project is waiting for admin review.
                    </div>
                  )}
                  {waitingForAllApprovals && (
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-4 text-sm text-amber-800">
                      Some submissions are approved, but the next career path unlocks only
                      after <strong>all practice challenge GitHubs</strong> and the{" "}
                      <strong>final project</strong> are approved.
                    </div>
                  )}
                  {projectStatus === "rejected" && (
                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-4 text-sm text-rose-800">
                      <p className="font-semibold">Rejected</p>
                      <p className="mt-1">
                        {entry.project?.feedback || "Please revise and resubmit."}
                      </p>
                    </div>
                  )}
                  {nextUnlocked && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-4 text-sm text-emerald-800">
                      All practice challenges and the final project are approved. Next Career
                      Path is unlocked.
                    </div>
                  )}
                  {projectStatus === "approved" && !nextUnlocked && !waitingForAllApprovals && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-4 text-sm text-emerald-800">
                      Final project approved. Finish remaining practice challenge approvals to
                      unlock the next path.
                    </div>
                  )}

                  {careerProjects.length > 0 && (
                    <div className="space-y-3 mb-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Your submissions
                      </p>
                      {careerProjects.map((p) => (
                        <div
                          key={p._id}
                          className="border border-slate-100 rounded-2xl p-4 bg-slate-50 text-sm"
                        >
                          <div className="flex justify-between gap-2">
                            <p className="font-semibold text-slate-800">{p.projectTitle}</p>
                            <span className="text-[10px] font-bold uppercase text-slate-500">
                              {projectStatusLabel(p.status)}
                            </span>
                          </div>
                          {p.githubUrl && (
                            <a
                              href={
                                /^https?:\/\//i.test(p.githubUrl)
                                  ? p.githubUrl
                                  : `https://${p.githubUrl}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-xs text-indigo-600 hover:underline mt-1 break-all"
                            >
                              GitHub: {p.githubUrl}
                            </a>
                          )}
                          {p.liveDemoUrl &&
                            p.liveDemoUrl !== p.githubUrl && (
                            <a
                              href={
                                /^https?:\/\//i.test(p.liveDemoUrl)
                                  ? p.liveDemoUrl
                                  : `https://${p.liveDemoUrl}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-xs text-indigo-600 hover:underline break-all"
                            >
                              Live Demo: {p.liveDemoUrl}
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
                              className="mt-2 max-h-32 rounded-lg border border-slate-200"
                            />
                          )}
                          {p.status === "rejected" && (
                            <button
                              type="button"
                              className="mt-2 text-xs font-bold text-indigo-600 hover:underline"
                              onClick={() => {
                                setResubmitId(p._id);
                                setShowForm(true);
                                setForm({
                                  projectTitle: p.projectTitle,
                                  githubUrl: p.githubUrl,
                                  demoUrl: p.liveDemoUrl,
                                  screenshot: null,
                                });
                              }}
                            >
                              Edit & Resubmit
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {!showForm &&
                    (projectStatus === "not_started" || !projectStatus) && (
                      <button
                        type="button"
                        onClick={handleStartProject}
                        className="w-full sm:w-auto px-6 py-3 bg-slate-700 text-white font-bold rounded-xl hover:bg-[#2563EB]"
                      >
                        Start Project
                      </button>
                    )}

                  {!showForm &&
                    ["in_progress", "pending_review", "approved", "rejected"].includes(
                      projectStatus
                    ) && (
                      <button
                        type="button"
                        onClick={openAddProject}
                        className="w-full sm:w-auto px-6 py-3 border border-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-50"
                      >
                        Add Project (+)
                      </button>
                    )}

                  {showForm && (
                    <form onSubmit={handleSubmitProject} className="space-y-4 mt-4">
                      <div>
                        <label className="text-xs font-bold uppercase text-slate-500">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.projectTitle}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, projectTitle: e.target.value }))
                          }
                          className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase text-slate-500">
                          GitHub Repository URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={form.githubUrl}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, githubUrl: e.target.value }))
                          }
                          className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
                          placeholder="https://github.com/username/repo"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase text-slate-500">
                          Live Demo URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={form.demoUrl}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, demoUrl: e.target.value }))
                          }
                          className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
                          placeholder="https://your-demo.app"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase text-slate-500">
                          Screenshot (optional)
                        </label>
                        <label className="mt-1 flex items-center gap-2 w-full border border-dashed border-slate-300 rounded-xl px-3 py-3 text-sm text-slate-500 cursor-pointer hover:bg-slate-50">
                          <Upload className="w-4 h-4" />
                          {form.screenshot ? form.screenshot.name : "Upload image"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                screenshot: e.target.files?.[0] || null,
                              }))
                            }
                          />
                        </label>
                      </div>
                      {submitMsg && (
                        <p
                          className={`text-sm ${
                            submitMsg.toLowerCase().includes("review") ||
                            submitMsg.toLowerCase().includes("success")
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }`}
                        >
                          {submitMsg}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex-1 bg-slate-700 text-white font-semibold py-3 rounded-xl hover:bg-[#2563EB] disabled:opacity-50"
                        >
                          {resubmitId ? "Resubmit for Review" : "Submit for Review"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowForm(false);
                            setResubmitId(null);
                          }}
                          className="px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {submitMsg && !showForm && (
                    <p className="text-sm text-indigo-600 mt-3">{submitMsg}</p>
                  )}
                </>
              )}
        </section>
      </div>
    </div>
  );
};

export default CareerPage;
