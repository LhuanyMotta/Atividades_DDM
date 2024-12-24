// App.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { TodoProvider } from './contexts/TodoContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/HomeScreen';
import Footer from './components/Footer';

function Layout() {
  const { tema } = useAppContext();
  const themeStyles = tema === 'claro' ? stylesClaro : stylesEscuro;

  return (
    <View style={[styles.container, themeStyles.container]}>
      <View style={[styles.sidebarContainer, themeStyles.sidebarContainer]}>
        <Sidebar />
      </View>
      <View style={[styles.mainContainer, themeStyles.mainContainer]}>
        <Header />
        <MainContent />
        <Footer />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <AppProvider>
      <TodoProvider>
        <Layout />
      </TodoProvider>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  sidebarContainer: { flex: 0.3, borderRightWidth: 1, borderRightColor: '#ccc' },
  mainContainer: { flex: 0.7, justifyContent: 'space-between' }
});

const stylesClaro = StyleSheet.create({
  container: { backgroundColor: '#f8f8f8' },
  sidebarContainer: { backgroundColor: '#ffffff' },
  mainContainer: { backgroundColor: '#ffffff' }
});

const stylesEscuro = StyleSheet.create({
  container: { backgroundColor: '#1c1c1c' },
  sidebarContainer: { backgroundColor: '#2c2c2c' },
  mainContainer: { backgroundColor: '#2c2c2c' }
});
