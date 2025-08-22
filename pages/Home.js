import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Platform,
  UIManager,
} from 'react-native';
import { Video } from 'expo-av';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { homeStyles } from '../styles/homeStyles';

// Habilitar animações no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  // Animations independentes
  const newsAnim = useRef(new Animated.Value(0)).current;
  const avisosAnim = useRef(new Animated.Value(0)).current;
  const eventosAnim = useRef(new Animated.Value(0)).current;

  // Alturas reais
  const [newsHeight, setNewsHeight] = useState(0);
  const [avisosHeight, setAvisosHeight] = useState(0);
  const [eventosHeight, setEventosHeight] = useState(0);

  const avisos = [
    "Domingo (24/08), teremos somente o culto da manhã às 10h",
    "Dia 24/08 teremos feijoada",
    "Sexta (22/08) teremos a 2ª Edição da Campanha do Agasalho",
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
      newsAnim.setValue(0);
      avisosAnim.setValue(0);
      eventosAnim.setValue(0);
    }, 1500);
  }, []);

  const toggleSection = (section) => {
  if (selectedSection === section) {
    // Fecha a mesma seção
    Animated.timing(
      section === 'news' ? newsAnim :
      section === 'avisos' ? avisosAnim : eventosAnim,
      { toValue: 0, duration: 300, useNativeDriver: false }
    ).start(() => setSelectedSection(null));
    return;
  }

  // Abre a nova seção e fecha as outras simultaneamente
  Animated.parallel([
    Animated.timing(newsAnim, { toValue: section === 'news' ? 1 : 0, duration: 300, useNativeDriver: false }),
    Animated.timing(avisosAnim, { toValue: section === 'avisos' ? 1 : 0, duration: 300, useNativeDriver: false }),
    Animated.timing(eventosAnim, { toValue: section === 'eventos' ? 1 : 0, duration: 300, useNativeDriver: false }),
  ]).start(() => setSelectedSection(section));
};

  // --- Renderização de seções ---
  const renderNewsSection = () => {
    if (!selectedSection || selectedSection !== 'news') return null;

    const height = newsAnim.interpolate({ inputRange: [0, 1], outputRange: [0, newsHeight] });

    return (
      <Animated.View style={[homeStyles.sectionContent, { height, overflow: 'hidden' }]}>
        <View
          style={{ position: 'absolute', left: 0, right: 0 }}
          onLayout={(e) => setNewsHeight(e.nativeEvent.layout.height)}
        >
          <Text style={homeStyles.sectionTitle}>🎥 United News</Text>
          <View style={homeStyles.videoContainer}>
            <Video
              source={require('../assets/united-news.mp4')}
              style={homeStyles.innerVideo}
              shouldPlay
              isLooping
              useNativeControls={true}
              resizeMode="contain"
            />
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderAvisosSection = () => {
    if (!selectedSection || selectedSection !== 'avisos') return null;

    const height = avisosAnim.interpolate({ inputRange: [0, 1], outputRange: [0, avisosHeight] });

    return (
      <Animated.View style={[homeStyles.sectionContent, { height, overflow: 'hidden' }]}>
        <View
          style={{ position: 'absolute', left: 0, right: 0 }}
          onLayout={(e) => setAvisosHeight(e.nativeEvent.layout.height)}
        >
          <Text style={homeStyles.sectionTitle}>📢 Últimos Avisos</Text>
          {avisos.map((aviso, index) => (
            <Text key={index} style={homeStyles.textItem}>• {aviso}</Text>
          ))}
        </View>
      </Animated.View>
    );
  };

  const renderEventosSection = () => {
    if (!selectedSection || selectedSection !== 'eventos') return null;

    const height = eventosAnim.interpolate({ inputRange: [0, 1], outputRange: [0, eventosHeight] });

    return (
      <Animated.View style={[homeStyles.sectionContent, { height, overflow: 'hidden' }]}>
        <View
          style={{ position: 'absolute', left: 0, right: 0 }}
          onLayout={(e) => setEventosHeight(e.nativeEvent.layout.height)}
        >
          <Text style={homeStyles.sectionTitle}>📅 Eventos da Semana</Text>
          {eventos.map((evento, index) => (
            <Text key={index} style={homeStyles.textItem}>
              • {evento.day}: {evento.title}
            </Text>
          ))}
        </View>
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={homeStyles.iconGrid}>
          <TouchableOpacity style={homeStyles.iconCard} onPress={() => toggleSection('news')}>
            <FontAwesome5 name="newspaper" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>United News</Text>
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.iconCard} onPress={() => toggleSection('avisos')}>
            <MaterialIcons name="announcement" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Avisos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.iconCard} onPress={() => toggleSection('eventos')}>
            <MaterialIcons name="event" size={35} color="#fff" />
            <Text style={homeStyles.cardText}>Eventos</Text>
          </TouchableOpacity>
        </View>

        {renderNewsSection()}
        {renderAvisosSection()}
        {renderEventosSection()}
      </ScrollView>
    </View>
  );
}
