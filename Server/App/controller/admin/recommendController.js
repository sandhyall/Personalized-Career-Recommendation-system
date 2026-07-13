const axios = require("axios");
const History = require("../../model/history");
const mongoose = require("mongoose");

const recommendCareer = async (req, res) => {
  try {
    const { userId, skills, interests, recommendations } = req.body;

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