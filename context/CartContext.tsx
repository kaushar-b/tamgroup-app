import { createContext, useContext, useState, ReactNode } from 'react';

const MENU_ITEMS = [
  { id: '1', name: 'Grilled Chicken Burger', category: 'Mains', price: 85, icon: 'fast-food', description: 'Juicy grilled chicken with fresh lettuce and house sauce' },
  { id: '2', name: 'Beef Burger', category: 'Mains', price: 90, icon: 'fast-food', description: 'Classic beef patty with cheese and pickles' },
  { id: '3', name: 'Chicken Wings', category: 'Starters', price: 65, icon: 'restaurant', description: '6 crispy wings with your choice of sauce' },
  { id: '4', name: 'Loaded Fries', category: 'Sides', price: 45, icon: 'restaurant', description: 'Crispy fries topped with cheese and jalapenos' },
  { id: '5', name: 'Caesar Salad', category: 'Starters', price: 55, icon: 'leaf', description: 'Fresh romaine, croutons, parmesan and caesar dressing' },
  { id: '6', name: 'Grilled Steak', category: 'Mains', price: 160, icon: 'restaurant', description: '200g sirloin steak cooked to your liking' },
  { id: '7', name: 'Coca Cola', category: 'Drinks', price: 20, icon: 'wine', description: '330ml can' },
  { id: '8', name: 'Chocolate Cake', category: 'Desserts', price: 40, icon: 'cafe', description: 'Rich chocolate cake with cream' },
  { id: '9', name: 'Onion Rings', category: 'Sides', price: 35, icon: 'restaurant', description: 'Golden crispy onion rings' },
  { id: '10', name: 'Fruit Juice', category: 'Drinks', price: 25, icon: 'wine', description: 'Fresh orange or apple juice' },
];

export type CartItem = { id: string; name: string; price: number; icon: string; quantity: number; };

type CartContextType = {
  items: CartItem[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (id: string) => {
    const menuItem = MENU_ITEMS.find(m => m.id === id);
    if (!menuItem) return;
    setItems(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id, name: menuItem.name, price: menuItem.price, icon: menuItem.icon, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export { MENU_ITEMS };
