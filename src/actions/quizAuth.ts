"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import ResponseHandler from "@/utils/ResponseHandler";
import { scoreService } from "@/services/score.service";
import { auth } from "@/utils/auth";

const QUIZ_SECRET = process.env.QUIZ_SECRET!;

export async function generateQuizSessionToken({
  examId,
  mode,
  questionCount,
  timer,
  questionIds,
  type,
}: {
  examId: string;
  mode: "exam" | "study";
  type: string;
  questionCount?: number;
  timer: number;
  questionIds: string[];
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (await auth()) as any;
  const newScore = await scoreService.createScore({
    userId: session?.user?._id,
    courseId: examId,
    score: 0,
    mode,
    time: timer,
    questions: questionIds,
  });
  const token = jwt.sign(
    {
      examId,
      mode,
      type,
      questionCount,
      timer,
      questionIds,
      scoreId: newScore._id,
    },
    QUIZ_SECRET,
    { expiresIn: "24h" },
  );
  (await cookies()).set("exam-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function verifyQuizSessionToken(examId: string, token?: string) {
  try {
    if (!token) {
      token = (await cookies()).get("exam-token")?.value || "";
    }
    const decoded = jwt.verify(token, QUIZ_SECRET) as jwt.JwtPayload;
    if (decoded.examId !== examId) {
      throw new Error("TokenInvalidError");
    }
    return ResponseHandler("success", "Token verification successful", decoded);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return ResponseHandler(
      "failed",
      err.message || "Token verification failed",
    );
  }
}
