const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { UserRoutes } = require("./App/router/web/UserRoute");
const { AdminRoute } = require("./App/router/admin/adminRoute");
const TitleRoute = require("./App/router/admin/titlerouter");
const TopicRoute = require("./App/router/admin/topicrouter");
const CoursesRoute = require("./App/router/admin/coursesrouter");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/user", UserRoutes);
app.use("/admin", AdminRoute);
app.use("/title", TitleRoute);
app.use("/topic", TopicRoute);
app.use("/courses", CoursesRoute);

mongoose
  .connect(process.env.DB)
  .then(() => console.log("Database Connected!"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
