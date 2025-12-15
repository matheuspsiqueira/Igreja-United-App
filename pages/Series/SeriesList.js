import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { styles } from '../../styles/seriesStyles';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export default function SeriesList({ navigation }) {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useContext(ThemeContext);


  const fetchSeries = () => {
    setLoading(true);
    fetch('https://dcc446f53059.ngrok-free.app/api/series/')
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={series}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.cardBackground }]}
            onPress={() =>
              navigation.navigate('Episodios', { serieId: item.id, serieTitulo: item.titulo })
            }
          >
            <Image source={{ uri: item.capa }} style={styles.capa} />
            <Text style={[styles.titulo, { color: theme.text, backgroundColor: theme.card }]}>{item.titulo}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
