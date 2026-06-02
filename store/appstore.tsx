import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  product: any;
  quantity: number;
}

interface AppState {
  cart: CartItem[];
  selectedClient: any | null;
  notifications: Array<{id: string, type: 'success'|'error'|'info', message: string}>;
  
  setClient: (client: any) => void;
  addToCart: (product: any) => void;
  updateQty: (sku: string, delta: number) => void;
  removeItem: (sku: string) => void;
  clearCart: () => void;
  addNotification: (type: 'success'|'error'|'info', message: string) => void;
  
  get subtotal(): number;
  get total(): number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      selectedClient: null,
      notifications: [],

      setClient: (client) => set({ selectedClient: client }),

      addToCart: (product) => set((state) => {
        const existing = state.cart.find((item) => item.product.sku === product.sku);
        if (existing) {
          return {
            cart: state.cart.map((item) =>
              item.product.sku === product.sku
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        }
        return { cart: [...state.cart, { product, quantity: 1 }] };
      }),

      updateQty: (sku, delta) => set((state) => ({
        cart: state.cart.map(item => {
          if (item.product.sku === sku) {
            const newQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        }),
      })),

      removeItem: (sku) => set((state) => ({
        cart: state.cart.filter(item => item.product.sku !== sku),
      })),

      clearCart: () => set({ cart: [], selectedClient: null }),

      addNotification: (type, message) => set((state) => ({
        notifications: [...state.notifications, { id: Date.now().toString(), type, message }]
      })),

      get subtotal() {
        return get().cart.reduce((sum, item) => sum + (item.product.salePrice * item.quantity), 0);
      },

      get total() {
        return get().subtotal;
      },
    }),
    { name: 'rapel-app-storage' }
  )
);