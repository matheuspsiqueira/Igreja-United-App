import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  RefreshControl,
  TouchableWithoutFeedback,
} from "react-native";
import { Video } from "expo-av";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons"; // 👤 ícone do usuário
import { homeStyles } from "../../styles/homeStyles";
import { useFocusEffect } from "@react-navigation/native";

// Import das seções
import NewsSection from "./sections/NewsSection";
import AvisosSection from "./sections/AvisosSection";
import EventosSection from "./sections/EventosSection";
import ContatosSection from "./sections/ContatosSection";
import InfoSection from "./sections/InfoSection";

const { height } = Dimensions.get("window");

export default function Home({ navigation }) {
  const [selectedSection, setSelectedSection] = useState(null);

  // animação do popup
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

  const avisos = [
    "Domingo (24/08), teremos somente o culto da manhã às 10h",
    "Dia 24/08 teremos feijoada",
    "Sexta (22/08) teremos a 2ª Edição da Campanha do Agasalho",
  ];

  const [eventos, setEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [errorEventos, setErrorEventos] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  // 👉 Botão de usuário no header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={homeStyles.userButton}
          onPress={() => navigation.navigate("Perfil")}
        >
          <Ionicons name="person-circle-outline" size={30} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Buscar eventos
  const fetchEventos = async () => {
    try {
      setLoadingEventos(true);
      setErrorEventos(null);
      const response = await fetch(
        "https://ba49f7e370e1.ngrok-free.app/api/eventos/"
      );
      if (!response.ok) throw new Error("Erro ao buscar eventos");
      const data = await response.json();
      setEventos(data);
    } catch (error) {
      setErrorEventos("Não foi possível carregar os eventos.");
    } finally {
      setLoadingEventos(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  // Função para refresh total
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      setSelectedSection(null);
      await fetchEventos();
    } finally {
      setRefreshing(false);
    }
  };

  // animação do popup
  useEffect(() => {
    if (selectedSection) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectedSection]);

  const closePopup = () => setSelectedSection(null);

  // resetar ao perder foco
  useFocusEffect(
    React.useCallback(() => {
      setSelectedSection(null);
      setEventos([]);
      setErrorEventos(null);
      fetchEventos();

      return () => {
        setSelectedSection(null);
        setEventos([]);
        setErrorEventos(null);
      };
    }, [])
  );

  // renderizar conteúdo do popup
  const renderPopupContent = () => {
    if (selectedSection === "news") return <NewsSection />;
    if (selectedSection === "avisos") return <AvisosSection avisos={avisos} />;
    if (selectedSection === "eventos")
      return (
        <EventosSection
          eventos={eventos}
          loading={loadingEventos}
          error={errorEventos}
        />
      );
    if (selectedSection === "contatos") return <ContatosSection />;
    if (selectedSection === "Informações") return <InfoSection />;
    return null;
  };

  return (
    <View style={{ flex: 1 }}>
      <Video
        source={require("../../assets/videos/video-home.mp4")}
        style={homeStyles.backgroundVideo}
        shouldPlay
        isLooping
        isMuted
        resizeMode="cover"
      />

      <ScrollView
        style={homeStyles.overlay}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#a1dea6"]}
          />
        }
      >
        <View style={homeStyles.iconGrid}>

          <TouchableOpacity style={homeStyles.iconCard} onPress={() => setSelectedSection("sobre")}>
            <MaterialIcons name="church" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Sobre Nós</Text>
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.iconCard} onPress={() => setSelectedSection("news")}>
            <FontAwesome5 name="newspaper" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>United News</Text>
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.iconCard} onPress={() => setSelectedSection("ugroup")}>
            <MaterialIcons name="group" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>uGroup</Text>
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.iconCard} onPress={() => setSelectedSection("avisos")}>
            <MaterialIcons name="announcement" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Avisos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.iconCard} onPress={() => setSelectedSection("eventos")}>
            <MaterialIcons name="event" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Eventos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.iconCard} onPress={() => setSelectedSection("locais")}>
            <MaterialIcons name="location-on" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Locais</Text>
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.iconCard} onPress={() => setSelectedSection("informações")}>
            <MaterialIcons name="info-outline" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Informações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.iconCard} onPress={() => setSelectedSection("fale conosco")}>
            <MaterialIcons name="forum" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Fale Conosco</Text>
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.iconCard} onPress={() => setSelectedSection("compartilhar")}>
            <MaterialIcons name="share" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Compartilhar</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {selectedSection && (
        <TouchableWithoutFeedback onPress={closePopup}>
          <Animated.View
            style={[
              homeStyles.popupOverlay,
              {
                backgroundColor: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"],
                }),
              },
            ]}
          >
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  homeStyles.popupContent,
                  { transform: [{ translateY: slideAnim }] },
                ]}
              >
                <TouchableOpacity
                  onPress={closePopup}
                  style={homeStyles.popupCloseBtn}
                >
                  <Text style={homeStyles.popupCloseText}>✕</Text>
                </TouchableOpacity>
                {renderPopupContent()}
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}
