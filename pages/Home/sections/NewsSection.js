import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Video } from "expo-av";
import { homeStyles } from "../../../styles/homeStyles";

export default function NewsSection() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch("https://ba49f7e370e1.ngrok-free.app/api/news/latest/");
        if (!res.ok) throw new Error("Erro ao buscar vídeo");
        const data = await res.json();

        if (!data.video) {
          setError(true);
          return;
        }

        // Certifica HTTPS
        const secureUrl = data.video.startsWith("http")
          ? data.video
          : `https://ba49f7e370e1.ngrok-free.app${data.video}`;

        setVideoUrl(secureUrl);
      } catch (err) {
        console.log("Erro ao carregar vídeo:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, []);

  if (loading)
    return (
      <View style={homeStyles.videoContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );

  if (error || !videoUrl)
    return (
      <View style={homeStyles.videoContainer}>
        <Text style={homeStyles.sectionTitle}>Nenhum vídeo disponível</Text>
      </View>
    );

  return (
    <View style={homeStyles.videoContainer}>
      <Text style={homeStyles.sectionTitle}>🎥 United News</Text>
      <Video
        source={{ uri: videoUrl }}
        style={homeStyles.innerVideo}
        shouldPlay
        isLooping
        useNativeControls
        resizeMode="cover"
      />
    </View>
  );
}
