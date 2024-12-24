// components/HomeScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useTodoContext } from '../contexts/TodoContext';
import { useAppContext } from '../contexts/AppContext';

export default function MainContent() {
  const { tarefas, adicionarTarefa, marcarConcluida, removerTarefa, editarTarefa } = useTodoContext();
  const { tema, idioma, alternarTema, alternarIdioma } = useAppContext();
  const [novaTarefa, setNovaTarefa] = useState('');
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [filtro, setFiltro] = useState('todos');
  const themeStyles = tema === 'claro' ? stylesClaro : stylesEscuro;

  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtro === 'concluidas') return tarefa.concluida;
    if (filtro === 'pendentes') return !tarefa.concluida;
    return true;
  });

  const handleAdicionarTarefa = () => {
    if (novaTarefa.trim()) {
      adicionarTarefa(novaTarefa);
      setNovaTarefa('');
    }
  };

  const handleSalvarEdicao = () => {
    if (tarefaEditando && novaTarefa.trim()) {
      editarTarefa(tarefaEditando.id, novaTarefa);
      setNovaTarefa('');
      setTarefaEditando(null);
    }
  };

  const getTextoPorIdioma = (textoPt, textoEn) => {
    return idioma === 'pt-BR' ? textoPt : textoEn;
  };

  const renderTarefa = ({ item }) => (
    <View style={[styles.tarefa, themeStyles.tarefa]}>
      <Text
        style={[styles.textoTarefa, themeStyles.textoTarefa, item.concluida && styles.tarefaConcluida]}
      >
        {item.texto}
      </Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => marcarConcluida(item.id)} style={styles.actionButton}>
          <Text style={[styles.botao, tema === 'escuro' ? themeStyles.botaoAcaoEscuro : null]}>
            {getTextoPorIdioma('Marcar como ' + (item.concluida ? 'Pendente' : 'Concluída'),
              'Mark as ' + (item.concluida ? 'Pending' : 'Completed'))}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removerTarefa(item.id)} style={styles.actionButton}>
          <Text style={[styles.botao, tema === 'escuro' ? themeStyles.botaoAcaoEscuro : null]}>
            {getTextoPorIdioma('Excluir', 'Delete')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTarefaEditando(item)} style={styles.actionButton}>
          <Text style={[styles.botao, tema === 'escuro' ? themeStyles.botaoAcaoEscuro : null]}>
            {getTextoPorIdioma('Editar', 'Edit')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );  

  return (
    <View style={[styles.container, themeStyles.container]}>
      {tarefaEditando ? (
        <View style={styles.editContainer}>
          <TextInput
            style={[styles.input, themeStyles.input]}
            value={novaTarefa}
            onChangeText={setNovaTarefa}
            placeholder={idioma === 'pt-BR' ? 'Editar tarefa' : 'Edit task'}
          />
          <TouchableOpacity onPress={handleSalvarEdicao} style={[styles.button, themeStyles.button]}>
            <Text style={[styles.buttonText, themeStyles.buttonText]}>
              {idioma === 'pt-BR' ? 'Salvar' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.addContainer}>
          <TextInput
            style={[styles.input, themeStyles.input]}
            value={novaTarefa}
            onChangeText={setNovaTarefa}
            placeholder={idioma === 'pt-BR' ? 'Digite uma nova tarefa' : 'Enter a new task'}
          />
          <TouchableOpacity onPress={handleAdicionarTarefa} style={[styles.button, themeStyles.button]}>
            <Text style={[styles.buttonText, themeStyles.buttonText]}>
              {idioma === 'pt-BR' ? 'Adicionar Tarefa' : 'Add Task'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Título acima da barra de filtros */}
      <Text style={[styles.tituloFiltro, themeStyles.tituloFiltro]}>
        {idioma === 'pt-BR' ? 'Filtrar Tarefas' : 'Filter Tasks'}
      </Text>

      {/* Barra de Filtros */}
      <View style={styles.filtrosContainer}>
        <TouchableOpacity onPress={() => setFiltro('todos')} style={[styles.botaoFiltro, themeStyles.botaoFiltro]}>
          <Text style={styles.botaoTexto}>
            {idioma === 'pt-BR' ? 'Todos' : 'All'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFiltro('concluidas')} style={[styles.botaoFiltro, themeStyles.botaoFiltro]}>
          <Text style={styles.botaoTexto}>
            {idioma === 'pt-BR' ? 'Concluídas' : 'Completed'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFiltro('pendentes')} style={[styles.botaoFiltro, themeStyles.botaoFiltro]}>
          <Text style={styles.botaoTexto}>
            {idioma === 'pt-BR' ? 'Pendentes' : 'Pending'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de tarefas filtradas */}
      <FlatList
        data={tarefasFiltradas}
        renderItem={renderTarefa}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 16 }} // Adiciona um espaçamento entre os filtros e as tarefas
      />

      {/* Botões para alternar tema e idioma */}
      <View style={styles.botoesContainer}>
        <TouchableOpacity onPress={alternarTema} style={[styles.botaoTema, themeStyles.botaoTema]}>
          <Text style={styles.botaoTexto}>{tema === 'claro' ? 'Modo Escuro' : 'Modo Claro'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={alternarIdioma} style={[styles.botaoIdioma, themeStyles.botaoIdioma]}>
          <Text style={styles.botaoTexto}>{idioma === 'pt-BR' ? 'Inglês' : 'Português'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  input: { height: 45, borderColor: '#ccc', borderWidth: 1, marginBottom: 16, paddingLeft: 10, borderRadius: 8 },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, elevation: 2 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  tarefa: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, padding: 10, backgroundColor: '#f4f4f4', borderRadius: 8 },
  textoTarefa: { flex: 1, fontSize: 16, color: '#333' },
  tarefaConcluida: { textDecorationLine: 'line-through', color: '#aaa' },
  botao: { color: '#007AFF', marginLeft: 10 },
  botoesContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  botaoTema: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, elevation: 2 },
  botaoIdioma: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, elevation: 2 },
  botaoTexto: { color: '#fff', textAlign: 'center', fontSize: 16 },
  
  // Estilos dos filtros e título
  filtrosContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  botaoFiltro: { backgroundColor: '#28a745', padding: 12, borderRadius: 8, elevation: 2 },
  tituloFiltro: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#333' },

  // Containers para adicionar e editar tarefas
  addContainer: { marginBottom: 16 },
  editContainer: { marginBottom: 16 },

  actionsContainer: { flexDirection: 'row' },
  actionButton: { marginLeft: 10 },
});

const stylesClaro = StyleSheet.create({
  container: { backgroundColor: '#ffffff' },
  input: { backgroundColor: '#f9f9f9' },
  button: { backgroundColor: '#007AFF' },
  textoTarefa: { color: '#333' },
  tituloFiltro: { color: '#333' },
  botaoFiltro: { backgroundColor: '#007AFF' },
});

const stylesEscuro = StyleSheet.create({
  container: { backgroundColor: '#2c2c2c' },
  input: { backgroundColor: '#444' },
  button: { backgroundColor: '#555' },
  textoTarefa: { color: '#ccc' },
  tituloFiltro: { color: '#ccc' },
  botaoFiltro: { backgroundColor: '#666' },
  tarefa: { backgroundColor: '#333' },
  tarefaConcluida: { color: '#aaa' },
  botaoTema: { backgroundColor: '#555' },
  botaoIdioma: { backgroundColor: '#666' },

  // Adiciona a cor branca aos botões de ação no modo escuro
  botaoAcaoEscuro: { color: '#fff' },
});
