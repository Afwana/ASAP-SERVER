import express from "express";
import multer from "multer";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const storage = multer.diskStorage({});
const upload = multer({ storage });

const profileRouter = express.Router();

profileRouter.put(
  "/update",
  authMiddleware,
  upload.single("profilePicture"),
  updateProfile
);
profileRouter.get("/get", authMiddleware, getProfile);

export default profileRouter;
