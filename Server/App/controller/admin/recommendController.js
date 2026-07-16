const History = require("../../model/history");
const { User } = require("../../model/Usermodel");
const mongoose = require("mongoose");
const { createProgressFromRecommendations } = require("./progressController");

const ALLOWED_STRENGTHS = new Set([
  "creativity",
  "communication",
  "teamwork",
  "attention to detail",
  "leadership",
  "problem solving",
  "research",
  "patience",
  "quick learner",
  "analytical mindset",
  "presentation skills",
  "logical thinking",
]);

const ALLOWED_EDUCATIONS = new Set([
  "bca",
  "mca",
  "bsc it",
  "bsc computer science",
  "btech information technology",
  "be computer engineering",
  "be software engineering",
  "be electronics and communication",
  "diploma in computer science",
]);

const normalizeChoice = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const recommendCareer = async (req, res) => {
  try {
    const { userId, skills, interests, recommendations, name, strength, education } = req.body;

    if (!userId || !skills || !interests) {
      return res.status(400).json({ error: "userId, skills, and interests are required" });
    }

    const skillsText = String(skills).trim();
    const interestsText = String(interests).trim();
    if (skillsText.length < 3 || interestsText.length < 3) {
      return res.status(400).json({
        error: "Skills and interests must be meaningful (not empty or too short).",
      });
    }

    // Strength may be a single value or comma-separated multi-select
    const strengthParts = String(strength || "")
      .split(",")
      .map((s) => normalizeChoice(s))
      .filter(Boolean);
    if (!strengthParts.length) {
      return res.status(400).json({
        error: "Please select at least one strength.",
      });
    }
    const invalidStrength = strengthParts.find((s) => !ALLOWED_STRENGTHS.has(s));
    if (invalidStrength) {
      return res.status(400).json({
        error:
          "Please choose valid strengths (e.g. Problem Solving, Creativity, Analytical Mindset).",
      });
    }

    const educationNorm = normalizeChoice(education);
    if (!educationNorm || educationNorm === "other") {
      return res.status(400).json({
        error:
          "Please choose a valid education or enter details when selecting Other.",
      });
    }
    if (
      !ALLOWED_EDUCATIONS.has(educationNorm) &&
      (educationNorm.length < 3 ||
        /^(asdf|qwerty|xxx|test|dummy|none|n\/?a|null)$/i.test(educationNorm))
    ) {
      return res.status(400).json({
        error: "Please enter a valid education for Other.",
      });
    }

    const dataArray = Array.isArray(recommendations) ? recommendations : [];
    if (dataArray.length === 0) {
      return res.status(422).json({
        error:
          "No career recommendations to save. Please revise your skills and interests.",
      });
    }

    const maxMatch = Math.max(
      ...dataArray.map((r) => Number(r.match_percentage) || 0)
    );
    if (maxMatch <= 25) {
      return res.status(422).json({
        error:
          "Recommendations are too weak to save. Enter skills and interests that match tech careers.",
      });
    }

    await History.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      {
        $push: {
          recommendations: {
            data: dataArray,
            date: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    );

    const profileUpdates = {
      skills: skillsText,
      interests: interestsText,
    };
    if (typeof name === "string" && name.trim()) profileUpdates.name = name.trim();
    if (typeof strength === "string") profileUpdates.strength = strength.trim();
    if (typeof education === "string") profileUpdates.education = education.trim();

    await User.findByIdAndUpdate(userId, { $set: profileUpdates });

    if (dataArray.length > 0) {
      try {
        await createProgressFromRecommendations(userId, dataArray);
      } catch (err) {
        console.error("Progress init error:", err.message);
      }
    }

    res.json({ message: "Saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Recommendation failed" });
  }
};

const getHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const data = await History.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    res.json(data?.recommendations || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "History fetch failed" });
  }
};

const getHistoryCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const data = await History.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    res.json({ count: data?.recommendations?.length || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching count" });
  }
};

module.exports = { recommendCareer, getHistory, getHistoryCount };