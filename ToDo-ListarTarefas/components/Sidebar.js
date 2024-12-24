// components/Sidebar.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppContext } from '../contexts/AppContext';

export default function Sidebar() {
  const { notificacoes, idioma, tema } = useAppContext();
  const themeStyles = tema === 'claro' ? stylesClaro : stylesEscuro;

  return (
    <View style={[styles.sidebar, themeStyles.sidebar]}>
      <Text style={[styles.title, themeStyles.title]}>
        {idioma === 'pt-BR' ? 'Notificações' : 'Notifications'}
      </Text>
      <ScrollView>
        {notificacoes.map((notif) => (
          <Text 
            key={notif.id} 
            style={[styles.notif, notif.lida ? themeStyles.notifLida : themeStyles.notifNaoLida]}
          >
            {notif.mensagem}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: { flex: 1, padding: 16 },
  title: { fontSize: 16, marginBottom: 8, fontWeight: '600' },
  notif: { marginBottom: 4, fontSize: 14 }
});

const stylesClaro = StyleSheet.create({
  sidebar: { backgroundColor: '#fafafa' },
  title: { color: '#333' },
  notifLida: { color: '#444', fontWeight: 'normal' },
  notifNaoLida: { color: '#000', fontWeight: 'bold' }
});

const stylesEscuro = StyleSheet.create({
  sidebar: { backgroundColor: '#2c2c2c' },
  title: { color: '#ddd' },
  notifLida: { color: '#ccc', fontWeight: 'normal' },
  notifNaoLida: { color: '#fff', fontWeight: 'bold' }
});
