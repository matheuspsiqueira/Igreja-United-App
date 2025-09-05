import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { homeStyles } from "../../../styles/homeStyles";

export default function EventosSection({ eventos, loading, error }) {
  const eventosPorData = eventos.reduce((acc, evento) => {
    if (!acc[evento.data]) acc[evento.data] = [];
    acc[evento.data].push(evento);
    return acc;
  }, {});

  return (
    <>
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
              {data.split('-')[2]}/{data.split('-')[1]}
            </Text>
            {eventosPorData[data].map((evento) => (
              <Text key={evento.id} style={homeStyles.textItem}>
                • {evento.titulo} às {evento.horario.substring(0, 5)}
              </Text>
            ))}
          </View>
        ))
      }
    </>
  );
}