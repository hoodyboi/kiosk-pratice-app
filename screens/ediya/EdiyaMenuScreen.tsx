import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image, Modal, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEdiyaCartStore, EdiyaMenuItem, EdiyaOptions } from '../../store/useEdiyaCartStore';

// 1. 가상의 이디야 티(Tea) 메뉴 마스터 데이터 (기획서 사진 기반)
const EDIYA_TEA_MENUS = [
  { id: 'ediya-01', name: '복숭아아이스티', price: 3200, image: 'https://via.placeholder.com/150/E8F0FE/1D4ED8?text=Ice+Tea' },
  { id: 'ediya-02', name: '쌍화차', price: 4500, image: 'https://via.placeholder.com/150/E8F0FE/1D4ED8?text=Sshangwa' },
  { id: 'ediya-03', name: '생강차', price: 4500, image: 'https://via.placeholder.com/150/E8F0FE/1D4ED8?text=Ginger' },
  { id: 'ediya-04', name: '유자차', price: 4500, image: 'https://via.placeholder.com/150/E8F0FE/1D4ED8?text=Yuzu' },
  { id: 'ediya-05', name: '로열밀크티', price: 4900, image: 'https://via.placeholder.com/150/E8F0FE/1D4ED8?text=Milk+Tea' },
  { id: 'ediya-06', name: '자몽차', price: 4500, image: 'https://via.placeholder.com/150/E8F0FE/1D4ED8?text=Grapefruit' },
];

export default function EdiyaMenuScreen() {
  const navigation = useNavigation<any>();
  const { cartItems, totalPrice, addMenu } = useEdiyaCartStore();

  // 🔴 모달 제어 및 현재 선택된 옵션 데이터 상태(State) 관리
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);
  
  // 모달 내부에서 유저가 실시간으로 고르는 옵션 셔틀 버퍼
  const [tempOption, setTempOption] = useState<'HOT' | 'ICED'>('HOT');
  const [sizeOption, setSizeOption] = useState<'L' | 'EX'>('L');
  const [modalQuantity, setModalQuantity] = useState(1);

  // 메뉴 터치 인터셉터 (모달 오픈)
  const handleMenuPress = (menu: any) => {
    setSelectedMenu(menu);
    setTempOption('HOT'); // 초기값 세팅
    setSizeOption('L');
    setModalQuantity(1);
    setIsModalVisible(true);
  };

  // 🔴 장바구니 담기 Commit 트랜잭션 처리 (복합키 생성 알고리즘)
  const handleAddToCart = () => {
    if (!selectedMenu) return;

    // 사이즈가 EX(Extra)면 기본 단가에 1,000원 추가되는 비즈니스 룰 반영
    const isExtra = sizeOption === 'EX';
    const finalPrice = isExtra ? selectedMenu.price + 1000 : selectedMenu.price;

    // ⭐️ 복합키(Composite Key) 생성: id와 옵션을 조합해 고유한 장바구니 ID 발급
    const compositeCartId = `${selectedMenu.id}-${tempOption}-${sizeOption}`;

    const payload: Omit<EdiyaMenuItem, 'quantity'> = {
      id: selectedMenu.id,
      cartId: compositeCartId,
      name: `(${sizeOption})${tempOption} ${selectedMenu.name}`, // 장바구니 노출용 포맷팅
      price: finalPrice,
      options: {
        temp: tempOption,
        size: sizeOption,
      }
    };

    // 선택한 수량만큼 루프 돌리며 스토어에 디스패치
    for (let i = 0; i < modalQuantity; i++) {
      addMenu(payload);
    }

    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 탭바 아키텍처 */}
      <View style={styles.tabHeader}>
        <TouchableOpacity style={styles.activeTab}><Text style={styles.activeTabText}>티(Tea)</Text></TouchableOpacity>
        <TouchableOpacity style={styles.inactiveTab}><Text style={styles.inactiveTabText}>커피</Text></TouchableOpacity>
        <TouchableOpacity style={styles.inactiveTab}><Text style={styles.inactiveTabText}>블렌디드</Text></TouchableOpacity>
        <TouchableOpacity style={styles.inactiveTab}><Text style={styles.inactiveTabText}>빙수</Text></TouchableOpacity>
      </View>

      {/* 메뉴 그리드 레이아웃 */}
      <FlatList
        data={EDIYA_TEA_MENUS}
        keyExtractor={(item) => item.id}
        numColumns={2} // 2열 그리드 배치 (기획서 반영)
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.menuCard} onPress={() => handleMenuPress(item)}>
            <Image source={{ uri: item.image }} style={styles.menuImage} />
            <Text style={styles.menuName}>{item.name}</Text>
            <Text style={styles.menuPrice}>{item.price.toLocaleString()}원</Text>
          </TouchableOpacity>
        )}
      />

      {/* 🔴 하단 고정 바 (결제 대기 레이어) */}
      <View style={styles.footerBar}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerCartCount}>담긴 음료: {cartItems.reduce((acc, cur) => acc + cur.quantity, 0)}개</Text>
          <Text style={styles.footerTotalPrice}>{totalPrice.toLocaleString()}원</Text>
        </View>
        <TouchableOpacity 
          style={[styles.nextButton, cartItems.length === 0 && styles.nextButtonDisabled]}
          disabled={cartItems.length === 0}
          onPress={() => navigation.navigate('EdiyaReward')} 
        >
          <Text style={styles.nextButtonText}>결제하기 💳</Text>
        </TouchableOpacity>
      </View>

      {/* 🔴 [동적 옵션 선택 모달 팝업] - 기획서 4, 5번째 사진 100% 이식 */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMenu && (
              <>
                <Text style={styles.modalTitle}>{selectedMenu.name}</Text>
                <Text style={styles.modalBasePrice}>기본가: {selectedMenu.price.toLocaleString()}원</Text>

                {/* 옵션 세그먼트 1: HOT / ICED 선택 */}
                <Text style={styles.optionLabel}>온도 선택</Text>
                <View style={styles.optionRow}>
                  <TouchableOpacity 
                    style={[styles.optionSelector, tempOption === 'HOT' && styles.selectedHot]} 
                    onPress={() => setTempOption('HOT')}
                  >
                    <Text style={[styles.optionText, tempOption === 'HOT' && styles.selectedText]}>HOT</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.optionSelector, tempOption === 'ICED' && styles.selectedIced]} 
                    onPress={() => setTempOption('ICED')}
                  >
                    <Text style={[styles.optionText, tempOption === 'ICED' && styles.selectedText]}>ICED</Text>
                  </TouchableOpacity>
                </View>

                {/* 옵션 세그먼트 2: Size 선택 */}
                <Text style={styles.optionLabel}>사이즈 선택</Text>
                <View style={styles.optionRow}>
                  <TouchableOpacity 
                    style={[styles.optionSelector, sizeOption === 'L' && styles.selectedSize]} 
                    onPress={() => setSizeOption('L')}
                  >
                    <Text style={[styles.optionText, sizeOption === 'L' && styles.selectedText]}>Large (기본)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.optionSelector, sizeOption === 'EX' && styles.selectedSize]} 
                    onPress={() => setSizeOption('EX')}
                  >
                    <Text style={[styles.optionText, sizeOption === 'EX' && styles.selectedText]}>Extra (+1,000원)</Text>
                  </TouchableOpacity>
                </View>

                {/* 수량 조절 및 최종 커밋 버튼 컴포넌트 팩 */}
                <View style={styles.modalFooter}>
                  <View style={styles.modalQuantityActions}>
                    <TouchableOpacity style={styles.qBtn} onPress={() => setModalQuantity(p => Math.max(1, p - 1))}>
                      <Text style={styles.qBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalQuantityText}>{modalQuantity}</Text>
                    <TouchableOpacity style={styles.qBtn} onPress={() => setModalQuantity(p => p + 1)}>
                      <Text style={styles.qBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.modalActionButtons}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsModalVisible(false)}>
                      <Text style={styles.cancelBtnText}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.confirmBtn} onPress={handleAddToCart}>
                      <Text style={styles.confirmBtnText}>선택완료</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  
  tabHeader: { flexDirection: 'row', backgroundColor: '#1D4ED8', paddingHorizontal: 10 },
  activeTab: { flex: 1, paddingVertical: 15, alignItems: 'center', backgroundColor: '#1E3A8A', borderBottomWidth: 4, borderColor: '#FBBF24' },
  activeTabText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  inactiveTab: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  inactiveTabText: { color: '#93C5FD', fontSize: 16 },

  gridRow: { justifyContent: 'space-between', paddingHorizontal: 15, marginTop: 15 },
  menuCard: { width: '47%', backgroundColor: '#F8FAFC', borderRadius: 12, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  menuImage: { width: 120, height: 120, borderRadius: 10, marginBottom: 10 },
  menuName: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 5 },
  menuPrice: { fontSize: 16, fontWeight: '700', color: '#1D4ED8' },

  footerBar: { flexDirection: 'row', padding: 20, backgroundColor: '#F1F5F9', borderTopWidth: 1, borderColor: '#CBD5E1', alignItems: 'center' },
  footerInfo: { flex: 1 },
  footerCartCount: { fontSize: 16, color: '#475569', fontWeight: '600' },
  footerTotalPrice: { fontSize: 26, fontWeight: '900', color: '#1E3A8A' },
  nextButton: { backgroundColor: '#1D4ED8', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 8 },
  nextButtonDisabled: { backgroundColor: '#94A3B8' },
  nextButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

  // 모달 레이아웃 엔진
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, minHeight: '55%' },
  modalTitle: { fontSize: 26, fontWeight: '900', color: '#111', marginBottom: 5 },
  modalBasePrice: { fontSize: 16, color: '#64748B', marginBottom: 25 },
  
  optionLabel: { fontSize: 16, fontWeight: 'bold', color: '#334155', marginBottom: 10 },
  optionRow: { flexDirection: 'row', marginBottom: 25, gap: 10 },
  optionSelector: { flex: 1, paddingVertical: 15, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center' },
  optionText: { fontSize: 16, fontWeight: '700', color: '#64748B' },
  
  selectedHot: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
  selectedIced: { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' },
  selectedSize: { backgroundColor: '#FEF3C7', borderColor: '#D97706' },
  selectedText: { color: '#111' },

  modalFooter: { marginTop: 'auto', borderTopWidth: 1, borderColor: '#E2E8F0', paddingTop: 20 },
  modalQuantityActions: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20, gap: 20 },
  qBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  qBtnText: { fontSize: 22, fontWeight: 'bold' },
  modalQuantityText: { fontSize: 22, fontWeight: 'bold' },

  modalActionButtons: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, paddingVertical: 15, borderRadius: 8, backgroundColor: '#F1F5F9', alignItems: 'center' },
  cancelBtnText: { fontSize: 18, fontWeight: 'bold', color: '#64748B' },
  confirmBtn: { flex: 2, paddingVertical: 15, borderRadius: 8, backgroundColor: '#1D4ED8', alignItems: 'center' },
  confirmBtnText: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
});