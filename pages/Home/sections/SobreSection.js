import React from "react";
import { View, Text } from "react-native";
import { homeStyles } from "../../../styles/homeStyles";
import { MaterialIcons } from "@expo/vector-icons";

export default function SobreSection() {
  return (
    <View>
      <Text style={homeStyles.sectionTitle}>⛪ Sobre a United</Text>

        <Text style={homeStyles.textItem}> Aqui você saberá um pouco mais sobre nós.</Text>
    </View>
  );
}
