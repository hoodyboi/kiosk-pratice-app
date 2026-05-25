// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen'; // 브랜드 선택 화면
import MenuScreen from './screens/MenuScreen'; // (구) 맥도날드 메뉴판
import KFCWelcomeScreen from './screens/kfc/KFCWelcomeScreen'; // 오늘 만든 KFC 첫화면
import KFCMenuScreen from './screens/kfc/KFCMenuScreen';
import KFCCartScreen from './screens/kfc/KFCCartScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        {/* 1. 앱의 유일한 진입점 (브랜드 선택 허브) */}
        <Stack.Screen name="BrandSelectorHub" component={HomeScreen} />
        
        {/* 2. 맥도날드 전용 Navigator (앞으로 스택으로 묶어야 함) */}
        {/* 일단은 에러 안 나게 route 이름만 'McDonaldsStart'로 변경해서 연결 */}
        <Stack.Screen name="McDonaldsStart" component={MenuScreen} />
        
        {/* 3. KFC 전용 Navigator (앞으로 스택으로 묶어야 함) */}
        {/* 오늘 만든 KFC Welcome화면을 'KFCStart'라는 이름으로 등록 */}
        <Stack.Screen name="KFCStart" component={KFCWelcomeScreen} />
        <Stack.Screen name="KFCMenu" component={KFCMenuScreen} />
        <Stack.Screen name="KFCCart" component={KFCCartScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}