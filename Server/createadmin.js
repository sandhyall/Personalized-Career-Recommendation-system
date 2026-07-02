const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Admin } = require("./App/model/adminmodel");
require("dotenv").config();

const createAdmin = async () => {
  const email = "sandhyadahal@gmail.com";
  const password = "admin123";

  try {
    await mongoose.connect(process.env.DB);
    console.log("MongoDB connected");

    const adminExist = await Admin.findOne({ email });
    if (adminExist) {
      console.log("Admin already exists");
      return mongoose.disconnect();
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await Admin.create({ email, password: hashPassword });
    console.log("Admin created successfully");

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error creating admin:", err.message);
    await mongoose.disconnect();
  }
};

createAdmin();