import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, RefreshControl, ScrollView } from "react-native";
import { homeStyles } from "../../../styles/homeStyles";

export default function EventosSection() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Buscar eventos
  const fetchEventos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://ba49f7e370e1.ngrok-free.app/api/eventos/");
      if (!response.ok) throw new Error("Erro ao buscar eventos");
      const data = await response.json();
      setEventos(data);
    } catch {
      setError("Não foi possível carregar os eventos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchEventos();
    } finally {
      setRefreshing(false);
    }
  };

  const eventosPorData = eventos.reduce((acc, evento) => {
    if (!acc[evento.data]) acc[evento.data] = [];
    acc[evento.data].push(evento);
    return acc;
  }, {});

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#a1dea6"]} />
      }
    >
      <Text style={homeStyles.sectionTitle}>📅 Eventos da Semana</Text>

      {loading && <ActivityIndicator size="small" color="#000" />}
      {error && <Text style={homeStyles.textItem}>{error}</Text>}
      {!loading && !error && eventos.length === 0 && (
        <Text style={homeStyles.textItem}>Nenhum evento disponível.</Text>
      )}

      {!loading && !error &&
        Object.keys(eventosPorData).map((data) => (
          <View key={data} style={{ marginBottom: 10 }}>
            <Text style={homeStyles.sectionTitle}>
              {data.split("-")[2]}/{data.split("-")[1]}
            </Text>
            {eventosPorData[data].map((evento) => (
              <Text key={evento.id} style={homeStyles.textItem}>
                • {evento.titulo} às {evento.horario.substring(0, 5)}
              </Text>
            ))}
          </View>
        ))}
    </ScrollView>
  );
}
