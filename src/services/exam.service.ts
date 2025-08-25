/* eslint-disable @typescript-eslint/no-explicit-any */
import { examRepository } from "@/repository/exam.repository";

export const examService = {
    async getExams(filter: any) {
        return examRepository.find(filter);
    },

    async findExamById(id: number) {
        return examRepository.findById(id);
    },

    async createExam(exam: any) {
        return examRepository.create(exam);
    }
}