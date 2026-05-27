import { create } from 'zustand';



export interface KFCMenuItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export type KFCOrderType = '매장 식사' | '포장 주문' | null;

interface KFCCartState {
    cartItems: KFCMenuItem[];
    totalPrice: number;
    orderType: KFCOrderType;
    addMenu: (menu: Omit<KFCMenuItem, 'quantity'>) => void;
    removeMenu: (id: string) => void;
    clearCart: () => void;
    setOrderType: (type: KFCOrderType) => void;
}

export const useKFCCartStore = create<KFCCartState>()((set) => ({
    cartItems: [],
    totalPrice: 0,
    orderType: null,

    addMenu: (menu) => set((state) => {
        const existingItemIndex = state.cartItems.findIndex(item => item.id === menu.id);
        let newCartItems = [...state.cartItems];

        if(existingItemIndex > -1) {
            const existingItem = newCartItems[existingItemIndex];
            newCartItems[existingItemIndex] = { ...existingItem, quantity:existingItem.quantity + 1};
        } else {
            newCartItems.push({ ...menu, quantity:1});
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
    
      clearCart: () => set({ cartItems: [], totalPrice: 0, orderType: null }),
      setOrderType: (type) => set({ orderType: type }),
}))