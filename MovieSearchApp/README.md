# Movie Search App

Este é um aplicativo de busca de filmes desenvolvido em React Native que utiliza a API do The Movie Database (TMDB) para buscar e exibir informações sobre filmes populares, mais bem avaliados e detalhes específicos de cada filme.

## Configuração do Token da API

Para que o aplicativo funcione corretamente, é necessário configurar o token de acesso à API do TMDB. O token é uma chave única que permite ao aplicativo fazer requisições à API e obter os dados dos filmes.

### Passos para Configurar o Token

1. **Obtenha uma chave de API do TMDB:**
   - Acesse o site [The Movie Database](https://www.themoviedb.org/) e crie uma conta.
   - Após criar a conta, vá até a seção de configurações da API e solicite uma chave de API (token).

2. **Crie o arquivo `MovieSearch.env`:**
   - No diretório raiz do projeto, crie um arquivo chamado `MovieSearch.env`.
   - Dentro desse arquivo, adicione a seguinte linha, substituindo `SUA_CHAVE_DE_API_AQUI` pela chave que você obteve no passo anterior:

     ```plaintext
     API_KEY=SUA_CHAVE_DE_API_AQUI
     ```

3. **Importe o token no código:**
   - No arquivo `App.js`, o token é importado a partir do arquivo `MovieSearch.env` da seguinte forma:

     ```javascript
     import Config from './MovieSearch.env';
     const API_KEY = Config.API_KEY;
     ```

   - Isso garante que o token seja utilizado em todas as requisições à API.
   - É altamente recomendável substituir esse token pelo seu próprio token.

## Estrutura do Projeto

O aplicativo é composto por três telas principais:

- **HomeScreen:** Exibe uma lista de filmes populares e mais bem avaliados.
- **SearchScreen:** Permite ao usuário buscar filmes por título.
- **MovieDetailsScreen:** Exibe detalhes específicos de um filme selecionado.

## Dependências

Certifique-se de que todas as dependências do projeto estão instaladas. Você pode instalar as dependências necessárias executando:

```bash
npm install
```
## Considerações Finais

- **Token de API:** Sem um token válido, o aplicativo não conseguirá buscar os dados dos filmes. Certifique-se de configurar corretamente o arquivo `MovieSearch.env`.
- **Limitações da API:** A API do TMDB possui limites de requisições por dia. Certifique-se de não exceder esses limites.

## Agora você está pronto para explorar o mundo dos filmes com o Movie Search App! 🎬🍿