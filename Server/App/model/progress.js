const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "not_started",
        "in_progress",
        "pending_review",
        "approved",
        "rejected",
        "completed", // legacy
      ],
      default: "not_started",
    },
    githubUrl: { type: String, default: "" },
    demoUrl: { type: String, default: "" },
    screenshotUrl: { type: String, default: "" },
    submittedAt: { type: Date },
    title: { type: String, default: "" },
    feedback: { type: String, default: "" },
    projectId: { type: String, default: "" },
  },
  { _id: false }
);

const careerPathSchema = new mongoose.Schema(
  {
    career: { type: String, required: true },
    slug: { type: String, required: true },
    /** Top recommendation from assessment (unlocked immediately). */
    isRecommendation: { type: Boolean, default: false },
    /** Path-next careers unlock only after this parent career is approved. */
    parentSlug: { type: String, default: "" },
    matchPercentage: { type: Number, default: 0 },
    description: { type: String, default: "" },
    tools: { type: [String], default: [] },
    requiredSkills: { type: [String], default: [] },
    videoUrl: { type: String, default: "" },
    videoTitle: { type: String, default: "" },
    pdfUrl: { type: String, default: "" },
    roadmapUrl: { type: String, default: "" },
    practiceChallenges: { type: [Object], default: [] },
    projectAssignment: { type: Object, default: {} },
    jobs: { type: [Object], default: [] },
    advantages: { type: [String], default: [] },
    challenges: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["locked", "active", "completed"],
      default: "locked",
    },
    completedSkills: { type: [String], default: [] },
    completedResources: {
      watch: { type: Boolean, default: false },
      documentation: { type: Boolean, default: false },
    },
    completedChallenges: { type: [String], default: [] },
    project: { type: projectSchema, default: () => ({}) },
    jobReadiness: { type: Number, default: 0 },
    progressPercent: { type: Number, default: 0 },
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    recommendedCareer: { type: String, default: "" },
    matchPercentage: { type: Number, default: 0 },
    careerPath: { type: [careerPathSchema], default: [] },
    currentCareerIndex: { type: Number, default: 0 },
    journeyComplete: { type: Boolean, default: false },
    overallProgress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);
