import mongoose from "mongoose";
import Course from "./Course";

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: {
        values: ["objective", "theory"],
        message: "{VALUE} is not a supported data source",
      },
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: [{ type: String }],
    correct_answer: { type: String, required: true },
    explanation: { type: String },
    course: { type: new Course(), required: true },
    tags: [{ type: String }],
  },
  { timestamps: true },
);

const Question =
  mongoose.models?.Question || mongoose.model("Question", questionSchema);

export default Question;
