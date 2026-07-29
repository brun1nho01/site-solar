import Link from "next/link";

export const metadata = {
  title: "Termos de Uso | W.Lima Soluções",
};

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto glass p-8 sm:p-12 rounded-3xl border border-navy-900/10 dark:border-white/10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gold-500 font-bold hover:underline mb-8">
          Voltar para a Home
        </Link>
        <h1 className="text-3xl font-display font-bold text-navy-950 dark:text-white mb-6">Termos de Uso</h1>
        <div className="prose dark:prose-invert prose-navy max-w-none text-navy-700 dark:text-text-secondary">
          <p>Última atualização: Julho de 2026</p>
          <p>
            Bem-vindo ao site da W.Lima Soluções em Energia Solar. Ao acessar nosso site, você concorda com estes termos de uso.
          </p>
          <h2>Simulador de Economia</h2>
          <p>
            Os valores apresentados no simulador de economia são estimativas baseadas em médias regionais de incidência solar e tarifas das concessionárias atuais. O resultado final da sua economia e do tempo de retorno (payback) pode variar após a análise técnica e fatores locais.
          </p>
          <h2>Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo presente neste site (textos, imagens, logotipos) é de propriedade da W.Lima Soluções, sendo vedada a reprodução sem autorização expressa.
          </p>
        </div>
      </div>
    </div>
  );
}
