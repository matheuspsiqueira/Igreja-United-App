import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";

export default function Termos() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }} // espaço extra no final
    >
      <Text style={styles.title}>Termos e Condições</Text>

      <Text style={styles.text}>
        Este aplicativo coleta e trata dados pessoais como nome, data de
        nascimento, e-mail e telefone, em conformidade com a Lei Geral de
        Proteção de Dados (LGPD).
      </Text>

      <Text style={styles.subtitle}>Finalidade do Uso dos Dados</Text>
      <Text style={styles.text}>
        Os dados são utilizados exclusivamente para cadastro e funcionalidades
        do aplicativo. Não serão compartilhados com terceiros sem consentimento.
      </Text>

      <Text style={styles.subtitle}>Direitos do Usuário</Text>
      <Text style={styles.text}>
        Você pode solicitar a correção, exclusão ou portabilidade dos seus dados
        a qualquer momento, conforme previsto na LGPD.
      </Text>

      <Text style={styles.subtitle}>Responsabilidades</Text>
      <Text style={styles.text}>
        O usuário é responsável por fornecer informações verdadeiras. O
        aplicativo compromete-se a proteger os dados contra acessos não
        autorizados, utilizando criptografia e medidas de segurança alinhadas à
        LGPD.
      </Text>

      <Text style={styles.subtitle}>Contato</Text>
      <Text style={styles.text}>
        Para exercer seus direitos, tirar dúvidas ou solicitar informações
        adicionais sobre o tratamento dos seus dados, entre em contato pelo
        e-mail: suporte@appunited.com
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  subtitle: { fontSize: 18, fontWeight: "600", marginTop: 16 },
  text: { fontSize: 16, marginTop: 8, lineHeight: 22 },
});
