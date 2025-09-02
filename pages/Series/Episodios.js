// Episodios.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styles } from '../../styles/seriesStyles';
import { getYoutubeId } from '../../utils/youtube';

export default function Episodios({ route, navigation }) {
  const { serieId } = route.params;
  const [episodios, setEpisodios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://0797850d892d.ngrok-free.app/api/episodios/?serie=${serieId}`)
      .then(response => response.json())
      .then(data => {
        setEpisodios(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [serieId]);

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
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.episodioCard}
            onPress={() =>
                navigation.navigate('Video', { videoId: getYoutubeId(item.link_video) })
            }
            >
                <Text style={styles.episodioTitulo}>Ep. {item.numero} - {item.titulo}</Text>
            </TouchableOpacity>
        )}
      />
    </View>
  );
}
