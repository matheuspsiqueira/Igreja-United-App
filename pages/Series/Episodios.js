import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { styles } from '../../styles/seriesStyles';
import { getYoutubeId } from '../../utils/youtube';

export default function Episodios({ route, navigation }) {
  const { serieId } = route.params;
  const [episodios, setEpisodios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEpisodios = () => {
    setLoading(true);
    fetch(`https://328aa325d573.ngrok-free.app/api/episodios/?serie=${serieId}`)
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
    <View style={styles.container}>
      <FlatList
        data={episodios}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.episodioCard}
            onPress={() => navigation.navigate('Video', { videoId: getYoutubeId(item.link_video) })}
          >
            <Text style={styles.episodioTitulo}>Ep. {item.numero} - {item.titulo}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
