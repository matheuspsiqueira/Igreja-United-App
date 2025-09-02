// SeriesListScreen.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { styles } from '../../styles/seriesStyles';

const series = [
  {
    id: '1',
    titulo: 'A Mesa',
    imagemCapa: require('../../assets/img/card.jpeg'),
    episodios: [
      { id: '1', titulo: 'Ep. 1', youtubeId: 'NoHCyyIhqHc' },
      { id: '2', titulo: 'Ep. 2', youtubeId: 'NoHCyyIhqHc' },
      { id: '3', titulo: 'Ep. 3', youtubeId: 'NoHCyyIhqHc' },
      { id: '4', titulo: 'Ep. 4', youtubeId: 'NoHCyyIhqHc' },
    ],
  },
];

export default function SeriesList({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Séries</Text>
      <FlatList
        data={series}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('Episodios', { serie: item, serieTitulo: item.titulo })
            }
          >
            <Image source={item.imagemCapa} style={styles.capa} />
            <Text style={styles.titulo}>{item.titulo}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
