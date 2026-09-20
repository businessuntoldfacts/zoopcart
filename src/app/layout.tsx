import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Zoopcart",
  description: "Turn conversations into orders.",
  icons: {
    icon: '/icon.jpg',
    apple: '/icon.jpg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        {/* Force mobile scaling and disable auto-zoom on inputs */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <style>{`
          /* Prevent horizontal scroll and fix desktop mode triggers */
          html, body {
            max-width: 100vw !important;
            overflow-x: hidden !important;
            position: relative;
            width: 100%;
            height: 100%;
            -webkit-text-size-adjust: 100%;
            touch-action: manipulation;
          }
        `}</style>
      </head>
      <body className={`${inter.variable} font-sans antialiased h-full w-full`}>
        {children}
      </body>
    </html>
  );
}
