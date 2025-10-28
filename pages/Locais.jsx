import React, { useState, useRef, useContext, useEffect } from "react";
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
  TextInput,
} from "react-native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext";

export default function Locais({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [search, setSearch] = useState("");
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://9233e498ae33.ngrok-free.app/api/locais/") // URL da sua API
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((local) => ({
          nome: local.nome,
          imagem: { uri: local.imagem },
          pastor: {
            foto: { uri: local.pastor_foto },
            nome: local.pastor_nome,
            descricao: local.descricao,
            horarios: local.horarios.map(
              (h) =>
                `${["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"][h.weekday]} | ${h.hora.slice(0,5)}`
            ),
            localizacao: local.localizacao,
            instagram: local.instagram,
            spotify: local.spotify,
          },
        }));
        setLocais(formatted);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredLocais = locais.filter((local) =>
    local.nome.toLowerCase().includes(search.toLowerCase())
  );

  const openLink = async (url) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Erro", "Não foi possível abrir o link");
    }
  };

  const openMaps = (address) => {
    const url = Platform.select({
      ios: `http://maps.apple.com/?q=${encodeURIComponent(address)}`,
      android: `geo:0,0?q=${encodeURIComponent(address)}`,
    });

    Linking.canOpenURL(url)
      .then((supported) => supported && Linking.openURL(url))
      .catch(() => Alert.alert("Erro", "Não foi possível abrir o mapa"));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {loading ? (
        <Text style={{ color: theme.text, textAlign: "center", marginTop: 50 }}>
          Carregando...
        </Text>
      ) : (
        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: theme.text }]}>
            Igrejas e Implantações
          </Text>

          {/* Barra de busca */}
          <View
            style={[
              styles.searchContainer,
              {
                backgroundColor:
                  theme.inputBackground ||
                  (theme.background === "#121212" || theme.background === "#000"
                    ? "#2a2a2a"
                    : "#e6e6e6"),
                height: 48,
                borderRadius: 25,
              },
            ]}
          >
            <TextInput
              placeholder="Buscar local..."
              placeholderTextColor={theme.textSecondary || "#999"}
              value={search}
              onChangeText={setSearch}
              style={[
                styles.searchInput,
                {
                  color: theme.text,
                  flex: 1,
                  paddingLeft: 15,
                  fontSize: 15,
                },
              ]}
            />

            <MaterialIcons
              name="search"
              size={24}
              color={theme.textSecondary || theme.text}
              style={{ marginRight: 8 }}
            />
          </View>

          {filteredLocais.length > 0 ? (
            filteredLocais.map((local, index) => (
              <ExpandableCard
                key={index}
                local={local}
                theme={theme}
                openLink={openLink}
                openMaps={openMaps}
              />
            ))
          ) : (
            <Text
              style={[styles.noResults, { color: theme.textSecondary || theme.text }]}
            >
              Nenhum local encontrado.
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

function ExpandableCard({ local, theme, openLink, openMaps }) {
  const [expanded, setExpanded] = useState(false);
  const animHeight = useRef(new Animated.Value(150)).current; 
  const animContent = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    const toValueHeight = expanded ? 150 : 80;
    const toValueContent = expanded ? 0 : 300;

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
      }),
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
            backgroundColor: theme.backgroundSecondary || theme.background,
          },
        ]}
      >
        <View style={styles.contentRow}>
          <Image source={local.pastor.foto} style={styles.pastorPhoto} />

          <View style={styles.contentRight}>
            <Text style={[styles.pastorName, { color: theme.text }]}>
              {local.pastor.nome}
            </Text>
            <Text style={[styles.pastorDesc, { color: theme.text }]}>
              {local.pastor.descricao}
            </Text>

            {local.pastor.horarios.map((horario, index) => (
              <Text key={index} style={[styles.pastorHorarios, { color: theme.text }]}>
                {horario}
              </Text>
            ))}

            <Text style={[styles.pastorLocation, { color: theme.text }]}>
              {local.pastor.localizacao}
            </Text>

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

        <View style={styles.locationRow}>
          <Text style={[styles.locationText, { color: theme.text }]}>
            Localização ---------------------
          </Text>

          <TouchableOpacity onPress={() => openMaps(local.pastor.localizacao)}>
            <Image
              source={require("../assets/google-maps.png")}
              style={styles.mapIcon}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20 },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 15, lineHeight: 45 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 16 },
  noResults: { fontSize: 16, textAlign: "center", marginTop: 40 },
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
  pastorDesc: { fontSize: 13, lineHeight: 20, marginBottom: 10 },
  pastorHorarios: { fontSize: 14, marginVertical: 2, lineHeight: 15 },
  pastorLocation: { fontSize: 13, marginTop: 15 },
  socialIcons: { flexDirection: "row", marginTop: 5 },
  locationRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 10, width: "100%" },
  locationText: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  mapIcon: { width: 50, height: 50, resizeMode: "contain" },
});
