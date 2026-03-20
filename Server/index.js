
require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { UserRoutes } = require("./App/router/web/UserRoute");

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());


app.use("/user", UserRoutes);


console.log("MONGO_URI =", process.env.MONGO_URI);


mongoose
  .connect(process.env.MONGO_URI.trim(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected! "))
  .catch((err) => console.log("Mongo Error :", err));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} `);
});