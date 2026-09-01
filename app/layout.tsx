import type { Metadata } from "next";
import "./globals.css";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import GridBackground from "@/components/ui/GridBackground";
import Navbar from "@/components/ui/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { siteConfig } from "@/lib/site-config";

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
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Energia Solar para Residências e Empresas | W. Lima Soluções",
    template: "%s | W. Lima Soluções",
  },
  description:
    "Projetos de energia solar para residências, empresas e propriedades rurais. Faça uma simulação inicial e fale com a W. Lima Soluções.",
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
    url: siteConfig.siteUrl,
    title: "Energia Solar para Residências e Empresas | W. Lima Soluções",
    description:
      "Faça uma estimativa inicial para seu imóvel e fale com a equipe da W. Lima Soluções.",
    siteName: siteConfig.company.displayName,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${siteConfig.company.displayName} — Energia Solar de Alto Padrão no Rio de Janeiro`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Energia Solar | W. Lima Soluções",
    description: "Faça uma estimativa inicial para seu imóvel e fale com nossa equipe.",
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
    "name": siteConfig.company.displayName,
    "legalName": siteConfig.company.legalName,
    "taxID": siteConfig.company.taxId,
    "url": siteConfig.siteUrl,
    "image": `${siteConfig.siteUrl}/og-image.jpg`,
    "description": "Projetos de energia solar para residências, empresas e propriedades rurais.",
    "telephone": siteConfig.company.phone.e164,
    "email": siteConfig.company.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": `${siteConfig.company.address.street}, ${siteConfig.company.address.number}`,
      "addressLocality": siteConfig.company.address.city,
      "addressRegion": siteConfig.company.address.state,
      "postalCode": siteConfig.company.address.postalCode,
      "addressCountry": siteConfig.company.address.country
    },
    "sameAs": [
      siteConfig.instagramUrl
    ]
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
          <CookieConsent gaId={process.env.NEXT_PUBLIC_GA_ID} />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
