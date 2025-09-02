// SeriesList.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { styles } from '../../styles/seriesStyles';

export default function SeriesList({ navigation }) {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://0797850d892d.ngrok-free.app/api/series/') // Android emulador -> 10.0.2.2, em device real -> IP da máquina
      .then(response => response.json())
      .then(data => {
        setSeries(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Séries</Text>
      <FlatList
        data={series}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('Episodios', { serieId: item.id, serieTitulo: item.titulo })
            }
          >
            <Image source={{ uri: item.capa }} style={styles.capa} />
            <Text style={styles.titulo}>{item.titulo}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
