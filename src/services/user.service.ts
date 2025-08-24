/* eslint-disable @typescript-eslint/no-explicit-any */
import { userRepository } from "@/repository/user.repository"
import { AxiosError, HttpStatusCode } from "axios"

export const userService = {
    async getUserByUsername(username: string){
        return userRepository.findByUsername(username)
    },
    async getUserByMatricNumber(matricNumber: string){
        return userRepository.findByMatricNumber(matricNumber)
    },
    async getUserByEmail(email: string){
        return userRepository.findByEmail(email)
    },
    async createUser(data: any){
        const existingUser = await userService.getUserByUsername(data.username);
        if (existingUser) {
            throw new AxiosError("User with email already exist", HttpStatusCode.Conflict.toString());
        }
        return userRepository.create(data)
    },
    async updateUser(username: string, data: any){
        const user = await userService.getUserByUsername(username);
        if (!user) {
            throw new AxiosError("User does not exist", HttpStatusCode.NotFound.toString())
        }
        return userRepository.update(username, data)
    }
}