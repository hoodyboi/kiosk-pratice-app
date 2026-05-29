import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function KFCReceiptScreen() {
  const navigation = useNavigation<any>();
  
  // 1. 카운트다운 상태 (10초)
  const [timeLeft, setTimeLeft] = useState(10);
  // 2. 대기번호 난수 생성 (100 ~ 999 랜덤 번호 발급)
  const [orderNumber] = useState(() => Math.floor(Math.random() * 900) + 100); 

  // 🔴 핵심 로직: 10초 카운트다운 비동기 타이머 및 스레드(Thread) 제어
  useEffect(() => {
    // 타이머가 0이 되면 즉시 홈(초기) 화면으로 강제 리다이렉트
    if (timeLeft <= 0) {
      handleFinish('대기번호 (타임아웃)');
      return;
    }

    // 1초(1000ms)마다 timeLeft를 1씩 깎는 인터벌 실행
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // ⭐️ 클린업(Cleanup) 함수: 화면이 꺼지거나 재랜더링될 때 돌아가던 타이머를 확실히 죽임 (Memory Leak 방지)
    return () => clearInterval(timerId);
  }, [timeLeft]);

  // 완료 후 홈 화면(통합 브랜드 로비)으로 돌아가는 공통 액션
  const handleFinish = (type: string) => {
    console.log(`${type} 출력 완료. 세션을 종료하고 홈으로 복귀합니다.`);
    
    // 네비게이션 스택을 완전히 소각하고(Index 0) Home으로 꽂아버림 (이중 결제 및 뒤로 가기 꼼수 원천 차단)
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }], 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 백그라운드를 반투명 검정으로 덮어서 팝업(Modal) 느낌 연출 */}
      <View style={styles.overlay}>
        
        <View style={styles.modalBox}>
          <Text style={styles.title}>영수증 필요하세요?</Text>
          
          <Text style={styles.subtitle}>
            <Text style={styles.highlight}>{timeLeft}</Text> 초 후에 대기번호만 출력됩니다.
          </Text>

          <Text style={styles.orderNumberLabel}>대기번호</Text>
          <Text style={styles.orderNumberText}>{orderNumber}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.waitNumberButton]} 
              onPress={() => handleFinish('대기번호')}
            >
              <Text style={styles.waitNumberText}>대기번호만 출력</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.fullReceiptButton]} 
              onPress={() => handleFinish('전체영수증')}
            >
              <Text style={styles.fullReceiptText}>전체영수증 출력</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  
  // 모달 오버레이 스타일
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { width: '100%', backgroundColor: '#FFF', borderRadius: 20, padding: 30, alignItems: 'center', elevation: 15, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10 },
  
  // 텍스트 스타일링
  title: { fontSize: 26, fontWeight: 'bold', color: '#111', marginBottom: 20 },
  subtitle: { fontSize: 18, color: '#4B5563', marginBottom: 40 },
  highlight: { color: '#E11D48', fontWeight: '900', fontSize: 24 },
  
  orderNumberLabel: { fontSize: 18, color: '#6B7280', marginBottom: 5 },
  orderNumberText: { fontSize: 72, fontWeight: '900', color: '#E11D48', marginBottom: 50 },
  
  // 하단 버튼 그리드
  buttonContainer: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  actionButton: { flex: 1, paddingVertical: 18, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, marginHorizontal: 5 },
  
  waitNumberButton: { backgroundColor: '#E11D48', borderColor: '#E11D48' },
  waitNumberText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  
  fullReceiptButton: { backgroundColor: '#FFF', borderColor: '#E5E7EB' },
  fullReceiptText: { color: '#374151', fontSize: 18, fontWeight: 'bold' },
});