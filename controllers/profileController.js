import userModel from "../models/userModel.js";
import cloudinary from "cloudinary";
import fs from "fs"; // To delete local file after upload

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, userName, email, phone } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    let updatedData = { name, userName, email, phone, lastUpdated: Date.now() };

    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "ASAP",
      });

      console.log("Uploaded Image:", uploadedImage.secure_url);
      // Delete old profile picture if it exists and is different
      if (
        user.profilePicture &&
        user.profilePicture.includes("cloudinary.com")
      ) {
        const oldImagePublicId = user.profilePicture
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];
        await cloudinary.uploader.destroy(oldImagePublicId);
      }

      // Update new profile picture URL
      updatedData.profilePicture = uploadedImage.secure_url;

      // Delete local file after uploading to Cloudinary
      fs.unlinkSync(req.file.path);
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, updatedData, {
        new: true,
      })
      .select("-password"); // Exclude password from response

    console.log("Updated Data:", updatedUser);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    return res.status(200).json({
      success: true,
      user,
      lastUpdated: user.lastUpdated,
      formattedLastUpdated: new Date(user.lastUpdated).toLocaleString(), // ✅ Format date
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
