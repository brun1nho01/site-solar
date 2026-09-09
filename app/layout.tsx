import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import GridBackground from "@/components/ui/GridBackground";
import Navbar from "@/components/ui/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { siteConfig } from "@/lib/site-config";
import { ACTIVE_ENERGY_CITIES } from "@/lib/active-energy-cities";
import { sharedOpenGraphImage } from "@/lib/seo";

/* ── Fontes self-hosted via next/font (eliminando requests externos) ── */
const satoshi = localFont({
  src: [
    { path: "./fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
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
    images: [sharedOpenGraphImage],
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#040911" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.siteUrl}/#empresa`,
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
    ],
    "areaServed": ACTIVE_ENERGY_CITIES.map(({ city, state }) => ({
      "@type": "City",
      "name": `${city}, ${state}`,
    })),
  };

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`h-full antialiased ${satoshi.variable}`}
    >
      <body className="min-h-full flex flex-col relative text-slate-900 dark:text-slate-50 bg-slate-50 dark:bg-navy-950 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <a
            href="#conteudo-principal"
            className="skip-link fixed left-4 top-4 z-[200] -translate-y-24 rounded-lg bg-gold-400 px-4 py-3 text-sm font-bold text-navy-950 shadow-xl transition-transform focus:translate-y-0 motion-reduce:transition-none"
          >
            Pular para o conteúdo
          </a>
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
