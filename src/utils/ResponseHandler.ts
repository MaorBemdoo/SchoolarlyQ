  const ResponseHandler = (
  status: "success" | "failed",
  message: string,
  data: unknown = null
) => {
  return {
    status,
    message,
    data: data ? data : undefined,
  };
};

export default ResponseHandler;
