import React from "react";
import { Text } from "react-native";
import { homeStyles } from "../../../styles/homeStyles";

export default function AvisosSection({ avisos }) {
  return (
    <>
      <Text style={homeStyles.sectionTitle}>📢 Últimos Avisos</Text>
      {avisos.map((aviso, index) => (
        <Text key={index} style={homeStyles.textItem}>• {aviso}</Text>
      ))}
    </>
  );
}
