import { Lightning, CheckCircle, ChatCircleDots } from "@phosphor-icons/react/ssr";
import MagneticButton from "@/components/ui/MagneticButton";
import { createWhatsAppUrl, siteConfig } from "@/lib/site-config";
import { CookiePreferencesButton } from "@/components/ui/CookiePreferencesButton";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="relative border-t border-navy-900/10 dark:border-white/10 overflow-hidden bg-white dark:bg-navy-950">

      {/* ── CTA Final de Alto Impacto (Awwwards Style) ── */}
      <div className="relative py-20 lg:py-28 bg-slate-50 dark:bg-navy-950">

        {/* Glow fotovoltaico no fundo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 dark:bg-navy-900/60 backdrop-blur-2xl rounded-3xl p-8 sm:p-14 lg:p-16 flex flex-col items-center text-center border border-navy-900/10 dark:border-white/10 shadow-2xl relative overflow-hidden">

            {/* Headline Gigante de Encerramento */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold mb-6 text-balance text-navy-950 dark:text-white leading-[1.1] max-w-4xl">
              Descubra se a Energia Solar <span className="text-gold-500 dark:text-gold-400">Faz Sentido</span> para o Seu Imóvel.
            </h2>

            <p className="text-navy-600 dark:text-text-secondary text-base sm:text-xl max-w-2xl mb-8 leading-relaxed">
              Faça uma simulação inicial e converse com a equipe para confirmar viabilidade, dimensionamento e condições do projeto.
            </p>

            {/* Botão Magnético de Ação Principal */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton>
                <a
                  href="#simulador"
                  className="flex items-center justify-center gap-3 px-9 py-4 font-bold text-navy-950 text-base sm:text-lg rounded-2xl bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 shadow-[0_10px_30px_rgba(242,205,66,0.3)] transition-all duration-300 group cursor-pointer"
                >
                  <Lightning weight="fill" className="w-5 h-5 text-navy-950" />
                  <span>Simular Minha Economia Agora</span>
                </a>
              </MagneticButton>

              <a
                href={createWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-7 py-4 font-bold text-navy-950 dark:text-white text-base rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-navy-900/10 dark:border-white/10 transition-colors"
              >
                <ChatCircleDots weight="bold" className="w-5 h-5 text-emerald-500" />
                <span>Falar no WhatsApp</span>
              </a>
            </div>

            <ul className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs font-mono text-navy-500 dark:text-text-muted">
              <li className="flex items-center gap-1.5">
                <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500" /> Simulação 100% Gratuita
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500" /> Sem Compromisso
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500" /> Garantias Informadas na Proposta
              </li>
            </ul>

          </div>
        </div>
      </div>

      {/* ── Dados da empresa + Links legais ── */}
      <div className="border-t border-navy-900/10 dark:border-white/10 py-10 bg-slate-100 dark:bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-sm text-navy-600 dark:text-text-muted">
            {/* Coluna 1: Empresa */}
            <div>
              <p className="font-display font-bold text-navy-950 dark:text-white mb-2 text-base">{siteConfig.company.displayName}</p>
              <p>{siteConfig.company.legalName}</p>
              <p>CNPJ: {siteConfig.company.taxId}</p>
              <p>{siteConfig.company.address.street}, {siteConfig.company.address.number}</p>
              <p>{siteConfig.company.address.district}</p>
              <p>{siteConfig.company.address.city} — {siteConfig.company.address.state}, CEP {siteConfig.company.address.postalCode}</p>
            </div>

            {/* Coluna 2: Links Legais */}
            <div>
              <p className="font-display font-bold text-navy-950 dark:text-white mb-2 text-base">Legal</p>
              <ul className="space-y-1.5">
                <li>
                  <a href="/privacidade" className="inline-flex min-h-11 items-center text-navy-400 transition-colors hover:text-gold-500 dark:text-text-muted">
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a href="/termos" className="inline-flex min-h-11 items-center text-navy-400 transition-colors hover:text-gold-500 dark:text-text-muted">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <CookiePreferencesButton />
                </li>
                <li>
                  <span className="text-navy-400 dark:text-text-muted cursor-default">
                    Homologação Concessionária
                  </span>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Contato */}
            <div>
              <p className="font-display font-bold text-navy-950 dark:text-white mb-2 text-base">Atendimento</p>
              <ul className="space-y-1.5">
                <li>
                  <a href={createWhatsAppUrl()} className="inline-flex min-h-11 items-center font-mono transition-colors hover:text-gold-500">
                    {siteConfig.company.phone.display}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${siteConfig.company.email}`} className="inline-flex min-h-11 items-center font-mono transition-colors hover:text-gold-500">
                    {siteConfig.company.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-10 pt-6 border-t border-navy-900/10 dark:border-white/10 text-center text-xs text-navy-500 dark:text-text-muted flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© {year || 2025} {siteConfig.company.displayName}. Todos os direitos reservados.</p>
            <p className="font-mono text-[11px]">Engenharia Solar de Alto Padrão no Rio de Janeiro</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
