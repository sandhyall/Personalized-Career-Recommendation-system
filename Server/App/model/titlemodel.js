const mongoose = require("mongoose");

const TitleSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Title", TitleSchema);