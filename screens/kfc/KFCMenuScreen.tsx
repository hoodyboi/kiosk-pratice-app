import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Image, Platform, StatusBar, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCartStore } from '../../store/useCartStore';

// KFC 실제 메뉴 더미 데이터 (카테고리별로 분류)
const KFC_CATEGORIES = ['베스트 메뉴', '버거박스', '치킨', '사이드', '음료'];
const KFC_MENUS = [
  { id: 'k1', name: '빵치짜징거팩', price: 13900, category: '베스트 메뉴', img: 'https://via.placeholder.com/150/FFDDDD/000000?text=Burger' },
  { id: 'k2', name: '치즈징거통다리박스', price: 11500, category: '베스트 메뉴', img: 'https://via.placeholder.com/150/FFDDDD/000000?text=Cheese' },
  { id: 'k3', name: '징거타워박스', price: 11200, category: '버거박스', img: 'https://via.placeholder.com/150/FFDDDD/000000?text=Tower' },
  { id: 'k4', name: '핫크리스피통다리', price: 3600, category: '치킨', img: 'https://via.placeholder.com/150/FFDDDD/000000?text=Chicken' },
  { id: 'd1', name: '코카콜라(M)', price: 2200, category: '음료', img: 'https://via.placeholder.com/150/111111/FFFFFF?text=Coke' },
  { id: 'd2', name: '코카콜라제로(M)', price: 2200, category: '음료', img: 'https://via.placeholder.com/150/111111/FFFFFF?text=Zero+Coke' },
  { id: 'd3', name: '스프라이트(M)', price: 2200, category: '음료', img: 'https://via.placeholder.com/150/22C55E/FFFFFF?text=Sprite' },
  { id: 'd4', name: '환타오렌지(M)', price: 2200, category: '음료', img: 'https://via.placeholder.com/150/F97316/FFFFFF?text=Fanta' },
  { id: 'd5', name: '아이스아메리카노', price: 2500, category: '음료', img: 'https://via.placeholder.com/150/451A03/FFFFFF?text=Americano' },
];

const SIDE_OPTIONS = [
  { id: 's1', name: '코울슬로', price: 2000, img: '' },
  { id: 's2', name: '비스켓', price: 2500, img: '' },
];

export default function KFCMenuScreen() {
  const navigation = useNavigation<any>();
  const [activeCategory, setActiveCategory] = useState('베스트 메뉴');
  const { cartItems, totalPrice, addMenu } = useCartStore();

  // 모달 제어용 상태
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // 체크된 사이드 메뉴들의 ID를 담아둘 배열 State (타입스크립트 소문자 string)
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  
  // 현재 선택된 카테고리의 메뉴만 필터링
  const filteredMenus = KFC_MENUS.filter(menu => menu.category === activeCategory);

  const handleCheckout = () => {
    if (cartItems.length === 0) return alert('메뉴를 선택해주세요!');
    // 네비게이션을 통해 App.tsx에 등록한 'KFCCart' 화면으로 쏴버립니다.
    navigation.navigate('KFCCart');
  }
  const handleMenuPress = (item: any) => {
    setSelectedItem(item); 
    setSelectedSides([]); // 모달 켤 때마다 사이드 선택 내역 초기화
    setModalVisible(true); 
  };

  const handleToggleSide = (sideId: string) => {
    setSelectedSides(prev =>
      prev.includes(sideId)
        ? prev.filter(id => id !== sideId)
        : [...prev, sideId]
    );
  };

  const handleAddToCartConfirm = () => {
    if (selectedItem) {
      // 1. 메인 메뉴 장바구니 담기
      addMenu(selectedItem);

      // 2. 선택된 사이드 메뉴 순회하며 장바구니 담기
      selectedSides.forEach(sideId => {
        const sideItem = SIDE_OPTIONS.find(s => s.id === sideId);
        if (sideItem) addMenu(sideItem);
      });

      // 3. 모달 끄고 상태 비우기
      setModalVisible(false);
      setSelectedItem(null);
      setSelectedSides([]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. 상단 네비게이션 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>◀ 처음으로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>KFC 메뉴 선택</Text>
        <View style={{ width: 80 }} /> 
      </View>

      {/* 2. 중앙 영역 (좌측 카테고리 + 우측 메뉴 리스트) */}
      <View style={styles.body}>
        {/* 좌측 사이드바 */}
        <View style={styles.sidebar}>
          {KFC_CATEGORIES.map((category) => (
            <TouchableOpacity 
              key={category} 
              style={[styles.categoryItem, activeCategory === category && styles.categoryActive]}
              onPress={() => setActiveCategory(category)}
            >
              <Text style={[styles.categoryText, activeCategory === category && styles.categoryTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 우측 메뉴 리스트 */}
        <View style={styles.menuContent}>
          <FlatList
            data={filteredMenus}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.menuCard} onPress={() => handleMenuPress(item)}>
                <Image source={{ uri: item.img }} style={styles.menuImage} />
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuPrice}>{item.price.toLocaleString()}원</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      {/* 3. 하단 장바구니 영역 */}
      <View style={styles.cartFooter}>
        <View style={styles.cartInfo}>
          <Text style={styles.cartCountText}>장바구니 <Text style={styles.badge}>{cartItems.length}</Text></Text>
          <Text style={styles.cartTotalText}>주문금액: {totalPrice.toLocaleString()}원</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>주문확인</Text>
        </TouchableOpacity>
      </View>
      
      {/* 4. 옵션 선택 모달 팝업 */}
      <Modal animationType='fade' transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                <Text style={styles.modalDesc}>KFC 대표 추천 메뉴입니다.</Text>

                <View style={styles.recommendBox}>
                  <Text style={styles.recommendTitle}>같이 먹기 좋은 사이드 추천</Text>

                  {SIDE_OPTIONS.map(side => {
                    const isSelected = selectedSides.includes(side.id); 
                    return (
                      <TouchableOpacity
                        key={side.id}
                        style={[styles.sideItemRow, isSelected && styles.sideItemRowActive]}
                        onPress={() => handleToggleSide(side.id)}
                      >
                        <Text style={styles.sideItemName}>+ {side.name}</Text>
                        <Text style={styles.sideItemPrice}>
                          {side.price.toLocaleString()}원 {isSelected ? '(✔)' : ''}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.modalButtonGroup}>
                  {/* 이전 (취소) 버튼 */}
                  <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalCancelText}>이전</Text>
                  </TouchableOpacity>
                  {/* 장바구니에 담기 (확인) 버튼 */}
                  <TouchableOpacity style={styles.modalAddButton} onPress={handleAddToCartConfirm}>
                    <Text style={styles.modalAddText}>장바구니에 담기</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      
    </SafeAreaView>
  );
} // 🚨 [핵심] 여기서 컴포넌트가 완벽하게 닫힙니다!

// --- 스타일 시트 ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#EEE' },
  backButton: { backgroundColor: '#374151', padding: 10, borderRadius: 8 },
  backButtonText: { color: '#FFF', fontWeight: 'bold' },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  
  body: { flex: 1, flexDirection: 'row' },
  
  sidebar: { width: '25%', backgroundColor: '#FFF', borderRightWidth: 1, borderColor: '#EEE' },
  categoryItem: { paddingVertical: 25, paddingHorizontal: 10, borderBottomWidth: 1, borderColor: '#F3F4F6', alignItems: 'center' },
  categoryActive: { backgroundColor: '#FEE2E2', borderLeftWidth: 4, borderColor: '#E11D48' },
  categoryText: { fontSize: 16, fontWeight: '600', color: '#666', textAlign: 'center' },
  categoryTextActive: { color: '#E11D48', fontWeight: 'bold' },

  menuContent: { width: '75%', padding: 10 },
  menuCard: { flex: 1, backgroundColor: '#FFF', margin: 5, padding: 15, borderRadius: 10, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  menuImage: { width: 100, height: 100, marginBottom: 10, borderRadius: 10 },
  menuName: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  menuPrice: { fontSize: 18, color: '#E11D48', fontWeight: 'bold' },

  cartFooter: { flexDirection: 'row', backgroundColor: '#FFF', padding: 20, paddingBottom: Platform.OS === 'android' ? 40 : 20, borderTopWidth: 1, borderColor: '#EEE', justifyContent: 'space-between', alignItems: 'center' },
  cartInfo: { flex: 1 },
  cartCountText: { fontSize: 16, color: '#666', marginBottom: 5 },
  badge: { backgroundColor: '#E11D48', color: '#FFF', paddingHorizontal: 6, borderRadius: 10, overflow: 'hidden' },
  cartTotalText: { fontSize: 24, fontWeight: 'bold', color: '#E11D48' },
  checkoutButton: { backgroundColor: '#E11D48', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10 },
  checkoutButtonText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#FFF', borderRadius: 20, padding: 25, elevation: 10, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  modalDesc: { fontSize: 16, color: '#666', marginBottom: 20 },
  
  recommendBox: { backgroundColor: '#F3F4F6', padding: 15, borderRadius: 10, marginBottom: 25 },
  recommendTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  
  modalButtonGroup: { flexDirection: 'row', justifyContent: 'space-between' },
  modalCancelButton: { flex: 1, backgroundColor: '#E5E7EB', paddingVertical: 15, borderRadius: 10, marginRight: 10, alignItems: 'center' },
  modalCancelText: { fontSize: 18, fontWeight: 'bold', color: '#4B5563' },
  modalAddButton: { flex: 1, backgroundColor: '#E11D48', paddingVertical: 15, borderRadius: 10, marginLeft: 10, alignItems: 'center' },
  modalAddText: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },

  sideItemRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#FFF', borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  sideItemRowActive: { backgroundColor: '#FEF2F2', borderColor: '#F87171' },
  sideItemName: { fontSize: 16, color: '#374151' },
  sideItemPrice: { fontSize: 16, fontWeight: 'bold', color: '#111' },
});