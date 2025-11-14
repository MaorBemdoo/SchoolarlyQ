/* eslint-disable @typescript-eslint/no-explicit-any */

import { scoreRepository } from "@/repository/score.repository";

export const scoreService = {
  async createScore(data: any) {
    return scoreRepository.create(data);
  },
  async getScoreById(id: string) {
    return scoreRepository.findById(id);
  },
  async updateScore(id: string, data: any) {
    return scoreRepository.update(id, data);
  }
};