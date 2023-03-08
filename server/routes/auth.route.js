const express = require("express");
const authRouter = express.Router();
const requireAuth = require("../middleware/auth.middleware");

const authController = require("../controllers/auth.controller");

authRouter.get("/auth", requireAuth, authController.auth);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);

module.exports = authRouter;
