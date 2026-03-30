const express = require("express");
const nodemailer = require("nodemailer");
const contactModel = require('../model/contactModel');
require("dotenv").config();

const contactRoute = express.Router();

const ContactInsert = async (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).send({ status: 400, msg: "All fields are required" });
  }

  try {
    // Save to DB
    const contact = new contactModel({ name, email, message });
    await contact.save();

    // Setup Nodemailer with Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"${name}" <${process.env.USER}>`,
      to: "sandhyadahal864@gmail.com",
      subject: "New Contact Message",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <b>Name:</b> ${name} <br/>
        <b>Email:</b> ${email} <br/>
        <b>Message:</b> ${message}
      `,
    });

    console.log("Message sent:", info.messageId);

    res.status(200).send({
      status: 200,
      msg: "Message sent successfully",
    });
  } catch (error) {
    console.error("ContactInsert error:", error);
    res.status(500).send({
      status: 500,
      msg: "Something went wrong",
    });
  }
};

contactRoute.post("/", ContactInsert);

module.exports = { contactRoute };
