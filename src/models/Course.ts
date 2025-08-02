import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    code: { type: String, unique: true, required: true }
  },
);

const Course = mongoose.models?.Course || mongoose.model("Course", courseSchema);

export default Course;
