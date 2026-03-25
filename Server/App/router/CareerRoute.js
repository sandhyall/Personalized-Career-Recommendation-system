const express = require("express");
const router = express.Router();

const { analyzeCareer } = require("../../controller/CareerController");

router.post("/analyze", analyzeCareer);

module.exports = { CareerRoutes: router };