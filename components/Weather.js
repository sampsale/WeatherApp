import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Alert, Image, Button } from 'react-native';
import * as Location from 'expo-location';
import Notification from './Notification';
import * as SQLite from 'expo-sqlite';


export default function Weather({ route }) {


  const [weather, setWeather] = React.useState({ location: '', temperature: '', weathermain: '', imageurl: ' ', feelsLike: '', wind: '', description: '' })

  React.useEffect(() => {
    if (route.params !== undefined) {
      console.log(route.params)
      getWeatherDataByLocation(route.params.location.item.address)
    }
    else (
      getWeatherDataByCoords()
    )
  }, [route])

  const getWeatherDataByCoords = async () => {

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('No permission to get location')
      return;
    }
    let location = await Location.getCurrentPositionAsync({});

    console.log('FETCH by coords')
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&APPID=d1d50384a434f5c85b4df056f3b78bfa`)
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData)
        setWeather({
          location: responseData.name,
          temperature: (responseData.main.temp - 273.15).toFixed(1),
          weathermain: responseData.weather[0].main,
          imageurl: `https://openweathermap.org/img/wn/${responseData.weather[0].icon}@2x.png`,
          feelsLike: (responseData.main.feels_like - 273.15).toFixed(0),
          wind: Math.ceil(responseData.wind.speed),
          description: responseData.weather[0].description
        })
      })
      .catch(error => (console.log(error)))
  };

  const getWeatherDataByLocation = async (location) => {
    
    console.log('FETCH by location')
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=d1d50384a434f5c85b4df056f3b78bfa`)
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData)
        setWeather({
          location: responseData.name,
          temperature: (responseData.main.temp - 273.15).toFixed(1),
          weathermain: responseData.weather[0].main,
          imageurl: `https://openweathermap.org/img/wn/${responseData.weather[0].icon}@2x.png`,
          feelsLike: (responseData.main.feels_like - 273.15).toFixed(0),
          wind: Math.ceil(responseData.wind.speed),
          description: responseData.weather[0].description
        })
      }).catch(error => (console.log(error)))
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>Weather in {weather.location}</Text>
        <Text style={styles.bodyText}>{weather.description.charAt(0).toUpperCase()}{weather.description.slice(1)} {weather.temperature} celsius (feels like {weather.feelsLike})</Text>
        <Text style={styles.bodyText}>Wind: {weather.wind} m/s</Text>
      </View>
      <Image
        style={styles.bigIcon}
        source={{
          uri: `${weather.imageurl}`,
        }}
      />
      <View style={styles.buttonContainer}>
      <Button
        onPress={() => getWeatherDataByCoords()}
        title="Show weather in current location"
        color="#73a9f0"
      />
      
      <Notification weather={weather}/>
      <StatusBar style="auto" />
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6e6e6'
  }, bigIcon: {
    width: 400,
    height: 300,
    flex: 0.8
  }, titleText: {
    fontSize: 25,
  }, textContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
    buttonContainer: {
      justifyContent: 'center',
      alignItems: 'stretch',
      
    }
});