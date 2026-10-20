import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Termos de Uso",
  description: "Consulte as condições de uso do site, do formulário de atendimento e as responsabilidades aplicáveis ao visitante e à W. Lima Soluções.",
  path: "/termos",
});

const sectionClass = "mt-8 text-xl font-bold text-navy-950 dark:text-white";
const paragraphClass = "mt-3 leading-7 text-navy-700 dark:text-text-secondary";

export default function TermsOfUse() {
  return (
    <main id="conteudo-principal" tabIndex={-1} className="safe-inline min-h-screen scroll-mt-24 bg-slate-50 px-4 pb-12 pt-24 outline-none dark:bg-navy-950 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto glass break-words p-[32px] sm:p-[48px] rounded-3xl border border-navy-900/10 dark:border-white/10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-accent-copy font-bold hover:underline mb-8">
          Voltar para a Home
        </Link>
        <h1 className="text-3xl font-display font-bold text-navy-950 dark:text-white sm:text-4xl">Termos de Uso</h1>
        <div>
          <p className="mt-3 text-sm text-subtle-copy">Última atualização: Agosto de 2026</p>
          <p className={paragraphClass}>
            Bem-vindo ao site da W.Lima Soluções em Energia Solar. Ao acessar o site da W Lima Soluções, você concorda em cumprir estes Termos de Uso, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site.
          </p>
          <h2 className={sectionClass}>Formulário, análise e proposta</h2>
          <p className={paragraphClass}>
            A W Lima Soluções usa os dados informados pelo visitante para iniciar um atendimento pelo WhatsApp. O formulário não calcula nem apresenta consumo, geração, investimento, economia ou retorno e não constitui proposta comercial, orçamento, dimensionamento técnico ou garantia. A equipe apresentará o cenário aplicável depois de analisar a fatura, o imóvel, a localização, os equipamentos e as regras da unidade consumidora.
          </p>
          <h2 className={sectionClass}>Propriedade Intelectual e Uso do Site</h2>
          <p className={paragraphClass}>
            Todo o conteúdo presente neste site (textos, imagens, logotipos, vídeos e estrutura estrutural) é de propriedade exclusiva da W Lima Soluções e é protegido pelas leis de direitos autorais e marcas comerciais. É concedida permissão apenas para visualização pessoal e não comercial. Você não pode:
          </p>
          <ul className="mt-3 list-disc space-y-3 pl-6 leading-7 text-navy-700 dark:text-text-secondary">
            <li>Modificar, copiar ou reproduzir os materiais para uso por concorrentes;</li>
            <li>Usar os materiais para qualquer finalidade comercial sem autorização prévia;</li>
            <li>Tentar descompilar ou fazer engenharia reversa de qualquer código ou ferramenta contida no site;</li>
            <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais.</li>
          </ul>
          <h2 className={sectionClass}>Isenção de Responsabilidade e Limitações</h2>
          <p className={paragraphClass}>
            Os materiais no site da W Lima Soluções são fornecidos “como estão”. A W Lima Soluções não oferece garantias de que o site estará livre de interrupções ou erros. Em nenhum caso a W Lima Soluções será responsável por quaisquer danos diretos ou indiretos (incluindo perda de dados ou lucros) decorrentes do uso ou da incapacidade de usar os materiais do nosso site.
          </p>
          <h2 className={sectionClass}>Precisão dos Materiais</h2>
          <p className={paragraphClass}>
            Os materiais exibidos no site podem incluir erros técnicos, tipográficos ou fotográficos. A W Lima Soluções não garante que qualquer material em seu site seja 100% preciso, completo ou atual e pode fazer alterações no conteúdo a qualquer momento, sem aviso prévio.
          </p>
          <h2 className={sectionClass}>Links de Terceiros</h2>
          <p className={paragraphClass}>
            O nosso site pode conter links para sites de parceiros, fabricantes de equipamentos ou concessionárias de energia. A W Lima Soluções não analisou todos os sites vinculados e não é responsável pelo conteúdo deles. O uso de qualquer site vinculado é por conta e risco do usuário.
          </p>
          <h2 className={sectionClass}>Modificações</h2>
          <p className={paragraphClass}>
            A W Lima Soluções pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão mais atual destes termos.
          </p>
          <h2 className={sectionClass}>Lei Aplicável e Foro</h2>
          <p className={paragraphClass}>
            Estes termos e condições são regidos e interpretados de acordo com as leis da República Federativa do Brasil. Fica eleito o foro da comarca de Cambuci/RJ para dirimir quaisquer dúvidas ou controvérsias oriundas deste documento, com renúncia a qualquer outro, por mais privilegiado que seja.
          </p>
        </div>
      </article>
    </main>
  );
}
