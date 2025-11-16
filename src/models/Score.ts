import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    score: { type: Number, default: 0 },
    mode: { type: String, enum: ["study", "exam"], required: true },
    time: { type: String, required: true },
    time_used: { type: Number },
    questions: { type: Array },
    answers: { type: Array },
    takenAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Score = mongoose.models?.Score || mongoose.model("Score", scoreSchema);

export default Score;
