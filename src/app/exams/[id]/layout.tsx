/* eslint-disable @typescript-eslint/no-explicit-any */
import { getExam } from "@/actions/exam";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }: any) => {
  const { id } = await params;
  const exam = await getExam(id);
  if (exam.status == "failed") {
    return {
      title: "Exam Not Found | SchoolarlyQ",
    };
  }
  return {
    title: exam?.data?.course_title,
  };
};

export default async function QuizzesLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: any;
}>) {
  const { id } = await params;
  const exam = await getExam(id);
  if (exam.status == "failed") notFound();
  return children;
}
