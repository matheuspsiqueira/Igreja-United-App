import React from "react";
import { View, Text } from "react-native";
import { homeStyles } from "../../../styles/homeStyles";
import { MaterialIcons } from "@expo/vector-icons";

export default function RelevanciaSection() {
    return (
        <View>
          <Text style={homeStyles.sectionTitle}>Projeto Relevância</Text>
          <Text style={homeStyles.textItem}>
            Todos os direitos reservados
          </Text>
          <Text style={homeStyles.textItem}>
            © Copyright
          </Text>
        </View>
      );
}