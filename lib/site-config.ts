export const siteConfig = {
  siteUrl: "https://wlimasolucoes.com.br",
  instagramUrl: "https://www.instagram.com/wlimasolucoes/",
  company: {
    displayName: "W. Lima Soluções",
    registeredTradeName: "W. Lima Solucoes",
    legalName: "W. Lima Solucoes LTDA",
    taxId: "59.652.464/0001-25",
    taxIdDigits: "59652464000125",
    email: "wlimasolucoes@gmail.com",
    phone: {
      display: "(22) 99961-8883",
      international: "+55 (22) 99961-8883",
      e164: "+5522999618883",
      whatsapp: "5522999618883",
    },
    address: {
      street: "Rua Virgilio Franklin",
      number: "00",
      district: "Centro",
      city: "Cambuci",
      state: "RJ",
      postalCode: "28430-586",
      country: "BR",
    },
  },
} as const;

export function createWhatsAppUrl(message?: string) {
  const baseUrl = `https://wa.me/${siteConfig.company.phone.whatsapp}`;

  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
}
