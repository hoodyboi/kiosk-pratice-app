import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen'; // 새 화면 불러오기

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* 메뉴 화면 길 추가 */}
        <Stack.Screen name="Menu" component={MenuScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}