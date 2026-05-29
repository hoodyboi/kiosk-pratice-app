import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEdiyaCartStore } from '../../store/useEdiyaCartStore';

export default function EdiyaRewardScreen() {
  const navigation = useNavigation<any>();
  const { totalPrice, clearCart } = useEdiyaCartStore();
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

  const handleRewardSelect = (method: string) => {
    setSelectedReward(method);
    if (method === '적립안함') {
      navigation.navigate('EdiyaPayment');
    } else {
      Alert.alert(
        '스캐너 연동 대기중', 
        `[${method}] 기능은 준비 중입니다. 우측 하단의 [다음]을 눌러주세요.`
      );
    }
  };

  const handleCancelAll = () => {
    clearCart();
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 컨텐츠 영역 */}
      <View style={styles.content}>
        <Text style={styles.stepText}>Step 1.</Text>
        <Text style={styles.titleText}>적립 방식을 선택해 주세요!</Text>
        
        {/* 🔴 반응형 플렉스(Flex) 2x2 그리드 레이아웃으로 변경 */}
        <View style={styles.gridContainer}>
          {/* 첫 번째 줄 (Row) */}
          <View style={styles.gridRow}>
            <TouchableOpacity 
              style={[styles.gridItem, selectedReward === '이디야QR' && styles.selectedItem]} 
              onPress={() => handleRewardSelect('이디야QR')}
            >
              <Text style={styles.iconText}>📱</Text>
              <Text style={styles.gridText}>이디야QR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.gridItem, selectedReward === '바코드적립' && styles.selectedItem]} 
              onPress={() => handleRewardSelect('바코드적립')}
            >
              <Text style={styles.iconText}>||||</Text>
              <Text style={styles.gridText}>바코드적립</Text>
            </TouchableOpacity>
          </View>

          {/* 두 번째 줄 (Row) */}
          <View style={styles.gridRow}>
            <TouchableOpacity 
              style={[styles.gridItem, selectedReward === '번호적립' && styles.selectedItem]} 
              onPress={() => handleRewardSelect('번호적립')}
            >
              <Text style={styles.iconText}>🔢</Text>
              <Text style={styles.gridText}>번호적립</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.gridItem, selectedReward === '적립안함' && styles.selectedItem]} 
              onPress={() => handleRewardSelect('적립안함')}
            >
              <Text style={styles.iconText}>❌</Text>
              <Text style={styles.gridText}>적립안함</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.noticeText}>[카드 및 기타 결제는 다음 화면에서 진행해주세요.]</Text>
      </View>

      {/* 하단 고정 빌링 레이어 */}
      <View style={styles.footer}>
        <View style={styles.billingSection}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>주문 금액</Text>
            <Text style={styles.priceValueRed}>₩ {totalPrice.toLocaleString()}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>할인 금액</Text>
            <Text style={styles.priceValueBlue}>₩ 0</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>결제 금액</Text>
            <Text style={styles.priceValueBlue}>₩ 0</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>잔여 금액</Text>
            <Text style={styles.priceValueRed}>₩ {totalPrice.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.navRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelAll}>
            <Text style={styles.cancelText}>전체취소</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.prevButton} onPress={() => navigation.goBack()}>
            <Text style={styles.prevText}>이전</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.nextButton, !selectedReward && styles.disabledNextButton]} 
            onPress={() => selectedReward && navigation.navigate('EdiyaPayment')}
            activeOpacity={selectedReward ? 0.7 : 1}
          >
            <Text style={[styles.nextText, !selectedReward && styles.disabledNextText]}>다음</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  
  content: { flex: 1, padding: 25 },
  stepText: { fontSize: 24, fontWeight: '900', color: '#1E3A8A', marginBottom: 5 },
  titleText: { fontSize: 22, fontWeight: 'bold', color: '#334155', marginBottom: 20 },
  
  // 🔴 Grid 레이아웃 전면 개편 (Flex Ratio 기반)
  gridContainer: { flex: 1, gap: 15, paddingBottom: 10 },
  gridRow: { flex: 1, flexDirection: 'row', gap: 15 },
  gridItem: { flex: 1, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  
  selectedItem: { borderColor: '#1D4ED8', backgroundColor: '#EFF6FF', borderWidth: 2 },
  iconText: { fontSize: 40, marginBottom: 15 },
  gridText: { fontSize: 18, fontWeight: 'bold', color: '#1E3A8A' },
  
  noticeText: { marginTop: 20, fontSize: 16, color: '#64748B', textAlign: 'center' },

  footer: { backgroundColor: '#E2E8F0', padding: 20 },
  billingSection: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 12, marginBottom: 15 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  priceLabel: { fontSize: 18, fontWeight: '600', color: '#475569' },
  priceValueRed: { fontSize: 20, fontWeight: 'bold', color: '#DC2626' },
  priceValueBlue: { fontSize: 20, fontWeight: 'bold', color: '#2563EB' },

  navRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  cancelButton: { flex: 1, paddingVertical: 15, backgroundColor: '#E2E8F0', borderWidth: 1, borderColor: '#94A3B8', borderRadius: 8, alignItems: 'center' },
  cancelText: { fontSize: 18, fontWeight: 'bold', color: '#475569' },
  prevButton: { flex: 1, paddingVertical: 15, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#1D4ED8', borderRadius: 8, alignItems: 'center' },
  prevText: { fontSize: 18, fontWeight: 'bold', color: '#1D4ED8' },
  
  nextButton: { flex: 2, paddingVertical: 15, backgroundColor: '#1D4ED8', borderRadius: 8, alignItems: 'center' },
  nextText: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  disabledNextButton: { backgroundColor: '#94A3B8' },
  disabledNextText: { color: '#E2E8F0' },
});