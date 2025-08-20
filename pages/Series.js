import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '../styles/global';

export default function Series() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Séries</Text>
      <Text style={globalStyles.text}>Lista de séries de pregações da igreja</Text>
    </View>
  );
}
