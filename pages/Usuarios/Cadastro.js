import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CheckBox from "expo-checkbox";
import styles from "../../styles/CadastroStyles";

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false); // <-- estado do checkbox
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setNome("");
    setDataNascimento("");
    setEmail("");
    setTelefone("");
    setUsername("");
    setSenha("");
    setConfirmSenha("");
    setAceitouTermos(false);
    setRefreshing(false);
  }, []);

  const formatarTelefone = (text) => {
    let numeros = text.replace(/\D/g, "");
    if (numeros.length > 11) numeros = numeros.slice(0, 11);
    if (numeros.length > 6) numeros = numeros.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    else if (numeros.length > 2) numeros = numeros.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    setTelefone(numeros);
  };

  const formatarData = (text) => {
    let numeros = text.replace(/\D/g, "");
    if (numeros.length > 8) numeros = numeros.slice(0, 8);
    if (numeros.length >= 5) numeros = numeros.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
    else if (numeros.length >= 3) numeros = numeros.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    setDataNascimento(numeros);
  };

  const handleCadastro = async () => {
    if (!aceitouTermos) {
      Alert.alert("Aviso", "Você precisa aceitar os Termos e Condições para se cadastrar.");
      return;
    }

    if (senha !== confirmSenha) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    try {
      const response = await fetch("https://8937adbb8e22.ngrok-free.app/api/cadastro/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password: senha,
          confirm_senha: confirmSenha,
          nome_completo: nome,
          data_nascimento: dataNascimento.split("/").reverse().join("-"),
          telefone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
        navigation.replace("Login");
      } else {
        if (data && typeof data === "object") {
          const mensagens = Object.values(data).flat().join("\n");
          Alert.alert("Erro", mensagens);
        } else {
          Alert.alert("Erro", "Não foi possível cadastrar.");
        }
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao conectar ao servidor.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#121212" }}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 50 }}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardOpeningTime={0}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Cadastro</Text>

          <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#aaa" value={nome} onChangeText={setNome} />
          <TextInput style={styles.input} placeholder="Data de nascimento" placeholderTextColor="#aaa" value={dataNascimento} onChangeText={formatarData} keyboardType="numeric" maxLength={10} />
          <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Telefone" placeholderTextColor="#aaa" value={telefone} onChangeText={formatarTelefone} keyboardType="phone-pad" maxLength={15} />
          <TextInput style={styles.input} placeholder="Nome de usuário" placeholderTextColor="#aaa" value={username} onChangeText={setUsername} />
          <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#aaa" secureTextEntry value={senha} onChangeText={setSenha} />
          <TextInput style={styles.input} placeholder="Confirme a senha" placeholderTextColor="#aaa" secureTextEntry value={confirmSenha} onChangeText={setConfirmSenha} />

          {/* Checkbox de aceitação dos termos */}
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
            <CheckBox
              value={aceitouTermos}
              onValueChange={setAceitouTermos}
              tintColors={{ true: "#A1DEA6", false: "#aaa" }}
            />
            <Text style={{ color: "#fff", marginLeft: 8 }}>
              Li e aceito os{" "}
              <Text style={{ color: "#A1DEA6" }} onPress={() => navigation.navigate("Termos")}>
                Termos e Condições
              </Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleCadastro}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}
