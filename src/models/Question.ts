import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: [{ type: String }],
    correct_answer: { type: String, required: true },
    explanation: { type: String },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  },
  { timestamps: true },
);

const Question =
  mongoose.models?.Question || mongoose.model("Question", questionSchema);

export default Question;
