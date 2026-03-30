const Courses = require("../../model/coursemodel");
const mongoose = require("mongoose");

const CoursesInsert = async (req, res) => {
  try {
    const {
      name,
      description,
      topicId,
      titleId,
      tools,
      responsibilities,
      advantages,
      challenges,
    } = req.body;

    if (!name?.trim() || !description?.trim() || !topicId || !titleId) {
      return res.status(400).json({
        status: "error",
        msg: "Name, Description, TopicId, and TitleId are required",
      });
    }

    const newCourse = new Courses({
      name: name.trim(),
      description: description.trim(),
      topicId,
      titleId,

      tools: Array.isArray(tools) ? tools : JSON.parse(tools || "[]"),
      responsibilities: Array.isArray(responsibilities)
        ? responsibilities
        : JSON.parse(responsibilities || "[]"),
      advantages: Array.isArray(advantages)
        ? advantages
        : JSON.parse(advantages || "[]"),
      challenges: Array.isArray(challenges)
        ? challenges
        : JSON.parse(challenges || "[]"),

      video: req.files?.video?.[0]?.filename || null,
      pdf: req.files?.pdf?.[0]?.filename || null,
    });

    const savedCourse = await newCourse.save();

    return res.status(201).json({
      status: "success",
      msg: "Course added successfully",
      data: savedCourse,
    });
  } catch (err) {
    console.error("Insert error:", err);
    return res
      .status(500)
      .json({ status: "error", msg: "Server error while creating course" });
  }
};

const CoursesList = async (req, res) => {
  try {
    const courses = await Courses.find()
      .populate("topicId", "name")
      .populate("titleId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      msg: "Courses fetched successfully",
      count: courses.length,
      data: courses,
    });
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({
      status: "error",
      msg: "Server error while fetching courses",
    });
  }
};
const EditCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.name) updateData.name = updateData.name.trim();
    if (updateData.description)
      updateData.description = updateData.description.trim();

    const arrayFields = [
      "tools",
      "responsibilities",
      "advantages",
      "challenges",
    ];
    arrayFields.forEach((field) => {
      if (updateData[field] && typeof updateData[field] === "string") {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (e) {
          updateData[field] = updateData[field].split(",").map((s) => s.trim());
        }
      }
    });

    if (req.files?.video?.[0]?.filename) {
      updateData.video = req.files.video[0].filename;
    }
    if (req.files?.pdf?.[0]?.filename) {
      updateData.pdf = req.files.pdf[0].filename;
    }

    const updated = await Courses.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return res.status(404).json({ status: "error", msg: "Course not found" });

    return res.status(200).json({
      status: "success",
      msg: "Course updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("Update error:", err);
    return res
      .status(500)
      .json({ status: "error", msg: "Server error while updating course" });
  }
};

const DeleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        msg: "Valid Course ID is required",
      });
    }

    const deletedCourse = await Courses.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({
        status: "error",
        msg: "Course not found",
      });
    }

    return res.status(200).json({
      status: "success",
      msg: "Course deleted successfully",
      data: deletedCourse,
    });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({
      status: "error",
      msg: "Server error while deleting course",
    });
  }
};
const getSingleCourse = async (req, res) => {
  try {
   
    const course = await Courses.findById(req.params.id)
      .populate("topicId")
      .populate("titleId");

    if (!course) {
      return res.status(404).json({
        status: "error",
        msg: "Career recommendation not found",
      });
    }

 
    res.status(200).json({
      status: "success",
      data: course,
    });

  } catch (err) {
    console.error("getSingleCourse error:", err);
    res.status(500).json({
      status: "error",
      msg: "Server error",
    });
  }
};



module.exports = {
  CoursesInsert,
  CoursesList,
  EditCourse,
  DeleteCourse,
  getSingleCourse
};
   