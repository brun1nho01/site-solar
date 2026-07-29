import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        /* Permissões de recursos do navegador */
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=(self)",
        },
      ],
    },
  ],
};

export default nextConfig;
