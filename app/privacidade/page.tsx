import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade | W.Lima Soluções",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto glass p-8 sm:p-12 rounded-3xl border border-navy-900/10 dark:border-white/10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gold-500 font-bold hover:underline mb-8">
          Voltar para a Home
        </Link>
        <h1 className="text-3xl font-display font-bold text-navy-950 dark:text-white mb-6">Política de Privacidade</h1>
        <div className="prose dark:prose-invert prose-navy max-w-none text-navy-700 dark:text-text-secondary">
          <p>Última atualização: Julho de 2026</p>
          <p>
            A W.Lima Soluções em Energia Solar valoriza a sua privacidade. Esta política descreve como os seus dados pessoais são coletados, utilizados e protegidos ao utilizar nossos serviços e nosso site.
          </p>
          <h2>1. Coleta de Dados</h2>
          <p>
            Coletamos apenas os dados essenciais para fornecer a simulação de economia e orçamento (Nome, CEP, Consumo de energia).
          </p>
          <h2>2. Uso dos Dados</h2>
          <p>
            Os dados fornecidos são utilizados exclusivamente para entrar em contato com você via WhatsApp, telefone ou e-mail com a finalidade de fornecer a proposta técnica solicitada.
          </p>
          <h2>3. Segurança</h2>
          <p>
            Implementamos medidas técnicas para proteger seus dados contra acesso não autorizado. Não vendemos ou compartilhamos seus dados com terceiros para fins de marketing.
          </p>
        </div>
      </div>
    </div>
  );
}
