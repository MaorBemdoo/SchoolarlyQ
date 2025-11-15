/* eslint-disable @typescript-eslint/no-explicit-any */
import { getExamScore } from "@/actions/exam";
import useAction from "@/hooks/useAction";
import React, { useEffect } from "react";

const Completed = ({ decoded }: any) => {
  const { execute, res, status } = useAction(getExamScore)
  const score = res?.data

  useEffect(() => {
    execute(decoded.scoreId)
  }, [decoded, execute])

  return (
    <>
      {/* <FaCheckCircle size={52} color="#4caf50" /> */}
      <h2 className="text-2xl font-semibold">Congratulations!🎉</h2>
      <p className="text-lg">{score?.score}/{score?.questions?.length}</p>
    </>
  );
};

export default Completed;
