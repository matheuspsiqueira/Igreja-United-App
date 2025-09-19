import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Switch } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../styles/perfilStyles";

export default function Perfil({ navigation }) {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsed = JSON.parse(userData);
          console.log("Usuário carregado:", parsed);
          setUser(parsed);
        }
      } catch (e) {
        console.log("Erro ao carregar usuário", e);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Sair",
      "Deseja realmente sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("user");
            navigation.replace("Login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>
              {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>
          <View style={styles.editIcon}>
            <MaterialIcons name="edit" size={16} color="#fff" />
          </View>
        </View>

        <View style={styles.usernameEmail}>
          <Text style={styles.username}>
            {user?.username ? user.username : "Usuário"}
          </Text>
          {user?.email && <Text style={styles.email}>{user.email}</Text>}
        </View>
      </View>

      {/* CONFIGURAÇÕES GERAIS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações Gerais</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialIcons name="person" size={24} color="#fff" />
            <Text style={styles.menuText}>Conta</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialIcons name="group" size={24} color="#fff" />
            <Text style={styles.menuText}>Voluntariado</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialIcons name="bookmark" size={24} color="#fff" />
            <Text style={styles.menuText}>Salvos</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} style={styles.arrowIcon} />
        </TouchableOpacity>

        <View style={styles.toggleContainer}>
          <View style={styles.menuItemLeft}>
            <MaterialIcons name="dark-mode" size={24} color="#fff" />
            <Text style={styles.toggleText}>Modo Escuro</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            thumbColor={isDarkMode ? "#a1dea6ff" : "#888"}
            trackColor={{ false: "#555", true: "#a1dea663" }}
          />
        </View>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialIcons name="language" size={24} color="#fff" />
            <Text style={styles.menuText}>Idioma</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>

      {/* INFORMAÇÕES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialIcons name="info" size={24} color="#fff" />
            <Text style={styles.menuText}>Sobre o App</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialIcons name="description" size={24} color="#fff" />
            <Text style={styles.menuText}>Termos e Condições</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialIcons name="share" size={24} color="#fff" />
            <Text style={styles.menuText}>Compartilhar App</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
          <View style={styles.menuItemLeft}>
            <MaterialIcons name="exit-to-app" size={24} color="#e74c3c" />
            <Text style={[styles.menuText, { color: "#e74c3c" }]}>Sair</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
