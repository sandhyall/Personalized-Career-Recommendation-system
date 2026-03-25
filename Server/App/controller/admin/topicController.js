const Topic = require("../../model/topicmodel");

const TopicInsert = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "error",
        msg: "Name is required",
      });
    }

    const newTopic = new Topic({ name });
    const saveTopic = await newTopic.save();

    res.status(201).json({
      status: "success",
      msg: "Topic added successfully",
      data: saveTopic,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      msg: err.message,
    });
  }
};

const TopicList = async (req, res) => {
  try {
    const topics = await Topic.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      msg: "Topics fetched successfully",
      data: topics,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      msg: err.message,
    });
  }
};

const EditTopic = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "error",
        msg: "Name is required",
      });
    }

    const updatedTopic = await Topic.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true },
    );

    if (!updatedTopic) {
      return res.status(404).json({
        status: "error",
        msg: "Topic not found",
      });
    }

    res.status(200).json({
      status: "success",
      msg: "Topic updated successfully",
      data: updatedTopic,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      msg: err.message,
    });
  }
};

const DeleteTopic = async (req, res) => {
  try {
    const topicData = await Topic.findByIdAndDelete(req.params.id);

    if (!topicData) {
      return res.status(404).json({
        status: "error",
        msg: "Topic not found",
      });
    }

    res.status(200).json({
      status: "success",
      msg: "Topic deleted successfully",
      data: topicData,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      msg: err.message,
    });
  }
};

module.exports = { TopicInsert, TopicList, EditTopic, DeleteTopic };
