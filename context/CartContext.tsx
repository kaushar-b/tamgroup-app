import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const FALLBACK_ITEMS = [
  {
    id: '1',
    name: 'Tomato & Basil Bruschetta',
    category: 'Starters',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Toasted bread topped with fresh tomato and basil — add your full description here.',
    details: 'Add your full detailed description here. This is the extended text shown when the product box is tapped.',
    images: [] as string[],
  },
  {
    id: '2',
    name: 'Coq au Vin - Braised Chicken',
    category: 'Mains',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Classic French braised chicken in red wine — add your full description here.',
    details: 'Add your full detailed description here. This is the extended text shown when the product box is tapped.',
    images: [] as string[],
  },
  {
    id: '3',
    name: 'Stuffed Vegetables - Gemista Style',
    category: 'Mains',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Mediterranean stuffed vegetables baked to perfection — add your full description here.',
    details: 'Add your full detailed description here. This is the extended text shown when the product box is tapped.',
    images: [] as string[],
  },
  {
    id: '4',
    name: 'Beef Bourguignon (Rich Beef Stew)',
    category: 'Mains',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Slow-cooked rich beef stew in Burgundy wine — add your full description here.',
    details: 'Add your full detailed description here. This is the extended text shown when the product box is tapped.',
    images: [] as string[],
  },
  {
    id: '5',
    name: 'Dish Five',
    category: 'Mains',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Add your short description here — shown on the product card.',
    details: 'Add your full detailed description here. This is the extended text shown when the product box is tapped.',
    images: [] as string[],
  },
  {
    id: '6',
    name: 'Dish Six',
    category: 'Mains',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Add your short description here — shown on the product card.',
    details: 'Add your full detailed description here. This is the extended text shown when the product box is tapped.',
    images: [] as string[],
  },
  {
    id: '7',
    name: 'Dish Seven',
    category: 'Mains',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Add your short description here — shown on the product card.',
    details: 'Add your full detailed description here. This is the extended text shown when the product box is tapped.',
    images: [] as string[],
  },
  {
    id: '8',
    name: 'Dish Eight',
    category: 'Mains',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Add your short description here — shown on the product card.',
    details: 'Add your full detailed description here. This is the extended text shown when the product box is tapped.',
    images: [] as string[],
  },
  {
    id: '9',
    name: 'Dish Nine',
    category: 'Mains',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Add your short description here — shown on the product card.',
    details: 'Add your full detailed description here. This is the extended text shown when the product box is tapped.',
    images: [] as string[],
  },
  {
    id: '10',
    name: 'Dish Ten',
    category: 'Mains',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Add your short description here — shown on the product card.',
    details: 'Add your full detailed description here. This is the extended text shown when the product box is tapped.',
    images: [] as string[],
  },
  {
    id: '11',
    name: 'Dish Eleven',
    category: 'Mains',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Add your short description here — shown on the product card.',
    details: 'Add your full detailed description here. This is the extended text shown when the product box is tapped.',
    images: [] as string[],
  },
];

export const BACKEND_URL = 'https://musical-barnacle-4j4xrx67vv6r35qqj-3000.app.github.dev';

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  was_price?: number | null;
  on_special?: boolean;
  icon: string;
  description: string;
  details: string;
  images: string[];
};

export type CartItem = { id: string; name: string; price: number; icon: string; quantity: number; };

type CartContextType = {
  items: CartItem[];
  menuItems: MenuItem[];
  menuLoading: boolean;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
  count: number;
  refreshMenu: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(FALLBACK_ITEMS as MenuItem[]);
  const [menuLoading, setMenuLoading] = useState(false);

  const addToCart = (id: string) => {
    const menuItem = menuItems.find(m => m.id === id);
    if (!menuItem) return;
    setItems(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing) return prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { id, name: menuItem.name, price: menuItem.price, icon: menuItem.icon, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.quantity > 1) return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      return prev.filter(i => i.id !== id);
    });
  };

  const clearCart = () => setItems([]);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, menuItems, menuLoading, addToCart, removeFromCart, clearCart, total, count, refreshMenu: () => {} }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export const MENU_ITEMS = FALLBACK_ITEMS as MenuItem[];
