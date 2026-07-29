"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown as ChevronDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "O sistema funciona em dias nublados ou chuvosos?",
    answer: "Sim! Os painéis solares modernos captam a luminosidade, não apenas a luz direta do sol. Embora a geração seja menor em dias nublados, o sistema continuará produzindo energia e você se beneficia do sistema de créditos da concessionária."
  },
  {
    question: "A energia solar zera a minha conta de luz?",
    answer: "Você pode economizar até 95% do valor da sua conta. Os 5% restantes correspondem à taxa mínima de disponibilidade da rede elétrica (custo de disponibilidade) e iluminação pública."
  },
  
  {
    question: "Qual é a vida útil de um sistema fotovoltaico?",
    answer: "Os painéis de alta performance que utilizamos na W Lima Soluções possuem vida útil estimada em mais de 25 anos, com garantias sólidas de fábrica para eficiência de geração ao longo de décadas."
  },
  {
    question: "Preciso de manutenção constante?",
    answer: "A manutenção é mínima. Basicamente envolve a limpeza dos painéis (quando não chove por muito tempo) para tirar a poeira e manter a eficiência, além de uma inspeção elétrica anual."
  },
  {
    question: "O investimento se paga em quanto tempo?",
    answer: "O retorno do investimento (Payback) no Brasil varia entre 3 a 5 anos na maioria dos casos, dependendo do consumo e da tarifa local. Depois disso, é lucro livre pelos próximos 20 anos!"
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
                    id={`faq-trigger-${index}`}
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-content-${index}`}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className={cn(
                      "font-bold text-lg transition-colors",
                      isOpen ? "text-gold-500 dark:text-gold-400" : "text-navy-950 dark:text-white"
                    )}>
                      {faq.question}
                    </span>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                      isOpen ? "bg-gold-500/20 text-gold-500 dark:text-gold-400 rotate-180" : "bg-black/5 dark:bg-white/10 text-navy-600 dark:text-text-secondary"
                    )}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
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
