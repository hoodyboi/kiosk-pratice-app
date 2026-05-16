import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 화면 전체 크기를 가져와서 버튼 비율을 동적으로 맞춥니다.
const { width } = Dimensions.get('window');

export default function HomeScreen() {
  // 2. 네비게이션 객체 가져오기
  const navigation = useNavigation<any>(); 

  const handleSelectType = (type: 'EAT_IN' | 'TAKE_OUT') => {
    console.log(`${type} 선택됨!`);
    // 3. 버튼 누르면 'Menu' 화면으로 이동!
    navigation.navigate('Menu'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 타이틀 영역 */}
      <View style={styles.header}>
        <Text style={styles.title}>주문하시려면</Text>
        <Text style={styles.title}>원하시는 버튼을</Text>
        <Text style={styles.titleHighlight}>눌러주세요</Text>
      </View>

      {/* 버튼 영역 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.eatInButton]} 
          onPress={() => handleSelectType('EAT_IN')}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>매장에서 식사</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.takeOutButton]} 
          onPress={() => handleSelectType('TAKE_OUT')}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>테이크 아웃</Text>
          <Text style={styles.subText}>(포장)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // 눈이 편안한 밝은 회색 배경
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 32, // 어르신 타겟: 최소 30 이상
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  titleHighlight: {
    fontSize: 36,
    fontWeight: '900',
    color: '#E11D48', // 시선을 끄는 붉은색 포인트
    marginTop: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 30, // 버튼 사이 간격 넓게
  },
  button: {
    width: width - 40,
    height: 180, // 압도적으로 큰 터치 영역 확보
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // 안드로이드 그림자
    shadowColor: '#000', // iOS 그림자
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  eatInButton: {
    backgroundColor: '#DC2626', // 맥도날드 스타일 레드
  },
  takeOutButton: {
    backgroundColor: '#16A34A', // 직관적인 그린
  },
  buttonText: {
    fontSize: 40, // 매우 큰 텍스트
    fontWeight: '900',
    color: '#FFFFFF',
  },
  subText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 10,
  },
});