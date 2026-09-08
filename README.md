# W. Lima Soluções — Site Solar

Site institucional em Next.js para apresentação da empresa, simulação inicial de energia solar e abertura de atendimento no WhatsApp.

## Requisitos

- Node.js 20.9.0 ou superior; o CI usa Node.js 22
- npm, incluído na instalação do Node.js

## Instalação local

Instale exatamente as versões registradas no projeto:

```bash
npm ci
```

Crie o arquivo local de ambiente a partir do exemplo:

```powershell
Copy-Item .env.example .env.local
```

O arquivo `.env.local` não deve ser enviado ao repositório.

## Variáveis de ambiente

| Variável | Obrigatória | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_GA_ID` | Não | Identificador do Google Analytics no formato `G-...`. O Analytics só é carregado depois que o visitante aceita os cookies. |

O valor fictício presente em `.env.example` mantém o Analytics desativado. Configure o identificador real diretamente no ambiente da hospedagem.

## Desenvolvimento

Inicie o servidor local:

```bash
npm run dev
```

Abra `http://localhost:3000` no navegador.

## Validação local

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Os testes funcionais usam Chromium em 375 × 812, 768 × 1024 e 1440 × 900. Na primeira execução, instale o navegador do Playwright. O próprio comando recompila o site e testa a versão de produção:

```bash
npx playwright install chromium
npm run test:e2e
```

Para acompanhar a execução em uma janela visível, use `npm run test:e2e:headed`.

Os cenários automatizados substituem ViaCEP, OpenStreetMap e Google Analytics por respostas locais e bloqueiam qualquer outro destino externo. O popup do WhatsApp também é simulado, portanto a suíte não abre conversas nem envia dados reais.

## Integração contínua e publicação

O workflow **Qualidade** executa instalação limpa, lint, verificação de tipos, testes unitários, build e testes funcionais. Uma falha impede a aprovação técnica do pull request quando essa verificação for definida como obrigatória nas regras da branch `main`.

O workflow **Lighthouse do preview** aceita uma URL HTTPS manualmente e também reage a previews publicados pela hospedagem. O relatório bloqueia regressões abaixo de 85 em desempenho e 95 em acessibilidade, boas práticas ou SEO; a meta de desempenho móvel do projeto continua sendo 90 ou mais.

O domínio canônico configurado é `https://wlimasolucoes.com.br`. O roteiro completo de preview, produção, registro do commit e rollback está em [docs/RELEASE.md](docs/RELEASE.md). A política de conteúdo deve permanecer em modo de relatório até a validação no domínio público.
