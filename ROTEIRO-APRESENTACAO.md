# Roteiro da apresentação técnica

**Projeto:** Projeto Final 1 TheMealDB — TheMealDB + React Native
**Duração planejada:** 18 minutos (16 de apresentação + cerca de 2 para perguntas)
**Formato:** apresentação de slides com demonstração ao vivo do app

## Divisão em quatro partes

| Tempo | Integrante | Slides | Foco |
|---|---|---:|---|
| 0:00–4:00 | João Vítor Vieira Martins | 1–3 | Apresentar o projeto e demonstrar lista, busca e categorias |
| 4:00–8:00 | Júlio César Fernandes | 4–5 | Demonstrar detalhe da receita e favoritos persistidos |
| 8:00–12:00 | Jhonathan Carvo | 6–7 | Explicar arquitetura, API, estados da interface e testes |
| 12:00–16:00 | William Tavares de Moura | 8–9 | Apresentar validações, decisões do ADR e conclusão |
| 16:00–18:00 | Todos | 10 | Responder perguntas |

Cada integrante tem aproximadamente quatro minutos. A duração inclui a fala e a demonstração dos fluxos atribuídos.

## Sugestão de fala e demonstração

### João Vítor — abertura, objetivo e descoberta (4 min)

**Slide 1 — abertura (cerca de 30 s)**
"Somos o grupo Projeto Final 1 TheMealDB. Desenvolvemos um aplicativo mobile de receitas usando React Native com Expo e dados da API pública TheMealDB."

**Slide 2 — proposta (cerca de 1 min)**
"A proposta é facilitar a descoberta de receitas e permitir que a pessoa encontre pratos, consulte como preparar e salve os favoritos. O app cobre lista com dados reais, detalhe, busca, categorias e favoritos persistidos."

**Slide 3 — demonstração (cerca de 2 min)**
Abrir a tela de receitas. Mostrar os cartões com imagens, digitar um termo na busca e selecionar uma categoria. Comentar que a busca é aplicada aos dados carregados e que a seleção de categoria consulta a API.

**Transição:** "Agora o Júlio vai mostrar o que acontece quando escolhemos uma receita e como salvamos pratos para depois."

### Júlio César — detalhe e favoritos (4 min)

**Slide 4 — detalhe (cerca de 2 min)**
Abrir uma receita. Mostrar a imagem, o nome, os ingredientes com medidas e o modo de preparo. Indicar o botão de favorito sem sair do detalhe.

**Slide 5 — favoritos (cerca de 1 min)**
Marcar ou desmarcar uma receita e abrir a aba Favoritos. Explicar que os IDs ficam no AsyncStorage e são recuperados ao iniciar o app.

**Demonstração de persistência (cerca de 1 min)**
Se possível, favoritar uma receita, recarregar ou reabrir o app e confirmar que continua na coleção. Se não for seguro fechar o app na apresentação, explicar o teste automatizado de persistência.

**Transição:** "O Jhonathan vai explicar como as partes do aplicativo se conectam e como verificamos os estados e a lógica."

### Jhonathan Carvo — arquitetura, estados e testes (4 min)

**Slide 6 — arquitetura (cerca de 2 min)**
Explicar o fluxo: as telas coordenam a interface, `theMealDbApi` centraliza chamadas e mapeamento da API, `favoritesStore` persiste IDs e tipos/utilitários reúnem modelos, filtros e tema. O estado usa hooks do React.

**Slide 7 — qualidade (cerca de 2 min)**
Apontar os estados de carregamento, vazio e erro. Resumir a cobertura dos sete testes: busca/filtro, respostas de lista e categoria, detalhe/ingredientes, persistência e toggle de favoritos, falhas da API e mensagem sem internet.

**Transição:** "Para fechar, o William mostra a validação do build e as decisões que registramos no ADR."

### William Tavares de Moura — validação e conclusão (4 min)

**Slide 8 — validação (cerca de 2 min)**
Informar que os sete testes e o TypeScript passaram (a verificação do Expo sugere duas atualizações de patch), `npm audit` reportou zero vulnerabilidades e o APK debug para Android arm64-v8a foi compilado.

**Slide 9 — decisões (cerca de 1 min)**
Resumir as decisões documentadas no ADR: Expo/React Native, AsyncStorage para favoritos, hooks em vez de uma biblioteca global de estado e API pública TheMealDB.

**Conclusão (cerca de 1 min)**
"Entregamos um app mobile com dados reais, cinco funcionalidades principais, estados tratados, persistência local, testes, documentação e build Android validado. Obrigado; estamos prontos para as perguntas."

### Perguntas — todos (cerca de 2 min)

Distribuir as respostas de acordo com o assunto:

- API, busca e categorias: João Vítor.
- Interface, detalhe e favoritos: Júlio César.
- Organização do código, estados e testes: Jhonathan.
- Build, dependências e decisões do ADR: William.

## Preparação antes da apresentação

- Abrir o app já carregado e deixar uma receita conhecida pronta para a demonstração.
- Conferir a conexão com a TheMealDB e testar busca, categoria, detalhe e favorito.
- Deixar o APK/build ou os resultados de validação acessíveis caso perguntem.
- Ensaiar a troca de apresentador entre as quatro partes e controlar o tempo.
- Se a API ou o emulador falhar, usar as três screenshots do README e explicar o fluxo sem depender da rede.

## Abrir os slides

Abra `apresentacao.html` em um navegador. Use as setas esquerda/direita ou a barra de espaço para trocar de slide. Para imprimir ou salvar como PDF, use a opção de impressão do navegador.
