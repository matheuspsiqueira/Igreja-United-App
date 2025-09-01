import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Button,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Video } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { styles } from '../styles/seriesStyles';
import { Ionicons } from '@expo/vector-icons'; // para o ícone de seta

// Mock de séries e episódios
const series = [
  {
    id: '1',
    titulo: 'A Mesa',
    imagemCapa: require('../assets/img/card.jpeg'),
    episodios: [
      { id: '1', titulo: 'Ep. 1', arquivo: require('../assets/videos/loading.mp4') },
      { id: '2', titulo: 'Ep. 2', arquivo: require('../assets/videos/loading.mp4') },
      { id: '3', titulo: 'Ep. 3', arquivo: require('../assets/videos/loading.mp4') },
      { id: '4', titulo: 'Ep. 4', arquivo: require('../assets/videos/loading.mp4') },
    ],
  },
];

export default function Series() {
  const [tela, setTela] = useState('series'); // 'series', 'episodios', 'video'
  const [serieSelecionada, setSerieSelecionada] = useState(null);
  const [videoSelecionado, setVideoSelecionado] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const videoRef = useRef(null);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Evento chamado quando o usuário entra ou sai do full screen
  const handleFullscreenUpdate = async ({ fullscreenUpdate }) => {
    if (fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT) {
      // Entrou em full screen
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      setIsFullScreen(true);
    } else if (fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS) {
      // Saiu do full screen
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      setIsFullScreen(false);
    }
  };

  const renderSeries = () => (
    <View style={styles.container}>
      <Text style={styles.header}>Séries</Text>
      <FlatList
        data={series}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              setSerieSelecionada(item);
              setTela('episodios');
            }}
          >
            <Image source={item.imagemCapa} style={styles.capa} />
            <Text style={styles.titulo}>{item.titulo}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderEpisodios = () => (
    <View style={styles.container}>
      <Text style={styles.header}>{serieSelecionada.titulo}</Text>
      <FlatList
        data={serieSelecionada.episodios}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.episodioCard}
            onPress={() => {
              setVideoSelecionado(item.arquivo);
              setTela('video');
            }}
          >
            <Text style={styles.episodioTitulo}>{item.titulo}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderVideo = () => {
  const { width, height } = Dimensions.get('window');

  return (
    <View
      style={[
        styles.videoContainer,
        { width: isFullScreen ? height : width, height: isFullScreen ? width : height },
      ]}
    >
      {/* Botão de voltar sobreposto ao vídeo */}
      <TouchableOpacity
        onPress={() => setTela('episodios')}
        style={{
          position: 'absolute',
          top: 40,
          left: 20,
          zIndex: 10,
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: 8,
          borderRadius: 20,
        }}
      >
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <Video
        ref={videoRef}
        source={videoSelecionado}
        style={{ width: '100%', height: '100%' }}
        useNativeControls
        resizeMode="contain"
        shouldPlay
        onFullscreenUpdate={handleFullscreenUpdate}
      />
    </View>
  );
};

  if (tela === 'series') return renderSeries();
  if (tela === 'episodios') return renderEpisodios();
  if (tela === 'video') return renderVideo();
}
