/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import initLogger from "@/config/logger";
import { questionService } from "@/services/question.service";
import { scoreService } from "@/services/score.service";
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

    const createdQuestions = await questionService.createQuestion(
      type === "bulk" ? (data as BulkQuestions).questions : data,
    );
    logger.info("Question(s) created successfully");

    return ResponseHandler(
      "success",
      "Question(s) created successfully",
      type === "bulk"
        ? createdQuestions.map((q: any) => q._id)
        : createdQuestions._id,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    logger.error(err, "Error creating question");
    return ResponseHandler("failed", err.message || "Error creating question");
  }
}

export async function getQuestion(id: string) {
  await connectDB();
  const logger = await initLogger();

  try {
    let question = await questionService.getQuestionById(id);
    question = question.toObject();
    return ResponseHandler(
      "success",
      "Question retrieved successfully",
      question,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    logger.error(err, "Error retirving question");
    return ResponseHandler("failed", "Failed to retrieve question");
  }
}

export async function verifyAnswer(id: string, scoreId: string, ans: string) {
  await connectDB();
  const logger = await initLogger();

  try {
    const res = await questionService.verifyAnswer(id, ans);
    const score = await scoreService.getScoreById(scoreId)
    if(!score.answers.find((a: any) => a.questionId._id === (id as any)._id)) {
      await scoreService.updateScore(scoreId, {
        score: res.is_correct ? score.score + 1 : score.score,
        answers: [...(score.answers || []), { questionId: id, answer: ans, is_correct: res.is_correct }],
        // time_used: 
      })
    }
    return ResponseHandler("success", "Answer verified successfully", {
      is_correct: res.is_correct,
      correct_answer: res.correct_answer,
      ans: !res.is_correct ? ans : undefined,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    logger.error(err, "Failed to verify answer");
    return ResponseHandler("failed", "Failed to verify answer");
  }
}
