import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Health Tracker | Daily Planner & Habit Tracker",
  description: "A clean, minimal, and interactive desktop health tracking app for students to plan and log water, sleep, and exercise.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased select-none selection:bg-[#97EFE9] selection:text-[#222E50]">
        {children}
      </body>
    </html>
  );
}
