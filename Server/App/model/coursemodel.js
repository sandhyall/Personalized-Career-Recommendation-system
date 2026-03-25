const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    titleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Title",
      required: true,
    },
    video: {
      type: String,
    },
    pdf: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);