/* eslint-disable @typescript-eslint/no-explicit-any */
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
    }

}