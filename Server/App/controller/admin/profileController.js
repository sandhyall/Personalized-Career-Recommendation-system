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

module.exports = { getProfile };
