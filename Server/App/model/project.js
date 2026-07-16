const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    careerId: { type: String, required: true, index: true },
    careerSlug: { type: String, required: true, index: true },
    careerName: { type: String, required: true },
    projectTitle: { type: String, required: true },
    githubUrl: { type: String, required: true },
    liveDemoUrl: { type: String, default: "" },
    screenshot: { type: String, default: "" },
    /** capstone = final project; challenge = practice challenge GitHub work */
    submissionType: {
      type: String,
      enum: ["capstone", "challenge"],
      default: "capstone",
      index: true,
    },
    challengeId: { type: String, default: "", index: true },
    status: {
      type: String,
      enum: [
        "not_started",
        "in_progress",
        "pending_review",
        "approved",
        "rejected",
      ],
      default: "pending_review",
      index: true,
    },
    feedback: { type: String, default: "" },
    submittedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    approvedBy: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
