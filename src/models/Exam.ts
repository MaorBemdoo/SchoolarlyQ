import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  course_title: { type: String, required: true, trim: true },
  course_code: { type: String, required: true, trim: true },
  credit_units: { type: Number, required: true },
  time_allowed: { type: Number, required: true },
  level: { type: String, required: true, trim: true },
  semester: { type: Number, required: true },
  session: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: {
      values: ["objective", "theory"],
      message: "{VALUE} is not a supported data source",
    },
    required: true,
  },
  tags: [{ type: String }],
}, { timestamps: true });

const Exam =
  mongoose.models?.Exam || mongoose.model("Exam", examSchema);

export default Exam;
