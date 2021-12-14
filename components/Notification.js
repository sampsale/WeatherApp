
import React from 'react';
import { View, Switch, Text, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true
  }),
});


export default function Notification(props) {

  console.log(props)
  const [expoPushToken, setExpoPushToken] = React.useState('');
  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  const weather = props.weather;
  const [isEnabled, setIsEnabled] = React.useState(false);

  const toggleSwitch = () => {
    
    if (isEnabled === false) {
      console.log('toggled')
      schedulePushNotification(weather)
    } else {
      console.log('not toggled')
      cancelNotification()
    }
    setIsEnabled(previousState => !previousState);
  }

  React.useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  React.useEffect(() => {
    console.log(props)
    // if (route.params !== undefined) {
    //   getWeatherDataByLocation(route.params.location.item.address)
    // }
  }, [])

  return (
    <View style={styles.container}>

      <Text style={styles.titleText}>{isEnabled ? "Daily notifications are ON" : "Daily notifications are OFF"}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 20,
  }
})


async function schedulePushNotification(weather) {

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: `Current weather in ${weather.location}`,
      body: `${weather.description.charAt(0).toUpperCase()}${weather.description.slice(1)} ${weather.temperature} C°, feels like ${weather.feelsLike} C°`
    },
     trigger: { hour: 8, minute: 1, repeats: true },
    // trigger: {seconds: 1, repeats: true}
  });
}

async function cancelNotification(){
  await Notifications.cancelAllScheduledNotificationsAsync()
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',

    });
  }

  return token;
}
