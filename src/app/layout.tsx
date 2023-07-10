import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GPT-4 API Access Checker",
  description:
    "Check if your OpenAI API key has access to GPT-4, the most advanced language model in the world. Find out how to get access, what you can do with it, and more.",
  icons: ["/GPT-4.png"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Script
          strategy="lazyOnload"
          src="https://wink.lonelil.com/js/script.js"
          data-domain="gpt4access.lonelil.com"
        />
      </body>
    </html>
  );
}
