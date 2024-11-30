import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div>{children}</div>
      <div>{children}</div>
    </main>
  );
}
