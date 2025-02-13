import React from 'react';
import { SafeAreaView } from 'react-native';
import CadastroForm from './components/CadastroForm';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CadastroForm />
    </SafeAreaView>
  );
};

export default App;