import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { homeStyles } from "../../../styles/homeStyles";

export default function AvisosSection() {
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAvisos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://a61b3999ebcb.ngrok-free.app/api/avisos/");
      if (!response.ok) throw new Error("Erro ao buscar avisos");
      const data = await response.json();
      setAvisos(data);
    } catch {
      setError("Não foi possível carregar os avisos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvisos();
  }, []);

  return (
    <>
      <Text style={homeStyles.sectionTitle}>📢 Últimos Avisos</Text>

      {loading && <ActivityIndicator size="small" color="#000" />}
      {error && <Text style={homeStyles.textItem}>{error}</Text>}
      {!loading && !error && avisos.length === 0 && (
        <Text style={homeStyles.textItem}>Nenhum aviso disponível.</Text>
      )}

      {!loading && !error && avisos.map((aviso, index) => (
        <View key={index} style={{ marginBottom: 5 }}>
          <Text style={homeStyles.textItem}>
            • {aviso.mensagem || aviso}
          </Text>
        </View>
      ))}
    </>
  );
}
