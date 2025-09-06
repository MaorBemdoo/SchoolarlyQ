/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateQuizSessionToken } from "@/actions/quizAuth";
import { examRepository } from "@/repository/exam.repository";
import { questionRepository } from "@/repository/question.repository";

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
            questions: questions.length
        };
    },

    async createExam(exam: any) {
        return examRepository.create(exam);
    },

    async getExamSessions() {
        return examRepository.getSessions();
    },

   async startExam(options: { examId: string, type: string, mode: "exam" | "study", questionCount: number, timer: number }){
    const ids = await questionRepository.findIdsByExamId(options.examId, options.mode == "study" ? options.questionCount : undefined);
    await generateQuizSessionToken({
        ...options,
        questionIds: ids
    })
   }
   

}