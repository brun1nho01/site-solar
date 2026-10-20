import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Política de Privacidade",
  description: "Saiba como a W. Lima Soluções trata os dados do formulário e dos canais de atendimento.",
  path: "/privacidade",
});

const sectionClass = "mt-8 text-xl font-bold text-navy-950 dark:text-white";
const paragraphClass = "mt-3 leading-7 text-navy-700 dark:text-text-secondary";

export default function PrivacyPolicy() {
  return (
    <main id="conteudo-principal" tabIndex={-1} className="safe-inline min-h-screen scroll-mt-24 bg-slate-50 px-4 pb-16 pt-28 outline-none dark:bg-navy-950 sm:px-6">
      <article className="glass mx-auto max-w-3xl rounded-3xl border border-navy-900/10 p-7 dark:border-white/10 sm:p-12">
        <Link href="/" className="inline-flex text-sm font-bold text-accent-copy hover:underline">
          Voltar para o início
        </Link>

        <h1 className="mt-8 text-3xl font-display font-bold text-navy-950 dark:text-white sm:text-4xl">
          Política de Privacidade
        </h1>
        <p className="mt-3 text-sm text-subtle-copy">Última atualização: 31 de agosto de 2026.</p>

        <p className={paragraphClass}>
          Esta política explica como a {siteConfig.company.legalName}, CNPJ {siteConfig.company.taxId}, trata dados pessoais durante o uso deste site e no atendimento solicitado pelo visitante.
        </p>

        <h2 className={sectionClass}>1. Quem controla os dados</h2>
        <p className={paragraphClass}>
          A controladora é a {siteConfig.company.legalName}, com sede em {siteConfig.company.address.street}, {siteConfig.company.address.number}, {siteConfig.company.address.district}, {siteConfig.company.address.city}/{siteConfig.company.address.state}. Dúvidas e solicitações podem ser enviadas para{" "}
          <a href={`mailto:${siteConfig.company.email}`} className="font-semibold text-accent-copy hover:underline">{siteConfig.company.email}</a>.
        </p>

        <h2 className={sectionClass}>2. Dados usados no formulário</h2>
        <p className={paragraphClass}>
          O formulário pode usar nome, valor da conta de energia, consumo em kWh quando informado, CEP, tipo de imóvel, local de instalação, tipo de telhado e interesse em financiamento. O site não calcula nem exibe orçamento automático e não grava esse formulário em um banco de dados próprio.
        </p>

        <h2 className={sectionClass}>3. Contato pelo WhatsApp</h2>
        <p className={paragraphClass}>
          Ao enviar o formulário, o site prepara uma mensagem e abre o WhatsApp. Os dados aparecem no endereço de compartilhamento e só são recebidos pela W. Lima Soluções depois que você revisa e envia a mensagem. A partir desse envio, o tratamento também segue os termos e a política da Meta/WhatsApp.
        </p>

        <h2 className={sectionClass}>4. Serviços necessários ao funcionamento</h2>
        <ul className="mt-3 list-disc space-y-3 pl-6 leading-7 text-navy-700 dark:text-text-secondary">
          <li><strong>OpenStreetMap:</strong> fornece os blocos visuais do mapa e pode receber dados técnicos da conexão, como endereço IP e informações do navegador.</li>
          <li><strong>Links externos:</strong> Instagram e WhatsApp passam a tratar dados quando seus respectivos links são abertos.</li>
        </ul>

        <h2 className={sectionClass}>5. Cookies e medição de acesso</h2>
        <p className={paragraphClass}>
          O Google Analytics só é carregado depois que você aceita cookies analíticos. Se você recusar, a ferramenta não é carregada. A escolha fica salva no armazenamento local do navegador e pode ser revista em “Preferências de cookies”, no rodapé do site.
        </p>

        <h2 className={sectionClass}>6. Finalidades e bases legais</h2>
        <p className={paragraphClass}>
          Os dados enviados são usados para responder ao pedido, preparar uma proposta e realizar procedimentos preliminares à eventual contratação. A medição analítica depende do seu consentimento. O formulário não constitui proposta comercial, orçamento ou dimensionamento técnico.
        </p>

        <h2 className={sectionClass}>7. Retenção, compartilhamento e segurança</h2>
        <p className={paragraphClass}>
          Conversas e dados de atendimento são mantidos apenas pelo período necessário para responder à solicitação, cumprir obrigações contratuais ou legais e proteger direitos. O compartilhamento ocorre com os serviços descritos nesta política, quando necessário ao atendimento ou por obrigação legal. Adotamos medidas razoáveis para reduzir riscos de acesso, alteração ou divulgação indevidos.
        </p>

        <h2 className={sectionClass}>8. Seus direitos</h2>
        <p className={paragraphClass}>
          Nos termos da LGPD, você pode solicitar confirmação de tratamento, acesso, correção, informação sobre compartilhamento, portabilidade quando aplicável, anonimização, bloqueio ou eliminação nos casos previstos em lei, além de revogar consentimentos. Envie o pedido para{" "}
          <a href={`mailto:${siteConfig.company.email}`} className="font-semibold text-accent-copy hover:underline">{siteConfig.company.email}</a>. Podemos pedir informações para confirmar a identidade do solicitante.
        </p>

        <h2 className={sectionClass}>9. Alterações desta política</h2>
        <p className={paragraphClass}>
          Esta política pode ser atualizada para refletir mudanças no site ou no tratamento de dados. A data da versão mais recente será sempre indicada no início desta página.
        </p>
      </article>
    </main>
  );
}
