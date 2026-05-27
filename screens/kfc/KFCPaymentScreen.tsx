import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useKFCCartStore } from '../../store/useKFCCartStore';

export default function KFCPaymentScreen() {
    const navigation = useNavigation<any>();
    const { totalPrice, clearCart } = useKFCCartStore();

    // 결제 프로세스 상태 관리 (IDLE: 대기, PROCESSING: 결제중)
    const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'PROCESSING'>('IDLE');
    const [selectedMethod, setSelectedMethod] = useState<string>('');

    const handlePayment = (methodName: string) => {
        setSelectedMethod(methodName);
        setPaymentStatus('PROCESSING');
    };

    useEffect(() => {
        if (paymentStatus === 'PROCESSING') {
            const timer = setTimeout(() => {
                clearCart();
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'KFCReceipt' }],
                });
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [paymentStatus]);

    // 결제 중(PROCESSING) 레이아웃 - 기획서의 삼성페이 단말기 접촉 화면 역할
    if (paymentStatus === 'PROCESSING') {
        return (
            <SafeAreaView style={[styles.container, styles.processingContainer]}>
                <ActivityIndicator size="large" color="#E11D48" />
                <Text style={styles.processingTitle}>{selectedMethod} 결제 진행 중</Text>
                <Text style={styles.processingSub}>아래 단말기에 스마트폰을 접촉하거나</Text>
                <Text style={styles.processingSub}>카드를 투입구에 끝까지 넣어주세요.</Text>
                <Text style={styles.processingAmount}>결제금액: {totalPrice.toLocaleString()}원</Text>
            </SafeAreaView>
        );
    }

    // 기본 결제수단 선택(IDLE) 레이아웃
    return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>◀ 장바구니</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>최종 결제</Text>
        <View style={{ width: 80 }} />
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>결제 수단을 선택해주세요</Text>
        <Text style={styles.totalAmount}>결제할 금액: {totalPrice.toLocaleString()}원</Text>

        {/* 간편 결제 그리드 아키텍처 */}
        <View style={styles.grid}>
          <TouchableOpacity style={[styles.payButton, styles.samsungPay]} onPress={() => handlePayment('삼성페이')}>
            <Text style={styles.payButtonText}>📱 삼성페이</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.payButton, styles.applePay]} onPress={() => handlePayment('애플페이')}>
            <Text style={styles.payButtonText}>🍏 애플페이</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.payButton, styles.naverPay]} onPress={() => handlePayment('네이버페이')}>
            <Text style={styles.payButtonText}>🟢 네이버페이</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.payButton, styles.kakaoPay]} onPress={() => handlePayment('카카오페이')}>
            <Text style={styles.payButtonText}>💛 카카오페이</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.payButton, styles.creditCard]} onPress={() => handlePayment('신용카드')}>
            <Text style={styles.payButtonText}>💳 신용/체크카드</Text>
          </TouchableOpacity>
        </View>
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
    
    body: { flex: 1, padding: 25, justifyContent: 'center' },
    sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#111', textAlign: 'center', marginBottom: 10 },
    totalAmount: { fontSize: 20, color: '#E11D48', fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
    
    grid: { width: '100%' },
    payButton: { width: '100%', paddingVertical: 20, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    payButtonText: { fontSize: 20, fontWeight: 'bold' },
    
    samsungPay: { backgroundColor: '#E1F5FE' },
    applePay: { backgroundColor: '#F3F4F6' },
    naverPay: { backgroundColor: '#E8F5E9' },
    kakaoPay: { backgroundColor: '#FFFDE7' },
    creditCard: { backgroundColor: '#E11D48' },
  
    // 로딩 오버레이 스타일
    processingContainer: { backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', padding: 20 },
    processingTitle: { fontSize: 26, fontWeight: 'bold', color: '#111', marginTop: 20, marginBottom: 15 },
    processingSub: { fontSize: 16, color: '#6B7280', lineHeight: 24, textAlign: 'center' },
    processingAmount: { fontSize: 22, fontWeight: 'bold', color: '#E11D48', marginTop: 30 },
});