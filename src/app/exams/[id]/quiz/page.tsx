/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Button from "@/components/Button";
import toast from "@/utils/toast";
import React, { useEffect, useState } from "react";
import { LuClock9, LuLogOut } from "react-icons/lu";
import { useLocalStorage } from "react-use";
import { motion } from "framer-motion";

const QuizPage = () => {
  const QUIZ_DURATION = 10 * 60;
  const dangerTime = 1 * 60;

  const [storedTime, setStoredTime] = useLocalStorage<number | null>("quiz-time-left", QUIZ_DURATION);
  const [timeLeft, setTimeLeft] = useState(storedTime ?? QUIZ_DURATION);
  const [hideTimer, setHideTimer] = useState(false);

useEffect(() => {
    if (timeLeft <= 0) return;
    if (timeLeft === dangerTime){
        toast.warn(`You have ${dangerTime / 60} minute left`)
    };

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev > 0 ? prev - 1 : 0;
        setStoredTime(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [dangerTime, setStoredTime, timeLeft]);

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  return (
    <main className="w-full h-[100dvh] p-4 overflow-hidden bg-[url(/register.jpg)] bg-cover bg-center">
      <div className="flex justify-between items-center gap-4 h-[50px] *:z-10">
        <motion.div initial={{x: "-100%", opacity: 0}} animate={{x: 0, opacity: 1}}>
            <Button
                className="flex gap-2 items-center !bg-red-500 !text-white hover:!bg-red-600"
                onClick={() => {
                    setStoredTime(null);
                }}
                >
                <LuLogOut />
                <p className="hidden sm:block">Leave</p>
            </Button>
        </motion.div>
        <motion.div initial={{x: "100%", opacity: 0}} animate={{x: 0, opacity: 1}} onClick={() => setHideTimer(!hideTimer)}>
            {
                hideTimer ? (
                    <LuClock9 className="text-2xl cursor-pointer text-blue-800" />
                ) : (
                    <span className={`countdown p-2 bg-gray-100 border border-secondary-light-400 shadow-md rounded-md font-mono dark:bg-gray-800 dark:border-gray-700 cursor-pointer sm:text-2xl ${timeLeft <= dangerTime ? "text-red-500" : ""}`}>
                        <span style={{ ["--value" as any]: h }}>{h}</span>:
                        <span style={{ ["--value" as any]: m }}>{m}</span>:
                        <span style={{ ["--value" as any]: s }}>{s}</span>
                    </span>
            )}
        </motion.div>
      </div>
      <motion.div initial={{y: 30, opacity: 0}} animate={{y: 0, opacity: 1}} className="grid place-content-center h-full *:z-10">
        <div className="max-w-[500px] p-4 border bg-gray-50/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-md shadow-md space-y-4">
            <div className="text-center font-semibold"><span className="text-lg">1</span><span className="text-2xl">/10</span></div>
            <div className="p-4 border bg-white rounded-md shadow-inner dark:bg-gray-800">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt, id maxime cum at omnis non!
            </div>
            <div className="space-y-2 p-4 border bg-white rounded-md shadow-inner dark:bg-gray-800">
                <textarea rows={6} className="hidden resize-none rounded-md shadow-inner form-input"/>
                {
                    Array.from({ length: 4 }).map((_, i) => (
                        <div className="border p-2 rounded-md cursor-pointer shadow-inner bg-gray-200 hover:bg-primary-light-100 hover:border-secondary-light-400 dark:bg-inherit dark:hover:bg-primary-dark-100" key={i}>{i + 1}</div>
                    ))
                }
            </div>
            <div className={`collapse collapse-arrow text-white bg-green-700 ring ring-green-800`}>
              <input type="radio" name="accordion" />
              <div className="px-4 collapse-title font-semibold">Explanation</div>
              <div className="px-4 collapse-content">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit qui nulla maxime dolorum. Distinctio ut, et at minus ipsa nostrum.</p>
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
