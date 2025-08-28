import { auth } from "@/utils/auth";
import { notFound } from "next/navigation";

export const metadata = {
  title: {
    template: "%s - Admin Dashboard | SchoolarlyQ",
    absolute: "Admin Dashboard | SchoolarlyQ",
  },
};

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session?.user as any)?.role !== "admin") {
    notFound();
  }
  return children;
}
