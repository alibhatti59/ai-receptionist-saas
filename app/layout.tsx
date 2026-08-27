import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ai-frontdesk-byali.vercel.app'),
  title: "AI FrontDesk - Never Miss a Call",
  description: "An AI receptionist that answers calls and books real appointments, 24/7. Built with Next.js, Retell AI, Supabase, and Stripe.",
  openGraph: {
    title: "AI FrontDesk - Never Miss a Call",
    description: "An AI receptionist that answers calls and books real appointments, 24/7. Try the live demo.",
    url: "https://ai-frontdesk-byali.vercel.app",
    siteName: "AI FrontDesk",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI FrontDesk - AI voice receptionist that books real appointments",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI FrontDesk - Never Miss a Call",
    description: "An AI receptionist that answers calls and books real appointments, 24/7.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster theme="dark" position="top-right" />
        <Analytics />
      </body>
    </html>
  );
}