# Receitas — TheMealDB + React Native

Aplicativo mobile do projeto final da disciplina Arquitetura de Aplicações Móveis e Multiplataforma. O app usa a API pública TheMealDB e React Native com Expo.

> **Estado atual:** este repositório contém o skeleton inicial. As cinco funcionalidades ainda têm pontos `TODO` e precisam ser implementadas e testadas antes da entrega.

## Funcionalidades exigidas

- [ ] Lista de receitas carregada da API TheMealDB.
- [ ] Navegação da lista para os detalhes da receita.
- [ ] Busca textual na lista.
- [ ] Filtro de receitas por categoria usando a API.
- [ ] Favoritos persistidos localmente após fechar e reabrir o app.
- [ ] Estados de carregamento, lista vazia e erro/sem internet.

## Requisitos

- Node.js 22 ou superior.
- npm.
- Android Studio e um emulador Android, ou um dispositivo Android para executar o app.
- Expo Go pode não suportar todas as dependências nativas; para AsyncStorage e navegação nativa, prefira o development build.

## Como instalar e executar

Na raiz deste repositório:

```bash
npm install
npm start
```

Para compilar e executar no Android:

```bash
npm run android
```

O comando requer Android Studio, SDK Android e um emulador ou dispositivo conectado.

## Estrutura

```text
App.tsx                  Navegação principal
src/api/                 Integração HTTP com TheMealDB
src/screens/             Lista, detalhes, favoritos e navegação inferior
src/storage/             Persistência local de favoritos
src/types/               Modelos de dados
flows/                   Flows de exemplo herdados do skeleton
```

## API

- Lista: `https://www.themealdb.com/api/json/v1/1/search.php?s=`
- Detalhe: `https://www.themealdb.com/api/json/v1/1/lookup.php?i={id}`
- Categoria: `https://www.themealdb.com/api/json/v1/1/filter.php?c={categoria}`

A API não exige uma chave privada para os endpoints utilizados. Busca textual é aplicada localmente sobre os resultados carregados.

## Testes e validação

Os flows em `flows/` são exemplos opcionais do skeleton, não substituem os testes próprios exigidos no projeto. Antes da entrega, adicionar pelo menos três testes para a lógica do app, capturar os screenshots e validar o build Android.

## Screenshots

Adicionar aqui pelo menos três capturas do app concluído:

1. Lista de receitas.
2. Detalhe de uma receita.
3. Busca/filtro ou tela de favoritos.

## Decisões de arquitetura

Consulte [ADR.md](./ADR.md).
