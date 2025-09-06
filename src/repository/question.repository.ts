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
    async findByExamId(examId: string) {
        const exam = await examRepository.findById(examId);
        if (!exam) throw new Error("Exam not found");
        return Question.find({ course: exam._id }).populate("course");
    },
    async findIdsByExamId(examId: string, limit?: number) {
        const exam = await examRepository.findById(examId);
        if (!exam) throw new Error("Exam not found");
        if(!limit) return Question.find({ course: exam._id }).select({ _id: 1 });
        const pipeline = [
            { $match: { course: exam._id } },
            { $sample: { size: limit } },
            { $project: { _id: 1 } }
        ];
        return Question.aggregate(pipeline);
    },
    async findById(id: string){
        const question = await Question.findById(id)
        if(!question) throw new Error("Question not found")
        return question
    }
}