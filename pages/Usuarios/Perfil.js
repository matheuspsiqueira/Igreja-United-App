import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Switch, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import styles from "../../styles/perfilStyles";

export default function Perfil({ navigation }) {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsed = JSON.parse(userData);
          setUser(parsed);
        }
      } catch (e) {
        console.log("Erro ao carregar usuário", e);
      }
    };
    loadUser();
  }, []);

  //LOGOUT
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

  // IMAGEM DE PERFIL
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "Você precisa permitir acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      try {
        const userData = await AsyncStorage.getItem("user");
        const parsedUser = JSON.parse(userData);
        const token = parsedUser?.token;

        const formData = new FormData();
        formData.append("avatar", {
          uri: result.assets[0].uri,
          name: "avatar.jpg",
          type: "image/jpeg",
        });

        const response = await fetch("https://8937adbb8e22.ngrok-free.app/api/upload-avatar/", {
          method: "POST",
          headers: {
            "Authorization": `Token ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errText = await response.text();
          console.log("Erro no upload:", errText);
          Alert.alert("Erro", "Não foi possível enviar a imagem");
          return;
        }

        const data = await response.json();

        const newUser = { ...parsedUser, avatar: data.avatar };
        setUser(newUser);
        await AsyncStorage.setItem("user", JSON.stringify(newUser));

      } catch (err) {
        console.log("Erro upload avatar:", err);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>
                {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
            <MaterialIcons name="edit" size={16} color="#fff" />
          </TouchableOpacity>
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

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Termos")}
        >
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

        <TouchableOpacity
          style={[styles.menuItem, styles.logoutItem]}
          onPress={handleLogout}
        >
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
