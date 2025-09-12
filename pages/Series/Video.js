// VideoScreen.js
import React, { useRef, useState } from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';

export default function Video({ route, navigation }) {
  const { videoId } = route.params;
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoRef = useRef(null);

  const onFullScreenChange = async (fullscreen) => {
    if (fullscreen) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      setIsFullScreen(true);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      setIsFullScreen(false);
    }
  };

  const { width, height } = Dimensions.get('window');

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        width: isFullScreen ? height : width,
        height: isFullScreen ? width : height,
      }}
    >
      {/* Botão de voltar */}
      {!isFullScreen && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 40,
            left: 20,
            zIndex: 10,
          }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
      )}

      <YoutubePlayer
        ref={videoRef}
        height={isFullScreen ? width : 230}
        width={isFullScreen ? height : '100%'}
        play
        videoId={videoId}
        onFullScreenChange={onFullScreenChange}
      />
    </View>
  );
}
