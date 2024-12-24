import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Criando o contexto
const AppContext = createContext();

// Componente que fornece os valores do contexto
export function AppProvider({ children }) {
  // Estado para o usuário (dados fictícios)
  const [usuario, setUsuario] = useState({ nome: 'Lhuany Motta', logado: true });

  // Estado para o tema (claro ou escuro)
  const [tema, setTema] = useState('claro');

  // Estado para o idioma (pt-BR ou en-US)
  const [idioma, setIdioma] = useState('pt-BR');

  // Estado para as notificações (dependem do idioma)
  const notificacoes = [
    {
      id: 1,
      mensagem: idioma === 'pt-BR' ? 'Bem-vindo!' : 'Welcome!',
    },
    {
      id: 2,
      mensagem: idioma === 'pt-BR' 
        ? 'Este é um aplicativo de lista de tarefas.' 
        : 'This is a to-do list app.',
    },
    {
      id: 3,
      mensagem: idioma === 'pt-BR' 
        ? 'Você pode adicionar, remover e marcar tarefas como concluídas ou pendentes.' 
        : 'You can add, remove, and mark tasks as completed or pending.',
    },
    {
      id: 4,
      mensagem: idioma === 'pt-BR' 
        ? 'Os dados são armazenados localmente.' 
        : 'The data is stored locally.',
    }
  ];

  // Estado para as tarefas
  const [tarefas, setTarefas] = useState([]);

  // Função para carregar as tarefas armazenadas no AsyncStorage
  useEffect(() => {
    const carregarTarefas = async () => {
      try {
        const tarefasSalvas = await AsyncStorage.getItem('tarefas');
        if (tarefasSalvas) {
          setTarefas(JSON.parse(tarefasSalvas));
        }
      } catch (error) {
        console.error('Erro ao carregar tarefas', error);
      }
    };
    carregarTarefas();
  }, []);

  // Função para adicionar uma nova tarefa
  const adicionarTarefa = async (tarefa) => {
    const novasTarefas = [
      ...tarefas,
      { id: Date.now(), texto: tarefa, concluida: false }
    ];
    setTarefas(novasTarefas);
    await AsyncStorage.setItem('tarefas', JSON.stringify(novasTarefas));
  };

  // Função para marcar uma tarefa como concluída ou não concluída
  const marcarConcluida = async (id) => {
    const novasTarefas = tarefas.map((tarefa) =>
      tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
    );
    setTarefas(novasTarefas);
    await AsyncStorage.setItem('tarefas', JSON.stringify(novasTarefas));
  };

  // Função para remover uma tarefa
  const removerTarefa = async (id) => {
    const novasTarefas = tarefas.filter((tarefa) => tarefa.id !== id);
    setTarefas(novasTarefas);
    await AsyncStorage.setItem('tarefas', JSON.stringify(novasTarefas));
  };

  // Função para alternar entre os idiomas
  const alternarIdioma = () => {
    setIdioma((prev) => (prev === 'pt-BR' ? 'en-US' : 'pt-BR'));
  };

  // Função para alternar entre os temas (claro e escuro)
  const alternarTema = () => {
    setTema((prev) => (prev === 'claro' ? 'escuro' : 'claro'));
  };

  // Valor que será acessado pelos consumidores do contexto
  const valor = {
    usuario,
    setUsuario,
    tema,
    setTema,
    idioma,
    setIdioma,
    notificacoes,
    alternarIdioma,
    alternarTema,
    tarefas,
    adicionarTarefa,
    marcarConcluida,
    removerTarefa,
  };

  return (
    <AppContext.Provider value={valor}>
      {children}
    </AppContext.Provider>
  );
}

// Hook para acessar o contexto
export function useAppContext() {
  return useContext(AppContext);
}
