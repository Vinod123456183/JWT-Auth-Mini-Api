const express = require("express");
const app = express();
require("dotenv").config();

const connectToDB = require("./config/mongoose-connection");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());
connectToDB();

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000);
