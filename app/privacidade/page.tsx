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
            A sua privacidade é importante para nós. É política da W Lima Soluções respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site W Lima Soluções, e outros sites que possuímos e operamos.
          </p>
          <h2>1. Quais dados coletamos e por que</h2>
          <p>
            Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço (como simulações e orçamentos de sistemas de energia solar). Coletamos dados como nome, e-mail, telefone e, quando necessário para o orçamento, informações sobre o seu consumo de energia. Fazemos isso por meios justos e legais, com o seu conhecimento e consentimento.
          </p>
          <h2>2. Retenção e Segurança dos Dados</h2>
          <p>
            Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado ou para contato comercial. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados. Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei ou com parceiros estritamente necessários para a execução do projeto solar.
          </p>
          <h2>3. Uso de Google Analytics</h2>
          <p>
            Nosso site utiliza o Google Analytics, um serviço de análise web, para entender como os usuários interagem com nossa página. O Google Analytics usa "cookies" (arquivos de texto) para avaliar o uso do site de forma anônima. Você é livre para recusar a nossa solicitação de cookies analíticos através do nosso banner de preferências ao acessar o site.
          </p>
          <h2>4. Links Externos</h2>
          <p>
            O nosso site pode ter links para sites externos (como concessionárias de energia ou fabricantes) que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.
          </p>
          <h2>5. Seus Direitos (LGPD)</h2>
          <p>
            Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de solicitar o acesso, a correção ou a exclusão dos seus dados pessoais dos nossos bancos de dados a qualquer momento. Para exercer seus direitos ou tirar dúvidas sobre como lidamos com seus dados, entre em contato através do e-mail: [INSERIR SEU E-MAIL DE CONTATO AQUI].
          </p>
          <h2>Compromisso do Usuário</h2>
          <p>
            O usuário se compromete a fazer uso adequado dos conteúdos e da informação que a W Lima Soluções oferece no site e com caráter enunciativo, mas não limitativo:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>A) Não se envolver em atividades que sejam ilegais ou contrárias à boa fé e à ordem pública;</li>
            <li>B) Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;</li>
            <li>C) Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) da W Lima Soluções, de seus fornecedores ou terceiros.</li>
          </ul>
          <p>
            O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais.
          </p>
        </div>
      </div>
    </div>
  );
}
