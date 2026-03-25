const Courses = require("../../model/coursemodel");

const CoursesInsert = async (req, res) => {
  try {
    const { name, topicId, titleId } = req.body;

    if (!name || !topicId || !titleId) {
      return res.status(400).json({
        status: "error",
        msg: "Name, TopicId and TitleId are required",
      });
    }

    const newCourse = new Courses({
      name,
      topicId,
      titleId,
      video: req.files?.video?.[0]?.filename || null,
      pdf: req.files?.pdf?.[0]?.filename || null,
    });

    const savedCourse = await newCourse.save();

    res.status(201).json({
      status: "success",
      msg: "Course added successfully",
      data: savedCourse,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      msg: err.message,
    });
  }
};

const CoursesList = async (req, res) => {
  try {
    const courses = await Courses.find()
      .populate("topicId", "name")
      .populate("titleId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      msg: "Courses fetched successfully",
      data: courses,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      msg: err.message,
    });
  }
};

const EditCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      name: req.body.name,
      topicId: req.body.topicId,
      titleId: req.body.titleId,
    };

    if (req.files?.video) {
      updateData.video = req.files.video[0].filename;
    }

    if (req.files?.pdf) {
      updateData.pdf = req.files.pdf[0].filename;
    }

    const updated = await Courses.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json({
      status: "success",
      data: updated,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({
      status: "error",
      msg: err.message,
    });
  }
};
const DeleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Courses.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return res.status(404).json({
        status: "error",
        msg: "Course not found",
      });
    }

    res.status(200).json({
      status: "success",
      msg: "Course deleted successfully",
      data: deletedCourse,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      msg: err.message,
    });
  }
};

module.exports = {
  CoursesInsert,
  CoursesList,
  EditCourse,
  DeleteCourse,
};
