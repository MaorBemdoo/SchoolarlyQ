import type { Metadata } from "next";
import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { baseUrl } from "@/data/baseUrl";
import Providers from "./providers";
import { auth } from "@/utils/auth";

export const metadata: Metadata = {
  title: {
    template: "%s | SchoolarlyQ",
    default: "SchoolarlyQ",
    absolute: "Overview | SchoolarlyQ",
  },
  description: "Elevate your learning, Elevate your GPA",
  authors: [{ name: "🚀Bemdoo Maor" }, { name: "Adamu Jighjigh" }],
  openGraph: {
    type: "website",
    url: `${baseUrl}`,
    title: "SchoolarlyQ - Overview",
    description: "Elevate your learning, Elevate your GPA",
    siteName: "SchoolarlyQ",
    images: [
      {
        url: "/full_logo.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `${baseUrl}`,
    creator: "@BemdooMaor",
    title: "SchoolarlyQ - Overview",
    description: "Elevate your learning, Elevate your GPA",
    images: "/full_logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen text-secondary-light-400 bg-white dark:bg-[#121212] dark:text-white transition">
        <Providers session={session}>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
