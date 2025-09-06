/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Button from "@/components/Button";
import React, { useEffect, useRef, useState } from "react";
import ExamCard from "../components/ExamCard";
import { FaRegCircleQuestion } from "react-icons/fa6";
import Link from "next/link";
import useAction from "@/hooks/useAction";
import { useParams, useRouter } from "next/navigation";
import { getExam, getExams, startExam } from "@/actions/exam";
import toast from "@/utils/toast";
import { useLocalStorage } from "react-use";

const QuizHomePage = () => {
  const { id } = useParams()
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_storedQuiz, setStoredQuiz] = useLocalStorage("quiz");
  const { execute: fetchExam, res: examRes } = useAction(getExam)
  const { execute: fetchExams, res: examsRes } = useAction(getExams)
  const { execute: startQuiz, status: startQuizStatus } = useAction(startExam)
  const exam = examRes?.data
  const relatedExams = examsRes?.data

  const [mode, setMode] = useState<"exam" | "study">("study");
  const [questionCount, setQuestionCount] = useState(10);
  const [timer, setTimer] = useState("3");

  const didMountRef = useRef(false);
  const lastParamsRef = useRef<string>(null);

    useEffect(() => {
        const currentParams = JSON.stringify({
            id,
            level: exam?.level,
            department: exam?.department,
            semester: exam?.semester,
            session: exam?.session,
        });

        if (!didMountRef.current) {
            didMountRef.current = true;
            lastParamsRef.current = currentParams;
            fetchExam(id);
            return;
        }

        if (lastParamsRef.current === currentParams) return;

        lastParamsRef.current = currentParams;

        fetchExams({
            limit: 4,
            levels: [exam?.level],
            departments: [exam?.department],
            semesters: [exam?.semester],
            sessions: [exam?.session],
            sort: "desc",
        });
    }, [id, exam?.level, exam?.department, exam?.semester, exam?.session, fetchExams, fetchExam]);

    const handleStartQuiz = async () => {
      const res = await startQuiz({
        mode,
        type: exam.type,
        questionCount: mode == "study" ? ( exam.questions <= 10 ? exam.questions : questionCount ) : exam.questions,
        timer: mode == "study" ? timer : exam.time_allowed,
        examId: id
      });
      if(res.status == "failed"){
        toast.error(res.message)
        return
      }
      setStoredQuiz({
        timeLeft: null,
        currentQuestion: 1,
        selectedAnswer: null
      })
      router.push(`/exams/${id}/quiz`);
    }

    if(!exam) return null;

  return (
    <main className="mt-8">
      <section className="bg-primary-light-100 md:bg-[url(/banner.png)] md:bg-cover md:text-white h-[300px] dark:bg-primary-dark-100">
        <div className="container py-8">
          <div className="md:max-w-[50%]">
            <p className="text-xs font-mono">E X A M</p>
            <p className="text-4xl font-semibold">
              {exam?.course_code}: {exam?.course_title}
            </p>
          </div>
        </div>
      </section>
      <section className="container max-w-[900px] space-y-8 mt-8">
        <div className="grid gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 *:text-center">
          <div>
            <p className="text-xl font-semibold">Session</p>
            <p>{exam?.session}</p>
          </div>
          <div>
            <p className="text-xl font-semibold">Semester</p>
            <p>{exam?.semester == 1 ? "First" : "Second"} Semester</p>
          </div>
          <div>
            <p className="text-xl font-semibold">Department</p>
            <p>{exam?.department}</p>
          </div>
          <div>
            <p className="text-xl font-semibold">Level</p>
            <p>{exam?.level} {exam?.level !== "IJMB" && "Level"}</p>
          </div>
          <div>
            <p className="text-xl font-semibold">Credit Unit(s)</p>
            <p>{exam?.credit_units}</p>
          </div>
          <div>
            <p className="text-xl font-semibold">Type</p>
            <p className="capitalize">{exam?.type}</p>
          </div>
        </div>
        <div className={`bg-gray-50 dark:bg-secondary-dark-100 p-6 rounded-lg shadow-sm grid gap-4 grid-cols-1 ${exam?.questions >= 10 && exam?.type == "objective" ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            <div className="space-y-2">
                <div className="flex items-center gap-1 space-x-1">
                    <label htmlFor="mode" className="font-semibold">
                        <p>Mode</p>
                    </label>
                    <div className="dropdown dropdown-hover dropdown-right">
                        <FaRegCircleQuestion tabIndex={0} />
                        <div tabIndex={0} className="dropdown-content ml-2 bg-white border p-4 rounded-md">
                            <p className="text-sm"><Link className="text-primary-light-300 dark:text-primary-dark-300 hover:underline" href="/#mode">Learn more</Link> about exam modes in schoolarlyq.</p>
                        </div>
                    </div>
                </div>
                <select value={mode} onChange={(e) => setMode(e.target.value as "exam" | "study")} id="mode" className="form-input">
                    <option value="study">Study mode</option>
                    <option value="exam">Exam mode</option>
                </select>
            </div>
            {
                exam?.questions >= 10 && exam?.type == "objective" && (
                    <div className="space-y-2">
                        <label htmlFor="question-count" className="font-semibold">No. of Questions</label>
                        <select value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} id="question-count" className="form-input" disabled={mode == "exam"}>
                            {
                                Array.from({ length: exam?.questions }, (_, i) => (i + 1)).filter(val => val % 10 === 0).map(val => (
                                    <option key={val} value={val}>{val}</option>
                                ))
                            }
                        </select>
                    </div>
                )
            }
            <div className="space-y-2">
                <label htmlFor="timer" className="font-semibold">Timer</label>
                <select value={timer} onChange={(e) => setTimer(e.target.value)} id="timer" className="form-input" disabled={mode == "exam"}>
                    <option value="none">No Timer</option>
                    <option value="1">1 Minute</option>
                    <option value="3">3 Minutes</option>
                    <option value="5">5 Minutes</option>
                </select>
            </div>
        </div>
        {
            exam?.tags && exam.tags.length > 0 && (
                <div className="bg-primary-light-100 dark:bg-primary-dark-100 rounded-lg shadow-md p-6 w-full">
                    <h2 className="text-xl font-semibold mb-4">Topics Covered</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-200">
                        {
                            exam.tags.map((tag: string, index: number) => (
                                <li key={index} className="capitalize">{tag}</li>
                            ))
                        }
                    </ul>
                </div>
            )
        }
        <div className="text-center">
          <Button onClick={handleStartQuiz} loading={startQuizStatus === "loading"} className="w-[120px] whitespace-nowrap">Start Quiz</Button>
        </div>
      </section>
      {
        relatedExams && relatedExams.length > 0 && (
            <section className="container max-w-[800px] my-8">
                <h2 className="text-xl font-semibold mb-4">Related Exams</h2>
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
                {
                    relatedExams.map(
                        ({
                        course_title,
                        course_code,
                        _id,
                        level,
                        department,
                        semester,
                        session,
                        }: any) => (
                            <ExamCard
                                title={course_title}
                                code={course_code}
                                level={level}
                                department={department}
                                semester={semester}
                                session={session}
                                id={_id}
                                key={_id}
                            />
                        )
                    )
                }
                </div>
            </section>
        )
      }
    </main>
  );
};

export default QuizHomePage;
