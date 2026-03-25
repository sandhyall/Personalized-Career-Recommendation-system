const Title = require("../../model/titlemodel");

const TitleInsert = async (req, res) => {
  try {
    const { name, topicId } = req.body;

    if (!name || !topicId) {
      return res.status(400).json({
        status: "error",
        msg: "Name and TopicId are required",
      });
    }

    const newTitle = new Title({ name, topicId });
    const saved = await newTitle.save();

    res.status(201).json({
      status: "success",
      data: saved,
    });
  } catch (err) {
    res.status(500).json({ status: "error", msg: err.message });
  }
};

const TitleList = async (req, res) => {
  try {
    const titles = await Title.find()
      .populate("topicId", "name")
      .sort({ createdAt: -1 });

    res.json({ status: "success", data: titles });
  } catch (err) {
    res.status(500).json({ status: "error", msg: err.message });
  }
};

const EditTitle = async (req, res) => {
  try {
    const { name, topicId } = req.body;

    if (!name || !topicId) {
      return res.status(400).json({
        status: "error",
        msg: "Name and TopicId are required",
      });
    }

    const updatedTitle = await Title.findByIdAndUpdate(
      req.params.id,
      { name, topicId },
      { new: true },
    );

    if (!updatedTitle) {
      return res.status(404).json({
        status: "error",
        msg: "Title not found",
      });
    }

    res.status(200).json({
      status: "success",
      msg: "Title updated successfully",
      data: updatedTitle,
    });
  } catch (err) {
    res.status(500).json({ status: "error", msg: err.message });
  }
};

const DeleteTitle = async (req, res) => {
  try {
    const deletedTitle = await Title.findByIdAndDelete(req.params.id);

    if (!deletedTitle) {
      return res.status(404).json({
        status: "error",
        msg: "Title not found",
      });
    }

    res.status(200).json({
      status: "success",
      msg: "Title deleted successfully",
      data: deletedTitle,
    });
  } catch (err) {
    res.status(500).json({ status: "error", msg: err.message });
  }
};

module.exports = { TitleInsert, TitleList, EditTitle, DeleteTitle };
