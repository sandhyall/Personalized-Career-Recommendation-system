const Title = require("../../model/titlemodel");

const TitleInsert = async (req, res) => {
  try {
    const { name, topicId, description } = req.body;

    if (!name?.trim() || !topicId) {
      return res.status(400).json({
        status: "error",
        msg: "Name and TopicId are required",
      });
    }

    const newTitle = new Title({
      name: name.trim(),
      topicId,
      description: description?.trim() || "",
    });

    const saved = await newTitle.save();

    return res.status(201).json({
      status: "success",
      msg: "Title added successfully",
      data: saved,
    });
  } catch (err) {
    console.error("Insert error:", err);
    return res.status(500).json({
      status: "error",
      msg: "Server error while creating title",
    });
  }
};

const TitleList = async (req, res) => {
  try {
    const titles = await Title.find()
      .populate("topicId", "name description")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      msg: "Titles fetched successfully",
      count: titles.length,
      data: titles,
    });
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({
      status: "error",
      msg: "Server error while fetching titles",
    });
  }
};

const EditTitle = async (req, res) => {
  try {
    const { name, topicId, description } = req.body;

    if (!name?.trim() || !topicId) {
      return res.status(400).json({
        status: "error",
        msg: "Name and TopicId are required",
      });
    }

    const updatedTitle = await Title.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        topicId,
        description: description?.trim() || "",
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedTitle) {
      return res.status(404).json({
        status: "error",
        msg: "Title not found",
      });
    }

    return res.status(200).json({
      status: "success",
      msg: "Title updated successfully",
      data: updatedTitle,
    });
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({
      status: "error",
      msg: "Server error while updating title",
    });
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

    return res.status(200).json({
      status: "success",
      msg: "Title deleted successfully",
      data: deletedTitle,
    });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({
      status: "error",
      msg: "Server error while deleting title",
    });
  }
};

const getSingleTitle = async (req, res) => {
  try {
    const title = await Title.findById(req.params.id).populate(
      "topicId",
      "name description",
    );

    if (!title) {
      return res.status(404).json({
        status: "error",
        msg: "Title not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: title,
    });
  } catch (err) {
    console.error("getSingleTitle error:", err);
    res.status(500).json({
      status: "error",
      msg: "Server error",
    });
  }
};

module.exports = {
  TitleInsert,
  TitleList,
  EditTitle,
  DeleteTitle,
  getSingleTitle,
};
