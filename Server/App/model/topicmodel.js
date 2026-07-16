const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Topic", TopicSchema);
