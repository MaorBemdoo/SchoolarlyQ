import { NextResponse } from "next/server";

const ResponseHandler = (
  status: number | string,
  message: string,
  data: unknown = null,
) => {
  const statusCode = status as number;
  status = status.toString().startsWith("2") ? "success" : "failed";
  return NextResponse.json(
    {
      status,
      message,
      data: data ? data : undefined,
    },
    {
      status: statusCode,
    },
  );
};

export default ResponseHandler;
