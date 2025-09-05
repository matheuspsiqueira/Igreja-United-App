import React from "react";
import { View, Text } from "react-native";
import { homeStyles } from "../../../styles/homeStyles";
import { MaterialIcons } from "@expo/vector-icons";

export default function ContatosSection() {
  return (
    <View>
      <Text style={homeStyles.sectionTitle}>📞 Contatos</Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
        <MaterialIcons name="phone" size={20} color="#333" />
        <Text style={homeStyles.textItem}> (21) 99999-9999</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
        <MaterialIcons name="email" size={20} color="#333" />
        <Text style={homeStyles.textItem}> contato@united.com</Text>
      </View>
    </View>
  );
}
