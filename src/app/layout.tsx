import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import {
  PARENT_SITE_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/app/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Weekly Wealth Masterclass Webinar`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: PARENT_SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "GELD Wealth",
    "webinar",
    "derivatives trading",
    "portfolio review",
    "retirement planning",
    "wealth masterclass",
    "India investing",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Weekly Wealth Masterclass Webinar`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/webinar_poster_2.png",
        alt: `${SITE_NAME} webinar poster`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Weekly Wealth Masterclass Webinar`,
    description: SITE_DESCRIPTION,
    images: ["/webinar_poster_2.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/new_geld_g_logo.png", type: "image/png" },
    ],
    apple: [{ url: "/new_geld_g_logo.png", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  category: "finance",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030303",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
