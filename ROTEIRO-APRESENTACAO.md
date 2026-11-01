# Roteiro da apresentaÃ§Ã£o tÃ©cnica

**Projeto:** Projeto Final 1 TheMealDB â€” TheMealDB + React Native
**DuraÃ§Ã£o planejada:** 18 minutos (16 de apresentaÃ§Ã£o + cerca de 2 para perguntas)
**Formato:** apresentaÃ§Ã£o de slides com demonstraÃ§Ã£o ao vivo do app

## DivisÃ£o em quatro partes

| Tempo | Integrante | Slides | Foco |
|---|---|---:|---|
| 0:00â€“4:00 | JoÃ£o VÃ­tor Vieira Martins | 1â€“3 | Apresentar o projeto e demonstrar lista, busca e categorias |
| 4:00â€“8:00 | JÃºlio CÃ©sar Fernandes | 4â€“5 | Demonstrar detalhe da receita e favoritos persistidos |
| 8:00â€“12:00 | Jhonathan Carvo | 6â€“7 | Explicar arquitetura, API, estados da interface e testes |
| 12:00â€“16:00 | William Tavares de Moura | 8â€“9 | Apresentar validaÃ§Ãµes, decisÃµes do ADR e conclusÃ£o |
| 16:00â€“18:00 | Todos | 10 | Responder perguntas |

Cada integrante tem aproximadamente quatro minutos. A duraÃ§Ã£o inclui a fala e a demonstraÃ§Ã£o dos fluxos atribuÃ­dos.

## SugestÃ£o de fala e demonstraÃ§Ã£o

### JoÃ£o VÃ­tor â€” abertura, objetivo e descoberta (4 min)

**Slide 1 â€” abertura (cerca de 30 s)**
"Somos o grupo Projeto Final 1 TheMealDB. Desenvolvemos um aplicativo mobile de receitas usando React Native com Expo e dados da API pÃºblica TheMealDB."

**Slide 2 â€” proposta (cerca de 1 min)**
"A proposta Ã© facilitar a descoberta de receitas e permitir que a pessoa encontre pratos, consulte como preparar e salve os favoritos. O app cobre lista com dados reais, detalhe, busca, categorias e favoritos persistidos."

**Slide 3 â€” demonstraÃ§Ã£o (cerca de 2 min)**
Abrir a tela de receitas. Mostrar os cartÃµes com imagens, digitar um termo na busca e selecionar uma categoria. Comentar que a busca Ã© aplicada aos dados carregados e que a seleÃ§Ã£o de categoria consulta a API.

**TransiÃ§Ã£o:** "Agora o JÃºlio vai mostrar o que acontece quando escolhemos uma receita e como salvamos pratos para depois."

### JÃºlio CÃ©sar â€” detalhe e favoritos (4 min)

**Slide 4 â€” detalhe (cerca de 2 min)**
Abrir uma receita. Mostrar a imagem, o nome, os ingredientes com medidas e o modo de preparo. Indicar o botÃ£o de favorito sem sair do detalhe.

**Slide 5 â€” favoritos (cerca de 1 min)**
Marcar ou desmarcar uma receita e abrir a aba Favoritos. Explicar que os IDs ficam no AsyncStorage e sÃ£o recuperados ao iniciar o app.

**DemonstraÃ§Ã£o de persistÃªncia (cerca de 1 min)**
Se possÃ­vel, favoritar uma receita, recarregar ou reabrir o app e confirmar que continua na coleÃ§Ã£o. Se nÃ£o for seguro fechar o app na apresentaÃ§Ã£o, explicar o teste automatizado de persistÃªncia.

**TransiÃ§Ã£o:** "O Jhonathan vai explicar como as partes do aplicativo se conectam e como verificamos os estados e a lÃ³gica."

### Jhonathan Carvo â€” arquitetura, estados e testes (4 min)

**Slide 6 â€” arquitetura (cerca de 2 min)**
Explicar o fluxo: as telas coordenam a interface, `theMealDbApi` centraliza chamadas e mapeamento da API, `favoritesStore` persiste IDs e tipos/utilitÃ¡rios reÃºnem modelos, filtros e tema. O estado usa hooks do React.

**Slide 7 â€” qualidade (cerca de 2 min)**
Apontar os estados de carregamento, vazio e erro. Resumir a cobertura dos seis testes: busca/filtro, respostas de lista e categoria, detalhe/ingredientes, persistÃªncia e toggle de favoritos e falhas da API.

**TransiÃ§Ã£o:** "Para fechar, o William mostra a validaÃ§Ã£o do build e as decisÃµes que registramos no ADR."

### William Tavares de Moura â€” validaÃ§Ã£o e conclusÃ£o (4 min)

**Slide 8 â€” validaÃ§Ã£o (cerca de 2 min)**
Informar que os seis testes passaram, TypeScript e verificaÃ§Ã£o de compatibilidade Expo passaram, `npm audit` reportou zero vulnerabilidades e o APK debug para Android arm64-v8a foi compilado.

**Slide 9 â€” decisÃµes (cerca de 1 min)**
Resumir as decisÃµes documentadas no ADR: Expo/React Native, AsyncStorage para favoritos, hooks em vez de uma biblioteca global de estado e API pÃºblica TheMealDB.

**ConclusÃ£o (cerca de 1 min)**
"Entregamos um app mobile com dados reais, cinco funcionalidades principais, estados tratados, persistÃªncia local, testes, documentaÃ§Ã£o e build Android validado. Obrigado; estamos prontos para as perguntas."

### Perguntas â€” todos (cerca de 2 min)

Distribuir as respostas de acordo com o assunto:

- API, busca e categorias: JoÃ£o VÃ­tor.
- Interface, detalhe e favoritos: JÃºlio CÃ©sar.
- OrganizaÃ§Ã£o do cÃ³digo, estados e testes: Jhonathan.
- Build, dependÃªncias e decisÃµes do ADR: William.

## PreparaÃ§Ã£o antes da apresentaÃ§Ã£o

- Abrir o app jÃ¡ carregado e deixar uma receita conhecida pronta para a demonstraÃ§Ã£o.
- Conferir a conexÃ£o com a TheMealDB e testar busca, categoria, detalhe e favorito.
- Deixar o APK/build ou os resultados de validaÃ§Ã£o acessÃ­veis caso perguntem.
- Ensaiar a troca de apresentador entre as quatro partes e controlar o tempo.
- Se a API ou o emulador falhar, usar as trÃªs screenshots do README e explicar o fluxo sem depender da rede.

## Abrir os slides

Abra `apresentacao.html` em um navegador. Use as setas esquerda/direita ou a barra de espaÃ§o para trocar de slide. Para imprimir ou salvar como PDF, use a opÃ§Ã£o de impressÃ£o do navegador.
