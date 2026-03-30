const mongoose = require("mongoose");

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
    learningResources: [{ type: String }],

    video: { type: String, default: null },
    pdf: { type: String, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Course", CourseSchema);
