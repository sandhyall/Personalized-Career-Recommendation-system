const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  initProgress,
  getProgress,
  updateSkills,
  updateResources,
  updateChallenges,
  startProject,
  submitProject,
  activateCareer,
  ensureCareerOnPath,
} = require("../../controller/admin/progressController");

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

router.post("/init", initProgress);
router.post("/ensure-career", ensureCareerOnPath);
router.get("/:userId", getProgress);
router.put("/skills", updateSkills);
router.put("/resources", updateResources);
router.put("/challenges", updateChallenges);
router.post("/project/start", startProject);
router.post("/project", upload.single("screenshot"), submitProject);
router.post("/activate", activateCareer);

module.exports = router;
