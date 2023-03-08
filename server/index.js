const express = require("express");
const cors = require("cors");
const result = require("dotenv").config();
const sequelize = require("./sequelize-object");
const corsOptions = require("./cors-options");
const authRouter = require("./routes/auth.route");
const tasksRouter = require("./routes/tasks.route");
const User = require("./models/user.model");

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors(corsOptions));
app.use("/tasks", tasksRouter);
app.use("/", authRouter);

sequelize.sync().then(async () => {
  try {
    await User.create({
      name: "admin",
      password: process.env.ADMIN_PASSWORD,
    });
  } catch (e) {}
  app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}.`);
  });
});
