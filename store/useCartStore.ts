// store/useCartStore.ts
import { create } from 'zustand';

// 1. 우리가 팔 메뉴의 데이터 구조 (자바의 DTO 역할)
export interface MenuItem {
  id: string;
  name: string;
  price: number;
}

// 2. 장바구니가 가져야 할 상태와 액션들 
interface CartState {
  cartItems: MenuItem[];        // 장바구니에 담긴 메뉴들
  totalPrice: number;           // 총 결제 금액
  addMenu: (menu: MenuItem) => void;    // 메뉴 담기 함수
  removeMenu: (id: string) => void;     // 메뉴 빼기 함수
  clearCart: () => void;                // 장바구니 전체 비우기 함수 (결제 완료 시 사용)
}

// 3. 실제 장바구니 상태 저장소 생성
export const useCartStore = create<CartState>()((set) => ({
  // 초기 상태
  cartItems: [],
  totalPrice: 0,

  // 메뉴를 장바구니에 담는 액션
  addMenu: (menu) => set((state) => ({
    cartItems: [...state.cartItems, menu],
    totalPrice: state.totalPrice + menu.price,
  })),

  // 메뉴를 장바구니에서 빼는 액션
  removeMenu: (id) => set((state) => {
    // 삭제하려는 아이템을 찾음 (가격 차감을 위해)
    const itemToRemove = state.cartItems.find(item => item.id === id);
    if (!itemToRemove) return state; // 없으면 그대로 리턴

    // 해당 아이템 하나만 제거 (filter 대신 인덱스 활용하여 중복 메뉴 처리)
    const itemIndex = state.cartItems.findIndex(item => item.id === id);
    const newCartItems = [...state.cartItems];
    newCartItems.splice(itemIndex, 1);

    return {
      cartItems: newCartItems,
      totalPrice: state.totalPrice - itemToRemove.price,
    };
  }),

  // 결제 끝나거나 초기화할 때 싹 비우는 액션
  clearCart: () => set({ cartItems: [], totalPrice: 0 }),
}));