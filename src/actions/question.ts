"use server";

import initLogger from "@/config/logger";
import { questionService } from "@/services/question.service";
import connectDB from "@/utils/db";
import ResponseHandler from "@/utils/ResponseHandler";
import { questionSchema, validate } from "@/utils/validators";

interface SingleQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
  course: string;
}

interface BulkQuestions {
  questions: SingleQuestion[];
}

export async function createQuestion(
  data: SingleQuestion | BulkQuestions,
  type: "single" | "bulk" = "single",
) {
  await connectDB();
  const logger = await initLogger();

  try {
    if (type === "single") {
      await validate(questionSchema, data as SingleQuestion);
    } else if (type === "bulk") {
      const { questions } = data as BulkQuestions;
      if (!Array.isArray(questions) || questions.length === 0) {
        return ResponseHandler(
          "failed",
          "Questions array is required for bulk creation",
        );
      }
      await Promise.all(questions.map((q) => validate(questionSchema, q)));
    } else {
      return ResponseHandler("failed", "Invalid type parameter");
    }

    await questionService.createQuestion(
      type === "bulk" ? (data as BulkQuestions).questions : data,
    );
    logger.info("Question(s) created successfully");

    return ResponseHandler("success", "Question(s) created successfully");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    logger.error(err, "Error creating question");
    return ResponseHandler("failed", err.message || "Error creating question");
  }
}

// export async function getQuestions(examId: string, questions?: number) {

// }
