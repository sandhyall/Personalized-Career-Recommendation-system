const express = require("express");
const {
  TopicInsert,
  TopicList,
  DeleteTopic,
  EditTopic,
} = require("../../controller/admin/topicController");

const TopicRoute = express.Router();

TopicRoute.post("/insert", TopicInsert);
TopicRoute.get("/list", TopicList);
TopicRoute.delete("/delete/:id", DeleteTopic);
TopicRoute.put("/update/:id", EditTopic);

module.exports = TopicRoute;
