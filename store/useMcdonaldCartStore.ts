import { create } from 'zustand';

// 1. 타입 이름에 Mcdonald 접두사 추가
export interface McdonaldMenuItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface McdonaldCartState {
  cartItems: McdonaldMenuItem[];
  totalPrice: number;
  addMenu: (menu: Omit<McdonaldMenuItem, 'quantity'>) => void;
  removeMenu: (id: string) => void;
  clearCart: () => void;
}

// 2. 훅(Hook) 이름도 useMcdonaldCartStore로 변경
export const useMcdonaldCartStore = create<McdonaldCartState>()((set) => ({
  cartItems: [],
  totalPrice: 0,

  addMenu: (menu) => set((state) => {
    const existingItemIndex = state.cartItems.findIndex(item => item.id === menu.id);
    let newCartItems = [...state.cartItems];

    if (existingItemIndex > -1) {
      const existingItem = newCartItems[existingItemIndex];
      newCartItems[existingItemIndex] = { ...existingItem, quantity: existingItem.quantity + 1 };
    } else {
      newCartItems.push({ ...menu, quantity: 1 });
    }
    return { cartItems: newCartItems, totalPrice: state.totalPrice + menu.price };
  }),

  removeMenu: (id) => set((state) => {
    const itemIndex = state.cartItems.findIndex(item => item.id === id);
    if (itemIndex === -1) return state;

    const targetItem = state.cartItems[itemIndex];
    let newCartItems = [...state.cartItems];

    if (targetItem.quantity > 1) {
      newCartItems[itemIndex] = { ...targetItem, quantity: targetItem.quantity - 1 };
    } else {
      newCartItems.splice(itemIndex, 1);
    }
    return { cartItems: newCartItems, totalPrice: state.totalPrice - targetItem.price };
  }),

  clearCart: () => set({ cartItems: [], totalPrice: 0 }),
}));