import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../styles/LoginStyles";
import useAuth from "./useAuth";

export default function Login({ navigation }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      // Se já estiver logado, vai direto para Perfil
      navigation.replace("Perfil");
    }
  }, [user, loading]);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setEmail("");
    setSenha("");
    setRefreshing(false);
  }, []);

  const handleLogin = async () => {
    if (!email || !senha) return;

    try {
      const response = await fetch(
        "https://328aa325d573.ngrok-free.app/api/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        }
      );

      const data = await response.json();

      if (response.ok && data.token) {
        // Salva o token
        await AsyncStorage.setItem("token", data.token);

        // Salva o usuário corretamente, pegando o username da API
        const userData = {
          username: data.username,
          email: data.email,
          profile: data.profile
        };
        await AsyncStorage.setItem("user", JSON.stringify(userData));

        navigation.replace("Perfil");
      } else {
        alert("E-mail ou senha incorretos!");
      }
    } catch (error) {
      console.log(error);
      alert("Erro ao fazer login.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardOpeningTime={0}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>UNTD.</Text>

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <TouchableOpacity onPress={() => navigation.navigate("EsqueceuSenha")}>
            <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
            <Text style={styles.link}>Não tem conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
              <Text style={[styles.link, { fontWeight: "bold", textDecorationLine: "underline" }]}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}
