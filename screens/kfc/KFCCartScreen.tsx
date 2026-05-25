import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCartStore } from '../../store/useCartStore';

export default function KFCCartScreen() {
  const navigation = useNavigation<any>();
  const { cartItems, totalPrice } = useCartStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>◀ 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>주문 확인</Text>
        <View style={{ width: 60 }} />
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
            renderItem={({ item }) => (
              <View style={styles.cartItemRow}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.cartItemPrice}>{item.price.toLocaleString()}원</Text>
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.totalPriceText}>총 결제 금액: {totalPrice.toLocaleString()}원</Text>
        <TouchableOpacity style={styles.payButton} onPress={() => alert('결제 연동은 다음 스프린트에서!')}>
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
  
  cartItemRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  cartItemName: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  cartItemPrice: { fontSize: 18, color: '#E11D48', fontWeight: 'bold' },

  footer: { backgroundColor: '#FFF', padding: 20, borderTopWidth: 1, borderColor: '#EEE' },
  totalPriceText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  payButton: { backgroundColor: '#E11D48', paddingVertical: 15, borderRadius: 10, alignItems: 'center' },
  payButtonText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' }
});