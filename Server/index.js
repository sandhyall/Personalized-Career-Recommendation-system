const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { UserRoutes } = require("./App/router/web/UserRoute");
const { AdminRoute } = require("./App/router/admin/adminRoute");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.use("/user",UserRoutes)
app.use("/admin",AdminRoute)

console.log("DB =", process.env.DB);

mongoose
.connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected!"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
