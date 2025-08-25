/* eslint-disable @typescript-eslint/no-explicit-any */
import Question from "@/models/Question";
import { examRepository } from "./exam.repository";

export const questionRepository = {
    async create(data: any){
        data = Array.isArray(data) ? data : [data];
        for (const item of data) {
            const exam = await examRepository.findById(item.course);
            if (!exam) throw new Error("Course not found");
        }
        return Question.create(data);
    },
    async findByExamId(examId: number) {
        const exam = await examRepository.findById(examId);
        if (!exam) throw new Error("Exam not found");
        return Question.find({ course: exam._id }).populate("course");
    },
}