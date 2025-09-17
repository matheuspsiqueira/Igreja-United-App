import React from "react";
import { View, Text } from "react-native";
import { homeStyles } from "../../../styles/homeStyles";
import { MaterialIcons } from "@expo/vector-icons";

export default function LocaisSection() {
  return (
    <View>
      <Text style={homeStyles.sectionTitle}>📍 Onde estamos</Text>

        <Text style={homeStyles.textItem}> Aqui você verá onde estamos localizados.</Text>
    </View>
  );
}