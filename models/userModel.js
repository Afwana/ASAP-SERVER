import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: { type: String, required: true, unique: true },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    password: { type: String, required: true },
    phone: { type: String },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: { type: String },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Non-Binary", ""],
    },
    aadhar: {
      type: String,
      trim: true,
    },
    aadharVerified: {
      type: Boolean,
      default: false,
    },
    address: {
      street: String,
      district: String,
      state: String,
      pincode: String,
    },
    guardian: {
      name: String,
      phone: String,
    },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
