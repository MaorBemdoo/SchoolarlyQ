/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyQuizSessionToken } from "@/actions/quizAuth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Quiz | SchoolarlyQ"
};

export default async function QuizLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: any
}>) {
    const { id } = await params
   const { status } = await verifyQuizSessionToken(id);
    if (status === "failed") {
        redirect(`/exams/${id}`)
    }

  return children;
}
