const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  listStudentProjects,
  listProjectsByCareer,
  submitProject,
  resubmitProject,
  listAllProjectsAdmin,
  approveProject,
  rejectProject,
} = require("../../controller/admin/projectController");

const router = express.Router();

const uploadDir = path.join(__dirname, "../../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `project-${unique}${path.extname(file.originalname) || ".png"}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only image uploads are allowed"));
  },
});

// Admin
router.get("/admin/all", listAllProjectsAdmin);
router.post("/admin/:projectId/approve", approveProject);
router.post("/admin/:projectId/reject", rejectProject);

// Student
router.get("/student/:userId", listStudentProjects);
router.get("/student/:userId/career/:slug", listProjectsByCareer);
router.post("/submit", upload.single("screenshot"), submitProject);
router.put("/:projectId/resubmit", upload.single("screenshot"), resubmitProject);

module.exports = router;
