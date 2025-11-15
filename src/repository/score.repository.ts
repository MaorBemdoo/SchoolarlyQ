/* eslint-disable @typescript-eslint/no-explicit-any */
import Score from "@/models/Score";

export const scoreRepository = {
  async findById(id: string) {
    return Score.findById(id);
  },

  async create(data: any) {
    return Score.create(data);
  },

  async update(id: string, data: any) {
    return Score.findByIdAndUpdate(id, data);
  },

  async delete(id: string) {
    return Score.findByIdAndDelete(id);
  },
};
