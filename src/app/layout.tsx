import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/lib/site";
import { OrganizationJsonLd } from "@/components/JsonLd";
import "./globals.css";

const bastardo = localFont({
  src: [
    {
      path: "../fonts/bastardo/BastardoRounded-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/bastardo/BastardoRounded-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/bastardo/BastardoRounded-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/bastardo/BastardoRounded-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/bastardo/BastardoRounded-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/bastardo/BastardoRounded-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-bastardo",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s – ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.ogTitle,
    description: siteConfig.ogDescription,
    url: siteConfig.url,
    locale: "de_DE",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.ogTitle,
    description: siteConfig.ogDescription,
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-64.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bastardo.variable} h-full`}>
      <body className="min-h-full min-h-[100dvh] bg-bg font-sans text-ink antialiased">
        <OrganizationJsonLd />
        {children}
      </body>
    </html>
  );
}
