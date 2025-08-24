import Exam from "@/models/Exam";
import Question from "@/models/Question";
import connectDB from "@/utils/db"

export const questionRepository = {
    async create(data: Partial<typeof Question>){
        await connectDB()
        return Question.create(data);
    },
    async findByExamId(examId: string) {
        const exam = await Exam.findById(examId);
        if (!exam) throw new Error("Exam not found");
        return Question.find({ course: exam._id }).populate("course");
    },
}