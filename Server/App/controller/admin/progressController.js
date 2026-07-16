const axios = require("axios");
const mongoose = require("mongoose");
const Progress = require("../../model/progress");
const { User } = require("../../model/Usermodel");
const {
  loadProjectsGrouped,
  summarizeWithProjects,
  resourcesComplete,
  challengesSubmittedEnough,
  canOpenCapstone,
} = require("./projectController");

const ML_URL = process.env.ML_URL || "http://localhost:5002";

function toSlug(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function calcJobReadiness(completedSkills, requiredSkills) {
  const required = (requiredSkills || []).map((s) => String(s).trim()).filter(Boolean);
  if (!required.length) return 0;
  const done = new Set(
    (completedSkills || []).map((s) => String(s).trim().toLowerCase())
  );
  const matched = required.filter((s) => done.has(s.toLowerCase()));
  return Math.round((matched.length / required.length) * 1000) / 10;
}

function calcCareerProgress(entry) {
  const skillScore = calcJobReadiness(entry.completedSkills, entry.requiredSkills);
  const watch = entry.completedResources?.watch ? 1 : 0;
  const docs = entry.completedResources?.documentation ? 1 : 0;
  const challenges = entry.practiceChallenges || [];
  const challengeDone =
    challenges.length === 0
      ? 1
      : (entry.completedChallenges || []).length / Math.max(challenges.length, 1);
  const resourceScore = ((watch + docs + challengeDone) / 3) * 100;
  const st = entry.project?.status;
  const projectScore =
    st === "approved" || st === "completed"
      ? 100
      : st === "pending_review"
        ? 70
        : st === "in_progress" || st === "rejected"
          ? 40
          : 0;
  return Math.round(skillScore * 0.4 + resourceScore * 0.3 + projectScore * 0.3);
}

function summarizeProgress(doc) {
  (doc.careerPath || []).forEach((entry) => {
    entry.jobReadiness = calcJobReadiness(entry.completedSkills, entry.requiredSkills);
    entry.progressPercent = calcCareerProgress(entry);
  });
  const path = doc.careerPath || [];
  doc.overallProgress =
    path.length === 0
      ? 0
      : Math.round(path.reduce((s, e) => s + (e.progressPercent || 0), 0) / path.length);
  doc.journeyComplete = path.length > 0 && path.every((e) => e.status === "completed");
  return doc;
}

function mapRecommendationToEntry(item, status = "locked", meta = {}) {
  const career = item.career || item.career_name || "Career";
  return {
    career,
    slug: item.slug || toSlug(career),
    isRecommendation: Boolean(meta.isRecommendation),
    parentSlug: meta.parentSlug || "",
    matchPercentage: item.match_percentage || item.matchPercentage || 0,
    description: item.description || "",
    tools: item.tools || [],
    requiredSkills: item.required_skills || item.requiredSkills || [],
    videoUrl: item.video_url || item.videoUrl || "",
    videoTitle: item.video_title || item.videoTitle || "",
    pdfUrl: item.pdf_url || item.pdfUrl || "",
    roadmapUrl: item.roadmap_url || item.roadmapUrl || "",
    practiceChallenges: item.practice_challenges || item.practiceChallenges || [],
    projectAssignment: item.project_assignment || item.projectAssignment || {},
    jobs: item.jobs || [],
    advantages: item.advantages || [],
    challenges: item.challenges || [],
    status,
    completedSkills: [],
    completedResources: { watch: false, documentation: false },
    completedChallenges: [],
    project: { status: "not_started", githubUrl: "", demoUrl: "", screenshotUrl: "" },
    jobReadiness: 0,
    progressPercent: 0,
  };
}

async function fetchCareerDetail(slug) {
  const res = await axios.get(`${ML_URL}/career/${slug}`, { timeout: 10000 });
  return res.data;
}

async function enrichRecommendation(item) {
  const career = item.career || item.career_name || item.title || "Career";
  const slug = item.slug || toSlug(career);
  let merged = { ...item, career, slug };
  try {
    const detail = await fetchCareerDetail(slug);
    if (detail && !detail.error) {
      merged = {
        ...detail,
        ...item,
        career: item.career || item.career_name || detail.career || career,
        slug,
        match_percentage: item.match_percentage ?? detail.match_percentage,
        practice_challenges:
          item.practice_challenges?.length
            ? item.practice_challenges
            : detail.practice_challenges || [],
        project_assignment:
          item.project_assignment?.title
            ? item.project_assignment
            : detail.project_assignment || {},
        tools: item.tools?.length ? item.tools : detail.tools || [],
        required_skills: item.required_skills?.length
          ? item.required_skills
          : detail.required_skills || [],
        video_url: item.video_url || detail.video_url || "",
        pdf_url: item.pdf_url || detail.pdf_url || "",
        roadmap_url: item.roadmap_url || detail.roadmap_url || "",
        description: item.description || detail.description || "",
        jobs: item.jobs?.length ? item.jobs : detail.jobs || [],
        path_data: item.path_data || detail.path_data || null,
      };
    }
  } catch (err) {
    console.error("Career enrich failed:", slug, err.message);
  }
  return merged;
}

function collectNextSlugs(enriched) {
  const slugs = [];
  const pd = enriched?.path_data || {};
  if (pd.next_slug) slugs.push(pd.next_slug);
  (pd.steps || []).forEach((s) => {
    if (s?.slug && s.clickable !== false) slugs.push(s.slug);
  });
  return [...new Set(slugs.filter(Boolean))];
}

/** Append path-next careers — stay LOCKED until parent is admin-approved. */
async function appendNextPathCareers(careerPath, enriched, used) {
  const parentSlug = enriched.slug || toSlug(enriched.career);
  for (const nextSlug of collectNextSlugs(enriched).slice(0, 3)) {
    if (used.has(nextSlug)) continue;
    try {
      const detail = await fetchCareerDetail(nextSlug);
      if (!detail || detail.error) continue;
      careerPath.push(
        mapRecommendationToEntry(
          {
            ...detail,
            match_percentage: Math.max(
              35,
              (enriched.match_percentage || 70) - 10 * careerPath.length
            ),
          },
          "locked",
          { isRecommendation: false, parentSlug }
        )
      );
      used.add(nextSlug);
    } catch (err) {
      console.error("Next path enrich failed:", nextSlug, err.message);
    }
  }
}

function backfillEntryFromDetail(existing, enriched) {
  if (!(existing.practiceChallenges || []).length && (enriched.practice_challenges || []).length) {
    existing.practiceChallenges = enriched.practice_challenges;
  }
  if (!existing.projectAssignment?.title && enriched.project_assignment?.title) {
    existing.projectAssignment = enriched.project_assignment;
  }
  if (!existing.description && enriched.description) {
    existing.description = enriched.description;
  }
  if (!(existing.tools || []).length && (enriched.tools || []).length) {
    existing.tools = enriched.tools;
  }
  if (!(existing.requiredSkills || []).length && (enriched.required_skills || []).length) {
    existing.requiredSkills = enriched.required_skills;
  }
  if (!existing.videoUrl && enriched.video_url) existing.videoUrl = enriched.video_url;
  if (!existing.pdfUrl && enriched.pdf_url) existing.pdfUrl = enriched.pdf_url;
  if (!existing.roadmapUrl && enriched.roadmap_url) {
    existing.roadmapUrl = enriched.roadmap_url;
  }
  return existing;
}

/**
 * Apply unlock rules:
 * - Top recommendations (isRecommendation / no parent) → always active (unless completed)
 * - Path-next → active only when parentSlug career is completed
 */
function applyUnlockRules(careerPath) {
  const completed = new Set(
    (careerPath || []).filter((c) => c.status === "completed").map((c) => c.slug)
  );

  (careerPath || []).forEach((c) => {
    if (c.status === "completed") return;

    const isTop =
      c.isRecommendation === true ||
      !c.parentSlug ||
      c.parentSlug === "";

    if (isTop) {
      c.isRecommendation = true;
      c.parentSlug = c.parentSlug || "";
      c.status = "active";
      return;
    }

    // Path progression / next career
    c.isRecommendation = false;
    if (completed.has(c.parentSlug)) {
      c.status = "active";
    } else {
      c.status = "locked";
    }
  });

  return careerPath;
}

/**
 * Top 3 recommendations → ALL unlocked immediately.
 * Their path-next careers → locked until that recommendation's project is approved.
 */
async function createProgressFromRecommendations(userId, recommendations) {
  if (!userId || !Array.isArray(recommendations) || !recommendations.length) {
    throw new Error("userId and recommendations are required");
  }

  const topN = recommendations.slice(0, 3);
  const careerPath = [];
  const used = new Set();

  for (const item of topN) {
    const enriched = await enrichRecommendation(item);
    const slug = enriched.slug || toSlug(enriched.career);
    if (!slug || used.has(slug)) continue;

    careerPath.push(
      mapRecommendationToEntry(enriched, "active", {
        isRecommendation: true,
        parentSlug: "",
      })
    );
    used.add(slug);
    await appendNextPathCareers(careerPath, enriched, used);
  }

  applyUnlockRules(careerPath);

  const top = careerPath.find((c) => c.isRecommendation) || careerPath[0];
  const doc = await Progress.findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(userId) },
    {
      $set: {
        userId: new mongoose.Types.ObjectId(userId),
        recommendedCareer: top?.career || "",
        matchPercentage: top?.matchPercentage || 0,
        careerPath,
        currentCareerIndex: 0,
        journeyComplete: false,
        overallProgress: 0,
      },
    },
    { upsert: true, new: true }
  );

  summarizeProgress(doc);
  doc.markModified("careerPath");
  await doc.save();
  return doc;
}

/** Sync top-3 + path-next; preserve progress; keep top-3 unlocked. */
async function syncMissingRecommendations(doc, userId) {
  try {
    const History = require("../../model/history");
    const hist = await History.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();
    const batches = hist?.recommendations || [];
    if (!batches.length) return false;

    const latest = batches[batches.length - 1]?.data || [];
    if (!Array.isArray(latest) || !latest.length) return false;

    const bySlug = {};
    (doc.careerPath || []).forEach((c) => {
      bySlug[c.slug] = c;
    });

    const rebuilt = [];
    const used = new Set();
    const topSlugs = new Set();

    for (const item of latest.slice(0, 3)) {
      const enriched = await enrichRecommendation(item);
      const slug = enriched.slug || toSlug(enriched.career);
      if (!slug || used.has(slug)) continue;
      topSlugs.add(slug);

      if (bySlug[slug]) {
        backfillEntryFromDetail(bySlug[slug], enriched);
        bySlug[slug].isRecommendation = true;
        bySlug[slug].parentSlug = "";
        if (bySlug[slug].status !== "completed") {
          bySlug[slug].status = "active";
        }
        rebuilt.push(bySlug[slug]);
      } else {
        rebuilt.push(
          mapRecommendationToEntry(enriched, "active", {
            isRecommendation: true,
            parentSlug: "",
          })
        );
      }
      used.add(slug);

      // Path-next under this recommendation
      for (const nextSlug of collectNextSlugs(enriched).slice(0, 3)) {
        if (used.has(nextSlug)) continue;
        try {
          const detail = await fetchCareerDetail(nextSlug);
          if (!detail || detail.error) continue;
          if (bySlug[nextSlug]) {
            backfillEntryFromDetail(bySlug[nextSlug], detail);
            bySlug[nextSlug].isRecommendation = false;
            bySlug[nextSlug].parentSlug = slug;
            rebuilt.push(bySlug[nextSlug]);
          } else {
            rebuilt.push(
              mapRecommendationToEntry(
                {
                  ...detail,
                  match_percentage: Math.max(
                    35,
                    (enriched.match_percentage || 70) - 8
                  ),
                },
                "locked",
                { isRecommendation: false, parentSlug: slug }
              )
            );
          }
          used.add(nextSlug);
        } catch {
          /* ignore */
        }
      }
    }

    // Keep other existing path entries (deeper next-next) with parent tags if possible
    (doc.careerPath || []).forEach((c) => {
      if (used.has(c.slug)) return;
      if (!c.parentSlug && !c.isRecommendation && !topSlugs.has(c.slug)) {
        // legacy path-next without parent — keep locked until we can infer
        c.isRecommendation = false;
      }
      rebuilt.push(c);
      used.add(c.slug);
    });

    // Also append next-next for path steps already completed/active
    for (const c of [...rebuilt]) {
      if (c.status !== "completed" && c.status !== "active") continue;
      if (c.isRecommendation) continue;
      try {
        const detail = await fetchCareerDetail(c.slug);
        for (const nextSlug of collectNextSlugs(detail || {}).slice(0, 2)) {
          if (used.has(nextSlug)) continue;
          const nextDetail = await fetchCareerDetail(nextSlug);
          if (!nextDetail || nextDetail.error) continue;
          rebuilt.push(
            mapRecommendationToEntry(nextDetail, "locked", {
              isRecommendation: false,
              parentSlug: c.slug,
            })
          );
          used.add(nextSlug);
        }
      } catch {
        /* ignore */
      }
    }

    applyUnlockRules(rebuilt);

    doc.careerPath = rebuilt;
    const firstRec = rebuilt.find((c) => c.isRecommendation) || rebuilt[0];
    doc.currentCareerIndex = Math.max(
      0,
      rebuilt.findIndex((c) => c.slug === firstRec?.slug)
    );
    if (firstRec) {
      doc.recommendedCareer = firstRec.career;
      doc.matchPercentage = firstRec.matchPercentage || doc.matchPercentage;
    }

    summarizeProgress(doc);
    doc.markModified("careerPath");
    await doc.save();
    return true;
  } catch (err) {
    console.error("syncMissingRecommendations:", err.message);
    return false;
  }
}

/**
 * Ensure career is trackable (Mark Done / projects).
 * Top-3 recommendations always OK. Path-next only after parent approved.
 */
const ensureCareerOnPath = async (req, res) => {
  try {
    const { userId, slug } = req.body;
    if (!userId || !slug) {
      return res.status(400).json({ error: "userId and slug are required" });
    }

    const doc = await Progress.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });
    if (!doc) return res.status(404).json({ error: "Progress not found" });

    await syncMissingRecommendations(doc, userId);
    const fresh = await Progress.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    let entry = fresh.careerPath.find((c) => c.slug === slug);
    const detail = await fetchCareerDetail(slug);
    if (!detail || detail.error) {
      return res.status(404).json({ error: "Career not found" });
    }

    // Is this one of the top-3 recommendations?
    const History = require("../../model/history");
    const hist = await History.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();
    const latest = hist?.recommendations?.slice(-1)?.[0]?.data || [];
    const topSlugs = latest
      .slice(0, 3)
      .map((r) => r.slug || toSlug(r.career));
    const isTopRec = topSlugs.includes(slug);

    if (entry) {
      if (entry.status === "locked") {
        return res.status(400).json({
          error:
            "This next career path unlocks only after you finish Watch Guide, Documentation, skills, challenges, submit GitHub project, and get admin approval on the previous career.",
        });
      }
      backfillEntryFromDetail(entry, detail);
      if (isTopRec) {
        entry.isRecommendation = true;
        entry.parentSlug = "";
        if (entry.status !== "completed") entry.status = "active";
      }
      fresh.markModified("careerPath");
      await fresh.save();
      return res.json({ progress: fresh, currentCareer: entry, ensured: true });
    }

    // Missing entry
    if (isTopRec) {
      const mapped = mapRecommendationToEntry(detail, "active", {
        isRecommendation: true,
        parentSlug: "",
      });
      fresh.careerPath.push(mapped);
      await appendNextPathCareers(fresh.careerPath, { ...detail, slug }, new Set(fresh.careerPath.map((c) => c.slug)));
      applyUnlockRules(fresh.careerPath);
      fresh.markModified("careerPath");
      await fresh.save();
      return res.json({
        progress: fresh,
        currentCareer: mapped,
        ensured: true,
        created: true,
      });
    }

    // Path-next: require completed parent that points here
    let parentSlug = "";
    for (const c of fresh.careerPath) {
      if (c.status !== "completed") continue;
      try {
        const parentMl = await fetchCareerDetail(c.slug);
        if (collectNextSlugs(parentMl || {}).includes(slug)) {
          parentSlug = c.slug;
          break;
        }
      } catch {
        /* ignore */
      }
    }

    if (!parentSlug) {
      return res.status(400).json({
        error:
          "This next career path unlocks only after admin approval of the previous career project.",
      });
    }

    const mapped = mapRecommendationToEntry(detail, "active", {
      isRecommendation: false,
      parentSlug,
    });
    fresh.careerPath.push(mapped);
    applyUnlockRules(fresh.careerPath);
    fresh.currentCareerIndex = fresh.careerPath.findIndex((c) => c.slug === slug);
    fresh.markModified("careerPath");
    await fresh.save();

    res.json({
      progress: fresh,
      currentCareer: mapped,
      ensured: true,
      created: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to ensure career on path" });
  }
};

const initProgress = async (req, res) => {
  try {
    const doc = await createProgressFromRecommendations(
      req.body.userId,
      req.body.recommendations
    );
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to initialize progress" });
  }
};

const getProgress = async (req, res) => {
  try {
    const doc = await Progress.findOne({
      userId: new mongoose.Types.ObjectId(req.params.userId),
    });
    if (!doc) return res.json(null);

    // Ensure every saved recommendation is on the journey (Mark Done / projects / approval)
    await syncMissingRecommendations(doc, req.params.userId);

    const fresh = await Progress.findOne({
      userId: new mongoose.Types.ObjectId(req.params.userId),
    });

    const { projects, bySlug } = await loadProjectsGrouped(req.params.userId);
    // Derive project/status summary for the response only — do not save on GET
    summarizeWithProjects(fresh, bySlug);

    const user = await User.findById(req.params.userId).select(
      "name email strength education skills interests"
    );
    const current =
      fresh.careerPath[fresh.currentCareerIndex] || fresh.careerPath[0] || null;
    const nextCareer =
      current?.status === "completed"
        ? fresh.careerPath[fresh.currentCareerIndex + 1] ||
          fresh.careerPath.find(
            (c) => c.status === "active" && c.slug !== current.slug
          )
        : null;

    const careerProjects = current
      ? (bySlug[current.slug] || [])
      : [];
    res.json({
      progress: fresh,
      user,
      currentCareer: current,
      projects,
      projectUnlocked: current
        ? canOpenCapstone(current, careerProjects)
        : false,
      nextCareerUnlocked: Boolean(
        current?.status === "completed" &&
          fresh.careerPath.some(
            (c) =>
              c.parentSlug === current?.slug && c.status === "active"
          )
      ),
      nextCareer,
      showJobs: fresh.journeyComplete,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
};

const updateSkills = async (req, res) => {
  try {
    const { userId, slug, completedSkills } = req.body;
    const doc = await Progress.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!doc) return res.status(404).json({ error: "Progress not found" });
    const entry = doc.careerPath.find((c) => c.slug === slug);
    if (!entry || entry.status === "locked") {
      return res.status(400).json({ error: "Career path is locked" });
    }
    entry.completedSkills = Array.isArray(completedSkills) ? completedSkills : [];
    summarizeProgress(doc);
    doc.markModified("careerPath");
    await doc.save();
    res.json({ progress: doc, currentCareer: entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update skills" });
  }
};

const updateResources = async (req, res) => {
  try {
    const { userId, slug, resource, completed } = req.body;
    const doc = await Progress.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!doc) return res.status(404).json({ error: "Progress not found" });
    const entry = doc.careerPath.find((c) => c.slug === slug);
    if (!entry || entry.status === "locked") {
      return res.status(400).json({ error: "Career path is locked" });
    }
    if (resource === "watch" || resource === "documentation") {
      entry.completedResources[resource] = Boolean(completed);
    }
    if (entry.project?.status === "not_started" && resourcesComplete(entry)) {
      entry.project.status = "in_progress";
    }
    summarizeProgress(doc);
    doc.markModified("careerPath");
    await doc.save();
    res.json({ progress: doc, projectUnlocked: resourcesComplete(entry), currentCareer: entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update resources" });
  }
};

const updateChallenges = async (req, res) => {
  try {
    const { userId, slug, challengeId, completed } = req.body;
    const doc = await Progress.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!doc) return res.status(404).json({ error: "Progress not found" });
    const entry = doc.careerPath.find((c) => c.slug === slug);
    if (!entry || entry.status === "locked") {
      return res.status(400).json({ error: "Career path is locked" });
    }
    const id = String(challengeId);
    const set = new Set(entry.completedChallenges || []);
    if (completed) set.add(id);
    else set.delete(id);
    entry.completedChallenges = Array.from(set);
    if (entry.project?.status === "not_started" && resourcesComplete(entry)) {
      entry.project.status = "in_progress";
    }
    summarizeProgress(doc);
    doc.markModified("careerPath");
    await doc.save();
    res.json({ progress: doc, projectUnlocked: resourcesComplete(entry), currentCareer: entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update challenges" });
  }
};

const startProject = async (req, res) => {
  try {
    const { userId, slug } = req.body;
    const doc = await Progress.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!doc) return res.status(404).json({ error: "Progress not found" });
    const entry = doc.careerPath.find((c) => c.slug === slug);
    if (!entry || entry.status === "locked") {
      return res.status(400).json({ error: "Career path is locked" });
    }
    if (!resourcesComplete(entry)) {
      return res.status(400).json({ error: "Complete learning resources and challenges first" });
    }
    const st = entry.project?.status;
    if (!st || st === "not_started" || st === "rejected") {
      entry.project = {
        ...(entry.project?.toObject?.() || entry.project || {}),
        status: "in_progress",
      };
    }
    summarizeProgress(doc);
    doc.markModified("careerPath");
    await doc.save();
    res.json({ progress: doc, currentCareer: entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start project" });
  }
};

// Legacy endpoint — prefer POST /api/projects/submit
const submitProject = async (req, res) => {
  const projectCtrl = require("./projectController");
  return projectCtrl.submitProject(req, res);
};

const activateCareer = async (req, res) => {
  try {
    const { userId, slug } = req.body;
    const doc = await Progress.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!doc) return res.status(404).json({ error: "Progress not found" });
    const index = doc.careerPath.findIndex((c) => c.slug === slug);
    if (index < 0) return res.status(404).json({ error: "Career not found" });
    if (doc.careerPath[index].status === "locked") {
      return res.status(400).json({
        error: "Next career unlocks only after an admin approves your project",
      });
    }
    doc.currentCareerIndex = index;
    await doc.save();
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to activate career" });
  }
};

module.exports = {
  initProgress,
  getProgress,
  updateSkills,
  updateResources,
  updateChallenges,
  startProject,
  submitProject,
  activateCareer,
  ensureCareerOnPath,
  createProgressFromRecommendations,
  resourcesComplete,
  summarizeProgress,
  syncMissingRecommendations,
};
