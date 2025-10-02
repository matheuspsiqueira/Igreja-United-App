import React from "react";
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function LocaisSection() {
  // Exemplo de dados para os cards
  const locais = [
    { nome: "Tijuca", imagem: require("../../../assets/clientes.png") },
    { nome: "Campo Grande", imagem: require("../../../assets/clientes.png") },
    { nome: "Jacarepaguá", imagem: require("../../../assets/clientes.png") },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Igrejas e Implantações</Text>
      <Text style={styles.text}>
        Barra de busca.
      </Text>

      {locais.map((local, index) => (
        <TouchableOpacity key={index} style={styles.card}>
          <ImageBackground 
            source={local.imagem} 
            style={styles.cardBackground} 
            imageStyle={{ borderRadius: 10 }}
          >
            {/* Overlay acinzentado */}
            <View style={styles.overlay} />

            <Text style={styles.cardTitle}>{local.nome}</Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#fff" style={styles.arrowIcon} />
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    width: "100%",
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 50,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden", // importante para não mostrar a imagem fora do card
  },
  cardBackground: {
    height: 150,
    justifyContent: "center", // para posicionar a seta e título embaixo
    padding: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // cobre todo o card
    backgroundColor: 'rgba(0, 0, 0, 0.49)', // preto com 30% de opacidade
    borderRadius: 10,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 30,
    color: "#fff",
    textAlign: 'center'
  },
  arrowIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: '#f1f1f181',
    borderRadius: 50
  },
});
