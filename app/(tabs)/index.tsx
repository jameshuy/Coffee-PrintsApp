import { StyleSheet } from 'react-native';

import { WebView } from 'react-native-webview';

export default function HomeScreen() {
  return (
    <WebView
      style={styles.container}
      source={{ uri: 'https://coffee-frontend-tikz.onrender.com/' }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    marginBottom: 0
  },
});
