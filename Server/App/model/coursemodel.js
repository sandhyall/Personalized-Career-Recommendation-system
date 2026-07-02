const mongoose = require("mongoose");

const LearningResourceSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["video", "pdf", "article"], default: "article" },
    title: String,
    url: String,
    platform: String,
  },
  { _id: false },
);

const RoadmapStepSchema = new mongoose.Schema(
  {
    step: Number,
    title: String,
    description: String,
    duration: String,
  },
  { _id: false },
);

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
      index: true,
    },
    titleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Title",
      required: true,
      index: true,
    },

    description: { type: String, required: true },

    tools: [{ type: String }],
    responsibilities: [{ type: String }],
    advantages: [{ type: String }],
    challenges: [{ type: String }],
    learningResources: [LearningResourceSchema],

    video: { type: String, default: null },
    videoUrl: { type: String, default: null },
    pdf: { type: String, default: null },
    roadmap: [RoadmapStepSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Course", CourseSchema);
