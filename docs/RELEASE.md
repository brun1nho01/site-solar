# Publicação e rollback

Este roteiro registra como colocar uma versão no ar e como voltar com segurança se houver regressão. O domínio canônico do projeto é `https://wlimasolucoes.com.br`.

## Antes de publicar

1. Trabalhar em uma branch e abrir um pull request.
2. Confirmar que o workflow **Qualidade** passou por completo.
3. Gerar um preview HTTPS pela hospedagem conectada ao repositório.
4. Executar o workflow **Lighthouse do preview** automaticamente pelo evento de deploy ou manualmente, informando a URL do preview.
5. Fazer uma revisão visual em 375 × 812, 768 × 1024 e 1440 × 900.
6. Revisar a Política de Privacidade e os Termos com o responsável da empresa ou assessoria jurídica.

## Checklist do preview

- Home, Privacidade, Termos, `robots.txt` e `sitemap.xml` respondem corretamente.
- Menu, tema, simulador, formulário, CEP, mapa e galeria funcionam.
- Recusar cookies não carrega o Google Analytics; aceitar carrega somente o identificador configurado.
- O botão final prepara a mensagem para `+55 (22) 99961-8883`; o visitante ainda precisa enviá-la.
- Canonical, Open Graph e dados estruturados apontam para `https://wlimasolucoes.com.br`.
- Lighthouse não fica abaixo de 85 em desempenho nem de 95 nas demais categorias configuradas.

## Publicação

1. Aprovar e integrar o pull request na branch `main` somente com o workflow verde.
2. Promover o preview aprovado ou aguardar o deploy automático de produção.
3. Confirmar DNS, HTTPS e o redirecionamento entre domínio raiz e `www`.
4. Ativar HSTS somente depois de confirmar que todos os endereços necessários funcionam por HTTPS.
5. Repetir o checklist essencial no endereço público.
6. Registrar os dados abaixo no pull request ou na entrega:

```text
Data e hora:
Commit publicado:
URL de produção:
URL/execução do CI:
URL/execução do Lighthouse:
Responsável pela validação:
Observações:
```

O identificador exato do commit pode ser consultado com `git rev-parse HEAD`.

## Quando reverter

Reverter se a home não abrir, se o simulador ou o contato ficarem indisponíveis, se dados empresariais incorretos forem publicados, se HTTPS falhar ou se aparecer uma regressão relevante de privacidade ou segurança.

## Rollback

1. Na hospedagem, promover novamente o último deploy de produção validado. Essa é a resposta mais rápida e preserva o histórico.
2. Confirmar home, simulador, contato, páginas legais e HTTPS na versão restaurada.
3. Se a correção também precisar existir no Git, criar uma branch e executar `git revert <commit-problemático>`; abrir um novo pull request e deixar o CI validar a reversão.
4. Registrar o incidente, o commit retirado, o commit restaurado, o horário e a causa.

Não usar `git reset --hard` para rollback de produção: ele apaga referência local e dificulta a auditoria. O projeto não possui banco de leads nem migrações de banco de dados nesta versão.
