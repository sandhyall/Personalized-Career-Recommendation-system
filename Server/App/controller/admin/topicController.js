const Topic = require("../../model/topicmodel");

const TopicInsert = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name?.trim() || !description?.trim()) {
      return res.status(400).json({
        status: "error",
        msg: "Name and Description are required",
      });
    }

    const newTopic = new Topic({
      name: name.trim(),
      description: description.trim(),
    });

    const savedTopic = await newTopic.save();

    return res.status(201).json({
      status: "success",
      msg: "Topic added successfully",
      data: savedTopic,
    });
  } catch (err) {
    console.error("Insert error:", err);
    return res.status(500).json({
      status: "error",
      msg: "Server error while creating topic",
    });
  }
};

const TopicList = async (req, res) => {
  try {
    const topics = await Topic.find().sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      msg: "Topics fetched successfully",
      count: topics.length,
      data: topics,
    });
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({
      status: "error",
      msg: "Server error while fetching topics",
    });
  }
};

const EditTopic = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name?.trim() || !description?.trim()) {
      return res.status(400).json({
        status: "error",
        msg: "Name and Description are required",
      });
    }

    const updatedTopic = await Topic.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        description: description.trim(),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedTopic) {
      return res.status(404).json({
        status: "error",
        msg: "Topic not found",
      });
    }

    return res.status(200).json({
      status: "success",
      msg: "Topic updated successfully",
      data: updatedTopic,
    });
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({
      status: "error",
      msg: "Server error while updating topic",
    });
  }
};

const DeleteTopic = async (req, res) => {
  try {
    const deletedTopic = await Topic.findByIdAndDelete(req.params.id);

    if (!deletedTopic) {
      return res.status(404).json({
        status: "error",
        msg: "Topic not found",
      });
    }

    return res.status(200).json({
      status: "success",
      msg: "Topic deleted successfully",
      data: deletedTopic,
    });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({
      status: "error",
      msg: "Server error while deleting topic",
    });
  }
};

module.exports = {
  TopicInsert,
  TopicList,
  EditTopic,
  DeleteTopic,
};
