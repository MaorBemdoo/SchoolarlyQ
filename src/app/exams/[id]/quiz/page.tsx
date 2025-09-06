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

const QuizPage = () => {
  const { res, execute: verify } = useAction(verifyQuizSessionToken);
  const decoded = res?.data;
  const dangerTime = 60;

  const [storedTime, setStoredTime] = useLocalStorage<number | null>(
    "quiz-time-left",
  );
  const [timeLeft, setTimeLeft] = useState(storedTime || 0);
  const [hideTimer, setHideTimer] = useState(false);
  const [openExplanation, setOpenExplanation] = useState(false);
  // const [disableOptions, setDisableOptions] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    verify(id);
  }, [id, verify]);

  useEffect(() => {
    if (!decoded) return;
    if (storedTime !== null) {
      setTimeLeft(storedTime ?? 0);
    } else {
      setTimeLeft(Number(decoded.timer) * 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decoded]);

  useEffect(() => {
    if (timeLeft <= 0 || decoded?.timer === "none") return;
    if (timeLeft === dangerTime) {
      toast.warn(`You have ${dangerTime / 60} minute left`);
    }

    const interval = setInterval(() => {
      setTimeLeft((prev: any) => {
        const newTime = prev > 0 ? prev - 1 : 0;
        setStoredTime(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [dangerTime, decoded?.timer, setStoredTime, timeLeft]);

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  const leaveAndEndExam = async () => {
    await endExam();
    setTimeLeft(0);
    setStoredTime(null);
    router.push(`/exams/${id}`);
  };

  if (!decoded) return null;

  return (
    <main className="w-full h-[100dvh] p-4 overflow-hidden bg-[url(/register.jpg)] bg-cover bg-center">
      <div
        className={`flex ${decoded.mode == "study" ? "justify-between" : "justify-end"} items-center gap-4 h-[50px] *:z-10`}
      >
        {decoded.mode == "study" && (
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
        {decoded.timer !== "none" && (
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
        className="grid place-content-center h-full *:z-10"
      >
        <div className="max-w-[500px] p-4 border bg-gray-50/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-md shadow-md space-y-4">
          <div className="text-center font-semibold">
            <span className="text-lg">1</span>
            <span className="text-2xl">/{decoded?.questionCount}</span>
          </div>
          <div className="p-4 border bg-white rounded-md shadow-inner dark:bg-gray-800">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt,
            id maxime cum at omnis non!
          </div>
          <div className="space-y-2 p-4 border bg-white rounded-md shadow-inner dark:bg-gray-800">
            {false ? (
              <textarea
                rows={6}
                className="resize-none rounded-md shadow-inner form-input"
              />
            ) : (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  className="border p-2 rounded-md cursor-pointer shadow-inner bg-gray-200 hover:bg-primary-light-100 hover:border-secondary-light-400 dark:bg-inherit dark:hover:bg-primary-dark-100 disabled:bg-red-500"
                  aria-disabled
                  key={i}
                >
                  {i + 1}
                </div>
              ))
            )}
          </div>
          <div
            className={`collapse collapse-arrow text-white bg-green-700 ring ring-green-800 ${openExplanation ? "collapse-open" : ""}`}
          >
            <input type="radio" name="accordion" />
            <div
              className="px-4 collapse-title font-semibold"
              onClick={() => setOpenExplanation(!openExplanation)}
            >
              Explanation
            </div>
            <div className="px-4 collapse-content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit qui
              nulla maxime dolorum. Distinctio ut, et at minus ipsa nostrum.
            </div>
          </div>
          <div className="text-center">
            <Button className="">Submit</Button>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default QuizPage;
