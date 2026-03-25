const Contact = require("../../model/contactModel");


exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create new contact record
    const newContact = new Contact({
      name,
      email,
      message,
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Message received successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not save message.",
      error: error.message,
    });
  }
};