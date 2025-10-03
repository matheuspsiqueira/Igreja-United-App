import React, { useState, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { ThemeContext } from "../../../context/ThemeContext";



// Função para abrir as redes sociais
const openLink = async (url) => {
  try {
    await Linking.openURL(url);
  } catch (err) {
    Alert.alert("Erro", "Não foi possível abrir o link");
    console.error(err);
  }
};


// Função para abrir o endereço no Maps
const openMaps = (address) => {
  const url = Platform.select({
    ios: `http://maps.apple.com/?q=${encodeURIComponent(address)}`,
    android: `geo:0,0?q=${encodeURIComponent(address)}`,
  });

  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        Alert.alert("Erro", "Não foi possível abrir o mapa");
      }
    })
    .catch((err) => console.error(err));
};




export default function LocaisSection() {
  const { theme } = useContext(ThemeContext);

  const locais = [
    { 
      nome: "Jacarepaguá", 
      imagem: require("../../../assets/fundo-locais.png"),
      pastor: {
        foto: require("../../../assets/Prs.png"),
        nome: "Prs. Igor e Thayane Burlamaqui",
        descricao: "Estejam conosco em um de nossos cultos:",
        horarios: [
          "Terças | 10h",
          "Quintas | 20h",
          "Domingo | 10h"
        ],
        localizacao: "Estrada do Tindiba 570, Taquara",
        instagram: "https://www.instagram.com/igrejaunitedjacarepagua?igsh=MW1hMzZpazEzYzF1eg==",
        spotify: "https://open.spotify.com/show/5L33woYmqlNSKHL6aWTHoF"
      }
    },
    { 
      nome: "Tijuca", 
      imagem: require("../../../assets/fundo-locais.png"),
      pastor: {
        foto: require("../../../assets/clientes.png"),
        nome: "Pr. Carlos Lima",
        descricao: "Pastor auxiliar, coordenador de jovens.",
        horarios: [
          "Segundas | 19h",
          "Quartas | 20h"
        ],
        localizacao: "Av. Cesário de Melo, 5000",
        instagram: "https://instagram.com/carloslima",
        spotify: "https://spotify.com/carloslima"
      }
    },
    { 
      nome: "Campo Grande", 
      imagem: require("../../../assets/fundo-locais.png"),
      pastor: {
        foto: require("../../../assets/clientes.png"),
        nome: "Pr. Carlos Lima",
        descricao: "Pastor auxiliar, coordenador de jovens.",
        horarios: [
          "Segundas | 19h",
          "Quartas | 20h"
        ],
        localizacao: "Av. Cesário de Melo, 5000",
        instagram: "https://instagram.com/carloslima",
        spotify: "https://spotify.com/carloslima"
      }
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Igrejas e Implantações</Text>
      <Text style={[styles.text, { color: theme.text }]} >Barra de busca.</Text>

      {locais.map((local, index) => (
        <ExpandableCard key={index} local={local} theme={theme} />
      ))}
    </ScrollView>
  );
}

function ExpandableCard({ local, theme }) {
  const [expanded, setExpanded] = useState(false);
  const animHeight = useRef(new Animated.Value(150)).current; 
  const animContent = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    const toValueHeight = expanded ? 150 : 80;
    const toValueContent = expanded ? 0 : 300; // altura ajustada

    Animated.parallel([
      Animated.timing(animHeight, {
        toValue: toValueHeight,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
      Animated.timing(animContent, {
        toValue: toValueContent,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      })
    ]).start();

    setExpanded(!expanded);
  };

  const contentOpacity = animContent.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={toggleExpand} activeOpacity={0.9}>
        <Animated.View style={{ height: animHeight }}>
          <ImageBackground
            source={local.imagem}
            style={styles.cardBackground}
            imageStyle={{ borderRadius: 10 }}
          >
            <View style={styles.overlay} />
            <Text style={styles.cardTitle}>{local.nome}</Text>
            <MaterialIcons
              name={expanded ? "arrow-drop-up" : "arrow-drop-down"}
              size={28}
              color="#fff"
              style={styles.arrowIcon}
            />
          </ImageBackground>
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.extraContent,
          {  
            height: animContent,
            opacity: contentOpacity,
            backgroundColor: theme.backgroundSecondary || theme.background
          }
        ]}
      >
        <View style={styles.contentRow}>
          {/* Imagem à esquerda */}
          <Image source={local.pastor.foto} style={styles.pastorPhoto} />

          {/* Conteúdo à direita */}
          <View style={styles.contentRight}>
            <Text style={[styles.pastorName, { color: theme.text }]}>
              {local.pastor.nome}
            </Text>
            <Text style={[styles.pastorDesc, { color: theme.text }]}>
              {local.pastor.descricao}
            </Text>

            {/* Horários renderizados automaticamente */}
            {local.pastor.horarios.map((horario, index) => (
              <Text key={index} style={[styles.pastorHorarios, { color: theme.text }]}>
                {horario}
              </Text>
            ))}

            {/* Endereço */}
            <Text style={[styles.pastorLocation, { color: theme.text }]}>
              {local.pastor.localizacao}
            </Text>

            {/* Ícones sociais */}
            <View style={styles.socialIcons}>
              <TouchableOpacity onPress={() => openLink(local.pastor.instagram)}>
                <Entypo name="instagram" size={24} color="#C13584" style={{ marginRight: 10 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openLink(local.pastor.spotify)}>
                <Entypo name="spotify" size={24} color="#1DB954" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Localização com ícone */}
        <View style={styles.locationRow}>
          <Text style={[styles.locationText, { color: theme.text }]}>
            Localização ---------------------
          </Text>

          <TouchableOpacity onPress={() => openMaps(local.pastor.localizacao)}>
            <Image
              source={require("../../../assets/google-maps.png")}
              style={styles.mapIcon}
            />
          </TouchableOpacity>

        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 15 },
  text: { fontSize: 16, marginBottom: 20, width: "100%", padding: 15, borderRadius: 50 },
  card: { marginBottom: 15, borderRadius: 10, overflow: "hidden" },
  cardBackground: { flex: 1, justifyContent: "center", padding: 15 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)", borderRadius: 10 },
  cardTitle: { fontWeight: "bold", fontSize: 26, color: "#fff", textAlign: "center" },
  arrowIcon: { position: "absolute", bottom: 10, right: 10, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 50 },
  extraContent: { padding: 10, overflow: "hidden" },
  contentRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  pastorPhoto: { width: 80, height: 80, borderRadius: 40, marginRight: 15 },
  contentRight: { flex: 1 },
  pastorName: { fontSize: 14, fontWeight: "bold", marginBottom: 10 },
  pastorDesc: { fontSize: 13, marginVertical: 2, lineHeight: 20, marginBottom: 10 },
  pastorHorarios: { fontSize: 14, marginVertical: 2, lineHeight: 15 },
  pastorLocation: { fontSize: 13, marginTop: 15 },
  socialIcons: { flexDirection: "row", marginTop: 5 },
  locationRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 10, width: "100%", },
  locationText: { fontSize: 18, fontWeight: "bold", marginBottom: 10},
  mapIcon: { width: 50, height: 50, resizeMode: "contain"}
});
