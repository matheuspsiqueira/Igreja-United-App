import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { styles } from '../../styles/seriesStyles';

export default function SeriesList({ navigation }) {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSeries = () => {
    setLoading(true);
    fetch('https://8937adbb8e22.ngrok-free.app/api/series/')
      .then(response => response.json())
      .then(data => {
        setSeries(data);
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
    fetchSeries();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSeries();
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
        data={series}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
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
