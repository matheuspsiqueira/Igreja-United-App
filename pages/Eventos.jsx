import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Eventos() {
  const { theme } = useContext(ThemeContext);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://a61b3999ebcb.ngrok-free.app/api/eventos/");
      if (!response.ok) throw new Error("Erro ao buscar eventos");
      const data = await response.json();
      setEventos(data);
    } catch (err) {
      setError("Não foi possível carregar os eventos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEventos();
    setRefreshing(false);
  };

  // ✅ Converter data para "13 de Setembro de 2025"
  const formatDate = (dataStr) => {
    const [year, month, day] = dataStr.split("-");
    const meses = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];
    return `${parseInt(day)} de ${meses[parseInt(month) - 1]}`;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={[styles.title, { color: theme.text }]}>Eventos</Text>
      <Text style={[styles.subtitle, { color: theme.subtitle }]}>United</Text>

      {loading && <ActivityIndicator size="large" color={theme.text} />}
      {error && <Text style={[styles.error, { color: theme.text }]}>{error}</Text>}
      {!loading && !error && eventos.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Ops!</Text>
          <Text style={[styles.emptySubtitle, { color: theme.text }]}>
            Nenhum evento foi encontrado no momento.
          </Text>
        </View>
      )}

      {!loading &&
        !error &&
        eventos.map((evento) => (
          <View
            key={evento.id}
            style={[
              styles.card,
              { backgroundColor: theme.cardBackground, shadowColor: theme.shadow },
            ]}
          >
            <Image source={{ uri: evento.imagem }} style={styles.image} />

            <View style={styles.cardContent}>
              <Text style={[styles.eventTitle, { color: theme.textSecondary }]}>
                {evento.titulo}
              </Text>

              <Text style={[styles.eventInfo, { color: theme.textSecondary }]}>
                {formatDate(evento.data)}
              </Text>

              <Text style={[styles.eventInfo, { color: theme.textSecondary }]}>
                <Text style={{ fontWeight: "bold" }}>
                  {evento.horario.substring(0, 2)}hrs.
                </Text>
              </Text>

              <Text style={[styles.eventInfo, { color: theme.textSecondary }]}>
                {evento.endereco}
              </Text>

              {/* Botão transparente com bordas */}
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    borderTopColor: "#bfbfbf",
                    borderBottomColor: "#bfbfbf",
                  },
                ]}
                onPress={() => console.log("Clicou no evento", evento.id)}
              >
                <Text style={[styles.buttonText, { color: theme.text2 }]}>
                  Compre seu ingresso aqui
                </Text>
              </TouchableOpacity>

              <View style={styles.priceContainer}>
                <MaterialCommunityIcons name="cart-outline" size={28} color={theme.icon} />
                <Text style={[styles.price, { color: theme.textSecondary }]}>
                  R$ {parseFloat(evento.valor).toFixed(2).replace(".", ",")}
                </Text>
              </View>
            </View>
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  error: {
    textAlign: "center",
    marginTop: 20,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 18,
    textAlign: "center",
    width: 250
  },
  card: {
    overflow: "hidden",
    marginBottom: 40,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
  },
  cardContent: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#fff",
    height: 280
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  eventInfo: {
    fontSize: 17,
    marginBottom: 8,
    textAlign: "center",
  },
  button: {
    width: "100%",
    paddingVertical: 12,
    marginTop: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "center",
  },
  price: {
    fontSize: 18,
    marginLeft: 6,
    fontWeight: "bold"
  },
});
