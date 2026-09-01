# W. Lima Soluções

Site institucional da W. Lima Soluções, desenvolvido com Next.js.

## Requisitos

- Node.js 20.9.0 ou superior
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

## Validação antes da publicação

Execute as verificações na ordem abaixo:

```bash
npm run test:unit
npm run lint
npx tsc --noEmit
npm run build
```

Para conferir a versão de produção localmente:

```bash
npm run start
```

Durante essa conferência, valide o formulário, a consulta de CEP, o mapa, os vídeos locais, os links de WhatsApp e o consentimento do Google Analytics. A política de conteúdo está em modo de relatório; violações aparecem no console do navegador sem bloquear recursos.

## Publicação

Em uma hospedagem com servidor Node.js:

1. Use Node.js 20.9.0 ou superior.
2. Configure `NEXT_PUBLIC_GA_ID` no painel da hospedagem, se o Analytics já estiver disponível.
3. Execute `npm ci` e `npm run build`.
4. Inicie a aplicação com `npm run start`.
5. Aponte `wlimasolucoes.com.br` somente depois de configurar DNS e HTTPS.

A política de conteúdo deve permanecer em modo de relatório até a validação no domínio público. A ativação em modo obrigatório será uma decisão separada, baseada nos relatórios e nos testes em produção.
