import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '../styles/global';

export default function Home() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Bem-vindo à Igreja United</Text>
      <Text style={globalStyles.text}>Esta é a tela Home</Text>
    </View>
  );
}
