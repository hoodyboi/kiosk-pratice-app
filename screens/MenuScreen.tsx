import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useCartStore } from '../store/useCartStore';
import { useNavigation } from '@react-navigation/native'; // 1. 네비게이션 훅 추가

const MENU_DATA = [
  { id: '1', name: '빅맥 세트', price: 6500 },
  { id: '2', name: '치즈버거', price: 3000 },
  { id: '3', name: '불고기버거', price: 3500 },
  { id: '4', name: '아메리카노', price: 2000 },
];

export default function MenuScreen() {
  const navigation = useNavigation(); // 2. 네비게이션 객체 생성
  const { cartItems, totalPrice, addMenu, clearCart } = useCartStore();

  // 1. 남은 시간 상태 (초기값 60초)
  const [timeLeft, setTimeLeft] = useState(60);

  // 2. 화면이 켜지면 1초마다 타이머 깎는 로직
  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // 3. 시간이 0초가 되면 쫓아내기
    if (timeLeft === 0) {
      clearInterval(timerId); // 타이머 멈춤
      Alert.alert('시간 초과!', '앗, 시간이 다 지났어요. 처음부터 다시 연습해볼까요?', [
        { 
          text: '확인', 
          onPress: () => {
            clearCart();
            navigation.goBack();
          } 
        }
      ]);
    }

    // 화면 나갈 때 메모리 정리 (Clean-up)
    return () => clearInterval(timerId);
  }, [timeLeft, navigation, clearCart]);

  const handlePayment = () => {
    if (cartItems.length === 0) {
      Alert.alert('알림', '메뉴를 먼저 선택해주세요!');
      return;
    }
    Alert.alert('결제 완료', `총 ${totalPrice}원 결제 연습이 완료되었습니다!`, [
      { 
        text: '확인', 
        onPress: () => {
          clearCart();
          navigation.goBack(); // 결제 완료되면 첫 화면으로 튕겨주기
        } 
      }
    ]);
  };


return (
    <SafeAreaView style={styles.container}>
      
      {/* 1. 상단 바 영역 (처음으로 버튼 + 타이틀 + 타이머) */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => { 
            clearCart(); 
            navigation.goBack(); 
          }}
        >
          <Text style={styles.backButtonText}>◀ 처음으로</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>메뉴 선택</Text>
        
        {/* 우측 상단 60초 타이머 박스 */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timeLeft}초</Text>
        </View>
      </View>

      {/* 2. 메뉴판 리스트 영역 */}
      <View style={styles.menuContainer}>
        {MENU_DATA.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.menuItem}
            onPress={() => addMenu(item)}
          >
            <Text style={styles.menuName}>{item.name}</Text>
            <Text style={styles.menuPrice}>{item.price}원</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 3. 하단 장바구니 현황판 영역 */}
      <View style={styles.cartContainer}>
        <View style={styles.cartInfo}>
          <Text style={styles.cartText}>담은 갯수: {cartItems.length}개</Text>
          <Text style={styles.cartTotal}>총 금액: {totalPrice}원</Text>
        </View>
        
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>결제하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// 4. 전체 화면 스타일 시트 (CSS)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  topBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  backButton: { 
    backgroundColor: '#374151', 
    paddingVertical: 10, 
    paddingHorizontal: 15, 
    borderRadius: 10 
  },
  backButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#111827', textAlign: 'center', flex: 1 },
  
  // 타이머 박스 스타일
  timerContainer: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#DC2626',
  },

  menuContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 20, gap: 15 },
  menuItem: { 
    backgroundColor: '#FFF', padding: 25, borderRadius: 15, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
  },
  menuName: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  menuPrice: { fontSize: 22, color: '#E11D48', fontWeight: '600' },
  
  cartContainer: { 
    backgroundColor: '#111827', padding: 25, paddingBottom: 40, 
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  cartInfo: { flex: 1 },
  cartText: { color: '#FFF', fontSize: 18, marginBottom: 5 },
  cartTotal: { color: '#FBBF24', fontSize: 26, fontWeight: 'bold' },
  payButton: { backgroundColor: '#16A34A', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 15 },
  payButtonText: { color: '#FFF', fontSize: 22, fontWeight: 'bold' }
});
 