import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from "react";
import { AppState, StyleSheet, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

export default function TabLayout() {
  const webviewRef = useRef<WebView>(null);
  const [appState, setAppState] = useState(AppState.currentState);

  const handleWebViewMessage = async (event: WebViewMessageEvent) => {
    // Only proceed if the message is the expected "takePhoto" command
    if (event.nativeEvent.data === 'takePhoto') {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
        base64: true, // Needed to pass the image data back to the website
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Send the captured photo's data back to a function on the website
        const base64Data = result.assets[0].base64;
        const jsCode = `window.handleNativePhoto('data:image/jpeg; base64,${base64Data}');`;
        webviewRef.current?.injectJavaScript(jsCode);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        style={styles.container}
        source={{ uri: 'https://coffee-frontend-tikz.onrender.com/' }}
        originWhitelist={['*']}
        mixedContentMode="always"
        allowsInlineMediaPlayback={true}  // Important for playsinline
        mediaPlaybackRequiresUserAction={false} // Allows autoplay
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}      // ✅ keep cookies in sync with native
        thirdPartyCookiesEnabled={true}  // ✅ allow third-party login cookies
        incognito={false}                // ❌ don't use incognito, otherwise no persistence
        startInLoadingState={true}
        cacheEnabled={true}
        onMessage={handleWebViewMessage}
        mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"
      />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    marginBottom: 0
  },
});