import * as React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from './pages/Home';
import Informacoes from './pages/Informacoes';
import Series from './pages/Series';
import Biblia from './pages/Biblia';

const HomeStack = createStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={Home} />
    </HomeStack.Navigator>
  );
}

const InfoStack = createStackNavigator();
function InfoStackScreen() {
  return (
    <InfoStack.Navigator screenOptions={{ headerShown: false }}>
      <InfoStack.Screen name="Informações" component={Informacoes} />
    </InfoStack.Navigator>
  );
}

const BibliaStack = createStackNavigator();
function BibliaStackScreen() {
  return (
    <BibliaStack.Navigator screenOptions={{ headerShown: false }}>
      <BibliaStack.Screen name="Bíblia" component={Biblia} />
    </BibliaStack.Navigator>
  );
}

const SeriesStack = createStackNavigator();
function SeriesStackScreen() {
  return (
    <SeriesStack.Navigator screenOptions={{ headerShown: false }}>
      <SeriesStack.Screen name="Séries" component={Series} />
    </SeriesStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // ⚠️ Não esconder o header aqui, para o título aparecer
          headerStyle: { backgroundColor: '#121212' },
          headerTitleStyle: { color: '#FFFFFF' },
          headerTintColor: '#FFFFFF',

          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Início') iconName = 'home';
            else if (route.name === 'Informações') iconName = 'information-circle';
            else if (route.name === 'Bíblia') iconName = 'book';
            else if (route.name === 'Séries') iconName = 'play-circle';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#A1DEA6',
          tabBarInactiveTintColor: '#9e9e9e',
          tabBarStyle: { backgroundColor: '#121212', borderTopColor: '#222' },
        })}
      >
        <Tab.Screen name="Início" component={HomeStackScreen} />
        <Tab.Screen name="Informações" component={InfoStackScreen} />
        <Tab.Screen name="Bíblia" component={BibliaStackScreen} />
        <Tab.Screen name="Séries" component={SeriesStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
