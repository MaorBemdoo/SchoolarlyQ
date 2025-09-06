/* eslint-disable @typescript-eslint/no-explicit-any */

import { questionRepository } from "@/repository/question.repository";

export const questionService = {
    async createQuestion(data: any){
        return questionRepository.create(data);
    },
    async getQuestionsIdsByExamId(examId: string, limit?: number) {
        return questionRepository.findIdsByExamId(examId, limit);
    },
    async getQuestionById(id: string){
        return questionRepository.findById(id)
    }
}