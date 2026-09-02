import { MouseGlowCard } from "@/components/ui/MouseGlowCard";
import { ShieldCheck, Lightning, Users, DeviceMobile, Certificate } from "@phosphor-icons/react/ssr";

export default function QualitySection() {
  return (
    <section id="qualidade" className="relative py-20 lg:py-28 overflow-hidden bg-slate-50 dark:bg-navy-950">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header da seção ── */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-balance text-navy-950 dark:text-white">
            Por que escolher a{" "}
            <span> W <span className="text-gold-500 dark:text-gold-400">Lima </span> Soluções?</span>
          </h2>
          <p className="text-navy-600 dark:text-text-secondary text-lg max-w-2xl">
            Entregamos projetos de energia solar com excelência, desde o dimensionamento até a instalação, focando na sua tranquilidade e economia real.
          </p>
        </div>

        {/* ── Grid de Diferenciais de Engenharia (Opção 1 — Minimalista e Elegante) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:auto-rows-fr">

          {/* Card principal: garantias e especificações da proposta */}
          <MouseGlowCard
            className="sm:col-span-2 lg:col-span-2 sm:row-span-2 rounded-3xl overflow-hidden glass bg-white/40 dark:bg-transparent flex flex-col border border-navy-900/10 dark:border-white/10 transition-colors duration-500 hover:border-gold-500/30 relative p-8 sm:p-10"
          >
            <div className="relative flex flex-col h-full justify-between z-10">

              <div>
                <div className="w-14 h-14 rounded-2xl bg-gold-500/10 text-gold-500 dark:text-gold-400 flex items-center justify-center mb-6 border border-gold-500/20">
                  <ShieldCheck weight="fill" className="w-7 h-7" />
                </div>

                <h3 className="font-display font-bold text-3xl sm:text-4xl text-navy-950 dark:text-white mb-4 leading-tight">
                  Garantias Claras na Proposta
                </h3>
                <p className="text-navy-600 dark:text-text-secondary text-base sm:text-lg leading-relaxed max-w-md mb-8">
                  Cada projeto informa fabricante, modelo, cobertura e prazo das garantias dos equipamentos selecionados, sem transformar estimativas em promessa.
                </p>
              </div>

              {/* Critérios técnicos informados na proposta */}
              <div className="mt-auto pt-6 border-t border-navy-900/10 dark:border-white/10 flex items-center gap-4">
                <Certificate weight="fill" className="w-8 h-8 text-gold-500 dark:text-gold-400 shrink-0" />
                <div>
                  <p className="font-display font-bold text-navy-950 dark:text-white text-sm uppercase tracking-wider">Equipamentos regularizados</p>
                  <p className="text-xs text-navy-500 dark:text-text-muted">Especificações e registros aplicáveis conferidos antes da contratação</p>
                </div>
              </div>

            </div>
          </MouseGlowCard>

          {/* Card 2: Dimensionamento sob Medida */}
          <MouseGlowCard className="rounded-3xl p-6 sm:p-8 flex flex-col justify-between glass group border border-navy-900/10 dark:border-white/10 transition-colors duration-500 hover:border-gold-500/30 bg-white/40 dark:bg-transparent">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-500 dark:text-gold-400 flex items-center justify-center mb-6 border border-gold-500/20">
                <Lightning weight="duotone" className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-navy-950 dark:text-white mb-3">Dimensionamento sob Medida</h3>
              <p className="text-sm text-navy-600 dark:text-text-secondary leading-relaxed">
                Projeto calculado estritamente para o seu histórico de consumo, sem sobredimensionar para inflar o valor final.
              </p>
            </div>
          </MouseGlowCard>

          {/* Card 3: acompanhamento técnico */}
          <MouseGlowCard className="rounded-3xl p-6 sm:p-8 flex flex-col justify-between glass group border border-navy-900/10 dark:border-white/10 transition-colors duration-500 hover:border-gold-500/30 bg-white/40 dark:bg-transparent">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-500 dark:text-gold-400 flex items-center justify-center mb-6 border border-gold-500/20">
                <Users weight="duotone" className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-navy-950 dark:text-white mb-3">Acompanhamento Técnico</h3>
              <p className="text-sm text-navy-600 dark:text-text-secondary leading-relaxed">
                Responsabilidades, profissionais envolvidos e documentação técnica são definidos conforme as características e o escopo de cada obra.
              </p>
            </div>
          </MouseGlowCard>

          {/* Card Largo: Monitoramento e Suporte Local (2 colunas) */}
          <MouseGlowCard className="sm:col-span-2 lg:col-span-2 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 glass group border border-navy-900/10 dark:border-white/10 transition-colors duration-500 hover:border-gold-500/30 bg-white/40 dark:bg-transparent">
            <div className="w-14 h-14 rounded-2xl bg-gold-500/10 text-gold-500 dark:text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/20">
              <DeviceMobile weight="duotone" className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-navy-950 dark:text-white mb-2">Monitoramento e Suporte Local</h3>
              <p className="text-sm text-navy-600 dark:text-text-secondary leading-relaxed">
                Quando o equipamento selecionado oferece essa função, a produção pode ser acompanhada por aplicativo. O suporte parte de Cambuci e atende a região conforme disponibilidade.
              </p>
            </div>
          </MouseGlowCard>

        </div>
      </div>
    </section >
  );
}
