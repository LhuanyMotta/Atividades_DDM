import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const App = () => {
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const consultarCEP = async () => {
    if (!cep || cep.length !== 8) {
      setError('Por favor, insira um CEP válido com 8 dígitos.');
      return;
    }

    setLoading(true);
    setError(null);
    setEndereco(null);

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.data.erro) {
        setError('CEP não encontrado.');
      } else {
        setEndereco(response.data);
      }
    } catch (err) {
      setError('Erro ao consultar o CEP. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consulta de CEP</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o CEP (apenas números)"
        placeholderTextColor="#999"
        value={cep}
        onChangeText={setCep}
        keyboardType="numeric"
        maxLength={8}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={consultarCEP}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Consultar</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#6200ee" style={styles.loading} />}

      {error && <Text style={styles.error}>{error}</Text>}

      {endereco && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Logradouro: {endereco.logradouro}</Text>
          <Text style={styles.resultText}>Bairro: {endereco.bairro}</Text>
          <Text style={styles.resultText}>Cidade: {endereco.localidade}</Text>
          <Text style={styles.resultText}>Estado: {endereco.uf}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#6200ee',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#6200ee',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  loading: {
    marginTop: 20,
  },
  error: {
    color: '#d32f2f',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  resultContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
});

export default App;