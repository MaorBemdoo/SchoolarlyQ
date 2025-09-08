/* eslint-disable @typescript-eslint/no-explicit-any */
import AppLink from "@/components/AppLink";
import React from "react";

const ExamCard = ({ title, code, level, semester, session, id }: any) => {
  return (
    <div className="flex flex-col gap-2 justify-between h-[150px] p-4 rounded-md bg-primary-light-100 shadow-md dark:bg-primary-dark-100">
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <p className="text-xs font-mono">{code.split("").join(" ")}</p>
          <p className="text-xs font-mono">E X A M</p>
        </div>
        <AppLink
          href={`/exams/${id}`}
          className="font-semibold mt-3 mb-8 hover:underline"
        >
          {title}
        </AppLink>
      </div>
      <div>
        <p className="text-sm">
          {level} Level · {semester}
          {semester == 1
            ? "st"
            : semester == 2
              ? "nd"
              : semester === 3
                ? "rd"
                : "th"}{" "}
          Semester · {session} Session
        </p>
      </div>
    </div>
  );
};

export default ExamCard;
