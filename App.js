import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Importando telas
import Home from './pages/Home';
import Informacoes from './pages/Informacoes';
import Series from './pages/Series';
import Biblia from './pages/Biblia'

// Stacks para cada aba
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

// Bottom Tabs
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Início') iconName = 'home';
            else if (route.name === 'Informações') iconName = 'information-circle';
            else if (route.name === 'Bíblia') iconName = 'book';
            else if (route.name === 'Séries') iconName = 'play-circle';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0066cc',
          tabBarInactiveTintColor: 'gray',
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
