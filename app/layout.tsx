import type { Metadata } from "next";
import "./globals.css";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import GridBackground from "@/components/ui/GridBackground";
import Navbar from "@/components/ui/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { GoogleAnalytics } from "@next/third-parties/google";

/* ── Fontes self-hosted via next/font (eliminando requests externos) ── */
const satoshi = localFont({
  src: [
    { path: "./fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Satoshi-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

/* ── Metadata API — SEO + Open Graph (Plano 5.2) ──
   Tags precisas de title, description e OG
   para prévia atrativa no WhatsApp e redes sociais */
export const metadata: Metadata = {
  metadataBase: new URL("https://wlimasolucoes.com.br"),
  title: {
    default: "Energia Solar | Economize até 95% na Conta de Luz",
    template: "%s | Energia Solar",
  },
  description:
    "Produza sua própria energia e livre-se dos aumentos na conta de luz. Simule sua economia e receba um orçamento gratuito para energia solar.",
  keywords: [
    "energia solar",
    "painel solar",
    "economia conta de luz",
    "instalação solar",
    "orçamento energia solar",
    "financiamento solar",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://wlimasolucoes.com.br",
    title: "Energia Solar | Economize até 95% na Conta de Luz",
    description:
      "Simule quanto você pode economizar com energia solar. Orçamento gratuito e sem compromisso.",
    siteName: "W.Lima Soluções em Energia Solar",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "W.Lima Soluções — Energia Solar de Alto Padrão no Rio de Janeiro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Energia Solar | Economize até 95% na Conta de Luz",
    description: "Simule quanto você pode economizar com energia solar.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "W.Lima Soluções em Energia Solar",
    "url": "https://wlimasolucoes.com.br",
    "image": "https://wlimasolucoes.com.br/og-image.jpg",
    "description": "Economize até 95% na sua conta de luz com energia solar. Projetos completos e instalação em Cambuci e região.",
    "priceRange": "$$",
    "telephone": "+5522999618883",
    "email": "contato@wlimasolucoes.com.br",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rua Virgílio Franklin, Centro",
      "addressLocality": "Cambuci",
      "addressRegion": "RJ",
      "postalCode": "28430-000",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -21.576,
      "longitude": -41.911
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.instagram.com/wlimasolucoes/"
    ],
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": { "@type": "GeoCoordinates", "latitude": -21.576, "longitude": -41.911 },
      "geoRadius": "100000"
    }
  };

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`h-full antialiased ${satoshi.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-full flex flex-col relative text-slate-900 dark:text-slate-50 bg-slate-50 dark:bg-navy-950 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NoiseOverlay />
          <GridBackground />
          <FloatingWhatsApp />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Navbar />
            {children}
          </div>
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_GA_ID && process.env.NEXT_PUBLIC_GA_ID !== "G-XXXXXXX" && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
