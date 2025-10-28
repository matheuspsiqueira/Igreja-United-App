import * as React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { AppState } from "react-native";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

import Home from './pages/Home/Home';
import SeriesStack from './pages/Series/SeriesStack';
import Biblia from './pages/Biblia';
import LoadingScreen from './pages/LoadingScreen';
import Login from "./pages/Usuarios/Login";
import Cadastro from "./pages/Usuarios/Cadastro";
import Perfil from './pages/Usuarios/Perfil';
import Termos from './pages/Usuarios/Termos';
import Locais from './pages/Locais';
import Eventos from './pages/Eventos';
import Agenda from './pages/Agenda';

// === Stack de Usuário ===
const UsuarioStack = createStackNavigator();
function UsuarioStackScreen() {
  return (
    <UsuarioStack.Navigator screenOptions={{ headerShown: true }}>
      <UsuarioStack.Screen name="Login" component={Login} />
      <UsuarioStack.Screen name="Cadastro" component={Cadastro} />
      <UsuarioStack.Screen name='Perfil' component={Perfil} />
      <UsuarioStack.Screen name='Termos' component={Termos} />
    </UsuarioStack.Navigator>
  );
}

// === Stacks internos ===
const HomeStack = createStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen 
        name="Home" 
        component={Home} 
        options={{ headerShown: false }} // Home não mostra header
      />
      
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


//AGENDA
const AgendaStack = createStackNavigator();

function AgendaStackScreen() {
  return (
    <AgendaStack.Navigator>
      <AgendaStack.Screen
        name="Agenda"
        component={Agenda}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#fff",
          headerLeft: () => (
            <Ionicons
              name="arrow-back"
              size={28}
              color="#fff"
              style={{ marginLeft: 15 }}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
    </AgendaStack.Navigator>
  );
}

//LOCAIS
const LocaisStack = createStackNavigator();

function LocaisStackScreen() {
  return (
    <LocaisStack.Navigator>
      <LocaisStack.Screen
        name="Locais"
        component={Locais}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#fff",
          headerLeft: () => (
            <Ionicons
              name="arrow-back"
              size={28}
              color="#fff"
              style={{ marginLeft: 15 }}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
    </LocaisStack.Navigator>
  );
}


// EVENTOS
const EventosStack = createStackNavigator();

function EventosStackScreen() {
  return (
    <EventosStack.Navigator>
      <EventosStack.Screen
        name="Eventos"
        component={Eventos}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#fff",
          headerLeft: () => (
            <Ionicons
              name="arrow-back"
              size={28}
              color="#fff"
              style={{ marginLeft: 15 }}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
    </EventosStack.Navigator>
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
        tabBarActiveTintColor: '#53acc5ff',
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

// ✅ Criar um wrapper para poder usar o hook aqui
function AppContent() {
  const { theme, isDarkMode } = useTheme();

  // 🔹 Modo imersivo
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
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") enableImmersive();
    });
    return () => sub.remove();
  }, []);

  // ✅ Tema dinâmico para NavigationContainer
  const baseNavTheme = isDarkMode ? DarkTheme : DefaultTheme;

  const navigationTheme = {
    ...baseNavTheme,
    colors: {
      ...baseNavTheme.colors,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      primary: theme.primary,
      border: "transparent",
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Loading" component={LoadingScreen} />
        <RootStack.Screen name="MainTabs" component={MainTabs} />
        <RootStack.Screen name="Usuario" component={UsuarioStackScreen} />
        <RootStack.Screen name="Locais" component={LocaisStackScreen}/>
        <RootStack.Screen name="Eventos" component={EventosStackScreen}/>
        <RootStack.Screen name="Agenda" component={AgendaStackScreen}/>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
