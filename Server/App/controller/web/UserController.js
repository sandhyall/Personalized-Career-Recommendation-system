const { User } = require("../../model/Usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const RegisterPost = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).send({ message: "Email is already used" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashPassword,
    });

    await user.save();

    res.status(200).send({ message: "Form submitted successfully" });
  } catch (err) {
    res.status(500).send({
      message: "Server error",
      error: err.message,
    });
  }
};

const Loginpost = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).send({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).send({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).send({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { RegisterPost, Loginpost };
