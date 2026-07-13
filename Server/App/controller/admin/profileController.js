const { User } = require("../../model/Usermodel");
const mongoose = require("mongoose");

const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Profile Error:", err);
    res
      .status(500)
      .json({ error: "Profile fetch failed", details: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const { name, strength, education, skills, interests } = req.body;
    const updates = {};

    if (typeof name === "string" && name.trim()) updates.name = name.trim();
    if (typeof strength === "string") updates.strength = strength.trim();
    if (typeof education === "string") updates.education = education.trim();
    if (typeof skills === "string") updates.skills = skills.trim();
    if (typeof interests === "string") updates.interests = interests.trim();

    if (!Object.keys(updates).length) {
      return res.status(400).json({ error: "No profile fields to update" });
    }

    const user = await User.findByIdAndUpdate(userId, { $set: updates }, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile saved", user });
  } catch (err) {
    console.error("Profile Update Error:", err);
    res
      .status(500)
      .json({ error: "Profile update failed", details: err.message });
  }
};

module.exports = { getProfile, updateProfile };
