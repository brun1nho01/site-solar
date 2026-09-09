# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

O público é amplo: pessoas e empresas interessadas em contratar energia solar. O site contempla situações residenciais, comerciais e rurais. O trabalho principal do visitante é entender se a energia solar faz sentido para seu imóvel ou operação, obter uma referência inicial e iniciar o atendimento para contratar um projeto.

## Product Purpose

Apresentar a W. Lima Soluções, explicar seu processo de energia solar, oferecer uma simulação inicial de consumo, geração, investimento e economia e transformar o interesse do visitante em uma conversa com a equipe pelo WhatsApp. O sucesso é o visitante compreender os limites da estimativa, fornecer os dados necessários e avançar para uma análise e proposta personalizadas.

## Positioning

A empresa assume como compromissos centrais executar cada serviço com rigor e utilizar equipamentos da melhor qualidade aplicável ao projeto. A forma concreta de comprovar esse diferencial — por fabricantes, certificações, especificações, garantias ou casos documentados — ainda não está registrada no repositório e não deve ser inventada.

## Operating Context

O visitante pode informar valor da conta ou consumo em kWh, CEP, tipo de imóvel, local de instalação, tipo de telhado e interesse em financiamento. O site produz uma referência inicial, solicita dados de contato e prepara uma mensagem para o WhatsApp; o visitante revisa e envia a mensagem. O formulário não é armazenado em banco de dados próprio.

O serviço apresentado percorre análise de viabilidade, projeto e homologação, instalação, vistoria e conexão, geração e compensação. O suporte parte de Cambuci/RJ e o site registra atuação em Cambuci, Itaocara, São Fidélis, Aperibé, Pádua, Rio de Janeiro e Saquarema, sujeita à disponibilidade.

## Capabilities and Constraints

- Site institucional responsivo em Next.js App Router, com simulador solar, tema claro/escuro, mapa regional, galeria, conteúdo informativo, consentimento de cookies e atendimento pelo WhatsApp.
- O simulador oferece somente uma referência inicial; não constitui orçamento, proposta comercial, dimensionamento técnico nem garantia de geração ou economia.
- As referências comerciais atuais de investimento cobrem gerações entre 600 e 1.000 kWh por mês. Fora dessa faixa, o valor permanece sob consulta até existirem dados aprovados.
- Financiamento não recebe projeção numérica sem entrada, prazo, taxa, parcelas e CET definidos em proposta.
- Não há CRM, área administrativa nem banco próprio de leads. Esses recursos permanecem fora da primeira versão pública.
- ViaCEP, OpenStreetMap, Instagram, Google Analytics e WhatsApp são serviços externos. O fluxo deve continuar compreensível e utilizável quando houver falhas compatíveis com o escopo do site.
- O Google Analytics é opcional e só pode ser carregado após consentimento.
- Números comerciais, garantias, certificações, comparações e demais alegações devem ter base documentada antes da publicação.
- Endereços de clientes não podem ser expostos no mapa.
- O domínio oficial registrado é `wlimasolucoes.com.br`.
- Política de Privacidade e Termos de Uso ainda exigem revisão jurídica antes da publicação.

## Brand Commitments

- Nome público: W. Lima Soluções.
- Razão social: W. Lima Soluções LTDA.
- Compromisso com serviço bem executado e equipamentos de alta qualidade adequados a cada projeto.
- Transparência sobre premissas, limites das simulações, garantias, responsabilidades e etapas do serviço.
- O conteúdo empresarial e a identidade já aprovados no site devem ser preservados até que o usuário solicite explicitamente uma revisão, redesign ou rebrand.
- Português do Brasil é o idioma principal da experiência.

## Evidence on Hand

- Dados empresariais, domínio, canais de contato e cidades atendidas estão centralizados em `lib/site-config.ts` e `lib/active-energy-cities.ts`.
- O repositório contém imagens e vídeos próprios em `public/images/`, além da imagem social em `public/og-image.jpg`.
- O simulador contém premissas e referências comerciais documentadas no código e nos Termos de Uso, com testes unitários dedicados.
- Os três cenários residencial, comercial e rural exibidos no site são ilustrativos; não são casos de clientes documentados.
- O repositório ainda não contém certificados, depoimentos verificáveis, fabricantes vinculados, documentação das garantias ou cases comerciais que possam ser apresentados como prova. Trabalho futuro não deve fabricar esses materiais.

## Product Principles

1. Fazer o serviço corretamente e adequar os equipamentos às condições reais de cada projeto.
2. Informar com transparência o que é estimativa, o que depende de vistoria e o que será formalizado na proposta.
3. Facilitar a passagem da pesquisa inicial para uma conversa humana e uma análise personalizada.
4. Publicar somente números, provas e promessas que possam ser sustentados por documentação.
5. Manter a experiência funcional para pessoas, empresas e diferentes perfis de imóvel, sem privilegiar um único segmento não confirmado.

## Accessibility & Inclusion

O produto deve permanecer utilizável em celular, tablet e desktop, por teclado e com preferências de movimento reduzido. A meta registrada do projeto é manter pelo menos 95 no Lighthouse para acessibilidade e validar os fluxos em 375 × 812, 768 × 1024 e 1440 × 900.
