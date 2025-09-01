import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Video } from "expo-av";

export default function LoadingScreen({ navigation }) {
  const video = useRef(null);

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        source={require("../assets/videos/loading.mp4")}
        style={styles.video}
        resizeMode="contain"
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
            navigation.replace("MainTabs");
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  video: { flex: 1 },
});
