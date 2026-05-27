import React from 'react';
// 🔴 상단에 Image 컴포넌트 임포트 누락 에러 클리어
import { Image, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// 🔴 맥도날드 스토어와 KFC 스토어를 동시에 임포트
import { useMcdonaldCartStore } from '../store/useMcdonaldCartStore';
import { useKFCCartStore } from '../store/useKFCCartStore';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  
  // 두 브랜드의 클리어 액션 포인터 바인딩
  const clearMcdonaldCart = useMcdonaldCartStore(state => state.clearCart);
  const clearKFCCart = useKFCCartStore(state => state.clearCart);

  const handleSelectBrand = (brandRoute: 'McDonaldsStart' | 'KFCStart') => {
    console.log(`${brandRoute} 엔드포인트 라우팅 시도`);
    
    // 🔴 진입 전 양쪽 스토어 메모리 버퍼 싹 청소해서 사이드 이펙트 차단
    clearMcdonaldCart(); 
    clearKFCCart(); 
    
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
        {/* 1. 맥도날드 진입점 */}
        <TouchableOpacity 
          style={[styles.brandButton, styles.mcdonaldsButton]} 
          onPress={() => handleSelectBrand('McDonaldsStart')} 
        >
          <Text style={styles.brandTextLarge}>M</Text>
          <Text style={styles.brandText}>맥도날드</Text>
          <Text style={styles.brandTextSmall}>연습 시작하기</Text>
        </TouchableOpacity>

        {/* 2. KFC 진입점 (Image 컴포넌트 바인딩 완료) */}
        <TouchableOpacity 
          style={[styles.brandButton, styles.kfcButton]} 
          onPress={() => handleSelectBrand('KFCStart')} 
        >
          <Image 
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/KFC_logo.svg/128px-KFC_logo.svg.png' }} 
            style={styles.kfcLogoInline}
            resizeMode="contain"
          />
          <Text style={styles.brandText}>KFC</Text>
          <Text style={styles.brandTextSmall}>연습 시작하기</Text>
        </TouchableOpacity>
        
        {/* 3. 롯데리아 (인터셉터 대기 상태) */}
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
  
  mcdonaldsButton: { borderColor: '#FBBF24' }, 
  kfcButton: { borderColor: '#E11D48' }, 
  kfcLogoInline: { width: 50, height: 50, marginBottom: 5 }, 
  
  disabledButton: { borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', opacity: 0.6 },
  
  brandTextLarge: { fontSize: 50, fontWeight: '900', color: '#666', marginBottom: 5 },
  brandText: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  brandTextSmall: { fontSize: 18, color: '#666' },

  footer: { paddingBottom: 20, alignItems: 'center' },
  footerText: { fontSize: 14, color: '#999' },
});