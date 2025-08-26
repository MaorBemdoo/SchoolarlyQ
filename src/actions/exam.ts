/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import initLogger from "@/config/logger"
import { examService } from "@/services/exam.service"
import connectDB from "@/utils/db"
import ResponseHandler from "@/utils/ResponseHandler"

export async function getExams(filter: Record<string, string> = {}){
    await connectDB()
    const logger = await initLogger()
    filter.limit = "30"
    filter.page = filter.page || "1"

    try {
        let exams = await examService.getExams(filter)
        exams = exams.map(exam => exam.toObject())
        logger.info("Exams retrieved successfully")
        return ResponseHandler("success", "Exams retrieved successfully", {
            data: exams,
            metadata: {
                total: exams.length,
                limit: Number(filter.limit),
                current_page: Number(filter.page) || 1,
                pages: Math.ceil(exams.length / Number(filter.limit))
            }
        })

    } catch (err: any) {
        logger.error(err)
        return ResponseHandler("failed", err.message || "Error retrieving exams")
    }
}

export async function getExamSessions(){
    await connectDB()
    const logger = await initLogger()

    try {
        const sessions = await examService.getExamSessions()
        return ResponseHandler("success", "Exams sessions retrieved successfully", sessions)
    } catch (err: any) {
        logger.error(err)
        return ResponseHandler("failed", err.message || "Error retrieving exams sessions")
    }
}