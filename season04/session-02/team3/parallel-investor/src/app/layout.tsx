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
    <html lang="ko" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-zinc-100`}
      >
        {/* Mobile app shell — 390px fixed width, centered */}
        <div className="relative mx-auto w-full max-w-[390px] min-h-screen bg-[#0a0a0f] shadow-2xl shadow-black/50 overflow-hidden">
          <Header />
          <main className="px-4 pb-24 pt-4">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
