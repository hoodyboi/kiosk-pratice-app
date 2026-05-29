import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEdiyaCartStore } from '../../store/useEdiyaCartStore';

export default function EdiyaCouponScreen() {
  const navigation = useNavigation<any>();
  const clearCart = useEdiyaCartStore(state => state.clearCart);

  // 🔴 가상 스캐너 터치 시뮬레이션 (Mocking)
  const handleMockScan = () => {
    Alert.alert(
      '삑! Barcode Scanned',
      '쿠폰이 정상적으로 인식되었습니다. 최종 결제 단계로 이동합니다.',
      [
        { 
          text: '확인', 
          onPress: () => navigation.navigate('EdiyaCheckout', { paymentMethod: '모바일쿠폰' }) 
        }
      ]
    );
  };

  const handleManualSearch = () => {
    Alert.alert('번호 조회', '쿠폰 번호 수동 입력 키패드가 올라오는 기능입니다. (구현 대기중)');
  };

  const handleCancelAll = () => {
    clearCart();
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* 중앙 하얀색 쿠폰 스캔 모달 영역 */}
        <View style={styles.scanCard}>
          <Text style={styles.cardTitle}>쿠폰 조회</Text>
          
          <Text style={styles.subTitle}>쿠폰의 바코드를 아래 스캐너에 읽혀주세요!</Text>
          
          <View style={styles.manualSearchRow}>
            <Text style={styles.manualSearchText}>(바코드 인식이 어려운 경우 번호조회 버튼을 눌러주세요.)</Text>
            <TouchableOpacity style={styles.manualSearchButton} onPress={handleManualSearch}>
              <Text style={styles.manualSearchBtnText}>번호조회</Text>
            </TouchableOpacity>
          </View>

          {/* 🔴 가상 스캐너 인터랙션 영역 (터치 시 스캔 성공 처리) */}
          <TouchableOpacity style={styles.scannerGraphicArea} onPress={handleMockScan}>
            <View style={styles.scannerBox}>
              <Text style={styles.scannerLabel}>스캐너</Text>
              <View style={styles.laserLine} />
            </View>
            <View style={styles.mockPhone}>
              <Text style={styles.mockBarcode}>||||||||||||</Text>
            </View>
            <Text style={styles.scanHelperText}>👆 여기를 터치하여 스캔을 연습해보세요</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.innerCancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.innerCancelText}>취소</Text>
          </TouchableOpacity>
        </View>

      </View>

      {/* 하단 공통 네비게이션 탭 (기획서 하단부) */}
      <View style={styles.footer}>
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
  container: { flex: 1, backgroundColor: '#E2E8F0', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  
  // 하얀색 카드 (쿠폰 조회 패널)
  scanCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 30, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  cardTitle: { fontSize: 28, fontWeight: '900', color: '#111', marginBottom: 40 },
  subTitle: { fontSize: 20, fontWeight: 'bold', color: '#334155', marginBottom: 20 },
  
  manualSearchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 40, paddingHorizontal: 10 },
  manualSearchText: { flex: 1, fontSize: 14, color: '#64748B' },
  manualSearchButton: { paddingVertical: 8, paddingHorizontal: 15, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 4 },
  manualSearchBtnText: { fontSize: 14, fontWeight: 'bold', color: '#475569' },
  
  // 바코드 스캐너 그래픽 시뮬레이션
  scannerGraphicArea: { width: '100%', height: 250, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 2, borderColor: '#E2E8F0', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 40, position: 'relative' },
  scannerBox: { position: 'absolute', left: 40, width: 80, height: 60, borderWidth: 2, borderColor: '#1D4ED8', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  scannerLabel: { fontSize: 12, color: '#1D4ED8', fontWeight: 'bold', marginBottom: 5 },
  laserLine: { width: '120%', height: 2, backgroundColor: '#EF4444', position: 'absolute', transform: [{ rotate: '-15deg' }] }, // 빨간 레이저
  mockPhone: { position: 'absolute', right: 40, width: 70, height: 120, borderWidth: 2, borderColor: '#94A3B8', borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  mockBarcode: { fontSize: 20, color: '#111', transform: [{ rotate: '90deg' }] },
  scanHelperText: { position: 'absolute', bottom: 15, fontSize: 14, fontWeight: 'bold', color: '#2563EB' },

  innerCancelButton: { width: '40%', paddingVertical: 15, borderWidth: 1, borderColor: '#1D4ED8', borderRadius: 8, alignItems: 'center' },
  innerCancelText: { fontSize: 18, fontWeight: 'bold', color: '#1D4ED8' },

  // 하단 공통 네비게이션
  footer: { backgroundColor: '#CBD5E1', padding: 20 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  cancelButton: { flex: 1, paddingVertical: 15, backgroundColor: '#E2E8F0', borderWidth: 1, borderColor: '#94A3B8', borderRadius: 8, alignItems: 'center' },
  cancelText: { fontSize: 18, fontWeight: 'bold', color: '#475569' },
  prevButton: { flex: 1, paddingVertical: 15, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#1D4ED8', borderRadius: 8, alignItems: 'center' },
  prevText: { fontSize: 18, fontWeight: 'bold', color: '#1D4ED8' },
  disabledNextButton: { flex: 2, paddingVertical: 15, backgroundColor: '#94A3B8', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  disabledNextText: { fontSize: 18, fontWeight: 'bold', color: '#E2E8F0' },
});