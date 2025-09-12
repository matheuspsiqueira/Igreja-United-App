import * as React from 'react';
import { NavigationContainer, DarkTheme, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { AppState } from "react-native";

import Home from './pages/Home/Home';
import SeriesStack from './pages/Series/SeriesStack';
import Biblia from './pages/Biblia';
import LoadingScreen from './pages/LoadingScreen';
import Login from "./pages/Usuarios/Login";
import Cadastro from "./pages/Usuarios/Cadastro";
import Perfil from './pages/Usuarios/Perfil';

// === Stack de Usuário ===
const UsuarioStack = createStackNavigator();
function UsuarioStackScreen() {
  return (
    <UsuarioStack.Navigator screenOptions={{ headerShown: true }}>
      <UsuarioStack.Screen name="Login" component={Login} />
      <UsuarioStack.Screen name="Cadastro" component={Cadastro} />
      <UsuarioStack.Screen name='Perfil' component={Perfil} />
    </UsuarioStack.Navigator>
  );
}

// === Stacks internos ===
const HomeStack = createStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={Home} />
    </HomeStack.Navigator>
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

// === Botão de perfil no header ===
function UserIconButton() {
  const navigation = useNavigation();
  return (
    <Ionicons
      name="person-circle-outline"
      size={30}
      color="#fff"
      style={{ marginRight: 15 }}
      onPress={() => navigation.navigate("Usuario")}
    />
  );
}

// === Tabs ===
const Tab = createBottomTabNavigator();
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#121212' },
        headerTitleStyle: { color: '#FFFFFF' },
        headerTintColor: '#FFFFFF',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Início') iconName = 'home';
          else if (route.name === 'Bíblia') iconName = 'book';
          else if (route.name === 'Séries') iconName = 'play-circle';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#A1DEA6',
        tabBarInactiveTintColor: '#9e9e9e',
        tabBarStyle: { backgroundColor: '#121212', borderTopColor: '#222' },
      })}
    >
      <Tab.Screen 
        name="Início" 
        component={HomeStackScreen}
        options={{
          headerTitle: 'Igreja United',
          headerRight: () => <UserIconButton />,
        }}
      />
      <Tab.Screen name="Bíblia" component={BibliaStackScreen} />
      <Tab.Screen name="Séries" component={SeriesStack} />
    </Tab.Navigator>
  );
}

// === Stack raiz ===
const RootStack = createStackNavigator();

export default function App() {
  // 🔹 Função que força o modo imersivo
  const enableImmersive = async () => {
    try {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
    } catch (e) {
      console.warn("Erro ao ativar modo imersivo:", e);
    }
  };

  React.useEffect(() => {
    enableImmersive();

    // 🔹 Reaplica sempre que o app volta para foreground
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") enableImmersive();
    });

    return () => sub.remove();
  }, []);

  return (
    <NavigationContainer
      theme={DarkTheme}
      onReady={enableImmersive} // 🔹 garante na inicialização
      onStateChange={enableImmersive} // 🔹 reaplica ao navegar
    >
      <StatusBar hidden />
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Loading" component={LoadingScreen} />
        <RootStack.Screen name="MainTabs" component={MainTabs} />
        <RootStack.Screen name="Usuario" component={UsuarioStackScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
