# Achados Especializados — Conteúdo, On-Page, Local SEO, Schema & IA

## 1. On-Page & Conteúdo (`page_checks.py` & `content_quality.py`)
- **Qualidade textual QRG (`content_quality.py`):**
  - `overall_quality: 88/100`
  - `filler_score: 0` (zero muletas textuais)
  - `ai_pattern_score: 0` (zero clichês artificiais de IA)
  - `information_density: 1.0`
- **Estrutura de Cabeçalhos no HTML Inicial (`parse_html.py`):**
  - `H1`: `"Não alugue sua energia. Seja dono dela."`
  - `H2`:
    1. `"Por que escolher a W Lima Soluções?"`
    2. `"Energia solar ativa em várias cidades do Rio de Janeiro."`
    3. `"Dúvidas Frequentes"`
    4. `"Descubra se a Energia Solar Faz Sentido para o Seu Imóvel."`
    5. `"Você decide sobre os dados de navegação"` (Banner de consentimento de cookies)
  - `H3`: `"Garantias Claras na Proposta"`, `"Dimensionamento sob Medida"`, `"Acompanhamento Técnico"`, `"Monitoramento e Suporte Local"`.
  - **Ausentes do HTML bruto (por `ssr: false`):** `"Projetos e bastidores da W. Lima."`, `"Veja nosso trabalho de perto."`, `"Do Projeto à Economia"` e os 5 `H3` das etapas do processo.

## 2. Schema.org / JSON-LD (`seo-schema`)
Snippet recomendado para substituir o objeto `jsonLd` em `app/layout.tsx`:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "Electrician"],
      "@id": "https://wlimasolucoes.com.br/#empresa",
      "name": "W. Lima Soluções",
      "legalName": "W. Lima Solucoes LTDA",
      "taxID": "59.652.464/0001-25",
      "url": "https://wlimasolucoes.com.br",
      "image": "https://wlimasolucoes.com.br/og-image.jpg",
      "description": "Projetos e instalação de energia solar para residências, empresas e propriedades rurais em Cambuci e região (RJ).",
      "telephone": "+5522999618883",
      "email": "wlimasolucoes@gmail.com",
      "priceRange": "$$",
      "hasMap": "https://maps.app.goo.gl/JbvTH7mcU1W2RpPz7",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Rua Virgilio Franklin, 915",
        "addressLocality": "Cambuci",
        "addressRegion": "RJ",
        "postalCode": "28430-586",
        "addressCountry": "BR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -21.5762274,
        "longitude": -41.912293
      },
      "sameAs": [
        "https://www.instagram.com/wlimasolucoes/"
      ],
      "areaServed": [
        { "@type": "City", "name": "Cambuci, RJ" },
        { "@type": "City", "name": "Itaocara, RJ" },
        { "@type": "City", "name": "São Fidélis, RJ" },
        { "@type": "City", "name": "Aperibé, RJ" },
        { "@type": "City", "name": "Santo Antônio de Pádua, RJ" },
        { "@type": "City", "name": "Rio de Janeiro, RJ" },
        { "@type": "City", "name": "Saquarema, RJ" }
      ]
    },
    {
      "@type": "VideoObject",
      "@id": "https://wlimasolucoes.com.br/#video-instalacao",
      "name": "Instalação de painéis solares pela equipe da W. Lima Soluções",
      "description": "Registro real da equipe da W. Lima Soluções posicionando módulos fotovoltaicos e preparando a estrutura no telhado.",
      "thumbnailUrl": "https://wlimasolucoes.com.br/images/instalacao-w-lima-poster-v2.jpg",
      "contentUrl": "https://wlimasolucoes.com.br/images/instalacao-w-lima.mp4",
      "uploadDate": "2026-09-16",
      "duration": "PT14S",
      "publisher": {
        "@id": "https://wlimasolucoes.com.br/#empresa"
      }
    }
  ]
}
```

## 3. Agentic Browsing & GEO (`agentic_check.py` & `agent_ux_check.py`)
- **Agent-UX Score:** `100/100` (`total_nodes: 540`, `interactive_nodes: 35`, `unnamed_interactive: 0`).
- **Verificações P0 (`agentic_check.py`):**
  - `server-rendered`: `pass` (585 palavras sem JS).
  - `robots-reachable`: `pass` (HTTP 200).
  - `robots-ai-groups`: `info` (todos os crawlers de IA usam a regra `*`).
- **Verificações P1 (`agentic_check.py`):**
  - `http-404`: `pass` (retorna 404 real).
  - `robots-user-agents`: `pass` (nenhum agente bloqueado na raiz).
  - `content-signal`, `llms-txt`, `markdown-delivery`: `info` (opcionais; Google Search ignora `llms.txt` e `Content-Signal`).
