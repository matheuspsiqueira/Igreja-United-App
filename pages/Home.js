import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  View, Text, ScrollView, RefreshControl, TouchableOpacity, Animated, Platform, UIManager 
} from 'react-native';
import { homeStyles } from '../styles/homeStyles';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Video } from 'expo-av';

// Habilitar animações no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const slideAnim = useRef(new Animated.Value(0)).current; // animação de altura

  const avisos = [
    "Domingo (24/08), teremos somente o culto da manhã às 10h",
    "Dia 24/08 teremos feijoada",
    "Sexta (22/08) teremos a 2ª Edição da Campanha do Agasalho"
  ];

  const eventos = [
    { title: "Culto", day: "Domingo" },
    { title: "MidWeek", day: "Quinta-feira" },
  ];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setSelectedSection(null);
      setRefreshing(false);
      slideAnim.setValue(0);
    }, 1500);
  }, []);

  const toggleSection = (section) => {
    if (selectedSection === section) {
      // fecha a seção
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setSelectedSection(null));
    } else {
      setSelectedSection(section);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const renderContent = () => {
    if (!selectedSection) return null;

    let content = null;
    switch (selectedSection) {
      case "news":
        content = (
          <Video
            source={require('../assets/united-news.mp4')}
            style={homeStyles.innerVideo}
            shouldPlay
            isLooping
            resizeMode="contain"
          />
        );
        break;
      case "avisos":
        content = avisos.map((aviso, index) => (
          <Text key={index} style={homeStyles.textItem}>• {aviso}</Text>
        ));
        break;
      case "eventos":
        content = eventos.map((evento, index) => (
          <Text key={index} style={homeStyles.textItem}>• {evento.day}: {evento.title}</Text>
        ));
        break;
    }

    const height = slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 400], // altura máxima da seção
    });

    return (
      <Animated.View style={[homeStyles.sectionContent, { height }]}>
  {selectedSection && <Text style={homeStyles.sectionTitle}>
    {selectedSection === "news" ? "🎥 United News" : selectedSection === "avisos" ? "📢 Últimos Avisos" : "📅 Eventos da Semana"}
  </Text>}
  {selectedSection === "news" && (
    <View style={homeStyles.videoContainer}>
      <Video
        source={require('../assets/united-news.mp4')}
        style={homeStyles.innerVideo}
        shouldPlay
        isLooping
        resizeMode="cover" // preenche totalmente o container
      />
    </View>
  )}
  {selectedSection === "avisos" && avisos.map((aviso, index) => (
    <Text key={index} style={homeStyles.textItem}>• {aviso}</Text>
  ))}
  {selectedSection === "eventos" && eventos.map((evento, index) => (
    <Text key={index} style={homeStyles.textItem}>• {evento.day}: {evento.title}</Text>
  ))}
</Animated.View>
    );
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

      <ScrollView
        style={homeStyles.overlay}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={homeStyles.iconGrid}>
          <TouchableOpacity style={homeStyles.iconCard} onPress={() => toggleSection("news")}>
            <FontAwesome5 name="newspaper" size={40} color="#fff" />
            <Text style={homeStyles.cardText}>United News</Text>
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.iconCard} onPress={() => toggleSection("avisos")}>
            <MaterialIcons name="announcement" size={40} color="#fff" />
            <Text style={homeStyles.cardText}>Avisos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.iconCard} onPress={() => toggleSection("eventos")}>
            <MaterialIcons name="event" size={40} color="#fff" />
            <Text style={homeStyles.cardText}>Eventos</Text>
          </TouchableOpacity>
        </View>

        {renderContent()}
      </ScrollView>
    </View>
  );
}
