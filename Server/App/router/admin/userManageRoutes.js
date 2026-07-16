const express = require("express");
const {
  listUsers,
  deleteUser,
} = require("../../controller/admin/userManageController");

const UserManageRoute = express.Router();

UserManageRoute.get("/list", listUsers);
UserManageRoute.delete("/delete/:id", deleteUser);

module.exports = UserManageRoute;
