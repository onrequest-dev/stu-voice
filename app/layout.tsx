import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from './Providers'; 


const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "STUvoice",
  description: "رأيك يصنع الفرق",
  manifest: "/manifest.json",
  themeColor: "#1d4ed8", // اللون الأساسي (لون الشريط على Android)
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" }
    ],
    apple: [
      { url: "/stu-voice.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      {
        rel: "badge",
        url: "/badge-72x72.png",
        sizes: "72x72",
        type: "image/png"
      }
    ]
  },
  appleWebApp: {
    capable: true,
    title: "STUvoice",
    statusBarStyle: "black-translucent"
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
}
;



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
