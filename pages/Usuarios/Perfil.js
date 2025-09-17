import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../styles/perfilStyles";

export default function Perfil({ navigation }) {
  const [user, setUser] = useState(null);

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
      <View style={styles.header}>
        {/* Avatar com a primeira letra do username */}
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>
            {user?.username
              ? user.username.charAt(0).toUpperCase()
              : "U"}
          </Text>
        </View>

        {/* Exibir username */}
        <Text style={styles.username}>
          {user?.username ? user.username : "Usuário"}
        </Text>

        {/* Exibir email abaixo (opcional) */}
        {user?.email && (
          <Text style={styles.email}>{user.email}</Text>
        )}
      </View>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("DadosPessoais")}
        >
          <MaterialIcons name="person" size={24} color="#333" />
          <Text style={styles.menuText}>Dados Pessoais</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("AlterarSenha")}
        >
          <MaterialIcons name="lock" size={24} color="#333" />
          <Text style={styles.menuText}>Alterar Senha</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("VersiculosSalvos")}
        >
          <MaterialIcons name="bookmark" size={24} color="#333" />
          <Text style={styles.menuText}>Versículos Salvos</Text>
        </TouchableOpacity>

        {/* Botão de sair */}
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <MaterialIcons name="exit-to-app" size={24} color="#e74c3c" />
          <Text style={[styles.menuText, { color: "#e74c3c" }]}>
            Sair
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
