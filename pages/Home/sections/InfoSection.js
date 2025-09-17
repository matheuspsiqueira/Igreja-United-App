import React from "react";
import { View, Text } from "react-native";
import { homeStyles } from "../../../styles/homeStyles";

export default function InfoSection() {
  return (
    <View>
      <Text style={homeStyles.sectionTitle}>ℹ️ Informações</Text>
      <Text style={homeStyles.textItem}>
        Todos os direitos reservados
      </Text>
      <Text style={homeStyles.textItem}>
        © Copyright
      </Text>
    </View>
  );
}
