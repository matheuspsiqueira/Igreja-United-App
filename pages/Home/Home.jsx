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
import { FontAwesome5, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import useAuth from "../Usuarios/useAuth";
import { homeStyles } from "../../styles/homeStyles";

// Import das seções
import NewsSection from "./sections/NewsSection";
import AvisosSection from "./sections/AvisosSection";
import EventosSection from "./sections/EventosSection";
import ContatosSection from "./sections/ContatosSection";
import ConciergeSection from "./sections/ConciergeSection";
import UGroupSection from "./sections/uGroupSection";
import SobreSection from "./sections/SobreSection";
import LocaisSection from "./sections/LocaisSection";
import RelevanciaSection from "./sections/RelevanciaSection";
import VoluntariosSection from "./sections/VoluntariosSection";
import MembrosSection from "./sections/MembrosSection";
import AgendaSection from "./sections/AgendaSection";


const { height } = Dimensions.get("window");

export default function Home({ navigation }) {
  const [selectedSection, setSelectedSection] = useState(null);

  // Animação do popup
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

  const [refreshing, setRefreshing] = useState(false);

  // Botão de usuário no header
  const { user } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={homeStyles.userButton}
          onPress={() => navigation.navigate(user ? "Perfil" : "Login")}
        >
          <Ionicons name="person-circle-outline" size={30} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, user]);

  // Refresh total (zera popup ao puxar pra baixo)
  const onRefresh = async () => {
    setRefreshing(true);
    setSelectedSection(null);
    setRefreshing(false);
  };

  // Animação do popup
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

  // Resetar ao perder foco
  useFocusEffect(
    React.useCallback(() => {
      setSelectedSection(null);
      return () => setSelectedSection(null);
    }, [])
  );

  // Renderizar conteúdo do popup
  const renderPopupContent = () => {
    if (selectedSection === "news") return <NewsSection />;
    if (selectedSection === "avisos") return <AvisosSection />;
    if (selectedSection === "eventos") return <EventosSection />;
    if (selectedSection === "contatos") return <ContatosSection />;
    if (selectedSection === "concierge") return <ConciergeSection />;
    if (selectedSection === "ugroup") return <UGroupSection />;
    if (selectedSection === "sobre") return <SobreSection />;
    if (selectedSection === "locais") return <LocaisSection />;
    if (selectedSection === "relevancia") return <RelevanciaSection />;
    if (selectedSection === "voluntarios") return <VoluntariosSection />;
    if (selectedSection === "membros") return <MembrosSection />;
    if (selectedSection === "agenda") return <AgendaSection />;
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
        scrollEnabled={!selectedSection}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#a1dea6"]}
          />
        }
      >
        <View style={homeStyles.iconGrid}>
          <TouchableOpacity
            style={homeStyles.iconCard}
            onPress={() => setSelectedSection("sobre")}
          >
            <MaterialIcons name="church" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Sobre Nós</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={homeStyles.iconCard}
            onPress={() => setSelectedSection("news")}
          >
            <FontAwesome5 name="newspaper" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>United News</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={homeStyles.iconCard}
            onPress={() => setSelectedSection("ugroup")}
          >
            <MaterialIcons name="group" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>uGroup</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={homeStyles.iconCard}
            onPress={() => setSelectedSection("avisos")}
          >
            <MaterialIcons name="error-outline" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Avisos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={homeStyles.iconCard}
            onPress={() => setSelectedSection("eventos")}
          >
            <MaterialIcons name="event" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Eventos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={homeStyles.iconCard}
            onPress={() => navigation.navigate("Locais")}
          >
            <MaterialIcons name="location-on" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Locais</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={homeStyles.iconCard}
            onPress={() => setSelectedSection("agenda")}
          >
            <MaterialIcons name="calendar-month" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Agenda</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={homeStyles.iconCard}
            onPress={() => setSelectedSection("membros")}
          >
            <MaterialIcons name="badge" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Seja membro</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={homeStyles.iconCard}
            onPress={() => setSelectedSection("voluntarios")}
          >
            <MaterialIcons name="assignment-ind" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Seja voluntário</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={homeStyles.iconCard}
            onPress={() => setSelectedSection("contatos")}
          >
            <MaterialIcons name="forum" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Fale Conosco</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={homeStyles.iconCard}
            onPress={() => setSelectedSection("concierge")}
          >
            <MaterialIcons name="desk" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Concierge</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={homeStyles.iconCard}
            onPress={() => setSelectedSection("relevancia")}
          >
            <MaterialIcons name="ads-click" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Projeto relevância</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {selectedSection && (
        <Animated.View
          style={[
            homeStyles.popupOverlay,
            {
              backgroundColor: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"],
              }),
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          {/* Touchable para fechar ao clicar fora */}
          <TouchableWithoutFeedback onPress={closePopup}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          </TouchableWithoutFeedback>

          {/* Conteúdo do popup */}
          <Animated.View
            style={[
              homeStyles.popupContent,
              {
                transform: [{ translateY: slideAnim }],
                maxHeight: height * 0.6,
                width: '90%',
              },
            ]}
          >
            <TouchableOpacity
              onPress={closePopup}
              style={homeStyles.popupCloseBtn}
            >
              <Text style={homeStyles.popupCloseText}>✕</Text>
            </TouchableOpacity>

            {/* Scroll do popup */}
            <ScrollView
              contentContainerStyle={{ paddingBottom: 20 }}
              nestedScrollEnabled={true}
            >
              {renderPopupContent()}
            </ScrollView>
          </Animated.View>
        </Animated.View>
      )}

    </View>
  );
}
