import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com`,
  "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://tile.openstreetmap.org https://*.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self' data:",
  `connect-src 'self'${isDevelopment ? " ws:" : ""} https://viacep.com.br https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com`,
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  /* ── Formatos modernos de imagem (AVIF + WebP) ── */
  images: {
    formats: ["image/avif", "image/webp"],
  },

  /* ── Headers de segurança (nível enterprise) ── */
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        /* Impede MIME-type sniffing */
        { key: "X-Content-Type-Options", value: "nosniff" },
        /* Impede que o site seja embutido em iframe (anti-clickjacking) */
        { key: "X-Frame-Options", value: "DENY" },
        /* Controla o que é enviado no header Referer */
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        /* Relata violações sem bloquear integrações durante a homologação */
        {
          key: "Content-Security-Policy-Report-Only",
          value: contentSecurityPolicy,
        },
        /* Permissões de recursos do navegador */
        {
          key: "Permissions-Policy",
          value:
            "browsing-topics=(), camera=(), geolocation=(), microphone=(), payment=(), usb=()",
        },
      ],
    },
  ],
};

export default nextConfig;
