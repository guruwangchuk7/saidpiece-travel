import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
});

const lato = Lato({
  subsets: ["latin"],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
});

export const metadata: Metadata = {
  title: "Saidpiece Travel - Authentic Travel Experiences",
  description: "Pioneering Adventure Travel for 45 Years",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.className} ${playfair.variable} ${lato.variable}`}>
        {children}
      </body>
    </html>
  );
}
