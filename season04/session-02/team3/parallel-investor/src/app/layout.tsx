import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DÉJÀ BUY - 데자바이",
  description: "또 사려고? 이거 전에도 봤잖아. 이미 본 패턴에 또 당하지 마세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="mx-auto min-h-screen max-w-lg px-4 pb-24 pt-4 md:max-w-2xl md:pb-8">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
