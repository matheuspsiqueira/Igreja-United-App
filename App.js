import * as React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";

import Home from './pages/Home/Home';
import SeriesStack from './pages/Series/SeriesStack';
import Biblia from './pages/Biblia';
import LoadingScreen from './pages/LoadingScreen';

// === Stacks internos ===
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
      <Tab.Screen 
        name="Início" 
        component={HomeStackScreen}
        options={{
          headerTitle: 'Igreja United', // 🔹 remove o "Início"
          headerRight: () => (
            <Ionicons
              name="person-circle-outline"
              size={30}
              color="#fff"
              style={{ marginRight: 15 }}
              onPress={() => alert("Ir para perfil")} // 👉 depois você coloca navigation.navigate("Perfil")
            />
          ),
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
  //  Esconde botões do Android
  React.useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar hidden />
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Loading" component={LoadingScreen} />
        <RootStack.Screen name="MainTabs" component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
