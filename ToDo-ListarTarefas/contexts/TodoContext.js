import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Criando o contexto
const TodoContext = createContext();

// Função para carregar as tarefas
const carregarTarefas = async () => {
  try {
    const tarefasSalvas = await AsyncStorage.getItem('tarefas');
    return tarefasSalvas ? JSON.parse(tarefasSalvas) : [];
  } catch (error) {
    console.error('Erro ao carregar tarefas', error);
    return [];
  }
};

// Função para salvar as tarefas
const salvarTarefas = async (tarefas) => {
  try {
    await AsyncStorage.setItem('tarefas', JSON.stringify(tarefas));
  } catch (error) {
    console.error('Erro ao salvar tarefas', error);
  }
};

// Componente que fornece os valores do contexto
export function TodoProvider({ children }) {
  const [tarefas, setTarefas] = useState([]);

  // Carregar tarefas ao iniciar
  useEffect(() => {
    const fetchTarefas = async () => {
      const tarefasCarregadas = await carregarTarefas();
      setTarefas(tarefasCarregadas);
    };
    fetchTarefas();
  }, []);

  // Função para adicionar uma nova tarefa
  const adicionarTarefa = async (tarefaTexto) => {
    const novaTarefa = { id: Date.now(), texto: tarefaTexto, concluida: false };
    const novasTarefas = [...tarefas, novaTarefa];
    setTarefas(novasTarefas);
    await salvarTarefas(novasTarefas);
  };

  // Função para marcar uma tarefa como concluída ou não
  const marcarConcluida = async (id) => {
    const novasTarefas = tarefas.map((tarefa) =>
      tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
    );
    setTarefas(novasTarefas);
    await salvarTarefas(novasTarefas);
  };

  // Função para remover uma tarefa
  const removerTarefa = async (id) => {
    const novasTarefas = tarefas.filter((tarefa) => tarefa.id !== id);
    setTarefas(novasTarefas);
    await salvarTarefas(novasTarefas);
  };

  // Função para editar uma tarefa
  const editarTarefa = async (id, textoAtualizado) => {
    const novasTarefas = tarefas.map((tarefa) =>
      tarefa.id === id ? { ...tarefa, texto: textoAtualizado } : tarefa
    );
    setTarefas(novasTarefas); // Atualiza o estado das tarefas
    await salvarTarefas(novasTarefas); // Salva as tarefas no AsyncStorage
  };

  // Valor que será acessado pelos consumidores do contexto
  const valor = {
    tarefas,
    adicionarTarefa,
    marcarConcluida,
    removerTarefa,
    editarTarefa,  // Não se esqueça de adicionar a função aqui
  };

  return <TodoContext.Provider value={valor}>{children}</TodoContext.Provider>;
}

// Hook para acessar o contexto
export function useTodoContext() {
  return useContext(TodoContext);
}
