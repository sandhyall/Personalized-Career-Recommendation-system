const express = require("express");
const {
  CoursesInsert,
  CoursesList,
  DeleteCourse,
  EditCourse,
} = require("../../controller/admin/courseController");
const upload = require("../../multer/multer");

const CoursesRoute = express.Router();

CoursesRoute.post(
  "/insert",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  CoursesInsert,
);

CoursesRoute.get("/list", CoursesList);
CoursesRoute.delete("/delete/:id", DeleteCourse);
CoursesRoute.put(
  "/update/:id",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  EditCourse
);

module.exports = CoursesRoute;
