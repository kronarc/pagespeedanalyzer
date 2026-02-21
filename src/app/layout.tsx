import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Page Speed Analyzer",
  description: "Analyze website performance with Google PageSpeed Insights API",
  openGraph: {
    title: "Page Speed Analyzer",
    description: "Analyze website performance with Google PageSpeed Insights API",
    url: process.env.NEXT_PUBLIC_APP_URL,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${firaCode.variable} antialiased`}
      >
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
