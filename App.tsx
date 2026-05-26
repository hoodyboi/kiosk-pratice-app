import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 기존 임포트 항목들 (KFCMenuScreen, KFCCartScreen 등)
import KFCMenuScreen from './screens/kfc/KFCMenuScreen';
import KFCCartScreen from './screens/kfc/KFCCartScreen';
import KFCReceiptScreen from './screens/kfc/KFCReceiptScreen';

// 🔴 1. 방금 만든 시작 화면 컴포넌트 임포트 추가
import KFCStartScreen from './screens/kfc/KFCStartScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        {/* 🔴 2. 최상단 첫 번째 스크린의 component를 KFCStartScreen으로 변경! */}
        <Stack.Screen name="KFCStart" component={KFCStartScreen} />
        
        {/* 기존에 세팅해 둔 하위 엔드포인트 주소록들 */}
        <Stack.Screen name="KFCMenu" component={KFCMenuScreen} />
        <Stack.Screen name="KFCCart" component={KFCCartScreen} />
        <Stack.Screen name="KFCReceipt" component={KFCReceiptScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}