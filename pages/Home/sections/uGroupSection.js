import React from "react";
import { View, Text } from "react-native";
import { homeStyles } from "../../../styles/homeStyles";
import { MaterialIcons } from "@expo/vector-icons";

export default function UGroupSection() {
  return (
    <View>
      <Text style={homeStyles.sectionTitle}>👨‍👩‍👦‍👦 Nossos uGroups</Text>

        <Text style={homeStyles.textItem}> Aqui você verá onde acontecem .</Text>
    </View>
  );
}