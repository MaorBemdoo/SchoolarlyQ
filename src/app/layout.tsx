import type { Metadata } from "next";
import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { baseUrl } from "@/constants";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "SchoolarlyQ - Overview",
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
        url: "/full-logo.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `${baseUrl}`,
    creator: "@BemdooMaor",
    title: "SchoolarlyQ - Overview",
    description: "Elevate your learning, Elevate your GPA",
    images: "/full-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="text-secondary-light-400 dark:bg-secondary-dark-100 dark:text-white">
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
