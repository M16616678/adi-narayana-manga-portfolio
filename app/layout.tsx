import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adi Narayana Manga | 2D Game Developer & Solar2D Specialist",
  description: "Playable 2D game builds, Lua scripts, and software engineering portfolio of Adi Narayana Manga.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#090d16] text-[#e2e8f0] min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
