import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, unique: true, required: true },
  // type: {type: }
});

const Course =
  mongoose.models?.Course || mongoose.model("Course", courseSchema);

export default Course;
