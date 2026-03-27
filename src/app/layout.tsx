import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
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
  metadataBase: new URL("https://saidpiecetravels.com"),
  title: "Saidpiece Travel | Bhutan's Leading Adventure Travel Expert",
  description: "Experience Bhutan with Saidpiece Travel. Pioneering authentic, meaningful journeys to the Land of the Thunder Dragon for over 45 years. Custom itineraries, luxury treks, and cultural immersion.",
  keywords: ["Bhutan travel", "Bhutan tours", "luxury travel Bhutan", "adventure travel", "cultural tourism", "Himalayas"],
  openGraph: {
    title: "Saidpiece Travel | Authentic Bhutan Experiences",
    description: "Pioneering adventure travel in Bhutan for 45 years. Discover the Kingdom's soul.",
    url: "https://saidpiecetravels.com",
    siteName: "Saidpiece Travel",
    images: [
      {
        url: "/images/bhutan/main1.webp",
        width: 1200,
        height: 630,
        alt: "Landscape of Bhutan",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saidpiece Travel | Bhutan's Leading Adventure Travel Expert",
    description: "Experience the real rhythm of Bhutan with our curated journeys.",
    images: ["/images/bhutan/main1.webp"],
  },
  icons: {
    icon: "/favicon.ico",
  },
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
