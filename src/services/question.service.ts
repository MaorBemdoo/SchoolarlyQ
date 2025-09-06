/* eslint-disable @typescript-eslint/no-explicit-any */

import { questionRepository } from "@/repository/question.repository";

export const questionService = {
  async createQuestion(data: any) {
    return questionRepository.create(data);
  },
};
