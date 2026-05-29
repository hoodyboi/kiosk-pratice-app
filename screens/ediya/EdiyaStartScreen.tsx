import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEdiyaCartStore, EdiyaOrderType } from '../../store/useEdiyaCartStore';

export default function EdiyaStartScreen() {
  const navigation = useNavigation<any>();
  const setOrderType = useEdiyaCartStore(state => state.setOrderType);

  const handleSelectOrderType = (type: EdiyaOrderType) => {
    setOrderType(type);
    navigation.navigate('EdiyaMenu'); // 다음 스텝에서 만들 메뉴판으로 쏠 준비
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 안내 문구 영역 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>카드 / 모바일쿠폰 결제 전용</Text>
        <Text style={styles.headerSub}>현금, 기타 결제 및 할인이 필요하신 경우,</Text>
        <Text style={styles.headerSub}>카운터를 이용해주세요.</Text>
      </View>

      {/* 중앙 포스터 영역 (컵빙수 광고 대체 이미지) */}
      <View style={styles.posterContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/600x800/E8F0FE/1D4ED8?text=EDIYA+Real+Deep+Bingsu' }}
          style={styles.posterImage}
          resizeMode="cover"
        />
      </View>

      {/* 하단 버튼 영역 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>맛있는 음료와 베이커리</Text>
        <Text style={styles.footerText}>정성껏 준비해드리겠습니다.</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.inStoreButton]}
            onPress={() => handleSelectOrderType('매장에서 먹어요')}
          >
            <Text style={styles.inStoreButtonText}>매장에서 먹어요</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.takeoutButton]}
            onPress={() => handleSelectOrderType('포장해서 갈래요')}
          >
            <Text style={styles.takeoutButtonText}>포장해서 갈래요</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  
  header: { padding: 20, alignItems: 'center', backgroundColor: '#F8FAFC', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#1E3A8A', marginBottom: 10 },
  headerSub: { fontSize: 16, color: '#334155' },
  
  posterContainer: { flex: 1, width: '100%' },
  posterImage: { width: '100%', height: '100%' },
  
  footer: { backgroundColor: '#1D4ED8', padding: 25, alignItems: 'center' }, // 이디야 시그니처 블루
  footerText: { color: '#FFF', fontSize: 18, fontWeight: '500', marginBottom: 5 },
  
  buttonContainer: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 20 },
  actionButton: { flex: 1, paddingVertical: 20, marginHorizontal: 5, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  
  inStoreButton: { backgroundColor: '#1E3A8A', borderWidth: 1, borderColor: '#FFF' }, // 진한 파랑
  inStoreButtonText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  
  takeoutButton: { backgroundColor: '#FFF' },
  takeoutButtonText: { color: '#1D4ED8', fontSize: 20, fontWeight: 'bold' },
});