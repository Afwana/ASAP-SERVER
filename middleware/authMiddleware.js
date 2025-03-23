import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password"); // ✅ Exclude password

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    req.user = user.toObject();
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid Token!" });
  }
};

export default authMiddleware;
