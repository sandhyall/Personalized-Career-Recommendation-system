require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const { UserRoutes } = require("./App/router/web/UserRoute");
const { AdminRoute } = require("./App/router/admin/adminRoute");
const TitleRoute = require("./App/router/admin/titlerouter");
const TopicRoute = require("./App/router/admin/topicrouter");
const CoursesRoute = require("./App/router/admin/coursesrouter");
const profileRoutes = require("./App/router/admin/profileRoutes");
const recommendRoutes = require("./App/router/admin/recommendRoutes");
const progressRoutes = require("./App/router/admin/progressRoutes");
const projectRoutes = require("./App/router/admin/projectRoutes");
const userManageRoutes = require("./App/router/admin/userManageRoutes");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/user", UserRoutes);
app.use("/admin", AdminRoute);
app.use("/title", TitleRoute);
app.use("/topic", TopicRoute);
app.use("/courses", CoursesRoute);
app.use("/api/profile", profileRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/admin/users", userManageRoutes);
app.use("/api", recommendRoutes);

mongoose
  .connect(process.env.DB)
  .then(() => console.log("Database Connected!"))
  .catch((err) => console.log("Mongo Error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
