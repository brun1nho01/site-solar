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
          <p>Última atualização: Agosto de 2026</p>
          <p>
            Bem-vindo ao site da W.Lima Soluções em Energia Solar. Ao acessar o site da W Lima Soluções, você concorda em cumprir estes Termos de Uso, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site.
          </p>
          <h2>Simulações, Orçamentos e Estimativas</h2>
          <p>
            A W Lima Soluções usa os dados informados pelo visitante para apresentar uma referência inicial de consumo, geração, investimento, economia e retorno simples. A simulação não constitui proposta comercial, orçamento, dimensionamento técnico ou garantia de geração e economia. A equipe confirmará o cenário após analisar a fatura, o imóvel, a localização, os equipamentos e as regras aplicáveis à unidade consumidora.
          </p>
          <h2>Premissas do Simulador Solar</h2>
          <p>
            O visitante pode informar o valor mensal da conta ou o consumo médio em kWh. No primeiro modo, o simulador estima uma faixa de consumo usando a referência comercial de que R$ 500 por mês correspondem a cerca de 390 a 490 kWh por mês. No modo por consumo, o simulador estima uma conta equivalente pela mesma referência tarifária. O simulador usa uma entrada por vez, acrescenta uma margem de 15% e ajusta a geração para o próximo bloco de 100 kWh por mês.
          </p>
          <p>
            A faixa de investimento usa os preços comerciais fornecidos pela empresa para gerações entre 600 e 1.000 kWh por mês. Portes fora dessa faixa exigem orçamento. A potência do sistema em kWp depende da irradiação, orientação, inclinação, sombreamento, perdas e demais condições do projeto.
          </p>
          <p>
            A economia considera uma conta residual típica entre R$ 50 e R$ 100 por mês, degradação de 0,5% ao ano, horizonte de 25 anos e reajuste tarifário de 0%. Iluminação pública, disponibilidade da rede, impostos, demanda contratada, manutenção, seguro, troca de equipamentos e outras cobranças podem alterar o resultado.
          </p>
          <p>
            O retorno exibido representa um payback simples para pagamento à vista. O site não calcula financiamento sem entrada, prazo, taxa, parcelas e Custo Efetivo Total (CET) definidos em proposta.
          </p>
          <h2>Propriedade Intelectual e Uso do Site</h2>
          <p>
            Todo o conteúdo presente neste site (textos, imagens, logotipos, vídeos e estrutura estrutural) é de propriedade exclusiva da W Lima Soluções e é protegido pelas leis de direitos autorais e marcas comerciais. É concedida permissão apenas para visualização pessoal e não comercial. Você não pode:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Modificar, copiar ou reproduzir os materiais para uso por concorrentes;</li>
            <li>Usar os materiais para qualquer finalidade comercial sem autorização prévia;</li>
            <li>Tentar descompilar ou fazer engenharia reversa de qualquer código ou ferramenta contida no site;</li>
            <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais.</li>
          </ul>
          <h2>Isenção de Responsabilidade e Limitações</h2>
          <p>
            Os materiais no site da W Lima Soluções são fornecidos “como estão”. A W Lima Soluções não oferece garantias de que o site estará livre de interrupções ou erros. Em nenhum caso a W Lima Soluções será responsável por quaisquer danos diretos ou indiretos (incluindo perda de dados ou lucros) decorrentes do uso ou da incapacidade de usar os materiais do nosso site.
          </p>
          <h2>Precisão dos Materiais</h2>
          <p>
            Os materiais exibidos no site podem incluir erros técnicos, tipográficos ou fotográficos. A W Lima Soluções não garante que qualquer material em seu site seja 100% preciso, completo ou atual e pode fazer alterações no conteúdo a qualquer momento, sem aviso prévio.
          </p>
          <h2>Links de Terceiros</h2>
          <p>
            O nosso site pode conter links para sites de parceiros, fabricantes de equipamentos ou concessionárias de energia. A W Lima Soluções não analisou todos os sites vinculados e não é responsável pelo conteúdo deles. O uso de qualquer site vinculado é por conta e risco do usuário.
          </p>
          <h2>Modificações</h2>
          <p>
            A W Lima Soluções pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão mais atual destes termos.
          </p>
          <h2>Lei Aplicável e Foro</h2>
          <p>
            Estes termos e condições são regidos e interpretados de acordo com as leis da República Federativa do Brasil. Fica eleito o foro da comarca de Cambuci/RJ para dirimir quaisquer dúvidas ou controvérsias oriundas deste documento, com renúncia a qualquer outro, por mais privilegiado que seja.
          </p>
        </div>
      </div>
    </div>
  );
}
