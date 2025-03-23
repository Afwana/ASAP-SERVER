import express from "express";
import {
  getUserData,
  login,
  logout,
  register,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/user", authMiddleware, getUserData);

export default authRouter;
