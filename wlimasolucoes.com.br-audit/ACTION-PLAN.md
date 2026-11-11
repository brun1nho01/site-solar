# Plano de Ação Priorizado (SEO & SXO) — W. Lima Soluções

Este plano organiza as recomendações validadas pelo framework `PERCEIVE → ANALYZE → VALIDATE → ACT`, ordenadas por dependência técnica, impacto no posicionamento local e facilidade de execução no código Next.js existente.

---

## Fase 1: Correções de Alto Impacto no Código Local (Semana 1 — Quick Wins)

### 1.1 Otimizar `<title>`, `meta description` e abertura do Hero para busca local
- **Prioridade:** Alta
- **Arquivos afetados:** `app/layout.tsx`, `components/sections/HeroSection.tsx`, `app/privacidade/page.tsx`
- **Princípio (THINK):** A intenção de busca comercial de maior conversão para uma integradora solar é geográfica ("energia solar em Cambuci", "energia solar Noroeste Fluminense", "W. Lima Soluções"). Atualmente o `<title>` e o Hero não citam nenhuma cidade.
- **O que fazer:**
  1. Em `app/layout.tsx`, atualizar `metadata.title.default` e `openGraph.title` para:
     `"Energia Solar em Cambuci e Região, RJ | W. Lima Soluções"` (56 caracteres).
  2. Em `app/layout.tsx`, atualizar `metadata.description` para:
     `"Projetos e instalação de energia solar em Cambuci, Itaocara, São Fidélis, Pádua e região. Solicite uma análise personalizada à W. Lima Soluções."` (145 caracteres).
  3. Em `HeroSection.tsx`, ajustar o kicker ou a descrição de apoio para mencionar explicitamente o atendimento em **Cambuci e no interior do Rio de Janeiro**, mantendo o `<h1>` criativo (`"Não alugue sua energia. Seja dono dela."`).
  4. Em `app/privacidade/page.tsx`, expandir a `description` de 87 para ~138 caracteres:
     `"Saiba como a W. Lima Soluções trata os dados informados no formulário de análise solar e nos canais de atendimento, em conformidade com a LGPD."`
- **Desbloqueia (CONNECT):** Melhora imediata de relevância para termos locais no Google Search e maior taxa de clique (CTR) nos snippets orgânicos.
- **Critério de falsificabilidade (ACCEPT):** Se após o recrawl no Search Console o novo `<title>` não for exibido nas impressões para buscas de marca + cidade em 14 dias, verificar se o Google está reescrevendo o título a partir das âncoras internas.
- **Indicador de acompanhamento (GROW):** Impressões e cliques para consultas contendo `"cambuci"`, `"itaocara"`, `"são fidélis"` e `"w lima"` no relatório de Desempenho do Google Search Console.

---

### 1.2 Renderizar o conteúdo textual de Processo e Projetos no HTML inicial (Remover `ssr: false` do texto/imagens estáticas)
- **Prioridade:** Alta
- **Arquivos afetados:** `components/sections/deferred/LazyProcessSection.tsx`, `components/sections/deferred/LazyInstagramSection.tsx` (ou separação entre casca SSR e interatividade cliente)
- **Princípio (THINK):** O Googlebot e os crawlers de IA priorizam o conteúdo presente no HTML inicial. Hoje, usar `ssr: false` esconde as 5 etapas do processo e as 4 fotos reais de instalações sem ganho real de transferência inicial (já que o vídeo MP4 usa `preload="none"` e as imagens da galeria usam `loading="lazy"`).
- **O que fazer:**
  1. Permitir a renderização no servidor do texto das 5 etapas (`ProcessSection`) e dos cabeçalhos + grade de 4 imagens (`InstagramSection`), mantendo o carregamento do MP4 exclusivamente após o clique do usuário e as imagens abaixo da dobra com `loading="lazy"`.
  2. Incluir legendas visíveis curtas ou contexto nas 4 fotos da galeria (ex.: Escola Sonho de Criança, FAC Floresta) para reforçar sinais reais de E-E-A-T local.
- **Desbloqueia (CONNECT):** Eleva o conteúdo indexável da Home de ~475 para ~680+ palavras, indexa os `<h2>`/`<h3>` de "Do Projeto à Economia" e "Projetos e bastidores", e permite que as fotos de obras apareçam no Google Imagens.
- **Critério de falsificabilidade (ACCEPT):** Executar `render_page.py` após o ajuste; `js_gap.raw.words` deve subir para >650 palavras e `parse_html.py` deve listar os 5 `<h3>` das etapas e as 5 imagens no HTML bruto, sem aumentar o download inicial de mídia antes da rolagem.
- **Indicador de acompanhamento (GROW):** Texto completo visível na aba "HTML rastreado" da ferramenta Inspeção de URL do Search Console.

---

### 1.3 Enriquecer o Schema JSON-LD (`LocalBusiness` + `Electrician` + `VideoObject`)
- **Prioridade:** Média
- **Arquivo afetado:** `app/layout.tsx`
- **Princípio (THINK):** Dados estruturados específicos ajudam mecanismos de busca e motores de resposta de IA a desambiguar a entidade, localizar o endereço no mapa e indexar o vídeo de instalação.
- **O que fazer:**
  Atualizar o bloco JSON-LD em `app/layout.tsx` usando `@graph` (ou enriquecendo a entidade principal) com:
  - `@type: ["LocalBusiness", "Electrician"]`
  - `geo: { "@type": "GeoCoordinates", "latitude": -21.5762274, "longitude": -41.912293 }`
  - `hasMap: "https://maps.app.goo.gl/JbvTH7mcU1W2RpPz7"`
  - `priceRange: "$$"`
  - `VideoObject` descrevendo `/images/instalacao-w-lima.mp4` com `thumbnailUrl: "https://wlimasolucoes.com.br/images/instalacao-w-lima-poster-v2.jpg"`.
- **Critério de falsificabilidade (ACCEPT):** Validar com `parse_html.py` e no Teste de Pesquisa Aprimorada do Google com zero erros de sintaxe ou propriedades inválidas.

---

### 1.4 Adicionar link `tel:`, link para o Google Maps no rodapé e atualizar `sitemap.ts`
- **Prioridade:** Média
- **Arquivos afetados:** `components/sections/Footer.tsx`, `app/sitemap.ts`
- **O que fazer:**
  1. Em `Footer.tsx`, alterar o link do número `(22) 99961-8883` para `href={`tel:${siteConfig.company.phone.e164}`}` (mantendo os botões de WhatsApp dedicados no CTA superior e no botão flutuante) e adicionar um item `"Ver localização no Google Maps"` apontando para o Perfil da Empresa.
  2. Em `app/sitemap.ts`, atualizar `lastReviewed` para a data real da publicação atual e remover `changeFrequency` / `priority` (ou mantê-los sabendo que são ignorados pelo Google, mas garantindo `<lastmod>` fiel).

---

## Fase 2: SEO Local Off-Page & Ecossistema de Mapas/IA (Semanas 2–3)

### 2.1 Sincronização completa do Perfil da Empresa no Google (GBP)
- **Prioridade:** Alta
- **O que fazer no painel do Google Meu Negócio:**
  1. Confirmar que o campo **Website** do perfil `https://maps.app.goo.gl/JbvTH7mcU1W2RpPz7` aponta exatamente para `https://wlimasolucoes.com.br/` (com HTTPS e sem `www`).
  2. Verificar a **Categoria Principal** (ex.: *Fornecedor de equipamentos de energia solar* / *Serviço de energia solar*) e adicionar categorias secundárias relevantes (*Eletricista*, *Serviço de instalação elétrica*).
  3. Cadastrar na seção de **Área de cobertura** os municípios atendidos (Cambuci, Itaocara, São Fidélis, Aperibé, Santo Antônio de Pádua, Saquarema e Rio de Janeiro).
  4. Manter consistência exata do endereço: `Rua Virgilio Franklin, 915, Centro, Cambuci - RJ, 28430-586`.

### 2.2 Cadastro no Bing Places e Apple Business Connect
- **Prioridade:** Média
- **Princípio (THINK):** O ChatGPT Search e o Microsoft Copilot não leem o Google Meu Negócio diretamente; eles usam o índice do Bing e o **Bing Places**. Já a Siri, o Spotlight e o Apple Maps usam o **Apple Business Connect**.
- **O que fazer:** Importar o Perfil da Empresa do Google já verificado diretamente para o [Bing Places for Business](https://www.bingplaces.com/) (leva menos de 5 minutos usando a opção "Import from Google Business Profile") e reivindicar o local no [Apple Business Connect](https://businessconnect.apple.com/).

### 2.3 Cadência de Avaliações Reais no Google
- **Prioridade:** Média
- **O que fazer:** Solicitar avaliações aos clientes já atendidos (como os projetos exibidos na galeria), buscando superar o marco inicial de **10 avaliações com 4,5+ estrelas** e responder a 100% delas mencionando naturalmente o serviço e o município.

---

## Fase 3: Conteúdo Regional & SXO (Mês 2)

### 3.1 Bloco ou Páginas de Soluções por Perfil (Residencial, Rural/Agronegócio e Comercial)
- **Prioridade:** Média
- **Princípio (THINK):** No Noroeste Fluminense, a busca por energia solar para **propriedades rurais (irrigação, ordenha, sítios e fazendas em solo ou telhado)** e **comércios locais** é um diferencial competitivo forte.
- **O que fazer:** Adicionar uma seção indexável na Home (ou 3 páginas internas dedicadas quando houver conteúdo único >600 palavras para cada) detalhando como a W. Lima Soluções atende:
  - **Residências** (redução de fatura Enel RJ, telhados cerâmicos/metálicos/laje);
  - **Comércio e Indústria** (demanda diurna, retorno sobre investimento);
  - **Propriedades Rurais e Agronegócio** (usinas em solo ou galpão, robustez elétrica no interior do RJ).

---

## Fase 4: Monitoramento Contínuo (Ongoing)

1. **Google Search Console:** Verificar se o `sitemap.xml` enviado mudou para status **"Processado"** e acompanhar a indexação das 3 URLs em *Páginas*.
2. **Baseline de SEO (`seo-drift`):** O snapshot inicial (`baseline_id: 1`) já foi salvo localmente nesta auditoria. Após implementar as melhorias da Fase 1 e publicar na Netlify, execute `/seo drift compare https://wlimasolucoes.com.br/` para comprovar todas as melhorias de tags, cabeçalhos e estrutura.
