const express = require("express");
const { TitleInsert, TitleList, DeleteTitle, EditTitle } = require("../../controller/admin/titleController");

const router = express.Router();

router.post("/insert", TitleInsert);
router.get("/list", TitleList);
router.delete("/delete/:id", DeleteTitle);
router.put("/update/:id", EditTitle);

module.exports = router;