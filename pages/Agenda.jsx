import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext";

const API_URL = "https://22f2cfafff2a.ngrok-free.app/api/agenda/campos/";

export default function Agenda() {
  const { theme } = useContext(ThemeContext);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [campos, setCampos] = useState([]);
  const [filteredCampos, setFilteredCampos] = useState([]);
  const [selectedCampo, setSelectedCampo] = useState(null);
  const [showCampos, setShowCampos] = useState(false);

  const fetchCampos = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setCampos(data);
      setFilteredCampos(data);
    } catch (error) {
      console.error("Erro ao buscar campos:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      if (!search.trim()) setShowCampos(false);
    });
    return () => hideSub.remove();
  }, [search]);

  const onRefresh = async () => {
    setRefreshing(true);
    setSelectedCampo(null);
    setSearch("");
    await fetchCampos();
  };

  const handleSearchFocus = async () => {
    setShowCampos(true);
    if (campos.length === 0) await fetchCampos();
  };

  const handleSearch = (text) => {
    setSearch(text);
    setSelectedCampo(null);
    if (text.trim() === "") {
      setFilteredCampos(campos);
    } else {
      setFilteredCampos(
        campos.filter((campo) =>
          campo.nome.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  const formatarDiaSemana = (dataStr) => {
    const [ano, mes, dia] = dataStr.split("-").map(Number);
    const data = new Date(ano, mes - 1, dia);
    const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    return diasSemana[data.getDay()];
  };

  const formatarData = (dataStr) => {
    const [ano, mes, dia] = dataStr.split("-").map(Number);
    return `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}/${ano}`;
  };

  const calcularDiasRestantes = (dataEvento) => {
    const [ano, mes, dia] = dataEvento.split("-").map(Number);
    const hoje = new Date();
    const data = new Date(ano, mes - 1, dia);

    // Zera hora/minuto/segundo
    const hojeZerado = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const dataZerada = new Date(data.getFullYear(), data.getMonth(), data.getDate());

    const diff = Math.ceil((dataZerada - hojeZerado) / (1000 * 60 * 60 * 24));

    if (diff < 0) return null; // evento passado
    if (diff === 0) return "Hoje";
    if (diff === 1) return "Amanhã";
    return `Em ${diff} dias`;
  };

  const eventosFiltrados = selectedCampo
    ? selectedCampo.agenda.filter((evento) => {
        const [ano, mes, dia] = evento.data.split("-").map(Number);
        const dataEvento = new Date(ano, mes - 1, dia);
        const hoje = new Date();
        const hojeZerado = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
        return (
          dataEvento >= hojeZerado &&
          dataEvento.getMonth() === hoje.getMonth() &&
          dataEvento.getFullYear() === hoje.getFullYear()
        );
      })
    : [];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: theme.text }]}>Agenda</Text>
      <Text style={[styles.subtitle, { color: theme.subtitle }]}>Selecione uma igreja</Text>

      {/* Barra de busca */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor:
              theme.inputBackground ||
              (theme.background === "#121212" || theme.background === "#000" ? "#2a2a2a" : "#e6e6e6"),
            height: 48,
            borderRadius: 25,
          },
        ]}
      >
        <TextInput
          placeholder="Buscar local..."
          placeholderTextColor={theme.textSecondary || "#999"}
          value={search}
          onFocus={handleSearchFocus}
          onChangeText={handleSearch}
          style={[styles.searchInput, { color: theme.text, flex: 1, paddingLeft: 15, fontSize: 15 }]}
        />
        <MaterialIcons
          name="search"
          size={24}
          color={theme.textSecondary || theme.text}
          style={{ marginRight: 8 }}
        />
      </View>

      {/* Lista de campos */}
      {showCampos && (
        <View style={{ marginTop: 8 }}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.primary} />
          ) : (
            filteredCampos.map((campo) => (
              <TouchableOpacity
                key={campo.id}
                style={[styles.campoCard, { backgroundColor: theme.card || "#1e1e1e" }]}
                onPress={() => {
                  setSelectedCampo(campo);
                  setSearch(campo.nome);
                  setShowCampos(false);
                  Keyboard.dismiss();
                }}
              >
                <Text style={[styles.campoNome, { color: theme.text }]}>{campo.nome}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      {/* Agenda */}
      {selectedCampo && (
        <>
          {eventosFiltrados.length > 0 ? (
            eventosFiltrados.map((evento) => (
              <View key={evento.id} style={[styles.eventoCard]}>
                <Text style={[styles.eventoTitulo]}>{evento.titulo}</Text>
                <Text style={[styles.eventoDias]}>{calcularDiasRestantes(evento.data)}</Text>
                <Text style={[styles.eventoInfo]}>
                  {formatarData(evento.data)}{"\n"}
                  {formatarDiaSemana(evento.data)} | {evento.horario.slice(0, 5)}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>Ops!</Text>
              <Text style={[styles.emptySubtitle, { color: theme.text }]}>
                Nenhuma agenda cadastrada!
              </Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: "bold" },
  subtitle: { fontSize: 16, marginBottom: 16 },
  searchContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 8, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  searchInput: { flex: 1, fontSize: 16 },
  campoCard: { padding: 16, borderRadius: 14, marginBottom: 10 },
  campoNome: { fontSize: 18, fontWeight: "bold" },
  eventoCard: { padding: 16, marginBottom: 14, justifyContent: "center", backgroundColor: "#8ba29c" },
  eventoTitulo: { fontSize: 16, fontWeight: "bold", marginBottom: 6, color: "#000" },
  eventoDias: { fontSize: 14, fontWeight: "bold", marginBottom: 4, color: "#1a3446" },
  eventoInfo: { fontSize: 14, color: "#000" },
  semEventos: { fontStyle: "italic", marginTop: 20 },
  emptyContainer: { alignItems: "center", marginTop: 50 },
  emptyTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 6 },
  emptySubtitle: { fontSize: 18, textAlign: "center", width: 250 },
});
