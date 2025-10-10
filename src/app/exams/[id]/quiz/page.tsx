/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Button from "@/components/Button";
import toast from "@/utils/toast";
import React, { useEffect, useState } from "react";
import { LuClock9, LuLogOut } from "react-icons/lu";
import { useLocalStorage } from "react-use";
import { motion } from "framer-motion";
import { endExam } from "@/actions/exam";
import useAction from "@/hooks/useAction";
import { verifyQuizSessionToken } from "@/actions/quizAuth";
import { useParams, useRouter } from "next/navigation";
import { getQuestion, verifyAnswer } from "@/actions/question";
import Confetti from "react-confetti";
import Completed from "./components/Completed";

const QuizPage = () => {
  const {
    res: checkAnswerRes,
    execute: checkAnswer,
    status: checkAnswerStatus,
    reset: resetAnswerStatus,
  } = useAction(verifyAnswer);
  const { res: questionRes, execute: executeGetQuestion } =
    useAction(getQuestion);
  const { res, execute: verify } = useAction(verifyQuizSessionToken);
  const decoded = res?.data;
  const question = questionRes?.data;
  const dangerTime = 60;

  const [storedQuiz, setStoredQuiz] = useLocalStorage<any>("quiz", null);
  const [timeLeft, setTimeLeft] = useState(
    storedQuiz ? storedQuiz.timeLeft : null,
  );
  const [currentQuestion, setCurrentQuestion] = useState(
    storedQuiz ? storedQuiz.currentQuestion : 1,
  );
  const [selectedAnswer, setSelectedAnswer] = useState(
    storedQuiz ? storedQuiz.selectedAnswer : null,
  );
  const [isCompleted, setIsCompleted] = useState(
    storedQuiz ? storedQuiz.isCompleted : null,
  );
  const [hideTimer, setHideTimer] = useState(false);
  const [openExplanation, setOpenExplanation] = useState(false);
  const [theoryAnswer, setTheoryAnswer] = useState(
    storedQuiz ? storedQuiz.selectedAnswer || "" : "",
  );
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    verify(id);
  }, [id, verify]);

  useEffect(() => {
    if (checkAnswerStatus == "success" && !checkAnswerRes?.data?.isCorrect) {
      setOpenExplanation(true);
    }
  }, [checkAnswerRes, checkAnswerStatus]);

  useEffect(() => {
    if (!decoded || isCompleted) return;
    executeGetQuestion(decoded.questionIds[currentQuestion - 1]);
    if (!storedQuiz || storedQuiz.timeLeft !== null) {
      setTimeLeft(storedQuiz?.timeLeft ?? 0);
    } else {
      setTimeLeft(Number(decoded.timer) * 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decoded, currentQuestion, executeGetQuestion]);

  useEffect(() => {
    if (!decoded && !question) return;
    if (selectedAnswer !== null && decoded?.mode == "study") {
      checkAnswer(
        decoded?.questionIds[currentQuestion - 1],
        decoded?.mode,
        decoded?.type == "objective"
          ? question?.options[selectedAnswer]
          : selectedAnswer,
      );
    }
    setStoredQuiz({
      ...storedQuiz,
      selectedAnswer,
      currentQuestion,
      isCompleted,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    checkAnswer,
    currentQuestion,
    decoded,
    question,
    selectedAnswer,
    setStoredQuiz,
    isCompleted,
  ]);

  useEffect(() => {
    if (!decoded && !question) return;
    if (
      decoded?.timer === "none" ||
      timeLeft == null ||
      isCompleted ||
      checkAnswerStatus !== "idle"
    )
      return;

    let interval: NodeJS.Timeout | null = null;

    if (timeLeft > 0) {
      if (timeLeft === dangerTime && decoded?.timer !== "1") {
        toast.warn(`You have ${dangerTime / 60} minute left`);
      }
      interval = setInterval(() => {
        setTimeLeft((prev: any) => {
          const newTime = prev > 0 ? prev - 1 : 0;
          setStoredQuiz({
            ...storedQuiz,
            timeLeft: newTime,
          });
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setSelectedAnswer(decoded?.type == "objective" ? -1 : "");
      toast.warn("Your time is up!");
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    checkAnswerStatus,
    dangerTime,
    decoded,
    question,
    selectedAnswer,
    setStoredQuiz,
    storedQuiz,
    timeLeft,
    isCompleted,
  ]);

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  const handleSubmit = async () => {
    if (checkAnswerStatus == "loading") return;
    if (decoded?.mode == "study") {
      if (decoded?.type == "objective" && selectedAnswer == null) {
        toast.error("Please select an answer");
        return;
      }
      if (
        decoded?.type == "theory" &&
        !theoryAnswer &&
        checkAnswerStatus == "idle"
      ) {
        toast.error("Please answer the question");
        return;
      }
    }
    if (decoded?.type == "theory" && checkAnswerStatus == "idle") {
      setSelectedAnswer(theoryAnswer);
      if (decoded?.mode == "study") return;
    }
    if (storedQuiz?.currentQuestion < decoded.questionCount) {
      const newTime = Number(decoded.timer) * 60;
      setTimeLeft(newTime);
      setSelectedAnswer(null);
      setTheoryAnswer("");
      setStoredQuiz({
        ...storedQuiz,
        timeLeft: decoded?.mode == "study" ? newTime : storedQuiz.timeLeft,
        currentQuestion: currentQuestion + 1,
        selectedAnswer: null,
      });
      setCurrentQuestion((prev: number) => prev + 1);
      resetAnswerStatus();
      return;
    }
    setIsCompleted(true);
    setTimeLeft(null);
    setSelectedAnswer(null);
    setTheoryAnswer("");
    setCurrentQuestion(null);
    resetAnswerStatus();
    setStoredQuiz({
      ...storedQuiz,
      timeLeft: null,
      selectedAnswer: null,
    });
  };

  const leaveAndEndExam = async () => {
    await endExam();
    setTimeLeft(null);
    setStoredQuiz(null);
    router.push(`/exams/${id}`);
  };

  if (!decoded) return null;

  return (
    <main className="w-full h-[100dvh] p-4 bg-[url(/register.jpg)] bg-cover bg-center">
      {decoded.mode == "study" &&
        checkAnswerRes?.data?.isCorrect &&
        isCompleted !== null &&
        !isCompleted && <Confetti className="!z-10 w-full h-[100dvh]" />}
      <div
        className={`flex ${decoded.mode == "exam" && isCompleted !== null && !isCompleted ? "justify-end" : "justify-between"} items-center gap-4 h-[50px]`}
      >
        {(decoded.mode == "study" ||
          (decoded.mode == "exam" && isCompleted)) && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <Button
              className="flex gap-2 items-center !bg-red-500 !text-white hover:!bg-red-600"
              onClick={leaveAndEndExam}
            >
              <LuLogOut />
              <p className="hidden sm:block">Leave</p>
            </Button>
          </motion.div>
        )}
        {decoded.timer !== "none" && isCompleted !== null && !isCompleted && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => setHideTimer(!hideTimer)}
          >
            {hideTimer ? (
              <LuClock9 className="text-2xl cursor-pointer text-blue-800" />
            ) : (
              <span
                className={`countdown p-2 bg-gray-100 border border-secondary-light-400 shadow-md rounded-md font-mono dark:bg-gray-800 dark:border-gray-700 cursor-pointer sm:text-2xl ${timeLeft <= dangerTime ? "text-red-500" : ""}`}
              >
                <span style={{ ["--value" as any]: h }}>{h}</span>:
                <span style={{ ["--value" as any]: m }}>{m}</span>:
                <span style={{ ["--value" as any]: s }}>{s}</span>
              </span>
            )}
          </motion.div>
        )}
      </div>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="grid place-content-center min-h-[calc(100%-50px)]"
      >
        <div
          className={`w-full sm:w-[400px] p-4 border bg-gray-50/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-md shadow-md space-y-4 ${isCompleted ? "flex flex-col items-center justify-center" : ""} ${question ? "" : "w-[250px]"}`}
        >
          {isCompleted ? (
            <Completed />
          ) : (
            <>
              <div className="text-center font-semibold">
                <span className="text-lg">{currentQuestion}</span>
                <span className="text-2xl">/{decoded?.questionCount}</span>
              </div>
              <div className="p-4 border bg-white rounded-md shadow-inner dark:bg-gray-800">
                {question?.question}
              </div>
              <div className="space-y-2 p-4 border bg-white rounded-md shadow-inner dark:bg-gray-800">
                {decoded.type == "theory" ? (
                  <textarea
                    rows={6}
                    value={theoryAnswer}
                    onChange={(e) => setTheoryAnswer(e.target.value)}
                    className={`resize-none rounded-md shadow-inner form-input ${checkAnswerStatus == "success" && (checkAnswerRes?.data?.isCorrect ? "border-green-700" : "border-red-700")}`}
                    disabled={timeLeft <= 0 || selectedAnswer !== null}
                  />
                ) : question?.options ? (
                  question?.options.map((opt: any, i: number) => (
                    <div
                      className={`border p-2 rounded-md cursor-pointer shadow-inner bg-gray-200 hover:bg-primary-light-100 hover:border-secondary-light-400 dark:bg-inherit dark:hover:bg-primary-dark-100 ${timeLeft <= 0 || selectedAnswer !== null ? "pointer-events-none" : ""} ${selectedAnswer == i ? "bg-primary-light-200 dark:bg-primary-dark-200" : ""} ${!checkAnswerRes?.data?.isCorrect && checkAnswerRes?.data?.ans == opt ? "!bg-red-700 text-white" : ""} ${checkAnswerRes?.data?.correct_answer == opt ? "!bg-green-700 text-white hover:!bg-green-700" : ""}`}
                      onClick={() => {
                        setSelectedAnswer(i);
                      }}
                      key={i}
                    >
                      {opt}
                    </div>
                  ))
                ) : (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      className="border p-2 rounded-md shadow-inner animate-pulse h-[40px] bg-gray-200 dark:bg-inherit"
                      key={i}
                    />
                  ))
                )}
              </div>
              {checkAnswerStatus == "success" && question?.explanation && (
                <div
                  className={`collapse collapse-arrow text-white bg-green-700 ring ring-green-800 ${openExplanation ? "collapse-open" : "collapse-close"}`}
                >
                  <input type="radio" name="accordion" />
                  <div
                    className="px-4 collapse-title font-semibold"
                    onClick={() => setOpenExplanation(!openExplanation)}
                  >
                    {decoded?.type == "theory"
                      ? "Correct Answer"
                      : "Explanation"}
                  </div>
                  <div className="px-4 collapse-content">
                    {decoded?.type == "theory"
                      ? question?.correct_answer
                      : question?.explanation}
                  </div>
                </div>
              )}
              <div className="text-center">
                <Button
                  className={`${timeLeft <= 0 || checkAnswerStatus == "success" || (decoded?.mode == "study" && checkAnswerStatus !== "idle") || (decoded?.mode == "exam" && selectedAnswer !== null && storedQuiz?.currentQuestion == decoded.questionCount) ? "animate-bounce" : ""}`}
                  disabled={checkAnswerStatus == "loading"}
                  onClick={handleSubmit}
                >
                  {storedQuiz?.currentQuestion == decoded.questionCount
                    ? "Submit"
                    : "Next"}
                </Button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
};

export default QuizPage;
