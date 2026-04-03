const express = require("express");
const { LoginPost } = require("../../controller/admin/adminController");

const AdminRoute = express.Router();

AdminRoute.post("/login", LoginPost);

module.exports = { AdminRoute };
                                            7