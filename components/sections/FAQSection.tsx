import { CaretDown as ChevronDown } from "@phosphor-icons/react/ssr";

const FAQS = [
  {
    question: "O sistema funciona em dias nublados ou chuvosos?",
    answer: "Sim! Os painéis solares modernos captam a luminosidade, não apenas a luz direta do sol. Embora a geração seja menor em dias nublados, o sistema continuará produzindo energia e você se beneficia do sistema de créditos da concessionária.",
  },
  {
    question: "A energia solar zera a minha conta de luz?",
    answer: "Não é possível garantir conta zerada. A economia depende do consumo, da geração, do dimensionamento, das regras de compensação e das cobranças que continuam aplicáveis, como disponibilidade da rede e iluminação pública.",
  },
  {
    question: "Qual é a vida útil de um sistema fotovoltaico?",
    answer: "Painéis fotovoltaicos são projetados para operação de longo prazo. Vida útil, garantia de produto e garantia de desempenho variam conforme fabricante e modelo e são informadas na proposta comercial.",
  },
  {
    question: "Preciso de manutenção constante?",
    answer: "A necessidade de limpeza e inspeção depende do local, da sujeira acumulada e das recomendações dos fabricantes. O plano adequado é definido para cada instalação.",
  },
  {
    question: "O investimento se paga em quanto tempo?",
    answer: "O prazo de retorno depende do preço do sistema, forma de pagamento, consumo, tarifa, geração e manutenção. A simulação do site é apenas uma referência inicial; o cenário completo é apresentado depois da análise técnica.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="relative overflow-hidden border-t border-navy-900/10 py-24 dark:border-white/10">
      <div className="safe-inline relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-24">
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24">
              <h2 className="mb-4 text-balance font-display text-3xl font-bold text-navy-950 dark:text-white sm:text-4xl">
          Dúvidas <span className="text-accent-copy">Frequentes</span>
              </h2>
              <p className="mb-8 text-lg text-navy-600 dark:text-text-secondary">
                Tudo o que você precisa saber antes de investir no seu futuro, explicado de forma clara.
              </p>
            </div>
          </div>

          <div className="w-full space-y-4 lg:w-2/3">
            {FAQS.map((faq, index) => (
              <details
                key={faq.question}
                name="duvidas-energia-solar"
                open={index === 0}
                className="group overflow-hidden rounded-2xl border border-navy-900/5 bg-white/60 transition-colors open:border-gold-500/30 open:bg-white/80 open:shadow-[0_0_20px_rgba(242,205,66,0.1)] hover:border-gold-500/20 dark:border-white/5 dark:bg-white/[0.03] dark:open:bg-navy-900/60"
              >
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-left focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-400 sm:px-6 [&::-webkit-details-marker]:hidden">
                <span className="text-lg font-bold text-navy-950 transition-colors group-open:text-accent-copy dark:text-white">
                    {faq.question}
                  </span>
                <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/5 text-navy-600 transition-all duration-300 group-open:rotate-180 group-open:bg-gold-500/20 group-open:text-accent-copy dark:bg-white/10 dark:text-text-secondary">
                    <ChevronDown className="h-5 w-5" />
                  </span>
                </summary>
                <p className="px-6 pb-5 leading-relaxed text-navy-600 dark:text-text-secondary">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
