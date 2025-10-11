/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateQuizSessionToken } from "@/actions/quizAuth";
import { examRepository } from "@/repository/exam.repository";
import { questionRepository } from "@/repository/question.repository";
import { translateExamFile } from "@/utils/chat";
import { v2 as cloudinary } from "cloudinary";

export const examService = {
  async getExams(filter: any) {
    return examRepository.find(filter);
  },

  async findExamById(id: string) {
    const exam = await examRepository.findById(id);
    if (!exam) {
      throw new Error("Exam not found");
    }
    const questions = await questionRepository.findByExamId(id);
    return {
      ...exam.toObject(),
      questions: questions.length,
    };
  },

  async createExam(exam: any) {
    return examRepository.create(exam);
  },

  async getExamSessions() {
    return examRepository.getSessions();
  },

  async startExam(options: {
    examId: string;
    type: string;
    mode: "exam" | "study";
    questionCount: number;
    timer: number;
  }) {
    const ids = await questionRepository.findIdsByExamId(
      options.examId,
      options.mode == "study" ? options.questionCount : undefined,
    );
    await generateQuizSessionToken({
      ...options,
      questionIds: ids,
    });
  },

  async uploadExamFile(file: File) {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        folder: "schoolarlyq/past-questions",
      };
    
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        const res: any = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(options, function (error, result) {
              if (error) {
                reject(error);
                throw error;
              }
              resolve(result);
            })
            .end(buffer);
        });

        const translateRes = await translateExamFile(res.secure_url as string);
        JSON.parse(translateRes).exam.imageUrl = res.secure_url;
        return translateRes;
      } catch (error) {
        throw error;
      }
  }
};
