import React, { useEffect, useState, useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Switch, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemeContext } from "../../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import styles from "../../styles/perfilStyles";

export default function Perfil({ navigation }) {
  const { isDarkMode, toggleTheme, theme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);

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

  // LOGOUT
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

        const response = await fetch("https://5af7188494d0.ngrok-free.app/api/upload-avatar/", {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
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
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: theme.secondary }]}>
              <Text style={[styles.avatarLetter, { color: theme.text }]}>
                {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
            <MaterialIcons name="edit" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.usernameEmail}>
          <Text style={[styles.username, { color: theme.text }]}>
            {user?.username ? user.username : "Usuário"}
          </Text>
          {user?.email && <Text style={[styles.email, { color: theme.secondary }]}>{user.email}</Text>}
        </View>
      </View>

      {/* CONFIGURAÇÕES GERAIS */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Configurações Gerais</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialIcons name="person" size={24} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>Conta</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} style={[styles.arrowIcon, { color: theme.secondary }]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialIcons name="group" size={24} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>Voluntariado</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} style={[styles.arrowIcon, { color: theme.secondary }]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialIcons name="bookmark" size={24} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>Salvos</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} style={[styles.arrowIcon, { color: theme.secondary }]} />
        </TouchableOpacity>

        <View style={styles.toggleContainer}>
          <View style={styles.menuItemLeft}>
            <MaterialIcons name="dark-mode" size={24} color={theme.text} />
            <Text style={[styles.toggleText, { color: theme.text }]}>Modo Escuro</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            thumbColor={isDarkMode ? theme.primary : theme.secondary}
            trackColor={{ false: "#ccc", true: "#a1dea663" }}
          />
        </View>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialIcons name="language" size={24} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>Idioma</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} style={[styles.arrowIcon, { color: theme.secondary }]} />
        </TouchableOpacity>
      </View>

      {/* INFORMAÇÕES */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Informações</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialIcons name="smartphone" size={24} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>Sobre o App</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} style={[styles.arrowIcon, { color: theme.secondary }]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Termos")}>
          <View style={styles.menuItemLeft}>
            <MaterialIcons name="description" size={24} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>Termos e Condições</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} style={[styles.arrowIcon, { color: theme.secondary }]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialIcons name="share" size={24} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>Compartilhar App</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} style={[styles.arrowIcon, { color: theme.secondary }]} />
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
