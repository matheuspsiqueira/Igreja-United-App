import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '../styles/global';

export default function Informacoes() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Informações</Text>
      <Text style={globalStyles.text}>Aqui teremos detalhes sobre cultos e projetos</Text>
    </View>
  );
}
