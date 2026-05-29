import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEdiyaCartStore } from '../../store/useEdiyaCartStore';

export default function EdiyaPaymentScreen() {
  const navigation = useNavigation<any>();
  const { totalPrice, clearCart } = useEdiyaCartStore();
  
  // 어떤 결제 수단을 터치했는지 식별하기 위한 로컬 데이터 상태
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    console.log(`선택된 PG 수단: ${method}`);

    // 기획서 해부: '모바일 쿠폰/멤버스 쿠폰'을 누르면 쿠폰 조회(바코드 스캐너) 화면으로 라우팅
    if (method === '모바일쿠폰') {
      navigation.navigate('EdiyaCoupon');
    } else {
      // 일반 카드결제나 모바일페이는 곧장 최종 결제 및 완료 프로세스(영수증 애니메이션)로 포워딩
      navigation.navigate('EdiyaCheckout', { paymentMethod: method });
    }
  };

  // 장바구니 인스턴스 엎고 메인 로비로 복귀하는 롤백 핸들러
  const handleCancelAll = () => {
    clearCart();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.stepText}>Step 2.</Text>
        <Text style={styles.titleText}>결제방식을 선택해 주세요!</Text>
        <Text style={styles.alertText}>★ 주문 금액과 결제 금액이 동일해야 다음 단계로 넘어갑니다.</Text>

        {/* 2x2 결제 수단 매트릭스 그리드 */}
        <View style={styles.gridContainer}>
          <TouchableOpacity 
            style={[styles.gridItem, selectedMethod === '모바일페이' && styles.selectedItem]} 
            onPress={() => handleMethodSelect('모바일페이')}
          >
            <Text style={styles.iconText}>📱</Text>
            <Text style={styles.gridText}>모바일페이</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gridItem, selectedMethod === '모바일쿠폰' && styles.selectedItem]} 
            onPress={() => handleMethodSelect('모바일쿠폰')}
          >
            <Text style={styles.iconText}>🎫</Text>
            <Text style={styles.gridText}>모바일 쿠폰{"\n"}멤버스 쿠폰</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gridItem, selectedMethod === '이디야카드' && styles.selectedItem]} 
            onPress={() => handleMethodSelect('이디야카드')}
          >
            <Text style={styles.iconText}>💙</Text>
            <Text style={styles.gridText}>이디야카드결제</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gridItem, selectedMethod === '카드결제' && styles.selectedItem]} 
            onPress={() => handleMethodSelect('카드결제')}
          >
            <Text style={styles.iconText}>💳</Text>
            <Text style={styles.gridText}>카드결제</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 하단 공통 빌링 인프라 레이어 */}
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

        {/* 하단 내비게이션 바 제어 스택 */}
        <View style={styles.navRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelAll}>
            <Text style={styles.cancelText}>전체취소</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.prevButton} onPress={() => navigation.goBack()}>
            <Text style={styles.prevText}>이전</Text>
          </TouchableOpacity>
          <View style={styles.disabledNextButton}>
            <Text style={styles.disabledNextText}>다음</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  
  content: { flex: 1, padding: 30 },
  stepText: { fontSize: 24, fontWeight: '900', color: '#1D4ED8', marginBottom: 5 },
  titleText: { fontSize: 22, fontWeight: 'bold', color: '#334155', marginBottom: 8 },
  alertText: { fontSize: 14, fontWeight: '600', color: '#DC2626', marginBottom: 40 },
  
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 15 },
  gridItem: { width: '47%', aspectRatio: 1.2, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5, elevation: 2 },
  selectedItem: { borderColor: '#1D4ED8', backgroundColor: '#EFF6FF', borderWidth: 2 },
  iconText: { fontSize: 36, marginBottom: 10 },
  gridText: { fontSize: 16, fontWeight: 'bold', color: '#1E3A8A', textAlign: 'center', lineHeight: 22 },

  // Billing 레이아웃 팩
  footer: { backgroundColor: '#E2E8F0', padding: 20 },
  billingSection: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 12, marginBottom: 15 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  priceLabel: { fontSize: 16, fontWeight: '600', color: '#475569' },
  priceValueRed: { fontSize: 18, fontWeight: 'bold', color: '#DC2626' },
  priceValueBlue: { fontSize: 18, fontWeight: 'bold', color: '#2563EB' },

  navRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  cancelButton: { flex: 1, paddingVertical: 15, backgroundColor: '#E2E8F0', borderWidth: 1, borderColor: '#94A3B8', borderRadius: 8, alignItems: 'center' },
  cancelText: { fontSize: 18, fontWeight: 'bold', color: '#475569' },
  
  prevButton: { flex: 1, paddingVertical: 15, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#1D4ED8', borderRadius: 8, alignItems: 'center' },
  prevText: { fontSize: 18, fontWeight: 'bold', color: '#1D4ED8' },
  
  // 기획서 반영: 수단을 클릭해야 트랜잭션이 넘어가므로 하단 다음 버튼은 딤(Dim) 처리용 컴포넌트로 락업
  disabledNextButton: { flex: 2, paddingVertical: 15, backgroundColor: '#CBD5E1', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  disabledNextText: { fontSize: 18, fontWeight: 'bold', color: '#94A3B8' },
});