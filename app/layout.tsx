import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF Utility Tool - Compress & Merge PDFs Online",
  description:
    "Compress and merge your PDF files easily and efficiently with our free and fast online tool. Reduce file sizes for storage and sharing, or merge multiple PDFs into one for seamless organization.",
  generator: "Aldo Tobing",
  keywords: [
    "PDF utility",
    "PDF compressor",
    "merge PDF",
    "compress PDF",
    "reduce PDF size",
    "free PDF tool",
    "PDF optimization",
    "merge PDFs",
  ],
  applicationName: "PDF Utility Tool",
  openGraph: {
    title: "PDF Utility Tool - Compress & Merge PDFs Online",
    description:
      "Compress and merge your PDF files easily and efficiently without losing quality. Free and fast online tool for optimizing your PDFs.",
    url: "https://pdf-compress.aldotobing.online",
    siteName: "PDF Utility Tool",
    images: [
      {
        url: "https://pdf-compress.aldotobing.online/assets/img/pdf.jpg",
        width: 1200,
        height: 630,
        alt: "PDF Utility Tool Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Utility Tool - Compress & Merge PDFs Online",
    description:
      "Compress and merge your PDF files easily and efficiently without losing quality.",
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
        <meta name="author" content="Aldo Tobing" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "PDF Utility Tool",
              url: "https://pdf-compress.aldotobing.online",
              description:
                "Compress and merge your PDF files easily and efficiently with our free online tool.",
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
