import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SchoolarlyQ - Overview",
  description: "Your tool to success",
  authors: {name: "🚀Bemdoo Maor"},
  openGraph: {
    type: "website",
    // url: `${baseUrl}`,
    title: "SchoolarlyQ - Overview",
    description: "Your tool to success",
    siteName: "SchoolarlyQ",
    images: [{
      url: "/full-logo.png",
    }],
  },
  twitter: {
    card: "summary_large_image",
    // site: `${baseUrl}`,
    creator: "@BemdooMaor",
    title: "SchoolarlyQ - Overview",
    description: "Your tool to success",
    "images": "/full-logo.png" 
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
