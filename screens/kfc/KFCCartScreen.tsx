import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCartStore } from '../../store/useCartStore';

export default function KFCCartScreen() {
  const navigation = useNavigation<any>();
  // 🔴 Store에서 removeMenu 함수도 같이 꺼내옵니다.
  const { cartItems, totalPrice, removeMenu, clearCart } = useCartStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>◀ 메뉴 추가</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>주문 확인</Text>
        <View style={{ width: 80 }} />
      </View>

      <View style={styles.body}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyText}>장바구니가 비어있습니다.</Text>
          </View>
        ) : (
          <FlatList
            data={cartItems}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            // 🔴 renderItem에 index도 같이 뽑아옵니다.
            renderItem={({ item, index }) => (
              <View style={styles.cartItemRow}>
                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemPrice}>{item.price.toLocaleString()}원</Text>
                </View>
                
                {/* 🔴 삭제 [X] 버튼 추가 */}
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => removeMenu(item.id)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.totalPriceText}>총 결제 금액: {totalPrice.toLocaleString()}원</Text>
        <TouchableOpacity 
          style={[styles.payButton, cartItems.length === 0 && styles.payButtonDisabled]}
          disabled={cartItems.length === 0}
          onPress={() => {
            clearCart(); // 1. 장바구니 DB 제거
            navigation.navigate('KFCReceipt'); // 2. 영수증 화면으로 Redirect 
          }}
          >
            <Text style={styles.payButtonText}>결제하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#EEE' },
  backButton: { backgroundColor: '#374151', padding: 10, borderRadius: 8 },
  backButtonText: { color: '#FFF', fontWeight: 'bold' },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  
  body: { flex: 1, padding: 20 },
  emptyCart: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#9CA3AF' },
  
  cartItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  cartItemInfo: { flex: 1 },
  cartItemName: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  cartItemPrice: { fontSize: 16, color: '#E11D48', fontWeight: 'bold' },
  
  // 삭제 버튼 스타일
  deleteButton: { padding: 10, backgroundColor: '#FEE2E2', borderRadius: 8 },
  deleteButtonText: { color: '#E11D48', fontSize: 16, fontWeight: 'bold' },

  footer: { backgroundColor: '#FFF', padding: 20, borderTopWidth: 1, borderColor: '#EEE' },
  totalPriceText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  payButton: { backgroundColor: '#E11D48', paddingVertical: 15, borderRadius: 10, alignItems: 'center' },
  payButtonDisabled: { backgroundColor: '#D1D5DB' }, // 비활성화 시 회색 처리
  payButtonText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' }
});