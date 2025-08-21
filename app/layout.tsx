import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from './Providers'; // الجديد
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "STUvoice",
  description: "رأيك يصنع الفرق",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="My App" />
      </Head>
      <body className={inter.className}>
        <Providers> {/* التعديل الرئيسي هنا */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
