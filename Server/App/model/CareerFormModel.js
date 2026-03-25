const mongoose = require("mongoose");

const CareerFormSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    educationLevel: String,
    fieldOfStudy: String,
    skills: String,
    tools: String,
    interestArea: String,
    workPreference: String,
    careerGoal: String,
    experienceLevel: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerForm", CareerFormSchema);