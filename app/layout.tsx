import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF Compressor - Free & Fast PDF Compression Online",
  description:
    "Compress your PDF files easily and efficiently without losing quality. Free and fast PDF compression web app.",
  generator: "Aldo",
  keywords: [
    "PDF compressor",
    "compress PDF",
    "reduce PDF size",
    "free PDF compression",
    "PDF optimization",
  ],
  applicationName: "PDF Compressor",
  openGraph: {
    title: "PDF Compressor - Free & Fast PDF Compression Online",
    description:
      "Compress your PDF files easily and efficiently without losing quality.",
    url: "https://pdf-compress.aldotobing.online",
    siteName: "PDF Compressor",
    images: [
      {
        url: "https://pdf-compress.aldotobing.online/assets/img/pdf.jpg",
        width: 1200,
        height: 630,
        alt: "PDF Compressor Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Compressor - Free & Fast PDF Compression Online",
    description:
      "Compress your PDF files easily and efficiently without losing quality.",
    images: ["https://pdf-compress.aldotobing.online/assets/img/pdf.jpg"],
  },
  alternates: {
    canonical: "https://pdf-compress.aldotobing.online",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Aldo" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "PDF Compressor",
              url: "https://pdf-compress.aldotobing.online",
              description:
                "Compress your PDF files easily and efficiently without losing quality.",
              applicationCategory: "Utility",
              operatingSystem: "All",
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
