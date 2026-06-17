import type { Metadata } from "next";
import { Playfair_Display, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#E5A93B" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/service-worker.js').then(function(reg) {
                    console.log('ServiceWorker registered');
                  }, function(err) {
                    console.log('ServiceWorker failed: ', err);
                  });
                });
              }
            `
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#050507] text-[#e2e8f0] min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
