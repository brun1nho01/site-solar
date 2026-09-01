"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CaretDown as ChevronDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "O sistema funciona em dias nublados ou chuvosos?",
    answer: "Sim! Os painéis solares modernos captam a luminosidade, não apenas a luz direta do sol. Embora a geração seja menor em dias nublados, o sistema continuará produzindo energia e você se beneficia do sistema de créditos da concessionária."
  },
  {
    question: "A energia solar zera a minha conta de luz?",
    answer: "Não é possível garantir conta zerada. A economia depende do consumo, da geração, do dimensionamento, das regras de compensação e das cobranças que continuam aplicáveis, como disponibilidade da rede e iluminação pública."
  },
  
  {
    question: "Qual é a vida útil de um sistema fotovoltaico?",
    answer: "Painéis fotovoltaicos são projetados para operação de longo prazo. Vida útil, garantia de produto e garantia de desempenho variam conforme fabricante e modelo e são informadas na proposta comercial."
  },
  {
    question: "Preciso de manutenção constante?",
    answer: "A necessidade de limpeza e inspeção depende do local, da sujeira acumulada e das recomendações dos fabricantes. O plano adequado é definido para cada instalação."
  },
  {
    question: "O investimento se paga em quanto tempo?",
    answer: "O prazo de retorno depende do preço do sistema, forma de pagamento, consumo, tarifa, geração e manutenção. A simulação do site é apenas uma referência inicial; o cenário completo é apresentado depois da análise técnica."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-24 overflow-hidden border-t border-navy-900/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Coluna Esquerda: Título */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24">
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-balance text-navy-950 dark:text-white">
                Dúvidas <span className="text-gold-500 dark:text-gold-400">Frequentes</span>
              </h2>
              <p className="text-navy-600 dark:text-text-secondary text-lg mb-8">
                Tudo o que você precisa saber antes de investir no seu futuro, explicado de forma clara.
              </p>
            </div>
          </div>

          {/* Coluna Direita: As Perguntas */}
          <div className="w-full lg:w-2/3 space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={cn(
                    "border rounded-2xl overflow-hidden transition-all duration-300",
                    isOpen
                      ? "bg-white/80 dark:bg-navy-900/60 border-gold-500/30 shadow-[0_0_20px_rgba(242,205,66,0.1)]"
                      : "glass border-navy-900/5 dark:border-white/5 hover:border-gold-500/20 hover:bg-black/[0.02] dark:hover:bg-white/[0.08]"
                  )}
                >
                  <button
                    type="button"
                    id={`faq-trigger-${index}`}
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-content-${index}`}
                    className="flex min-h-11 w-full items-center justify-between gap-4 px-5 py-5 text-left focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-400 sm:px-6"
                  >
                    <span className={cn(
                      "font-bold text-lg transition-colors",
                      isOpen ? "text-gold-500 dark:text-gold-400" : "text-navy-950 dark:text-white"
                    )}>
                      {faq.question}
                    </span>
                    <div aria-hidden="true" className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                      isOpen ? "bg-gold-500/20 text-gold-500 dark:text-gold-400 rotate-180" : "bg-black/5 dark:bg-white/10 text-navy-600 dark:text-text-secondary"
                    )}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div
                          id={`faq-content-${index}`}
                          role="region"
                          aria-labelledby={`faq-trigger-${index}`}
                          className="px-6 pb-5 text-navy-600 dark:text-text-secondary leading-relaxed"
                        >
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
