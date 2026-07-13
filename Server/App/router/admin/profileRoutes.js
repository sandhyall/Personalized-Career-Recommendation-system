const express = require("express");
const {
  getProfile,
  updateProfile,
} = require("../../controller/admin/profileController");

const router = express.Router();

router.get("/:userId", getProfile);
router.put("/:userId", updateProfile);

module.exports = router;
