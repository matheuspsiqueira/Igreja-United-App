import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { styles } from '../../styles/seriesStyles';
import { getYoutubeId } from '../../utils/youtube';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export default function Episodios({ route, navigation }) {
  const { serieId } = route.params;
  const [episodios, setEpisodios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useContext(ThemeContext);


  const fetchEpisodios = () => {
    setLoading(true);
    fetch(`https://5af7188494d0.ngrok-free.app/api/episodios/?serie=${serieId}`)
      .then(response => response.json())
      .then(data => {
        const sorted = data.sort((a, b) => a.numero - b.numero);
        setEpisodios(sorted);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchEpisodios();
  }, [serieId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEpisodios();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={episodios}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.episodioCard, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate('Video', { videoId: getYoutubeId(item.link_video) })}
          >
            <Text style={[styles.episodioTitulo, { color: theme.text }]}>
              Ep. {item.numero} - {item.titulo}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
