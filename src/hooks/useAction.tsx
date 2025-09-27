/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionResponse } from "@/types";
import { useState, useCallback } from "react";

type Status = "idle" | "loading" | "success" | "failed";

const useAction = (action: (...args: any) => Promise<ActionResponse>) => {
  const [res, setRes] = useState<ActionResponse | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const execute = useCallback(
    async (...args: any) => {
      setStatus("loading");
      const res = await action(...args);
      setStatus(res.status);
      setRes(res);
      return res;
    },
    [action],
  );

  const reset = () => {
    setRes(null)
    setStatus("idle")
  }

  return { status, res, execute, reset };
};

export default useAction;
