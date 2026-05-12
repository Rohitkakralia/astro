import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MD astrology",
  description: "Generate your kundali with MD astrology",
  icons: {
    icon: [{ url: "/title-logo.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        <LayoutWrapper>
          {children}

        </LayoutWrapper>
      </body>
    </html>
  );
}
