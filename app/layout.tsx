import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from './Providers'; 


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "STUvoice",
  description: "رأيك يصنع الفرق",
};



export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
