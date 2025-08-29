import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Video } from 'expo-av';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { homeStyles } from '../styles/homeStyles';

const { height } = Dimensions.get("window");

export default function Home() {
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

  // Buscar eventos
  const fetchEventos = async () => {
    try {
      setLoadingEventos(true);
      setErrorEventos(null);
      const response = await fetch("https://441a830c253a.ngrok-free.app/api/eventos/");
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

  // animação de entrada e saída do popup
  useEffect(() => {
    if (selectedSection) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: height, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [selectedSection]);

  const closePopup = () => setSelectedSection(null);

  // render do conteúdo do popup
  const renderPopupContent = () => {
    if (selectedSection === "news") {
      return (
        <>
          <Text style={homeStyles.sectionTitle}>🎥 United News</Text>
          <View style={homeStyles.videoContainer}>
            <Video
              source={require("../assets/united-news.mp4")}
              style={homeStyles.innerVideo}
              shouldPlay
              isLooping
              useNativeControls={true}
              resizeMode="contain"
            />
          </View>
        </>
      );
    }

    if (selectedSection === "avisos") {
      return (
        <>
          <Text style={homeStyles.sectionTitle}>📢 Últimos Avisos</Text>
          {avisos.map((aviso, index) => (
            <Text key={index} style={homeStyles.textItem}>• {aviso}</Text>
          ))}
        </>
      );
    }

    if (selectedSection === "eventos") {
      return (
        <>
          <Text style={homeStyles.sectionTitle}>📅 Eventos da Semana</Text>
          {loadingEventos && <ActivityIndicator size="small" color="#000" />}
          {errorEventos && <Text style={homeStyles.textItem}>{errorEventos}</Text>}
          {!loadingEventos && !errorEventos && eventos.length === 0 && (
            <Text style={homeStyles.textItem}>Nenhum evento disponível.</Text>
          )}
          {!loadingEventos && !errorEventos && eventos.map((evento) => (
            <Text key={evento.id} style={homeStyles.textItem}>
              • {evento.titulo} ({evento.data}) ⏰ {evento.horario.substring(0, 5)}
            </Text>
          ))}
        </>
      );
    }

    return null;
  };

  return (
    <View style={{ flex: 1 }}>
      <Video
        source={require('../assets/video-home.mp4')}
        style={homeStyles.backgroundVideo}
        shouldPlay
        isLooping
        isMuted
        resizeMode="cover"
      />

      <ScrollView style={homeStyles.overlay}>
        <View style={homeStyles.iconGrid}>
          <TouchableOpacity style={homeStyles.iconCard} onPress={() => setSelectedSection("news")}>
            <FontAwesome5 name="newspaper" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>United News</Text>
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.iconCard} onPress={() => setSelectedSection("avisos")}>
            <MaterialIcons name="announcement" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Avisos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.iconCard} onPress={() => setSelectedSection("eventos")}>
            <MaterialIcons name="event" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Eventos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.iconCard} onPress={() => setSelectedSection("contatos")}>
            <MaterialIcons name="phone" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Contatos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* POPUP ANIMADO */}
      {selectedSection && (
        <Animated.View
          style={[
            homeStyles.popupOverlay,
            {
              backgroundColor: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"],
              }),
            }
          ]}
        >
          <Animated.View
            style={[
              homeStyles.popupContent,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <TouchableOpacity onPress={closePopup} style={homeStyles.popupCloseBtn}>
              <Text style={homeStyles.popupCloseText}>✕</Text>
            </TouchableOpacity>
            {renderPopupContent()}
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}
