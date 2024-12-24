// components/Header.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppContext } from '../contexts/AppContext';

export default function Header() {
  const { usuario, tema, idioma } = useAppContext();
  const themeStyles = tema === 'claro' ? stylesClaro : stylesEscuro;

  return (
    <View style={[styles.header, themeStyles.header]}>
      <Text style={[styles.headerText, themeStyles.headerText]}>        
        {idioma === 'pt-BR' ? 'Olá' : 'Hello'}, {usuario.nome}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16 },
  headerText: { fontSize: 18, fontWeight: 'bold' }
});

const stylesClaro = StyleSheet.create({
  header: { backgroundColor: '#f2f2f2' },
  headerText: { color: '#222' }
});

const stylesEscuro = StyleSheet.create({
  header: { backgroundColor: '#333' },
  headerText: { color: '#f2f2f2' }
});