const { User } = require("../../model/Usermodel");
const History = require("../../model/history");
const Progress = require("../../model/progress");
const Project = require("../../model/project");
const mongoose = require("mongoose");

/** List all registered/logged-in students (no passwords). */
const listUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      status: "success",
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.error("List users error:", err);
    return res.status(500).json({
      status: "error",
      msg: "Server error while fetching users",
    });
  }
};

/** Delete a student and related progress / history / projects. */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "error", msg: "Invalid user id" });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ status: "error", msg: "User not found" });
    }

    const userOid = new mongoose.Types.ObjectId(id);
    await Promise.all([
      History.deleteMany({ userId: userOid }),
      Progress.deleteMany({ userId: userOid }),
      Project.deleteMany({ studentId: userOid }),
    ]);

    return res.status(200).json({
      status: "success",
      msg: "User deleted successfully",
      data: { _id: id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({
      status: "error",
      msg: "Server error while deleting user",
    });
  }
};

module.exports = { listUsers, deleteUser };
