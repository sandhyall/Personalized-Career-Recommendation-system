const axios = require("axios");
const History = require("../../model/history");
const { User } = require("../../model/Usermodel");
const mongoose = require("mongoose");

const recommendCareer = async (req, res) => {
  try {
    const { userId, skills, interests, recommendations, name, strength, education } = req.body;

    if (!userId || !skills || !interests) {
      return res.status(400).json({ error: "userId, skills, and interests are required" });
    }

    const dataArray = Array.isArray(recommendations) ? recommendations : [];

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

    // Keep user profile fields in sync
    const profileUpdates = {
      skills: String(skills).trim(),
      interests: String(interests).trim(),
    };
    if (typeof name === "string" && name.trim()) profileUpdates.name = name.trim();
    if (typeof strength === "string") profileUpdates.strength = strength.trim();
    if (typeof education === "string") profileUpdates.education = education.trim();

    await User.findByIdAndUpdate(userId, { $set: profileUpdates });

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