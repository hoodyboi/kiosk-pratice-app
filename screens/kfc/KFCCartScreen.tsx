import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCartStore } from '../../store/useCartStore';

export default function KFCCartScreen() {
  const navigation = useNavigation<any>();
  // 스토어에서 모든 액션 유틸리티 함수들을 땡겨옵니다.
  const { cartItems, totalPrice, addMenu, removeMenu, clearCart } = useCartStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>◀ 메뉴 추가</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>장바구니</Text>
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
            keyExtractor={(item) => item.id} // 이제 중복 라인이 없으므로 item.id 만으로 유니크 보장 가능
            renderItem={({ item }) => (
              <View style={styles.cartItemRow}>
                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  {/* 단가 * 개수로 표기하지 않고, 개수별 총합 금액으로 노출 처리 */}
                  <Text style={styles.cartItemPrice}>{(item.price * item.quantity).toLocaleString()}원</Text>
                </View>
                
                {/* 🔴 실제 KFC 키오스크 스타일 수량 조절 컴포넌트 팩 */}
                <View style={styles.quantityContainer}>
                  <TouchableOpacity 
                    style={styles.quantityButton} 
                    onPress={() => removeMenu(item.id)}
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  
                  <TouchableOpacity 
                    style={styles.quantityButton} 
                    onPress={() => addMenu(item)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
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
            clearCart(); 
            navigation.navigate('KFCReceipt'); 
          }}
        >
          <Text style={styles.payButtonText}>결제하기 {totalPrice.toLocaleString()}</Text>
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
  
  // 수량 조절 버튼 박스 스타일링
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 8, padding: 4 },
  quantityButton: { width: 36, height: 36, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderRadius: 6, borderWidth: 1, borderColor: '#E5E7EB' },
  quantityButtonText: { fontSize: 18, fontWeight: 'bold', color: '#4B5563' },
  quantityText: { fontSize: 16, fontWeight: 'bold', color: '#111', paddingHorizontal: 15, textAlign: 'center' },

  footer: { backgroundColor: '#FFF', padding: 20, borderTopWidth: 1, borderColor: '#EEE' },
  totalPriceText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  payButton: { backgroundColor: '#E11D48', paddingVertical: 15, borderRadius: 10, alignItems: 'center' },
  payButtonDisabled: { backgroundColor: '#D1D5DB' },
  payButtonText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' }
});