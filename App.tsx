import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import KFCPaymentScreen from './screens/kfc/KFCPaymentScreen';
import HomeScreen from './screens/HomeScreen';
import EdiyaStartScreen from './screens/ediya/EdiyaStartScreen';
import EdiyaMenuScreen from './screens/ediya/EdiyaMenuScreen';
import EdiyaRewardScreen from './screens/ediya/EdiyaRewardScreen'; 

// 기존 임포트 항목들 (KFCMenuScreen, KFCCartScreen 등)
import KFCMenuScreen from './screens/kfc/KFCMenuScreen';
import KFCCartScreen from './screens/kfc/KFCCartScreen';
import KFCReceiptScreen from './screens/kfc/KFCReceiptScreen';
import EdiyaPaymentScreen from './screens/ediya/EdiyaPaymentScreen';
import EdiyaCouponScreen from './screens/ediya/EdiyaCouponScreen';

// 🔴 1. 방금 만든 시작 화면 컴포넌트 임포트 추가
import KFCStartScreen from './screens/kfc/KFCStartScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        
        {/* KFC */}
        <Stack.Screen name="KFCStart" component={KFCStartScreen} />
        <Stack.Screen name="KFCMenu" component={KFCMenuScreen} />
        <Stack.Screen name="KFCCart" component={KFCCartScreen} />
        <Stack.Screen name="KFCPayment" component={KFCPaymentScreen} />
        <Stack.Screen name="KFCReceipt" component={KFCReceiptScreen} />
        
        {/* Ediya */}
        <Stack.Screen name="EdiyaStart" component={EdiyaStartScreen} />
        <Stack.Screen name="EdiyaMenu" component={EdiyaMenuScreen} />
        <Stack.Screen name="EdiyaReward" component={EdiyaRewardScreen} /> 
        <Stack.Screen name="EdiyaPayment" component={EdiyaPaymentScreen} />
        <Stack.Screen name="EdiyaCoupon" component={EdiyaCouponScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}