/* eslint-disable @typescript-eslint/no-explicit-any */
import { userRepository } from "@/repository/user.repository";

export const userService = {
  async getUserByUsername(username: string) {
    return userRepository.findByUsername(username);
  },
  async getUserByMatricNumber(matricNumber: string) {
    return userRepository.findByMatricNumber(matricNumber);
  },
  async getUserByEmail(email: string) {
    return userRepository.findByEmail(email);
  },
  async createUser(data: any) {
    const existingUser = await userService.getUserByUsername(data.username);
    if (existingUser) {
      throw new Error("User with email already exist");
    }
    return userRepository.create(data);
  },
  async updateUser(username: string, data: any) {
    const user = await userService.getUserByUsername(username);
    if (!user) {
      throw new Error("User does not exist");
    }
    return userRepository.update(username, data);
  },
};
