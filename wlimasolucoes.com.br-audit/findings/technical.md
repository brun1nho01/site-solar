# Achados Especializados — SEO Técnico, Sitemap & Performance

## 1. Transporte, TLS e Redirecionamentos (`transport_check.py`)
- **Host conectado:** `wlimasolucoes.com.br` (`75.2.60.5`, Netlify)
- **TLS:** `TLSv1.3` (`TLS_AES_128_GCM_SHA256`), certificado Let's Encrypt (`YE1`) válido de `2026-10-28` a `2027-01-26` (76 dias restantes).
- **Cobertura SAN:** `wlimasolucoes.com.br` e `www.wlimasolucoes.com.br` (`covers_host: true`, `covers_sibling: true`).
- **Redirecionamento HTTP → HTTPS:** `http://wlimasolucoes.com.br/` → `301 Moved Permanently` em 1 salto para `https://wlimasolucoes.com.br/`.
- **Consolidação `www`:** `https://www.wlimasolucoes.com.br/` consolida sem erro TLS para `https://wlimasolucoes.com.br/`.
- **Cabeçalhos de Segurança:**
  - `Strict-Transport-Security: max-age=31536000` (Presente; falta `includeSubDomains` para requisitos de preload — severidade **Low**).
  - `Content-Security-Policy-Report-Only`: Presente em modo de relatório (severidade **Low**).
  - `X-Content-Type-Options: nosniff` (OK)
  - `X-Frame-Options: DENY` (OK)
  - `Referrer-Policy: strict-origin-when-cross-origin` (OK)
  - `Permissions-Policy: browsing-topics=(), camera=(), geolocation=(), microphone=(), payment=(), usb=()` (OK)

## 2. Sitemap e Rastreabilidade (`sitemap_discovery.py`)
- **`robots.txt`:** `https://wlimasolucoes.com.br/robots.txt` (HTTP 200), declara `Sitemap: https://wlimasolucoes.com.br/sitemap.xml`.
- **`sitemap.xml`:** HTTP 200, `urlset` válido, 547 bytes, 3 URLs únicas:
  1. `https://wlimasolucoes.com.br` (`lastmod: 2026-09-01`)
  2. `https://wlimasolucoes.com.br/privacidade` (`lastmod: 2026-09-01`)
  3. `https://wlimasolucoes.com.br/termos` (`lastmod: 2026-09-01`)
- **Observação:** `lastmod_identical_share: 1.0` com data estática `2026-09-01`. Recomendado atualizar `lastReviewed` em `app/sitemap.ts` quando o conteúdo for atualizado.

## 3. Renderização JavaScript vs. HTML Inicial (`render_page.py` & `page_checks.py`)
- **HTML bruto (`raw`):** 578 palavras (466–475 palavras úteis de corpo), 10 links, 1 H1, 5 H2, 4 H3.
- **HTML renderizado inicial (`rendered`):** 733 palavras, 11 links.
- **Lacuna de SSR (`ssr: false`):** `LazyContactSection`, `LazyInstagramSection` e `LazyProcessSection` usam `next/dynamic(..., { ssr: false })` com `IntersectionObserver`. Sem rolagem até cada seção, o HTML servido contém apenas `<section data-deferred-section="...">` vazios.

## 4. Preload, Speculation Rules & bfcache (`preload_check.py`)
- **bfcache:** Compatível (`cache_control_no_store: false`, sem listeners `unload`/`beforeunload`).
- **Preloads detectados no `<head>`:** 2 fontes (`Satoshi_Bold`, `Satoshi_Regular`) + `imagesrcset` da imagem Hero (`house_solar.png`).
- **Oportunidade:** Adicionar `fetchpriority="high"` explícito na imagem LCP e avaliar `<script type="speculationrules">` para pré-carregar `/privacidade` e `/termos` em hover.
