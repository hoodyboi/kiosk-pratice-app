import { create } from 'zustand';

// 1. 메뉴 데이터 구조에 수량(quantity) 필드 강제 주입
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  quantity: number; // 🔴 각 품목별 담긴 개수
}

export type OrderType = '매장 식사' | '포장 주문' | null;

interface CartState {
  cartItems: MenuItem[];
  totalPrice: number;
  orderType: OrderType;

  addMenu: (menu: Omit<MenuItem, 'quantity'>) => void;      // 담기 (수량 없이 들어와도 처리되도록 설정)
  removeMenu: (id: string) => void;                         // 수량 1개 감소 또는 품목 삭제
  clearCart: () => void;                                    // 장바구니 전체 비우기
  setOrderType: (type: OrderType) => void;                  // 주문 타입 변경
}

export const useCartStore = create<CartState>()((set) => ({
  cartItems: [],
  totalPrice: 0,
  orderType: null,

  // 🔴 [Add Action] 이미 장바구니에 있는 아이템이면 수량만 +1, 없으면 새로 추가
  addMenu: (menu) => set((state) => {
    const existingItemIndex = state.cartItems.findIndex(item => item.id === menu.id);
    let newCartItems = [...state.cartItems];

    if (existingItemIndex > -1) {
      // 이미 존재하는 아이템인 경우: 깊은 복사 후 해당 항목의 수량만 증가
      const existingItem = newCartItems[existingItemIndex];
      newCartItems[existingItemIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + 1
      };
    } else {
      // 처음 담는 아이템인 경우: 수량을 1로 세팅해서 배열에 추가
      newCartItems.push({ ...menu, quantity: 1 });
    }

    return {
      cartItems: newCartItems,
      totalPrice: state.totalPrice + menu.price,
    };
  }),

  // 🔴 [Remove Action] 수량을 1개 줄이되, 0개가 되면 배열에서 아예 썰어버림
  removeMenu: (id) => set((state) => {
    const itemIndex = state.cartItems.findIndex(item => item.id === id);
    if (itemIndex === -1) return state; // 예외 방어 로직

    const targetItem = state.cartItems[itemIndex];
    let newCartItems = [...state.cartItems];

    if (targetItem.quantity > 1) {
      // 수량이 2개 이상이면 1개만 차감
      newCartItems[itemIndex] = {
        ...targetItem,
        quantity: targetItem.quantity - 1
      };
    } else {
      // 수량이 1개였으면 장바구니에서 완전히 제거 (Splice 트랜잭션)
      newCartItems.splice(itemIndex, 1);
    }

    return {
      cartItems: newCartItems,
      totalPrice: state.totalPrice - targetItem.price,
    };
  }),

  clearCart: () => set({ cartItems: [], totalPrice: 0, orderType: null }),

  setOrderType: (type) => set({ orderType: type }),
}));