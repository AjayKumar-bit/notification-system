/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { PermissionsAndroid, Text } from 'react-native';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Platform,
  Alert,
  Button,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import {
  getDeviceToken,
  listenBackgoundNotification,
  listenNotification,
} from './src/service/firebaseMessaging.service';
import Clipboard from '@react-native-clipboard/clipboard';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  // const askUserPermission = async () => {
  //   const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
  //   const hasPermission = await PermissionsAndroid.check(permission);
  //   if (hasPermission) {
  //     console.log('Notifications permission already granted');
  //     return;
  //   }

  //   const requestOnce = async () =>
  //     await PermissionsAndroid.request(permission, {
  //       title: 'Enable notifications',
  //       message:
  //         'We use notifications to keep you updated. Please allow access.',
  //       buttonPositive: 'Allow',
  //       buttonNegative: 'Deny',
  //     });

  //   let result = await requestOnce();
  //   if (result === PermissionsAndroid.RESULTS.GRANTED) {
  //     console.log('Notifications permission granted');
  //     return;
  //   }

  //   if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
  //     Alert.alert(
  //       'Permission required',
  //       'Please enable notifications in Settings to continue.',
  //       [
  //         { text: 'Cancel', style: 'cancel' },
  //         { text: 'Open Settings', onPress: () => Linking.openSettings() },
  //       ],
  //     );
  //     return;
  //   }

  //   // Retry once if simply denied
  //   result = await requestOnce();
  //   if (result === PermissionsAndroid.RESULTS.GRANTED) {
  //     console.log('Notifications permission granted on retry');
  //     return;
  //   }
  //   if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
  //     Alert.alert(
  //       'Permission required',
  //       'Please enable notifications in Settings to continue.',
  //       [
  //         { text: 'Cancel', style: 'cancel' },
  //         { text: 'Open Settings', onPress: () => Linking.openSettings() },
  //       ],
  //     );
  //     return;
  //   }

  //   console.log('Notifications permission denied');
  // };

  const [token, setToken] = useState<string | undefined>();
  const [notification, setNotification] = useState();
  async function askUserPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      // Android 13+ (API 33) → need to request
      const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
      const result = await PermissionsAndroid.request(permission, {
        title: 'Enable notifications',
        message:
          'We use notifications to keep you updated. Please allow access.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      });

      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notifications permission granted');
        const fetchedToken = await getDeviceToken();
        setToken(fetchedToken);
        listenNotification(setNotification);
        listenBackgoundNotification(setNotification);
        console.log({ token: fetchedToken });
        return true;
      } else {
        console.log('Notifications permission denied');
        return false;
      }
    } else {
      // Android 12 and below → no runtime permission required
      console.log(
        'Notification permission not required on this Android version',
      );
      const fetchedToken = await getDeviceToken();
      setToken(fetchedToken);
      listenNotification(setNotification);
      listenBackgoundNotification(setNotification);
      console.log({ token: fetchedToken });
      return true;
    }
  }
  useEffect(() => {
    if (Platform.OS === 'android') {
      askUserPermission();
      console.log('hello  ji');
    }
  }, []);

  const handleCopyToken = () => {
    if (!token) {
      Alert.alert('No token', 'Device token is not available yet.');
      return;
    }
    Clipboard.setString(token);
    Alert.alert('Copied', 'Device token copied to clipboard.');
  };

  return (
    <View style={styles.container}>
      <Text>Hello</Text>
      <Text>{token}</Text>
			<Text>{JSON.stringify(notification)}</Text>
      <Button title="Copy token" onPress={handleCopyToken} disabled={!token} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
