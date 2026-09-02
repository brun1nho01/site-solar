import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const sharedOpenGraphImage = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: `${siteConfig.company.displayName} — Energia Solar de Alto Padrão no Rio de Janeiro`,
} as const;

type PageMetadataOptions = {
  title: string;
  description: string;
  path: `/${string}` | "/";
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  const absoluteUrl = new URL(path, siteConfig.siteUrl).toString();
  const socialTitle = `${title} | ${siteConfig.company.displayName}`;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl,
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: absoluteUrl,
      title: socialTitle,
      description,
      siteName: siteConfig.company.displayName,
      images: [sharedOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [sharedOpenGraphImage.url],
    },
  };
}

