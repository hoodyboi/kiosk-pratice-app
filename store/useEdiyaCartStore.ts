import { create } from 'zustand';

// 이디야 전용 옵션 타입 정의
export interface EdiyaOptions {
    temp: 'HOT' | 'ICED';
    size : 'L' | 'EX';
}

// 이디야 메뉴 DTO (옵션 필드 추가)
export interface EdiyaMenuItem {
    id: string;
    cartId: string;
    name: string;
    price: number;
    quantity: number;
    options: EdiyaOptions;
}

export type EdiyaOrderType = '매장에서 먹어요' | '포장해서 갈래요' | null;

interface EdiyaCartState {
    cartItems: EdiyaMenuItem[];
    totalPrice: number;
    orderType: EdiyaOrderType;
    addMenu: (menu: Omit<EdiyaMenuItem, 'quantity'>) => void;
    removeMenu: (cartId: string) => void;
    clearCart: () => void;
    setOrderType: (type: EdiyaOrderType) => void;
}

export const useEdiyaCartStore = create<EdiyaCartState>()((set) => ({
    cartItems: [],
    totalPrice: 0,
    orderType: null,

    addMenu: (menu) => set((state) => {
        const existingItemIndex = state.cartItems.findIndex(item => item.cartId === menu.cartId);
        let newCartItems = [...state.cartItems];

        if (existingItemIndex > -1) {
            const existingItem = newCartItems[existingItemIndex];
            newCartItems[existingItemIndex] = { ...existingItem, quantity: existingItem.quantity + 1 };
        } else {
            newCartItems.push({ ...menu, quantity: 1});
        }
        return { cartItems: newCartItems, totalPrice: state.totalPrice + menu.price};
    }),

    removeMenu: (cartId) => set((state) => {
        const itemIndex = state.cartItems.findIndex(item => item.cartId === cartId);
        if(itemIndex === -1) return state;

        const targetItem = state.cartItems[itemIndex];
        let newCartItems = [...state.cartItems];

        if (targetItem.quantity > 1) {
            newCartItems[itemIndex] = { ...targetItem, quantity: targetItem.quantity - 1};
        } else {
            newCartItems.splice(itemIndex, 1);
        }
        return { cartItems: newCartItems, totalPrice: state.totalPrice - targetItem.price };
    }),

    clearCart: () => set({ cartItems: [], totalPrice: 0, orderType: null}),
    setOrderType: (type) => set({ orderType: type}),
}));