// SeriesStackScreen.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SeriesList from './SeriesList';
import Episodios from './Episodios';
import Video from './Video';

const Stack = createStackNavigator();

export default function SeriesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#121212' },
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff' },
      }}
    >
      <Stack.Screen
        name="SeriesList"
        component={SeriesList}
        options={{ title: 'Séries' }}
      />
      <Stack.Screen
        name="Episodios"
        component={Episodios}
        options={({ route }) => ({ title: route.params.serieTitulo })}
      />
      <Stack.Screen
        name="Video"
        component={Video}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
