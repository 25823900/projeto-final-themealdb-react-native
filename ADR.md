# ADR — Aplicativo de receitas TheMealDB

- **Status:** Aceito como decisão inicial; revisar caso os requisitos do grupo mudem.
- **Contexto:** O projeto final exige um app mobile com lista de dados reais, detalhe, busca, filtro/categoria, favoritos persistidos, estados de carregamento/vazio/erro, testes e build reproduzível. O tema escolhido é receitas usando a API pública TheMealDB.

## Decisões

### Framework: React Native com Expo

O app será implementado em React Native com Expo. A equipe já escolheu essa stack para o projeto e ela permite compartilhar a implementação mobile em TypeScript enquanto o Expo simplifica a execução e o build durante o desenvolvimento.

**Alternativas consideradas:** Flutter e KMP Compose Multiplatform. Foram descartadas para este projeto porque exigiriam trocar a stack escolhida e reimplementar o skeleton e os fluxos de navegação existentes.

### Organização: separação por responsabilidade

- `src/api/` concentra as chamadas HTTP à TheMealDB.
- `src/screens/` contém as telas e coordena o estado da interface.
- `src/storage/` encapsula a persistência local dos favoritos.
- `src/types/` define os modelos compartilhados.

Essa separação evita espalhar detalhes de rede e armazenamento pelas telas e deixa a lógica mais simples de testar.

### Estado: hooks do React

O estado de tela será mantido com `useState`, `useEffect` e `useMemo`, conforme a complexidade atual do app. Não será introduzida uma biblioteca global de estado nesta versão.

**Alternativas consideradas:** Redux Toolkit e Zustand. Foram descartadas por adicionarem dependências e conceitos desnecessários para o fluxo atual, que possui poucas telas e estado local.

### Favoritos: AsyncStorage

Os IDs das receitas favoritas serão persistidos no dispositivo com AsyncStorage. O TheMealDB usa IDs textuais, portanto o armazenamento e as comparações devem preservar `string`.

**Alternativas consideradas:** armazenamento apenas em memória, que perderia os favoritos ao fechar o app, e SQLite, que seria mais adequado a consultas locais complexas do que ao conjunto simples de IDs necessário aqui.

### Dados: TheMealDB

O app consumirá a API pública TheMealDB para lista, detalhes e categorias. A busca por texto será feita no conjunto de receitas já carregado; a categoria será consultada pelo endpoint oficial `filter.php?c=`.

## Consequências

- A disponibilidade da lista e dos detalhes depende de conexão com a API; a UI deve apresentar estados de carregamento e mensagens de erro, sem tela branca.
- Favoritos persistem no aparelho, mas a tela de favoritos precisa obter novamente os dados das receitas pela API.
- A busca textual é local e limitada aos dados carregados.
- Os testes devem cobrir a lógica de filtro/busca e a persistência de favoritos, além de validar os estados principais das telas.
