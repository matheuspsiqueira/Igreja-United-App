import React from "react";
import { View, Text } from "react-native";
import { Video } from "expo-av";
import { homeStyles } from "../../../styles/homeStyles";

export default function NewsSection() {
  return (
    <>
      <Text style={homeStyles.sectionTitle}>🎥 United News</Text>
      <View style={homeStyles.videoContainer}>
        <Video
          source={require("../../../assets/videos/united-news.mp4")}
          style={homeStyles.innerVideo}
          shouldPlay
          isLooping
          useNativeControls={true}
          resizeMode="contain"
        />
      </View>
    </>
  );
}
