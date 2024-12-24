# Lista de Tarefas - To-Do App

Este é um aplicativo simples de lista de tarefas (To-Do) construído com React Native. O aplicativo permite que o usuário adicione, remova e marque tarefas como concluídas ou pendentes. Além disso, as tarefas são armazenadas localmente usando AsyncStorage, permitindo que os dados persistam entre sessões.

## Funcionalidades

- **Adicionar Tarefas**: Permite adicionar tarefas à lista.
- **Marcar como Concluída**: O usuário pode marcar tarefas como concluídas ou pendentes.
- **Excluir Tarefas**: O usuário pode remover tarefas da lista.
- **Persistência Local**: Usando AsyncStorage, as tarefas são salvas localmente e restauradas quando o aplicativo é reaberto.
- **Barra de Filtros**: O usuário pode filtrar a exibição das tarefas entre:
  - Todas as tarefas
  - Tarefas concluídas
  - Tarefas pendentes

## Tecnologias Utilizadas

- **React Native**: Framework para o desenvolvimento de aplicativos móveis.
- **Context API**: Gerenciamento de estado global para as tarefas.
- **React Hooks**: useState, useEffect para gerenciamento de estado local e efeito de carga de dados.
- **AsyncStorage**: Para persistir as tarefas localmente entre sessões do aplicativo.
- **React Navigation**: Para navegação entre telas (caso haja necessidade de expansão no futuro).

## Estrutura do Projeto

/
├── components/         # Componentes reutilizáveis
│   ├── HomeScreen.js   # Tela principal com a lista de tarefas
│   └── Task.js         # Componente de cada tarefa individual
├── contexts/           # Contextos para gerenciar estado global
│   ├── TodoContext.js  # Gerencia as tarefas
│   └── AppContext.js   # Gerencia as preferências de tema e idioma
├── App.js              # Arquivo principal de configuração do app
├── assets/             # Imagens e recursos estáticos (se houver)
├── package.json        # Dependências e scripts do projeto
└── README.md           # Este arquivo


## Funcionalidade Detalhada

### 1. Adicionar Tarefa
O usuário pode adicionar uma nova tarefa digitando-a em um campo de texto (TextInput) e pressionando o botão Adicionar Tarefa.

### 2. Marcar como Concluída
As tarefas podem ser marcadas como concluídas ou pendentes ao clicar em um botão ao lado de cada tarefa. O estado da tarefa (concluída ou pendente) será atualizado, e sua aparência mudará (por exemplo, com o texto tachado).

### 3. Excluir Tarefa
O usuário pode excluir uma tarefa da lista ao pressionar o botão Excluir ao lado da tarefa.

### 4. Barra de Filtros
A barra de filtros permite que o usuário alterne entre três modos de visualização:

- **Todas**: Exibe todas as tarefas (pendentes e concluídas).
- **Concluídas**: Exibe apenas as tarefas marcadas como concluídas.
- **Pendentes**: Exibe apenas as tarefas pendentes.

### 5. Persistência com AsyncStorage
As tarefas são armazenadas localmente usando o AsyncStorage. Isso garante que as tarefas persistam mesmo após fechar o aplicativo, e sejam carregadas automaticamente ao reabrir o app.

## Exemplo de Uso

1. Abra o aplicativo e adicione tarefas através da caixa de entrada.
2. Clique no botão Adicionar Tarefa para adicionar uma nova tarefa à lista.
3. As tarefas serão exibidas como pendentes por padrão.
4. Clique no botão Marcar como Concluída ao lado de uma tarefa para marcá-la como concluída.
5. Para excluir uma tarefa, clique em Excluir.
6. Use a barra de filtros para visualizar todas as tarefas ou apenas as concluídas/pendentes.

## Funções do Contexto

### TodoContext
O TodoContext é responsável pelo gerenciamento do estado global da lista de tarefas, incluindo a adição, remoção, atualização e filtragem das tarefas.

### AppContext (opcional)
Este contexto pode ser usado para gerenciar configurações globais do aplicativo, como tema (escuro/claro) e idioma.

## Melhorias Futuras

Algumas melhorias que podem ser implementadas futuramente:

- Adicionar datas de vencimento para as tarefas.
- Notificações para lembrar o usuário de tarefas pendentes.
- Autenticação para permitir a sincronização de tarefas entre dispositivos.
- Animações e transições ao marcar tarefas como concluídas.
- Suporte a categorias de tarefas (ex.: pessoal, trabalho, etc.).

## Contribuindo

Se você deseja contribuir para este projeto, siga estas etapas:

1. Faça um fork deste repositório.
2. Crie uma branch para suas modificações.
3. Envie suas modificações com um pull request.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para mais detalhes.
