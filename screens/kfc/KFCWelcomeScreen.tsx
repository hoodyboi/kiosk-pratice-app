import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, StatusBar, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 현재 기기의 화면 너비를 실시간으로 가져옵니다 (반응형 뼈대)
const { width } = Dimensions.get('window');

export default function KFCWelcomeScreen() {
  const navigation = useNavigation<any>();

  const handleSelectOrderType = (type: 'EAT_IN' | 'TAKE_OUT') => {
    console.log(`KFC 주문 타입 선택: ${type}`);
    navigation.navigate('KFCMenu'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 1. 상단 바 영역 (뒤로가기 버튼 추가 + 로고 + 타이틀) */}
      <View style={styles.topBar}>
        {/* 🔴 뒤로 가기 버튼 (홈 허브 화면으로 복귀) */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>◀ 처음으로</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText} allowFontScaling={false}>주문하기</Text>
          <Text style={styles.subTitleText} allowFontScaling={false}>카드 결제 전용</Text>
        </View>
      </View>

      {/* 2. 중앙 광고 영역 */}
      <View style={styles.adContainer}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/600x800/222222/FFFFFF?text=KFC+Giant+Burger+Image' }} 
          style={styles.adImage}
          resizeMode="cover"
        />
        
        <View style={styles.adTextOverlay}>
          {/* 🔴 반응형 텍스트의 핵심 속성 2가지 
            - allowFontScaling={false}: 사용자가 폰 설정에서 글씨를 키워도 이 앱은 무시함 (키오스크 고정 감성)
            - adjustsFontSizeToFit: 글자가 영역을 벗어나려 하면 자동으로 폰트 사이즈를 줄여서 욱여넣음
            - numberOfLines={1}: 무조건 한 줄로만 유지
          */}
          <Text style={styles.adLargeText} allowFontScaling={false} adjustsFontSizeToFit numberOfLines={1}>버거,</Text>
          <Text style={styles.adLargeText} allowFontScaling={false} adjustsFontSizeToFit numberOfLines={1}>살라미</Text>
          <Text style={styles.adLargeText} allowFontScaling={false} adjustsFontSizeToFit numberOfLines={1}>켄치짜를</Text>
          <Text style={styles.adLargeText} allowFontScaling={false} adjustsFontSizeToFit numberOfLines={1}>품다</Text>
        </View>
      </View>

      {/* 3. 하단 주문 타입 선택 버튼 영역 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.orderButton} onPress={() => handleSelectOrderType('EAT_IN')}>
          <Text style={styles.buttonText} allowFontScaling={false}>매장 식사</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.orderButton} onPress={() => handleSelectOrderType('TAKE_OUT')}>
          <Text style={styles.buttonText} allowFontScaling={false}>포장 주문</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: '#FFF',
      // 🔴 [핵심] 안드로이드일 경우에만 상단 배터리바 높이만큼 강제로 여백을 줘서 겹침 방지!
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
    },
    topBar: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      paddingHorizontal: 15, 
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#EEE'
    },
    backButton: { 
      backgroundColor: '#374151', 
      paddingVertical: 8, 
      paddingHorizontal: 12, 
      borderRadius: 8,
      marginRight: 15 
    },
    backButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  
    titleContainer: { flex: 1, alignItems: 'flex-end' }, 
    titleText: { fontSize: width > 400 ? 28 : 24, fontWeight: 'bold', color: '#111' }, 
    subTitleText: { fontSize: width > 400 ? 18 : 14, color: '#666', marginTop: 2 },
    
    adContainer: { flex: 1, position: 'relative', backgroundColor: '#222' },
    adImage: { width: '100%', height: '100%' },
    
    adTextOverlay: { 
      position: 'absolute', 
      top: '30%', 
      left: '10%', 
      width: '80%', 
    },
    adLargeText: { 
      fontSize: width * 0.12, 
      fontWeight: '900', 
      color: '#FFF', 
      lineHeight: width * 0.13, 
      letterSpacing: -1, 
    },
  
    buttonContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: 20, 
        paddingTop: 20,
        paddingBottom: Platform.OS === 'android' ? 60 : 20, // 안드로이드는 40으로 밀어 올리고, iOS는 20 유지
        
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        backgroundColor: '#FFF'
      },
    orderButton: { 
      width: '48%', 
      backgroundColor: '#E11D48', 
      paddingVertical: 25, 
      borderRadius: 15, 
      alignItems: 'center',
      
      // 🔴 [핵심] 그림자 효과 크로스 플랫폼 최적화
      // iOS용 그림자
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 4 }, 
      shadowOpacity: 0.25, 
      shadowRadius: 5, 
      // Android용 그림자 (이게 없으면 갤럭시에선 버튼이 완전 납작해짐)
      elevation: 8 
    },
    buttonText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  });