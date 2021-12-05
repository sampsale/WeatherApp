
import React from 'react';
import Weather from './Weather';
import MyLocations from './MyLocations';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default function App() {
   
  return (
    <NavigationContainer theme={MyTheme}>
     <Tab.Navigator >
      <Tab.Screen name="Saved locations" component={MyLocations} />
      <Tab.Screen name="Weather" component={Weather} />
    </Tab.Navigator>
    
    </NavigationContainer>
        
  );
}

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'blue'
  },
};
