const mongoose = require("mongoose");
const Project = require("../../model/project");
const Progress = require("../../model/progress");
const { User } = require("../../model/Usermodel");

function challengeKey(ch) {
  return String(ch?.id || ch?.title || "").trim();
}

/** Watch + docs + every practice challenge has an approved GitHub submission. */
function resourcesComplete(entry, projectsForCareer = []) {
  const watchOk = Boolean(entry.completedResources?.watch);
  const docsOk = Boolean(entry.completedResources?.documentation);
  const challenges = entry.practiceChallenges || [];
  if (!challenges.length) {
    return watchOk && docsOk;
  }
  const approvedIds = new Set(
    projectsForCareer
      .filter(
        (p) =>
          p.submissionType === "challenge" && p.status === "approved"
      )
      .map((p) => String(p.challengeId))
  );
  // Also treat progress.completedChallenges as approved (synced on approve)
  (entry.completedChallenges || []).forEach((id) => approvedIds.add(String(id)));

  const allChallengesApproved = challenges.every((ch) =>
    approvedIds.has(challengeKey(ch))
  );
  return watchOk && docsOk && allChallengesApproved;
}

/** Capstone form unlocks once Watch/Docs done and every challenge has a GitHub submission. */
function canOpenCapstone(entry, projectsForCareer = []) {
  return Boolean(
    entry?.completedResources?.watch &&
      entry?.completedResources?.documentation &&
      challengesSubmittedEnough(entry, projectsForCareer)
  );
}

/** Capstone form unlocks once challenges are at least submitted (pending or approved). */
function challengesSubmittedEnough(entry, projectsForCareer = []) {
  const challenges = entry.practiceChallenges || [];
  if (!challenges.length) return true;
  return challenges.every((ch) => {
    const id = challengeKey(ch);
    const sub = projectsForCareer.find(
      (p) =>
        p.submissionType === "challenge" &&
        String(p.challengeId) === id &&
        ["pending_review", "approved"].includes(p.status)
    );
    return Boolean(sub) || (entry.completedChallenges || []).includes(id);
  });
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

function projectProgressScore(status) {
  if (status === "approved") return 100;
  if (status === "pending_review") return 70;
  if (status === "in_progress" || status === "rejected") return 40;
  return 0;
}

function summarizeWithProjects(doc, projectsBySlug = {}) {
  (doc.careerPath || []).forEach((entry) => {
    const list = projectsBySlug[entry.slug] || [];
    const capstones = list.filter((p) => p.submissionType !== "challenge");
    const challenges = list.filter((p) => p.submissionType === "challenge");
    const latest = capstones[0] || null;

    if (latest) {
      entry.project = {
        status: latest.status,
        githubUrl: latest.githubUrl,
        demoUrl: latest.liveDemoUrl,
        screenshotUrl: latest.screenshot,
        submittedAt: latest.submittedAt,
        title: latest.projectTitle,
        feedback: latest.feedback || "",
        projectId: String(latest._id),
      };
    }

    // Sync approved challenge ids onto completedChallenges
    const approvedChallengeIds = challenges
      .filter((p) => p.status === "approved")
      .map((p) => String(p.challengeId));
    if (approvedChallengeIds.length) {
      entry.completedChallenges = Array.from(
        new Set([...(entry.completedChallenges || []), ...approvedChallengeIds])
      );
    }

    const skillScore = calcJobReadiness(entry.completedSkills, entry.requiredSkills);
    const watch = entry.completedResources?.watch ? 1 : 0;
    const docs = entry.completedResources?.documentation ? 1 : 0;
    const practice = entry.practiceChallenges || [];
    const challengeDone =
      practice.length === 0
        ? 1
        : (entry.completedChallenges || []).length / Math.max(practice.length, 1);
    const resourceScore = ((watch + docs + challengeDone) / 3) * 100;
    const projectScore = projectProgressScore(entry.project?.status);
    entry.jobReadiness = skillScore;
    entry.progressPercent = Math.round(
      skillScore * 0.4 + resourceScore * 0.3 + projectScore * 0.3
    );
  });

  const path = doc.careerPath || [];
  doc.overallProgress =
    path.length === 0
      ? 0
      : Math.round(path.reduce((s, e) => s + (e.progressPercent || 0), 0) / path.length);
  doc.journeyComplete =
    path.length > 0 && path.every((e) => e.status === "completed");
  return doc;
}

async function loadProjectsGrouped(studentId) {
  const projects = await Project.find({ studentId })
    .sort({ submittedAt: -1 })
    .lean();
  const bySlug = {};
  projects.forEach((p) => {
    if (!bySlug[p.careerSlug]) bySlug[p.careerSlug] = [];
    bySlug[p.careerSlug].push(p);
  });
  return { projects, bySlug };
}

async function careerReadyToUnlockNext(studentId, careerSlug, entry) {
  const list = await Project.find({
    studentId: new mongoose.Types.ObjectId(studentId),
    careerSlug,
  }).lean();

  const practice = entry.practiceChallenges || [];
  const challengeSubs = list.filter((p) => p.submissionType === "challenge");
  const allChallengesApproved =
    practice.length === 0 ||
    practice.every((ch) => {
      const id = challengeKey(ch);
      return challengeSubs.some(
        (p) => String(p.challengeId) === id && p.status === "approved"
      );
    });

  const capstoneApproved = list.some(
    (p) => p.submissionType !== "challenge" && p.status === "approved"
  );

  return {
    ready: allChallengesApproved && capstoneApproved,
    allChallengesApproved,
    capstoneApproved,
    approvedChallengeCount: challengeSubs.filter((p) => p.status === "approved")
      .length,
    totalChallenges: practice.length,
  };
}

/** After ANY approval — unlock next path ONLY when all challenges + capstone approved. */
async function applyApprovalToProgress(studentId, careerSlug) {
  const doc = await Progress.findOne({
    userId: new mongoose.Types.ObjectId(studentId),
  });
  if (!doc) return null;

  const index = doc.careerPath.findIndex((c) => c.slug === careerSlug);
  if (index < 0) return doc;

  const entry = doc.careerPath[index];
  const { bySlug } = await loadProjectsGrouped(studentId);
  summarizeWithProjects(doc, bySlug);

  const readiness = await careerReadyToUnlockNext(studentId, careerSlug, entry);

  // Update embedded project from latest capstone
  const list = bySlug[careerSlug] || [];
  const latestCapstone = list.find((p) => p.submissionType !== "challenge");
  if (latestCapstone) {
    entry.project = {
      ...(entry.project?.toObject?.() || entry.project || {}),
      status: latestCapstone.status,
      githubUrl: latestCapstone.githubUrl,
      demoUrl: latestCapstone.liveDemoUrl,
      title: latestCapstone.projectTitle,
      feedback: latestCapstone.feedback || "",
      projectId: String(latestCapstone._id),
      submittedAt: latestCapstone.submittedAt,
    };
  }

  if (!readiness.ready) {
    // Keep career active — next path stays locked
    if (entry.status !== "completed") entry.status = "active";
    doc.markModified("careerPath");
    await doc.save();
    return {
      doc,
      unlocked: false,
      readiness,
      message: `Approved. Next path unlocks after all ${readiness.totalChallenges} practice challenge GitHub submissions AND the final project are approved (${readiness.approvedChallengeCount}/${readiness.totalChallenges} challenges done).`,
    };
  }

  // All requirements met — complete career and unlock path-next
  entry.status = "completed";
  const required = entry.requiredSkills || [];
  entry.completedSkills = Array.from(
    new Set([...(entry.completedSkills || []), ...required])
  );

  doc.careerPath.forEach((c) => {
    if (c.parentSlug === careerSlug && c.status === "locked") {
      c.status = "active";
    }
  });

  try {
    const axios = require("axios");
    const ML_URL = process.env.ML_URL || "http://localhost:5002";
    const parentRes = await axios.get(`${ML_URL}/career/${careerSlug}`, {
      timeout: 10000,
    });
    const nextSlugs = [];
    const pd = parentRes.data?.path_data || {};
    if (pd.next_slug) nextSlugs.push(pd.next_slug);
    (pd.steps || []).forEach((s) => {
      if (s?.slug && s.clickable !== false) nextSlugs.push(s.slug);
    });

    for (const nextSlug of [...new Set(nextSlugs)].slice(0, 3)) {
      let next = doc.careerPath.find((c) => c.slug === nextSlug);
      if (next) {
        next.parentSlug = careerSlug;
        next.isRecommendation = false;
        if (next.status !== "completed") next.status = "active";
      } else {
        const nextRes = await axios.get(`${ML_URL}/career/${nextSlug}`, {
          timeout: 10000,
        });
        if (nextRes.data && !nextRes.data.error) {
          doc.careerPath.push({
            career: nextRes.data.career,
            slug: nextSlug,
            isRecommendation: false,
            parentSlug: careerSlug,
            matchPercentage: nextRes.data.match_percentage || 50,
            description: nextRes.data.description || "",
            tools: nextRes.data.tools || [],
            requiredSkills: nextRes.data.required_skills || [],
            videoUrl: nextRes.data.video_url || "",
            videoTitle: nextRes.data.video_title || "",
            pdfUrl: nextRes.data.pdf_url || "",
            roadmapUrl: nextRes.data.roadmap_url || "",
            practiceChallenges: nextRes.data.practice_challenges || [],
            projectAssignment: nextRes.data.project_assignment || {},
            jobs: nextRes.data.jobs || [],
            advantages: nextRes.data.advantages || [],
            challenges: nextRes.data.challenges || [],
            status: "active",
            completedSkills: [],
            completedResources: { watch: false, documentation: false },
            completedChallenges: [],
            project: { status: "not_started" },
            jobReadiness: 0,
            progressPercent: 0,
          });
        }
      }
    }
  } catch (err) {
    console.error("Unlock next path career failed:", err.message);
  }

  doc.careerPath.forEach((c) => {
    if (c.status === "completed") return;
    if (c.isRecommendation || !c.parentSlug) {
      c.isRecommendation = true;
      c.status = "active";
    }
  });

  const nextActive = doc.careerPath.find(
    (c) => c.parentSlug === careerSlug && c.status === "active"
  );
  doc.currentCareerIndex = nextActive
    ? doc.careerPath.findIndex((c) => c.slug === nextActive.slug)
    : index;

  doc.journeyComplete =
    doc.careerPath.length > 0 &&
    doc.careerPath.every((c) => c.status === "completed");

  summarizeWithProjects(doc, bySlug);
  doc.markModified("careerPath");
  await doc.save();
  return {
    doc,
    unlocked: true,
    readiness,
    message: "All practice challenges and final project approved. Next career path unlocked.",
  };
}

const listStudentProjects = async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await Project.find({
      studentId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ submittedAt: -1 })
      .lean();
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load projects" });
  }
};

const listProjectsByCareer = async (req, res) => {
  try {
    const { userId, slug } = req.params;
    const projects = await Project.find({
      studentId: new mongoose.Types.ObjectId(userId),
      careerSlug: slug,
    })
      .sort({ submittedAt: -1 })
      .lean();
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load career projects" });
  }
};

const submitProject = async (req, res) => {
  try {
    const {
      userId,
      slug,
      projectTitle,
      githubUrl,
      liveDemoUrl,
      demoUrl,
      submissionType,
      challengeId,
    } = req.body;
    const demo = liveDemoUrl || demoUrl || "";
    const type =
      submissionType === "challenge" ? "challenge" : "capstone";

    if (!userId || !slug || !githubUrl) {
      return res.status(400).json({
        error: "userId, slug, and githubUrl are required",
      });
    }

    if (type === "capstone" && !demo) {
      return res.status(400).json({
        error: "liveDemoUrl is required for the final project",
      });
    }

    if (type === "challenge" && !challengeId) {
      return res.status(400).json({
        error: "challengeId is required for practice challenge submissions",
      });
    }

    const doc = await Progress.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });
    if (!doc) return res.status(404).json({ error: "Progress not found" });

    const entry = doc.careerPath.find((c) => c.slug === slug);
    if (!entry || entry.status === "locked") {
      return res.status(400).json({ error: "Career path is locked" });
    }

    const { bySlug: existingBySlug } = await loadProjectsGrouped(userId);
    const careerProjects = existingBySlug[slug] || [];

    if (type === "challenge") {
      if (!entry.completedResources?.watch || !entry.completedResources?.documentation) {
        return res.status(400).json({
          error: "Complete Watch Guide and Documentation before submitting challenges",
        });
      }
      // Replace prior pending/rejected for same challenge
      await Project.deleteMany({
        studentId: userId,
        careerSlug: slug,
        submissionType: "challenge",
        challengeId: String(challengeId),
        status: { $in: ["pending_review", "rejected", "in_progress"] },
      });
    } else {
      // Capstone requires all challenge GitHubs submitted (pending or approved)
      if (
        !entry.completedResources?.watch ||
        !entry.completedResources?.documentation ||
        !challengesSubmittedEnough(entry, careerProjects)
      ) {
        return res.status(400).json({
          error:
            "Complete Watch Guide, Documentation, and submit GitHub for every practice challenge first",
        });
      }
    }

    let screenshot = req.body.screenshot || "";
    if (req.file) screenshot = `/uploads/${req.file.filename}`;

    const title =
      (projectTitle && String(projectTitle).trim()) ||
      (type === "challenge"
        ? String(challengeId)
        : entry.projectAssignment?.title || `${entry.career} Project`);

    const project = await Project.create({
      studentId: userId,
      careerId: slug,
      careerSlug: slug,
      careerName: entry.career,
      projectTitle: title,
      githubUrl: String(githubUrl).trim(),
      liveDemoUrl:
        type === "challenge"
          ? String(demo).trim()
          : String(demo).trim() || String(githubUrl).trim(),
      screenshot,
      submissionType: type,
      challengeId: type === "challenge" ? String(challengeId) : "",
      status: "pending_review",
      feedback: "",
      submittedAt: new Date(),
    });

    if (type === "capstone") {
      entry.project = {
        status: "pending_review",
        githubUrl: project.githubUrl,
        demoUrl: project.liveDemoUrl,
        screenshotUrl: project.screenshot,
        submittedAt: project.submittedAt,
        title: project.projectTitle,
        feedback: "",
        projectId: String(project._id),
      };
    }

    const { bySlug } = await loadProjectsGrouped(userId);
    summarizeWithProjects(doc, bySlug);
    doc.markModified("careerPath");
    await doc.save();

    res.json({
      message:
        type === "challenge"
          ? "Practice challenge submitted for admin review"
          : "Final project submitted for admin review",
      project,
      progress: doc,
      nextUnlocked: false,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit project" });
  }
};

const resubmitProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { projectTitle, githubUrl, liveDemoUrl, demoUrl } = req.body;
    const demo = liveDemoUrl || demoUrl;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });
    if (project.status !== "rejected") {
      return res.status(400).json({ error: "Only rejected projects can be resubmitted" });
    }

    if (projectTitle) project.projectTitle = String(projectTitle).trim();
    if (githubUrl) project.githubUrl = String(githubUrl).trim();
    if (demo) project.liveDemoUrl = String(demo).trim();
    if (req.file) project.screenshot = `/uploads/${req.file.filename}`;
    project.status = "pending_review";
    project.feedback = "";
    project.submittedAt = new Date();
    project.approvedAt = undefined;
    project.approvedBy = "";
    await project.save();

    const doc = await Progress.findOne({ userId: project.studentId });
    if (doc) {
      const entry = doc.careerPath.find((c) => c.slug === project.careerSlug);
      if (entry) {
        entry.project = {
          status: "pending_review",
          githubUrl: project.githubUrl,
          demoUrl: project.liveDemoUrl,
          screenshotUrl: project.screenshot,
          submittedAt: project.submittedAt,
          title: project.projectTitle,
          feedback: "",
          projectId: String(project._id),
        };
        const { bySlug } = await loadProjectsGrouped(project.studentId);
        summarizeWithProjects(doc, bySlug);
        doc.markModified("careerPath");
        await doc.save();
      }
    }

    res.json({ message: "Project resubmitted for review", project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to resubmit project" });
  }
};

const listAllProjectsAdmin = async (req, res) => {
  try {
    const status = req.query.status;
    const filter = status ? { status } : {};
    const projects = await Project.find(filter)
      .sort({ submittedAt: -1 })
      .populate("studentId", "name email")
      .lean();

    const rows = projects.map((p) => ({
      ...p,
      studentName: p.studentId?.name || "Unknown",
      studentEmail: p.studentId?.email || "",
      studentId: p.studentId?._id || p.studentId,
    }));

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load projects for review" });
  }
};

const approveProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { adminName, feedback } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    project.status = "approved";
    project.feedback = feedback || "Approved";
    project.approvedAt = new Date();
    project.approvedBy = adminName || "Admin";
    await project.save();

    const result = await applyApprovalToProgress(
      project.studentId,
      project.careerSlug
    );

    const unlocked = Boolean(result?.unlocked);
    res.json({
      message:
        result?.message ||
        (unlocked
          ? "Approved — next career path unlocked"
          : "Approved — waiting for remaining challenge/project approvals"),
      project,
      progress: result?.doc || result,
      nextUnlocked: unlocked,
      readiness: result?.readiness,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to approve project" });
  }
};

const rejectProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { feedback, adminName } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    project.status = "rejected";
    project.feedback =
      feedback || "Please revise your submission and try again.";
    project.approvedBy = adminName || "Admin";
    await project.save();

    const doc = await Progress.findOne({ userId: project.studentId });
    if (doc) {
      const entry = doc.careerPath.find((c) => c.slug === project.careerSlug);
      if (entry) {
        entry.project = {
          status: "rejected",
          githubUrl: project.githubUrl,
          demoUrl: project.liveDemoUrl,
          screenshotUrl: project.screenshot,
          submittedAt: project.submittedAt,
          title: project.projectTitle,
          feedback: project.feedback,
          projectId: String(project._id),
        };
        // Keep next path locked
        const { bySlug } = await loadProjectsGrouped(project.studentId);
        summarizeWithProjects(doc, bySlug);
        doc.markModified("careerPath");
        await doc.save();
      }
    }

    res.json({ message: "Project rejected", project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reject project" });
  }
};

module.exports = {
  listStudentProjects,
  listProjectsByCareer,
  submitProject,
  resubmitProject,
  listAllProjectsAdmin,
  approveProject,
  rejectProject,
  loadProjectsGrouped,
  summarizeWithProjects,
  resourcesComplete,
  challengesSubmittedEnough,
  canOpenCapstone,
  careerReadyToUnlockNext,
};
