const express = require("express");
const { RegisterPost, Loginpost } = require("../../controller/web/UserController");

const UserRoutes = express.Router();

UserRoutes.post("/register", RegisterPost);
UserRoutes.post("/login", Loginpost);

module.exports = { UserRoutes };