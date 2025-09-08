import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../styles/perfilStyles";

export default function Perfil({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.log("Erro ao carregar usuário", e);
      }
    };
    loadUser();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="account-circle" size={80} color="#555" />
        <Text style={styles.username}>{user ? user.name : "Usuário"}</Text>
        <Text style={styles.email}>{user ? user.email : "email@email.com"}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("DadosPessoais")}
        >
          <Icon name="person" size={24} color="#333" />
          <Text style={styles.menuText}>Dados Pessoais</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("AlterarSenha")}
        >
          <Icon name="lock" size={24} color="#333" />
          <Text style={styles.menuText}>Alterar Senha</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("VersiculosSalvos")}
        >
          <Icon name="bookmark" size={24} color="#333" />
          <Text style={styles.menuText}>Versículos Salvos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
