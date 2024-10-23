import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    full_name: { type: String, required: true },
    profile_pic_url: { type: String, default: "" },
    password: { type: String },
    role: {
      type: String,
      enum: {
        values: ["student", "admin"],
        message: "{VALUE} is not a supported data source",
      },
      default: "student",
    },
    type: {
      type: String,
      enum: {
        values: ["free", "premium"],
        message: "{VALUE} is not a supported data source",
      },
      default: "free",
    },
    matric_number: { type: String, unique: true, required: true },
    // department: {type: String, required: true},
    // level: {type: String, required: true}
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
