// EpisodiosScreen.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/seriesStyles';

export default function Episodios({ route, navigation }) {
  const { serie } = route.params;

  return (
    <View style={styles.container}>
      <FlatList
        data={serie.episodios}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.episodioCard}
            onPress={() =>
              navigation.navigate('Video', { videoId: item.youtubeId })
            }
          >
            <Text style={styles.episodioTitulo}>{item.titulo}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
