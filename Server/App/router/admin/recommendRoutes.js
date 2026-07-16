const express = require("express");
const {
  recommendCareer,
  getHistory,
  getHistoryCount,
} = require("../../controller/admin/recommendController");

const router = express.Router();

router.post("/recommend", recommendCareer);
router.get("/history/count/:userId", getHistoryCount);
router.get("/history/:userId", getHistory);

module.exports = router;
