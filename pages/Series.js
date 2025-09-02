import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import * as ScreenOrientation from 'expo-screen-orientation';
import { styles } from '../styles/seriesStyles';
import { Ionicons } from '@expo/vector-icons';

// Mock de séries e episódios com links do YouTube
const series = [
  {
    id: '1',
    titulo: 'A Mesa',
    imagemCapa: require('../assets/img/card.jpeg'),
    episodios: [
        { id: '1', titulo: 'Ep. 1', youtubeId: 'NoHCyyIhqHc' },
        { id: '2', titulo: 'Ep. 2', youtubeId: 'NoHCyyIhqHc' },
        { id: '3', titulo: 'Ep. 3', youtubeId: 'NoHCyyIhqHc' },
        { id: '4', titulo: 'Ep. 4', youtubeId: 'NoHCyyIhqHc' },
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
              setVideoSelecionado(item.youtubeId);
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

  const onFullScreenChange = async (isFullScreen) => {
    if (isFullScreen) {
      // Força landscape
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      setIsFullScreen(true);
    } else {
      // Volta para portrait
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      setIsFullScreen(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        width: isFullScreen ? height : width,
        height: isFullScreen ? width : height,
      }}
    >
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

      <YoutubePlayer
        ref={videoRef}
        height={isFullScreen ? width : 230}
        width={isFullScreen ? height : '100%'}
        play={true}
        videoId={videoSelecionado}
        onFullScreenChange={onFullScreenChange} // ⚡ Aqui
      />
    </View>
  );
};

  if (tela === 'series') return renderSeries();
  if (tela === 'episodios') return renderEpisodios();
  if (tela === 'video') return renderVideo();
}
