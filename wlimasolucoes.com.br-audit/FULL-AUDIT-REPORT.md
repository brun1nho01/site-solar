# Relatório Completo de Auditoria SEO — W. Lima Soluções (`wlimasolucoes.com.br`)

**Data da auditoria:** 10/11/2026  
**URL auditada:** `https://wlimasolucoes.com.br/`  
**Tipo de negócio detectado:** Serviço Local Híbrido (*Sede física em Cambuci/RJ + Área de atendimento regional no Noroeste/Norte Fluminense e RJ*)  
**Baseline de Drift capturado:** Snapshot `#1` (`html_hash: 3238883ee6b3...`)

> **Nota de escopo e transparência (Google Search Central):** As pontuações abaixo são heurísticas estruturadas da suíte `claude-seo` baseadas nas diretrizes públicas do Google (atualizadas até novembro de 2026) e nos sinais reais coletados do site em produção. Nenhuma ferramenta externa tem acesso aos pesos internos do algoritmo do Google ou garante posições específicas na SERP.

---

## 1. Resumo Executivo

### Pontuação Geral de Saúde SEO (SEO Health Score): **76 / 100**
### Pontuação SXO (Alinhamento com a Experiência de Busca Local): **68 / 100**
### Pontuação de Acessibilidade para Agentes (Agent-UX): **100 / 100**

| Categoria | Peso | Nota | Status | Resumo |
| :--- | :---: | :---: | :---: | :--- |
| **Technical SEO** | 22% | **88/100** | ✅ Bom | HTTPS/TLS 1.3 perfeito, redirects 301 limpos, `robots.txt` e `sitemap.xml` válidos; penalizado apenas pelo uso de `ssr: false` em 3 seções da Home. |
| **Content Quality (E-E-A-T)** | 23% | **66/100** | ⚠️ Atenção | Excelente transparência jurídica/empresarial (CNPJ, endereço, ausência de falsas promessas), mas HTML inicial tem apenas ~475 palavras por ocultar Processo e Projetos via JS. |
| **On-Page SEO** | 20% | **72/100** | ⚠️ Atenção | Hierarquia H1–H3 sem saltos e Open Graph completo, mas `<title>` e `<h1>` da Home não mencionam **Cambuci** nem a região de atendimento. |
| **Schema / Dados Estruturados** | 10% | **78/100** | ✅ Bom | `LocalBusiness` válido no HTML inicial com endereço 915 e `areaServed`, mas sem subtipo específico (`Electrician`), `geo`, `openingHoursSpecification`, `hasMap` e `VideoObject`. |
| **Performance (CWV)** | 10% | **82/100** | ✅ Bom | Abertura super leve (~0,40 MB), fontes locais com `swap`, vídeo sob clique e layout estável; falta apenas `fetchpriority="high"` explícito no `<img>` LCP e otimização do PNG original. |
| **AI Search Readiness (GEO + Agentic)** | 10% | **74/100** | ✅ Bom | Árvore de acessibilidade nota 100/100 e crawlers de IA liberados; faltam bloco definicional local no topo da página e citações externas (Bing Places / Apple Maps). |
| **Images** | 5% | **82/100** | ✅ Bom | Imagem Hero servida em WebP com `srcset` e dimensões; porém as 4 fotos reais de obras estão ocultas do HTML inicial (`ssr: false`) e há ativos órfãos em `public/images/`. |

---

### Top 5 Problemas Prioritários (Gargalos Reais)

1. **[Alta — Técnico & Conteúdo] Seções principais invisíveis no HTML inicial (`ssr: false`):** `LazyContactSection`, `LazyProcessSection` e `LazyInstagramSection` usam `next/dynamic(..., { ssr: false })` acoplado a `IntersectionObserver`. Como resultado, o HTML bruto servido ao Googlebot e aos crawlers de IA tem apenas **466–578 palavras** e **1 única imagem**, omitindo completamente o texto das 5 etapas ("Do Projeto à Economia") e as 4 fotos reais de instalações ("Projetos e bastidores").
2. **[Alta — On-Page & SEO Local] `<title>`, `meta description` e abertura sem localização geográfica:** O título atual (`Energia Solar para Residências e Empresas | W. Lima Soluções`) não contém "Cambuci", "Noroeste Fluminense" ou "RJ". Em buscas locais (onde 46% das pesquisas têm intenção geográfica), omitir a cidade-sede no `<title>` reduz drasticamente a relevância para quem busca instaladores na região.
3. **[Alta — SXO & SEO Local] Página única sem páginas ou blocos dedicados por vertical (Residencial, Rural/Agronegócio e Comercial):** A SERP regional para energia solar em Cambuci/Noroeste Fluminense destaca fortemente aplicações no **agronegócio/propriedades rurais**, **homologação junto à Enel RJ** e **sistemas residenciais/comerciais**. Embora o formulário tenha a opção "Agronegócio" e "Solo", o texto indexável da página quase não aborda essas demandas.
4. **[Média — Schema] `LocalBusiness` genérico e ausência de `VideoObject`:** O JSON-LD atual não especifica `geo` (latitude/longitude com 5+ casas decimais), `openingHoursSpecification`, `hasMap` (link para o Perfil da Empresa no Google Maps) nem marca o vídeo próprio de instalação (`instalacao-w-lima.mp4`) com `VideoObject`.
5. **[Média — On-Page & Conversão Local] Telefone no rodapé sem link `tel:` e ausência de link para o Perfil da Empresa no Google Maps:** No rodapé (`Footer.tsx`), o telefone `(22) 99961-8883` abre `wa.me` em vez de `tel:+5522999618883` (click-to-call nativo), e não há link para o perfil existente no Google Maps (`https://maps.app.goo.gl/JbvTH7mcU1W2RpPz7`).

---

### Top 5 Ganhos Rápidos (Quick Wins)

1. **Incluir "Cambuci e Região, RJ" no `<title>` e na `meta description` da Home** em `app/layout.tsx` (ex.: `Energia Solar em Cambuci e Região, RJ | W. Lima Soluções`).
2. **Permitir SSR do conteúdo textual e das imagens da galeria** em `ProcessSection` e `InstagramSection` (mantendo o vídeo MP4 e os modais interativos carregados apenas sob clique). Isso eleva imediatamente o HTML inicial de ~475 para ~680+ palavras e expõe as 4 fotos reais de obras ao Google Imagens.
3. **Completar o JSON-LD em `app/layout.tsx`** adicionando `@type: ["LocalBusiness", "Electrician"]`, `geo` (`-21.57623, -41.91229`), `hasMap`, `priceRange` e um bloco `VideoObject` para o vídeo de instalação.
4. **Converter o telefone do rodapé para `href="tel:+5522999618883"`** e adicionar link "Ver no Google Maps" no rodapé (`Footer.tsx`).
5. **Atualizar `lastModified` em `app/sitemap.ts`** (atualmente travado em `2026-09-01`) e ampliar a `meta description` de `/privacidade` (atualmente com 87 caracteres, abaixo do piso recomendado de 120).

---

## 2. Auditoria por Especialidade

### 2.1 SEO Técnico (`seo-technical` & `seo-sitemap`) — **88 / 100**

#### O que já funciona muito bem:
- **Transporte e HTTPS (`transport_check.py`):** TLSv1.3 ativo (`TLS_AES_128_GCM_SHA256`), certificado Let's Encrypt válido (76 dias restantes, expira em 26/01/2027), cobrindo `wlimasolucoes.com.br` e `www.wlimasolucoes.com.br`.
- **Redirecionamentos e Canonicalização:** `http://wlimasolucoes.com.br/` redireciona com `301` em 1 salto para `https://wlimasolucoes.com.br/`. O subdomínio `www` resolve sem erro TLS e consolida na raiz sem `www`.
- **Rastreabilidade (`robots.txt` e `sitemap.xml`):**
  - `https://wlimasolucoes.com.br/robots.txt` responde `HTTP 200`, permite `Allow: /`, bloqueia apenas `/api/` e referencia `https://wlimasolucoes.com.br/sitemap.xml`.
  - `https://wlimasolucoes.com.br/sitemap.xml` responde `HTTP 200`, XML válido (547 bytes), contendo as 3 URLs públicas (`/`, `/privacidade`, `/termos`), todas retornando `HTTP 200` e com `<link rel="canonical">` autorreferenciado.
- **Tratamento de 404 (`agentic_check.py`):** URLs inexistentes (`/claude-seo-404-probe-...`) retornam `HTTP 404` real, sem *soft-404*.

#### Problemas encontrados:
- **[Alta] Dependência de JavaScript + Scroll para renderizar seções inteiras (`ssr: false`):**
  - **Evidência:** Em `app/page.tsx`, os componentes `LazyContactSection`, `LazyInstagramSection` e `LazyProcessSection` usam `next/dynamic(..., { ssr: false })` combinado com `useNearViewport` (`IntersectionObserver`).
  - **Impacto:** Na análise de renderização (`render_page.py`), o HTML bruto tem 578 palavras e o DOM renderizado sem rolagem tem 733 palavras, mas os títulos H2 `"Projetos e bastidores da W. Lima."` e `"Do Projeto à Economia"`, bem como as 5 etapas do processo e as 4 imagens de obras, **não existem no HTML inicial**. Crawlers que não executam JS ou que não simulam rolagem até o final da página não indexam esse conteúdo.
- **[Baixa] `<lastmod>` estático e tags ignoradas no `sitemap.xml`:**
  - **Evidência:** `sitemap_discovery.py` detectou `lastmod_identical_share: 1.0` com data fixa `2026-09-01` em todas as 3 URLs, além de `<changefreq>` e `<priority>` (ignorados pelo Google).
- **[Baixa] Cabeçalhos HSTS e CSP:**
  - **Evidência:** `Strict-Transport-Security: max-age=31536000` não inclui `includeSubDomains`; `Content-Security-Policy-Report-Only` apenas monitora sem bloquear.

---

### 2.2 Qualidade de Conteúdo & E-E-A-T (`seo-content`) — **66 / 100**

#### Avaliação "Who / How / Why" do Google:
- **Quem (Who):** Identificação jurídica exemplar no rodapé, na Política de Privacidade e no JSON-LD (`W. Lima Solucoes LTDA`, CNPJ `59.652.464/0001-25`, endereço em Cambuci/RJ). Porém, falta apresentar brevemente a equipe técnica ou responsável técnico na página principal.
- **Como (How):** O site mostra um vídeo real de 14s de instalação e fotos de clientes reais, mas sem descrever em texto os bastidores técnicos dessas obras.
- **Por que (Why):** Conteúdo genuinamente útil para o cliente, evitando promessas enganosas (ex.: explica claramente no FAQ por que a conta de luz não "zera" devido ao custo de disponibilidade e iluminação pública).

#### Tabela E-E-A-T (Modelo interno `claude-seo`):
| Fator | Nota | Sinais Observados e Lacunas |
| :--- | :---: | :--- |
| **Experience (Experiência)** | **13 / 20** | Possui vídeo próprio de instalação e fotos de obras reais (Escola Sonho de Criança, FAC Floresta), mas ocultos por `ssr: false` e sem relatos curtos de caso. |
| **Expertise (Especialidade)** | **15 / 25** | Explicações técnicas corretas sobre N-Type, inversor, dimensionamento e compensação; falta mencionar a concessionária local (**Enel RJ**), normas técnicas e detalhes para imóveis rurais/comerciais. |
| **Authoritativeness (Autoridade)** | **11 / 25** | Domínio próprio ativo e Perfil da Empresa no Google Maps existente, mas poucas citações externas e ausência de prova social/avaliações visíveis na página. |
| **Trustworthiness (Confiança)** | **27 / 30** | Excelente: HTTPS, CNPJ, endereço físico com número 915, telefone, e-mail, Política de Privacidade LGPD, Termos de Uso com foro em Cambuci/RJ e consentimento de cookies real. |
| **Total E-E-A-T** | **66 / 100** | **Moderado — Forte em Confiança, com grande oportunidade em Experiência e Autoridade Local.** |

---

### 2.3 On-Page SEO & Imagens (`seo-page` & `seo-images`) — **72 / 100** (On-Page) | **82 / 100** (Imagens)

#### Inventário das Páginas Rastreadas:

| URL | Status | Title (chars) | Meta Description (chars) | H1 | Palavras (HTML bruto) | Canonical |
| :--- | :---: | :--- | :--- | :--- | :---: | :---: |
| `/` | 200 | `Energia Solar para Residências e Empresas \| W. Lima Soluções` (60) | `Projetos de energia solar para residências, empresas e propriedades rurais. Solicite uma análise personalizada à W. Lima Soluções.` (130) | `Não alugue sua energia. Seja dono dela.` | 475 | `https://wlimasolucoes.com.br` |
| `/privacidade` | 200 | `Política de Privacidade \| W. Lima Soluções` (42) | `Saiba como a W. Lima Soluções trata os dados do formulário e dos canais de atendimento.` (**87** ⚠️) | `Política de Privacidade` | 499 | `https://wlimasolucoes.com.br/privacidade` |
| `/termos` | 200 | `Termos de Uso \| W. Lima Soluções` (32) | `Consulte as condições de uso do site, do formulário de atendimento e as responsabilidades aplicáveis ao visitante e à W. Lima Soluções.` (135) | `Termos de Uso` | 523 | `https://wlimasolucoes.com.br/termos` |

#### Auditoria de Imagens (`parse_html.py --probe-images` + inspeção de `public/images/`):
- **Imagem Hero (`/images/house_solar.png`):** Servida via `/_next/image` como **WebP** (`125.096 bytes` na variante `3840w`), com `width="1254"`, `height="1254"`, `alt="Infográfico 3D da Anatomia do Sistema Solar"` e sem `loading="lazy"` (correto para o elemento LCP). Porém, o arquivo matriz em `public/images/house_solar.png` pesa **1,53 MB** e o atributo `fetchpriority="high"` não aparece explicitamente na tag `<img>` analisada por `preload_check.py`.
- **Galeria de Instalações (`post_2.jpg`, `post_3.webp`, `post_4.webp`, `post_5.webp`):** Possuem textos alternativos descritivos no código (`"Instalação de painéis solares na escola Sonho de Criança"`, `"Painéis solares no FAC Floresta"`, etc.), mas **não são indexadas** no HTML inicial devido ao `ssr: false`. Além disso, no modal (`VideoModal`), a tag `<Image>` usa `unoptimized`, servindo o arquivo bruto (`post_2.jpg` tem 382 KB e `post_4.webp` tem 348 KB).
- **Arquivos órfãos em `public/images/`:** Foram identificados arquivos que não são referenciados pelos componentes ativos: `post_1.jpg` (76 KB), `post_1.webp` (76 KB), `post_3.jpg` (151 KB), `post_4.jpg` (348 KB), `post_5.jpg` (196 KB), `video-bateria-poster.webp` (15 KB) e `video_bateria.mp4` (**3,19 MB**). Embora não pesem para o visitante final, ocupam espaço no repositório e no deploy.

---

### 2.4 Schema & Dados Estruturados (`seo-schema`) — **78 / 100**

#### Estado Atual:
O site declara 1 bloco JSON-LD válido em `app/layout.tsx` (`LocalBusiness`), contendo `@id`, `name`, `legalName`, `taxID`, `url`, `image`, `description`, `telephone`, `email`, `address` (`PostalAddress` completo) e `areaServed` (7 cidades).

#### Oportunidades de Melhoria e Código Pronto para Uso:
1. Usar array em `@type`: `["LocalBusiness", "Electrician"]` (ou `"HomeAndConstructionBusiness"`), subtipos suportados pelo Google para serviços residenciais e elétricos.
2. Adicionar `geo` (`GeoCoordinates` de Cambuci com >5 casas decimais), `hasMap` (link do Perfil da Empresa no Google Maps), `priceRange` e `knowsAbout`.
3. Adicionar `VideoObject` para o vídeo real de instalação (`/images/instalacao-w-lima.mp4`).
4. **Regra cumprida:** Não recomendamos `FAQPage` (aposentado pelo Google para todos os sites em 07/05/2026) nem `HowTo` (aposentado em setembro de 2023).

---

### 2.5 SEO Local (`seo-local`) — **68 / 100**

| Dimensão Local | Peso | Nota | Diagnóstico |
| :--- | :---: | :---: | :--- |
| **1. Sinais de GBP na Página** | 25% | 14/25 | Perfil existe no Google Maps, mas o site não possui link para o GBP, embed nem horário de funcionamento visível. |
| **2. Avaliações & Reputação** | 20% | 10/20 | Nenhuma avaliação ou depoimento de clientes da região exibido na página. |
| **3. Local On-Page SEO** | 20% | 13/20 | Cidades listadas na seção do mapa e no rodapé, mas ausentes no `<title>`, no `<h1>` e sem páginas/blocos dedicados por serviço. |
| **4. Consistência de NAP & Citações** | 15% | 12/15 | NAP 100% consistente entre Rodapé, Privacidade e Schema (`Rua Virgilio Franklin, 915, Centro, Cambuci/RJ, CEP 28430-586`). Diretórios externos de CNPJ exibem CEP geral `28430-000`. |
| **5. Local Schema Markup** | 10% | 8/10 | `LocalBusiness` + `PostalAddress` + `areaServed` presentes; faltam `geo`, `openingHoursSpecification` e `hasMap`. |
| **6. Autoridade & Links Locais** | 10% | 11/10 | Projetos reais em instituições locais (Escola Sonho de Criança, FAC Floresta) citados nos `alt` da galeria, mas ocultos do HTML inicial. |

---

### 2.6 Prontidão para Busca em IA e Navegação por Agentes (`seo-geo` & `seo-agentic`) — **74 / 100**

- **Árvore de Acessibilidade para Agentes (`agent_ux_check.py`):** **100 / 100**. Todos os 35 nós interativos possuem rótulos acessíveis (`unnamed_interactive: 0`), sem widgets `div` improvisados (`div_onclick_widgets: 0`) e com 13 landmarks semânticos.
- **Política de Acesso (`robots.txt`):**
  - *Busca / Citação em IA:* `OAI-SearchBot` (ChatGPT Search), `Claude-SearchBot`, `PerplexityBot`, `Googlebot` (AI Overviews / AI Mode) e `Applebot` estão **permitidos**.
  - *Treinamento de Modelos:* `GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot` e `Applebot-Extended` também caem na regra geral `Allow: /` (se desejar restringir treinamento mantendo citação em busca, pode-se adicionar diretivas específicas ou `Content-Signal`).
- **Citabilidade (GEO):** O FAQ já usa formato pergunta-resposta excelente, mas falta um parágrafo introdutório autocontido nos primeiros 30% da página definindo explicitamente a atuação geográfica e os tipos de projeto da W. Lima Soluções.

---

### 2.7 Search Experience Optimization (`seo-sxo`) — **68 / 100**

- **Intenção da SERP para `"energia solar Cambuci RJ"` e região:**
  - A SERP combina resultados locais (Google Map Pack), páginas de integradoras regionais e conteúdos voltados a **redução da conta da Enel RJ**, **energia solar rural / agronegócio** (muito forte no Noroeste Fluminense) e **como funciona a homologação e instalação**.
- **Alinhamento de Tipo de Página:** A Home da W. Lima Soluções é uma *Landing Page de Geração de Leads* muito bem construída para conversão rápida no WhatsApp, mas tem uma lacuna de profundidade informacional comparada ao que o usuário regional pesquisa antes de preencher o formulário (especialmente sobre atendimento na área da Enel RJ, projetos rurais/solo e exemplos visíveis das obras já feitas na região).

---

## 3. Síntese Estratégica (Framework de 10 Princípios)

1. **Restrição de Maior Alavancagem (THINK):** O site já resolveu toda a fundação de infraestrutura (domínio, HTTPS, velocidade, acessibilidade e formulário). O gargalo número 1 agora é que **o Google não vê a localização principal no `<title>`** e **não lê metade do conteúdo da página (Processo e Projetos) no HTML inicial** por causa do `ssr: false`.
2. **Conexão Lateral (CONNECT):** Remover o `ssr: false` do conteúdo estático de `ProcessSection` e `InstagramSection` resolve **quatro achados de uma só vez**: aumenta a contagem de palavras da Home de 475 para ~680+ palavras (Content Quality), expõe os títulos H2/H3 das etapas ao índice (On-Page), permite que o Google Imagens descubra as 4 fotos reais de instalações em clientes locais (Images + E-E-A-T) e torna todo o conteúdo visível para crawlers de IA que não executam JS (GEO/Agentic) — **sem prejudicar a performance**, pois o vídeo MP4 continua com `preload="none"` sob clique e as imagens da galeria usam `loading="lazy"`.
3. **Validação e Capacidade Operacional (FEEL & ACCEPT):** Em vez de recomendar a criação imediata de 10 páginas de cidades (que gerariam risco de *doorway pages* e trabalho excessivo), priorizamos fortalecer a página principal existente com sinais locais reais e, num segundo passo, criar conteúdo específico por perfil de cliente (Residencial, Comercial e Rural).

---

## 4. Limitações Honestamente Declaradas

- **PageSpeed Insights / CrUX API:** A consulta remota sem chave retornou `HTTP 429` (limite diário da cota pública compartilhada da Google API) e não há chave configurada em `~/.config/claude-seo/google-api.json`. Além disso, por ser um domínio recém-publicado (outubro de 2026), ainda não há amostra acumulada de 28 dias no relatório público do CrUX.
- **Search Console / GA4 / GBP Interno:** A auditoria utilizou os sinais públicos verificáveis da URL publicada e o histórico documentado do projeto; não consultou a API autenticada do Search Console nem o painel interno do Google Meu Negócio.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Built by agricidaniel. Join the AI Marketing Hub community
🆓 Free  → https://www.skool.com/ai-marketing-hub
⚡ Pro   → https://www.skool.com/ai-marketing-hub-pro
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
