import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function KFCReceiptScreen() {
    const navigation = useNavigation<any>();
    
    // 임시 주문번호
    const orderNumber = Math.floor(100 + Math.random() * 900);

    const handleGoHome = () => {
        // 뒤로 가기 방지를 위해 내비게이션 스택을 통째로 날리고 첫 화면으로 강제 세팅
        navigation.reset({
            index: 0,
            routes: [{ name: 'KFCMenu' }], // 처음 진입했던 메인 화면 이름
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.icon}>🎉</Text>
                <Text style={styles.title}>결제가 완료되었습니다</Text>

                <Text style={styles.orderNumberLabel}>주문 번호</Text>
                <Text style={styles.orderNumber}>{orderNumber}</Text>

                <View style={styles.receiptBox}>
                <Text style={styles.receiptText}>지점명: KFC OO점</Text>
                <Text style={styles.receiptText}>결제수단: 신용카드 (앱카드)</Text>
                <Text style={styles.receiptText}>잠시 후 모니터에서 주문번호를 확인해주세요.</Text>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
                        <Text style={styles.homeButtonText}>처음으로 돌아가기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E11D48', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    icon: { fontSize: 80, marginBottom: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 40 },
    
    orderNumberLabel: { fontSize: 18, color: '#FFF', opacity: 0.8, marginBottom: 5 },
    orderNumber: { fontSize: 60, fontWeight: '900', color: '#FFF', marginBottom: 40 },
    
    receiptBox: { backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 20, borderRadius: 15, width: '100%', alignItems: 'center' },
    receiptText: { color: '#FFF', fontSize: 16, marginBottom: 8, opacity: 0.9 },
    
    footer: { padding: 20, backgroundColor: '#E11D48' },
    homeButton: { backgroundColor: '#FFF', paddingVertical: 18, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    homeButtonText: { color: '#E11D48', fontSize: 20, fontWeight: 'bold' }
  });