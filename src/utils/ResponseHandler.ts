/* eslint-disable @typescript-eslint/no-explicit-any */
  const ResponseHandler = (
  status: "success" | "failed",
  message: string,
  data: any = null
) => {
  return {
    status,
    message,
    data: data ? data : undefined,
  };
};

export default ResponseHandler;
