/* ═══════════════════════════════════════════════════
   page.tsx — Server Component (Plano 5.1)
   Monta todas as seções na hierarquia do Plano 3
   Renderizado no servidor para SEO máximo
   ═══════════════════════════════════════════════════ */

import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import QualitySection from "@/components/sections/QualitySection";
import RegionalMapSection from "@/components/sections/RegionalMapSection";
import FAQSection from "@/components/sections/FAQSection";
import Footer from "@/components/sections/Footer";
import LazyCalculatorSection from "@/components/sections/deferred/LazyCalculatorSection";
import LazyInstagramSection from "@/components/sections/deferred/LazyInstagramSection";
import LazyProcessSection from "@/components/sections/deferred/LazyProcessSection";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  alternates: {
    canonical: `${siteConfig.siteUrl}/`,
  },
};


export default function Home() {
  return (
    <main id="conteudo-principal" tabIndex={-1} className="relative scroll-mt-24 outline-none">
      <HeroSection />

      {/* Container Integrado do Simulador */}
      <section id="simulador" className="safe-inline relative z-10 overflow-hidden px-4 pb-32 pt-4">
        <div className="max-w-3xl mx-auto">
          <LazyCalculatorSection />
        </div>
        
        {/* SVG Wave Divider transitioning to QualitySection */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[1px]">
          <svg className="relative block w-full h-[60px] md:h-[120px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C52.16,93.26,103.65,79.52,153.25,64.7,208.56,48.24,263.26,67.6,321.39,56.44Z" className="fill-slate-50 dark:fill-navy-950"></path>
          </svg>
        </div>
      </section>
      
      {/* 2. Qualidade e Performance (Problema/Solução) e Diferenciais */}
      <QualitySection />

      {/* 3. Instagram Wall */}
      <LazyInstagramSection />

      {/* 4. Processo com Sticky Scroll */}
      <LazyProcessSection />

      {/* 5.5 Mapa Regional Geográfico */}
      <RegionalMapSection />

      {/* 6. FAQ (Dúvidas Frequentes) */}
      <FAQSection />

      {/* 7. Footer CTA */}
      <Footer />
    </main>
  );
}
