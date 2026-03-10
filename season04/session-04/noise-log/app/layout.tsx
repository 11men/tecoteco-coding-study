import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BottomNav } from "@/components/AppShell";
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
  title: "소음지도 - 이사 전 소음 환경 확인",
  description:
    "이사 전에 소음 환경을 미리 확인하세요. 소음 리뷰, 히트맵, 객관적 지표로 더 나은 주거 환경을 찾아보세요.",
  keywords: ["소음", "소음지도", "층간소음", "이사", "부동산", "소음 리뷰"],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "소음지도",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
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
        <div className="flex min-h-dvh flex-col pb-16">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
