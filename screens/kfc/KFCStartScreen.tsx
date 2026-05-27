import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useKFCCartStore, KFCOrderType } from '../../store/useKFCCartStore';

export default function KFCStartScreen() {
    const navigation = useNavigation<any>();
    const setOrderType = useKFCCartStore(state => state.setOrderType);

    const handleSelectOrderType = (type: KFCOrderType) => {
      setOrderType(type);
      navigation.navigate('KFCMenu');
    };

    return (
        <SafeAreaView style={styles.container}>
          {/* 1. 상단 KFC 로고 및 타이틀 영역 */}
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>KFC</Text>
            </View>
            <View style={styles.titleBox}>
              <Text style={styles.mainTitle}>주문하기</Text>
              <Text style={styles.subTitle}>카드 결제 전용</Text>
            </View>
          </View>
    
          {/* 2. 중앙 포스터 영역 (기획서의 살라미 버거 포스터 대체) */}
          <View style={styles.posterContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/600x800/111111/FFFFFF?text=KFC+Burger+Poster' }}
              style={styles.posterImage}
              resizeMode="cover"
            />
          </View>
    
          {/* 3. 하단 매장 식사 / 포장 주문 버튼 영역 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleSelectOrderType('매장 식사')}
            >
              <Text style={styles.buttonIcon}>🍽️</Text>
              <Text style={styles.buttonText}>매장 식사</Text>
            </TouchableOpacity>
    
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleSelectOrderType('포장 주문')}
            >
              <Text style={styles.buttonIcon}>🛍️</Text>
              <Text style={styles.buttonText}>포장 주문</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }
    
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#F9FAFB', borderBottomWidth: 1, borderColor: '#EEE' },
    logoBox: { backgroundColor: '#E11D48', padding: 10, borderRadius: 5 },
    logoText: { color: '#FFF', fontSize: 24, fontWeight: '900', fontStyle: 'italic' },
    titleBox: { alignItems: 'flex-end' },
    mainTitle: { fontSize: 32, fontWeight: '900', color: '#111' },
    subTitle: { fontSize: 18, fontWeight: '600', color: '#4B5563', marginTop: 4 },
    
    posterContainer: { flex: 1, width: '100%' },
    posterImage: { width: '100%', height: '100%' },
    
    buttonContainer: { flexDirection: 'row', padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#EEE' },
    actionButton: { flex: 1, backgroundColor: '#F3F4F6', marginHorizontal: 5, paddingVertical: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#E5E7EB' },
    buttonIcon: { fontSize: 40, marginBottom: 10 },
    buttonText: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
});