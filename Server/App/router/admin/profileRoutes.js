const express = require("express");
const { getProfile } = require("../../controller/admin/profileController");

const router = express.Router();

router.get("/:userId", getProfile);

module.exports = router;
