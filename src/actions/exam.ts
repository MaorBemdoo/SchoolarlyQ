/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import initLogger from "@/config/logger";
import { examService } from "@/services/exam.service";
import connectDB from "@/utils/db";
import ResponseHandler from "@/utils/ResponseHandler";
import { examSchema, questionSchema, validate } from "@/utils/validators";
import { createQuestion } from "./question";
import { cookies } from "next/headers";
import { scoreService } from "@/services/score.service";

export async function getExams(filter: Record<string, string> = {}) {
  await connectDB();
  const logger = await initLogger();
  filter.limit = "30";
  filter.page = filter.page || "1";

  try {
    let exams = await examService.getExams(filter);
    exams = exams.map((exam) => exam.toObject());
    return ResponseHandler("success", "Exams retrieved successfully", {
      data: exams,
      metadata: {
        total: exams.length,
        limit: Number(filter.limit),
        current_page: Number(filter.page) || 1,
        pages: Math.ceil(exams.length / Number(filter.limit)),
      },
    });
  } catch (err: any) {
    logger.error(err);
    return ResponseHandler("failed", err.message || "Error retrieving exams");
  }
}

export async function getExamSessions() {
  await connectDB();
  const logger = await initLogger();

  try {
    const sessions = await examService.getExamSessions();
    return ResponseHandler(
      "success",
      "Exams sessions retrieved successfully",
      sessions,
    );
  } catch (err: any) {
    logger.error(err);
    return ResponseHandler(
      "failed",
      err.message || "Error retrieving exams sessions",
    );
  }
}

export async function createExamAndQuestions(exam: any, questions: any[]) {
  await connectDB();
  const logger = await initLogger();

  questions = questions.map((q) => ({
    ...q,
    options:
      exam.type == "theory"
        ? undefined
        : q.options?.filter((val: string) => val?.trim() !== "" && val != null),
    course: "fallback",
  }));
  try {
    await validate(examSchema, exam);
    const [a, b] = exam.session.split("/");
    if (Number(a) + 1 !== Number(b)) {
      throw new Error("Invalid session format");
    }
    await Promise.all(questions.map((q) => validate(questionSchema, q)));
    const res = exam.id ? { _id: exam.id } : await examService.createExam(exam);
    const questionRes = await createQuestion(
      {
        questions: questions.map((q) => ({
          ...q,
          course: res._id,
        })),
      },
      "bulk",
    );
    if (questionRes?.status == "success") {
      logger.info(
        {
          examId: res._id,
          questionsIds: questionRes.data,
          questionCount: questions.length,
        },
        exam._id
          ? "Exam and questions updated successfully"
          : "Questions added successfully",
      );
      return ResponseHandler(
        "success",
        "Exam and questions created successfully",
      );
    } else {
      throw new Error(questionRes?.message || "Error creating questions");
    }
  } catch (error: any) {
    logger.error(error, "Error creating exam and questions");
    return ResponseHandler(
      "failed",
      error.message || "Error creating exam and questions",
    );
  }
}

export async function getExam(id: string) {
  await connectDB();
  const logger = await initLogger();

  try {
    const exam = await examService.findExamById(id);
    return ResponseHandler("success", "Exam retrieved successfully", exam);
  } catch (error: any) {
    logger.error(error);
    return ResponseHandler("failed", error.message || "Error retrieving exam");
  }
}

export async function getExamScore(scoreId: string) {
  await connectDB();
  const logger = await initLogger();

  try {
    const score = await scoreService.getScoreById(scoreId);
    return ResponseHandler("success", "Score retrieved successfully", score);
  } catch (error) {
    logger.error(error);
    return ResponseHandler("failed", "Error retrieving score");
  }
}

export async function startExam(options: {
  examId: string;
  type: string;
  mode: "exam" | "study";
  questionCount: number;
  timer: number;
}) {
  await connectDB();
  const logger = await initLogger();
  try {
    await examService.startExam(options);
    return ResponseHandler("success", "Exam started successfully");
  } catch (error: any) {
    logger.error(error);
    return ResponseHandler("failed", error.message || "Failed to start exam");
  }
}

export async function endExam(scoreId: string, completed: boolean) {
  if (!completed) {
    await scoreService.deleteScore(scoreId);
  }
  (await cookies()).delete("exam-token");
}

export async function uploadExamFile(file: File) {
  await connectDB();
  const logger = await initLogger();

  if (!file) {
    return ResponseHandler("failed", "No file provided");
  }

  try {
    const res = await examService.uploadExamFile(file);
    return ResponseHandler("success", "Exam file processed successfully", res);
  } catch (error: any) {
    logger.error(error, "Error uploading and processing exam file");
    return ResponseHandler(
      "failed",
      error.message || "Error uploading and processing exam file",
    );
  }
}
