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
    const { name, email, phone, gender, dob, aadhar, address, guardian } =
      req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    let updatedData = {
      name,
      email,
      phone,
      gender,
      dob,
      aadhar,
      address,
      guardian,
      lastUpdated: Date.now(),
    };

    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "ASAP",
      });

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
  console.log(res);

  try {
    const user = await userModel.findById(req.user._id).select("-password");
    console.log(user);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    return res.status(200).json({
      success: true,
      user,
      lastUpdated: user.lastUpdated,
      formattedLastUpdated: new Date(user.lastUpdated).toLocaleString(),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
