/* eslint-disable @typescript-eslint/no-explicit-any */

import { questionRepository } from "@/repository/question.repository";
import { askGPT } from "@/utils/chat";

export const questionService = {
  async createQuestion(data: any) {
    return questionRepository.create(data);
  },
  async getQuestionsIdsByExamId(examId: string, limit?: number) {
    return questionRepository.findIdsByExamId(examId, limit);
  },
  async getQuestionById(id: string) {
    const question = await questionRepository.findById(id);
    if (question.options.length > 0) {
      question.correct_answer = undefined;
    }
    // question.options.sort(() => Math.random() - 0.5);
    return question;
  },
  async verifyAnswer(id: string, mode: string, ans: string) {
    const question = await questionRepository.findById(id);
    if (question.type == "objective") {
      return {
        is_correct: question.correct_answer === ans,
        correct_answer: question.correct_answer,
      };
    } else {
      const res = await askGPT(`Given the question: ${question.question}, the user's answer: ${ans} and the correct answer: ${question.correct_answer}, determine if the user's answer is correct(just do an approx scoring). If it is correct, respond with {"is_correct": true}. If it is incorrect respond with {"is_correct": false}. Provide your response in valid json format only.`);
      const parsed = JSON.parse(res);
      return {
        is_correct: parsed.is_correct,
        correct_answer: question.correct_answer,
      };
    }
  }
};
