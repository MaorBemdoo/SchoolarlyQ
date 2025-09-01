"use client"

import Button from "@/components/Button";
import React, { useState } from "react";
import ExamCard from "../components/ExamCard";
import { FaRegCircleQuestion } from "react-icons/fa6";
import Link from "next/link";

const QuizHomePage = () => {
  const relatedExams = [
    {
      course_title: "Introduction",
      course_code: "CSC211",
      _id: "WERF",
      level: "IJMB",
      department: "Computer Science",
      semester: 1,
      session: "203/de",
    },
    {
      course_title: "Introduction",
      course_code: "CSC211",
      _id: "WERF",
      level: "IJMB",
      department: "Computer Science",
      semester: 1,
      session: "203/de",
    },
    {
      course_title: "Introduction",
      course_code: "CSC211",
      _id: "WERF",
      level: "IJMB",
      department: "Computer Science",
      semester: 1,
      session: "203/de",
    },
    {
      course_title: "Introduction",
      course_code: "CSC211",
      _id: "WERF",
      level: "IJMB",
      department: "Computer Science",
      semester: 1,
      session: "203/de",
    },
    {
      course_title: "Introduction",
      course_code: "CSC211",
      _id: "WERF",
      level: "IJMB",
      department: "Computer Science",
      semester: 1,
      session: "203/de",
    },
  ];

  const [mode, setMode] = useState("study");
  const [questionCount, setQuestionCount] = useState(10);
  const [timer, setTimer] = useState("2");

  return (
    <main className="mt-8">
      <section className="bg-primary-light-100 md:bg-[url(/banner.png)] md:bg-cover md:text-white h-[300px] dark:bg-primary-dark-100">
        <div className="container py-8">
          <div className="md:max-w-[50%]">
            <p className="text-xs font-mono">E X A M</p>
            <p className="text-4xl font-semibold">
              CSC 211: Introduction to Programming II
            </p>
          </div>
        </div>
      </section>
      <section className="container max-w-[900px] space-y-8 mt-8">
        <div className="grid gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 *:text-center">
          <div>
            <p className="text-xl font-semibold">Session</p>
            <p>2012/2013</p>
          </div>
          <div>
            <p className="text-xl font-semibold">Semester</p>
            <p>First Semester</p>
          </div>
          <div>
            <p className="text-xl font-semibold">Department</p>
            <p>Computer Science</p>
          </div>
          <div>
            <p className="text-xl font-semibold">Level</p>
            <p>200 Level</p>
          </div>
          <div>
            <p className="text-xl font-semibold">Credit Unit(s)</p>
            <p>2</p>
          </div>
          <div>
            <p className="text-xl font-semibold">Type</p>
            <p>Objective</p>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-secondary-dark-100 p-6 rounded-lg shadow-sm grid gap-4 grid-cols-1 sm:grid-cols-3">
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
                <select value={mode} onChange={(e) => setMode(e.target.value)} id="mode" className="form-input">
                    <option value="study">Study mode</option>
                    <option value="exam">Exam mode</option>
                </select>
            </div>
            <div className="space-y-2">
                <label htmlFor="question-count" className="font-semibold">No. of Questions</label>
                <select value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} id="question-count" className="form-input" disabled={mode == "exam"}>
                    {
                        Array.from({ length: 60 }, (_, i) => (i + 1)).filter(val => val % 10 === 0).map(val => (
                            <option key={val} value={val}>{val}</option>
                        ))
                    }
                </select>
            </div>
            <div className="space-y-2">
                <label htmlFor="timer" className="font-semibold">Timer</label>
                <select value={timer} onChange={(e) => setTimer(e.target.value)} id="timer" className="form-input" disabled={mode == "exam"}>
                    <option value="none">No Timer</option>
                    <option value="1">1 Minute</option>
                    <option value="2">2 Minutes</option>
                    <option value="5">5 Minutes</option>
                </select>
            </div>
        </div>
        <div className="bg-primary-light-100 dark:bg-primary-dark-100 rounded-lg shadow-md p-6 w-full">
          <h2 className="text-xl font-semibold mb-4">Topics Covered</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-200">
            <li>Object-Oriented Programming Concepts</li>
            <li>Inheritance and Polymorphism</li>
            <li>Exception Handling</li>
            <li>File I/O Operations</li>
            <li>Data Structures (Arrays, Lists)</li>
            <li>Recursion</li>
          </ul>
        </div>
        <div className="text-center">
          <Button>Start Quiz</Button>
        </div>
      </section>
      <section className="container max-w-[800px] my-8">
        <h2 className="text-xl font-semibold mb-4">Related Exams</h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
          {relatedExams.map(
            ({
              course_title,
              course_code,
              _id,
              level,
              department,
              semester,
              session,
            }) => (
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
            ),
          )}
        </div>
      </section>
    </main>
  );
};

export default QuizHomePage;
