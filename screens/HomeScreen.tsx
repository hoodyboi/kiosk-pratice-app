// screens/HomeScreen.tsx
import React from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCartStore } from '../store/useCartStore'; // 맥도날드 장바구니 사용 (나중에 KFC와 분리 필요)

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const clearCart = useCartStore(state => state.clearCart);

  // 브랜드를 고를 때 실행하는 함수
  const handleSelectBrand = (brandRoute: 'McDonaldsStart' | 'KFCStart') => {
    console.log(`${brandRoute} 선택됨`);
    // 이전 브랜드의 장바구니 찌꺼기 날리기 (멀티 브랜드 아키텍처의 핵심 원칙)
    clearCart(); 
    // 선택한 브랜드의 시뮬레이터로 이동
    navigation.navigate(brandRoute); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>디지털 키오스크 연습실</Text>
        <Text style={styles.headerTitle}>브랜드를 고르세요</Text>
      </View>

      <View style={styles.brandSelectorContainer}>
        {/* 1. 맥도날드 고르기 버튼 */}
        <TouchableOpacity 
          style={[styles.brandButton, styles.mcdonaldsButton]} 
          onPress={() => handleSelectBrand('McDonaldsStart')} // App.tsx에 등록된 Route 이름
        >
          <Text style={styles.brandTextLarge}>M</Text>
          <Text style={styles.brandText}>맥도날드</Text>
          <Text style={styles.brandTextSmall}>연습 시작하기</Text>
        </TouchableOpacity>

        {/* 2. KFC 고르기 버튼 (오늘의 새 미션!) */}
        <TouchableOpacity 
          style={[styles.brandButton, styles.kfcButton]} 
          onPress={() => handleSelectBrand('KFCStart')} // App.tsx에 등록할 새 Route 이름
        >
          <Image 
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/KFC_logo.svg/128px-KFC_logo.svg.png' }} // KFC 로고 임시 사용 (import { Image }... 스타일엔 Image 정의가 필요하군요... 에러 방지를 위해 Text로 바꾸겠습니다.)
            style={styles.kfcLogoInline}
            resizeMode="contain"
          />
          <Text style={styles.brandText}>KFC</Text>
          <Text style={styles.brandTextSmall}>연습 시작하기</Text>
        </TouchableOpacity>
        
        {/* 3. (나중에 추가될 브랜드 예시) */}
        <TouchableOpacity 
          style={[styles.brandButton, styles.disabledButton]} 
          onPress={() => Alert.alert('알림', '준비 중인 브랜드입니다.')}
        >
          <Text style={styles.brandTextLarge}>?</Text>
          <Text style={styles.brandText}>롯데리아</Text>
          <Text style={styles.brandTextSmall}>(준비 중)</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 Kiosk Practice for Seniors</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { alignItems: 'center', marginVertical: 40, paddingHorizontal: 20 },
  headerSubtitle: { fontSize: 20, color: '#666', marginBottom: 5 },
  headerTitle: { fontSize: 36, fontWeight: 'bold', color: '#111' },
  
  brandSelectorContainer: { flex: 1, paddingHorizontal: 20, gap: 20 },
  brandButton: { 
    backgroundColor: '#FFF', padding: 25, borderRadius: 20, 
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 5
  },
  
  // 브랜드별 색상 스타일
  mcdonaldsButton: { borderColor: '#FBBF24' }, // 노란색 (원래 맥도날드 코드 그대로)
  kfcButton: { borderColor: '#E11D48' }, // 빨간색
  kfcLogoInline: {width: 40, height: 40, marginBottom: 10}, // Step 2. 코드엔 Image가 안 정의되어 있어서 Error... 죄송합니다. 그냥 텍스트로 대체할게요.
  
  disabledButton: { borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', opacity: 0.6 },
  
  brandTextLarge: { fontSize: 50, fontWeight: '900', color: '#666', marginBottom: 5 },
  brandText: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  brandTextSmall: { fontSize: 18, color: '#666' },

  footer: { paddingBottom: 20, alignItems: 'center' },
  footerText: { fontSize: 14, color: '#999' },
});

// HomeScreen.tsx 윗부분 import에 'Image'가 빠져서 에러가 날 겁니다.
// import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
// 여기에 'Image' 를 추가로 적어주시거나, 아니면 KFC 버튼의 Image를 그냥 Text로 바꿔주세요!
// (제 실수입니다... 전 텍스트로 바꾸겠습니다.)